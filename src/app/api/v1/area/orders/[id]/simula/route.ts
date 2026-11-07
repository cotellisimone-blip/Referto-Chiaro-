import { z } from "zod";
import { isUuid, readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { getOrder, markOrderCancelled, markOrderFailed, markOrderPaid } from "@/domain/orders/repository";

const Body = z.object({ esito: z.enum(["pagato", "fallito", "annullato"]) }).strict();

/** Esito di un pagamento SIMULATO. Rifiutato per qualsiasi altro fornitore: con Stripe l'esito arriva solo dal webhook firmato. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await readJson(req, 1_024);
  if ("response" in r) return r.response;
  const parsed = Body.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  const order = await getOrder(g.user.id, id);
  if (!order) return json({ error: "not-found" }, { status: 404 });
  if (order.provider !== "simulated") return json({ error: "not-simulated", message: "Questo ordine non è un pagamento simulato." }, { status: 409 });
  if (order.status !== "pending") return json({ error: "invalid-state", message: "L'ordine non è più in attesa di pagamento." }, { status: 409 });
  if (parsed.data.esito === "pagato") await markOrderPaid(id);
  else if (parsed.data.esito === "fallito") await markOrderFailed(id);
  else await markOrderCancelled(id);
  return json({ order: await getOrder(g.user.id, id) });
}

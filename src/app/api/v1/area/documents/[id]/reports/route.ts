import { z } from "zod";
import { isUuid, readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { createReport } from "@/domain/pipeline/repository";
import { listOrders } from "@/domain/orders/repository";

const Body = z.object({ service: z.enum(["essenziale", "completo"]) }).strict();

/**
 * (Ri)genera un report per un documento verificato. Richiede un ordine PAGATO per lo stesso
 * documento e servizio (simulato o Stripe): il percorso normale passa da /area/orders.
 */
export async function POST(req: Request, ctx: RouteContext<"/api/v1/area/documents/[id]/reports">) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await ctx.params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await readJson(req, 1_024);
  if ("response" in r) return r.response;
  const parsed = Body.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });
  const paid = (await listOrders(g.user.id)).some((o) => o.status === "paid" && o.documentId === id && o.service === parsed.data.service);
  if (!paid) return json({ error: "payment-required", message: "Serve un ordine pagato per questo servizio." }, { status: 402 });
  const reportId = await createReport(g.user.id, id, parsed.data.service);
  if (!reportId) return json({ error: "invalid-state", message: "Prima conferma i valori del documento." }, { status: 409 });
  return json({ id: reportId, status: "queued" }, { status: 201 });
}

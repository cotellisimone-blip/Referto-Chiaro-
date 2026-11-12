import { z } from "zod";
import { readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { openCheckout, providerOrResponse } from "@/lib/payments/checkout";
import { getDocument } from "@/domain/pipeline/repository";
import { createOrder, listOrders } from "@/domain/orders/repository";

const Body = z.object({ service: z.enum(["essenziale", "completo"]), documentId: z.uuid() }).strict();

export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  return json({ orders: await listOrders(g.user.id) });
}

/** Crea un ordine e il checkout del fornitore attivo (simulato in demo). Nessun addebito reale senza chiavi e gate. */
export async function POST(req: Request) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const r = await readJson(req, 1_024);
  if ("response" in r) return r.response;
  const parsed = Body.safeParse(r.body);
  if (!parsed.success) return json({ error: "invalid-request" }, { status: 400 });

  const pr = providerOrResponse();
  if ("response" in pr) return pr.response;
  const provider = pr.provider;

  const doc = await getDocument(g.user.id, parsed.data.documentId);
  if (!doc || !["verified", "ready"].includes(doc.status)) {
    return json({ error: "invalid-state", message: "Prima conferma i valori del documento." }, { status: 409 });
  }

  const order = await createOrder(g.user.id, { service: parsed.data.service, documentId: doc.id, provider: provider.kind });
  const c = await openCheckout(req, g.user.id, provider, order);
  if ("response" in c) return c.response;
  return json({ id: order.id, checkoutUrl: c.checkoutUrl, provider: provider.kind }, { status: 201 });
}


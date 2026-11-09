import { isUuid, requireUser } from "@/lib/auth/guard";
import { getCase } from "@/domain/cases/repository";
import { createServiceOrder } from "@/domain/orders/repository";
import { openCheckout, providerOrResponse } from "@/lib/payments/checkout";
import { json } from "@/lib/api";

/** Nuovo tentativo di pagamento per una richiesta di secondo parere non ancora pagata. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await getCase(g.user.id, id);
  if (!r) return json({ error: "not-found", message: "Richiesta non trovata." }, { status: 404 });
  if (!r.case.awaitingPayment || r.case.status !== "submitted") return json({ error: "invalid-state", message: "Questa richiesta non è in attesa di pagamento." }, { status: 409 });
  const pr = providerOrResponse();
  if ("response" in pr) return pr.response;
  const order = await createServiceOrder(g.user.id, { service: "secondo-parere", refId: id, documentIds: r.case.documentId ? [r.case.documentId] : [], provider: pr.provider.kind });
  const c = await openCheckout(req, g.user.id, pr.provider, order);
  if ("response" in c) return c.response;
  return json({ orderId: order.id, checkoutUrl: c.checkoutUrl }, { status: 201 });
}

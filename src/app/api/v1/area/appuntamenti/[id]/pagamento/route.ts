import { isUuid, requireUser } from "@/lib/auth/guard";
import { getAppointment } from "@/domain/appointments/repository";
import { createServiceOrder } from "@/domain/orders/repository";
import { openCheckout, providerOrResponse } from "@/lib/payments/checkout";
import { json } from "@/lib/api";

/** Pagamento di un videoconsulto confermato dal medico (o nuovo tentativo, se il primo non è andato). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const { id } = await params;
  if (!isUuid(id)) return json({ error: "not-found" }, { status: 404 });
  const r = await getAppointment(g.user.id, id);
  if (!r) return json({ error: "not-found", message: "Appuntamento non trovato." }, { status: 404 });
  // 27/11/2026 (fase 4): si paga solo dopo la conferma del medico.
  if (!r.appointment.awaitingPayment || r.appointment.status !== "confirmed") return json({ error: "invalid-state", message: r.appointment.status === "requested" ? "Il medico non ha ancora confermato: ora non paghi nulla." : "Questo appuntamento non è in attesa di pagamento." }, { status: 409 });
  const pr = providerOrResponse();
  if ("response" in pr) return pr.response;
  const order = await createServiceOrder(g.user.id, { service: "videoconsulto", refId: id, documentIds: r.appointment.documentIds, provider: pr.provider.kind });
  const c = await openCheckout(req, g.user.id, pr.provider, order);
  if ("response" in c) return c.response;
  return json({ orderId: order.id, checkoutUrl: c.checkoutUrl }, { status: 201 });
}

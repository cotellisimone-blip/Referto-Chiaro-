import { json } from "@/lib/api";
import { verifyStripeEvent } from "@/lib/payments/stripe";
import { isUuid } from "@/lib/auth/guard";
import { forgetPaymentEvent, markOrderCancelled, markOrderPaid, recordPaymentEvent } from "@/domain/orders/repository";

/**
 * Webhook Stripe (nessuna sessione): l'unica autorità è la firma. Senza STRIPE_WEBHOOK_SECRET o con firma
 * non valida risponde 400. Gli eventi sono idempotenti per id. Non si registrano email né dati di carta.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return json({ error: "invalid-signature" }, { status: 400 });
  const raw = await req.text();
  if (raw.length > 1_000_000) return json({ error: "payload-too-large" }, { status: 413 });

  let event;
  try {
    event = verifyStripeEvent(raw, signature, secret);
  } catch {
    return json({ error: "invalid-signature" }, { status: 400 });
  }

  const obj = event.data.object as { id?: string; metadata?: Record<string, string> | null; client_reference_id?: string | null };
  const candidate = obj.metadata?.orderId ?? obj.client_reference_id ?? null;
  const orderId = candidate && isUuid(candidate) ? candidate : null;

  const fresh = await recordPaymentEvent({ provider: "stripe", eventId: event.id, kind: event.type, orderId, payload: { type: event.type, orderId } });
  if (!fresh) return json({ received: true, duplicate: true });

  try {
    if (orderId) {
      if (event.type === "checkout.session.completed") {
        const paid = (event.data.object as { payment_status?: string }).payment_status;
        if (paid === "paid") await markOrderPaid(orderId, obj.id);
      } else if (event.type === "checkout.session.async_payment_succeeded") {
        await markOrderPaid(orderId, obj.id);
      } else if (event.type === "checkout.session.expired") {
        await markOrderCancelled(orderId);
      }
    }
  } catch {
    await forgetPaymentEvent(event.id);
    return json({ error: "processing-failed" }, { status: 500 });
  }
  return json({ received: true });
}

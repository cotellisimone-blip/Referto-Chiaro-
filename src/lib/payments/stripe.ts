import Stripe from "stripe";
import { SERVICES } from "@/domain/catalog";
import type { PaymentProvider } from "./types";

export function stripeProvider(secretKey: string, kind: "stripe-test" | "stripe-live"): PaymentProvider {
  const stripe = new Stripe(secretKey);
  return {
    kind,
    async createCheckout(order, { successUrl, cancelUrl }) {
      const name = SERVICES.find((s) => s.id === order.service)?.name ?? order.service;
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        client_reference_id: order.id,
        metadata: { orderId: order.id },
        line_items: [
          {
            quantity: 1,
            price_data: { currency: order.currency, unit_amount: order.amountCents, product_data: { name: `${name} — Referto Chiaro` } },
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      if (!session.url) throw new Error("Stripe non ha restituito un URL di checkout");
      return { checkoutUrl: session.url, providerRef: session.id };
    },
  };
}

/** Costruisce l'evento verificando la firma. Lancia se la firma non è valida. */
export function verifyStripeEvent(rawBody: string, signature: string, webhookSecret: string): Stripe.Event {
  return Stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}

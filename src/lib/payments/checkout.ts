import "server-only";
import { json } from "@/lib/api";
import { CapabilityDisabledError } from "@/lib/feature-flags";
import { getPaymentProvider, PaymentsMisconfiguredError, type PaymentProvider } from "@/lib/payments";
import { markOrderFailed, setProviderRef, type OrderRow } from "@/domain/orders/repository";

/** Fornitore di pagamento attivo, oppure la risposta 503 da restituire così com'è. */
export function providerOrResponse(): { provider: PaymentProvider } | { response: Response } {
  try {
    return { provider: getPaymentProvider() };
  } catch (e) {
    if (e instanceof CapabilityDisabledError || e instanceof PaymentsMisconfiguredError) {
      return { response: json({ error: "payments-misconfigured", message: "I pagamenti non sono disponibili in questo momento." }, { status: 503 }) };
    }
    throw e;
  }
}

/** Crea il checkout per un ordine già registrato. In caso di errore l'ordine diventa «fallito». */
export async function openCheckout(req: Request, userId: string, provider: PaymentProvider, order: OrderRow): Promise<{ checkoutUrl: string } | { response: Response }> {
  const base = (process.env.PUBLIC_BASE_URL?.trim() || new URL(req.url).origin).replace(/\/$/, "");
  try {
    const { checkoutUrl, providerRef } = await provider.createCheckout(order, {
      successUrl: `${base}/area-personale/ordini/${order.id}?esito=ok`,
      cancelUrl: `${base}/area-personale/ordini/${order.id}?esito=annullato`,
    });
    await setProviderRef(userId, order.id, providerRef);
    return { checkoutUrl };
  } catch {
    await markOrderFailed(order.id);
    return { response: json({ error: "checkout-failed", message: "Non è stato possibile avviare il pagamento. Riprova." }, { status: 502 }) };
  }
}

import { z } from "zod";
import { readJson, requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { CapabilityDisabledError } from "@/lib/feature-flags";
import { getPaymentProvider, PaymentsMisconfiguredError } from "@/lib/payments";
import { getDocument } from "@/domain/pipeline/repository";
import { createOrder, listOrders, markOrderFailed, setProviderRef } from "@/domain/orders/repository";

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

  let provider;
  try {
    provider = getPaymentProvider();
  } catch (e) {
    if (e instanceof CapabilityDisabledError || e instanceof PaymentsMisconfiguredError) {
      return json({ error: "payments-misconfigured", message: "I pagamenti non sono disponibili in questo momento." }, { status: 503 });
    }
    throw e;
  }

  const doc = await getDocument(g.user.id, parsed.data.documentId);
  if (!doc || !["verified", "ready"].includes(doc.status)) {
    return json({ error: "invalid-state", message: "Prima conferma i valori del documento." }, { status: 409 });
  }

  const order = await createOrder(g.user.id, { service: parsed.data.service, documentId: doc.id, provider: provider.kind });
  const base = (process.env.PUBLIC_BASE_URL?.trim() || new URL(req.url).origin).replace(/\/$/, "");
  try {
    const { checkoutUrl, providerRef } = await provider.createCheckout(order, {
      successUrl: `${base}/area/ordini/${order.id}?esito=ok`,
      cancelUrl: `${base}/area/ordini/${order.id}?esito=annullato`,
    });
    await setProviderRef(g.user.id, order.id, providerRef);
    return json({ id: order.id, checkoutUrl, provider: provider.kind }, { status: 201 });
  } catch {
    await markOrderFailed(order.id);
    return json({ error: "checkout-failed", message: "Non è stato possibile avviare il pagamento. Riprova." }, { status: 502 });
  }
}


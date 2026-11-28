import "server-only";
import { SERVICES } from "@/domain/catalog";
import { capisciPriceCents, firstPromoEnabled, orderAmountCents, serviceForOrder, upgradeEnabled } from "@/domain/offerta";
import { FIRST_REFERTO, claimFirstReferto, isFirstRefertoEligible } from "./promo";
import { orderPaidEmail, publicUrl, sendEmail } from "@/lib/email";
import { randomUUID } from "node:crypto";
import { audit, withSystem, withUser, type Queryable } from "@/db/client";
import { createReportIn } from "@/domain/pipeline/repository";
import type { ProviderKind } from "@/lib/payments/types";

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";
export type OrderService = "essenziale" | "completo" | "secondo-parere" | "videoconsulto";

export interface OrderRow {
  id: string;
  service: OrderService;
  documentId: string | null;
  /** Caso di secondo parere o appuntamento a cui l'ordine si riferisce. */
  refId: string | null;
  amountCents: number;
  currency: string;
  status: OrderStatus;
  provider: ProviderKind;
  createdAt: string;
  paidAt: string | null;
  /** Promozione applicata (es. «primo-referto»), se c'è. */
  promo: string | null;
}

/** Prezzi in centesimi: unica fonte src/domain/offerta.ts (configurabile da variabili d'ambiente). */
export const PRICE_CENTS: Record<"essenziale" | "completo", number> = { essenziale: orderAmountCents("essenziale"), completo: orderAmountCents("completo") };

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

function toOrder(r: Record<string, unknown>): OrderRow {
  return {
    id: String(r.id),
    service: r.service as OrderService,
    documentId: (r.document_id as string | null) ?? null,
    refId: (r.ref_id as string | null) ?? null,
    amountCents: Number(r.amount_cents),
    currency: String(r.currency),
    status: r.status as OrderStatus,
    provider: r.provider as ProviderKind,
    createdAt: iso(r.created_at)!,
    paidAt: iso(r.paid_at),
    promo: (r.promo as string | null) ?? null,
  };
}

/** Quanto pagherà questo cliente per «Capisci il tuo referto» adesso (primo referto in promozione o prezzo standard). */
export async function quoteCapisci(userId: string): Promise<{ amountCents: number; first: boolean }> {
  const first = firstPromoEnabled() && (await withSystem((tx) => isFirstRefertoEligible(tx, userId)));
  return { amountCents: capisciPriceCents(first), first };
}

export async function createOrder(
  userId: string,
  input: { service: "essenziale" | "completo"; documentId: string; provider: ProviderKind },
): Promise<OrderRow> {
  // Il prezzo lo decide sempre il server: il client non può chiedere la promozione.
  const quote = input.service === "essenziale" ? await quoteCapisci(userId) : { amountCents: PRICE_CENTS[input.service], first: false };
  return withUser(userId, async (tx) => {
    const id = randomUUID();
    const r = await tx.query(
      "INSERT INTO orders(id, user_id, service, document_id, amount_cents, currency, status, provider, promo) VALUES ($1, $2, $3, $4, $5, 'eur', 'pending', $6, $7) RETURNING *",
      [id, userId, input.service, input.documentId, quote.amountCents, input.provider, quote.first ? FIRST_REFERTO : null],
    );
    await audit(tx, { userId, actor: "user", action: "order-created", target: id });
    return toOrder(r.rows[0]);
  });
}

/**
 * Ordine per un caso di secondo parere o un videoconsulto. L'importo viene dall'offerta (src/domain/offerta.ts).
 * Upgrade: se il gate commerciale è acceso e l'utente ha già pagato «Capisci» per uno dei documenti condivisi,
 * paga solo la differenza. Nessun dato già fornito viene richiesto di nuovo.
 */
export async function createServiceOrder(
  userId: string,
  input: { service: "secondo-parere" | "videoconsulto"; refId: string; documentIds: string[]; provider: ProviderKind },
): Promise<OrderRow> {
  return withUser(userId, async (tx) => {
    let amount = orderAmountCents(input.service);
    if (upgradeEnabled() && input.service === "videoconsulto" && input.documentIds.length) {
      const paid = await tx.query("SELECT amount_cents FROM orders WHERE status = 'paid' AND service = 'essenziale' AND document_id = ANY($1::uuid[]) ORDER BY paid_at DESC LIMIT 1", [input.documentIds]);
      if (paid.rows[0]) amount = Math.max(0, amount - Number(paid.rows[0].amount_cents));
    }
    const id = randomUUID();
    const r = await tx.query(
      "INSERT INTO orders(id, user_id, service, document_id, ref_id, amount_cents, currency, status, provider) VALUES ($1, $2, $3, NULL, $4, $5, 'eur', 'pending', $6) RETURNING *",
      [id, userId, input.service, input.refId, amount, input.provider],
    );
    await audit(tx, { userId, actor: "user", action: "order-created", target: id });
    return toOrder(r.rows[0]);
  });
}

/** Ultimo ordine collegato a un caso o appuntamento (per mostrare stato e «riprova»). */
export async function getOrderForRef(userId: string, refId: string): Promise<OrderRow | null> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM orders WHERE ref_id = $1 ORDER BY created_at DESC LIMIT 1", [refId]);
    return r.rows[0] ? toOrder(r.rows[0]) : null;
  });
}

/**
 * Il medico non accetta un caso già pagato: un pagamento simulato diventa «rimborsato»; per un pagamento
 * reale si registra la necessità di rimborso, che l'amministrazione esegue dal fornitore.
 */
export async function refundForRef(refId: string, actorUserId: string): Promise<void> {
  await withSystem(async (tx) => {
    const r = await tx.query<{ id: string; provider: string }>("SELECT id, provider FROM orders WHERE ref_id = $1 AND status = 'paid'", [refId]);
    for (const o of r.rows) {
      if (o.provider === "simulated") await tx.query("UPDATE orders SET status = 'refunded', updated_at = now() WHERE id = $1", [o.id]);
      await audit(tx, { userId: actorUserId, actor: "system", action: o.provider === "simulated" ? "order-refunded" : "order-refund-required", target: o.id });
    }
  });
}

export async function setProviderRef(userId: string, orderId: string, providerRef: string): Promise<void> {
  await withUser(userId, (tx) => tx.query("UPDATE orders SET provider_ref = $1, updated_at = now() WHERE id = $2", [providerRef, orderId]));
}

export async function getOrder(userId: string, id: string): Promise<OrderRow | null> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM orders WHERE id = $1", [id]);
    return r.rows[0] ? toOrder(r.rows[0]) : null;
  });
}

export async function listOrders(userId: string): Promise<OrderRow[]> {
  return withUser(userId, async (tx) => (await tx.query("SELECT * FROM orders ORDER BY created_at DESC")).rows.map(toOrder));
}

/**
 * Pending → paid, una sola volta (idempotente). Senza contesto utente (webhook): withSystem.
 * Dopo il pagamento mette in coda la generazione del report, se l'ordine ha un documento.
 * Ritorna true solo se questa chiamata ha cambiato lo stato.
 */
export async function markOrderPaid(orderId: string, providerRef?: string): Promise<boolean> {
  const row = await withSystem(async (tx) => {
    const r = await tx.query<{ user_id: string; service: OrderService; document_id: string | null; ref_id: string | null; amount_cents: number; promo: string | null; email?: string }>(
      "UPDATE orders SET status = 'paid', paid_at = now(), updated_at = now(), provider_ref = COALESCE($2, provider_ref) WHERE id = $1 AND status = 'pending' RETURNING user_id, service, document_id, ref_id, amount_cents, promo, (SELECT email FROM users WHERE users.id = orders.user_id) AS email",
      [orderId, providerRef ?? null],
    );
    if (!r.rows[0]) return null;
    await audit(tx, { userId: r.rows[0].user_id, actor: "system", action: "order-paid", target: orderId });
    if (r.rows[0].promo === FIRST_REFERTO) await claimFirstReferto(tx, r.rows[0].user_id, orderId);
    // Stessa transazione: se la richiesta del report fallisce, l'ordine non resta «pagato» senza report.
    if (r.rows[0].document_id && (r.rows[0].service === "essenziale" || r.rows[0].service === "completo")) {
      await createReportIn(tx, r.rows[0].user_id, r.rows[0].document_id, r.rows[0].service);
    }
    // Pagato: il caso o l'appuntamento diventa visibile al medico assegnato.
    if (r.rows[0].ref_id && r.rows[0].service === "secondo-parere") {
      await tx.query("UPDATE cases SET awaiting_payment = false, updated_at = now() WHERE id = $1 AND user_id = $2", [r.rows[0].ref_id, r.rows[0].user_id]);
      await tx.query("INSERT INTO case_events(id, case_id, actor_user_id, kind, detail) VALUES ($1, $2, NULL, 'paid', 'Pagamento registrato: la richiesta è stata inviata al medico.')", [randomUUID(), r.rows[0].ref_id]);
    }
    if (r.rows[0].ref_id && r.rows[0].service === "videoconsulto") {
      await tx.query("UPDATE appointments SET awaiting_payment = false, updated_at = now() WHERE id = $1 AND user_id = $2", [r.rows[0].ref_id, r.rows[0].user_id]);
    }
    return r.rows[0];
  });
  if (row?.email && !String(row.email).endsWith(".invalid")) {
    const name = serviceForOrder(row.service)?.name ?? SERVICES.find((x) => x.id === row.service)?.name ?? row.service;
    const amount = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(Number(row.amount_cents) / 100);
    await sendEmail(orderPaidEmail(String(row.email), publicUrl(`/area-personale/ordini/${orderId}`), name, amount));
  }
  return Boolean(row);
}

async function transitionPending(orderId: string, to: "failed" | "cancelled", action: string): Promise<boolean> {
  return withSystem(async (tx: Queryable) => {
    const r = await tx.query<{ user_id: string }>("UPDATE orders SET status = $2, updated_at = now() WHERE id = $1 AND status = 'pending' RETURNING user_id", [orderId, to]);
    if (!r.rows[0]) return false;
    await audit(tx, { userId: r.rows[0].user_id, actor: "system", action, target: orderId });
    return true;
  });
}

export const markOrderFailed = (orderId: string) => transitionPending(orderId, "failed", "order-failed");
export const markOrderCancelled = (orderId: string) => transitionPending(orderId, "cancelled", "order-cancelled");

/** Registra un evento del fornitore. Ritorna false se già visto (idempotenza per id evento). */
export async function recordPaymentEvent(e: { provider: string; eventId: string; kind: string; orderId: string | null; payload: unknown }): Promise<boolean> {
  return withSystem(async (tx) => {
    const orderId = e.orderId && (await tx.query("SELECT 1 FROM orders WHERE id = $1", [e.orderId])).rows.length ? e.orderId : null;
    const r = await tx.query(
      "INSERT INTO payment_events(id, provider, provider_event_id, kind, order_id, payload) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (provider_event_id) DO NOTHING",
      [randomUUID(), e.provider, e.eventId, e.kind, orderId, JSON.stringify(e.payload ?? null)],
    );
    return r.rowCount > 0;
  });
}

/** Toglie un evento registrato quando la sua elaborazione è fallita, così il nuovo invio del fornitore viene rielaborato. */
export async function forgetPaymentEvent(eventId: string): Promise<void> {
  await withSystem((tx) => tx.query("DELETE FROM payment_events WHERE provider_event_id = $1", [eventId]));
}

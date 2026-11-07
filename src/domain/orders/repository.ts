import "server-only";
import { randomUUID } from "node:crypto";
import { audit, withSystem, withUser, type Queryable } from "@/db/client";
import { createReportIn } from "@/domain/pipeline/repository";
import type { ProviderKind } from "@/lib/payments/types";

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";
export type OrderService = "essenziale" | "completo" | "secondo-parere";

export interface OrderRow {
  id: string;
  service: OrderService;
  documentId: string | null;
  amountCents: number;
  currency: string;
  status: OrderStatus;
  provider: ProviderKind;
  createdAt: string;
  paidAt: string | null;
}

/** Prezzi in centesimi, coerenti con il catalogo (priceLabel). Ipotesi da validare. */
export const PRICE_CENTS: Record<"essenziale" | "completo", number> = { essenziale: 990, completo: 2490 };

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

function toOrder(r: Record<string, unknown>): OrderRow {
  return {
    id: String(r.id),
    service: r.service as OrderService,
    documentId: (r.document_id as string | null) ?? null,
    amountCents: Number(r.amount_cents),
    currency: String(r.currency),
    status: r.status as OrderStatus,
    provider: r.provider as ProviderKind,
    createdAt: iso(r.created_at)!,
    paidAt: iso(r.paid_at),
  };
}

export async function createOrder(
  userId: string,
  input: { service: "essenziale" | "completo"; documentId: string; provider: ProviderKind },
): Promise<OrderRow> {
  return withUser(userId, async (tx) => {
    const id = randomUUID();
    const r = await tx.query(
      "INSERT INTO orders(id, user_id, service, document_id, amount_cents, currency, status, provider) VALUES ($1, $2, $3, $4, $5, 'eur', 'pending', $6) RETURNING *",
      [id, userId, input.service, input.documentId, PRICE_CENTS[input.service], input.provider],
    );
    await audit(tx, { userId, actor: "user", action: "order-created", target: id });
    return toOrder(r.rows[0]);
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
    const r = await tx.query<{ user_id: string; service: OrderService; document_id: string | null }>(
      "UPDATE orders SET status = 'paid', paid_at = now(), updated_at = now(), provider_ref = COALESCE($2, provider_ref) WHERE id = $1 AND status = 'pending' RETURNING user_id, service, document_id",
      [orderId, providerRef ?? null],
    );
    if (!r.rows[0]) return null;
    await audit(tx, { userId: r.rows[0].user_id, actor: "system", action: "order-paid", target: orderId });
    // Stessa transazione: se la richiesta del report fallisce, l'ordine non resta «pagato» senza report.
    if (r.rows[0].document_id && (r.rows[0].service === "essenziale" || r.rows[0].service === "completo")) {
      await createReportIn(tx, r.rows[0].user_id, r.rows[0].document_id, r.rows[0].service);
    }
    return r.rows[0];
  });
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

import "server-only";
import { createHash } from "node:crypto";
import type { Queryable } from "@/db/client";

/** Identificativo della promozione «primo referto» (orders.promo, promo_claims.promo). */
export const FIRST_REFERTO = "primo-referto";

/**
 * Email normalizzata per l'anti-abuso: minuscole, senza «+etichetta» e, per Gmail, senza punti.
 * Così «Mario.Rossi+2@gmail.com» e «mariorossi@googlemail.com» contano come lo stesso cliente.
 */
export function normalizeEmail(email: string): string {
  const [local0, domain0] = email.trim().toLowerCase().split("@");
  if (!domain0) return email.trim().toLowerCase();
  const domain = domain0 === "googlemail.com" ? "gmail.com" : domain0;
  let local = local0.split("+")[0];
  if (domain === "gmail.com") local = local.replaceAll(".", "");
  return `${local}@${domain}`;
}

/** Impronta non reversibile dell'email normalizzata (con sale facoltativo PROMO_SALT). */
export function emailHash(email: string, salt = process.env.PROMO_SALT ?? ""): string {
  return createHash("sha256").update(`${salt}|${normalizeEmail(email)}`).digest("hex");
}

/**
 * Il cliente ha diritto al primo referto in promozione? No se la sua impronta email ha già usato la promozione
 * o se ha già un referto «Capisci» pagato. Da chiamare in una transazione di sistema.
 */
export async function isFirstRefertoEligible(tx: Queryable, userId: string): Promise<boolean> {
  const u = await tx.query<{ email: string }>("SELECT email FROM users WHERE id = $1", [userId]);
  if (!u.rows[0]) return false;
  const claimed = await tx.query("SELECT 1 FROM promo_claims WHERE email_hash = $1 AND promo = $2", [emailHash(u.rows[0].email), FIRST_REFERTO]);
  if (claimed.rows.length) return false;
  const paid = await tx.query("SELECT 1 FROM orders WHERE user_id = $1 AND service = 'essenziale' AND status IN ('paid', 'refunded') LIMIT 1", [userId]);
  return paid.rows.length === 0;
}

/** Registra l'uso della promozione al pagamento. Idempotente. */
export async function claimFirstReferto(tx: Queryable, userId: string, orderId: string): Promise<void> {
  const u = await tx.query<{ email: string }>("SELECT email FROM users WHERE id = $1", [userId]);
  if (!u.rows[0]) return;
  await tx.query("INSERT INTO promo_claims(email_hash, promo, order_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING", [emailHash(u.rows[0].email), FIRST_REFERTO, orderId]);
}

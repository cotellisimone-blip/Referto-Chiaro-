import "server-only";
import { audit, withSystem } from "@/db/client";
import { readFlags } from "@/lib/feature-flags";
import { hashToken } from "./tokens";
import { openSecret, sealSecret, secretsAtRestEncrypted } from "./secret-box";
import { generateTotpSecret, totpMatchStep, totpUri } from "./totp";

/** Legge il segreto (cifrato o in chiaro) e il passo dell'ultimo codice accettato. */
async function loadSecret(tx: { query: (sql: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }> }, userId: string) {
  const r = await tx.query("SELECT mfa_secret, mfa_enabled_at, mfa_last_step, is_demo FROM users WHERE id = $1", [userId]);
  const row = r.rows[0];
  if (!row) return null;
  // Gli account dimostrativi (segreto mostrato a schermo, usati da più persone insieme) non hanno il controllo di riuso.
  const shared = Boolean(row.is_demo) && readFlags().demoMode;
  return { secret: row.mfa_secret ? openSecret(String(row.mfa_secret)) : null, enabledAt: row.mfa_enabled_at, lastStep: shared ? null : row.mfa_last_step == null ? null : Number(row.mfa_last_step) };
}

/** Codice valido e non ancora usato: aggiorna il passo e restituisce true. */
async function acceptCode(tx: { query: (sql: string, params?: unknown[]) => Promise<unknown> }, userId: string, s: { secret: string; lastStep: number | null }, code: string): Promise<boolean> {
  const step = totpMatchStep(s.secret, code);
  if (step === null || (s.lastStep !== null && step <= s.lastStep)) return false;
  // Si registra l'ultimo passo accettato: lo stesso codice non vale una seconda volta (RFC 6238 §5.2).
  await tx.query("UPDATE users SET mfa_last_step = $2 WHERE id = $1", [userId, step]);
  return true;
}

/**
 * Seconda verifica (TOTP) per medici e admin. Il segreto resta solo nel database;
 * la sessione corrente viene marcata come verificata, mai l'account in sé.
 */
export async function beginMfaSetup(userId: string, email: string): Promise<{ secret: string; uri: string }> {
  return withSystem(async (tx) => {
    const row = await loadSecret(tx, userId);
    if (!row) throw new Error("utente non trovato");
    // Con la 2FA già attiva non si rigenera il segreto da qui (servirebbe un flusso di recupero).
    if (row.enabledAt) throw new Error("mfa-already-enabled");
    // Fuori dalla demo il segreto va cifrato a riposo: senza chiave ci si ferma.
    if (!secretsAtRestEncrypted() && !readFlags().demoMode) throw new Error("mfa-key-missing");
    const secret = row.secret ?? generateTotpSecret();
    if (!row.secret) await tx.query("UPDATE users SET mfa_secret = $2 WHERE id = $1", [userId, sealSecret(secret)]);
    return { secret, uri: totpUri(secret, email) };
  });
}

export async function confirmMfaSetup(userId: string, sessionToken: string, code: string): Promise<boolean> {
  return withSystem(async (tx) => {
    const s = await loadSecret(tx, userId);
    if (!s?.secret || !(await acceptCode(tx, userId, { secret: s.secret, lastStep: s.lastStep }, code))) return false;
    await tx.query("UPDATE users SET mfa_enabled_at = COALESCE(mfa_enabled_at, now()) WHERE id = $1", [userId]);
    await tx.query("UPDATE sessions SET mfa_verified_at = now() WHERE token_hash = $1 AND user_id = $2", [hashToken(sessionToken), userId]);
    await audit(tx, { userId, actor: "user", action: "mfa-enabled" });
    return true;
  });
}

export async function verifyMfaForSession(userId: string, sessionToken: string, code: string): Promise<boolean> {
  return withSystem(async (tx) => {
    const s = await loadSecret(tx, userId);
    if (!s?.secret || !s.enabledAt || !(await acceptCode(tx, userId, { secret: s.secret, lastStep: s.lastStep }, code))) {
      await audit(tx, { userId, actor: "user", action: "mfa-failed" });
      return false;
    }
    await tx.query("UPDATE sessions SET mfa_verified_at = now() WHERE token_hash = $1 AND user_id = $2", [hashToken(sessionToken), userId]);
    await audit(tx, { userId, actor: "user", action: "mfa-verified" });
    return true;
  });
}

/** Solo in demo: il segreto dell'account dimostrativo, per mostrarlo a schermo. */
export async function demoMfaSecret(userId: string): Promise<string | null> {
  return withSystem(async (tx) => {
    const r = await tx.query("SELECT mfa_secret FROM users WHERE id = $1 AND is_demo = true", [userId]);
    return r.rows[0]?.mfa_secret ? openSecret(String(r.rows[0].mfa_secret)) : null;
  });
}

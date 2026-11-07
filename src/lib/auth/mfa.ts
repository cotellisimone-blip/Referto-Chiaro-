import "server-only";
import { audit, withSystem } from "@/db/client";
import { hashToken } from "./tokens";
import { generateTotpSecret, totpUri, verifyTotp } from "./totp";

/**
 * Seconda verifica (TOTP) per medici e admin. Il segreto resta solo nel database;
 * la sessione corrente viene marcata come verificata, mai l'account in sé.
 */
export async function beginMfaSetup(userId: string, email: string): Promise<{ secret: string; uri: string }> {
  return withSystem(async (tx) => {
    const r = await tx.query("SELECT mfa_secret, mfa_enabled_at FROM users WHERE id = $1", [userId]);
    const row = r.rows[0];
    if (!row) throw new Error("utente non trovato");
    // Con la 2FA già attiva non si rigenera il segreto da qui (servirebbe un flusso di recupero).
    if (row.mfa_enabled_at) throw new Error("mfa-already-enabled");
    const secret = (row.mfa_secret as string | null) ?? generateTotpSecret();
    if (!row.mfa_secret) await tx.query("UPDATE users SET mfa_secret = $2 WHERE id = $1", [userId, secret]);
    return { secret, uri: totpUri(secret, email) };
  });
}

export async function confirmMfaSetup(userId: string, sessionToken: string, code: string): Promise<boolean> {
  return withSystem(async (tx) => {
    const r = await tx.query("SELECT mfa_secret, mfa_enabled_at FROM users WHERE id = $1", [userId]);
    const secret = r.rows[0]?.mfa_secret as string | null;
    if (!secret || !verifyTotp(secret, code)) return false;
    await tx.query("UPDATE users SET mfa_enabled_at = COALESCE(mfa_enabled_at, now()) WHERE id = $1", [userId]);
    await tx.query("UPDATE sessions SET mfa_verified_at = now() WHERE token_hash = $1 AND user_id = $2", [hashToken(sessionToken), userId]);
    await audit(tx, { userId, actor: "user", action: "mfa-enabled" });
    return true;
  });
}

export async function verifyMfaForSession(userId: string, sessionToken: string, code: string): Promise<boolean> {
  return withSystem(async (tx) => {
    const r = await tx.query("SELECT mfa_secret, mfa_enabled_at FROM users WHERE id = $1", [userId]);
    const secret = r.rows[0]?.mfa_secret as string | null;
    if (!secret || !r.rows[0]?.mfa_enabled_at || !verifyTotp(secret, code)) {
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
    return (r.rows[0]?.mfa_secret as string | null) ?? null;
  });
}

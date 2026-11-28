import { createHash, randomBytes } from "node:crypto";

/** Token casuale (32 byte) in base64url; nel database si salva solo l'hash SHA-256. */
export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 giorni (utenti)
/** Medici e admin: sessioni brevi (12 ore), perché accedono a dati di altre persone. */
export const PRIVILEGED_SESSION_TTL_MS = 12 * 60 * 60 * 1000;
export const sessionTtlMs = (role: string) => (role === "physician" || role === "admin" ? PRIVILEGED_SESSION_TTL_MS : SESSION_TTL_MS);
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000; // 15 minuti
export const SESSION_COOKIE = "rc_session";

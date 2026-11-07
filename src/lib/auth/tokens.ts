import { createHash, randomBytes } from "node:crypto";

/** Token casuale (32 byte) in base64url; nel database si salva solo l'hash SHA-256. */
export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 giorni
export const MAGIC_LINK_TTL_MS = 15 * 60 * 1000; // 15 minuti
export const SESSION_COOKIE = "rc_session";

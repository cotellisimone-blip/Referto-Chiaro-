import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * Cifratura a riposo dei segreti TOTP (AES-256-GCM) con la chiave MFA_SECRET_KEY (64 caratteri esadecimali).
 * Senza chiave i segreti restano in chiaro: ammesso solo in demo (readFlags().demoMode), mai con dati reali.
 */
const PREFIX = "enc:v1:";

function key(env: Record<string, string | undefined>): Buffer | null {
  const hex = env.MFA_SECRET_KEY?.trim();
  if (!hex) return null;
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) throw new Error("MFA_SECRET_KEY deve essere di 64 caratteri esadecimali (32 byte).");
  return Buffer.from(hex, "hex");
}

export function sealSecret(plain: string, env: Record<string, string | undefined> = process.env): string {
  const k = key(env);
  if (!k) return plain;
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", k, iv);
  const body = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return `${PREFIX}${iv.toString("base64url")}.${c.getAuthTag().toString("base64url")}.${body.toString("base64url")}`;
}

export function openSecret(stored: string, env: Record<string, string | undefined> = process.env): string {
  if (!stored.startsWith(PREFIX)) return stored;
  const k = key(env);
  if (!k) throw new Error("Segreto cifrato ma MFA_SECRET_KEY non configurata.");
  const [iv, tag, body] = stored.slice(PREFIX.length).split(".");
  const d = createDecipheriv("aes-256-gcm", k, Buffer.from(iv, "base64url"));
  d.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([d.update(Buffer.from(body, "base64url")), d.final()]).toString("utf8");
}

export function secretsAtRestEncrypted(env: Record<string, string | undefined> = process.env): boolean {
  return key(env) !== null;
}

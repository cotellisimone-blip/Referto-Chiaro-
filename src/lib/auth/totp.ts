import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * TOTP (RFC 6238) con HMAC-SHA1, 6 cifre, 30 secondi: compatibile con le app di autenticazione
 * più diffuse. Nessuna dipendenza esterna: la verifica è deterministica e testabile.
 */
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buf: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

export function base32Decode(s: string): Uint8Array {
  const clean = s.toUpperCase().replace(/[^A-Z2-7]/g, "");
  const out: number[] = [];
  let bits = 0;
  let value = 0;
  for (const ch of clean) {
    value = (value << 5) | ALPHABET.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Uint8Array.from(out);
}

export function generateTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

export function totpCode(secret: string, time = Date.now(), step = 30, digits = 6): string {
  const counter = Math.floor(time / 1000 / step);
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const h = createHmac("sha1", Buffer.from(base32Decode(secret))).update(msg).digest();
  const offset = h[h.length - 1] & 0x0f;
  const bin = ((h[offset] & 0x7f) << 24) | (h[offset + 1] << 16) | (h[offset + 2] << 8) | h[offset + 3];
  return String(bin % 10 ** digits).padStart(digits, "0");
}

/** Accetta il codice corrente e quelli adiacenti (±1 finestra) per tollerare orologi non perfetti. */
export function verifyTotp(secret: string, code: string, time = Date.now(), window = 1): boolean {
  const given = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(given)) return false;
  for (let w = -window; w <= window; w++) {
    const expected = totpCode(secret, time + w * 30_000);
    if (expected.length === given.length && timingSafeEqual(Buffer.from(expected), Buffer.from(given))) return true;
  }
  return false;
}

/** URI otpauth:// da mostrare come QR o da copiare nell'app di autenticazione. */
export function totpUri(secret: string, account: string, issuer = "Referto Chiaro"): string {
  const label = encodeURIComponent(`${issuer}:${account}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
}

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * Cifratura dei file caricati (AES-256-GCM) con FILE_ENCRYPTION_KEY (64 caratteri esadecimali).
 * Nessun ripiego in chiaro: senza chiave il caricamento di file reali è impossibile.
 * Formato: [12 byte IV][16 byte tag][cifrato].
 */
type Env = Record<string, string | undefined>;

export class FileKeyMissingError extends Error {
  constructor() {
    super("FILE_ENCRYPTION_KEY mancante o non valida (servono 64 caratteri esadecimali).");
  }
}

export function fileKey(env: Env = process.env): Buffer {
  const hex = env.FILE_ENCRYPTION_KEY?.trim();
  if (!hex || !/^[0-9a-fA-F]{64}$/.test(hex)) throw new FileKeyMissingError();
  return Buffer.from(hex, "hex");
}

export function sealFile(plain: Uint8Array, env: Env = process.env): Buffer {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", fileKey(env), iv);
  const body = Buffer.concat([c.update(plain), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), body]);
}

export function openFile(sealed: Uint8Array, env: Env = process.env): Buffer {
  const b = Buffer.from(sealed);
  const d = createDecipheriv("aes-256-gcm", fileKey(env), b.subarray(0, 12));
  d.setAuthTag(b.subarray(12, 28));
  return Buffer.concat([d.update(b.subarray(28)), d.final()]);
}

import { createHash } from "node:crypto";
import type { Queryable } from "@/db/client";
import { openFile, sealFile } from "@/lib/crypto/file-box";
import type { AllowedMime } from "./validate";

/**
 * Archivio dei file caricati: nel database PostgreSQL stesso, cifrati con AES-256-GCM a livello applicativo
 * (chiave FILE_ENCRYPTION_KEY, mai nel database). Niente bucket esterno da configurare: un fornitore in meno
 * nel registro dei trattamenti. Limite 4 MB per file.
 */
export async function storeDocumentFile(tx: Queryable, args: { documentId: string; userId: string; bytes: Uint8Array; mimeType: AllowedMime }) {
  const sha256 = createHash("sha256").update(args.bytes).digest("hex");
  await tx.query("INSERT INTO document_files(document_id, user_id, mime_type, size_bytes, sha256, ciphertext) VALUES ($1, $2, $3, $4, $5, $6)", [
    args.documentId,
    args.userId,
    args.mimeType,
    args.bytes.length,
    sha256,
    sealFile(args.bytes),
  ]);
  return { sha256 };
}

export async function loadDocumentFile(tx: Queryable, documentId: string): Promise<{ bytes: Buffer; mimeType: AllowedMime } | null> {
  const r = await tx.query<{ mime_type: AllowedMime; ciphertext: Uint8Array }>("SELECT mime_type, ciphertext FROM document_files WHERE document_id = $1", [documentId]);
  const row = r.rows[0];
  if (!row) return null;
  return { bytes: openFile(row.ciphertext), mimeType: row.mime_type };
}

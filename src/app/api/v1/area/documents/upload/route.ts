import { randomUUID } from "node:crypto";
import { requireUser } from "@/lib/auth/guard";
import { capabilityError, json } from "@/lib/api";
import { hasHealthDataConsent } from "@/lib/auth/service";
import { CapabilityDisabledError } from "@/lib/feature-flags";
import { FileKeyMissingError } from "@/lib/crypto/file-box";
import { rateLimitShared } from "@/lib/rate-limit-shared";
import { audit, withUser } from "@/db/client";
import { assertUploadsReady } from "@/providers/registry";
import { checkUpload, MAX_UPLOAD_BYTES, safeTitle } from "@/providers/upload/validate";
import { storeDocumentFile } from "@/providers/upload/db-encrypted";
import { tickJobs } from "@/domain/pipeline/worker";

/**
 * Caricamento di un referto reale (PDF o foto). Ordine dei controlli:
 * gate (realUploads + compliance + chiave di cifratura) → sessione → consenso dati sanitari →
 * limite richieste → dimensione → firma del file → salvataggio cifrato → lettura in coda.
 */
export async function POST(req: Request) {
  try {
    assertUploadsReady();
  } catch (e) {
    if (e instanceof CapabilityDisabledError) return capabilityError(e);
    if (e instanceof FileKeyMissingError) return json({ error: "storage-not-configured", message: "Il caricamento non è configurato." }, { status: 503 });
    throw e;
  }
  const g = await requireUser();
  if ("response" in g) return g.response;
  if (!(await hasHealthDataConsent(g.user.id))) return json({ error: "consent-withdrawn", message: "Per caricare referti serve il consenso al trattamento dei dati sanitari." }, { status: 403 });
  if (!(await rateLimitShared(`upload:${g.user.id}`, 10, 10 * 60_000)).ok) return json({ error: "rate-limited", message: "Troppi caricamenti ravvicinati. Riprova tra qualche minuto." }, { status: 429 });

  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_UPLOAD_BYTES + 64 * 1024) return json({ error: "too-large", message: "Il file supera i 4 MB." }, { status: 413 });
  let file: File | null = null;
  try {
    const form = await req.formData();
    const f = form.get("file");
    file = f instanceof File ? f : null;
  } catch {
    return json({ error: "invalid-request", message: "Richiesta non valida." }, { status: 400 });
  }
  if (!file) return json({ error: "invalid-request", message: "Nessun file ricevuto." }, { status: 400 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = checkUpload(bytes);
  if (!check.ok) return json({ error: check.code, message: check.message }, { status: check.code === "too-large" ? 413 : 415 });

  const userId = g.user.id;
  const result = await withUser(userId, async (tx) => {
    const c = await tx.query<{ n: number }>("SELECT count(*)::int AS n FROM documents");
    if (Number(c.rows[0]?.n ?? 0) >= 30) return null;
    const id = randomUUID();
    await tx.query("INSERT INTO documents(id, user_id, title, source_kind, source_ref, status) VALUES ($1, $2, $3, 'upload', $4, 'queued')", [id, userId, safeTitle(file!.name), id]);
    const { sha256 } = await storeDocumentFile(tx, { documentId: id, userId, bytes, mimeType: check.mimeType });
    await tx.query("INSERT INTO jobs(id, user_id, kind, target_id, status) VALUES ($1, $2, 'extract-document', $3, 'queued')", [randomUUID(), userId, id]);
    await audit(tx, { userId, actor: "user", action: "document-uploaded", target: `${id}:${sha256.slice(0, 12)}` });
    return id;
  });
  if (!result) return json({ error: "limit-reached", message: "Hai raggiunto il limite di documenti per questo account." }, { status: 409 });
  await tickJobs(userId);
  return json({ id: result, status: "queued" }, { status: 201 });
}

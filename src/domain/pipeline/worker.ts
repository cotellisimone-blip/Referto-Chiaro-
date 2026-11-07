import "server-only";
import { withUser, type Queryable } from "@/db/client";
import { getSyntheticDocument } from "@/fixtures/synthetic";
import { checkExplanationConsistency } from "@/domain/reporting/consistency";
import { DEMO_POLICY } from "@/domain/reporting/demo-report-service";
import { buildDossier } from "@/domain/dossier/build-dossier";
import { getExplanationProvider, getOcrProvider } from "@/providers/registry";
import { CapabilityDisabledError } from "@/lib/feature-flags";
import type { ExtractedDocument } from "@/domain/extraction/schema";
import type { Explanation } from "@/domain/reporting/explanation-schema";
import { toDocument, toReport } from "./repository";

/**
 * Esecutore dei lavori in coda per un utente. Viene chiamato dalle API di lettura
 * ("tick" a richiesta): non serve un processo separato e gli stati restano visibili
 * (in coda → in elaborazione → pronto / errore). Ogni passo gira sotto RLS.
 */
export async function runPendingJobs(userId: string, maxJobs = 5): Promise<number> {
  let done = 0;
  for (let i = 0; i < maxJobs; i++) {
    const ran = await withUser(userId, async (tx) => {
      // Lavori in coda con tentativi residui; quelli rimasti «running» da più di 10 minuti (processo caduto) vengono ripresi.
      const j = await tx.query(
        "SELECT * FROM jobs WHERE attempts < 3 AND (status = 'queued' OR (status = 'running' AND updated_at < now() - interval '10 minutes')) ORDER BY created_at LIMIT 1",
      );
      const job = j.rows[0];
      if (!job) return false;
      await tx.query("UPDATE jobs SET status = 'running', attempts = attempts + 1, updated_at = now() WHERE id = $1", [job.id]);
      // Savepoint: un errore SQL nel lavoro annulla solo il lavoro, non la registrazione dell'errore.
      await tx.query("SAVEPOINT job_step");
      try {
        if (job.kind === "extract-document") await extractDocument(tx, String(job.target_id));
        else if (job.kind === "generate-report") await generateReport(tx, String(job.target_id));
        else if (job.kind === "generate-dossier") await generateDossier(tx, String(job.target_id));
        else throw new Error(`Tipo di lavoro sconosciuto: ${String(job.kind)}`);
        await tx.query("RELEASE SAVEPOINT job_step");
        await tx.query("UPDATE jobs SET status = 'done', updated_at = now() WHERE id = $1", [job.id]);
      } catch (e) {
        await tx.query("ROLLBACK TO SAVEPOINT job_step");
        const msg = (e instanceof Error ? e.message : "Errore sconosciuto").slice(0, 500);
        const final = Number(job.attempts ?? 0) + 1 >= 3;
        await tx.query("UPDATE jobs SET status = $3, last_error = $2, updated_at = now() WHERE id = $1", [job.id, msg, final ? "failed" : "queued"]);
        console.error(`[jobs] ${String(job.kind)} ${String(job.id)} tentativo ${Number(job.attempts ?? 0) + 1}: ${msg}`);
      }
      return true;
    });
    if (!ran) break;
    done++;
  }
  return done;
}

async function extractDocument(tx: Queryable, documentId: string) {
  const r = await tx.query("SELECT * FROM documents WHERE id = $1", [documentId]);
  if (!r.rows[0]) return;
  const doc = toDocument(r.rows[0]);
  await tx.query("UPDATE documents SET status = 'extracting', updated_at = now() WHERE id = $1", [documentId]);
  let extracted: ExtractedDocument | null = null;
  try {
    if (doc.sourceKind === "synthetic") extracted = getSyntheticDocument(doc.sourceRef);
    else extracted = await getOcrProvider().extract(doc.sourceRef); // lancia CapabilityDisabledError finché i gate sono chiusi
  } catch (e) {
    const msg = e instanceof CapabilityDisabledError ? "La lettura di documenti reali non è attiva in questa versione." : "Lettura non riuscita.";
    await tx.query("UPDATE documents SET status = 'error', error_message = $2, updated_at = now() WHERE id = $1", [documentId, msg]);
    return;
  }
  if (!extracted) {
    await tx.query("UPDATE documents SET status = 'error', error_message = 'Documento di esempio non trovato.', updated_at = now() WHERE id = $1", [documentId]);
    return;
  }
  await tx.query("UPDATE documents SET status = 'needs-verification', extracted = $2, updated_at = now() WHERE id = $1", [documentId, JSON.stringify(extracted)]);
}

async function generateReport(tx: Queryable, reportId: string) {
  const r = await tx.query("SELECT * FROM reports WHERE id = $1", [reportId]);
  if (!r.rows[0]) return;
  const report = toReport(r.rows[0]);
  await tx.query("UPDATE reports SET status = 'processing' WHERE id = $1", [reportId]);
  const d = await tx.query("SELECT * FROM documents WHERE id = $1", [report.documentId]);
  const doc = d.rows[0] ? toDocument(d.rows[0]) : null;
  const fail = (msg: string) => tx.query("UPDATE reports SET status = 'error', error_message = $2 WHERE id = $1", [reportId, msg]);
  if (!doc?.extracted || !doc.verification) return fail("Il documento non è stato verificato.");
  const ids = doc.verification.confirmedObservationIds.filter((id) => doc.extracted!.observations.some((o) => o.id === id));
  if (ids.length === 0) return fail("Nessun valore confermato.");
  let candidate: Explanation | { error: string; reason: string };
  try {
    candidate = await getExplanationProvider().explain({ document: doc.extracted, confirmedObservationIds: ids }, DEMO_POLICY);
  } catch {
    return fail("Il modulo di spiegazione non è disponibile.");
  }
  if ("error" in candidate) return fail(candidate.reason);
  const check = checkExplanationConsistency(doc.extracted, ids, candidate);
  if (!check.ok) return fail("Il controllo di coerenza dei valori non è stato superato: il report non viene generato.");
  await tx.query("UPDATE reports SET status = 'ready', explanation = $2, policy_version = $3, generated_at = now() WHERE id = $1", [
    reportId,
    JSON.stringify(check.explanation),
    `${check.explanation.modelAndPromptVersion}`,
  ]);
  await tx.query("UPDATE documents SET status = 'ready', updated_at = now() WHERE id = $1", [report.documentId]);
}

async function generateDossier(tx: Queryable, dossierId: string) {
  const r = await tx.query("SELECT * FROM dossiers WHERE id = $1", [dossierId]);
  if (!r.rows[0]) return;
  await tx.query("UPDATE dossiers SET status = 'processing' WHERE id = $1", [dossierId]);
  const ids = (r.rows[0].document_ids as string[]) ?? [];
  const items: { document: ExtractedDocument; explanation: Explanation }[] = [];
  for (const id of ids) {
    const d = await tx.query("SELECT * FROM documents WHERE id = $1", [id]);
    const rep = await tx.query("SELECT * FROM reports WHERE document_id = $1 AND status = 'ready' ORDER BY generated_at DESC LIMIT 1", [id]);
    const doc = d.rows[0] ? toDocument(d.rows[0]) : null;
    const report = rep.rows[0] ? toReport(rep.rows[0]) : null;
    if (!doc?.extracted || !report?.explanation) {
      await tx.query("UPDATE dossiers SET status = 'error', error_message = 'Ogni referto del dossier deve avere un report pronto.' WHERE id = $1", [dossierId]);
      return;
    }
    items.push({ document: doc.extracted, explanation: report.explanation });
  }
  const content = buildDossier({ title: String(r.rows[0].title), items, generatedAt: new Date().toISOString() });
  await tx.query("UPDATE dossiers SET status = 'ready', content = $2, generated_at = now() WHERE id = $1", [dossierId, JSON.stringify(content)]);
}

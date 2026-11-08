import "server-only";
import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { withSystem, withUser, type Queryable } from "@/db/client";
import { getSyntheticDocument } from "@/fixtures/synthetic";
import { checkExplanationConsistency } from "@/domain/reporting/consistency";
import { DEMO_POLICY } from "@/domain/reporting/demo-report-service";
import { buildDossier } from "@/domain/dossier/build-dossier";
import { getExplanationProvider, getOcrProvider } from "@/providers/registry";
import { ClaudeExplanationProvider } from "@/providers/ai/claude-explanation";
import { loadDocumentFile } from "@/providers/upload/db-encrypted";
import { CapabilityDisabledError, isCapabilityEnabled } from "@/lib/feature-flags";
import { publicUrl, reportReadyEmail, sendEmail } from "@/lib/email";
import type { ExtractedDocument } from "@/domain/extraction/schema";
import type { Explanation } from "@/domain/reporting/explanation-schema";
import { toDocument, toReport } from "./repository";

/**
 * Esecutore dei lavori in coda per un utente. Tre fasi per ogni lavoro:
 * 1. «prenota» il lavoro in una transazione breve (FOR UPDATE SKIP LOCKED: due richieste non lo eseguono due volte);
 * 2. esegue il passo — le chiamate esterne (lettura, AI) avvengono FUORI da qualsiasi transazione;
 * 3. salva l'esito in una seconda transazione breve.
 * Ogni accesso ai dati gira sotto RLS (`withUser`). Un lavoro rimasto «running» per oltre 10 minuti viene ripreso.
 */
type Job = { id: string; kind: string; target_id: string; attempts: number };

export async function runPendingJobs(userId: string, maxJobs = 5): Promise<number> {
  let done = 0;
  for (let i = 0; i < maxJobs; i++) {
    const job = await withUser(userId, async (tx) => {
      const j = await tx.query<Job>(
        `UPDATE jobs SET status = 'running', attempts = attempts + 1, updated_at = now()
         WHERE id = (SELECT id FROM jobs WHERE attempts < 3 AND (status = 'queued' OR (status = 'running' AND updated_at < now() - interval '10 minutes'))
                     ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED)
         RETURNING id, kind, target_id, attempts`,
      );
      return j.rows[0] ?? null;
    });
    if (!job) break;
    try {
      if (job.kind === "extract-document") await extractDocument(userId, String(job.target_id));
      else if (job.kind === "generate-report") await generateReport(userId, String(job.target_id));
      else if (job.kind === "generate-dossier") await withUser(userId, (tx) => generateDossier(tx, String(job.target_id)));
      else throw new Error(`Tipo di lavoro sconosciuto: ${String(job.kind)}`);
      await withUser(userId, (tx) => tx.query("UPDATE jobs SET status = 'done', updated_at = now() WHERE id = $1", [job.id]));
    } catch (e) {
      const msg = (e instanceof Error ? e.message : "Errore sconosciuto").slice(0, 500);
      const final = Number(job.attempts) >= 3;
      await withUser(userId, (tx) => tx.query("UPDATE jobs SET status = $3, last_error = $2, updated_at = now() WHERE id = $1", [job.id, msg, final ? "failed" : "queued"]));
      console.error(`[jobs] ${String(job.kind)} ${String(job.id)} tentativo ${job.attempts}: ${msg}`);
    }
    done++;
  }
  return done;
}

/**
 * Avvio dei lavori dalle API di lettura. Con lettura e AI reali i passi durano secondi:
 * si eseguono DOPO la risposta (`after`), così la pagina non resta appesa e mostra «in elaborazione».
 * In demo (tutto deterministico) restano sincroni.
 */
export async function tickJobs(userId: string): Promise<void> {
  const heavy = isCapabilityEnabled("realUploads") || isCapabilityEnabled("aiProcessing");
  if (!heavy) {
    await runPendingJobs(userId);
    return;
  }
  after(async () => {
    try {
      await runPendingJobs(userId, 3);
    } catch (e) {
      console.error(`[jobs] esecuzione in background non riuscita: ${e instanceof Error ? e.message : "errore"}`);
    }
  });
}

/** Per il cron: utenti con lavori in coda (transazione di sistema, solo id). */
export async function usersWithPendingJobs(limit = 20): Promise<string[]> {
  return withSystem(async (tx) => {
    const r = await tx.query<{ user_id: string }>(
      "SELECT DISTINCT user_id FROM jobs WHERE attempts < 3 AND (status = 'queued' OR (status = 'running' AND updated_at < now() - interval '10 minutes')) LIMIT $1",
      [limit],
    );
    return r.rows.map((x) => String(x.user_id));
  });
}

async function logAiRun(userId: string, run: { targetId: string; step: "transcribe" | "structure" | "explain"; model: string; promptVersion: string; outcome: string; inputTokens?: number; outputTokens?: number; issues?: unknown }) {
  await withUser(userId, (tx) =>
    tx.query("INSERT INTO ai_runs(id, user_id, target_id, step, model, prompt_version, outcome, input_tokens, output_tokens, issues) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [
      randomUUID(),
      userId,
      run.targetId,
      run.step,
      run.model,
      run.promptVersion,
      run.outcome,
      run.inputTokens ?? null,
      run.outputTokens ?? null,
      run.issues ? JSON.stringify(run.issues) : null,
    ]),
  ).catch(() => {});
}

async function extractDocument(userId: string, documentId: string) {
  const loaded = await withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM documents WHERE id = $1", [documentId]);
    if (!r.rows[0]) return null;
    await tx.query("UPDATE documents SET status = 'extracting', updated_at = now() WHERE id = $1", [documentId]);
    const doc = toDocument(r.rows[0]);
    const file = doc.sourceKind === "upload" ? await loadDocumentFile(tx, documentId) : null;
    return { doc, file };
  });
  if (!loaded) return;
  const { doc, file } = loaded;
  const setError = (msg: string) =>
    withUser(userId, (tx) => tx.query("UPDATE documents SET status = 'error', error_message = $2, updated_at = now() WHERE id = $1", [documentId, msg.slice(0, 400)]));

  let extracted: ExtractedDocument | null = null;
  if (doc.sourceKind === "synthetic") {
    extracted = getSyntheticDocument(doc.sourceRef);
    if (!extracted) return void (await setError("Documento di esempio non trovato."));
  } else {
    if (!file) return void (await setError("Il file caricato non è più disponibile."));
    let reader;
    try {
      reader = getOcrProvider();
    } catch (e) {
      return void (await setError(e instanceof CapabilityDisabledError ? "La lettura di documenti reali non è attiva in questa versione." : "La lettura dei documenti non è configurata."));
    }
    const out = await reader.extract({ documentId, bytes: file.bytes, mimeType: file.mimeType, title: doc.title });
    if (out.trace?.structuring === "ai" || out.trace?.method === "vision") {
      await logAiRun(userId, { targetId: documentId, step: "structure", model: out.trace?.model ?? "claude", promptVersion: reader.id, outcome: out.ok ? "ok" : "rejected", inputTokens: out.trace?.usage?.inputTokens, outputTokens: out.trace?.usage?.outputTokens, issues: out.ok ? { dropped: out.trace.droppedObservations, method: out.trace.method } : undefined });
    }
    if (!out.ok) return void (await setError(out.reason));
    extracted = out.document;
  }
  await withUser(userId, (tx) => tx.query("UPDATE documents SET status = 'needs-verification', extracted = $2, error_message = NULL, updated_at = now() WHERE id = $1", [documentId, JSON.stringify(extracted)]));
}

async function generateReport(userId: string, reportId: string) {
  const loaded = await withUser(userId, async (tx) => {
    const r = await tx.query("SELECT * FROM reports WHERE id = $1", [reportId]);
    if (!r.rows[0]) return null;
    const report = toReport(r.rows[0]);
    await tx.query("UPDATE reports SET status = 'processing' WHERE id = $1", [reportId]);
    const d = await tx.query("SELECT * FROM documents WHERE id = $1", [report.documentId]);
    return { report, doc: d.rows[0] ? toDocument(d.rows[0]) : null };
  });
  if (!loaded) return;
  const { report, doc } = loaded;
  const fail = (msg: string) => withUser(userId, (tx) => tx.query("UPDATE reports SET status = 'error', error_message = $2 WHERE id = $1", [reportId, msg]));
  if (!doc?.extracted || !doc.verification) return void (await fail("Il documento non è stato verificato."));
  const ids = doc.verification.confirmedObservationIds.filter((id) => doc.extracted!.observations.some((o) => o.id === id));
  if (ids.length === 0) return void (await fail("Nessun valore confermato."));

  let candidate: Explanation | { error: string; reason: string };
  let provider;
  try {
    provider = getExplanationProvider({ realDocument: !doc.extracted.isSynthetic });
    candidate = await provider.explain({ document: doc.extracted, confirmedObservationIds: ids }, DEMO_POLICY);
  } catch {
    return void (await fail("Il modulo di spiegazione non è disponibile."));
  }
  if (provider instanceof ClaudeExplanationProvider && provider.lastTrace) {
    const t = provider.lastTrace;
    await logAiRun(userId, { targetId: reportId, step: "explain", model: provider.modelId, promptVersion: provider.promptVersion, outcome: t.outcome, inputTokens: t.usage.inputTokens, outputTokens: t.usage.outputTokens, issues: t.violations.length ? t.violations.map((v) => v.rule) : undefined });
  }
  if ("error" in candidate) return void (await fail(candidate.reason));
  const check = checkExplanationConsistency(doc.extracted, ids, candidate);
  if (!check.ok) {
    await logAiRun(userId, { targetId: reportId, step: "explain", model: provider instanceof ClaudeExplanationProvider ? provider.modelId : provider.id, promptVersion: "consistency", outcome: "rejected", issues: check.issues.map((i) => i.code) });
    return void (await fail("Il controllo di coerenza dei valori non è stato superato: il report non viene generato."));
  }
  const email = await withUser(userId, async (tx) => {
    await tx.query("UPDATE reports SET status = 'ready', explanation = $2, policy_version = $3, generated_at = now() WHERE id = $1", [reportId, JSON.stringify(check.explanation), `${check.explanation.modelAndPromptVersion}`]);
    await tx.query("UPDATE documents SET status = 'ready', updated_at = now() WHERE id = $1", [report.documentId]);
    const u = await tx.query<{ email: string; is_demo: boolean }>("SELECT email, is_demo FROM users WHERE id = $1", [userId]);
    return u.rows[0] && !u.rows[0].is_demo ? String(u.rows[0].email) : null;
  });
  // Solo per elaborazioni reali (non demo): avviso senza alcun dato sanitario.
  if (email && !doc.extracted.isSynthetic) await sendEmail(reportReadyEmail(email, publicUrl(`/area/documenti/${report.documentId}`)));
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

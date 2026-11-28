import { getSyntheticDocument } from "@/fixtures/synthetic";
import { DeterministicDemoExplanationProvider } from "@/providers/explanation/deterministic-demo";
import type { ExtractedDocument } from "@/domain/extraction/schema";
import { checkExplanationConsistency, type ConsistencyIssue } from "./consistency";
import type { Explanation } from "./explanation-schema";

export const DEMO_POLICY = { id: "policy-informativa-v1" };

export type DemoReportResult =
  | { ok: true; document: ExtractedDocument; explanation: Explanation; generatedAt: string }
  | { ok: false; status: 400 | 404 | 422; code: string; message: string; issues?: ConsistencyIssue[] };

/**
 * Percorso demo: fixture sintetica → righe confermate → spiegazione deterministica
 * → controllo di coerenza numerica. Se il controllo fallisce, nessun report.
 */
export async function buildDemoReport(documentId: string, confirmedObservationIds: string[]): Promise<DemoReportResult> {
  const document = getSyntheticDocument(documentId);
  if (!document) {
    return { ok: false, status: 404, code: "document-not-found", message: "La demo accetta solo il documento di esempio." };
  }
  const known = new Set(document.observations.map((o) => o.id));
  const ids = [...new Set(confirmedObservationIds)].filter((id) => known.has(id));
  if (ids.length === 0) {
    return { ok: false, status: 400, code: "nothing-confirmed", message: "Conferma almeno un valore prima di continuare." };
  }

  const provider = new DeterministicDemoExplanationProvider();
  const candidate = await provider.explain({ document, confirmedObservationIds: ids }, DEMO_POLICY);
  if ("error" in candidate) {
    return { ok: false, status: 422, code: candidate.error, message: candidate.reason };
  }
  const check = checkExplanationConsistency(document, ids, candidate);
  if (!check.ok) {
    return {
      ok: false,
      status: 422,
      code: "consistency-check-failed",
      message: "Il controllo di coerenza dei valori non è stato superato: il report non viene generato.",
      issues: check.issues,
    };
  }
  return { ok: true, document, explanation: check.explanation, generatedAt: new Date().toISOString() };
}

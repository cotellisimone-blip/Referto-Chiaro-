import type { ExtractedDocument } from "@/domain/extraction/schema";
import { isReadable } from "@/domain/extraction/schema";
import { ExplanationSchema, type Explanation } from "./explanation-schema";

export interface ConsistencyIssue {
  code:
    | "schema-invalid"
    | "unknown-observation"
    | "unconfirmed-observation"
    | "unreadable-observation"
    | "duplicate-item"
    | "value-mismatch"
    | "unit-mismatch"
    | "reference-mismatch"
    | "citation-mismatch"
    | "unexpected-number";
  observationId?: string;
  detail: string;
}

const NUMBER_TOKEN = /\d+(?:[.,]\d+)?/g;

/** Numeri ammessi nel testo libero: solo quelli presenti nelle righe confermate, più il 112. */
function allowedNumbers(doc: ExtractedDocument, confirmed: Set<string>, itemCount: number): Set<string> {
  const allowed = new Set<string>(["112", String(itemCount)]);
  for (const o of doc.observations) {
    if (!confirmed.has(o.id)) continue;
    for (const field of [o.valueRaw, o.referenceRaw, o.nameRaw]) {
      for (const n of (field ?? "").match(NUMBER_TOKEN) ?? []) allowed.add(n);
    }
  }
  return allowed;
}

/**
 * Controllo deterministico origine ↔ output.
 * Nessun numero può cambiare, nessuna citazione può essere inventata,
 * nessun valore assente può comparire. Se c'è un problema, il report NON va mostrato.
 */
export function checkExplanationConsistency(
  doc: ExtractedDocument,
  confirmedObservationIds: string[],
  candidate: unknown,
): { ok: true; explanation: Explanation } | { ok: false; issues: ConsistencyIssue[] } {
  const parsed = ExplanationSchema.safeParse(candidate);
  if (!parsed.success) {
    return { ok: false, issues: [{ code: "schema-invalid", detail: parsed.error.message }] };
  }
  const exp = parsed.data;
  const issues: ConsistencyIssue[] = [];
  const confirmed = new Set(confirmedObservationIds);
  const byId = new Map(doc.observations.map((o) => [o.id, o]));
  const lines = new Map(doc.sourceLines.map((l) => [`${l.page}:${l.line}`, l.text]));
  const seen = new Set<string>();

  if (exp.sourceDocumentId !== doc.documentId) {
    issues.push({ code: "unknown-observation", detail: "Documento sorgente diverso da quello verificato." });
  }

  for (const item of exp.items) {
    const id = item.sourceObservationId;
    const o = byId.get(id);
    if (!o) {
      issues.push({ code: "unknown-observation", observationId: id, detail: "Voce non presente nel documento." });
      continue;
    }
    if (seen.has(id)) issues.push({ code: "duplicate-item", observationId: id, detail: "Voce ripetuta." });
    seen.add(id);
    if (!confirmed.has(id)) issues.push({ code: "unconfirmed-observation", observationId: id, detail: "Voce non confermata dall'utente." });
    if (!isReadable(o)) issues.push({ code: "unreadable-observation", observationId: id, detail: "Voce non leggibile." });
    if (item.originalValueExact !== o.valueRaw)
      issues.push({ code: "value-mismatch", observationId: id, detail: `Atteso "${o.valueRaw}", trovato "${item.originalValueExact}".` });
    if (item.originalUnitExact !== o.unitRaw)
      issues.push({ code: "unit-mismatch", observationId: id, detail: `Attesa "${o.unitRaw}", trovata "${item.originalUnitExact}".` });
    if (item.originalReferenceExact !== o.referenceRaw)
      issues.push({ code: "reference-mismatch", observationId: id, detail: "Intervallo diverso da quello stampato." });
    const c = item.sourceCitation;
    const lineText = lines.get(`${c.page}:${c.line}`);
    if (c.page !== o.sourcePage || c.line !== o.sourceLine || c.excerpt !== o.sourceTextExact || lineText !== c.excerpt) {
      issues.push({ code: "citation-mismatch", observationId: id, detail: "Citazione non corrispondente al documento." });
    }
  }

  const allowed = allowedNumbers(doc, confirmed, exp.items.length);
  const freeTexts: [string, string | undefined][] = [
    [exp.summary, undefined],
    ...exp.items.flatMap((i) => [
      [i.plainLanguageDefinition, i.sourceObservationId] as [string, string],
      [i.printedRangeNote, i.sourceObservationId] as [string, string],
    ]),
    ...exp.questionsForDoctor.map((q) => [q, undefined] as [string, undefined]),
  ];
  for (const [text, obsId] of freeTexts) {
    for (const n of text.match(NUMBER_TOKEN) ?? []) {
      if (!allowed.has(n)) {
        issues.push({ code: "unexpected-number", observationId: obsId, detail: `Numero "${n}" non presente nei dati verificati.` });
      }
    }
  }

  return issues.length ? { ok: false, issues } : { ok: true, explanation: exp };
}

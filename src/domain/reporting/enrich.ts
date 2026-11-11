import type { ExtractedDocument } from "@/domain/extraction/schema";
import { isReadable } from "@/domain/extraction/schema";
import { parseLocaleNumber } from "@/domain/extraction/numbers";
import type { Explanation } from "@/domain/reporting/explanation-schema";
import { normalizeName } from "@/domain/dossier/build-dossier";
import { GUIDES, type Guide } from "@/content/guides";

/**
 * Arricchimenti del report «Capisci» che NON generano testo nuovo:
 * - «Cosa può influenzare il parametro, in generale»: i fattori già scritti e revisionati nelle guide (riuso, non rigenerazione).
 * - «Referti precedenti»: valori dello stesso esame in referti precedenti dell'utente, SOLO se davvero confrontabili
 *   (stesso nome normalizzato, stessa unità, entrambi leggibili, numerici e confermati). Nessuna inferenza clinica.
 */

export interface ItemFactors {
  guideSlug: string;
  guideTitle: string;
  factors: string[];
}

export interface HistoryPoint {
  documentId: string;
  reportDate: string;
  valueExact: string;
  unitExact: string;
  referenceExact: string | null;
}

export interface ReportEnrichment {
  factors: Record<string, ItemFactors>;
  history: Record<string, HistoryPoint[]>;
}

const strip = (s: string) => normalizeName(s.replace(/\(([^)]*)\)/g, " "));

/** Chiavi con cui un nome di esame può essere riconosciuto: nome intero, senza parentesi, sigle tra parentesi. */
function keysOf(name: string): string[] {
  const keys = new Set<string>([normalizeName(name), strip(name)]);
  for (const m of name.matchAll(/\(([^)]*)\)/g)) for (const part of m[1].split(/[/,]| e /)) keys.add(normalizeName(part));
  return [...keys].filter((k) => k.length >= 2);
}

const LAB_CATEGORIES = new Set(["emocromo", "metabolismo", "lipidi", "fegato", "reni", "tiroide", "ferro", "infiammazione", "ormoni"]);
let index: Map<string, Guide> | null = null;
function guideIndex(): Map<string, Guide> {
  if (index) return index;
  index = new Map();
  for (const g of GUIDES) {
    if (!LAB_CATEGORIES.has(g.category)) continue;
    for (const k of [...keysOf(g.examName), ...g.aliases.flatMap(keysOf)]) if (!index.has(k)) index.set(k, g);
  }
  return index;
}

/** La guida che parla di questo esame, se c'è (match esatto su nome, sigla o alias: mai «a occhio»). */
export function guideForExam(nameExact: string): Guide | null {
  const idx = guideIndex();
  for (const k of [strip(nameExact), normalizeName(nameExact), ...keysOf(nameExact)]) {
    const g = idx.get(k);
    if (g) return g;
  }
  return null;
}

export function enrichReport(args: {
  current: ExtractedDocument;
  explanation: Explanation;
  previous: { document: ExtractedDocument; confirmedObservationIds: string[] }[];
}): ReportEnrichment {
  const factors: Record<string, ItemFactors> = {};
  const history: Record<string, HistoryPoint[]> = {};
  const earlier = args.previous.filter((p) => p.document.documentId !== args.current.documentId && p.document.reportDate < args.current.reportDate);
  for (const it of args.explanation.items) {
    const g = guideForExam(it.nameExact);
    if (g) factors[it.sourceObservationId] = { guideSlug: g.slug, guideTitle: g.title, factors: g.sections.factors.slice(0, 4) };

    const unit = (it.originalUnitExact ?? "").trim().toLowerCase();
    if (!unit || !parseLocaleNumber(it.originalValueExact).ok) continue;
    const key = normalizeName(it.nameExact);
    const points: HistoryPoint[] = [];
    for (const p of earlier) {
      const confirmed = new Set(p.confirmedObservationIds);
      const o = p.document.observations.find((x) => normalizeName(x.nameRaw) === key);
      if (!o || !confirmed.has(o.id) || !isReadable(o)) continue;
      if ((o.unitRaw ?? "").trim().toLowerCase() !== unit) continue;
      if (!o.valueRaw || !parseLocaleNumber(o.valueRaw).ok) continue;
      points.push({ documentId: p.document.documentId, reportDate: p.document.reportDate, valueExact: o.valueRaw, unitExact: o.unitRaw ?? "", referenceExact: o.referenceRaw });
    }
    if (points.length) history[it.sourceObservationId] = points.sort((a, b) => b.reportDate.localeCompare(a.reportDate)).slice(0, 3);
  }
  return { factors, history };
}

import type { ExtractedDocument, Observation } from "@/domain/extraction/schema";
import { isReadable } from "@/domain/extraction/schema";
import { formatItalianNumber, parseLocaleNumber } from "@/domain/extraction/numbers";
import type { Explanation } from "@/domain/reporting/explanation-schema";

/**
 * Dossier "Completo": più referti in un documento ordinato per data.
 * I confronti numerici sono mostrati SOLO tra esami davvero confrontabili:
 * stesso nome normalizzato, stessa unità, valore leggibile e numerico in entrambi.
 * Nessun giudizio: solo "era X, ora Y".
 */
export interface DossierEntry {
  documentId: string;
  title: string;
  laboratoryName: string;
  reportDate: string;
  explanation: Explanation;
}

export interface DossierComparison {
  nameExact: string;
  unitExact: string;
  points: { documentId: string; reportDate: string; valueExact: string; referenceExact: string | null }[];
  deltaText: string;
}

export interface DossierNotComparable {
  nameExact: string;
  reason: string;
}

export interface DossierContent {
  schemaVersion: "1.0";
  title: string;
  generatedAt: string;
  entries: DossierEntry[];
  comparisons: DossierComparison[];
  notComparable: DossierNotComparable[];
  limitations: string[];
}

export function normalizeName(nameRaw: string): string {
  return nameRaw
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-zà-ù0-9]+/g, " ")
    .trim();
}

export function buildDossier(args: { title: string; items: { document: ExtractedDocument; explanation: Explanation }[]; generatedAt: string }): DossierContent {
  const sorted = [...args.items].sort((a, b) => a.document.reportDate.localeCompare(b.document.reportDate));
  const entries: DossierEntry[] = sorted.map(({ document, explanation }) => ({
    documentId: document.documentId,
    title: document.displayTitle,
    laboratoryName: document.laboratoryName,
    reportDate: document.reportDate,
    explanation,
  }));

  // Raggruppa le osservazioni confermate per nome normalizzato.
  // Tutte le osservazioni entrano nei gruppi; sono confrontabili solo quelle confermate e leggibili.
  const groups = new Map<string, { doc: ExtractedDocument; obs: Observation; confirmed: boolean }[]>();
  for (const { document, explanation } of sorted) {
    const confirmed = new Set(explanation.items.map((i) => i.sourceObservationId));
    for (const obs of document.observations) {
      const key = normalizeName(obs.nameRaw);
      groups.set(key, [...(groups.get(key) ?? []), { doc: document, obs, confirmed: confirmed.has(obs.id) }]);
    }
  }

  const comparisons: DossierComparison[] = [];
  const notComparable: DossierNotComparable[] = [];
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const units = new Set(list.map((x) => (x.obs.unitRaw ?? "").trim().toLowerCase()));
    const nameExact = list[list.length - 1].obs.nameRaw;
    if (units.size !== 1) {
      notComparable.push({ nameExact, reason: "Unità di misura diverse tra i referti: il confronto numerico non è possibile." });
      continue;
    }
    if (list.some((x) => !x.confirmed)) {
      notComparable.push({ nameExact, reason: "Almeno un valore non è stato confermato o non è leggibile: nessun confronto." });
      continue;
    }
    const parsed = list.map((x) => ({ ...x, num: isReadable(x.obs) ? parseLocaleNumber(x.obs.valueRaw) : ({ ok: false } as const) }));
    if (parsed.some((p) => !p.num.ok)) {
      notComparable.push({ nameExact, reason: "Almeno un valore non è numerico: nessun confronto." });
      continue;
    }
    const first = parsed[0];
    const last = parsed[parsed.length - 1];
    const a = first.num.ok ? first.num.value : 0;
    const b = last.num.ok ? last.num.value : 0;
    const decimals = Math.max(first.num.ok ? first.num.decimals : 0, last.num.ok ? last.num.decimals : 0);
    const unit = first.obs.unitRaw ?? "";
    const deltaText =
      a === b
        ? `Stesso valore nei due referti (${last.obs.valueRaw} ${unit}).`
        : `Era ${first.obs.valueRaw} ${unit} il ${fmtDate(first.doc.reportDate)}, è ${last.obs.valueRaw} ${unit} il ${fmtDate(last.doc.reportDate)} (differenza ${b > a ? "+" : "-"}${formatItalianNumber(Math.abs(b - a), decimals)} ${unit}). Che cosa significhi lo può dire solo il medico.`;
    comparisons.push({
      nameExact,
      unitExact: unit,
      points: parsed.map((p) => ({ documentId: p.doc.documentId, reportDate: p.doc.reportDate, valueExact: p.obs.valueRaw ?? "", referenceExact: p.obs.referenceRaw })),
      deltaText,
    });
  }

  return {
    schemaVersion: "1.0",
    title: args.title,
    generatedAt: args.generatedAt,
    entries,
    comparisons,
    notComparable,
    limitations: [
      "Il dossier ordina e affianca i referti; non valuta l'andamento né la situazione clinica.",
      "Gli intervalli stampati possono cambiare tra laboratori e metodi: due valori vicini possono non essere confrontabili.",
      "Solo gli esami con stesso nome e stessa unità sono messi a confronto; gli altri sono elencati a parte.",
      "In caso di urgenza non usare questo servizio: in Italia chiama il 112.",
    ],
  };
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

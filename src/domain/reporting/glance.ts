import { parseLocaleNumber } from "@/domain/extraction/numbers";
import { parseReferenceRange, positionInPrintedRange, type RangePosition, type ReferenceRange } from "@/domain/extraction/reference";
import type { Explanation, ExplanationItem } from "./explanation-schema";

/**
 * «A colpo d'occhio» (ciclo 5): dove cade ogni numero rispetto all'intervallo STAMPATO sul referto.
 *
 * È un confronto tra numeri, calcolato dal codice e mai dall'AI: stesso calcolo della frase
 * `printedRangeNote`. Non è un giudizio clinico e i testi non usano aggettivi clinici.
 * Lo stesso modulo serve la pagina del report, il PDF e le domande per il medico.
 */

export interface ItemGlance {
  position: RangePosition;
  /** «Dentro l'intervallo stampato», «Sopra…», «Sotto…», «Non confrontabile». */
  label: string;
  /** Una parola, per elenchi e tabelle strette. */
  short: "Dentro" | "Sopra" | "Sotto" | "Non confrontabile";
  /** Disegno schematico della barra, in percentuale: fascia dell'intervallo, punto del valore, etichette dei limiti. */
  bar: { bandStart: number; bandEnd: number; marker: number; ticks: { at: number; text: string }[] } | null;
}

const LABEL: Record<RangePosition, ItemGlance["label"]> = {
  inside: "Dentro l'intervallo stampato",
  "above-range": "Sopra l'intervallo stampato",
  "below-range": "Sotto l'intervallo stampato",
  "not-comparable": "Non confrontabile con l'intervallo stampato",
};
const SHORT: Record<RangePosition, ItemGlance["short"]> = { inside: "Dentro", "above-range": "Sopra", "below-range": "Sotto", "not-comparable": "Non confrontabile" };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** I limiti scritti come sul referto: si ritagliano dal testo stampato, non si riformattano. */
function printedLimits(raw: string): string[] {
  return raw.match(/\d+(?:[.,]\d+)*/g) ?? [];
}

/**
 * Geometria schematica: la fascia non è in scala clinica, mostra solo da che parte del limite sta il numero.
 * Tra due limiti la fascia occupa il centro; con un solo limite parte dal bordo.
 */
function barFor(value: number, range: ReferenceRange, raw: string, position: RangePosition): ItemGlance["bar"] {
  const lim = printedLimits(raw);
  let bandStart: number, bandEnd: number, marker: number;
  if (range.kind === "between") {
    bandStart = 22;
    bandEnd = 78;
    const span = range.high - range.low;
    marker = span > 0 ? bandStart + ((value - range.low) / span) * (bandEnd - bandStart) : 50;
  } else if (range.kind === "below") {
    bandStart = 0;
    bandEnd = 70;
    marker = range.high > 0 ? (value / range.high) * bandEnd : 50;
  } else if (range.kind === "above") {
    bandStart = 30;
    bandEnd = 100;
    marker = range.low > 0 ? (value / range.low) * bandStart : 50;
  } else return null;
  // Il punto resta sempre dal lato giusto del limite e dentro la barra, anche per valori molto lontani.
  if (position === "inside") marker = clamp(marker, bandStart + 5, bandEnd - 5);
  else if (position === "above-range") marker = clamp(marker, bandEnd + 7, 95);
  else marker = clamp(marker, 5, bandStart - 7);
  const ticks =
    range.kind === "between"
      ? lim.length >= 2
        ? [
            { at: bandStart, text: lim[0] },
            { at: bandEnd, text: lim[1] },
          ]
        : []
      : lim.length >= 1
        ? [{ at: range.kind === "below" ? bandEnd : bandStart, text: lim[0] }]
        : [];
  return { bandStart, bandEnd, marker: Math.round(marker * 10) / 10, ticks };
}

export function itemGlance(item: Pick<ExplanationItem, "originalValueExact" | "originalReferenceExact">): ItemGlance {
  const num = parseLocaleNumber(item.originalValueExact);
  const range = parseReferenceRange(item.originalReferenceExact);
  const position = positionInPrintedRange(num.ok ? num.value : null, range);
  const bar = num.ok && position !== "not-comparable" ? barFor(num.value, range, item.originalReferenceExact ?? "", position) : null;
  return { position, label: LABEL[position], short: SHORT[position], bar };
}

export interface ReportGlance {
  total: number;
  inside: number;
  above: number;
  below: number;
  notComparable: number;
  outside: number;
  /** Voci nell'ordine di lettura: prima quelle fuori dall'intervallo stampato, poi le altre, ognuna nell'ordine del referto. */
  ordered: { item: ExplanationItem; glance: ItemGlance }[];
  /** Una frase sola, senza numeri del referto: «4 dentro l'intervallo stampato, 1 sopra.» */
  sentence: string;
}

const RANK: Record<RangePosition, number> = { "above-range": 0, "below-range": 0, "not-comparable": 1, inside: 2 };

export function reportGlance(explanation: Pick<Explanation, "items">): ReportGlance {
  const rows = explanation.items.map((item) => ({ item, glance: itemGlance(item) }));
  const count = (p: RangePosition) => rows.filter((r) => r.glance.position === p).length;
  const inside = count("inside");
  const above = count("above-range");
  const below = count("below-range");
  const notComparable = count("not-comparable");
  const parts: string[] = [];
  if (inside) parts.push(`${inside} dentro l'intervallo stampato`);
  if (above) parts.push(`${above} sopra`);
  if (below) parts.push(`${below} sotto`);
  if (notComparable) parts.push(`${notComparable} non ${notComparable === 1 ? "confrontabile" : "confrontabili"}`);
  const ordered = rows.map((r, i) => ({ r, i })).sort((a, b) => RANK[a.r.glance.position] - RANK[b.r.glance.position] || a.i - b.i).map((x) => x.r);
  return { total: rows.length, inside, above, below, notComparable, outside: above + below, ordered, sentence: `${parts.join(", ")}.` };
}

const listIt = (names: string[]) => (names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} e ${names[names.length - 1]}`);

/**
 * Domande per il medico sui valori fuori dall'intervallo stampato: nominano l'esame, così la persona
 * sa che cosa chiedere. Restano domande: nessuna interpretazione. Sostituiscono la domanda generica.
 */
export function outOfRangeQuestions(items: Pick<ExplanationItem, "nameExact" | "originalValueExact" | "originalReferenceExact">[]): string[] {
  const above: string[] = [];
  const below: string[] = [];
  for (const it of items) {
    const p = itemGlance(it).position;
    if (p === "above-range") above.push(it.nameExact);
    else if (p === "below-range") below.push(it.nameExact);
  }
  const ask = (names: string[], side: "sopra" | "sotto") =>
    names.length > 3
      ? `Più valori sono ${side} l'intervallo stampato dal laboratorio: che cosa significa nel mio caso, se significa qualcosa?`
      : `${listIt(names)}: ${names.length === 1 ? "il numero è" : "i numeri sono"} ${side} l'intervallo stampato dal laboratorio. Che cosa significa nel mio caso, se significa qualcosa?`;
  return [...(above.length ? [ask(above, "sopra")] : []), ...(below.length ? [ask(below, "sotto")] : [])];
}

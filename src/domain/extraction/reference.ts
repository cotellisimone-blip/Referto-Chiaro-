import { parseLocaleNumber } from "./numbers";

/**
 * Intervallo di riferimento così come STAMPATO dal laboratorio.
 * Non è un intervallo "universale" né un giudizio clinico.
 */
export type ReferenceRange =
  | { kind: "between"; low: number; high: number }
  | { kind: "below"; high: number; inclusive: boolean }
  | { kind: "above"; low: number; inclusive: boolean }
  | { kind: "unparsed"; raw: string };

const BETWEEN = /^\[?\s*([\d.,]+)\s*[-–—]\s*([\d.,]+)\s*\]?$/;
const BELOW = /^(<=?|≤|inferiore a)\s*([\d.,]+)$/i;
const ABOVE = /^(>=?|≥|superiore a)\s*([\d.,]+)$/i;

export function parseReferenceRange(raw: string | null | undefined): ReferenceRange {
  const s = (raw ?? "").trim();
  let m = s.match(BETWEEN);
  if (m) {
    const low = parseLocaleNumber(m[1]);
    const high = parseLocaleNumber(m[2]);
    if (low.ok && high.ok && low.value <= high.value) {
      return { kind: "between", low: low.value, high: high.value };
    }
    return { kind: "unparsed", raw: s };
  }
  m = s.match(BELOW);
  if (m) {
    const high = parseLocaleNumber(m[2]);
    if (high.ok) return { kind: "below", high: high.value, inclusive: m[1] !== "<" };
  }
  m = s.match(ABOVE);
  if (m) {
    const low = parseLocaleNumber(m[2]);
    if (low.ok) return { kind: "above", low: low.value, inclusive: m[1] !== ">" };
  }
  return { kind: "unparsed", raw: s };
}

/**
 * Posizione puramente numerica del valore rispetto all'intervallo stampato.
 * Non ha significato clinico: serve solo a descrivere in modo neutro
 * se il numero è dentro o fuori dai limiti indicati nel documento.
 */
export type RangePosition = "inside" | "below-range" | "above-range" | "not-comparable";

export function positionInPrintedRange(value: number | null, range: ReferenceRange): RangePosition {
  if (value == null || Number.isNaN(value)) return "not-comparable";
  switch (range.kind) {
    case "between":
      if (value < range.low) return "below-range";
      if (value > range.high) return "above-range";
      return "inside";
    case "below":
      if (range.inclusive ? value <= range.high : value < range.high) return "inside";
      return "above-range";
    case "above":
      if (range.inclusive ? value >= range.low : value > range.low) return "inside";
      return "below-range";
    default:
      return "not-comparable";
  }
}

/** Frase neutra, senza aggettivi clinici ("normale", "alto", "preoccupante"...). */
export function describeRangePosition(pos: RangePosition): string {
  switch (pos) {
    case "inside":
      return "Il numero riportato rientra nell'intervallo stampato dal laboratorio.";
    case "below-range":
      return "Il numero riportato è al di sotto dell'intervallo stampato dal laboratorio. Ha senso parlarne con il medico, che conosce il contesto.";
    case "above-range":
      return "Il numero riportato è al di sopra dell'intervallo stampato dal laboratorio. Ha senso parlarne con il medico, che conosce il contesto.";
    default:
      return "Non è possibile confrontare il numero con l'intervallo stampato in modo affidabile.";
  }
}

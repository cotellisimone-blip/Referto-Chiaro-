import type { SourceLine } from "./pdf-text";

export interface RawObservation {
  page: number;
  line: number;
  nameRaw: string;
  valueRaw: string | null;
  unitRaw: string | null;
  referenceRaw: string | null;
  methodRaw: string | null;
}

const UNIT = /^(?:[a-zA-Zµμ%‰°/·.*^0-9]+(?:\/[a-zA-Zµμ0-9.^*]+)*|x\s?10\^?\d+\/[a-zA-Zµμ]+|%)$/;
const VALUE = /^[<>≤≥]?\s?\d+(?:[.,]\d+)?$/;
const RANGE = /^(?:\[?\s*\d+(?:[.,]\d+)?\s*[-–—]\s*\d+(?:[.,]\d+)?\s*\]?|(?:<=?|>=?|≤|≥)\s*\d+(?:[.,]\d+)?)$/;
const HEADER = /^(esame|esami|analisi|test|parametro|parametri|descrizione)\s*:?$/i;
const SKIP = /^(paziente|data|nome|cognome|codice|medico|pag|pagina|laboratorio|direttore|firma|referto|note|documento)\b/i;

/**
 * Lettore deterministico di righe «colonnari» (nome  valore  unità  intervallo).
 * Serve quando la lettura AI non è attiva o come controllo incrociato: non inventa nulla,
 * restituisce solo frammenti presenti alla lettera nella riga.
 */
export function parseColumnLines(lines: SourceLine[]): RawObservation[] {
  const out: RawObservation[] = [];
  for (const l of lines) {
    const cols = l.text.split(/\s{2,}|\t/).map((c) => c.trim()).filter(Boolean);
    if (cols.length < 2) continue;
    const [name, ...rest] = cols;
    if (!/[a-zA-Zàèéìòù]{3,}/.test(name) || SKIP.test(name) || HEADER.test(name)) continue;
    const valueIdx = rest.findIndex((c) => VALUE.test(c) || /▒/.test(c) || /\d.*\?|\?.*\d/.test(c));
    if (valueIdx !== 0) continue;
    const rawValue = rest[0];
    const unreadable = /[▒?]/.test(rawValue);
    let unit: string | null = null;
    let ref: string | null = null;
    // Unità e intervallo a volte sono separati da un solo spazio («x10^6/µL 3,80 - 5,20»).
    const tail = rest.slice(1).flatMap((c) => {
      if (RANGE.test(c) || UNIT.test(c)) return [c];
      const i = c.indexOf(" ");
      if (i > 0 && UNIT.test(c.slice(0, i)) && RANGE.test(c.slice(i + 1).trim())) return [c.slice(0, i), c.slice(i + 1).trim()];
      return [c];
    });
    for (const c of tail) {
      if (!ref && RANGE.test(c)) ref = c;
      else if (!unit && !ref && UNIT.test(c) && !VALUE.test(c)) unit = c;
    }
    out.push({ page: l.page, line: l.line, nameRaw: name, valueRaw: unreadable ? null : rawValue, unitRaw: unit, referenceRaw: ref, methodRaw: null });
  }
  return out;
}

/** Data del referto (gg/mm/aaaa) se presente in chiaro; altrimenti null. */
export function findReportDate(lines: SourceLine[]): string | null {
  const candidates = lines.filter((l) => !/nascita|\bnat[oa]\b/i.test(l.text));
  const preferred = [...candidates.filter((l) => /prelievo|referto|refertazione|accettazione|data/i.test(l.text)), ...candidates];
  for (const l of preferred) {
    const m = l.text.match(/\b(\d{2})[/.-](\d{2})[/.-](\d{4})\b/);
    if (m) {
      const [, d, mo, y] = m;
      const iso = `${y}-${mo}-${d}`;
      if (!Number.isNaN(Date.parse(iso))) return iso;
    }
  }
  return null;
}

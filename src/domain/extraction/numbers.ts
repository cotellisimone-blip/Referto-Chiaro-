/**
 * Parsing numerico prudente per referti italiani.
 *
 * Regola guida: se non siamo certi del numero, NON lo indoviniamo.
 * Il valore testuale originale resta sempre la fonte di verità mostrata all'utente.
 */

export type ParsedNumber =
  | { ok: true; value: number; decimals: number }
  | { ok: false; reason: "empty" | "not-numeric" | "ambiguous-separator" };

const PLAIN = /^[+-]?\d+$/;
const COMMA_DECIMAL = /^[+-]?\d+,\d+$/;
const DOT_DECIMAL = /^[+-]?\d+\.\d+$/;
const IT_THOUSANDS = /^[+-]?\d{1,3}(\.\d{3})+(,\d+)?$/;

/**
 * Converte una stringa numerica stampata in un referto in un numero.
 *
 * - "4,5"  → 4.5   (virgola decimale, formato italiano)
 * - "4.5"  → 4.5   (punto decimale, frequente in stampe di strumenti)
 * - "1.234,5" → 1234.5 (migliaia con punto + decimali con virgola)
 * - "1.234" → AMBIGUO: potrebbe essere 1234 o 1,234. Non indoviniamo.
 * - "1,234" → 1.234 (virgola sempre decimale nei referti italiani)
 */
export function parseLocaleNumber(raw: string | null | undefined): ParsedNumber {
  if (raw == null) return { ok: false, reason: "empty" };
  const s = raw.trim().replace(/\s+/g, "");
  if (s === "") return { ok: false, reason: "empty" };

  if (PLAIN.test(s)) return { ok: true, value: Number(s), decimals: 0 };

  if (COMMA_DECIMAL.test(s)) {
    const dec = s.split(",")[1].length;
    return { ok: true, value: Number(s.replace(",", ".")), decimals: dec };
  }

  if (DOT_DECIMAL.test(s)) {
    const [, frac] = s.split(".");
    // "1.234" con esattamente tre cifre dopo il punto è ambiguo (migliaia vs decimali).
    if (frac.length === 3) return { ok: false, reason: "ambiguous-separator" };
    return { ok: true, value: Number(s), decimals: frac.length };
  }

  if (IT_THOUSANDS.test(s) && s.includes(",")) {
    const normalized = s.replace(/\./g, "").replace(",", ".");
    const dec = s.split(",")[1].length;
    return { ok: true, value: Number(normalized), decimals: dec };
  }

  if (IT_THOUSANDS.test(s)) return { ok: false, reason: "ambiguous-separator" };

  return { ok: false, reason: "not-numeric" };
}

/** Formatta un numero con virgola decimale mantenendo le cifre decimali originali. */
export function formatItalianNumber(value: number, decimals: number): string {
  return value.toFixed(decimals).replace(".", ",");
}

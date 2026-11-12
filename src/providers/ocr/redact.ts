import type { SourceLine } from "./pdf-text";

/**
 * Minimizzazione: le righe con dati anagrafici non servono a spiegare un esame e non vengono salvate
 * né inviate al passo di strutturazione. Restano nel file originale cifrato, che l'utente può cancellare.
 */
const PERSONAL = /\b(paziente|sig\.?r?a?|nome|cognome|nat[oa]\s+(il|a)|data\s+di\s+nascita|codice\s+fiscale|c\.\s?f\.|tessera|indirizzo|residente|telefono|tel\.|e-?mail|n\.\s?accettazione|id\s+paziente|sesso)\b/i;
const FISCAL_CODE = /\b[A-Z]{6}\d{2}[A-EHLMPR-T]\d{2}[A-Z]\d{3}[A-Z]\b/i;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.]+/;
const PHONE = /\b(?:\+39\s?)?3\d{2}[\s.]?\d{6,7}\b/;

export const REDACTED = "[riga con dati personali nascosta]";

export function redactLines(lines: SourceLine[]): SourceLine[] {
  return lines.map((l) => (PERSONAL.test(l.text) || FISCAL_CODE.test(l.text) || EMAIL.test(l.text) || PHONE.test(l.text) ? { ...l, text: REDACTED } : l));
}

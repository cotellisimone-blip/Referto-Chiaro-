import { FORBIDDEN_PHRASES } from "@/content/guides/schema";

/**
 * Controllo del linguaggio per TUTTO il testo libero mostrato all'utente (guide, glossario,
 * spiegazioni deterministiche e spiegazioni generate dall'AI).
 *
 * Due livelli:
 * - FORBIDDEN_PHRASES (condivise con le guide): frasi diagnostiche, prescrittive o promesse.
 * - AI_EXTRA_PATTERNS: espressioni regolari più severe, pensate per i modi in cui un modello
 *   linguistico tende a «scivolare» verso giudizi clinici («è alto», «indica», «dovresti»…).
 *
 * Se anche una sola frase viola le regole, l'output AI viene scartato (fail-closed).
 */

export interface LanguageViolation {
  rule: string;
  excerpt: string;
}

const AI_EXTRA_PATTERNS: { rule: string; re: RegExp }[] = [
  // Giudizi clinici e stati
  { rule: "giudizio-normale", re: /\b(a)?normal[ei]\b|\b(nella|fuori)\s+norma\b/i },
  { rule: "giudizio-anomalo", re: /\banomal[aieo]\b/i },
  { rule: "patologia", re: /\bpatolog/i },
  { rule: "gravita", re: /\bgrav[ei]\b/i },
  { rule: "preoccupazione", re: /\b(preoccup|allarm|rassicur|tranquillizz)/i },
  { rule: "rischio", re: /\brischi[oa]?\b/i },
  { rule: "diagnosi", re: /\bdiagnos/i },
  { rule: "malattia", re: /\b(malattia|malattie|disturbo|sindrome|carenza|deficit|insufficienza)\b/i },
  { rule: "interpretazione-indica", re: /\b(indica|indicano|suggerisce|suggeriscono|segnala|segnalano|può indicare|possono indicare)\s+(che|una?\s+(possibile|probabile|condizione|problema|alterazione)|la presenza|un problema|possibil|qualcosa)|(?:^|[\s,;:(])(è segno|sono segno|è un segnale|fa pensare|potrebbe significare|significa che hai|nel tuo caso)\b/i },
  { rule: "valore-alto-basso", re: /\b(il tuo|tuo|il valore|questo valore|i tuoi)\b[^.]{0,40}\s(è|sono|risulta|risultano)\s+(alt[oaie]|bass[oaie]|elevat[oaie]|ridott[oaie]|aumentat[oaie]|diminuit[oaie])\b/i },
  { rule: "valore-buono-cattivo", re: /\b(buon[oaie]?|ottim[oaie]|cattiv[oaie]|pessim[oaie]|perfett[oaie])\s+(valore|valori|risultato|risultati)\b/i },
  // Terapia e prescrizioni
  { rule: "terapia", re: /\b(terapi|farmac|medicin(a|ale|ali)\b|integrator|supplement|vitamin[ae] da prendere|antibiotic)/i },
  { rule: "prescrizione-dovresti", re: /\b(dovresti|dovrebbe|devi|deve|necessario che tu|ti conviene|ti suggerisco|si consiglia|consigliamo|consiglio)\b/i },
  { rule: "dieta-stile-vita", re: /\b(dieta|mangia|evita di|riduci|aumenta il consumo|fai attività fisica|smetti di)\b/i },
  { rule: "dosaggio", re: /\b\d+\s?(mg|mcg|µg|ui|iu)\s+(al giorno|die)\b/i },
  // Urgenza e triage (l'unico riferimento ammesso è il 112 nelle limitazioni standard)
  { rule: "triage", re: /\b(pronto soccorso|urgentemente|subito dal medico|immediatamente|non è urgente|non è niente)\b/i },
  // Promesse e certezze
  { rule: "certezza", re: /\b(sicuramente|certamente|senza dubbio|di sicuro|garantit|certificat|100\s?%)/i },
];

/** Controllo leggero (frasi vietate condivise con le guide). */
export function findForbiddenPhrases(text: string): LanguageViolation[] {
  const lower = text.toLowerCase();
  return FORBIDDEN_PHRASES.filter((p) => lower.includes(p)).map((p) => ({ rule: `frase-vietata:${p.trim()}`, excerpt: excerptAround(text, lower.indexOf(p)) }));
}

/** Controllo severo per testo generato da un modello linguistico. */
export function checkAiLanguage(text: string): LanguageViolation[] {
  const out = findForbiddenPhrases(text);
  for (const { rule, re } of AI_EXTRA_PATTERNS) {
    const m = re.exec(text);
    if (m) out.push({ rule, excerpt: excerptAround(text, m.index) });
  }
  return out;
}

function excerptAround(text: string, idx: number): string {
  const start = Math.max(0, idx - 30);
  return text.slice(start, idx + 50).replace(/\s+/g, " ").trim();
}

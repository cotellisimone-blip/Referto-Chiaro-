/**
 * Glossario di definizioni GENERALI dei termini di laboratorio.
 *
 * STATO: bozza editoriale, DA REVISIONE CLINICA prima di qualsiasi uso con dati reali.
 * Le definizioni descrivono che cosa misura un esame; non dicono che cosa significa
 * un valore per una persona specifica.
 */
export interface GlossaryEntry {
  key: string;
  matches: RegExp;
  definition: string;
  reviewStatus: "draft-needs-clinical-review";
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    key: "glicemia",
    matches: /^glicemia\b/i,
    definition:
      "La glicemia indica la quantità di glucosio (uno zucchero) presente nel sangue al momento del prelievo.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "hba1c",
    matches: /emoglobina glicata|hba1c/i,
    definition:
      "L'emoglobina glicata è un esame che riflette l'andamento medio del glucosio nel sangue nelle settimane precedenti al prelievo, non solo nel giorno dell'esame.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "colesterolo-ldl",
    matches: /colesterolo\s+ldl|\bldl\b/i,
    definition:
      "Il colesterolo LDL è una delle forme in cui il colesterolo viene trasportato nel sangue. Il referto ne riporta la concentrazione.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "colesterolo-totale",
    matches: /colesterolo\s+totale/i,
    definition:
      "Il colesterolo totale è una misura complessiva del colesterolo presente nel sangue, che comprende le sue diverse forme di trasporto.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "trigliceridi",
    matches: /^trigliceridi\b/i,
    definition: "I trigliceridi sono un tipo di grasso presente nel sangue. Il referto ne riporta la concentrazione.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "creatinina",
    matches: /^creatinina\b/i,
    definition:
      "La creatinina è una sostanza prodotta normalmente dai muscoli ed eliminata attraverso i reni. Il medico la considera, insieme ad altri elementi, quando valuta il funzionamento dei reni.",
    reviewStatus: "draft-needs-clinical-review",
  },
];

export function findGlossaryEntry(nameRaw: string): GlossaryEntry | null {
  return GLOSSARY.find((g) => g.matches.test(nameRaw.trim())) ?? null;
}

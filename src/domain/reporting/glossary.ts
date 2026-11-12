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
  {
    key: "colesterolo-hdl",
    matches: /colesterolo\s+hdl|\bhdl\b/i,
    definition: "Il colesterolo HDL è una delle forme in cui il colesterolo viene trasportato nel sangue. Il referto ne riporta la concentrazione.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "emoglobina",
    matches: /^emoglobina\b(?!\s+glicata)/i,
    definition: "L'emoglobina è la proteina dei globuli rossi che trasporta l'ossigeno. Il referto ne riporta la quantità nel sangue.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "ematocrito",
    matches: /^ematocrito\b/i,
    definition: "L'ematocrito indica quale parte del volume del sangue è occupata dai globuli rossi, espressa in percentuale.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "globuli-rossi",
    matches: /globuli\s+rossi|\brbc\b/i,
    definition: "I globuli rossi sono le cellule del sangue che trasportano l'ossigeno. Il referto ne riporta il numero per unità di volume.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "globuli-bianchi",
    matches: /globuli\s+bianchi|\bwbc\b/i,
    definition: "I globuli bianchi sono le cellule del sangue coinvolte nelle difese dell'organismo. Il referto ne riporta il numero per unità di volume.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "piastrine",
    matches: /^piastrine|\bplt\b/i,
    definition: "Le piastrine sono frammenti cellulari che partecipano alla coagulazione del sangue. Il referto ne riporta il numero per unità di volume.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "mcv",
    matches: /^mcv\b|volume\s+corpuscolare\s+medio/i,
    definition: "L'MCV (volume corpuscolare medio) descrive la dimensione media dei globuli rossi.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "ferritina",
    matches: /^ferritina\b/i,
    definition: "La ferritina è una proteina che immagazzina il ferro. Il suo valore nel sangue viene considerato dal medico quando valuta le riserve di ferro.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "tsh",
    matches: /^tsh\b/i,
    definition: "Il TSH è un ormone prodotto dall'ipofisi che regola l'attività della tiroide. Il referto ne riporta la concentrazione nel sangue.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "ft4",
    matches: /^ft4\b|tiroxina\s+libera/i,
    definition: "L'FT4 è la frazione libera della tiroxina, un ormone prodotto dalla tiroide.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "ft3",
    matches: /^ft3\b|triiodotironina\s+libera/i,
    definition: "L'FT3 è la frazione libera della triiodotironina, un ormone prodotto dalla tiroide.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "anti-tpo",
    matches: /anti-?tpo/i,
    definition: "Gli anticorpi anti-TPO sono anticorpi diretti contro un enzima della tiroide (la perossidasi tiroidea). Il referto ne riporta la quantità.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "ast",
    matches: /^ast\b|\bgot\b/i,
    definition: "L'AST (o GOT) è un enzima presente in diversi organi, tra cui il fegato. Il referto ne riporta l'attività nel sangue.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "alt",
    matches: /^alt\b|\bgpt\b/i,
    definition: "L'ALT (o GPT) è un enzima presente soprattutto nel fegato. Il referto ne riporta l'attività nel sangue.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "gamma-gt",
    matches: /gamma\s*-?\s*gt|\bggt\b/i,
    definition: "La gamma GT è un enzima presente nel fegato e nelle vie biliari. Il referto ne riporta l'attività nel sangue.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "bilirubina",
    matches: /^bilirubina/i,
    definition: "La bilirubina è una sostanza che deriva dalla normale degradazione dei globuli rossi ed è elaborata dal fegato. Il referto ne riporta la concentrazione.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "fosfatasi-alcalina",
    matches: /fosfatasi\s+alcalina|\balp\b/i,
    definition: "La fosfatasi alcalina è un enzima presente in vari tessuti, in particolare fegato e ossa. Il referto ne riporta l'attività nel sangue.",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    key: "albumina",
    matches: /^albumina\b/i,
    definition: "L'albumina è la proteina più abbondante nel sangue, prodotta dal fegato. Il referto ne riporta la concentrazione.",
    reviewStatus: "draft-needs-clinical-review",
  },
];

export function findGlossaryEntry(nameRaw: string): GlossaryEntry | null {
  return GLOSSARY.find((g) => g.matches.test(nameRaw.trim())) ?? null;
}

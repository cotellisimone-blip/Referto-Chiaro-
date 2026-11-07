import { z } from "zod";

/**
 * Schema delle guide agli esami. Ogni guida è una BOZZA EDITORIALE: spiega che cosa misura un esame
 * e come leggere il referto, mai che cosa significa un valore per una persona. La validazione
 * automatica (tests/unit/content.test.ts) blocca linguaggio diagnostico o prescrittivo.
 */
export const GUIDE_CATEGORIES = {
  "come-leggere": { title: "Come leggere un referto", lead: "Le basi: intervalli, unità, variabilità, che cosa chiedere." },
  emocromo: { title: "Emocromo", lead: "Globuli rossi, bianchi, piastrine e gli indici che li descrivono." },
  metabolismo: { title: "Glicemia e metabolismo", lead: "Zuccheri, emoglobina glicata, insulina." },
  lipidi: { title: "Colesterolo e lipidi", lead: "Colesterolo totale, HDL, LDL, trigliceridi." },
  fegato: { title: "Fegato", lead: "Transaminasi, gamma GT, bilirubina, proteine." },
  reni: { title: "Reni ed elettroliti", lead: "Creatinina, filtrato, urea, acido urico, sodio e potassio, urine." },
  tiroide: { title: "Tiroide", lead: "TSH, ormoni tiroidei, anticorpi." },
  ferro: { title: "Ferro e vitamine", lead: "Sideremia, ferritina, transferrina, B12, folati, vitamina D." },
  infiammazione: { title: "Infiammazione e coagulazione", lead: "PCR, VES, PT/INR, aPTT, fibrinogeno, D-dimero." },
  ormoni: { title: "Ormoni e altri esami", lead: "Cortisolo, prolattina, calcio, amilasi, PSA e altri." },
} as const;

export type GuideCategory = keyof typeof GUIDE_CATEGORIES;

const para = z.string().min(40).max(900);
const bullet = z.string().min(8).max(260);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const GuideSchema = z
  .object({
    slug,
    title: z.string().min(12).max(70),
    metaDescription: z.string().min(90).max(160),
    category: z.enum(Object.keys(GUIDE_CATEGORIES) as [GuideCategory, ...GuideCategory[]]),
    examName: z.string().min(2).max(60),
    aliases: z.array(z.string().min(2).max(60)).max(8),
    summary: z.string().min(80).max(320),
    sections: z.object({
      whatItMeasures: z.array(para).min(1).max(4),
      whyRequested: z.array(para).min(1).max(3),
      howToRead: z.array(para).min(1).max(4),
      factors: z.array(bullet).min(3).max(10),
    }),
    unitsAndRanges: z.object({
      commonUnits: z.array(z.string().min(1).max(24)).min(1).max(5),
      rangeNote: z.string().min(60).max(500),
    }),
    questionsForDoctor: z.array(bullet).min(3).max(7),
    faq: z.array(z.object({ q: z.string().min(10).max(140), a: z.string().min(40).max(600) })).min(2).max(6),
    relatedGuides: z.array(slug).max(6),
    glossaryTerms: z.array(slug).max(10),
    sources: z.array(z.object({ title: z.string().min(3).max(120), url: z.string().url() })).max(5),
    lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    reviewStatus: z.literal("draft-needs-clinical-review"),
  })
  .strict();

export type Guide = z.infer<typeof GuideSchema>;

/** Domini ammessi per le fonti: istituzioni sanitarie e risorse divulgative riconosciute. */
export const SOURCE_DOMAINS = ["iss.it", "epicentro.iss.it", "salute.gov.it", "aifa.gov.it", "who.int", "nhs.uk", "medlineplus.gov", "labtestsonline.it", "labtestsonline.org", "issalute.it"];

/**
 * Espressioni vietate: diagnosi, giudizi su «normale/anormale», terapie, promesse.
 * Applicate a tutto il testo di guide e glossario (minuscolo).
 */
export const FORBIDDEN_PHRASES = [
  "diagnosi di ",
  "ti diagnostic",
  "hai una malattia",
  "sei malat",
  "soffri di",
  "devi assumere",
  "devi prendere",
  "prendi un farmaco",
  "ti consiglio di",
  "ti consigliamo di",
  "dose di ",
  " mg al giorno",
  "valore normale",
  "valori normali",
  "nella norma",
  "è normale",
  "non è normale",
  "anormale",
  "patologico",
  "sicuramente",
  "senza dubbio",
  "garantit",
  "certificat",
  "100%",
  "cura definitiva",
  "guarisc",
  "lorem ipsum",
];

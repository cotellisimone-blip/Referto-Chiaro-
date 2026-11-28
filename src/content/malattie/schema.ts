import { z } from "zod";

/**
 * Pagine per malattia (22/11/2026, fase 1 del piano «Malattie»): dieci aree, una pagina principale ciascuna.
 *
 * Una domanda, una pagina: la GUIDA spiega un esame, la pagina di MALATTIA spiega una condizione e porta alle guide,
 * al diario, al glossario, alle domande per il medico e alla lettura del referto. Il testo non ricopia le guide.
 *
 * Ogni pagina è una BOZZA finché un medico identificato non la rivede: la pagina lo dice in cima, resta fuori da
 * Google (vedi `malattiaIndexable` in src/lib/seo.ts) e i dati strutturati non dichiarano nessun revisore.
 * Regole del testo: niente diagnosi sulla persona, niente terapie, dosi o consigli di cambiare una cura, fonti
 * istituzionali o di società scientifiche. Le blocca tests/unit/malattie.test.ts.
 */

export const MALATTIA_SLUGS = [
  "pressione-alta",
  "diabete",
  "mal-di-testa",
  "sonno",
  "peso",
  "asma",
  "colesterolo-alto",
  "tiroide",
  "anemia",
  "fegato-grasso",
] as const;
export type MalattiaSlug = (typeof MALATTIA_SLUGS)[number];

const para = z.string().min(40).max(900);
const bullet = z.string().min(8).max(260);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

/** Domini ammessi per le fonti: istituzioni sanitarie, società scientifiche, risorse divulgative pubbliche. */
export const MALATTIE_SOURCE_DOMAINS = [
  "issalute.it",
  "iss.it",
  "salute.gov.it",
  "nhs.uk",
  "medlineplus.gov",
  "who.int",
  "siia.it",
  "siditalia.it",
  "sisc.it",
  "sonnomed.it",
  "sio-obesita.org",
  "sipirs.it",
  "heartfailurematters.org",
  "wiley.com",
];

export const RevisioneSchema = z.discriminatedUnion("stato", [
  z.object({ stato: z.literal("bozza") }),
  z.object({
    stato: z.literal("rivista"),
    /** Nome e cognome come compaiono nella pagina del revisore. */
    medico: z.string().min(5),
    qualifica: z.string().min(5),
    /** Ordine dei medici e numero di iscrizione. */
    ordine: z.string().min(5),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    prossima: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
]);

export const MalattiaSchema = z
  .object({
    slug: z.enum(MALATTIA_SLUGS),
    /** Nome dell'area nella sezione (es. «Pressione e cuore»). */
    area: z.string().min(4).max(28),
    /** Nome della condizione come la dice la gente. */
    nome: z.string().min(4).max(40),
    /** Nome medico, nel titolo e nei dati strutturati. */
    nomeMedico: z.string().min(4).max(60),
    /** Altri nomi della stessa condizione (dati strutturati e ricerca). */
    altriNomi: z.array(z.string().min(3).max(60)).max(6),
    tono: z.enum(["mi", "in", "sc", "vi", "al", "es", "sh", "gu"]),
    icona: z.string().min(3),
    /** Una riga per la scheda della sezione. */
    riga: z.string().min(40).max(130),
    /** Titolo per Google, SENZA il nome del sito: con « · Cura Privata» deve stare in 65 caratteri. */
    seoTitle: z.string().min(20).max(50),
    metaDescription: z.string().min(110).max(160),
    titolo: z.string().min(4).max(40),
    em: z.string().min(4).max(48),
    /** Tre righe che rispondono subito. */
    inBreve: z.array(z.string().min(30).max(220)).length(3),
    cheCose: z.array(para).min(2).max(4),
    /** Soglie pubblicate dalle società scientifiche, quando servono a capire (non a giudicare un valore). */
    inNumeri: z
      .object({
        titolo: z.string().min(10).max(80),
        intro: z.string().min(40).max(320),
        colonne: z.tuple([z.string().min(2), z.string().min(2)]),
        righe: z.array(z.object({ etichetta: z.string().min(2).max(60), valore: z.string().min(2).max(60) })).min(3).max(8),
        nota: z.string().min(40).max(400),
      })
      .optional(),
    comeSiManifesta: z.object({ testo: z.array(para).min(1).max(3), segni: z.array(bullet).min(3).max(8) }),
    quandoChiamare: z.object({ subito: z.array(bullet).min(2).max(6), presto: z.array(bullet).min(2).max(6) }),
    /** Gli esami di cui si parla, con la guida già nel sito. */
    esami: z.array(z.object({ guida: slug, perche: z.string().min(20).max(170) })).max(7),
    /** Quando non c'è una guida adatta, due righe su che cosa può proporre il medico. */
    esamiNota: z.string().min(40).max(400).optional(),
    /** Che cosa fa la differenza ogni giorno: informazioni generali, mai consigli su misura. */
    ogniGiorno: z.array(para).min(1).max(4),
    diario: z.object({ slug: z.enum(["pressione", "glicemia", "cefalea", "sonno", "peso", "respiro"]), testo: z.string().min(40).max(260) }).optional(),
    domande: z.array(bullet).min(4).max(7),
    faq: z.array(z.object({ d: z.string().min(10).max(140), r: z.string().min(40).max(700) })).min(3).max(5),
    glossario: z.array(slug).max(10),
    correlate: z.array(z.enum(MALATTIA_SLUGS)).min(1).max(4),
    /** Frasi che la gente scrive davvero (ricerca del sito e titoletti). */
    ricerche: z.array(z.string().min(3).max(60)).min(4).max(24),
    fonti: z.array(z.object({ ente: z.string().min(2).max(60), titolo: z.string().min(3).max(120), url: z.string().url() })).min(2).max(6),
    aggiornato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    revisione: RevisioneSchema,
  })
  .strict();

export type Malattia = z.infer<typeof MalattiaSchema>;

/**
 * Parole in più vietate nelle pagine di malattia, oltre a FORBIDDEN_PHRASES delle guide: niente ordini, niente cure,
 * niente dosi, niente promesse. «Parlane con il medico» è il registro giusto.
 */
export const MALATTIE_EXTRA_FORBIDDEN: { regola: string; re: RegExp }[] = [
  { regola: "ordine", re: /\b(devi|dovresti|ti conviene)\b/i },
  { regola: "cura-da-cambiare", re: /\b(sospend|interromp[ie]\s+(la|il)\s+(cura|terapia|farmaco)|cambia(re)?\s+(la|il)\s+(cura|terapia|dose|farmaco)|riduci\s+la\s+dose|aumenta\s+la\s+dose)/i },
  { regola: "dose", re: /\b\d+([.,]\d+)?\s?(mg|mcg|µg|ui)\b(?!\s?\/)/i },
  { regola: "rimedi", re: /\b(rimedi[oi]? naturali|cura naturale|cure naturali|miracolos)/i },
  { regola: "giudizio-sulla-persona", re: /\b(hai il diabete|hai l'anemia|sei iperteso|sei diabetic|sei anemic)\b/i },
];

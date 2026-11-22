import { z } from "zod";
import { RevisioneSchema } from "@/content/malattie/schema";

/**
 * Sezione sonno (22/11/2026), sotto /malattie/sonno/{argomento}: la pagina «Insonnia» resta il capo dell'area e porta
 * qui. Tre famiglie di pagine:
 * - PROBLEMA: si entra da ciò che si vive («non mi addormento», «russo e sono stanco»…);
 * - SPIEGAZIONE: come funziona il sonno, la terapia cognitivo-comportamentale, i farmaci, le apnee, l'esame del sonno,
 *   quando andare dal medico;
 * - PERCORSO: le due settimane (autovalutazione → diario → foglio per il medico).
 * Più le AUTOVALUTAZIONI, che hanno un loro schema (autovalutazioni.ts).
 *
 * Regole del testo (le controlla tests/unit/sonno.test.ts): niente diagnosi sulla persona, niente terapie su misura
 * (in particolare nessun orario di «restrizione del sonno» calcolato per chi legge: farebbe del sito un dispositivo
 * medico), nessun farmaco consigliato né dosi; fonti istituzionali o di società scientifiche. Tutto in BOZZA finché un
 * medico non firma.
 */

export const SONNO_ARGOMENTI = [
  // Problemi
  "non-mi-addormento",
  "mi-sveglio-di-notte",
  "russo-e-sono-stanco",
  "lavoro-a-turni",
  "gambe-senza-riposo",
  // Percorso
  "percorso-due-settimane",
  // Spiegazioni
  "come-funziona-il-sonno",
  "terapia-cognitivo-comportamentale",
  "farmaci-e-melatonina",
  "apnee-notturne",
  "esame-del-sonno",
  "quando-andare-dal-medico",
] as const;
export type SonnoArgomento = (typeof SONNO_ARGOMENTI)[number];

export const AUTOVALUTAZIONI_SLUG = ["autovalutazione-insonnia", "autovalutazione-sonnolenza", "autovalutazione-apnee", "autovalutazione-gambe"] as const;
export type AutovalutazioneSlug = (typeof AUTOVALUTAZIONI_SLUG)[number];

const para = z.string().min(40).max(950);
const bullet = z.string().min(8).max(300);

export const BloccoSchema = z.union([
  z.object({ p: para }).strict(),
  z.object({ punti: z.array(bullet).min(2).max(9), stile: z.enum(["segni", "numeri"]).optional() }).strict(),
  z
    .object({
      tabella: z.object({
        colonne: z.array(z.string().min(2).max(40)).min(2).max(4),
        righe: z.array(z.array(z.string().min(1).max(200)).min(2).max(4)).min(2).max(9),
      }),
      nota: z.string().min(30).max(420).optional(),
    })
    .strict(),
  z.object({ riquadro: z.object({ tono: z.enum(["nota", "attenzione", "fonte"]), titolo: z.string().min(6).max(90), testo: z.string().min(30).max(700) }) }).strict(),
  /** Collegamento in evidenza: dentro il sito (comincia con «/»). */
  z.object({ vai: z.object({ href: z.string().regex(/^\/[a-z0-9\-/?=,]*$/), titolo: z.string().min(6).max(80), testo: z.string().min(20).max(220) }) }).strict(),
  /** Le fasi di una notte, disegnate (solo nella pagina «come funziona il sonno»). */
  z.object({ disegno: z.enum(["ipnogramma", "due-processi"]) }).strict(),
]);
export type Blocco = z.infer<typeof BloccoSchema>;

export const SonnoPaginaSchema = z
  .object({
    slug: z.enum(SONNO_ARGOMENTI),
    tipo: z.enum(["problema", "spiegazione", "percorso"]),
    /** Come la scheda si presenta nella porta d'ingresso: la frase di chi la vive. */
    porta: z.string().min(6).max(48),
    icona: z.string().min(3),
    riga: z.string().min(40).max(140),
    seoTitle: z.string().min(20).max(50),
    metaDescription: z.string().min(110).max(160),
    titolo: z.string().min(4).max(48),
    em: z.string().min(4).max(56),
    inBreve: z.array(z.string().min(30).max(240)).length(3),
    sezioni: z
      .array(
        z
          .object({
            id: z.string().regex(/^[a-z0-9-]+$/),
            kicker: z.string().min(3).max(40),
            titolo: z.string().min(4).max(70),
            blocchi: z.array(BloccoSchema).min(1).max(8),
          })
          .strict(),
      )
      .min(2)
      .max(7),
    quandoChiamare: z.object({ subito: z.array(bullet).min(1).max(5), presto: z.array(bullet).min(1).max(6) }).strict().optional(),
    /** L'autovalutazione da proporre, se c'è. */
    autovalutazione: z.enum(AUTOVALUTAZIONI_SLUG).optional(),
    domande: z.array(bullet).min(3).max(7),
    faq: z.array(z.object({ d: z.string().min(10).max(140), r: z.string().min(40).max(700) }).strict()).max(4),
    correlate: z.array(z.enum(SONNO_ARGOMENTI)).min(2).max(4),
    ricerche: z.array(z.string().min(3).max(60)).min(3).max(16),
    fonti: z.array(z.object({ ente: z.string().min(2).max(70), titolo: z.string().min(3).max(140), url: z.string().url() }).strict()).min(2).max(7),
    aggiornato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    revisione: RevisioneSchema,
  })
  .strict();
export type SonnoPagina = z.infer<typeof SonnoPaginaSchema>;

/**
 * Autovalutazioni: domande SCRITTE DA NOI, che seguono i temi dei questionari validati senza ricopiarli (ISI, Epworth,
 * STOP-Bang e i criteri IRLSSG sono protetti o hanno una loro forma ufficiale). Non sono validate: orientano e
 * aiutano a parlarne con il medico, non danno un punteggio ufficiale né una diagnosi.
 */
export const AutovalutazioneSchema = z
  .object({
    slug: z.enum(AUTOVALUTAZIONI_SLUG),
    porta: z.string().min(6).max(40),
    titolo: z.string().min(4).max(48),
    em: z.string().min(4).max(48),
    seoTitle: z.string().min(20).max(50),
    metaDescription: z.string().min(110).max(160),
    intro: z.string().min(60).max(420),
    /** Il periodo a cui pensare rispondendo. */
    periodo: z.string().min(10).max(120),
    /** Il questionario validato a cui si ispira e perché non è quello. */
    ispirazione: z.object({ nome: z.string().min(4).max(120), nota: z.string().min(60).max(420) }).strict(),
    domande: z
      .array(
        z
          .object({
            id: z.string().regex(/^[a-z0-9-]+$/),
            t: z.string().min(10).max(220),
            aiuto: z.string().min(10).max(200).optional(),
            opzioni: z.array(z.object({ l: z.string().min(1).max(60), v: z.number().int().min(0).max(3) }).strict()).min(2).max(5),
            /** Le domande fuori punteggio servono per gli avvisi (es. la guida). */
            contaNelPunteggio: z.boolean().default(true),
          })
          .strict(),
      )
      .min(4)
      .max(10),
    fasce: z
      .array(z.object({ min: z.number().int().min(0), max: z.number().int().min(0), titolo: z.string().min(6).max(60), testo: z.string().min(40).max(480) }).strict())
      .length(3),
    /** Avvisi che scattano con una risposta precisa, qualunque sia il punteggio. */
    avvisi: z
      .array(
        z
          .object({
            domanda: z.string(),
            daValore: z.number().int().min(0).max(3),
            tono: z.enum(["attenzione", "nota"]),
            titolo: z.string().min(6).max(80),
            testo: z.string().min(30).max(420),
          })
          .strict(),
      )
      .max(3),
    /** Dove andare dopo. */
    poi: z.array(z.object({ href: z.string().regex(/^\/[a-z0-9\-/?=,]*$/), label: z.string().min(4).max(60) }).strict()).min(1).max(3),
    fonti: z.array(z.object({ ente: z.string().min(2).max(70), titolo: z.string().min(3).max(140), url: z.string().url() }).strict()).min(2).max(5),
    aggiornato: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    revisione: RevisioneSchema,
  })
  .strict();
export type Autovalutazione = z.input<typeof AutovalutazioneSchema>;

/** Domini ammessi per le fonti della sezione sonno, oltre a quelli delle pagine di malattia. */
export const SONNO_SOURCE_DOMAINS_EXTRA = [
  "aasm.org",
  "sleepeducation.org",
  "esrs.eu",
  "irlssg.org",
  "academic.oup.com",
  "jcsm.aasm.org",
  "ema.europa.eu",
  "aifa.gov.it",
  "nice.org.uk",
  "cdc.gov",
  "ncbi.nlm.nih.gov",
  "eur-lex.europa.eu",
];

/**
 * Frasi vietate in più nella sezione sonno: niente prescrizione di orari di restrizione del sonno calcolati per chi
 * legge, niente «prendi» un farmaco, niente diagnosi dal questionario.
 */
export const SONNO_EXTRA_FORBIDDEN: { regola: string; re: RegExp }[] = [
  { regola: "orario-su-misura", re: /\b(la tua finestra di sonno|il tuo orario di sonno|vai a letto alle \d|alzati alle \d)/i },
  { regola: "prendi-farmaco", re: /\b(prendi|assumi|prova)\s+(la |il |un |una )?(melatonina|sonnifer|benzodiazepin|zolpidem|antistaminic|daridorexant)/i },
  { regola: "diagnosi-da-test", re: /\b(hai l'insonnia|hai le apnee|soffri di apnee|hai la sindrome|sei insonne)\b/i },
];

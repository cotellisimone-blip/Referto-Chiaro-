/**
 * «Punto di Partenza» (pacchetto V3, 11/11/2026): contenuti curati e versionati, NON generati dall'AI.
 * Struttura editoriale iniziale dalla Knowledge Base V1 del pacchetto: prima del lancio pubblico va
 * revisionata da un medico identificato (vedi docs/PRODUCTION_GATES.md). Niente prescrizioni, niente
 * diagnosi, niente rischio individuale: le etichette descrivono la natura dell'approfondimento, non la persona.
 */

export const PDP_CONTENT_VERSION = "2026-11-11.v1";

export type AreaCategory = "base" | "contextual" | "not-routine";

export type ReviewStatus = "bozza-in-attesa-di-revisione" | "revisionato";

export interface ReviewMeta {
  sourceLabel: string;
  sourceUrl: string;
  reviewStatus: ReviewStatus;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface Area extends ReviewMeta {
  id: AreaId;
  n: number;
  title: string;
  category: Exclude<AreaCategory, "not-routine">;
  /** Una riga, per la card. */
  short: string;
  whyItMatters: string;
  whatToDiscuss: string;
  /** Solo esempi di controlli comunemente utilizzati, mai una lista da fare. */
  examples: string[];
}

export type AreaId = "pressione" | "glicemia" | "lipidi" | "ematologia" | "rene" | "fegato" | "ferro" | "tiroide" | "urine" | "screening";

export const CATEGORY_LABEL: Record<AreaCategory, string> = {
  base: "Base",
  contextual: "Contestuale",
  "not-routine": "Non di routine",
};

export const CATEGORY_HINT: Record<AreaCategory, string> = {
  base: "Temi generali, solidamente riconosciuti: se ne parla con il medico in quasi ogni percorso.",
  contextual: "Hanno senso in alcune persone o situazioni: è il medico a valutare se riguardano te.",
  "not-routine": "Non vanno proposti in modo automatico a chi non ha disturbi o un sospetto clinico.",
};

const DRAFT: Pick<ReviewMeta, "reviewStatus" | "reviewedAt" | "reviewedBy"> = { reviewStatus: "bozza-in-attesa-di-revisione", reviewedAt: null, reviewedBy: null };
const MINSAL = {
  sourceLabel: "Ministero della Salute — La prevenzione primaria nell'adulto 30–65 anni",
  sourceUrl: "https://www.salute.gov.it/new/it/tema/malattie-cardio-cerebrovascolari/la-prevenzione-primaria-nelladulto-30-65-anni/",
};
const CHOOSING = { sourceLabel: "Choosing Wisely Italia — raccomandazioni di appropriatezza", sourceUrl: "https://choosingwiselyitaly.org/raccomandazioni/" };
const ISS = { sourceLabel: "ISSalute — Istituto Superiore di Sanità", sourceUrl: "https://www.issalute.it/" };

export const AREAS: Area[] = [
  {
    id: "pressione",
    n: 1,
    title: "Pressione e cuore",
    category: "base",
    short: "Pressione, abitudini e familiarità: il punto di partenza di ogni conversazione sul cuore.",
    whyItMatters: "La pressione arteriosa e le abitudini di vita sono tra le informazioni che il medico usa più spesso per inquadrare la salute di cuore e circolazione.",
    whatToDiscuss: "Valori di pressione recenti, frequenza o ritmo se li conosci, fumo, attività fisica e familiarità.",
    examples: ["Misurazione della pressione", "Glicemia e profilo lipidico, quando appropriati"],
    ...MINSAL,
    ...DRAFT,
  },
  {
    id: "glicemia",
    n: 2,
    title: "Metabolismo degli zuccheri",
    category: "base",
    short: "Come il corpo gestisce gli zuccheri: un tema generale, di cui parlare con il medico.",
    whyItMatters: "Il metabolismo degli zuccheri è uno dei temi generali della prevenzione nell'adulto.",
    whatToDiscuss: "Se hai valori recenti di glicemia e se, nel tuo contesto, il medico ritiene utile qualche altro controllo.",
    examples: ["Glicemia", "Emoglobina glicata (HbA1c), quando indicata dal contesto"],
    ...MINSAL,
    ...DRAFT,
  },
  {
    id: "lipidi",
    n: 3,
    title: "Colesterolo e grassi nel sangue",
    category: "base",
    short: "Colesterolo e trigliceridi: un tema generale della prevenzione.",
    whyItMatters: "I grassi nel sangue fanno parte delle informazioni generali che il medico considera parlando di cuore e circolazione.",
    whatToDiscuss: "Se hai un profilo lipidico recente e come leggerlo insieme alle altre informazioni.",
    examples: ["Colesterolo totale", "Colesterolo HDL e LDL", "Trigliceridi"],
    ...MINSAL,
    ...DRAFT,
  },
  {
    id: "ematologia",
    n: 4,
    title: "Sangue (emocromo)",
    category: "contextual",
    short: "L'emocromo è un esame comune: utile in molti contesti, non un controllo che «esclude» malattie.",
    whyItMatters: "L'emocromo descrive le cellule del sangue. È tra gli esami più richiesti, ma un risultato nei limiti non esclude da solo una malattia.",
    whatToDiscuss: "Se hai un emocromo recente e, se il medico lo ritiene utile, in quale contesto ripeterlo.",
    examples: ["Emocromo"],
    ...ISS,
    ...DRAFT,
  },
  {
    id: "rene",
    n: 5,
    title: "Reni",
    category: "contextual",
    short: "Ha senso approfondire in alcuni contesti, che valuta il medico.",
    whyItMatters: "La funzione dei reni si valuta con pochi esami comuni; la loro utilità dipende dalla storia e dal contesto della persona.",
    whatToDiscuss: "Se nel tuo caso il medico ritiene pertinente un controllo della funzione renale.",
    examples: ["Creatinina con stima del filtrato (eGFR)", "Esame urine o albuminuria, solo quando pertinenti"],
    ...ISS,
    ...DRAFT,
  },
  {
    id: "fegato",
    n: 6,
    title: "Fegato",
    category: "contextual",
    short: "Alcuni parametri comuni, da scegliere in base al contesto: non un pannello uguale per tutti.",
    whyItMatters: "Esistono parametri comunemente usati per il fegato, ma non c'è un pannello universale valido per chiunque.",
    whatToDiscuss: "Se, considerando abitudini e storia, il medico ritiene utile qualche parametro epatico.",
    examples: ["ALT e AST", "GGT", "Bilirubina o fosfatasi alcalina, secondo il contesto"],
    ...ISS,
    ...DRAFT,
  },
  {
    id: "ferro",
    n: 7,
    title: "Ferro",
    category: "contextual",
    short: "Se ne parla quando storia, disturbi o un emocromo lo rendono utile.",
    whyItMatters: "Le riserve di ferro si studiano quando c'è un motivo per farlo: la storia della persona, alcuni disturbi o un emocromo.",
    whatToDiscuss: "Se nel tuo caso ha senso discutere delle riserve di ferro.",
    examples: ["Ferritina e assetto del ferro, se il medico lo ritiene utile"],
    ...ISS,
    ...DRAFT,
  },
  {
    id: "tiroide",
    n: 8,
    title: "Tiroide",
    category: "contextual",
    short: "Quando è clinicamente indicato, in genere si parte dal TSH: niente pannelli estesi a caso.",
    whyItMatters: "La tiroide si studia quando c'è un'indicazione clinica; in genere il primo esame è il TSH.",
    whatToDiscuss: "Se ci sono motivi per valutare la tiroide e da quale esame partire.",
    examples: ["TSH o TSH reflex, se clinicamente indicato"],
    ...CHOOSING,
    ...DRAFT,
  },
  {
    id: "urine",
    n: 9,
    title: "Urine",
    category: "contextual",
    short: "Utile in contesti specifici: non è uno «scanner» generale dell'organismo.",
    whyItMatters: "L'esame delle urine può essere utile in situazioni precise, ma non fotografa lo stato di tutto l'organismo.",
    whatToDiscuss: "Se nel tuo contesto il medico ritiene pertinente un esame delle urine.",
    examples: ["Esame urine completo, quando pertinente"],
    ...ISS,
    ...DRAFT,
  },
  {
    id: "screening",
    n: 10,
    title: "Screening per età e profilo",
    category: "base",
    short: "Non è un singolo esame: sono i programmi previsti per età, sesso e storia personale.",
    whyItMatters: "I programmi di screening organizzati cambiano con l'età, il sesso e alcuni fattori personali. Spesso è la ASL a invitarti.",
    whatToDiscuss: "Quali programmi di screening sono previsti per te e se hai già aderito agli inviti ricevuti.",
    examples: ["Programmi di screening organizzati della tua Regione"],
    sourceLabel: "Osservatorio Nazionale Screening",
    sourceUrl: "https://www.osservatorionazionalescreening.it/",
    ...DRAFT,
  },
];

/** Box «Più esami non significa più prevenzione»: esempi da NON proporre automaticamente a chi non ha disturbi. */
export const NOT_ROUTINE: { id: string; title: string; why: string }[] = [
  { id: "marcatori", title: "Marcatori tumorali", why: "Negli asintomatici non servono a scoprire un tumore e possono dare falsi allarmi." },
  { id: "vitamina-d", title: "Vitamina D senza un'indicazione specifica", why: "Il dosaggio ha senso quando c'è un motivo clinico preciso." },
  { id: "tiroide-estesa", title: "Pannelli tiroidei estesi «a tappeto»", why: "Quando serve, in genere si parte dal TSH." },
  { id: "cortisolo", title: "Cortisolo o ACTH a orari casuali", why: "Senza un sospetto clinico e un protocollo preciso il risultato è difficile da interpretare." },
  { id: "autoimmuni", title: "Test autoimmuni e altri pannelli estesi", why: "Senza un sospetto clinico aumentano i risultati dubbi, non la prevenzione." },
];
export const NOT_ROUTINE_SOURCE = CHOOSING;

// ── Domande del questionario ───────────────────────────────────────────────

export type GoalId = "benessere" | "organizzare" | "documentazione" | "medico";
export const GOALS: { id: GoalId; label: string; hint: string }[] = [
  { id: "benessere", label: "Prevenzione e benessere generale", hint: "Voglio un quadro semplice da cui partire." },
  { id: "organizzare", label: "Organizzare meglio i miei controlli", hint: "Ho fatto controlli in passato, senza un ordine." },
  { id: "documentazione", label: "Capire cosa manca nella mia documentazione", hint: "Ho già alcuni esami e voglio metterli in fila." },
  { id: "medico", label: "Prepararmi a parlarne con il medico", hint: "Ho una visita in vista e voglio arrivarci pronto." },
];

export type HaveId = "pressione" | "peso" | "sangue" | "urine" | "screening" | "nessuno";
export const HAVE: { id: HaveId; label: string; /** Aree che l'informazione documenta (proposta modificabile). */ areas: AreaId[] }[] = [
  { id: "pressione", label: "Una misurazione recente della pressione", areas: ["pressione"] },
  { id: "peso", label: "Peso e circonferenza della vita", areas: [] },
  { id: "sangue", label: "Esami del sangue recenti", areas: [] },
  { id: "urine", label: "Un esame delle urine", areas: ["urine"] },
  { id: "screening", label: "Gli screening previsti per la mia età", areas: ["screening"] },
  { id: "nessuno", label: "Nessuno di questi, o non ricordo", areas: [] },
];

export const NOT_SAID = "non-indicato" as const;

export type AgeBand = "18-29" | "30-49" | "50-64" | "65+" | typeof NOT_SAID;
export type Smoke = "no" | "si" | "ex" | typeof NOT_SAID;
export type Activity = "regolare" | "a-volte" | "raramente" | typeof NOT_SAID;
export type Familiarity = "si" | "no" | "non-so";
export type Conditions = "si" | "no" | typeof NOT_SAID;

export interface ContextAnswers {
  age: AgeBand | null;
  smoke: Smoke | null;
  activity: Activity | null;
  familiarity: Familiarity | null;
  conditions: Conditions | null;
}

export const CONTEXT_QUESTIONS = [
  {
    key: "age",
    label: "Fascia d'età",
    options: [
      { v: "18-29", label: "18–29" },
      { v: "30-49", label: "30–49" },
      { v: "50-64", label: "50–64" },
      { v: "65+", label: "65 o più" },
      { v: NOT_SAID, label: "Preferisco non indicarla" },
    ],
  },
  {
    key: "smoke",
    label: "Fumi?",
    options: [
      { v: "no", label: "No" },
      { v: "si", label: "Sì" },
      { v: "ex", label: "Ho smesso" },
      { v: NOT_SAID, label: "Preferisco non indicarlo" },
    ],
  },
  {
    key: "activity",
    label: "Fai attività fisica?",
    options: [
      { v: "regolare", label: "Regolarmente" },
      { v: "a-volte", label: "Ogni tanto" },
      { v: "raramente", label: "Raramente" },
      { v: NOT_SAID, label: "Preferisco non indicarlo" },
    ],
  },
  {
    key: "familiarity",
    label: "In famiglia ci sono problemi di cuore, pressione, colesterolo o diabete?",
    options: [
      { v: "si", label: "Sì" },
      { v: "no", label: "No" },
      { v: "non-so", label: "Non so" },
    ],
  },
  {
    key: "conditions",
    label: "Hai condizioni di salute già note e seguite da un medico?",
    options: [
      { v: "si", label: "Sì" },
      { v: "no", label: "No" },
      { v: NOT_SAID, label: "Preferisco non indicarlo" },
    ],
  },
] as const satisfies readonly { key: keyof ContextAnswers; label: string; options: readonly { v: string; label: string }[] }[];

// ── Note e domande per il medico (scelte da regole fisse) ─────────────────

/** Note che compaiono accanto a un'area quando una risposta la rende un tema da citare al medico. Mai un giudizio. */
export const AREA_NOTES = {
  smoke: { areas: ["pressione"] as AreaId[], text: "Hai indicato il fumo: è un'informazione che il medico considera parlando di cuore e circolazione." },
  activity: { areas: ["pressione", "glicemia"] as AreaId[], text: "Hai indicato poca attività fisica: è un tema da condividere con il medico." },
  familiarity: { areas: ["pressione", "glicemia", "lipidi"] as AreaId[], text: "Hai indicato una familiarità: riferiscila al medico, che saprà come tenerne conto." },
  age: { areas: ["screening"] as AreaId[], text: "Chiedi quali programmi di screening sono previsti per la tua fascia d'età." },
} as const;

export const CONDITIONS_NOTE = "Hai indicato condizioni già note: porta con te la documentazione. Sarà il medico a dire quali aree contano di più nel tuo caso.";

export const DOCTOR_QUESTIONS = {
  base: "Considerando età, abitudini e storia familiare, di quali di queste aree ha senso parlare per prime?",
  screening: "Quali programmi di screening sono previsti per me, e a quali ho già aderito?",
  haveExams: "Gli esami che ho già sono sufficienti per avere un quadro, o ha senso aggiornarne qualcuno?",
  noExams: "Da quali controlli generali ha senso partire, nel mio caso?",
  habits: "Su quali abitudini, come fumo o attività fisica, conviene lavorare per prime?",
  familiarity: "La mia familiarità cambia qualcosa nei controlli da considerare?",
  timing: "Quando ritiene utile rivedere questi temi insieme?",
  organize: "Come posso tenere in ordine i miei esami, per portarli alle prossime visite?",
} as const;

export const PDP_DISCLAIMER =
  "Punto di Partenza è uno strumento informativo, non diagnostico. Non prescrive esami, non valuta il rischio e non sostituisce il medico. I contenuti sono una bozza editoriale in attesa di revisione medica.";

export const COMPLETENESS_NOTE = "Misura quanto è completa la mappa che hai costruito, non il tuo stato di salute.";

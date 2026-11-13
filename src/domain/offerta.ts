/**
 * L'offerta di Cura Privata: i tre servizi protagonisti («Capisci. Parla con un medico. Chiedi un secondo parere.»).
 * È l'UNICA fonte per nomi, frasi, tempi e prezzi: home, pagine servizio, /prezzi, selettore, area personale e
 * ordini leggono da qui. Per cambiare un prezzo si cambia una variabile d'ambiente, non decine di componenti.
 *
 * Listino «Evoluzione v2» indicato dal titolare l'11/11/2026 (sostituisce 49/89/149 del 9/11):
 * - Capisci il tuo referto: primo referto 2,90 € (una volta per cliente), poi 7,90 €. Digitale e automatico,
 *   NESSUNA revisione umana.
 * - Parla con un medico: 79 €, medico di medicina generale/internista di orientamento.
 * - Chiedi un secondo parere: da 149 €, specialista della disciplina appropriata.
 * Livelli del percorso: CAPISCI → ORIENTATI → APPROFONDISCI (si può entrare da qualunque livello).
 *
 * Listino «Medico a domicilio» (12/11/2026, sostituisce 79 € e «da 149 €»): videoconsulto con medico generalista 69 €,
 * secondo parere specialistico 149 € fisso (documenti + videoconsulto + sintesi scritta), visita a domicilio 149 €
 * (src/domain/prestazioni/listino.ts). Gli importi già confermati restano quelli registrati nella richiesta.
 */

/** Prezzi in centesimi: l'unico punto in cui sono scritti. Ognuno è sovrascrivibile da variabile d'ambiente. */
export const PRICES = {
  CAPISCI_STANDARD: 790,
  CAPISCI_FIRST: 290,
  MEDICO_GENERALISTA: 6900,
  SECONDO_PARERE_BASE: 14900,
} as const;

export type CoreServiceId = "capisci" | "secondo-parere" | "parla-con-un-medico";

/** Servizio interno dell'ordine (tabella orders.service) collegato a ciascun servizio pubblico. */
export type OrderServiceKey = "essenziale" | "secondo-parere" | "videoconsulto";

export interface CoreService {
  id: CoreServiceId;
  /** Verbo del payoff: è la parola che l'utente deve ricordare. */
  verb: string;
  name: string;
  /** Il servizio in una frase. */
  oneLiner: string;
  /** Per chi è, in una frase che parte dal bisogno. */
  forWhom: string;
  href: string;
  /** Dove si comincia davvero (area personale). */
  startHref: string;
  startLabel: string;
  orderService: OrderServiceKey;
  envPriceKey: string;
  defaultPriceCents: number;
  /** Tempi indicativi, sempre «di norma»: mai una promessa. */
  timing: string;
  /** Chi se ne occupa. */
  who: string;
  includes: string[];
  receives: string;
  notFor: string[];
  steps: { title: string; text: string }[];
  icon: "file" | "stethoscope" | "video";
  tone: "capisci" | "parere" | "medico";
  /** Livello del percorso Capisci → Orientati → Approfondisci. */
  level: { n: 1 | 2 | 3; verb: "Capisci" | "Orientati" | "Approfondisci" };
  /** «fixed» = prezzo esatto; «from» = prezzo base («da»). */
  priceKind: "fixed" | "from";
  /** Il bisogno, in prima persona, per il selettore e le pagine. */
  need: string;
}

export const CORE_SERVICES: CoreService[] = [
  {
    id: "capisci",
    verb: "Capisci.",
    name: "Capisci il tuo referto",
    oneLiner: "Il tuo referto di laboratorio diventa un report ordinato: valori, sigle, spiegazioni in parole semplici e domande utili per il medico.",
    forWhom: "Hai ricevuto un referto pieno di sigle e valori e vuoi capirlo.",
    href: "/referti",
    startHref: "/area-personale/nuovo",
    startLabel: "Carica il referto",
    orderService: "essenziale",
    envPriceKey: "PRICE_CAPISCI_CENTS",
    defaultPriceCents: PRICES.CAPISCI_STANDARD,
    timing: "Di norma in pochi minuti dal pagamento",
    who: "Servizio digitale e automatico, con regole controllate: nessun medico lo rivede. I numeri restano quelli del documento.",
    includes: [
      "Ogni valore riportato esattamente come nel referto, con unità, intervallo, pagina e riga",
      "Sigle e termini spiegati in italiano di tutti i giorni",
      "Dove si colloca ogni valore rispetto all'intervallo stampato, senza giudizi",
      "Da 3 a 5 domande da fare al tuo medico",
      "Un report PDF da stampare o mostrare in visita, salvato nella tua area personale",
    ],
    receives: "Un report chiaro nella tua area personale, che resta tuo e che puoi riusare con un medico.",
    notFor: ["Diagnosi o giudizi sulla tua salute", "Indicazioni su farmaci o terapie", "Immagini diagnostiche, referti istologici o genetici"],
    steps: [
      { title: "Carichi il referto", text: "Un PDF o una foto, dall'area personale." },
      { title: "Controlli i valori", text: "Li confermi uno per uno: spieghiamo solo quelli." },
      { title: "Ricevi il report", text: "In parole semplici, con le domande per il medico." },
    ],
    icon: "file",
    tone: "capisci",
    level: { n: 1, verb: "Capisci" },
    priceKind: "fixed",
    need: "Ho un referto che non capisco",
  },
  {
    id: "parla-con-un-medico",
    verb: "Parla con un medico.",
    name: "Videoconsulto con medico generalista",
    oneLiner: "Un medico di medicina generale legge prima i tuoi documenti e ti dedica un videoconsulto su appuntamento per chiarire i dubbi e capire il prossimo passo.",
    forWhom: "Hai dei dubbi e non sai quale specialista ti serve.",
    href: "/servizi/parla-con-un-medico",
    startHref: "/richiedi/videoconsulto",
    startLabel: "Prenota il videoconsulto",
    orderService: "videoconsulto",
    envPriceKey: "PRICE_VIDEOCONSULTO_CENTS",
    defaultPriceCents: PRICES.MEDICO_GENERALISTA,
    timing: "Di norma un appuntamento entro 3 giorni lavorativi",
    who: "Un medico di medicina generale o internista, abilitato e identificabile, con i tuoi documenti già davanti. Non devi scegliere tu la specialità.",
    includes: [
      "Circa 20–25 minuti di videoconsulto",
      "Il medico legge prima i documenti che scegli tu",
      "Chiarisce i tuoi dubbi e ti orienta sul prossimo passo",
      "Ti dice se serve una visita in presenza o uno specialista",
      "Un breve riepilogo scritto dopo il colloquio",
    ],
    receives: "Un appuntamento confermato, il collegamento video e poi il riepilogo scritto.",
    notFor: ["Urgenze: in quel caso chiama il 112", "Situazioni che richiedono di essere visitati di persona", "Certificati e prescrizioni"],
    steps: [
      { title: "Scegli una fascia", text: "Vedi solo gli orari davvero liberi. Nessuna specialità da scegliere." },
      { title: "Confermi quando il medico risponde", text: "Vedi nome del medico, orario e prezzo prima di confermare." },
      { title: "Parli con il medico", text: "Entri nella sala d'attesa dall'area personale, poi ricevi un riepilogo scritto." },
    ],
    icon: "video",
    tone: "medico",
    level: { n: 2, verb: "Orientati" },
    priceKind: "fixed",
    need: "Ho dei dubbi e non so quale specialista mi serve",
  },
  {
    id: "secondo-parere",
    verb: "Chiedi un secondo parere.",
    name: "Secondo parere specialistico",
    oneLiner: "Uno specialista esamina la documentazione pertinente, ne parla con te in video e ti consegna una sintesi scritta su un quesito preciso.",
    forWhom: "Hai già una diagnosi, una proposta di cura o di intervento e vuoi un'altra valutazione.",
    href: "/servizi/secondo-parere",
    startHref: "/richiedi/secondo-parere",
    startLabel: "Richiedi il secondo parere",
    orderService: "secondo-parere",
    envPriceKey: "PRICE_SECONDO_PARERE_CENTS",
    defaultPriceCents: PRICES.SECONDO_PARERE_BASE,
    timing: "Sintesi nei tempi concordati con lo specialista, indicati prima di confermare",
    who: "Un medico specialista abilitato e identificabile. Mai un'intelligenza artificiale.",
    includes: [
      "Per un quesito clinico circoscritto, accettato dallo specialista",
      "Esame della documentazione pertinente che scegli di condividere",
      "Un videoconsulto con lo specialista",
      "Una sintesi scritta a cura dello specialista, nella tua area personale",
      "Lo specialista può chiederti altri documenti o dirti che il caso richiede una visita in presenza: in quel caso non paghi",
    ],
    receives: "Un videoconsulto e una sintesi scritta nella tua area personale, a cura dello specialista.",
    notFor: ["Urgenze: in quel caso chiama il 112", "Casi che richiedono una visita in presenza", "Prescrizioni di farmaci"],
    steps: [
      { title: "Scrivi la tua domanda", text: "Scegli la specialità, scrivi il quesito e indichi i documenti da condividere." },
      { title: "Paghi solo se lo specialista accetta", text: "Vedi medico, orario, prezzo e tempi della sintesi prima di confermare." },
      { title: "Video e sintesi scritta", text: "Ne parlate in video, poi la sintesi arriva nella tua area personale." },
    ],
    icon: "stethoscope",
    tone: "parere",
    level: { n: 3, verb: "Approfondisci" },
    priceKind: "fixed",
    need: "Ho già una diagnosi o una proposta e voglio un'altra valutazione",
  },
];

/** Ciclo 2, fase 3 (approvata da Simone l'11/11): il payoff segue l'ordine dei servizi e dei prezzi, come menu e livelli. */
export const PAYOFF = "Capisci. Parla con un medico. Chiedi un secondo parere.";
export const PAYOFF_LINES = ["Capisci.", "Parla con un medico.", "Chiedi un secondo parere."] as const;
/** I tre livelli del percorso, nell'ordine in cui si sale. */
export const LEVELS = ["capisci", "parla-con-un-medico", "secondo-parere"] as const satisfies readonly CoreServiceId[];
export const INFORMATIVE_NOTE = "Informativo: non sostituisce la valutazione del medico e non fornisce diagnosi o terapia.";
export const DESCRIPTOR = "Referti, secondo parere e videoconsulti con medici abilitati e identificabili.";

/**
 * Sottotitolo della home (ciclo 1): dice in una riga che cosa ricevi e chi c'è se serve.
 * «medici abilitati e identificabili» resta per scelta del titolare (11/11/2026).
 */
export const HERO_SUBTITLE = "Il tuo referto spiegato in parole semplici, valore per valore. E quando serve una persona, medici abilitati e identificabili: in video o a casa tua.";

type Env = Record<string, string | undefined>;

function envCents(env: Env, key: string, fallback: number): number {
  const raw = env[key]?.trim();
  if (raw && /^\d{1,6}$/.test(raw)) {
    const n = Number(raw);
    if (n >= 0 && n <= 100_000) return n;
  }
  return fallback;
}

/** Prezzo standard in centesimi: variabile d'ambiente se valida (intero 0–100000), altrimenti il listino. */
export function priceCents(id: CoreServiceId, env: Env = process.env): number {
  const s = CORE_SERVICES.find((x) => x.id === id)!;
  return envCents(env, s.envPriceKey, s.defaultPriceCents);
}

/**
 * Promozione «primo referto»: attiva salvo FIRST_REFERTO_PROMO="false". Vale una sola volta per cliente
 * (controllo su un'impronta dell'email normalizzata, vedi src/domain/orders/promo.ts).
 */
export function firstPromoEnabled(env: Env = process.env): boolean {
  return env.FIRST_REFERTO_PROMO !== "false";
}

/** Prezzo del primo referto in centesimi (PRICE_CAPISCI_FIRST_CENTS), mai superiore al prezzo standard. */
export function firstRefertoCents(env: Env = process.env): number {
  return Math.min(envCents(env, "PRICE_CAPISCI_FIRST_CENTS", PRICES.CAPISCI_FIRST), priceCents("capisci", env));
}

/** Prezzo di «Capisci» per questo cliente: il primo referto in promozione, poi il prezzo standard. */
export function capisciPriceCents(isFirst: boolean, env: Env = process.env): number {
  return isFirst && firstPromoEnabled(env) ? firstRefertoCents(env) : priceCents("capisci", env);
}

/** «7,90 €», «79 €»: senza decimali se interi, sempre in formato italiano. */
export function formatEuro(cents: number): string {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 }).format(cents / 100);
}

/** Come mostrare un prezzo: importo principale, eventuale «da», nota sotto (es. «poi 7,90 € per referto»). */
export interface PriceDisplay {
  /** Etichetta breve sopra l'importo, es. «Primo referto». */
  lead: string | null;
  /** Importo con eventuale «da», es. «2,90 €», «da 149 €». */
  amount: string;
  /** Riga sotto, es. «poi 7,90 € per referto». */
  note: string | null;
  /** Tutto in una riga, per testi e lettori di schermo. */
  label: string;
}

export function priceDisplay(id: CoreServiceId, env: Env = process.env): PriceDisplay {
  const s = coreService(id);
  const std = formatEuro(priceCents(id, env));
  if (id === "capisci" && firstPromoEnabled(env) && firstRefertoCents(env) < priceCents(id, env)) {
    const first = formatEuro(firstRefertoCents(env));
    return { lead: "Primo referto", amount: first, note: `poi ${std} per referto`, label: `Primo referto ${first}, poi ${std} per referto` };
  }
  if (id === "capisci") return { lead: null, amount: std, note: "per referto", label: `${std} per referto` };
  const amount = s.priceKind === "from" ? `da ${std}` : std;
  return { lead: null, amount, note: id === "parla-con-un-medico" ? "videoconsulto di circa 20–25 minuti" : id === "secondo-parere" ? "documenti, videoconsulto e sintesi scritta" : null, label: amount };
}

/** Etichetta in una riga (compatibilità): «Primo referto 2,90 €, poi 7,90 € per referto», «79 €», «da 149 €». */
export const priceLabel = (id: CoreServiceId, env: Env = process.env) => priceDisplay(id, env).label;

/** Il prezzo più basso di ingresso, per frasi come «Rendilo chiaro da 2,90 €». */
export function entryPriceLabel(env: Env = process.env): string {
  return formatEuro(firstPromoEnabled(env) ? firstRefertoCents(env) : priceCents("capisci", env));
}

export function coreService(id: CoreServiceId): CoreService {
  return CORE_SERVICES.find((s) => s.id === id)!;
}

/** Profilo vetrina (SITE_PROFILE=vetrina), letto come in src/lib/feature-flags.ts. */
export function isVetrina(env: Env = process.env): boolean {
  return env.SITE_PROFILE?.trim().toLowerCase() === "vetrina";
}

/**
 * Ciclo 2, fase 1: dove porta l'azione principale di un servizio. Nel profilo standard si entra nell'area personale;
 * in vetrina i servizi non sono aperti, quindi l'azione porta alla lista d'attesa di quel servizio (sulla sua pagina),
 * mai a una registrazione.
 */
export function serviceStart(id: CoreServiceId, env: Env = process.env): { href: string; label: string; waitlist: boolean } {
  const s = coreService(id);
  if (isVetrina(env)) return { href: `${s.href}#avvisami`, label: "Avvisami quando parte", waitlist: true };
  return { href: s.startHref, label: s.startLabel, waitlist: false };
}

/** In vetrina, dove si prova il servizio senza registrarsi: l'esempio (Capisci) o l'account demo condiviso. */
export const VETRINA_TRY: Record<CoreServiceId, { href: string; label: string }> = {
  capisci: { href: "/referti/esempio", label: "Provalo su un referto di esempio" },
  "parla-con-un-medico": { href: "/richiedi/videoconsulto", label: "Provalo nella demo" },
  "secondo-parere": { href: "/richiedi/secondo-parere", label: "Provalo nella demo" },
};

/** Servizio pubblico a partire dal servizio interno di un ordine. */
export function serviceForOrder(orderService: string): CoreService | null {
  return CORE_SERVICES.find((s) => s.orderService === orderService) ?? null;
}

/** Importo standard in centesimi di un ordine per servizio interno ("completo" resta un'opzione interna non promossa). */
export function orderAmountCents(orderService: OrderServiceKey | "completo", env: Env = process.env): number {
  if (orderService === "completo") return Math.round(priceCents("capisci", env) * 1.5);
  return priceCents(CORE_SERVICES.find((s) => s.orderService === orderService)!.id, env);
}

/**
 * Credito «Capisci → Parla con un medico / Secondo parere»: si scala quanto già pagato per il referto condiviso.
 * Predisposto ma SPENTO: l'attivazione commerciale è una scelta del titolare (UPGRADE_CREDIT="true").
 */
export function upgradeEnabled(env: Env = process.env): boolean {
  return env.UPGRADE_CREDIT === "true";
}

export function upgradeCostCents(from: CoreServiceId, to: CoreServiceId, env: Env = process.env): number {
  return Math.max(0, priceCents(to, env) - priceCents(from, env));
}

/**
 * I prezzi pubblici sono visibili salvo ENABLE_PUBLIC_PRICES="false" (listino di riferimento indicato dal titolare).
 * Restano sempre accompagnati dalla nota «prezzo di riferimento».
 */
export function publicPricesEnabled(env: Env = process.env): boolean {
  return env.ENABLE_PUBLIC_PRICES !== "false";
}

export const PRICE_NOTE = "Prezzi di riferimento, IVA inclusa ove dovuta. Il prezzo esatto lo vedi sempre prima di pagare.";

/**
 * Professionisti mostrati sul sito pubblico. Si aggiungono SOLO dopo la verifica dell'iscrizione all'Albo
 * (mai fotografie di medici: scelta del titolare). Vuoto finché la rete di medici non è attiva: il sito lo dice.
 */
export interface PublicProfessional {
  fullName: string;
  specialty: string;
  /** Riferimento d'iscrizione verificato (Ordine provinciale + numero). */
  registration: string;
  verifiedOn: string;
  bio?: string;
}

export const PUBLIC_PROFESSIONALS: PublicProfessional[] = [];

/** Dati minimi (serializzabili) per il selettore «Ti aiutiamo a scegliere», calcolati lato server. */
export function pickerServices(env: Env = process.env) {
  const prices = publicPricesEnabled(env);
  return CORE_SERVICES.map((s) => ({
    id: s.id,
    name: s.name,
    href: s.href,
    startHref: serviceStart(s.id, env).href,
    startLabel: serviceStart(s.id, env).label,
    price: prices ? priceLabel(s.id, env) : null,
    need: s.need,
    level: s.level,
    timing: s.timing,
  }));
}

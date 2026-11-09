/**
 * L'offerta di Cura Privata: i tre servizi protagonisti («Capisci. Chiedi un secondo parere. Parla con un medico.»).
 * È l'UNICA fonte per nomi, frasi, tempi e prezzi: home, pagine servizio, /prezzi, selettore, area personale e
 * ordini leggono da qui. Per cambiare un prezzo si cambia una variabile d'ambiente, non decine di componenti.
 *
 * Prezzi di riferimento indicati dal titolare il 9/11/2026, da validare operativamente:
 * Capisci 49 €, Parla con un medico 89 €, Secondo parere 149 € (tutti «da»).
 */

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
}

export const CORE_SERVICES: CoreService[] = [
  {
    id: "capisci",
    verb: "Capisci.",
    name: "Capisci il tuo referto",
    oneLiner: "Il tuo referto di laboratorio spiegato in parole semplici, con i valori controllati e le domande da portare al medico.",
    forWhom: "Hai ricevuto un referto e non ti è chiaro che cosa dice.",
    href: "/referti",
    startHref: "/area-personale/nuovo",
    startLabel: "Carica il referto",
    orderService: "essenziale",
    envPriceKey: "PRICE_CAPISCI_CENTS",
    defaultPriceCents: 4900,
    timing: "Di norma entro 24 ore dal pagamento",
    who: "Spiegazione informativa preparata con regole controllate; i numeri restano quelli del documento.",
    includes: [
      "Ogni valore riportato esattamente come nel referto, con pagina e riga",
      "Sigle e termini spiegati in italiano di tutti i giorni",
      "Le domande da fare al tuo medico",
      "Un riepilogo PDF da stampare o mostrare in visita",
    ],
    receives: "Un report chiaro nella tua area personale, che resta tuo.",
    notFor: ["Diagnosi o giudizi sulla tua salute", "Indicazioni su farmaci o terapie", "Immagini diagnostiche, referti istologici o genetici"],
    steps: [
      { title: "Carichi il referto", text: "Un PDF o una foto, dall'area personale." },
      { title: "Controlli i valori", text: "Li confermi uno per uno: spieghiamo solo quelli." },
      { title: "Ricevi il report", text: "In parole semplici, con le domande per il medico." },
    ],
    icon: "file",
    tone: "capisci",
  },
  {
    id: "secondo-parere",
    verb: "Chiedi un secondo parere.",
    name: "Chiedi un secondo parere",
    oneLiner: "Un medico della specialità giusta valuta i tuoi documenti e risponde per iscritto a una domanda precisa.",
    forWhom: "Hai già una diagnosi o una proposta di cura e vuoi un'altra valutazione.",
    href: "/servizi/secondo-parere",
    startHref: "/area-personale/secondo-parere",
    startLabel: "Richiedi il secondo parere",
    orderService: "secondo-parere",
    envPriceKey: "PRICE_SECONDO_PARERE_CENTS",
    defaultPriceCents: 14900,
    timing: "Di norma entro 5 giorni lavorativi dalla presa in carico",
    who: "Un medico abilitato e identificabile della specialità richiesta. Mai un'intelligenza artificiale.",
    includes: [
      "Un quesito specifico, scritto da te",
      "Valutazione dei documenti che scegli di condividere",
      "Parere scritto e firmato dal medico, con data e impronta verificabile",
      "Il medico può chiedere altri documenti o dirti che il caso richiede una visita",
    ],
    receives: "Un parere scritto nella tua area personale, firmato dal medico.",
    notFor: ["Urgenze: in quel caso chiama il 112", "Casi che richiedono una visita in presenza", "Prescrizioni di farmaci"],
    steps: [
      { title: "Scrivi la tua domanda", text: "Scegli la specialità e i documenti da condividere." },
      { title: "Paghi solo se il quadro è chiaro", text: "Prezzo e tempi li vedi prima di confermare." },
      { title: "Ricevi il parere", text: "Scritto e firmato da un medico identificabile." },
    ],
    icon: "stethoscope",
    tone: "parere",
  },
  {
    id: "parla-con-un-medico",
    verb: "Parla con un medico.",
    name: "Parla con un medico",
    oneLiner: "Un videoconsulto con un medico che ha già letto i documenti che hai scelto di condividere.",
    forWhom: "Preferisci parlarne a voce, con calma, con un professionista.",
    href: "/servizi/parla-con-un-medico",
    startHref: "/area-personale/appuntamenti",
    startLabel: "Prenota il videoconsulto",
    orderService: "videoconsulto",
    envPriceKey: "PRICE_VIDEOCONSULTO_CENTS",
    defaultPriceCents: 8900,
    timing: "Di norma un appuntamento entro 3 giorni lavorativi",
    who: "Un medico abilitato e identificabile, con i tuoi documenti già davanti.",
    includes: [
      "Circa 20 minuti di videoconsulto",
      "Il medico legge prima i documenti che scegli tu",
      "Un breve riepilogo scritto dopo il colloquio",
      "Tutto archiviato nella tua area personale",
    ],
    receives: "Un appuntamento confermato, il collegamento video e poi il riepilogo scritto.",
    notFor: ["Urgenze: in quel caso chiama il 112", "Situazioni che richiedono di essere visitati di persona", "Certificati e prescrizioni"],
    steps: [
      { title: "Scegli quando", text: "Indichi la specialità e due o tre momenti comodi." },
      { title: "Condividi i documenti", text: "Solo quelli che vuoi: il medico li legge prima." },
      { title: "Parli con il medico", text: "In video, poi ricevi un riepilogo scritto." },
    ],
    icon: "video",
    tone: "medico",
  },
];

export const PAYOFF = "Capisci. Chiedi un secondo parere. Parla con un medico.";
export const DESCRIPTOR = "Referti, secondo parere e videoconsulti con medici abilitati e identificabili.";

type Env = Record<string, string | undefined>;

/** Prezzo «da» in centesimi: variabile d'ambiente se valida (intero 0–100000), altrimenti il riferimento. */
export function priceCents(id: CoreServiceId, env: Env = process.env): number {
  const s = CORE_SERVICES.find((x) => x.id === id)!;
  const raw = env[s.envPriceKey]?.trim();
  if (raw && /^\d{1,6}$/.test(raw)) {
    const n = Number(raw);
    if (n >= 0 && n <= 100_000) return n;
  }
  return s.defaultPriceCents;
}

/** «49 €» (senza decimali se interi), sempre in formato italiano. */
export function formatEuro(cents: number): string {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2 }).format(cents / 100);
}

export const priceLabel = (id: CoreServiceId, env: Env = process.env) => `da ${formatEuro(priceCents(id, env))}`;

export function coreService(id: CoreServiceId): CoreService {
  return CORE_SERVICES.find((s) => s.id === id)!;
}

/** Servizio pubblico a partire dal servizio interno di un ordine. */
export function serviceForOrder(orderService: string): CoreService | null {
  return CORE_SERVICES.find((s) => s.orderService === orderService) ?? null;
}

/** Importo in centesimi di un ordine per servizio interno ("completo" resta un'opzione interna non promossa). */
export function orderAmountCents(orderService: OrderServiceKey | "completo", env: Env = process.env): number {
  if (orderService === "completo") return Math.round(priceCents("capisci", env) * 1.5);
  return priceCents(CORE_SERVICES.find((s) => s.orderService === orderService)!.id, env);
}

/**
 * Upgrade «Capisci → Parla con un medico»: si paga solo la differenza se il referto è già stato capito
 * con Cura Privata. L'architettura c'è; l'attivazione commerciale è una scelta del titolare (UPGRADE_CREDIT="true").
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
 * e con fotografia autorizzata per iscritto. Vuoto finché la rete di medici non è attiva: il sito lo dice.
 */
export interface PublicProfessional {
  fullName: string;
  specialty: string;
  /** Riferimento d'iscrizione verificato (Ordine provinciale + numero). */
  registration: string;
  verifiedOn: string;
  photo?: { src: string; alt: string; consentRef: string };
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
    startHref: s.startHref,
    startLabel: s.startLabel,
    price: prices ? priceLabel(s.id, env) : null,
    timing: s.timing,
  }));
}

import { isDoctorPath, mediciEnabled } from "@/lib/medici";

/**
 * Navigazione Cura Privata: i servizi per primi (ciclo 1), poi prezzi e guide. 12/11/2026: entra la visita a domicilio;
 * «Parla con un medico» diventa «Videoconsulto». «Guide» si vede dai 1280 px in su (sotto resta nel menu, nel fondo
 * pagina e nella ricerca), così la testata non va a capo a 1024 px.
 */
export type NavIcon = "file" | "home" | "video" | "stethoscope" | "euro" | "book" | "users" | "tools" | "chart" | "laptop" | "pill" | "heart";
type NavItem = { href: string; label: string; tone: "capisci" | "medico" | "parere" | null; icon: NavIcon; wideOnly?: "xl" | "2xl"; menuOnly?: boolean };
/**
 * 15/11/2026 sera: tre sezioni (Prevenzione, Lettura referti, Medici), poi guide, integratori e prezzi; guide e
 * integratori si vedono dai 1280 px (sotto stanno nel menu e nel fondo pagina).
 * 15/11/2026, home «a due sezioni»: il menu è lo stesso con i medici accesi o spenti. Le due sezioni per prime
 * (Online, A domicilio), poi le guide agli esami, le guide agli integratori, i prezzi. Spenti, «A domicilio» porta a una
 * pagina «In arrivo» con la lista d'attesa; accesi, alla stessa pagina con medici e percorso di prova.
 */
const MAIN_NAV_DUE_SEZIONI: readonly NavItem[] = [
  { href: "/prevenzione", label: "Prevenzione", tone: null, icon: "heart" },
  { href: "/lettura-referti", label: "Lettura referti", tone: "capisci", icon: "file" },
  { href: "/medici", label: "Medici", tone: "medico", icon: "stethoscope" },
  { href: "/guide", label: "Guide", tone: null, icon: "book", wideOnly: "xl" },
  { href: "/integratori", label: "Integratori", tone: null, icon: "pill", wideOnly: "xl" },
  { href: "/prezzi", label: "Prezzi", tone: null, icon: "euro" },
  // 18/11/2026 (secondo giro, punto 15): la pagina esisteva ma nessun collegamento ci portava. Nel menu del telefono
  // (e, su computer, nel fondo pagina e in Prevenzione): la testata larga resta com'è, senza andare a capo.
  { href: "/strumenti", label: "Strumenti gratuiti", tone: null, icon: "tools", menuOnly: true },
];
export const MAIN_NAV: readonly NavItem[] = MAIN_NAV_DUE_SEZIONI;
/**
 * Azione principale della testata: il referto, che è la cosa che si fa subito.
 * 17/11/2026 (20 interventi, punto 2): «Carica un referto» porta al caricamento (chi non è entrato passa dall'accesso e
 * poi arriva lì), non a una pagina che lo descrive. In vetrina il caricamento è chiuso: porta alla sezione, che lo dice
 * e ha la lista d'attesa.
 */
export const CARICA_HREF = process.env.NEXT_PUBLIC_VETRINA === "true" ? "/lettura-referti" : "/area-personale/nuovo";
export const HEADER_CTA = { href: CARICA_HREF, label: "Carica un referto", menu: "Carica un referto" };

/** Fondo pagina snello: tre colonne, una dozzina di voci. Le note legali stanno nella riga in basso. */
const FOOTER_NAV_ALL = {
  Servizi: [
    { href: "/prevenzione", label: "Prevenzione" },
    { href: "/lettura-referti", label: "Lettura referti" },
    { href: "/medici", label: "Medici" },
    { href: "/servizi/visita-a-domicilio", label: "Visita a domicilio" },
    { href: "/servizi/parla-con-un-medico", label: "Videoconsulto con un medico" },
    { href: "/servizi/secondo-parere", label: "Secondo parere specialistico" },
    { href: "/famiglia", label: "Famiglia e salute nel tempo" },
    { href: "/prezzi", label: "Prezzi" },
    { href: "/inizia", label: "Ti aiutiamo a scegliere" },
  ],
  Gratis: [
    { href: "/punto-di-partenza", label: "Punto di Partenza" },
    { href: "/prevenzione/esami-di-base", label: "Esami di base" },
    { href: "/prevenzione/screening", label: "Screening gratuiti" },
    { href: "/vicino-a-te", label: "Vicino a te" },
    { href: "/strumenti/preparati-alla-visita", label: "Preparati alla visita" },
    { href: "/guide", label: "Guide agli esami" },
    { href: "/integratori", label: "Guide agli integratori" },
    { href: "/glossario", label: "Glossario" },
    { href: "/strumenti", label: "Tutti gli strumenti gratuiti" },
  ],
  "Cura Privata": [
    { href: "/come-funziona", label: "Come funziona" },
    { href: "/per-i-medici", label: "Per i medici" },
    { href: "/domande-frequenti", label: "Domande frequenti" },
    { href: "/chi-siamo", label: "Chi siamo" },
    { href: "/contatti", label: "Contatti" },
  ],
} as const;

type FooterLink = { href: string; label: string };
/** Con i medici spenti: via le loro pagine (la sezione «A domicilio» resta, con l'etichetta «In arrivo»). */
export const FOOTER_NAV: Record<string, readonly FooterLink[]> = mediciEnabled()
  ? FOOTER_NAV_ALL
  : Object.fromEntries(
      Object.entries(FOOTER_NAV_ALL).map(([k, links]) => {
        const kept: FooterLink[] = links.filter((l) => !isDoctorPath(l.href));
        return [k, kept];
      }),
    );

export const LEGAL_NAV = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/cookie-policy", label: "Cookie" },
  { href: "/termini", label: "Termini" },
  { href: "/sicurezza-e-privacy", label: "Sicurezza" },
  { href: "/accessibilita", label: "Accessibilità" },
  { href: "/stato-del-progetto", label: "Stato del progetto" },
] as const;

/** Pagine che non stanno nel fondo pagina ma devono restare trovabili nella ricerca del sito. */
export const EXTRA_PAGES = [
  { href: "/referti/esempio", label: "Referto di esempio" },
  // 19/11/2026: le pagine delle tessere della home «chiara e scura».
  { href: "/prevenzione/intestino-e-microbiota", label: "Intestino e microbiota: fibre, fermentati, probiotici" },
  { href: "/prevenzione/alimentazione", label: "Alimentazione, peso e forma" },
  { href: "/scaffale", label: "Lo Scaffale: i criteri per i partner" },
  { href: "/per-le-strutture", label: "Per le strutture" },
  { href: "/accedi", label: "Area personale" },
  { href: "/servizi/visita-a-domicilio", label: "Visita a domicilio con medico generalista" },
] as const;

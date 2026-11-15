import { CON_UN_MEDICO_HREF, isDoctorPath, mediciEnabled } from "@/lib/medici";

/**
 * Navigazione Cura Privata: i servizi per primi (ciclo 1), poi prezzi e guide. 12/11/2026: entra la visita a domicilio;
 * «Parla con un medico» diventa «Videoconsulto». «Guide» si vede dai 1280 px in su (sotto resta nel menu, nel fondo
 * pagina e nella ricerca), così la testata non va a capo a 1024 px.
 */
export type NavIcon = "file" | "home" | "video" | "stethoscope" | "euro" | "book" | "users" | "tools" | "chart" | "laptop" | "pill";
type NavItem = { href: string; label: string; tone: "capisci" | "medico" | "parere" | null; icon: NavIcon; wideOnly?: "xl" | "2xl" };
/**
 * 15/11/2026, home «a due sezioni»: il menu è lo stesso con i medici accesi o spenti. Le due sezioni per prime
 * (Online, A domicilio), poi le guide agli esami, le guide agli integratori, i prezzi. Spenti, «A domicilio» porta a una
 * pagina «In arrivo» con la lista d'attesa; accesi, alla stessa pagina con medici e percorso di prova.
 */
const MAIN_NAV_DUE_SEZIONI: readonly NavItem[] = [
  { href: "/online", label: "Online", tone: "capisci", icon: "laptop" },
  { href: "/a-domicilio", label: "A domicilio", tone: "medico", icon: "home" },
  { href: "/guide", label: "Guide", tone: null, icon: "book" },
  { href: "/integratori", label: "Integratori", tone: null, icon: "pill" },
  { href: "/prezzi", label: "Prezzi", tone: null, icon: "euro" },
];
export const MAIN_NAV: readonly NavItem[] = MAIN_NAV_DUE_SEZIONI;
/** Azione principale della testata: il referto, che è la cosa che si fa subito. */
export const HEADER_CTA = { href: "/referti", label: "Carica un referto", menu: "Carica un referto" };

/** Fondo pagina snello: tre colonne, una dozzina di voci. Le note legali stanno nella riga in basso. */
const FOOTER_NAV_ALL = {
  Servizi: [
    { href: "/online", label: "Sezione Online" },
    { href: "/a-domicilio", label: "Sezione A domicilio" },
    { href: "/referti", label: "Capisci il tuo referto" },
    { href: "/servizi/visita-a-domicilio", label: "Visita a domicilio" },
    { href: "/servizi/parla-con-un-medico", label: "Videoconsulto con un medico" },
    { href: "/servizi/secondo-parere", label: "Secondo parere specialistico" },
    { href: "/famiglia", label: "Famiglia e salute nel tempo" },
    { href: "/prezzi", label: "Prezzi" },
    { href: "/inizia", label: "Ti aiutiamo a scegliere" },
  ],
  Gratis: [
    { href: "/punto-di-partenza", label: "Punto di Partenza" },
    { href: "/strumenti/preparati-alla-visita", label: "Preparati alla visita" },
    { href: "/guide", label: "Guide agli esami" },
    { href: "/integratori", label: "Guide agli integratori" },
    { href: "/glossario", label: "Glossario" },
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
  { href: "/servizi", label: "Tutti i servizi" },
  { href: "/per-le-strutture", label: "Per le strutture" },
  { href: "/accedi", label: "Area personale" },
  { href: "/servizi/visita-a-domicilio", label: "Visita a domicilio con medico generalista" },
  { href: CON_UN_MEDICO_HREF, label: "Presto anche con un medico" },
] as const;

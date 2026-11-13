/**
 * Navigazione Cura Privata: i servizi per primi (ciclo 1), poi prezzi e guide. 12/11/2026: entra la visita a domicilio;
 * «Parla con un medico» diventa «Videoconsulto». «Guide» si vede dai 1280 px in su (sotto resta nel menu, nel fondo
 * pagina e nella ricerca), così la testata non va a capo a 1024 px.
 */
export type NavIcon = "file" | "home" | "video" | "stethoscope" | "euro" | "book";
export const MAIN_NAV: readonly { href: string; label: string; tone: "capisci" | "medico" | "parere" | null; icon: NavIcon; wideOnly?: boolean }[] = [
  { href: "/referti", label: "Capisci il referto", tone: "capisci", icon: "file" },
  { href: "/servizi/visita-a-domicilio", label: "A domicilio", tone: "medico", icon: "home" },
  { href: "/servizi/parla-con-un-medico", label: "Videoconsulto", tone: "medico", icon: "video" },
  { href: "/servizi/secondo-parere", label: "Secondo parere", tone: "parere", icon: "stethoscope" },
  { href: "/prezzi", label: "Prezzi", tone: null, icon: "euro" },
  { href: "/guide", label: "Guide", tone: null, icon: "book", wideOnly: true },
];

/** Fondo pagina snello: tre colonne, una dozzina di voci. Le note legali stanno nella riga in basso. */
export const FOOTER_NAV = {
  Servizi: [
    { href: "/referti", label: "Capisci il tuo referto" },
    { href: "/servizi/visita-a-domicilio", label: "Visita a domicilio" },
    { href: "/servizi/parla-con-un-medico", label: "Videoconsulto con un medico" },
    { href: "/servizi/secondo-parere", label: "Secondo parere specialistico" },
    { href: "/prezzi", label: "Prezzi" },
    { href: "/inizia", label: "Ti aiutiamo a scegliere" },
  ],
  Gratis: [
    { href: "/punto-di-partenza", label: "Punto di Partenza" },
    { href: "/strumenti/preparati-alla-visita", label: "Preparati alla visita" },
    { href: "/guide", label: "Guide agli esami" },
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
] as const;

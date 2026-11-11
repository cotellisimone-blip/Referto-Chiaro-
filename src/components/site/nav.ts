/** Navigazione Cura Privata (pacchetto «Memorabile» 9/11/2026): i tre servizi per primi, poi prezzi e guide. */
export const MAIN_NAV = [
  { href: "/referti", label: "Capisci il referto", tone: "capisci" },
  { href: "/servizi/secondo-parere", label: "Secondo parere", tone: "parere" },
  { href: "/servizi/parla-con-un-medico", label: "Parla con un medico", tone: "medico" },
  { href: "/prezzi", label: "Prezzi", tone: null },
  { href: "/guide", label: "Guide", tone: null },
] as const;

/** Fondo pagina snello: tre colonne, una dozzina di voci. Le note legali stanno nella riga in basso. */
export const FOOTER_NAV = {
  Servizi: [
    { href: "/referti", label: "Capisci il tuo referto" },
    { href: "/servizi/secondo-parere", label: "Chiedi un secondo parere" },
    { href: "/servizi/parla-con-un-medico", label: "Parla con un medico" },
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
] as const;

/** Navigazione Cura Privata (pacchetto «Memorabile» 9/11/2026): i tre servizi per primi, poi prezzi e guide. */
export const MAIN_NAV = [
  { href: "/referti", label: "Capisci il referto" },
  { href: "/servizi/secondo-parere", label: "Secondo parere" },
  { href: "/servizi/parla-con-un-medico", label: "Parla con un medico" },
  { href: "/prezzi", label: "Prezzi" },
  { href: "/guide", label: "Guide" },
] as const;

export const FOOTER_NAV = {
  Servizi: [
    { href: "/referti", label: "Capisci il tuo referto" },
    { href: "/servizi/secondo-parere", label: "Chiedi un secondo parere" },
    { href: "/servizi/parla-con-un-medico", label: "Parla con un medico" },
    { href: "/prezzi", label: "Prezzi" },
    { href: "/inizia", label: "Ti aiutiamo a scegliere" },
    { href: "/strumenti/preparati-alla-visita", label: "Preparati alla visita" },
    { href: "/guide", label: "Guide agli esami" },
    { href: "/glossario", label: "Glossario" },
    { href: "/servizi", label: "Tutti i servizi" },
  ],
  "Cura Privata": [
    { href: "/chi-siamo", label: "Chi siamo" },
    { href: "/per-i-medici", label: "Per i medici" },
    { href: "/come-funziona", label: "Come funziona" },
    { href: "/referti/esempio", label: "Referto di esempio" },
    { href: "/sicurezza-e-privacy", label: "Sicurezza e privacy" },
    { href: "/domande-frequenti", label: "Domande frequenti" },
    { href: "/per-le-strutture", label: "Per le strutture" },
    { href: "/accessibilita", label: "Accessibilità" },
    { href: "/contatti", label: "Contatti" },
  ],
  "Note legali": [
    { href: "/privacy-policy", label: "Privacy" },
    { href: "/cookie-policy", label: "Cookie" },
    { href: "/termini", label: "Termini del servizio" },
    { href: "/accedi", label: "Area personale" },
  ],
} as const;

export const MAIN_NAV = [
  { href: "/come-funziona", label: "Come funziona" },
  { href: "/servizi-prezzi", label: "Servizi & Prezzi" },
  { href: "/secondo-parere", label: "Secondo parere" },
  { href: "/guide", label: "Guide" },
  { href: "/faq", label: "FAQ" },
] as const;

export const FOOTER_NAV = {
  Servizio: [
    { href: "/esempio", label: "Referto di esempio" },
    { href: "/accedi", label: "Area personale" },
    { href: "/come-funziona", label: "Come funziona" },
    { href: "/servizi-prezzi", label: "Servizi & Prezzi" },
    { href: "/secondo-parere", label: "Secondo parere medico" },
    { href: "/faq", label: "Domande frequenti" },
    { href: "/per-le-strutture", label: "Per le strutture" },
  ],
  "Chi siamo": [
    { href: "/chi-siamo", label: "Il progetto" },
    { href: "/sicurezza", label: "Sicurezza dei dati" },
    { href: "/accessibilita", label: "Accessibilità" },
    { href: "/contatti", label: "Contatti" },
  ],
  "Note legali": [
    { href: "/privacy", label: "Privacy" },
    { href: "/termini", label: "Termini del servizio" },
    { href: "/cookie", label: "Cookie" },
  ],
} as const;

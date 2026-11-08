/** Navigazione Cura Privata (mappa del kit 8/11/2026). I prezzi non sono in menu finché il listino non è approvato. */
export const MAIN_NAV = [
  { href: "/referti", label: "Referti" },
  { href: "/servizi/secondo-parere", label: "Secondo parere" },
  { href: "/servizi", label: "Servizi" },
  { href: "/come-funziona", label: "Come funziona" },
  { href: "/sicurezza-e-privacy", label: "Sicurezza" },
  { href: "/domande-frequenti", label: "FAQ" },
] as const;

export const FOOTER_NAV = {
  Servizi: [
    { href: "/referti", label: "Comprendi i tuoi referti" },
    { href: "/referti/esempio", label: "Referto di esempio" },
    { href: "/servizi/secondo-parere", label: "Secondo parere medico" },
    { href: "/servizi/archivio", label: "Archivio salute" },
    { href: "/servizi/visite-e-consulti", label: "Visite e videoconsulti" },
    { href: "/servizi/prevenzione", label: "Prevenzione" },
    { href: "/guide", label: "Guide agli esami" },
    { href: "/glossario", label: "Glossario" },
    { href: "/strumenti/domande-per-il-medico", label: "Domande per il medico" },
  ],
  "Cura Privata": [
    { href: "/chi-siamo", label: "Chi siamo" },
    { href: "/come-funziona", label: "Come funziona" },
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

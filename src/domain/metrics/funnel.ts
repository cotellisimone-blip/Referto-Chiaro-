/**
 * Funnel minimo di Cura Privata (Evoluzione v2, fase 4):
 * visita → CTA → caricamento → pagamento → report pronto → medico 79 € / secondo parere 149 € → secondo referto.
 * I primi due passi sono contatori anonimi aggregati per giorno (funnel_daily); gli altri si calcolano dai dati
 * che il sito ha già (documenti, ordini, report), quindi non serve tracciare le persone.
 */
export const PUBLIC_EVENTS = ["visita-home", "cta-capisci", "cta-medico", "cta-parere"] as const;
export type PublicEvent = (typeof PUBLIC_EVENTS)[number];

export function isPublicEvent(x: unknown): x is PublicEvent {
  return typeof x === "string" && (PUBLIC_EVENTS as readonly string[]).includes(x);
}

export const FUNNEL_LABELS: Record<string, string> = {
  "visita-home": "Visite alla home",
  "cta-capisci": "Clic su «Capisci» (CTA)",
  "cta-medico": "Clic su «Parla con un medico»",
  "cta-parere": "Clic su «Secondo parere»",
  uploads: "Referti caricati",
  checkoutCapisci: "Pagamenti «Capisci» avviati",
  paidCapisci: "Pagamenti «Capisci» completati",
  reportsReady: "Report pronti",
  reportToMedico: "Dopo un report → videoconsulto pagato",
  reportToParere: "Dopo un report → secondo parere pagato",
  returning: "Clienti con almeno 2 referti pagati",
};

/**
 * Funnel minimo di Cura Privata (Evoluzione v2, fase 4):
 * visita → CTA → caricamento → pagamento → report pronto → medico 79 € / secondo parere 149 € → secondo referto.
 * I primi due passi sono contatori anonimi aggregati per giorno (funnel_daily); gli altri si calcolano dai dati
 * che il sito ha già (documenti, ordini, report), quindi non serve tracciare le persone.
 */
/**
 * Punto di Partenza (V3): solo nomi di passi, mai risposte. Home → avvio → passo 2 → completato → scheda scaricata →
 * referto 2,90 € / medico 79 €.
 */
export const PDP_EVENTS = ["cta-pdp", "pdp-start", "pdp-step-2", "pdp-complete", "pdp-download", "pdp-to-referto", "pdp-to-medico"] as const;

export const PUBLIC_EVENTS = ["visita-home", "cta-capisci", "cta-medico", "cta-parere", ...PDP_EVENTS] as const;
export type PublicEvent = (typeof PUBLIC_EVENTS)[number];

export function isPublicEvent(x: unknown): x is PublicEvent {
  return typeof x === "string" && (PUBLIC_EVENTS as readonly string[]).includes(x);
}

export const FUNNEL_LABELS: Record<string, string> = {
  "visita-home": "Visite alla home",
  "cta-capisci": "Clic su «Capisci» (CTA)",
  "cta-medico": "Clic su «Parla con un medico»",
  "cta-parere": "Clic su «Secondo parere»",
  "cta-pdp": "Home → clic su «Punto di Partenza»",
  "pdp-start": "Punto di Partenza avviati",
  "pdp-step-2": "Punto di Partenza: arrivati al passo 2",
  "pdp-complete": "Punto di Partenza completati",
  "pdp-download": "Punto di Partenza: scheda scaricata o stampata",
  "pdp-to-referto": "Punto di Partenza → «Capisci» (primo referto)",
  "pdp-to-medico": "Punto di Partenza → «Parla con un medico»",
  uploads: "Referti caricati",
  checkoutCapisci: "Pagamenti «Capisci» avviati",
  paidCapisci: "Pagamenti «Capisci» completati",
  reportsReady: "Report pronti",
  reportToMedico: "Dopo un report → videoconsulto pagato",
  reportToParere: "Dopo un report → secondo parere pagato",
  returning: "Clienti con almeno 2 referti pagati",
};

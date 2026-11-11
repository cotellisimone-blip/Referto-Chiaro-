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

/**
 * Ciclo 2, fase 2 (misurare la vetrina): visite alle pagine dei servizi, esempio di Capisci completato e PDF scaricato,
 * iscrizione alla lista d'attesa per servizio. Sempre e solo nomi di eventi.
 */
export const VETRINA_EVENTS = [
  "visita-capisci",
  "visita-medico",
  "visita-parere",
  "esempio-completato",
  "esempio-pdf",
  "avvisami-capisci",
  "avvisami-medico",
  "avvisami-parere",
] as const;

export const PUBLIC_EVENTS = ["visita-home", "cta-capisci", "cta-medico", "cta-parere", ...PDP_EVENTS, ...VETRINA_EVENTS] as const;
export type PublicEvent = (typeof PUBLIC_EVENTS)[number];

export function isPublicEvent(x: unknown): x is PublicEvent {
  return typeof x === "string" && (PUBLIC_EVENTS as readonly string[]).includes(x);
}

/**
 * Da dove arriva la visita (ciclo 2, fase 2). Elenco chiuso: qualsiasi altro valore diventa «altro», così nel database
 * non finisce mai testo libero. Si ricava dal parametro utm_source della pagina d'arrivo o dal sito di provenienza.
 */
export const SOURCES = ["diretto", "google", "facebook", "instagram", "tiktok", "whatsapp", "email", "medico", "altro"] as const;
export type Source = (typeof SOURCES)[number];

export const SOURCE_LABELS: Record<Source, string> = {
  diretto: "Diretto (indirizzo scritto, preferiti)",
  google: "Google",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
  email: "Email o newsletter",
  medico: "Passaparola di un medico (link con utm_source=medico)",
  altro: "Altro",
};

const HOST_SOURCES: [RegExp, Source][] = [
  [/(^|\.)google\./, "google"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|m\.facebook\.com|l\.facebook\.com)$/, "facebook"],
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)(whatsapp\.com|wa\.me)$/, "whatsapp"],
  [/(^|\.)(mail\.google\.com|outlook\.(live|office)\.com|mail\.yahoo\.com|libero\.it|virgilio\.it)$/, "email"],
];

/** Normalizza un valore qualsiasi nell'elenco chiuso. */
export function toSource(x: unknown): Source {
  return typeof x === "string" && (SOURCES as readonly string[]).includes(x) ? (x as Source) : "altro";
}

/**
 * Sorgente di una visita: utm_source (se riconosciuto) vince sul sito di provenienza; nessuna provenienza o la stessa
 * origine = «diretto». Funzione pura, provata nei test unitari.
 */
export function detectSource(args: { search: string; referrer: string; ownHost: string }): Source {
  const utm = new URLSearchParams(args.search).get("utm_source")?.trim().toLowerCase();
  if (utm) {
    if ((SOURCES as readonly string[]).includes(utm)) return utm as Source;
    if (["fb", "meta"].includes(utm)) return "facebook";
    if (["ig"].includes(utm)) return "instagram";
    if (["newsletter", "mail"].includes(utm)) return "email";
    if (["wa"].includes(utm)) return "whatsapp";
    return "altro";
  }
  if (!args.referrer) return "diretto";
  let host = "";
  try {
    host = new URL(args.referrer).hostname.toLowerCase();
  } catch {
    return "altro";
  }
  if (!host || host === args.ownHost.toLowerCase()) return "diretto";
  for (const [re, src] of HOST_SOURCES) if (re.test(host)) return src;
  return "altro";
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
  "visita-capisci": "Visite a «Capisci il tuo referto»",
  "visita-medico": "Visite a «Parla con un medico»",
  "visita-parere": "Visite a «Secondo parere»",
  "esempio-completato": "Esempio di Capisci completato (report visto)",
  "esempio-pdf": "Esempio di Capisci: PDF scaricato",
  "avvisami-capisci": "Lista d'attesa «Capisci»",
  "avvisami-medico": "Lista d'attesa «Parla con un medico»",
  "avvisami-parere": "Lista d'attesa «Secondo parere»",
  uploads: "Referti caricati",
  checkoutCapisci: "Pagamenti «Capisci» avviati",
  paidCapisci: "Pagamenti «Capisci» completati",
  reportsReady: "Report pronti",
  reportToMedico: "Dopo un report → videoconsulto pagato",
  reportToParere: "Dopo un report → secondo parere pagato",
  returning: "Clienti con almeno 2 referti pagati",
};

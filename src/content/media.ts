/**
 * Media del sito (pacchetto «Memorabile»). Le immagini dei mockup sono render generati: NON si pubblicano.
 * Qui si registrano solo foto e video reali, con il riferimento della liberatoria. Finché un campo è null,
 * il sito usa le composizioni native (HTML/SVG) e gli spazi video mostrano «in arrivo».
 */
export interface SiteVideo {
  id: string;
  title: string;
  description: string;
  durationLabel: string;
  /** File MP4/WebM in /public/video o URL di un player consentito dalla CSP. null = non ancora prodotto. */
  src: string | null;
  poster: string | null;
  /** Sottotitoli WebVTT: obbligatori prima di pubblicare un video. */
  captions: string | null;
}

export const VIDEOS: Record<"principale" | "capisci" | "secondo-parere" | "parla-con-un-medico", SiteVideo> = {
  principale: {
    id: "principale",
    title: "Cura Privata in 90 secondi",
    description: "Dal referto che non capisci al colloquio con un medico: come funziona, chi se ne occupa, che cosa ricevi.",
    durationLabel: "circa 90 secondi",
    src: null,
    poster: null,
    captions: null,
  },
  capisci: {
    id: "capisci",
    title: "Capire un referto, passo dopo passo",
    description: "Carichi il documento, controlli i valori, ricevi la spiegazione e le domande per il medico.",
    durationLabel: "circa 30 secondi",
    src: null,
    poster: null,
    captions: null,
  },
  "secondo-parere": {
    id: "secondo-parere",
    title: "Come funziona il secondo parere",
    description: "La tua domanda, i documenti che scegli, il parere scritto e firmato da un medico.",
    durationLabel: "circa 30 secondi",
    src: null,
    poster: null,
    captions: null,
  },
  "parla-con-un-medico": {
    id: "parla-con-un-medico",
    title: "Il videoconsulto, con i documenti già letti",
    description: "Scegli quando, condividi i documenti, parli con il medico e ricevi un riepilogo.",
    durationLabel: "circa 30 secondi",
    src: null,
    poster: null,
    captions: null,
  },
};

/** Foto reali autorizzate (liberatoria scritta). Vuoto: nessuna foto di persone sul sito. */
export const AUTHORIZED_PHOTOS: { src: string; alt: string; consentRef: string; usage: "hero" | "editorial" }[] = [];

/**
 * Immagini illustrative di pazienti, ritagliate dal pacchetto «Memorabile» del titolare (senza logo né testo).
 * Mai medici: nessun volto viene presentato come un professionista reale. Sono marcate «immagine illustrativa».
 * Per toglierle tutte: SHOW_ILLUSTRATIVE_PHOTOS = false (il sito torna alle composizioni disegnate).
 */
export const SHOW_ILLUSTRATIVE_PHOTOS = true;
export const ILLUSTRATIVE_PHOTOS = {
  hero: { src: "/media/paziente-hero.webp", width: 704, height: 560, alt: "Una donna sorride, pensierosa, a casa sua." },
  scrivania: { src: "/media/paziente-scrivania.webp", width: 425, height: 914, alt: "Una donna alla scrivania con un referto in mano, il telefono e un quaderno." },
  preparati: { src: "/media/paziente-preparati.webp", width: 425, height: 884, alt: "Una donna legge un referto e controlla il telefono." },
} as const;

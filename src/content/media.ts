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
    description: "La tua domanda, i documenti che scegli, il videoconsulto e la sintesi scritta dello specialista.",
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
 * Immagini illustrative di pazienti, ritagliate dal pacchetto «Memorabile» del titolare (senza logo né testo) e
 * portate al doppio dei pixel con un ingrandimento non generativo (12/11/2026): nessun volto nuovo, nessun dettaglio
 * inventato. Mai medici: nessun volto viene presentato come un professionista reale. Sono marcate «immagine illustrativa».
 * Per toglierle tutte: SHOW_ILLUSTRATIVE_PHOTOS = false (il sito torna alle composizioni disegnate).
 */
export const SHOW_ILLUSTRATIVE_PHOTOS = true;

export interface SitePhoto {
  src: string;
  /** Versione a metà risoluzione per gli schermi piccoli. */
  srcSmall?: string;
  width: number;
  height: number;
  alt: string;
}

export const ILLUSTRATIVE_PHOTOS = {
  /** Apertura della home: il volto, in orizzontale. */
  hero: { src: "/media/paziente-hero.webp", srcSmall: "/media/paziente-hero-sm.webp", width: 1424, height: 1096, alt: "Una donna sorride, pensierosa, a casa sua." },
  /** Ritratto 4:5: la paziente con gli occhiali guarda il telefono. */
  ritratto: { src: "/media/paziente-ritratto.webp", srcSmall: "/media/paziente-ritratto-sm.webp", width: 850, height: 1062, alt: "Una donna con gli occhiali guarda il telefono, con un referto in mano." },
  /** La stessa scena per intero, in verticale. */
  scrivania: { src: "/media/paziente-scrivania.webp", srcSmall: "/media/paziente-scrivania-sm.webp", width: 850, height: 1804, alt: "Una donna alla scrivania con un referto in mano, il telefono e un quaderno." },
  /** Dettaglio in orizzontale: le mani, il referto, il telefono. */
  mani: { src: "/media/paziente-mani.webp", srcSmall: "/media/paziente-mani-sm.webp", width: 1420, height: 844, alt: "Due mani tengono un referto e un telefono, davanti a una tazza e a un quaderno." },
} as const satisfies Record<string, SitePhoto>;

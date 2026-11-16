/**
 * Servizi di Cura Privata, con lo stato VERO di ciascuno. È l'unica fonte per home, /servizi e menu.
 * Regola del kit (8/11/2026): mai presentare come disponibile ciò che non lo è.
 *  - "demo": si può provare su dati inventati;
 *  - "free": contenuti informativi consultabili da tutti;
 *  - "in-preparation": pagina descrittiva + lista d'attesa, nessuna raccolta di dati sanitari.
 */
export type EcosystemStatus = "demo" | "free" | "in-preparation";

export interface EcosystemService {
  id: "referti" | "secondo-parere" | "famiglia" | "visite" | "prevenzione" | "guide";
  name: string;
  short: string;
  href: string;
  status: EcosystemStatus;
  icon: "file" | "stethoscope" | "folder" | "video" | "sprout" | "book";
}

export const STATUS_LABEL: Record<EcosystemStatus, string> = {
  demo: "Prova la demo",
  free: "Gratis, per tutti",
  "in-preparation": "In preparazione",
};

export const ECOSYSTEM: EcosystemService[] = [
  {
    id: "referti",
    name: "Capisci il tuo referto",
    short: "Le sigle e i valori del referto di laboratorio spiegati in parole semplici, con le domande da portare al medico.",
    href: "/referti",
    status: "demo",
    icon: "file",
  },
  {
    id: "visite",
    name: "Parla con un medico",
    short: "Un videoconsulto con un medico che ha già letto i documenti che hai scelto di condividere.",
    href: "/servizi/parla-con-un-medico",
    status: "demo",
    icon: "video",
  },
  {
    id: "secondo-parere",
    name: "Chiedi un secondo parere",
    short: "Uno specialista abilitato e identificabile esamina i tuoi documenti, ne parla con te in video e ti consegna una sintesi scritta su un quesito specifico. Mai una risposta automatica.",
    href: "/servizi/secondo-parere",
    status: "demo",
    icon: "stethoscope",
  },
  {
    id: "guide",
    name: "Guide agli esami",
    short: "Che cosa misura un esame e come si legge il referto, con le fonti. Senza registrarti.",
    href: "/guide",
    status: "free",
    icon: "book",
  },
  {
    id: "famiglia",
    name: "Famiglia e salute nel tempo",
    short: "I referti di tutta la famiglia in un posto solo, con i numeri messi in fila negli anni e le visite già preparate.",
    href: "/famiglia",
    status: "demo",
    icon: "folder",
  },
  {
    id: "prevenzione",
    name: "Prevenzione",
    short: "Promemoria e materiali per non dimenticare i controlli che il tuo medico ti ha indicato.",
    href: "/servizi/prevenzione",
    status: "in-preparation",
    icon: "sprout",
  },
];

/** Prezzi: unica fonte in src/domain/offerta.ts. */
export { publicPricesEnabled } from "@/domain/offerta";

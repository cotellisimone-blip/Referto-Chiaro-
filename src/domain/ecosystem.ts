/**
 * Servizi di Cura Privata, con lo stato VERO di ciascuno. È l'unica fonte per home, /servizi e menu.
 * Regola del kit (8/11/2026): mai presentare come disponibile ciò che non lo è.
 *  - "demo": si può provare su dati inventati;
 *  - "free": contenuti informativi consultabili da tutti;
 *  - "in-preparation": pagina descrittiva + lista d'attesa, nessuna raccolta di dati sanitari.
 */
export type EcosystemStatus = "demo" | "free" | "in-preparation";

export interface EcosystemService {
  id: "referti" | "secondo-parere" | "archivio" | "visite" | "prevenzione" | "guide";
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
    name: "Comprendi i tuoi referti",
    short: "Le sigle e i valori del referto di laboratorio spiegati in parole semplici, con le domande da portare al medico.",
    href: "/referti",
    status: "demo",
    icon: "file",
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
    id: "secondo-parere",
    name: "Secondo parere medico",
    short: "Un medico abilitato e identificato risponde a un quesito specifico sui tuoi documenti. Mai un'intelligenza artificiale.",
    href: "/servizi/secondo-parere",
    status: "in-preparation",
    icon: "stethoscope",
  },
  {
    id: "archivio",
    name: "Archivio salute",
    short: "I tuoi documenti sanitari ordinati in un unico posto, con accessi che decidi tu.",
    href: "/servizi/archivio",
    status: "in-preparation",
    icon: "folder",
  },
  {
    id: "visite",
    name: "Visite e videoconsulti",
    short: "Un colloquio con un professionista, in presenza o a distanza, con strutture e medici verificati.",
    href: "/servizi/visite-e-consulti",
    status: "in-preparation",
    icon: "video",
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

/** I prezzi compaiono sul sito pubblico solo con ENABLE_PUBLIC_PRICES="true" (listino approvato dal titolare). */
export function publicPricesEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.ENABLE_PUBLIC_PRICES === "true";
}

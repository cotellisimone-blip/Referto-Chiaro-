import type { CoreServiceId } from "@/domain/offerta";

/**
 * Che cosa manca prima che ogni servizio diventi reale. Sta in una pagina sola («Stato del progetto»)
 * perché parla di contratti e verifiche, non di ciò che serve al paziente per scegliere.
 */
export const PREREQUISITES: Record<CoreServiceId, string[]> = {
  capisci: [
    "Revisione dei testi delle guide e delle spiegazioni da parte di un medico",
    "Valutazione d'impatto sulla protezione dei dati e contratti con i fornitori",
    "Inquadramento normativo del servizio verificato da un consulente",
    "Caricamento di documenti veri attivato solo dopo questi passaggi",
  ],
  "secondo-parere": [
    "Medici con contratto e iscrizione all'Albo verificata",
    "Copertura assicurativa e responsabilità professionale definite",
    "Regole su rimborsi e annullamenti approvate da un legale",
    "Inquadramento fiscale e sanitario verificato da un consulente",
  ],
  "parla-con-un-medico": [
    "Medici con contratto e iscrizione all'Albo verificata",
    "Piattaforma video adatta all'uso sanitario e accordi sul trattamento dei dati",
    "Regole sulla telemedicina applicabili verificate da un consulente",
    "Disponibilità reali dei medici, prezzi, disdette e rimborsi pubblicati",
  ],
};

export const WAITLIST_INTEREST: Partial<Record<CoreServiceId, "completo" | "secondo-parere" | "visite">> = {
  // «completo» è il nome storico (Referto Chiaro) dell'interesse per il servizio sui referti: oggi è «Capisci il tuo referto».
  capisci: "completo",
  "secondo-parere": "secondo-parere",
  "parla-con-un-medico": "visite",
};

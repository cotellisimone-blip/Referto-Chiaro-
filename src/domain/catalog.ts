/**
 * Catalogo servizi. I prezzi sono IPOTESI DA VALIDARE (strategia 07/11/2026), non tariffe confermate.
 * Lo stato riflette la realtà: in questa versione nessun servizio è acquistabile.
 */
export type ServiceStatus = "demo-only" | "in-preparation";

export interface Service {
  id: "essenziale" | "completo" | "secondo-parere";
  name: string;
  tagline: string;
  priceLabel: string;
  priceNote: string;
  status: ServiceStatus;
  statusLabel: string;
  includes: string[];
  excludes: string[];
  exampleHref: string;
  exampleLabel: string;
}

export const SERVICES: Service[] = [
  {
    id: "essenziale",
    name: "Essenziale",
    tagline: "Una spiegazione leggibile di un referto.",
    priceLabel: "9,90 €",
    priceNote: "Prezzo indicativo in fase di validazione, IVA e condizioni da definire.",
    status: "demo-only",
    statusLabel: "Disponibile solo come esempio",
    includes: [
      "1 referto di laboratorio testuale",
      "Valori riportati esattamente come nel documento",
      "Termini spiegati in parole comuni",
      "Domande da portare al medico",
      "Riepilogo PDF stampabile",
    ],
    excludes: ["Diagnosi o valutazioni cliniche", "Consigli su terapie o farmaci", "Lettura di immagini (TAC, RM, ecografie)"],
    exampleHref: "/esempio",
    exampleLabel: "Vedi un esempio",
  },
  {
    id: "completo",
    name: "Completo",
    tagline: "Più documenti, un unico dossier ordinato.",
    priceLabel: "24,90 €",
    priceNote: "Prezzo indicativo in fase di validazione, IVA e condizioni da definire.",
    status: "in-preparation",
    statusLabel: "In preparazione",
    includes: [
      "Più referti di laboratorio in un solo dossier",
      "Cronologia ordinata dei documenti",
      "Confronto numerico solo tra misure omogenee e verificabili",
      "Domande per la visita",
      "Dossier PDF da portare al medico",
    ],
    excludes: ["Valutazioni dell'andamento della salute", "Indicazioni su quando ripetere gli esami", "Diagnosi o terapie"],
    exampleHref: "/come-funziona#dossier",
    exampleLabel: "Come sarà il dossier",
  },
  {
    id: "secondo-parere",
    name: "Secondo parere medico",
    tagline: "Quando serve il confronto con un altro professionista.",
    priceLabel: "da 99 €",
    priceNote: "Indicativo: il prezzo reale dipenderà da specialità e complessità e sarà sempre comunicato prima.",
    status: "in-preparation",
    statusLabel: "Servizio in preparazione",
    includes: [
      "Un medico abilitato, identificabile",
      "Un quesito clinico specifico",
      "Valutazione dei documenti originali",
      "Parere scritto sotto la responsabilità del medico",
    ],
    excludes: ["Risposte generate dall'intelligenza artificiale", "Urgenze o casi che richiedono una visita in presenza"],
    exampleHref: "/secondo-parere",
    exampleLabel: "Scopri come funzionerà",
  },
];

import { formatEuro, orderAmountCents, PRICE_NOTE } from "@/domain/offerta";

/**
 * Opzioni acquistabili dal flusso del documento (area personale). I prezzi NON sono scritti qui:
 * vengono da src/domain/offerta.ts (unica fonte, configurabile da variabili d'ambiente).
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
    name: "Capisci il tuo referto",
    tagline: "Una spiegazione leggibile di un referto.",
    priceLabel: formatEuro(orderAmountCents("essenziale")),
    priceNote: PRICE_NOTE,
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
    exampleHref: "/referti/esempio",
    exampleLabel: "Vedi un esempio",
  },
  {
    id: "completo",
    name: "Capisci più referti",
    tagline: "Più documenti, un unico dossier ordinato.",
    priceLabel: formatEuro(orderAmountCents("completo")),
    priceNote: PRICE_NOTE,
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
    priceLabel: `da ${formatEuro(orderAmountCents("secondo-parere"))}`,
    priceNote: "Indicativo: il prezzo reale dipenderà da specialità e complessità e sarà sempre comunicato prima.",
    status: "in-preparation",
    statusLabel: "Servizio in preparazione",
    includes: [
      "Un medico abilitato, identificabile",
      "Un quesito clinico specifico",
      "Valutazione dei documenti originali",
      "Videoconsulto e sintesi scritta sotto la responsabilità dello specialista",
    ],
    excludes: ["Risposte generate dall'intelligenza artificiale", "Urgenze o casi che richiedono una visita in presenza"],
    exampleHref: "/servizi/secondo-parere",
    exampleLabel: "Scopri come funzionerà",
  },
];

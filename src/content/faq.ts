export interface FaqItem {
  q: string;
  a: string;
  topic: "servizio" | "dati" | "medico" | "pagamenti";
}

export const FAQ: FaqItem[] = [
  {
    topic: "servizio",
    q: "State facendo una diagnosi?",
    a: "No. Le spiegazioni sono informative: chiariscono che cosa misura un esame e riportano i numeri esattamente come sono stampati. Non dicono che cosa significano per te: quello spetta al medico.",
  },
  {
    topic: "servizio",
    q: "L'intelligenza artificiale può sbagliare?",
    a: "Sì. Per questo ogni valore mostra la riga del documento da cui proviene, ti chiediamo di controllarlo prima di procedere e, se un dato non è leggibile, non lo spieghiamo invece di indovinarlo. In questa versione dimostrativa le spiegazioni sono testi fissi, non generati da un modello.",
  },
  {
    topic: "servizio",
    q: "Che tipo di documenti potrete spiegare?",
    a: "La prima versione è pensata per referti di laboratorio testuali, come gli esami del sangue. Non legge immagini diagnostiche (TAC, RM, ecografie) e non tratta referti istologici, genetici, in gravidanza o di minori.",
  },
  {
    topic: "dati",
    q: "Posso caricare il mio referto adesso?",
    a: "No. Il sito è in fase dimostrativa e non accetta documenti reali. Prima di farlo servono verifiche legali, di sicurezza e cliniche che non sono ancora concluse. Puoi però provare tutto il percorso con un referto inventato.",
  },
  {
    topic: "dati",
    q: "Posso caricare il referto di un familiare?",
    a: "Quando il servizio sarà attivo, solo se sei autorizzato a farlo e nel rispetto delle condizioni previste per il trattamento dei suoi dati. Il servizio per i minori non è previsto nella prima versione.",
  },
  {
    topic: "dati",
    q: "Mi inviate il referto via email?",
    a: "No. Le email conterranno solo un avviso e un collegamento protetto all'area riservata, mai il contenuto del referto.",
  },
  {
    topic: "medico",
    q: "Come funzionerà il secondo parere?",
    a: "Sarà una prestazione di un medico abilitato, non una risposta automatica. Il medico vedrà i documenti originali, potrà chiedere integrazioni o non accettare il caso. Oggi il servizio è in preparazione e non accettiamo richieste.",
  },
  {
    topic: "pagamenti",
    q: "Quanto costa?",
    a: "Stiamo validando questi prezzi indicativi: Essenziale 9,90 €, Completo 24,90 €, Secondo parere medico da 99 €. Oggi non è possibile acquistare nulla e nessun pagamento viene richiesto.",
  },
  {
    topic: "servizio",
    q: "E se penso di avere un'emergenza?",
    a: "Non usare questo sito per le emergenze. In Italia chiama il 112 o rivolgiti ai servizi di emergenza.",
  },
];

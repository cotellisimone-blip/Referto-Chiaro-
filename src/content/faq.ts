export interface FaqItem {
  q: string;
  a: string;
  topic: "servizio" | "dati" | "medico" | "pagamenti";
}

/** Domande frequenti del sito. Nessun prezzo scritto a mano: i prezzi stanno nel listino e nella pagina Prezzi. */
export const FAQ: FaqItem[] = [
  {
    topic: "servizio",
    q: "State facendo una diagnosi?",
    a: "No. La spiegazione automatica è informativa: dice che cosa misura un esame e riporta i numeri esattamente come sono stampati. Che cosa significano per te lo valuta un medico.",
  },
  {
    topic: "servizio",
    q: "L'intelligenza artificiale può sbagliare?",
    a: "Sì. Per questo ogni valore mostra la riga del documento da cui proviene e ti chiediamo di controllarlo prima di andare avanti. Se un dato non si legge, non lo spieghiamo: non tiriamo a indovinare. In questa versione dimostrativa le spiegazioni sono testi fissi, non generati da un modello.",
  },
  {
    topic: "servizio",
    q: "Quali documenti si possono spiegare?",
    a: "La prima versione è pensata per i referti di laboratorio in formato testo, come gli esami del sangue. Non legge immagini diagnostiche (TAC, RM, ecografie) e non tratta referti istologici, genetici, in gravidanza o di minori.",
  },
  {
    topic: "servizio",
    q: "E se penso di avere un'emergenza?",
    a: "Non usare questo sito per le emergenze. In Italia chiama il 112 o rivolgiti ai servizi di emergenza.",
  },
  {
    topic: "dati",
    q: "Posso caricare il mio referto adesso?",
    a: "No. Il sito è in fase dimostrativa e non accetta documenti reali: prima servono verifiche legali, di sicurezza e cliniche che non sono ancora concluse. Puoi però provare tutto il percorso con un referto inventato.",
  },
  {
    topic: "dati",
    q: "Posso caricare il referto di un familiare?",
    a: "Quando il servizio sarà attivo, solo se sei autorizzato a farlo e nel rispetto delle condizioni previste per il trattamento dei suoi dati. Il servizio per i minori non è previsto nella prima versione.",
  },
  {
    topic: "dati",
    q: "Mi inviate il referto via email?",
    a: "No. Le email contengono solo un avviso e un collegamento protetto alla tua area riservata, mai il contenuto del referto.",
  },
  {
    topic: "medico",
    q: "Chi sono i medici?",
    a: "Medici abilitati e identificabili: prima di pagare leggi il nome di chi ti visita o ti risponde. Prima di attivare un medico controlliamo la sua iscrizione all'Albo. Oggi, nella versione dimostrativa, i medici sono profili di prova.",
  },
  {
    topic: "medico",
    q: "Che differenza c'è tra videoconsulto e secondo parere?",
    a: "Il videoconsulto è un colloquio con un medico di medicina generale: legge prima i documenti che scegli e ti orienta sul prossimo passo. Il secondo parere è di uno specialista, su una domanda precisa: esamina la documentazione, ne parlate in video e ricevi una sintesi scritta.",
  },
  {
    topic: "medico",
    q: "Come funziona il secondo parere?",
    a: "È la prestazione di uno specialista abilitato, non una risposta automatica, su un quesito circoscritto. Lo specialista esamina i documenti, può chiedere integrazioni o non accettare il caso, senza addebito. Se lo accetta ne parlate in video e ricevi una sintesi scritta nei tempi concordati. Oggi si può provare solo nella demo, con dati inventati.",
  },
  {
    topic: "medico",
    q: "Dove arriva la visita a domicilio?",
    a: "Partiamo da Brescia città come area pilota. Nella pagina del servizio inserisci comune e CAP: se non siamo ancora nella tua zona te lo diciamo subito e ti proponiamo un videoconsulto.",
  },
  {
    topic: "pagamenti",
    q: "Quanto costa?",
    a: "I prezzi sono fissi: li trovi nella pagina Prezzi e su ogni scheda, e il totale lo vedi sempre prima di confermare. Per le prestazioni con un medico paghi solo dopo che il medico ha confermato. Oggi i pagamenti sono simulati: non si può acquistare nulla.",
  },
  {
    topic: "pagamenti",
    q: "C'è un abbonamento?",
    a: "No. Paghi solo il servizio che scegli, una volta. Nessun abbonamento e nessun rinnovo automatico.",
  },
  {
    topic: "pagamenti",
    q: "Posso annullare una richiesta?",
    a: "Sì. Finché il medico non ha confermato non c'è alcun addebito. Dopo la conferma valgono i termini che leggi nel riepilogo della richiesta, prima di pagare, e nella pagina Prezzi.",
  },
];

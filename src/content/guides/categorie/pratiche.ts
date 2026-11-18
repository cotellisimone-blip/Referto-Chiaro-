import type { Guide } from "../schema";

/**
 * Guide pratiche (18/11/2026, secondo giro, punto 18). Nessun contenuto clinico: carte, copie, ricette, fotografie,
 * archivio. Le regole citate vengono da fonti ufficiali lette il 18/11/2026 (Gazzetta Ufficiale, Garante per la
 * protezione dei dati personali, Regione Lombardia); dove una regola cambia da Regione a Regione, la guida lo dice.
 * Sono le uniche guide, con il Fascicolo Sanitario, indicizzabili prima della revisione medica (src/lib/seo.ts).
 */
export const GUIDE_PRATICHE: Guide[] = [
  {
    slug: "copia-della-cartella-clinica",
    title: "Copia della cartella clinica: come chiederla e in quanto tempo",
    metaDescription: "Come chiedere la copia della cartella clinica dopo un ricovero: a chi rivolgersi, che cosa portare, i tempi previsti dalla legge (7 e 30 giorni).",
    category: "come-leggere",
    practical: true,
    examName: "Copia della cartella clinica",
    aliases: ["cartella clinica", "copia cartella clinica", "documentazione sanitaria", "richiesta cartella clinica"],
    summary: "Dopo un ricovero puoi chiedere alla struttura la copia della tua cartella clinica. La legge 24 del 2017 prevede che la documentazione disponibile sia fornita entro sette giorni dalla richiesta, e le eventuali integrazioni entro trenta.",
    sections: {
      whatItMeasures: [
        "La cartella clinica è il fascicolo che l'ospedale o la casa di cura compila durante un ricovero: raccoglie il diario delle giornate, gli esami eseguiti, le terapie, gli eventuali interventi e la lettera di dimissione. La copia è una riproduzione di questi documenti rilasciata dalla direzione sanitaria della struttura.",
        "Non va confusa con la lettera di dimissione, che ricevi il giorno dell'uscita e riassume il ricovero in poche pagine, né con i singoli referti, che spesso trovi anche nel Fascicolo Sanitario Elettronico.",
      ],
      whyRequested: [
        "Serve quando un altro medico deve conoscere in dettaglio che cosa è stato fatto durante il ricovero: per una visita specialistica, per un secondo parere, per proseguire le cure in un'altra struttura, oppure semplicemente per tenere in ordine la propria storia sanitaria.",
      ],
      howToRead: [
        "Una cartella clinica è lunga e scritta per gli addetti ai lavori. Per orientarti parti dalla lettera di dimissione, che di solito apre o chiude il fascicolo: dice perché sei stato ricoverato, che cosa è stato fatto e che cosa è indicato per il dopo. I referti degli esami sono raccolti per data.",
        "Non è necessario capire tutto: la cartella si porta al medico che ti segue. Se una parola ti blocca, puoi cercarla nel nostro glossario; che cosa significa per te lo dice il medico.",
      ],
      factors: [
        "La legge parla di sette giorni per la documentazione disponibile e di trenta giorni al massimo per le integrazioni.",
        "La copia può avere un costo, stabilito dalla struttura: chiedilo quando presenti la richiesta.",
        "La legge indica di fornirla preferibilmente in formato elettronico: puoi chiedere se è possibile.",
        "Se la richiesta la fa un'altra persona, la struttura chiede una delega scritta e i documenti di entrambi.",
        "Ogni struttura ha il suo modulo e il suo sportello: le istruzioni sono sul sito o all'ufficio cartelle cliniche.",
      ],
    },
    procedure: {
      preparation: [
        "Ti servono un documento d'identità valido e i dati del ricovero: reparto e date di ingresso e di uscita, che trovi sulla lettera di dimissione. Se la richiesta è per un familiare, informati prima su quali documenti chiede la struttura a chi non è il diretto interessato.",
      ],
      whatToExpect: [
        "La richiesta si presenta alla direzione sanitaria o all'ufficio cartelle cliniche della struttura in cui sei stato ricoverato: allo sportello, per PEC o con un modulo online, secondo quello che la struttura prevede.",
        "Nel modulo indichi i tuoi dati, il ricovero a cui ti riferisci e come vuoi ricevere la copia: ritiro allo sportello, spedizione o formato elettronico, se disponibile. Conserva la ricevuta con la data della richiesta: i tempi si contano da lì.",
      ],
      duration: "Per legge, sette giorni per la documentazione disponibile; trenta al massimo per le integrazioni.",
      afterwards: [
        "Quando ricevi la copia, controlla che ci siano la lettera di dimissione e i referti degli esami principali. Tienila insieme agli altri documenti sanitari e portala, o porta le parti che servono, alla visita successiva.",
      ],
      reportContains: [
        "Che i tuoi dati e le date del ricovero siano corretti.",
        "La lettera di dimissione.",
        "I referti degli esami di laboratorio e per immagini eseguiti durante il ricovero.",
        "L'eventuale descrizione dell'intervento.",
        "Le terapie indicate alla dimissione.",
      ],
    },
    questionsForDoctor: [
      "Quali parti della cartella clinica le servono per la visita?",
      "Basta la lettera di dimissione o è utile la copia completa?",
      "Ci sono esami del ricovero che conviene confrontare con quelli di oggi?",
    ],
    faq: [
      { q: "Entro quanto tempo devono darmi la copia?", a: "La legge 8 marzo 2017, n. 24 (articolo 4) prevede che la direzione sanitaria fornisca la documentazione disponibile entro sette giorni dalla richiesta, preferibilmente in formato elettronico, e le eventuali integrazioni entro il termine massimo di trenta giorni." },
      { q: "Può chiederla un familiare al posto mio?", a: "La struttura deve verificare che chi chiede ne abbia titolo: in genere servono una delega scritta firmata da te e la copia dei documenti di entrambi. Le regole precise sono nel modulo della struttura." },
      { q: "La lettera di dimissione non basta?", a: "Per molte visite sì: riassume il ricovero. La copia completa serve quando il medico vuole vedere i dettagli, per esempio tutti gli esami o la descrizione di un intervento. Chiedi a lui che cosa preferisce." },
    ],
    relatedGuides: ["fascicolo-sanitario-elettronico", "conservare-i-referti", "cosa-chiedere-al-medico"],
    glossaryTerms: [],
    sources: [{ title: "Legge 8 marzo 2017, n. 24, articolo 4 (Trasparenza dei dati) — Gazzetta Ufficiale n. 64 del 17 marzo 2017", url: "https://www.gazzettaufficiale.it/eli/gu/2017/03/17/64/sg/pdf" }],
    lastUpdated: "2026-11-18",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "referti-online-e-per-email",
    title: "Referti online e per email: le regole e i tempi da sapere",
    metaDescription: "Referti online: il servizio è facoltativo, il referto resta disponibile al massimo 45 giorni e per email arriva come allegato protetto. Le regole del Garante.",
    category: "come-leggere",
    practical: true,
    examName: "Referti online e per email",
    aliases: ["referto online", "ritiro referti online", "referto via email", "scaricare il referto"],
    summary: "Molti laboratori permettono di ricevere il referto online o per email. Secondo le regole del Garante per la protezione dei dati personali il servizio è facoltativo, il referto resta sul sito al massimo 45 giorni e puoi sempre avere la copia su carta.",
    sections: {
      whatItMeasures: [
        "La refertazione online è il servizio con cui una struttura sanitaria ti mette a disposizione il referto su un sito protetto, oppure te lo invia per posta elettronica, invece di consegnartelo solo allo sportello. Il documento è lo stesso: cambia il modo in cui lo ricevi.",
        "Le regole sono state fissate dal Garante per la protezione dei dati personali: il servizio richiede il tuo consenso esplicito, e chi non lo dà riceve comunque la prestazione e il referto nei modi tradizionali.",
      ],
      whyRequested: [
        "Serve a non tornare alla struttura solo per ritirare un foglio, e ad avere subito un file da conservare o da mostrare al medico. È utile soprattutto a chi abita lontano dal laboratorio o ritira gli esami per un familiare.",
      ],
      howToRead: [
        "Il referto scaricato è un PDF con gli stessi contenuti di quello su carta: dati della struttura, nome degli esami, risultati, unità di misura e intervalli di riferimento. Scaricalo e salvalo così com'è, senza modificarlo: è il documento che fa fede.",
        "Leggere un referto da soli, senza il medico davanti, può lasciare dubbi. Per questo le regole del Garante prevedono che il medico sia disponibile a dare indicazioni su richiesta. Segna le tue domande e portale alla visita.",
      ],
      factors: [
        "Il referto resta disponibile sul sito per un tempo limitato: al massimo 45 giorni. Scaricalo subito.",
        "Per email il referto arriva come allegato, non nel testo del messaggio, e il file è protetto, per esempio con una password.",
        "Puoi sempre chiedere la copia su carta, e ritirarla alla struttura.",
        "Anche dopo aver aderito puoi chiedere che un singolo esame non sia reso disponibile online.",
        "Gli esiti di indagini genetiche e del test HIV non vengono comunicati con questi sistemi.",
        "Il mancato consenso al servizio online non può impedirti di fare l'esame.",
      ],
    },
    procedure: {
      preparation: [
        "Al momento dell'accettazione la struttura ti chiede se vuoi il referto online e ti consegna le credenziali: di solito un codice stampato sul foglio di ritiro e una password, oppure l'accesso con SPID o CIE. Tieni il foglio fino a quando non hai scaricato il file.",
      ],
      whatToExpect: [
        "Quando il referto è pronto ricevi un avviso, per SMS o per email, oppure lo trovi nella data indicata sul foglio di ritiro. Entri nel sito della struttura con le credenziali, apri il documento e lo scarichi in PDF.",
        "Se hai scelto l'invio per email, apri l'allegato con la password che ti è stata data a parte. Non inoltrare il messaggio ad altri se non serve: contiene dati sulla tua salute.",
      ],
      duration: "Pochi minuti. Il referto resta sul sito al massimo 45 giorni.",
      afterwards: [
        "Salva il PDF in una cartella che ritrovi, con un nome che dica che cosa è e la data, per esempio «2026-11 esami del sangue». Se usi un computer condiviso, cancella il file dalla cartella dei download dopo averlo copiato al sicuro.",
      ],
      reportContains: [
        "Che nome, cognome e data di nascita siano i tuoi.",
        "La data del prelievo o dell'esame.",
        "Che il file si apra e abbia tutte le pagine.",
        "Risultato, unità di misura e intervallo di riferimento per ogni esame.",
      ],
    },
    questionsForDoctor: [
      "Preferisce che le mandi il PDF prima della visita o che lo porti con me?",
      "Quali referti precedenti è utile avere a portata di mano?",
      "A chi posso rivolgermi se leggendo il referto ho un dubbio prima della visita?",
    ],
    faq: [
      { q: "Sono obbligato a ricevere il referto online?", a: "No. Il servizio è facoltativo e richiede il tuo consenso. Il Garante precisa che il mancato consenso non deve precludere in alcun modo la prestazione richiesta, e che resta la possibilità di ritirare il referto su carta." },
      { q: "Sono passati i 45 giorni e non l'ho scaricato: che cosa faccio?", a: "Chiedi alla struttura una copia del referto: il documento esiste ancora nei suoi archivi, è solo scaduta la disponibilità sul sito. Se la struttura è collegata, puoi trovarlo anche nel Fascicolo Sanitario Elettronico." },
      { q: "Perché l'email ha un allegato con password?", a: "Perché un referto contiene dati sulla salute. Le regole del Garante chiedono che sia spedito in allegato, non nel corpo del messaggio, e che il file sia protetto, per esempio con una password comunicata a parte." },
    ],
    relatedGuides: ["fascicolo-sanitario-elettronico", "conservare-i-referti", "fotografare-un-referto"],
    glossaryTerms: ["intervallo-di-riferimento", "unita-di-misura"],
    sources: [
      { title: "Referti online: le domande più frequenti — Garante per la protezione dei dati personali", url: "https://www.garanteprivacy.it/faq/referti-online" },
      { title: "Linee guida in tema di referti on-line, 19 novembre 2009 — Garante per la protezione dei dati personali", url: "https://garanteprivacy.it/garante/doc.jsp?ID=1679033" },
    ],
    lastUpdated: "2026-11-18",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "fotografare-un-referto",
    title: "Fotografare un referto con il telefono: come farlo bene",
    metaDescription: "Come fotografare un referto con il telefono perché si legga davvero: luce, inquadratura, una pagina per foto, controllo dei numeri e dove salvare le immagini.",
    category: "come-leggere",
    practical: true,
    examName: "Fotografare un referto",
    aliases: ["foto del referto", "scansionare un referto", "scansione referto", "foto analisi"],
    summary: "Una foto fatta bene vale quanto una fotocopia: si leggono i numeri, le unità di misura e i margini. Bastano una superficie piana, luce uniforme, una pagina per foto e un controllo finale ingrandendo l'immagine.",
    sections: {
      whatItMeasures: [
        "Fotografare un referto vuol dire trasformare un foglio di carta in un'immagine leggibile sul telefono: per mandarla al medico, per conservarla, per caricarla in un servizio che la legge. Non cambia il documento: l'originale di carta resta quello che fa fede.",
      ],
      whyRequested: [
        "Serve quando hai solo la copia su carta e vuoi averla sempre con te, o quando un medico ti chiede di anticipare gli esami prima della visita. Se il referto esiste già in PDF, nel Fascicolo Sanitario Elettronico o sul sito del laboratorio, il PDF è sempre meglio della foto.",
      ],
      howToRead: [
        "Dopo lo scatto ingrandisci l'immagine con due dita e prova a leggere tre cose: un numero con la virgola, la sua unità di misura e l'intervallo di riferimento accanto. Se uno dei tre non si legge senza sforzo, rifai la foto: un 1,0 scambiato per un 10 è l'errore più comune.",
        "Controlla anche i bordi: in alto devono vedersi il nome della struttura, il tuo nome e la data; in basso l'ultima riga e il numero di pagina. Una foto tagliata fa perdere proprio le note in fondo, dove spesso stanno le avvertenze del laboratorio.",
      ],
      factors: [
        "L'ombra della mano o del telefono sul foglio.",
        "Il riflesso del flash o di una lampada sulla carta lucida.",
        "Il foglio piegato o tenuto in mano invece che appoggiato.",
        "Il telefono inclinato: le righe in fondo diventano piccole e sfocate.",
        "Più pagine nella stessa foto.",
        "L'invio con app che comprimono le immagini: meglio inviare come documento.",
      ],
    },
    procedure: {
      preparation: [
        "Stendi il foglio su un tavolo di colore diverso dalla carta, vicino a una finestra o sotto una luce che non faccia ombra. Togli graffette e pieghe. Pulisci l'obiettivo del telefono con un panno: è la causa più frequente delle foto velate.",
      ],
      whatToExpect: [
        "Tieni il telefono parallelo al foglio, sopra il centro della pagina, e avvicinati finché il foglio riempie lo schermo lasciando un piccolo margine. Tocca lo schermo sul testo per mettere a fuoco e scatta senza flash. Una pagina per foto, nell'ordine in cui sono numerate.",
        "Molti telefoni hanno una funzione di scansione dei documenti, nell'app Note o File su iPhone e in Google Drive su Android: raddrizza il foglio, toglie le ombre e salva più pagine in un unico PDF. Se c'è, usala.",
      ],
      duration: "Un paio di minuti per un referto di due o tre pagine.",
      afterwards: [
        "Dai al file un nome con la data e il tipo di esame e spostalo dalla galleria delle foto a una cartella dedicata. Ricorda che nella galleria le foto dei referti possono finire nei salvataggi automatici condivisi con la famiglia: controlla le impostazioni.",
      ],
      reportContains: [
        "Nome della struttura, tuo nome e data dell'esame, in alto.",
        "Tutte le righe, fino all'ultima, con le note in fondo.",
        "Numeri, virgole e unità di misura leggibili ingrandendo.",
        "Tutte le pagine, nell'ordine giusto.",
      ],
    },
    questionsForDoctor: [
      "Le va bene ricevere le foto del referto o preferisce il PDF?",
      "A quale indirizzo o con quale strumento posso mandarle gli esami in modo riservato?",
      "Devo portare comunque l'originale su carta alla visita?",
    ],
    faq: [
      { q: "Meglio la foto o il PDF?", a: "Il PDF, quando c'è: il testo è nitido e non dipende dalla luce. Prima di fotografare, guarda se il referto è già nel Fascicolo Sanitario Elettronico o sul sito del laboratorio. La foto è la soluzione per i fogli che esistono solo su carta." },
      { q: "Posso mandare la foto con un'app di messaggi?", a: "Puoi, ma molte app riducono la qualità delle immagini. Se l'app lo permette, invia la foto come documento o file: resta alla qualità originale. E manda dati sulla salute solo a chi deve riceverli." },
      { q: "Cura Privata legge le foto dei referti?", a: "Il servizio è pensato per leggere PDF e fotografie di referti di laboratorio, e ti fa sempre controllare i valori letti prima di spiegarli. Oggi il sito è una versione dimostrativa e non accetta documenti reali." },
    ],
    relatedGuides: ["referti-online-e-per-email", "fascicolo-sanitario-elettronico", "come-leggere-un-referto-di-laboratorio"],
    glossaryTerms: ["unita-di-misura", "intervallo-di-riferimento"],
    sources: [],
    lastUpdated: "2026-11-18",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "conservare-i-referti",
    title: "Conservare i referti: che cosa tenere e come ordinarli",
    metaDescription: "Come tenere in ordine referti e documenti sanitari, su carta e in digitale: che cosa conservare, come dare i nomi ai file e che cosa portare alla visita.",
    category: "come-leggere",
    practical: true,
    examName: "Conservare i referti",
    aliases: ["archivio dei referti", "ordinare i referti", "documenti sanitari", "quanto conservare i referti"],
    summary: "Un referto serve anche anni dopo, quando un medico vuole confrontarlo con uno nuovo. Per i tuoi documenti non c'è una scadenza: conviene tenerli, in ordine di data, e scaricare subito quelli online, che sul sito del laboratorio restano al massimo 45 giorni.",
    sections: {
      whatItMeasures: [
        "Conservare i referti vuol dire avere, a casa o sul telefono, la tua storia sanitaria in ordine: esami del sangue, referti di radiologia, lettere di dimissione, visite specialistiche. Non è un obbligo: è quello che permette a un medico di vedere come sono cambiati i valori nel tempo.",
        "Una parte di questi documenti si trova già nel Fascicolo Sanitario Elettronico della tua Regione. Non sempre c'è tutto: gli esami fatti in strutture non ancora collegate e quelli più vecchi possono mancare. Per questo un archivio personale resta utile.",
      ],
      whyRequested: [
        "Serve ogni volta che cambi medico, fai una visita specialistica o ripeti un esame: il confronto con il referto precedente dice spesso più del singolo numero. Serve anche a non rifare esami già fatti solo perché il foglio non si trova.",
      ],
      howToRead: [
        "Un archivio si legge per data. Che sia un raccoglitore o una cartella sul telefono, metti i documenti dal più recente al più vecchio e dividili in poche sezioni: esami del sangue e delle urine, esami per immagini, ricoveri, visite.",
        "Quando confronti due esami dello stesso tipo, controlla che l'unità di misura e l'intervallo di riferimento siano gli stessi: laboratori diversi possono usare unità e intervalli diversi, e i numeri non si confrontano alla cieca.",
      ],
      factors: [
        "I referti online restano sul sito della struttura al massimo 45 giorni: vanno scaricati subito.",
        "La carta termica di alcuni tracciati e scontrini sbiadisce: meglio fotografarla presto.",
        "I dischi con le immagini di TAC e risonanze si leggono solo con un computer: conserva sempre anche il referto scritto.",
        "Un solo posto, sempre lo stesso: i documenti sparsi tra email, telefono e cassetti sono quelli che si perdono.",
        "Sono dati sulla salute: una cartella sul telefono va protetta con il blocco dello schermo.",
      ],
    },
    procedure: {
      preparation: [
        "Raccogli quello che hai: fogli, dischi, email dei laboratori, file scaricati. Procurati un raccoglitore con buste trasparenti per la carta e crea una cartella sul telefono o sul computer per i file, con una copia di sicurezza.",
      ],
      whatToExpect: [
        "Dai a ogni file un nome che cominci con la data scritta anno-mese, seguita dal tipo di esame: «2026-11 esami del sangue», «2025-03 ecografia addome». Così l'ordine alfabetico è già l'ordine di tempo.",
        "Scarica dal Fascicolo Sanitario Elettronico e dai siti dei laboratori i referti che ancora non hai. Fotografa o scansiona quelli che esistono solo su carta. Degli originali di carta tieni tutto ciò che riguarda ricoveri, interventi ed esami per immagini.",
      ],
      duration: "Un'ora la prima volta; poi due minuti a ogni nuovo esame.",
      afterwards: [
        "Prima di una visita prepara solo quello che serve: gli ultimi esami e quelli precedenti dello stesso tipo, la lettera di dimissione se c'è stato un ricovero, l'elenco dei farmaci che prendi. Il nostro strumento «Preparati alla visita» ti aiuta a fare la lista.",
      ],
      reportContains: [
        "Che ogni documento abbia la data e il nome della struttura.",
        "Che dei referti online tu abbia il PDF, non solo il messaggio di avviso.",
        "Che per ogni esame per immagini ci sia il referto scritto, non solo il disco.",
        "Che esista una seconda copia dei file, in un altro posto.",
      ],
    },
    questionsForDoctor: [
      "Quali esami precedenti le è utile vedere alla prossima visita?",
      "Di quali documenti conviene che tenga sempre una copia a portata di mano?",
      "Riesce a consultare il mio Fascicolo Sanitario Elettronico?",
    ],
    faq: [
      { q: "Per quanto tempo devo tenere i miei referti?", a: "Per i documenti che hai tu non c'è una scadenza di legge. Il consiglio pratico è non buttarli: un esame vecchio diventa utile quando un medico vuole vedere com'erano i valori anni prima. Occupano poco, soprattutto in digitale." },
      { q: "Se ho perso un referto posso riaverlo?", a: "Chiedilo alla struttura che ha eseguito l'esame: i tempi di conservazione nei suoi archivi dipendono dal tipo di documento, quindi conviene chiedere presto. Se la struttura è collegata, guarda anche nel Fascicolo Sanitario Elettronico." },
      { q: "È sicuro tenere i referti sul telefono?", a: "Lo è quanto il telefono: usa il blocco dello schermo, non lasciare i file nelle chat e fai una copia di sicurezza in un secondo posto. Evita le cartelle condivise con altre persone, se non lo hai deciso tu." },
    ],
    relatedGuides: ["fascicolo-sanitario-elettronico", "referti-online-e-per-email", "fotografare-un-referto", "copia-della-cartella-clinica"],
    glossaryTerms: ["intervallo-di-riferimento", "unita-di-misura"],
    sources: [
      { title: "Referti online: le domande più frequenti — Garante per la protezione dei dati personali", url: "https://www.garanteprivacy.it/faq/referti-online" },
      { title: "Fascicolo Sanitario Elettronico — portale nazionale", url: "https://www.fascicolosanitario.gov.it/" },
    ],
    lastUpdated: "2026-11-18",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "leggere-la-ricetta-classi-di-priorita",
    title: "Le lettere U B D P sulla ricetta: che cosa vogliono dire",
    metaDescription: "Che cosa vogliono dire le lettere U, B, D, P sulla ricetta per una visita o un esame, chi le sceglie e che cosa controllare prima di prenotare.",
    category: "come-leggere",
    practical: true,
    examName: "Ricetta e classi di priorità",
    aliases: ["impegnativa", "classe di priorità", "priorità U B D P", "ricetta dematerializzata", "prenotare una visita"],
    summary: "Sulla ricetta per una visita o un esame il medico indica una lettera: U, B, D o P. È la classe di priorità, cioè il tempo entro cui la prestazione va erogata dal servizio sanitario. La sceglie il medico in base alla sua valutazione, e si usa al momento della prenotazione.",
    sections: {
      whatItMeasures: [
        "La ricetta del Servizio sanitario, detta anche impegnativa, è il documento con cui il medico prescrive una visita specialistica o un esame. Oggi di solito è «dematerializzata»: ricevi un promemoria, su carta o sul telefono, con un numero di ricetta elettronica.",
        "Tra le informazioni della ricetta c'è la classe di priorità, una lettera che indica il tempo massimo di attesa previsto. La Regione Lombardia, per esempio, le descrive così: U urgente, nel più breve tempo possibile e comunque entro 72 ore; B breve, entro 10 giorni; D differibile, entro 30 giorni per le visite ed entro 60 per gli esami strumentali; P programmabile, entro 120 giorni.",
      ],
      whyRequested: [
        "La classe di priorità serve al centro di prenotazione per darti un appuntamento nei tempi che il medico ha ritenuto adatti. È il medico che prescrive a indicarla, in base alla sua valutazione: non si sceglie allo sportello e non dipende da quanto è lungo l'elenco delle attese.",
      ],
      howToRead: [
        "Sul promemoria cerca quattro cose: il numero della ricetta elettronica, che serve per prenotare; la prestazione prescritta, con il suo nome per esteso; il quesito del medico, cioè il motivo della richiesta; la casella della priorità con una delle quattro lettere.",
        "Trovi anche il tuo codice fiscale, l'eventuale codice di esenzione dal ticket e la data della prescrizione. Se qualcosa non corrisponde a quello che il medico ti ha detto a voce, chiedi a lui prima di prenotare: allo sportello la ricetta non si può correggere.",
      ],
      factors: [
        "I tempi massimi sono fissati dai piani per le liste di attesa e possono essere applicati in modo diverso da Regione a Regione: controlla la pagina della tua.",
        "La lettera la indica il medico che prescrive: allo sportello non si cambia.",
        "Per stare nei tempi, l'appuntamento può essere proposto in una struttura diversa da quella più vicina.",
        "Prima prenoti, più date trovi: conviene chiamare nei giorni subito dopo la prescrizione.",
        "Controlli e visite di ritorno già programmati seguono il calendario deciso con lo specialista.",
      ],
    },
    procedure: {
      preparation: [
        "Per prenotare ti servono il numero della ricetta elettronica e la tessera sanitaria con il codice fiscale. Tieni a portata di mano anche un calendario: avere più date libere aiuta a ottenere un appuntamento nei tempi.",
      ],
      whatToExpect: [
        "Si prenota al centro unico di prenotazione della tua Regione: per telefono, online, in farmacia o allo sportello, secondo quello che la Regione prevede. L'operatore legge la ricetta dal numero e propone le date disponibili nel tempo indicato dalla priorità.",
        "Se nei tempi non c'è posto, chiedi all'operatore che cosa prevede la tua Regione in questi casi: ogni Regione ha le sue regole per garantire la prestazione quando l'attesa supera il tempo massimo.",
      ],
      duration: "Pochi minuti per la prenotazione; il tempo di attesa dipende dalla lettera sulla ricetta.",
      afterwards: [
        "Segna data, ora e sede dell'appuntamento, e conserva il promemoria della ricetta: va portato il giorno dell'esame. Se non puoi andare, disdici in anticipo: liberi il posto per un'altra persona. Le regole sulla disdetta sono indicate nella conferma della prenotazione.",
      ],
      reportContains: [
        "Il numero della ricetta elettronica.",
        "Il nome della visita o dell'esame prescritto.",
        "La lettera della priorità: U, B, D oppure P.",
        "Il quesito del medico, cioè il motivo della richiesta.",
        "L'eventuale codice di esenzione dal ticket.",
      ],
    },
    questionsForDoctor: [
      "Quale priorità ha indicato sulla ricetta, e perché?",
      "Che cosa faccio se non trovo un appuntamento nei tempi indicati?",
      "Devo portare qualcosa di particolare il giorno dell'esame?",
      "Dopo l'esame, a chi porto il referto?",
    ],
    faq: [
      { q: "Chi decide la lettera sulla ricetta?", a: "Il medico che prescrive. La pagina della Regione Lombardia lo dice così: il medico prescrittore, in base alla valutazione clinica, deve fornire l'indicazione di priorità. Non la decide il centro di prenotazione." },
      { q: "I tempi sono uguali in tutta Italia?", a: "Le quattro lettere sono le stesse, e i tempi massimi nascono dai piani nazionali e regionali per le liste di attesa. L'applicazione può cambiare da Regione a Regione: per questo conviene leggere la pagina ufficiale della propria Regione sui tempi di attesa." },
      { q: "La lettera P vuol dire che l'esame è meno importante?", a: "No. Vuol dire solo che, secondo il medico che l'ha prescritto, può essere programmato in un tempo più lungo. Se hai dubbi sul perché di una priorità, la persona a cui chiedere è il medico che ha fatto la ricetta." },
    ],
    relatedGuides: ["cosa-chiedere-al-medico", "prima-del-prelievo", "fascicolo-sanitario-elettronico"],
    glossaryTerms: [],
    sources: [{ title: "Tempi di attesa delle prestazioni sanitarie — Regione Lombardia", url: "https://www.regione.lombardia.it/sanita/prenotazioni-e-tempi-d-attesa/tempi-attesa-pretazioni-sanitarie" }],
    lastUpdated: "2026-11-18",
    reviewStatus: "draft-needs-clinical-review",
  },
];

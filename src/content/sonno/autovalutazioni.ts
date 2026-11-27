import type { Autovalutazione } from "./schema";

/**
 * Le quattro autovalutazioni della sezione sonno (22/11/2026). Domande SCRITTE DA NOI, che seguono i temi dei
 * questionari validati senza ricopiarne testo, voci né punteggi: ISI (Bastien 2001), Epworth (Johns 1991), STOP-Bang
 * (Chung 2008) e i criteri IRLSSG (Allen 2014) sono citati come fonte d'ispirazione. Non sono validate: il risultato è
 * descritto in tre fasce a parole («pochi / alcuni / molti segnali»), mai come diagnosi. Le risposte restano nel
 * browser di chi le compila.
 */

const BOZZA = { stato: "bozza" } as const;
const OGGI = "2026-11-22";

const FREQ = [
  { l: "Mai o quasi mai", v: 0 },
  { l: "Una o due notti a settimana", v: 1 },
  { l: "Tre o quattro notti", v: 2 },
  { l: "Quasi tutte le notti", v: 3 },
];
const QUANTO = [
  { l: "Per niente", v: 0 },
  { l: "Un po'", v: 1 },
  { l: "Abbastanza", v: 2 },
  { l: "Molto", v: 3 },
];
const SINO = [
  { l: "No", v: 0 },
  { l: "Sì", v: 1 },
];
const SONNOLENZA = [
  { l: "Mai", v: 0 },
  { l: "Qualche volta", v: 1 },
  { l: "Spesso", v: 2 },
];

export const AV_INSONNIA: Autovalutazione = {
  slug: "autovalutazione-insonnia",
  porta: "Quanto pesa l'insonnia",
  titolo: "Quanto pesa l'insonnia:",
  em: "sei domande, due minuti.",
  seoTitle: "Insonnia: autovalutazione in 6 domande",
  metaDescription: "Sei domande scritte da noi per capire quanto l'insonnia pesa su notti e giornate, con le fonti. Non è una diagnosi: aiuta a parlarne con il medico.",
  intro: "Pensa alle tue notti e alle tue giornate. Non ci sono risposte giuste: rispondi come va di solito, non come nella notte peggiore. Il risultato ti aiuta a capire se vale la pena parlarne con il medico e che cosa raccontargli.",
  periodo: "Pensa alle ultime due settimane.",
  ispirazione: {
    nome: "Temi dell'Insomnia Severity Index (Bastien e altri, 2001) e criteri ICSD-3 per l'insonnia cronica",
    nota: "Le domande sono nostre e non ricopiano l'Insomnia Severity Index, che è protetto e ha un suo punteggio ufficiale. Seguono gli stessi temi (addormentarsi, risvegli, risveglio precoce, conseguenze di giorno, preoccupazione) ma non sono state validate: non danno il punteggio ISI e non fanno diagnosi.",
  },
  domande: [
    { id: "addormentarsi", t: "Quante sere ti serve più di mezz'ora per addormentarti?", opzioni: FREQ },
    { id: "risvegli", t: "Quante notti ti svegli e resti sveglio più di mezz'ora prima di riaddormentarti?", opzioni: FREQ },
    { id: "precoce", t: "Quante mattine ti svegli molto prima di quanto vorresti, senza riuscire a riaddormentarti?", opzioni: FREQ },
    { id: "giorno", t: "Di giorno, quanto il sonno scarso ti toglie energia, concentrazione o buonumore?", opzioni: QUANTO },
    { id: "pensiero", t: "La sera, quanto ti preoccupa l'idea di dormire male?", opzioni: QUANTO },
    {
      id: "durata",
      t: "Da quanto tempo va avanti così?",
      aiuto: "Questa domanda non conta nel risultato: serve a capire da quanto dura.",
      opzioni: [
        { l: "Meno di un mese", v: 0 },
        { l: "Da uno a tre mesi", v: 1 },
        { l: "Più di tre mesi", v: 2 },
      ],
      contaNelPunteggio: false,
    },
  ],
  fasce: [
    { min: 0, max: 4, titolo: "Pochi segnali di insonnia", testo: "Dalle tue risposte il sonno non sembra pesare molto sulle notti e sulle giornate. Se qualcosa ti preoccupa lo stesso, il diario di due settimane è un buon modo per vederci chiaro." },
    { min: 5, max: 9, titolo: "Alcuni segnali di insonnia", testo: "Qualche notte difficile, con un peso sulle giornate. Due settimane di diario aiutano a capire se è un periodo o qualcosa che si sta fissando, e danno al medico i numeri da guardare." },
    { min: 10, max: 15, titolo: "Molti segnali di insonnia", testo: "Le notti difficili sembrano frequenti e pesano sulle giornate. Vale la pena parlarne con il medico: l'insonnia si può affrontare, e il primo percorso raccomandato non è un farmaco. Porta il diario di due settimane." },
  ],
  avvisi: [
    {
      domanda: "durata",
      daValore: 2,
      tono: "nota",
      titolo: "Da più di tre mesi",
      testo: "Le linee guida parlano di insonnia cronica quando le difficoltà ci sono almeno tre notti a settimana da più di tre mesi, con conseguenze di giorno. Solo il medico può dire se è il tuo caso: diglielo, insieme al diario.",
    },
  ],
  poi: [
    { href: "/prenditi-cura-di-te/sonno/percorso-due-settimane", label: "Il percorso di due settimane" },
    { href: "/prenditi-cura-di-te/sonno/terapia-cognitivo-comportamentale", label: "La terapia senza farmaci" },
    { href: "/prenditi-cura-di-te/sonno/non-mi-addormento", label: "Non mi addormento" },
  ],
  fonti: [
    { ente: "Bastien CH, Vallières A, Morin CM, Sleep Med 2001", titolo: "Validation of the Insomnia Severity Index as an outcome measure for insomnia research", url: "https://pubmed.ncbi.nlm.nih.gov/11438246/" },
    { ente: "European Sleep Research Society (ESRS)", titolo: "European Insomnia Guideline 2023, J Sleep Res 2023", url: "https://onlinelibrary.wiley.com/doi/10.1111/jsr.14035" },
    { ente: "NHS", titolo: "Insomnia", url: "https://www.nhs.uk/conditions/insomnia/" },
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const AV_SONNOLENZA: Autovalutazione = {
  slug: "autovalutazione-sonnolenza",
  porta: "Sonnolenza di giorno",
  titolo: "Sonnolenza di giorno:",
  em: "quanto ti capita di appisolarti?",
  seoTitle: "Sonnolenza di giorno: autovalutazione",
  metaDescription: "Sei situazioni di tutti i giorni per capire quanto ti capita di appisolarti, più una sulla guida. Domande scritte da noi, con le fonti. Non è una diagnosi.",
  intro: "Per ogni situazione, pensa a quanto ti è capitato di appisolarti o di dover lottare per restare sveglio, non solo di sentirti stanco. Se una situazione non ti è capitata, pensa a come andrebbe.",
  periodo: "Pensa alle ultime due settimane.",
  ispirazione: {
    nome: "Idea della Epworth Sleepiness Scale (Johns, 1991): la sonnolenza in situazioni quotidiane",
    nota: "Le situazioni e le risposte sono nostre: non ricopiano la scala di Epworth, che è protetta e ha un suo punteggio. Ne riprendono solo l'idea di misurare la sonnolenza in momenti di tutti i giorni. Non sono state validate e non danno il punteggio di Epworth.",
  },
  domande: [
    { id: "riunione", t: "Seduto ad ascoltare: una riunione, una lezione, una funzione religiosa.", opzioni: SONNOLENZA },
    { id: "attesa", t: "In una sala d'attesa o in coda, senza niente da fare.", opzioni: SONNOLENZA },
    { id: "telefono", t: "Al telefono o in videochiamata, dopo qualche minuto.", opzioni: SONNOLENZA },
    { id: "film", t: "Guardando un film o una partita, la sera.", opzioni: SONNOLENZA },
    { id: "pranzo", t: "A tavola o subito dopo un pasto normale, senza alcol.", opzioni: SONNOLENZA },
    { id: "lavoro", t: "Al lavoro o mentre fai una cosa che richiede attenzione.", opzioni: SONNOLENZA },
    {
      id: "guida",
      t: "Ti è capitato di avere colpi di sonno alla guida, o di doverti fermare perché ti si chiudevano gli occhi?",
      aiuto: "Questa domanda non conta nel risultato: se rispondi sì, compare un avviso.",
      opzioni: SINO,
      contaNelPunteggio: false,
    },
  ],
  fasce: [
    { min: 0, max: 3, titolo: "Poca sonnolenza di giorno", testo: "Dalle tue risposte non ti capita spesso di appisolarti nelle situazioni di tutti i giorni." },
    { min: 4, max: 7, titolo: "Un po' di sonnolenza di giorno", testo: "Ti capita a volte di appisolarti. Può dipendere da notti corte, turni, farmaci, ma anche da un sonno disturbato. Il diario del sonno aiuta a capire se dormi abbastanza." },
    { min: 8, max: 12, titolo: "Molta sonnolenza di giorno", testo: "Ti capita spesso di appisolarti o di lottare per restare sveglio. È un segnale da riferire al medico: tra le cause possibili ci sono le apnee notturne e altri disturbi del sonno che si possono studiare." },
  ],
  avvisi: [
    {
      domanda: "guida",
      daValore: 1,
      tono: "attenzione",
      titolo: "Colpi di sonno alla guida: non aspettare",
      testo: "Parlane con il medico in tempi brevi. Nel frattempo non guidare quando hai sonno e, se succede, fermati in un posto sicuro appena puoi.",
    },
  ],
  poi: [
    { href: "/prenditi-cura-di-te/sonno/russo-e-sono-stanco", label: "Russo e sono stanco" },
    { href: "/prenditi-cura-di-te/sonno/autovalutazione-apnee", label: "Segnali delle apnee" },
    { href: "/prenditi-cura-di-te/sonno/quando-andare-dal-medico", label: "Quando andare dal medico" },
  ],
  fonti: [
    { ente: "Johns MW, Sleep 1991", titolo: "A new method for measuring daytime sleepiness: the Epworth sleepiness scale", url: "https://pubmed.ncbi.nlm.nih.gov/1798888/" },
    { ente: "NHS", titolo: "Sleep apnoea", url: "https://www.nhs.uk/conditions/sleep-apnoea/" },
    { ente: "Unione europea", titolo: "Direttiva 2014/85/UE sulla patente di guida (apnee ostruttive del sonno)", url: "https://eur-lex.europa.eu/eli/dir/2014/85/oj" },
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const AV_APNEE: Autovalutazione = {
  slug: "autovalutazione-apnee",
  porta: "Segnali delle apnee",
  titolo: "Segnali delle apnee:",
  em: "nove domande con un sì o un no.",
  seoTitle: "Apnee notturne: i segnali da riconoscere",
  metaDescription: "Nove domande scritte da noi su russare, pause del respiro e fattori di rischio delle apnee notturne, con le fonti. Non è una diagnosi: aiuta a parlarne.",
  intro: "Alcune domande riguardano quello che nota chi dorme con te: se puoi, rispondi insieme. Se non lo sai, rispondi «No».",
  periodo: "Pensa agli ultimi mesi.",
  ispirazione: {
    nome: "Temi del questionario STOP-Bang (Chung e altri, 2008) e dei segni delle apnee descritti da NHS e AASM",
    nota: "Le domande sono nostre e non ricopiano lo STOP-Bang, che ha una sua forma e un suo punteggio. Ne riprendono i temi (russare, stanchezza, pause notate, pressione, peso, età, sesso) con parole diverse. Non sono state validate e non danno il punteggio STOP-Bang.",
  },
  domande: [
    { id: "russare", t: "Qualcuno ti ha detto che russi forte, tanto da sentirti da un'altra stanza o con la porta chiusa?", opzioni: SINO },
    { id: "pause", t: "Qualcuno ha notato che di notte smetti di respirare, o che riprendi con uno sbuffo o un soffocamento?", opzioni: SINO },
    { id: "soffoco", t: "Ti capita di svegliarti con la sensazione di soffocare o con il fiato corto?", opzioni: SINO },
    { id: "stanco", t: "Di giorno sei stanco o assonnato anche dopo una notte intera a letto?", opzioni: SINO },
    { id: "mattino", t: "Ti svegli spesso con mal di testa o con la bocca molto secca?", opzioni: SINO },
    { id: "pressione", t: "Hai la pressione alta, o prendi farmaci per la pressione?", opzioni: SINO },
    { id: "peso", t: "Ti è stato detto che sei in obesità, o il tuo indice di massa corporea è sopra 30?", aiuto: "L'indice di massa corporea è il peso in kg diviso l'altezza in metri al quadrato.", opzioni: SINO },
    { id: "eta", t: "Hai più di 50 anni?", opzioni: SINO },
    { id: "uomo", t: "Sei un uomo?", aiuto: "Le apnee sono più frequenti negli uomini; nelle donne aumentano dopo la menopausa.", opzioni: SINO },
  ],
  fasce: [
    { min: 0, max: 2, titolo: "Pochi segnali delle apnee", testo: "Dalle tue risposte ci sono pochi segnali tipici delle apnee notturne. Se russi forte o sei stanco di giorno, dillo comunque al medico alla prossima visita." },
    { min: 3, max: 4, titolo: "Alcuni segnali delle apnee", testo: "Ci sono alcuni segnali che rendono le apnee più probabili. Vale la pena parlarne con il medico: è lui che valuta se serve un esame del sonno." },
    { min: 5, max: 9, titolo: "Molti segnali delle apnee", testo: "Ci sono molti dei segnali che i medici usano per sospettare le apnee notturne. Parlane con il medico: un esame del sonno, spesso fatto a casa, può chiarire." },
  ],
  avvisi: [
    {
      domanda: "pause",
      daValore: 1,
      tono: "nota",
      titolo: "Pause del respiro notate da qualcuno",
      testo: "È il segno che più spesso porta il medico a proporre un esame del sonno, anche quando gli altri sono pochi. Raccontalo alla visita, con le parole di chi l'ha notato.",
    },
  ],
  poi: [
    { href: "/prenditi-cura-di-te/sonno/apnee-notturne", label: "Le apnee notturne" },
    { href: "/prenditi-cura-di-te/sonno/esame-del-sonno", label: "L'esame del sonno" },
    { href: "/prenditi-cura-di-te/sonno/autovalutazione-sonnolenza", label: "Sonnolenza di giorno" },
  ],
  fonti: [
    { ente: "Chung F e altri, Anesthesiology 2008", titolo: "STOP questionnaire: a tool to screen patients for obstructive sleep apnea", url: "https://pubmed.ncbi.nlm.nih.gov/18431116/" },
    { ente: "NHS", titolo: "Sleep apnoea", url: "https://www.nhs.uk/conditions/sleep-apnoea/" },
    { ente: "American Academy of Sleep Medicine, J Clin Sleep Med 2017", titolo: "Clinical practice guideline for diagnostic testing for adult obstructive sleep apnea", url: "https://jcsm.aasm.org/doi/10.5664/jcsm.6506" },
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const AV_GAMBE: Autovalutazione = {
  slug: "autovalutazione-gambe",
  porta: "Gambe senza riposo",
  titolo: "Gambe senza riposo:",
  em: "i segni tipici, uno per uno.",
  seoTitle: "Gambe senza riposo: i segni tipici",
  metaDescription: "Cinque domande scritte da noi sui segni tipici della sindrome delle gambe senza riposo, con le fonti. Non è una diagnosi: aiuta a raccontarlo bene al medico.",
  intro: "Pensa alle sensazioni nelle gambe (a volte anche nelle braccia) quando stai fermo la sera o a letto. Se non sei sicuro, rispondi «No».",
  periodo: "Pensa all'ultimo mese.",
  ispirazione: {
    nome: "Criteri diagnostici del gruppo internazionale di studio sulle gambe senza riposo (IRLSSG, Allen e altri, 2014)",
    nota: "Le domande sono nostre e seguono i temi dei criteri diagnostici internazionali, senza ricopiarli. La diagnosi richiede anche di escludere altre cause (crampi, dolori articolari, posizioni scomode, gonfiore), e quella la fa il medico.",
  },
  domande: [
    { id: "bisogno", t: "Senti un bisogno forte di muovere le gambe, spesso con una sensazione sgradevole (formicolio, «tirare», scosse dentro)?", opzioni: SINO },
    { id: "fermo", t: "Il bisogno compare o peggiora quando sei fermo, seduto o sdraiato?", opzioni: SINO },
    { id: "movimento", t: "Muovendoti o camminando il fastidio passa, almeno finché ti muovi?", opzioni: SINO },
    { id: "sera", t: "È più forte la sera e la notte che al mattino?", opzioni: SINO },
    { id: "sonno", t: "Ti toglie il sonno o ti fa stare male, più volte a settimana?", opzioni: SINO, contaNelPunteggio: false, aiuto: "Questa domanda non conta nel risultato: dice quanto il disturbo pesa." },
  ],
  fasce: [
    { min: 0, max: 1, titolo: "Pochi segni tipici", testo: "Dalle tue risposte ci sono pochi dei segni tipici delle gambe senza riposo. Se le gambe ti disturbano lo stesso, raccontalo al medico: le cause possibili sono tante." },
    { min: 2, max: 3, titolo: "Alcuni segni tipici", testo: "Ci sono alcuni dei segni tipici, non tutti. Può trattarsi di altro (crampi, circolazione, posizione): il medico ti aiuta a distinguere." },
    { min: 4, max: 4, titolo: "I quattro segni tipici ci sono tutti", testo: "Le tue risposte corrispondono ai quattro segni con cui si descrive la sindrome delle gambe senza riposo. Solo il medico può dire se è il tuo caso: parlane, anche per controllare il ferro e i farmaci che prendi." },
  ],
  avvisi: [
    {
      domanda: "sonno",
      daValore: 1,
      tono: "nota",
      titolo: "Ti toglie il sonno",
      testo: "Quando i sintomi disturbano il sonno più volte a settimana è il momento di parlarne con il medico, che può controllare la ferritina e valutare le possibilità di cura.",
    },
  ],
  poi: [
    { href: "/prenditi-cura-di-te/sonno/gambe-senza-riposo", label: "Gambe senza riposo" },
    { href: "/guide/ferritina", label: "La ferritina, spiegata" },
  ],
  fonti: [
    { ente: "Allen RP e altri (IRLSSG), Sleep Med 2014", titolo: "Restless legs syndrome/Willis-Ekbom disease diagnostic criteria: updated IRLSSG consensus criteria", url: "https://pubmed.ncbi.nlm.nih.gov/25023924/" },
    { ente: "NHS", titolo: "Restless legs syndrome", url: "https://www.nhs.uk/conditions/restless-legs-syndrome/" },
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const AUTOVALUTAZIONI: Autovalutazione[] = [AV_INSONNIA, AV_SONNOLENZA, AV_APNEE, AV_GAMBE];

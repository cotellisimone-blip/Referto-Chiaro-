/**
 * Diari della salute (21/11/2026): pressione, glicemia, mal di testa. 22/11/2026: sonno, peso, respiro (picco di flusso).
 *
 * I moduli sono nostri. Seguono le indicazioni delle società scientifiche, che citiamo come fonte, ma non copiano i
 * loro diari (protetti da diritti). Il sito registra e riassume: non giudica i numeri, non dice mai di cambiare una
 * cura, non propone soglie. Le medie sono conti, non valutazioni.
 *
 * I testi sulla salute sono BOZZE: li rivede un medico prima della pubblicazione, e la pagina lo dice.
 */

export type DiarioSlug = "pressione" | "glicemia" | "cefalea" | "sonno" | "peso" | "respiro";

export interface Passo {
  /** Chiave del disegno (src/components/diari/disegni.tsx). */
  art: string;
  titolo: string;
  testo: string;
}

export interface Fonte {
  ente: string;
  titolo: string;
  url: string;
}

export interface Diario {
  slug: DiarioSlug;
  /** Nome breve, per menu e schede. */
  nome: string;
  /** Titolo della pagina pubblica, con la parola evidenziata a parte. */
  titolo: string;
  em: string;
  lead: string;
  /** Per chi è, in una riga. */
  perChi: string;
  /** Quando si compila, in una riga (la frequenza la decide il medico, salvo il protocollo standard della pressione). */
  quando: string;
  tono: "mi" | "in" | "sc" | "vi" | "al" | "es";
  icona: string;
  passi: Passo[];
  /** Che cosa contiene il diario (le colonne). */
  colonne: string[];
  /** Che cosa calcola il sito. */
  calcoli: string[];
  /** Domande che si sentono spesso, con risposte prudenti. */
  faq: { d: string; r: string }[];
  fonti: Fonte[];
  /** Promemoria proposti per il calendario del telefono. */
  promemoria: { orari: string[]; giorni: number; testo: string };
}

export const DIARI: Diario[] = [
  {
    slug: "pressione",
    nome: "Pressione",
    titolo: "Il diario della",
    em: "pressione.",
    lead: "Misurarla bene a casa vale quanto il numero stesso. Cinque passi per farlo come indicano le società scientifiche, un diario da stampare e uno da compilare dal telefono: le medie le facciamo noi.",
    perChi: "Per chi misura la pressione a casa, da solo o per un familiare.",
    quando: "Di solito 7 giorni prima della visita: 2 misure al mattino e 2 alla sera. Se il medico ti ha indicato altro, segui lui.",
    tono: "mi",
    icona: "cuore",
    passi: [
      {
        art: "p-riposo",
        titolo: "Cinque minuti seduto, in silenzio",
        testo: "Nei 30 minuti prima niente caffè, fumo o sforzi. Vai in bagno prima: anche la vescica piena cambia il numero.",
      },
      {
        art: "p-postura",
        titolo: "Schiena appoggiata, piedi a terra",
        testo: "Gambe non incrociate. Il braccio sta appoggiato sul tavolo, rilassato, con il bracciale all'altezza del cuore. Durante la misura non si parla.",
      },
      {
        art: "p-bracciale",
        titolo: "Il bracciale giusto, sul braccio nudo",
        testo: "Della misura adatta al tuo braccio, 2–3 cm sopra la piega del gomito. Meglio un apparecchio da braccio validato: l'elenco è su stridebp.org.",
      },
      {
        art: "p-due",
        titolo: "Due misure, a un minuto l'una dall'altra",
        testo: "Al mattino, prima della colazione e degli eventuali farmaci, e alla sera, prima di cena. Scrivi tutte e due le misure, anche se sono diverse.",
      },
      {
        art: "p-sette",
        titolo: "Per 7 giorni, poi al medico",
        testo: "Almeno 3 giorni, meglio 7. Il sito calcola le medie senza il primo giorno, come fanno le linee guida, e prepara il foglio per la visita.",
      },
    ],
    colonne: ["Giorno", "Mattina: 1ª e 2ª misura", "Sera: 1ª e 2ª misura", "Battiti (se l'apparecchio li mostra)", "Note"],
    calcoli: [
      "La media di massima e minima, del mattino e della sera.",
      "Quante misure hai fatto e in quanti giorni.",
      "Le medie senza il primo giorno, come indicano le linee guida europee.",
    ],
    faq: [
      {
        d: "Il braccio destro o il sinistro?",
        r: "La prima volta il medico la misura su tutti e due. Poi si usa sempre lo stesso braccio, di solito quello che lui ti indica.",
      },
      {
        d: "Le due misure sono diverse: quale scrivo?",
        r: "Tutte e due. È comune che la seconda sia un po' diversa dalla prima: per questo se ne fanno due.",
      },
      {
        d: "Va bene l'apparecchio da polso?",
        r: "Le società scientifiche preferiscono quello da braccio. Se usi quello da polso, tieni il polso all'altezza del cuore e dillo al medico.",
      },
    ],
    fonti: [
      {
        ente: "European Society of Hypertension (ESH)",
        titolo: "2021 ESH practice guidelines for office and out-of-office blood pressure measurement, J Hypertens 2021",
        url: "https://journals.lww.com/jhypertension/fulltext/2021/07000/2021_european_society_of_hypertension_practice.3.aspx",
      },
      {
        ente: "ESH",
        titolo: "2023 ESH Guidelines for the management of arterial hypertension, J Hypertens 2023",
        url: "https://journals.lww.com/jhypertension/fulltext/2023/12000/2023_esh_guidelines_for_the_management_of_arterial.2.aspx",
      },
      {
        ente: "Società Italiana dell'Ipertensione Arteriosa (SIIA)",
        titolo: "Materiali per i pazienti sulla misurazione della pressione a domicilio",
        url: "https://siia.it",
      },
      {
        ente: "STRIDE BP",
        titolo: "Elenco internazionale degli apparecchi per la pressione validati",
        url: "https://www.stridebp.org",
      },
    ],
    promemoria: { orari: ["07:30", "20:00"], giorni: 7, testo: "Misura la pressione: 2 misure, a un minuto l'una dall'altra." },
  },
  {
    slug: "glicemia",
    nome: "Glicemia",
    titolo: "Il diario della",
    em: "glicemia.",
    lead: "Per chi controlla la glicemia con il pungidito: cinque passi per una misura affidabile, un diario da stampare e uno da compilare dal telefono, con le medie per momento della giornata.",
    perChi: "Per chi controlla la glicemia a casa con il glucometro, da solo o per un familiare.",
    quando: "Quando e quante volte lo decide il tuo medico o il centro diabetologico: dipende dalla cura che segui.",
    tono: "in",
    icona: "goccia",
    passi: [
      {
        art: "g-mani",
        titolo: "Mani lavate e asciutte",
        testo: "Acqua tiepida e sapone, poi asciuga bene. Un po' di zucchero sulle dita, anche da un frutto, basta a falsare il numero.",
      },
      {
        art: "g-strisce",
        titolo: "Strisce in ordine",
        testo: "Controlla la scadenza e richiudi subito il flacone. Strisce lasciate all'aria o al caldo danno numeri meno affidabili.",
      },
      {
        art: "g-dito",
        titolo: "Il lato del polpastrello, cambiando dito",
        testo: "Sul lato fa meno male. Cambia dito ogni volta e lascia formare la goccia senza spremere forte.",
      },
      {
        art: "g-momento",
        titolo: "Scrivi subito il momento",
        testo: "A digiuno, prima di un pasto, 2 ore dopo l'inizio del pasto, prima di dormire. Senza il momento, il numero dice poco al medico.",
      },
      {
        art: "g-note",
        titolo: "Una nota quando qualcosa cambia",
        testo: "Un pasto diverso, più movimento, un malessere, una dose dimenticata. Al medico serve per leggere i numeri.",
      },
    ],
    colonne: ["Giorno e ora", "Momento (digiuno, prima o dopo il pasto, sera)", "Valore in mg/dL", "Note"],
    calcoli: [
      "La media per momento della giornata: a digiuno, prima dei pasti, dopo i pasti, sera.",
      "Il valore più alto e il più basso di ogni momento.",
      "Quante misure hai fatto nel periodo.",
    ],
    faq: [
      {
        d: "Ho il sensore: mi serve il diario?",
        r: "Il sensore registra da solo. Il diario può servire per le note: pasti, attività, malesseri. Chiedi al tuo centro come preferisce riceverle.",
      },
      {
        d: "Che cosa faccio se il numero mi sembra strano?",
        r: "Lava le mani e ripeti la misura. Se ti senti male, segui le indicazioni che ti ha dato il tuo medico; in emergenza chiama il 112.",
      },
      {
        d: "mg/dL o mmol/L?",
        r: "In Italia quasi tutti i glucometri usano mg/dL. Il diario usa mg/dL: se il tuo apparecchio mostra mmol/L, scrivilo nelle note.",
      },
    ],
    fonti: [
      {
        ente: "Società Italiana di Diabetologia (SID) e Associazione Medici Diabetologi (AMD)",
        titolo: "Standard italiani per la cura del diabete mellito e Linee guida sulla terapia del diabete tipo 2 (Sistema Nazionale Linee Guida, ISS)",
        url: "https://www.siditalia.it",
      },
      {
        ente: "AMD, SID, SIEDP",
        titolo: "Raccomandazioni sull'autocontrollo della glicemia",
        url: "https://aemmedi.it",
      },
      {
        ente: "American Diabetes Association",
        titolo: "Standards of Care in Diabetes, sezione 7: Diabetes Technology",
        url: "https://diabetesjournals.org/care",
      },
    ],
    promemoria: { orari: ["07:30", "13:30", "21:30"], giorni: 14, testo: "Glicemia: misura e scrivi il momento." },
  },
  {
    slug: "cefalea",
    nome: "Mal di testa",
    titolo: "Il diario del",
    em: "mal di testa.",
    lead: "Per chi ha mal di testa che tornano. Un episodio si scrive in 20 secondi: quando, quanto forte, che cosa hai preso. Dopo un mese, il medico vede in un colpo d'occhio quello che a parole è difficile ricordare.",
    perChi: "Per chi ha episodi di mal di testa che si ripetono, ed è seguito o vuole farsi vedere da un medico.",
    quando: "Ogni volta che hai mal di testa, e una spunta veloce la sera nei giorni senza. Di solito per 1–3 mesi prima della visita.",
    tono: "sc",
    icona: "testa",
    passi: [
      {
        art: "c-subito",
        titolo: "Scrivi appena puoi",
        testo: "Il giorno, l'ora in cui è iniziato e quanto è durato. A memoria, dopo qualche giorno, i dettagli si perdono.",
      },
      {
        art: "c-intensita",
        titolo: "Quanto forte, in tre parole",
        testo: "Lieve: fai tutto. Media: fai le cose, ma a fatica. Forte: ti fermi. Non servono numeri difficili.",
      },
      {
        art: "c-sintomi",
        titolo: "Che cosa c'era insieme",
        testo: "Nausea, fastidio per la luce o per i rumori, disturbi della vista prima del dolore. Basta una spunta.",
      },
      {
        art: "c-farmaco",
        titolo: "Che cosa hai preso per il dolore",
        testo: "Il nome e l'ora. Al medico interessa anche quanti giorni al mese prendi qualcosa: il diario li conta per te.",
      },
      {
        art: "c-mese",
        titolo: "Anche i giorni senza",
        testo: "Una spunta la sera, «Oggi niente mal di testa». Dopo un mese il calendario mostra al medico il quadro intero.",
      },
    ],
    colonne: ["Giorno", "Ora di inizio e durata", "Intensità: lieve, media, forte", "Nausea, luce, rumori, vista", "Che cosa hai preso e a che ora", "Possibili fattori (sonno, ciclo, stress, cibo)"],
    calcoli: [
      "In quanti giorni del mese hai avuto mal di testa.",
      "Quanti episodi sono stati lievi, medi o forti.",
      "In quanti giorni hai preso qualcosa per il dolore.",
    ],
    faq: [
      {
        d: "Perché segnare anche i giorni senza mal di testa?",
        r: "Perché così il medico sa che il diario è completo: un giorno vuoto può voler dire «niente dolore» oppure «dimenticato».",
      },
      {
        d: "Quando non aspettare il diario?",
        r: "Se il mal di testa è improvviso e fortissimo, diverso dal solito, o arriva con febbre, confusione o debolezza a un braccio: chiama il 112.",
      },
    ],
    fonti: [
      {
        ente: "Società Italiana per lo Studio delle Cefalee (SISC)",
        titolo: "Linee guida e materiali per i pazienti sulle cefalee primarie",
        url: "https://www.sisc.it",
      },
      {
        ente: "International Headache Society",
        titolo: "Classificazione internazionale delle cefalee, 3ª edizione (ICHD-3), Cephalalgia 2018",
        url: "https://ichd-3.org",
      },
      {
        ente: "European Headache Federation",
        titolo: "Materiali sul diario delle cefalee",
        url: "https://ehf-org.org",
      },
    ],
    promemoria: { orari: ["21:00"], giorni: 30, testo: "Diario del mal di testa: oggi com'è andata?" },
  },
  {
    slug: "sonno",
    nome: "Sonno",
    titolo: "Il diario del",
    em: "sonno.",
    lead: "Per chi dorme male da settimane. Ogni mattina, appena sveglio, un minuto: a che ora sei andato a letto, quando ti sei svegliato, com'è andata. Dopo due settimane il medico vede le tue notti, non solo il ricordo dell'ultima.",
    perChi: "Per chi fa fatica ad addormentarsi, si sveglia spesso o si sente stanco al mattino, e ne vuole parlare con il medico.",
    quando: "Ogni mattina, entro un'ora dal risveglio, per almeno 2 settimane prima della visita.",
    tono: "vi",
    icona: "luna",
    passi: [
      {
        art: "s-mattino",
        titolo: "Al mattino, appena sveglio",
        testo: "Entro un'ora dal risveglio, quando la notte è ancora fresca nella memoria. Bastano un minuto e il telefono, o il foglio sul comodino.",
      },
      {
        art: "s-orari",
        titolo: "A letto e in piedi: due orari",
        testo: "L'ora in cui hai spento la luce per dormire e quella in cui ti sei alzato. Non serve la precisione al minuto: va bene una stima.",
      },
      {
        art: "s-addormentarsi",
        titolo: "Quanto ci hai messo ad addormentarti",
        testo: "Una stima in minuti, senza guardare l'orologio durante la notte: controllare l'ora rende più difficile riaddormentarsi.",
      },
      {
        art: "s-risvegli",
        titolo: "Quante volte ti sei svegliato",
        testo: "Conta i risvegli che ricordi e scegli com'è andata: male, così così, bene. Pisolini, caffè o alcol della sera vanno nella nota.",
      },
      {
        art: "s-settimane",
        titolo: "Due settimane, anche le notti buone",
        testo: "Le notti buone dicono al medico quanto quelle difficili. Il sito calcola le medie e prepara il foglio per la visita.",
      },
    ],
    colonne: ["Notte (data del mattino)", "Ora in cui hai spento la luce", "Minuti per addormentarti", "Risvegli", "Ora in cui ti sei alzato", "Com'è andata", "Note: pisolini, caffè, alcol, farmaci"],
    calcoli: [
      "Il tempo medio passato a letto, notte per notte.",
      "In media quanti minuti per addormentarti e quanti risvegli.",
      "Quante notti sono andate bene, così così o male.",
    ],
    faq: [
      {
        d: "Non ricordo bene l'ora: scrivo lo stesso?",
        r: "Sì. Il diario del sonno si basa su stime: conta di più compilarlo ogni mattina che essere precisi al minuto.",
      },
      {
        d: "Ho un orologio che misura il sonno: serve il diario?",
        r: "Può servire lo stesso, perché dice come hai vissuto tu la notte. Porta al medico tutti e due, se vuoi.",
      },
      {
        d: "Prendo qualcosa per dormire: lo scrivo?",
        r: "Sì, nella nota: il nome e l'ora. Le decisioni sui farmaci restano al tuo medico.",
      },
    ],
    fonti: [
      {
        ente: "Carney CE e altri (gruppo di consenso)",
        titolo: "The Consensus Sleep Diary: standardizing prospective sleep self-monitoring, Sleep 2012",
        url: "https://academic.oup.com/sleep/article/35/2/287/2558991",
      },
      {
        ente: "European Sleep Research Society (ESRS)",
        titolo: "European Insomnia Guideline 2023, J Sleep Res 2023",
        url: "https://onlinelibrary.wiley.com/doi/10.1111/jsr.14035",
      },
      {
        ente: "Associazione Italiana di Medicina del Sonno (AIMS)",
        titolo: "Materiali per i pazienti sul sonno e l'insonnia",
        url: "https://www.sonnomed.it",
      },
    ],
    promemoria: { orari: ["08:00"], giorni: 14, testo: "Diario del sonno: com'è andata la notte?" },
  },
  {
    slug: "peso",
    nome: "Peso",
    titolo: "Il diario del",
    em: "peso.",
    lead: "Per chi deve pesarsi spesso su indicazione del medico. Conta la regolarità: stessa ora, stessa bilancia, stessi vestiti. Tu scrivi il numero, noi teniamo il conto e il grafico.",
    perChi: "Per chi deve tenere d'occhio il peso su indicazione del medico: per il cuore, i reni, un percorso per dimagrire o dopo una malattia.",
    quando: "Di solito ogni mattina, o quando te lo indica il medico: se ti ha dato regole precise, segui le sue.",
    tono: "al",
    icona: "bilancia",
    passi: [
      {
        art: "w-mattino",
        titolo: "Al mattino, dopo il bagno",
        testo: "Appena alzato, dopo essere andato in bagno e prima di colazione. Sempre alla stessa ora, così i numeri si possono confrontare.",
      },
      {
        art: "w-vestiti",
        titolo: "Senza scarpe, con poco addosso",
        testo: "Sempre gli stessi vestiti leggeri, o niente. Un maglione e le pantofole possono valere quasi un chilo.",
      },
      {
        art: "w-bilancia",
        titolo: "La stessa bilancia, su un pavimento duro",
        testo: "Niente tappeti né moquette. Usa sempre la stessa bilancia: due bilance diverse danno numeri diversi.",
      },
      {
        art: "w-fermo",
        titolo: "Fermo, piedi al centro",
        testo: "Aspetta che il numero si fermi. Se la bilancia mostra i decimali, scrivili: per alcune cure contano anche poche centinaia di grammi.",
      },
      {
        art: "w-scrivi",
        titolo: "Scrivi subito, anche i giorni uguali",
        testo: "Il medico guarda come cambia il peso giorno dopo giorno. Il sito mette in fila i numeri e calcola le differenze, senza giudicarle.",
      },
    ],
    colonne: ["Giorno", "Ora", "Peso in kg", "Note: gonfiore, fiato corto, cambi nella cura"],
    calcoli: [
      "Il primo e l'ultimo peso del periodo, e la differenza tra i due.",
      "Il peso medio del periodo e quanti giorni hai segnato.",
      "La differenza rispetto alla misura di tre giorni prima.",
    ],
    faq: [
      {
        d: "Il peso cambia da un giorno all'altro: perché?",
        r: "Il peso oscilla anche per l'acqua e i pasti. Il diario serve proprio a far vedere al medico l'andamento: è lui a dirti che cosa guardare.",
      },
      {
        d: "Il medico mi ha detto di chiamarlo se il peso sale in fretta: il sito mi avvisa?",
        r: "No: il sito non conosce le tue indicazioni e non dà allarmi. Mostra le differenze tra i giorni, così le vedi subito; le regole restano quelle del tuo medico.",
      },
    ],
    fonti: [
      {
        ente: "European Society of Cardiology (ESC)",
        titolo: "2021 ESC Guidelines for the diagnosis and treatment of acute and chronic heart failure, Eur Heart J 2021 (autocura e peso quotidiano)",
        url: "https://academic.oup.com/eurheartj/article/42/36/3599/6358045",
      },
      {
        ente: "Heart Failure Association dell'ESC",
        titolo: "heartfailurematters.org: materiali per i pazienti sul controllo del peso",
        url: "https://www.heartfailurematters.org",
      },
      {
        ente: "Società Italiana dell'Obesità (SIO)",
        titolo: "Materiali per i pazienti sul controllo del peso",
        url: "https://www.sio-obesita.org",
      },
    ],
    promemoria: { orari: ["07:30"], giorni: 30, testo: "Peso: dopo il bagno, prima di colazione." },
  },
  {
    slug: "respiro",
    nome: "Respiro",
    titolo: "Il diario del",
    em: "respiro.",
    lead: "Per chi ha l'asma e usa il misuratore di picco di flusso. Tre soffi, scrivi il migliore, mattina e sera: in pochi giorni il medico vede come cambia il tuo respiro, anche quando stai bene.",
    perChi: "Per chi ha l'asma e ha ricevuto dal medico un misuratore di picco di flusso (il tubo in cui si soffia).",
    quando: "Di solito mattina e sera, per 2 settimane o nei periodi che indica il medico. Se hai un piano d'azione scritto, segui quello.",
    tono: "es",
    icona: "respiro",
    passi: [
      {
        art: "r-piedi",
        titolo: "In piedi, indicatore a zero",
        testo: "Porta l'indicatore del misuratore a zero e tienilo in modo da non bloccarlo con le dita. Stai in piedi, o seduto ben dritto.",
      },
      {
        art: "r-inspira",
        titolo: "Un respiro profondo",
        testo: "Riempi i polmoni il più possibile, poi chiudi bene le labbra intorno al boccaglio, senza mettere la lingua davanti.",
      },
      {
        art: "r-soffia",
        titolo: "Soffia forte e veloce",
        testo: "Un colpo secco, il più forte e veloce che puoi, come per spegnere le candeline. Non serve soffiare a lungo.",
      },
      {
        art: "r-tre",
        titolo: "Tre volte, scrivi il migliore",
        testo: "Rimetti l'indicatore a zero tra un soffio e l'altro. Scrivi solo il valore più alto dei tre, in litri al minuto.",
      },
      {
        art: "r-momento",
        titolo: "Mattina e sera, prima dei farmaci",
        testo: "Di solito prima dei farmaci, se il medico non ti ha indicato altro. Se usi lo spray al bisogno, scrivi quante volte: al medico serve quanto il soffio.",
      },
    ],
    colonne: ["Giorno", "Mattina: migliore dei 3 soffi (L/min)", "Sera: migliore dei 3 soffi (L/min)", "Spray al bisogno: quante volte", "Note: tosse, notte disturbata, raffreddore"],
    calcoli: [
      "La media del mattino e quella della sera.",
      "Il valore più alto e il più basso del periodo.",
      "In quanti giorni hai usato lo spray al bisogno, e quante volte in tutto.",
    ],
    faq: [
      {
        d: "Quale valore è giusto per me?",
        r: "Dipende da te: età, altezza, il tuo miglior valore personale. Te lo dice il medico; il diario serve a fargli vedere i tuoi numeri.",
      },
      {
        d: "Ho fiato corto e il valore è basso: che cosa faccio?",
        r: "Segui il piano d'azione che ti ha dato il medico. Se fai fatica a respirare o a parlare, chiama subito il 112.",
      },
      {
        d: "Il mio misuratore usa un'altra scala: va bene?",
        r: "Usa sempre lo stesso misuratore e scrivi il numero come lo leggi. Se cambi apparecchio, scrivilo nella nota.",
      },
    ],
    fonti: [
      {
        ente: "Global Initiative for Asthma (GINA)",
        titolo: "Global Strategy for Asthma Management and Prevention, aggiornamento 2024",
        url: "https://ginasthma.org",
      },
      {
        ente: "Società Italiana di Pneumologia (SIP/IRS)",
        titolo: "Materiali per i pazienti sull'asma e sul controllo a casa",
        url: "https://www.sipirs.it",
      },
      {
        ente: "NHS (Servizio sanitario inglese)",
        titolo: "Peak flow test: come si fa la misura del picco di flusso",
        url: "https://www.nhs.uk/conditions/peak-flow-test/",
      },
    ],
    promemoria: { orari: ["07:30", "20:30"], giorni: 14, testo: "Picco di flusso: tre soffi, scrivi il migliore." },
  },
];

export function getDiario(slug: string): Diario | null {
  return DIARI.find((d) => d.slug === slug) ?? null;
}

export const DIARIO_SLUGS = DIARI.map((d) => d.slug);

/** Nota sempre presente: il diario registra, non valuta. */
export const DIARI_LIMITI = [
  "Il diario registra i numeri che scrivi e ne calcola le medie: non li giudica e non dice se sono da cambiare.",
  "Le decisioni sulla cura le prendi con il tuo medico. Portagli il foglio: è fatto per lui.",
  "Se stai male, non aspettare il diario: chiama il tuo medico o, in emergenza, il 112.",
];

export const DIARI_BOZZA =
  "Bozza: le guide le rivede un medico prima della pubblicazione. Il diario è nostro e segue le indicazioni delle società scientifiche citate in fondo alla pagina.";

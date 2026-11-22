import type { Malattia } from "../schema";

export const FEGATO_GRASSO: Malattia = {
  slug: "fegato-grasso",
  area: "Fegato",
  nome: "Fegato grasso",
  nomeMedico: "Steatosi epatica (MASLD)",
  altriNomi: ["steatosi epatica", "MASLD", "NAFLD", "fegato grasso non alcolico", "steatosi"],
  tono: "al",
  icona: "fegato",
  riga: "Molto comune e quasi sempre silenzioso. Che cosa vuol dire, le transaminasi e il controllo che conta davvero.",
  seoTitle: "Fegato grasso (steatosi): cause, esami, cosa fare",
  metaDescription: "Fegato grasso (steatosi epatica, MASLD): perché è così comune, che cosa dicono transaminasi ed ecografia, la fibrosi e le abitudini che aiutano.",
  titolo: "Fegato grasso:",
  em: "comune, silenzioso, da non ignorare.",
  inBreve: [
    "La steatosi epatica, il «fegato grasso», è un accumulo di grasso nelle cellule del fegato. Riguarda circa un adulto su quattro.",
    "Quasi sempre non dà disturbi: si scopre con un'ecografia o con le transaminasi un po' alte agli esami del sangue.",
    "Nella maggior parte delle persone resta stabile. Il controllo che conta è la fibrosi, cioè se il fegato sta diventando più rigido: il medico la stima con esami semplici.",
  ],
  cheCose: [
    "Il fegato immagazzina un po' di grasso, ma quando l'accumulo supera una certa quota si parla di steatosi. Dal 2023 le società internazionali la chiamano MASLD, malattia del fegato steatosico associata a disfunzione metabolica, al posto del vecchio NAFLD: il nuovo nome dice da dove nasce, cioè sovrappeso, grasso sulla pancia, glicemia alta, pressione alta, trigliceridi.",
    "L'alcol è l'altra grande causa di fegato grasso, e spesso le due si sommano. Anche alcuni farmaci e malattie rare possono dare steatosi: il medico ne tiene conto prima di parlare di MASLD.",
    "In una parte delle persone il grasso infiamma il fegato (si parla di MASH) e, nel corso degli anni, può formarsi tessuto cicatriziale, la fibrosi. Solo una minoranza arriva alla cirrosi. Per stimare la fibrosi il medico usa calcoli fatti con esami del sangue già comuni (come il punteggio FIB-4) e, se serve, l'elastografia, un esame simile all'ecografia che misura la rigidità del fegato.",
  ],
  comeSiManifesta: {
    testo: [
      "Il fegato grasso di solito non fa male e non si sente. I segnali arrivano dagli esami o, molto più tardi e in poche persone, da un fegato che lavora meno.",
    ],
    segni: [
      "Nessun disturbo: è la situazione più comune.",
      "Ecografia dell'addome che descrive un fegato «brillante» o steatosico.",
      "Transaminasi (soprattutto ALT) o gamma GT un po' più alte dell'intervallo.",
      "Stanchezza o un senso di peso sotto le costole a destra, non specifici.",
      "Spesso insieme a pancia prominente, glicemia, pressione o trigliceridi alti.",
    ],
  },
  quandoChiamare: {
    subito: [
      "Vomito con sangue o materiale scuro come fondi di caffè, feci nere come catrame.",
      "Confusione, sonnolenza insolita o comportamento strano in chi ha una malattia del fegato nota.",
    ],
    presto: [
      "Pelle o bianco degli occhi giallastri, urine scure come il marsala, feci chiare.",
      "Pancia che si gonfia in fretta, gonfiore alle gambe.",
      "Prurito diffuso che non passa, lividi che compaiono facilmente.",
    ],
  },
  esami: [
    { guida: "transaminasi-alt-ast", perche: "Gli enzimi che salgono quando le cellule del fegato soffrono; entrano anche nel calcolo della fibrosi." },
    { guida: "gamma-gt", perche: "Un altro enzima del fegato, sensibile anche all'alcol e ad alcuni farmaci." },
    { guida: "ecografia-addominale", perche: "L'esame che di solito scopre la steatosi, senza radiazioni." },
    { guida: "emocromo", perche: "Le piastrine dell'emocromo entrano nel calcolo FIB-4 della fibrosi." },
    { guida: "bilirubina", perche: "Dice come il fegato elimina i pigmenti del sangue; sale con l'ittero." },
    { guida: "albumina", perche: "Una proteina prodotta dal fegato: racconta come lavora nel tempo." },
  ],
  esamiNota: "Per stimare la fibrosi il medico può calcolare il punteggio FIB-4 (da età, transaminasi e piastrine) e proporre un'elastografia. Per escludere altre cause può chiedere gli esami per le epatiti B e C.",
  ogniGiorno: [
    "Gli studi mostrano che perdere il 7–10% del peso, mantenendolo, riduce il grasso nel fegato e può far regredire l'infiammazione e in parte la fibrosi. Contano anche movimento regolare, meno zuccheri semplici e bevande zuccherate, un'alimentazione di tipo mediterraneo.",
    "L'alcol si somma al danno del grasso: con la steatosi, la quantità sicura di alcol non è nota, e molte società scientifiche indicano di ridurlo al minimo. Se ne parla con il medico.",
    "Prendersi cura del fegato grasso significa anche curare pressione, glicemia e colesterolo, perché nelle persone con steatosi il cuore è l'organo che corre più rischi.",
  ],
  domande: [
    "Il mio fegato grasso è legato al peso, all'alcol o a entrambi?",
    "Qual è il mio punteggio FIB-4? Serve un'elastografia?",
    "Servono gli esami per le epatiti B e C?",
    "Ogni quanto ripetere transaminasi ed ecografia?",
    "Quanto peso sarebbe utile perdere, nel mio caso?",
  ],
  faq: [
    {
      d: "Transaminasi alte e fegato grasso: è grave?",
      r: "Transaminasi un po' alte sono frequenti con il fegato grasso e da sole non dicono quanto è avanzato. Il medico le guarda insieme agli altri esami e alla stima della fibrosi. La guida alle transaminasi spiega come si leggono nel referto.",
    },
    {
      d: "Il fegato grasso può tornare come prima?",
      r: "Sì, in molte persone il grasso nel fegato si riduce quando si perde peso e si cambiano alcune abitudini, e anche l'infiammazione può regredire. Per questo conviene accorgersene presto.",
    },
    {
      d: "Esiste uno screening per l'epatite C?",
      r: "In Italia è stato avviato uno screening gratuito per l'epatite C dedicato alle persone nate tra il 1969 e il 1989 e ad alcuni gruppi a rischio. Le modalità cambiano da regione a regione: chiedi al medico o alla tua ASL se è attivo dove vivi.",
    },
  ],
  glossario: ["transaminasi", "alt", "ast", "gamma-gt", "bilirubina", "albumina", "fosfatasi-alcalina", "trigliceridi", "piastrine", "enzima"],
  correlate: ["peso", "diabete", "colesterolo-alto"],
  ricerche: [
    "fegato grasso",
    "steatosi epatica",
    "steatosi",
    "masld",
    "nafld",
    "fegato ingrossato",
    "fegato steatosico",
    "fibrosi epatica",
    "epatite c screening",
    "fegato",
  ],
  fonti: [
    { ente: "NHS", titolo: "Non-alcoholic fatty liver disease (NAFLD)", url: "https://www.nhs.uk/conditions/non-alcoholic-fatty-liver-disease/" },
    { ente: "ISSalute (Istituto superiore di sanità)", titolo: "Sindrome metabolica", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/s/sindrome-metabolica" },
    { ente: "ISSalute", titolo: "Cirrosi epatica", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/c/cirrosi-epatica" },
    { ente: "ISSalute", titolo: "Test gamma GT", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/t/test-gamma-gt-analisi-cliniche" },
  ],
  aggiornato: "2026-11-22",
  revisione: { stato: "bozza" },
};

import type { GlossaryEntry } from "./schema";

/** Voci del glossario, lettere s-z. Bozze da revisione medica. */
export const GLOSSARIO_S_Z: GlossaryEntry[] = [
  {
    "slug": "saturazione-della-transferrina",
    "term": "Saturazione della transferrina",
    "aliases": [
      "TSAT",
      "indice di saturazione"
    ],
    "definition": "È la percentuale dei siti della transferrina, la proteina che trasporta il ferro, occupati da ferro. Si calcola da sideremia e transferrina.",
    "inDetail": [
      "Si esprime in percentuale. Variando la sideremia nella giornata, cambia anche la saturazione.",
      "Si legge insieme a ferritina e sideremia, non da sola."
    ],
    "relatedGuides": [
      "transferrina-e-saturazione",
      "sideremia",
      "ferritina"
    ],
    "relatedTerms": [
      "transferrina",
      "sideremia",
      "ferritina"
    ]
  },
  {
    "slug": "sedimento-urinario",
    "term": "Sedimento urinario",
    "aliases": [
      "sedimento"
    ],
    "definition": "Il sedimento urinario è ciò che si deposita dopo la centrifugazione delle urine e viene osservato al microscopio: cellule, cristalli, cilindri e batteri.",
    "inDetail": [
      "Nel referto elementi come globuli rossi e bianchi sono indicati per campo microscopico.",
      "Un campione contaminato, per esempio per raccolta non accurata, può falsare il risultato."
    ],
    "relatedGuides": [
      "esame-delle-urine"
    ],
    "relatedTerms": [
      "esame-delle-urine",
      "leucociti",
      "eritrociti",
      "nitriti-urinari"
    ]
  },
  {
    "slug": "sideremia",
    "term": "Sideremia",
    "aliases": [
      "ferro sierico",
      "ferro nel sangue"
    ],
    "definition": "La sideremia è la quantità di ferro che circola nel sangue legato alla transferrina. Fa parte degli esami che descrivono il ferro nell'organismo.",
    "inDetail": [
      "L'unità è µg/dL o µmol/L. Varia molto nella giornata e con i pasti, quindi il prelievo è di solito al mattino a digiuno.",
      "Da sola dice poco sulle riserve: per quelle si usa la ferritina."
    ],
    "relatedGuides": [
      "sideremia",
      "ferritina",
      "transferrina-e-saturazione"
    ],
    "relatedTerms": [
      "ferritina",
      "transferrina",
      "saturazione-della-transferrina",
      "digiuno",
      "ritmo-circadiano"
    ]
  },
  {
    "slug": "siero",
    "term": "Siero",
    "aliases": [
      "siero sanguigno"
    ],
    "definition": "Il siero è la parte liquida del sangue che resta dopo che il sangue si è coagulato e le cellule sono state separate. Molti esami di chimica clinica si eseguono sul siero.",
    "inDetail": [
      "A differenza del plasma, non contiene fibrinogeno e altri fattori consumati dalla coagulazione.",
      "Un siero rosato indica rottura dei globuli rossi nel campione."
    ],
    "relatedGuides": [
      "prima-del-prelievo"
    ],
    "relatedTerms": [
      "plasma",
      "campione",
      "emolisi",
      "prelievo"
    ]
  },
  {
    "slug": "sodio",
    "term": "Sodio",
    "aliases": [
      "natriemia",
      "Na"
    ],
    "definition": "Il sodio è un elettrolita che regola la distribuzione dell'acqua nel corpo. Nel sangue si misura come natriemia.",
    "inDetail": [
      "L'unità è mmol/L (o mEq/L). Riflette soprattutto l'equilibrio dei liquidi nel corpo più che la quantità di sale mangiata.",
      "Si legge insieme a potassio e cloro, nello stesso pannello."
    ],
    "relatedGuides": [
      "sodio",
      "potassio"
    ],
    "relatedTerms": [
      "elettroliti",
      "potassio",
      "cloro",
      "bicarbonato"
    ]
  },
  {
    "slug": "testosterone",
    "term": "Testosterone",
    "aliases": [
      "testosterone totale",
      "testosterone libero"
    ],
    "definition": "Il testosterone è un ormone sessuale prodotto soprattutto dai testicoli negli uomini, in quantità minori da ovaie e surrenali nelle donne.",
    "inDetail": [
      "L'unità è ng/dL, nmol/L o ng/mL. Si dosa di solito al mattino, perché ha un andamento giornaliero.",
      "Può essere dosata la quota totale o quella libera, con metodi e intervalli differenti."
    ],
    "relatedGuides": [
      "testosterone",
      "fsh-e-lh"
    ],
    "relatedTerms": [
      "ormone",
      "lh",
      "fsh",
      "ritmo-circadiano",
      "estradiolo"
    ]
  },
  {
    "slug": "tireoglobulina",
    "term": "Tireoglobulina",
    "aliases": [
      "Tg",
      "TG"
    ],
    "definition": "La tireoglobulina è una proteina prodotta dalla tiroide che serve a costruire gli ormoni tiroidei. Una piccola quantità passa nel sangue.",
    "inDetail": [
      "L'unità è ng/mL o µg/L. La presenza di anticorpi anti-tireoglobulina può interferire con la misura.",
      "Si richiede in situazioni selezionate, in genere con gli anticorpi."
    ],
    "relatedGuides": [
      "anticorpi-anti-tireoglobulina",
      "tsh"
    ],
    "relatedTerms": [
      "anticorpi-anti-tireoglobulina",
      "autoanticorpi",
      "tsh",
      "marcatore"
    ]
  },
  {
    "slug": "transaminasi",
    "term": "Transaminasi",
    "aliases": [
      "ALT e AST",
      "aminotransferasi"
    ],
    "definition": "Le transaminasi sono due enzimi, ALT (GPT) e AST (GOT), presenti soprattutto nelle cellule del fegato. Se ne misura l'attività nel sangue.",
    "inDetail": [
      "L'unità è U/L. ALT è più specifica del fegato, AST è presente anche in muscoli e cuore.",
      "Si leggono insieme a gamma GT e fosfatasi alcalina."
    ],
    "relatedGuides": [
      "transaminasi-alt-ast",
      "gamma-gt"
    ],
    "relatedTerms": [
      "alt",
      "ast",
      "enzima",
      "gamma-gt",
      "unita-internazionali"
    ]
  },
  {
    "slug": "transferrina",
    "term": "Transferrina",
    "aliases": [
      "siderofilina"
    ],
    "definition": "La transferrina è la proteina che trasporta il ferro nel sangue, dai punti di assorbimento a quelli di utilizzo e deposito. Viene prodotta dal fegato.",
    "inDetail": [
      "L'unità è mg/dL o g/L. A volte si dosa la capacità di legare il ferro (TIBC), che esprime la stessa informazione.",
      "Con la sideremia permette di calcolare la saturazione."
    ],
    "relatedGuides": [
      "transferrina-e-saturazione",
      "sideremia"
    ],
    "relatedTerms": [
      "saturazione-della-transferrina",
      "sideremia",
      "ferritina",
      "albumina"
    ]
  },
  {
    "slug": "trigliceridi",
    "term": "Trigliceridi",
    "aliases": [
      "TG",
      "trigliceridemia"
    ],
    "definition": "I trigliceridi sono i grassi più abbondanti nell'alimentazione e nell'organismo. Il corpo li usa come riserva di energia e li trasporta nel sangue nelle lipoproteine.",
    "inDetail": [
      "L'unità è mg/dL o mmol/L. Dopo un pasto aumentano per alcune ore, per questo si richiede il digiuno.",
      "Entrano nel calcolo del colesterolo LDL con la formula."
    ],
    "relatedGuides": [
      "trigliceridi",
      "colesterolo-totale"
    ],
    "relatedTerms": [
      "colesterolo",
      "lipoproteine",
      "vldl",
      "digiuno",
      "lipidi",
      "ldl"
    ]
  },
  {
    "slug": "troponina",
    "term": "Troponina",
    "aliases": [
      "troponina cardiaca",
      "cTn"
    ],
    "definition": "La troponina è una proteina presente nelle cellule del muscolo cardiaco. Si misura nel sangue come indicatore di sofferenza di queste cellule.",
    "inDetail": [
      "Si usano test ad alta sensibilità, con unità ng/L e soglie specifiche del metodo. Spesso si ripete in ore successive.",
      "È un esame di ambito urgente: l'interpretazione spetta al medico."
    ],
    "relatedGuides": [
      "cosa-chiedere-al-medico"
    ],
    "relatedTerms": [
      "marcatore",
      "creatinchinasi-ck",
      "ldh",
      "valore-critico"
    ]
  },
  {
    "slug": "tsh",
    "term": "TSH (ormone tireostimolante)",
    "aliases": [
      "TSH",
      "tireotropina"
    ],
    "definition": "Il TSH è un ormone prodotto dall'ipofisi che regola l'attività della tiroide. Il suo livello nel sangue è usato come primo esame per valutare la funzione tiroidea.",
    "inDetail": [
      "L'unità è mUI/L (o µUI/mL). Segue un ritmo giornaliero e può variare con l'orario.",
      "Si legge insieme a FT4 ed eventualmente FT3, che completano il quadro."
    ],
    "relatedGuides": [
      "tsh",
      "ft4-tiroxina-libera",
      "ft3-triiodotironina-libera"
    ],
    "relatedTerms": [
      "ft4",
      "ft3",
      "ormone",
      "ritmo-circadiano",
      "anticorpi-anti-tpo"
    ]
  },
  {
    "slug": "unita-di-misura",
    "term": "Unità di misura",
    "aliases": [
      "unità",
      "UM"
    ],
    "definition": "L'unità di misura indica in che scala è espresso un risultato, per esempio mg/dL, mmol/L, U/L o 10^9/L. Senza unità un numero non si può interpretare.",
    "inDetail": [
      "Lo stesso esame può essere riportato in unità diverse da laboratori diversi. Il confronto è valido solo con la stessa unità o dopo la conversione.",
      "Intervallo di riferimento e risultato devono avere la stessa unità."
    ],
    "relatedGuides": [
      "unita-di-misura-nei-referti"
    ],
    "relatedTerms": [
      "milligrammi-per-decilitro",
      "millimoli-per-litro",
      "unita-internazionali",
      "cellule-per-microlitro"
    ]
  },
  {
    "slug": "unita-internazionali",
    "term": "Unità internazionali (UI)",
    "aliases": [
      "UI",
      "U/L",
      "IU"
    ],
    "definition": "L'unità internazionale (UI) è una misura convenzionale dell'attività di enzimi, ormoni e vitamine. L'espressione U/L indica l'attività per litro di sangue.",
    "inDetail": [
      "Gli enzimi come ALT, AST e gamma GT sono espressi in U/L; alcuni ormoni in mUI/L.",
      "Il valore in UI dipende dalle condizioni di misura; confronta solo risultati ottenuti con lo stesso metodo."
    ],
    "relatedGuides": [
      "unita-di-misura-nei-referti"
    ],
    "relatedTerms": [
      "unita-di-misura",
      "enzima",
      "alt",
      "tsh"
    ]
  },
  {
    "slug": "urea",
    "term": "Urea",
    "aliases": [
      "urea ematica"
    ],
    "definition": "L'urea è il principale prodotto di scarto del metabolismo delle proteine. Viene prodotta dal fegato ed eliminata dai reni.",
    "inDetail": [
      "L'unità è mg/dL o mmol/L; il BUN, l'azoto ureico, ha numeri diversi per la stessa quantità.",
      "Dipende anche da proteine assunte e idratazione."
    ],
    "relatedGuides": [
      "azotemia-urea",
      "creatinina"
    ],
    "relatedTerms": [
      "azotemia",
      "creatinina",
      "egfr",
      "acido-urico"
    ]
  },
  {
    "slug": "urobilinogeno",
    "term": "Urobilinogeno",
    "aliases": [
      "urobilinogeno urinario"
    ],
    "definition": "L'urobilinogeno è una sostanza che si forma nell'intestino dalla bilirubina; in piccola parte passa nel sangue e viene eliminata con le urine.",
    "inDetail": [
      "Nell'esame delle urine compare come voce della striscia reattiva, spesso in mg/dL o con scala a croci.",
      "Il campione va analizzato in fretta, perché la sostanza si degrada con luce e tempo."
    ],
    "relatedGuides": [
      "esame-delle-urine",
      "bilirubina"
    ],
    "relatedTerms": [
      "bilirubina",
      "esame-delle-urine",
      "bilirubina-diretta",
      "sedimento-urinario"
    ]
  },
  {
    "slug": "valore-critico",
    "term": "Valore critico",
    "aliases": [
      "valore di allarme",
      "valore panico"
    ],
    "definition": "Un valore critico è un risultato così lontano dagli intervalli attesi da richiedere che il laboratorio avvisi subito il medico richiedente. Le soglie sono stabilite dal laboratorio.",
    "inDetail": [
      "Il referto può riportare una nota che indica che il risultato è stato comunicato.",
      "La comunicazione è un'urgenza di processo, non un giudizio su che cosa sia accaduto."
    ],
    "relatedGuides": [
      "come-leggere-un-referto-di-laboratorio",
      "cosa-chiedere-al-medico"
    ],
    "relatedTerms": [
      "intervallo-di-riferimento",
      "referto",
      "potassio",
      "troponina"
    ]
  },
  {
    "slug": "variabilita-biologica",
    "term": "Variabilità biologica",
    "aliases": [
      "variazione fisiologica",
      "variabilità intraindividuale"
    ],
    "definition": "La variabilità biologica è la naturale oscillazione dei valori di una persona nel tempo, per orario, alimentazione, sonno, attività e stagione, anche senza alcuna malattia.",
    "inDetail": [
      "Per questo due prelievi a distanza possono dare numeri diversi per la stessa persona, entro una certa ampiezza che dipende dall'esame.",
      "A questa si aggiunge la variabilità del metodo del laboratorio."
    ],
    "relatedGuides": [
      "perche-i-valori-cambiano",
      "intervalli-di-riferimento"
    ],
    "relatedTerms": [
      "metodo-analitico",
      "intervallo-di-riferimento",
      "ritmo-circadiano",
      "digiuno"
    ]
  },
  {
    "slug": "ves",
    "term": "VES (velocità di eritrosedimentazione)",
    "aliases": [
      "VES",
      "eritrosedimentazione",
      "velocità di sedimentazione"
    ],
    "definition": "La VES misura quanto velocemente i globuli rossi si depositano sul fondo di una provetta in un'ora. Dipende da proteine come il fibrinogeno.",
    "inDetail": [
      "L'unità è mm/h. Cambia con età, sesso e anemia.",
      "Si legge con PCR; risponde più lentamente di questa ai cambiamenti."
    ],
    "relatedGuides": [
      "ves",
      "pcr-proteina-c-reattiva"
    ],
    "relatedTerms": [
      "proteina-c-reattiva",
      "fibrinogeno",
      "globuli-rossi"
    ]
  },
  {
    "slug": "vitamina-b12",
    "term": "Vitamina B12",
    "aliases": [
      "cobalamina"
    ],
    "definition": "La vitamina B12 è una vitamina presente nei cibi di origine animale, necessaria alla formazione dei globuli rossi e al sistema nervoso. Si misura nel sangue.",
    "inDetail": [
      "L'unità è pg/mL o pmol/L. I metodi variano, quindi conta l'intervallo stampato.",
      "Si legge insieme a folati e omocisteina, che dipendono dagli stessi processi."
    ],
    "relatedGuides": [
      "vitamina-b12",
      "folati",
      "omocisteina"
    ],
    "relatedTerms": [
      "folati",
      "acido-folico",
      "omocisteina",
      "mcv"
    ]
  },
  {
    "slug": "vitamina-d",
    "term": "Vitamina D",
    "aliases": [
      "25-OH vitamina D",
      "calcifediolo",
      "25(OH)D"
    ],
    "definition": "La vitamina D è una vitamina che il corpo produce con l'esposizione al sole e assume in piccola parte con il cibo. Aiuta l'assorbimento del calcio. Si misura la forma 25-OH.",
    "inDetail": [
      "L'unità è ng/mL o nmol/L. Varia con la stagione.",
      "Si legge insieme a calcio e fosforo, con cui lavora nel metabolismo delle ossa."
    ],
    "relatedGuides": [
      "vitamina-d",
      "calcio"
    ],
    "relatedTerms": [
      "calcio",
      "fosforo",
      "ormone"
    ]
  },
  {
    "slug": "vldl",
    "term": "VLDL (lipoproteine a bassissima densità)",
    "aliases": [
      "VLDL"
    ],
    "definition": "Le VLDL sono lipoproteine prodotte dal fegato che trasportano soprattutto trigliceridi. Man mano che li cedono ai tessuti, diventano LDL.",
    "inDetail": [
      "Di solito non sono misurate direttamente: il colesterolo VLDL è stimato come una frazione dei trigliceridi.",
      "Il colesterolo contenuto nelle VLDL rientra nel colesterolo non-HDL."
    ],
    "relatedGuides": [
      "trigliceridi",
      "colesterolo-non-hdl"
    ],
    "relatedTerms": [
      "ldl",
      "hdl",
      "lipoproteine",
      "trigliceridi"
    ]
  },
];

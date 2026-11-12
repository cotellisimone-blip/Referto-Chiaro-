import type { GlossaryEntry } from "./schema";

/** Voci del glossario, lettere h-m. Bozze da revisione medica. */
export const GLOSSARIO_H_M: GlossaryEntry[] = [
  {
    "slug": "hdl",
    "term": "HDL (lipoproteine ad alta densità)",
    "aliases": [
      "HDL",
      "colesterolo HDL"
    ],
    "definition": "Le HDL sono lipoproteine ad alta densità: particelle che trasportano il colesterolo dai tessuti al fegato. Nel referto si misura il colesterolo che contengono.",
    "inDetail": [
      "È una delle voci del profilo lipidico, in mg/dL o mmol/L.",
      "Gli intervalli stampati possono differire fra uomini e donne."
    ],
    "relatedGuides": [
      "colesterolo-hdl"
    ],
    "relatedTerms": [
      "colesterolo-hdl",
      "ldl",
      "lipoproteine",
      "colesterolo"
    ]
  },
  {
    "slug": "immunoglobuline",
    "term": "Immunoglobuline",
    "aliases": [
      "Ig",
      "IgG",
      "IgA",
      "IgM",
      "IgE"
    ],
    "definition": "Le immunoglobuline sono le proteine che costituiscono gli anticorpi. Si distinguono in classi (IgG, IgA, IgM, IgE, IgD) con funzioni diverse.",
    "inDetail": [
      "Si possono dosare le quantità totali di ogni classe, di solito in g/L o mg/dL, oppure anticorpi specifici di una classe contro un antigene.",
      "Il nome della classe nel referto è importante: ogni classe ha intervalli e significato propri."
    ],
    "relatedGuides": [
      "proteine-totali-ed-elettroforesi"
    ],
    "relatedTerms": [
      "anticorpi",
      "gamma-globuline",
      "elettroforesi",
      "globuline"
    ]
  },
  {
    "slug": "inr",
    "term": "INR (International Normalized Ratio)",
    "aliases": [
      "INR",
      "rapporto internazionale normalizzato"
    ],
    "definition": "L'INR è un modo standardizzato di esprimere il tempo di protrombina, in modo che i risultati di laboratori diversi siano confrontabili. È un numero senza unità.",
    "inDetail": [
      "È calcolato dal PT con un fattore legato al reagente usato (ISI). Compare accanto al PT nel referto.",
      "Lo si controlla in modo regolare in chi segue terapie che agiscono sulla coagulazione: il medico indica il proprio obiettivo individuale."
    ],
    "relatedGuides": [
      "pt-inr",
      "aptt"
    ],
    "relatedTerms": [
      "pt-tempo-di-protrombina",
      "coagulazione",
      "aptt",
      "plasma"
    ]
  },
  {
    "slug": "insulina",
    "term": "Insulina",
    "aliases": [
      "insulinemia"
    ],
    "definition": "L'insulina è un ormone prodotto dal pancreas che permette al glucosio di entrare nelle cellule. La sua concentrazione nel sangue si misura come insulinemia.",
    "inDetail": [
      "L'unità è µU/mL o pmol/L. Il valore dipende molto dall'ultimo pasto, quindi il prelievo è di solito a digiuno.",
      "Si valuta insieme alla glicemia, perché i due valori sono collegati."
    ],
    "relatedGuides": [
      "insulinemia",
      "glicemia",
      "peptide-c"
    ],
    "relatedTerms": [
      "glicemia",
      "glucosio",
      "peptide-c",
      "ormone",
      "digiuno"
    ]
  },
  {
    "slug": "intervallo-di-riferimento",
    "term": "Intervallo di riferimento",
    "aliases": [
      "range",
      "valori di riferimento",
      "range di riferimento"
    ],
    "definition": "L'intervallo di riferimento è la fascia di risultati che il laboratorio ha osservato in un gruppo di persone sane, per quel metodo. Serve come punto di confronto, non come giudizio.",
    "inDetail": [
      "È stampato accanto al risultato e dipende dal metodo, dallo strumento e spesso da età e sesso. Per questo cambia da un laboratorio all'altro.",
      "Per definizione una piccola quota di persone sane cade fuori dall'intervallo. Il significato di un valore lo stabilisce il medico, nel contesto."
    ],
    "relatedGuides": [
      "intervalli-di-riferimento",
      "come-leggere-un-referto-di-laboratorio"
    ],
    "relatedTerms": [
      "metodo-analitico",
      "referto",
      "valore-critico",
      "variabilita-biologica"
    ]
  },
  {
    "slug": "lattato",
    "term": "Lattato",
    "aliases": [
      "acido lattico",
      "lattacidemia"
    ],
    "definition": "Il lattato è una sostanza prodotta dalle cellule quando ricavano energia anche senza molto ossigeno, per esempio durante uno sforzo intenso. Si misura nel sangue.",
    "inDetail": [
      "L'unità è mmol/L. Per un risultato attendibile il prelievo richiede modalità precise (pochi movimenti, provetta specifica, analisi rapida).",
      "È dosato in contesti specifici, in genere in ambito ospedaliero."
    ],
    "relatedGuides": [
      "ldh"
    ],
    "relatedTerms": [
      "ldh",
      "enzima",
      "campione",
      "millimoli-per-litro"
    ]
  },
  {
    "slug": "ldh",
    "term": "LDH (lattato deidrogenasi)",
    "aliases": [
      "lattico deidrogenasi",
      "LD"
    ],
    "definition": "L'LDH è un enzima presente in quasi tutte le cellule del corpo, in particolare fegato, muscoli, globuli rossi e cuore. Se ne misura l'attività nel sangue.",
    "inDetail": [
      "L'unità è U/L. Poiché è così diffuso, viene letto insieme ad altri esami.",
      "Un campione con globuli rossi rotti (emolisi) può alterare il risultato."
    ],
    "relatedGuides": [
      "ldh",
      "transaminasi-alt-ast"
    ],
    "relatedTerms": [
      "enzima",
      "emolisi",
      "ast",
      "creatinchinasi-ck",
      "lattato"
    ]
  },
  {
    "slug": "ldl",
    "term": "LDL (lipoproteine a bassa densità)",
    "aliases": [
      "LDL",
      "colesterolo LDL"
    ],
    "definition": "Le LDL sono lipoproteine a bassa densità: particelle che trasportano il colesterolo dal fegato ai tessuti. Nel referto si indica il colesterolo che contengono.",
    "inDetail": [
      "Il valore può essere calcolato o dosato direttamente; l'unità è mg/dL o mmol/L.",
      "Si legge con colesterolo totale, HDL e trigliceridi."
    ],
    "relatedGuides": [
      "colesterolo-ldl",
      "colesterolo-non-hdl"
    ],
    "relatedTerms": [
      "colesterolo-ldl",
      "hdl",
      "vldl",
      "lipoproteine",
      "apolipoproteina"
    ]
  },
  {
    "slug": "leucociti",
    "term": "Leucociti",
    "aliases": [
      "globuli bianchi",
      "WBC"
    ],
    "definition": "Leucociti è il nome scientifico dei globuli bianchi, le cellule del sangue che difendono l'organismo. Comprendono neutrofili, linfociti, monociti, eosinofili e basofili.",
    "inDetail": [
      "Il totale si esprime in 10^9/L o cellule per microlitro. La formula leucocitaria ne descrive la composizione.",
      "Nelle urine la presenza di leucociti si cerca con la striscia reattiva e il sedimento."
    ],
    "relatedGuides": [
      "globuli-bianchi-e-formula-leucocitaria"
    ],
    "relatedTerms": [
      "globuli-bianchi",
      "formula-leucocitaria",
      "neutrofili",
      "linfociti",
      "sedimento-urinario"
    ]
  },
  {
    "slug": "lh",
    "term": "LH (ormone luteinizzante)",
    "aliases": [
      "LH",
      "lutropina"
    ],
    "definition": "L'LH è un ormone prodotto dall'ipofisi. Nelle donne partecipa all'ovulazione, negli uomini stimola la produzione di testosterone.",
    "inDetail": [
      "L'unità è mUI/mL o UI/L. Nelle donne il valore cambia nel ciclo e il referto può dare intervalli per fase.",
      "Si dosa spesso insieme all'FSH, perché i due ormoni agiscono in coppia sugli stessi organi."
    ],
    "relatedGuides": [
      "fsh-e-lh"
    ],
    "relatedTerms": [
      "fsh",
      "testosterone",
      "estradiolo",
      "progesterone",
      "ormone"
    ]
  },
  {
    "slug": "linfociti",
    "term": "Linfociti",
    "aliases": [
      "linfociti T",
      "linfociti B"
    ],
    "definition": "I linfociti sono globuli bianchi fondamentali per la memoria e la specificità della risposta immunitaria. Comprendono vari sottotipi, fra cui linfociti T, B e NK.",
    "inDetail": [
      "Nella formula leucocitaria sono in percentuale e come numero assoluto. Nei bambini i valori di riferimento sono diversi da quelli degli adulti.",
      "Lo studio dei singoli sottotipi (T, B, NK) è un esame a parte, richiesto in situazioni specifiche."
    ],
    "relatedGuides": [
      "globuli-bianchi-e-formula-leucocitaria"
    ],
    "relatedTerms": [
      "globuli-bianchi",
      "formula-leucocitaria",
      "neutrofili",
      "monociti",
      "anticorpi"
    ]
  },
  {
    "slug": "lipasi",
    "term": "Lipasi",
    "aliases": [
      "lipasi pancreatica"
    ],
    "definition": "La lipasi è un enzima prodotto soprattutto dal pancreas che aiuta a digerire i grassi. Se ne misura l'attività nel sangue.",
    "inDetail": [
      "L'unità è U/L. Il metodo del laboratorio determina l'intervallo.",
      "Viene spesso richiesta insieme all'amilasi, e il medico legge le due voci nello stesso quadro."
    ],
    "relatedGuides": [
      "amilasi-e-lipasi"
    ],
    "relatedTerms": [
      "amilasi",
      "enzima",
      "unita-internazionali"
    ]
  },
  {
    "slug": "lipidi",
    "term": "Lipidi",
    "aliases": [
      "grassi del sangue",
      "profilo lipidico"
    ],
    "definition": "I lipidi sono i grassi presenti nel sangue, principalmente colesterolo e trigliceridi. Viaggiano dentro particelle dette lipoproteine.",
    "inDetail": [
      "Il «profilo lipidico» comprende di solito colesterolo totale, HDL, LDL e trigliceridi, in mg/dL o mmol/L.",
      "Il digiuno richiesto dal laboratorio ha rilievo soprattutto per i trigliceridi."
    ],
    "relatedGuides": [
      "colesterolo-totale",
      "trigliceridi"
    ],
    "relatedTerms": [
      "colesterolo",
      "trigliceridi",
      "lipoproteine",
      "hdl",
      "ldl"
    ]
  },
  {
    "slug": "lipoproteina-a",
    "term": "Lipoproteina(a)",
    "aliases": [
      "Lp(a)",
      "lipoproteina a"
    ],
    "definition": "La lipoproteina(a) è una particella simile alle LDL con una proteina in più. La sua quantità nel sangue è in larga parte determinata dalla genetica.",
    "inDetail": [
      "Si misura in mg/dL o nmol/L; le due unità non si convertono in modo semplice e dipendono dal metodo.",
      "Di solito si misura una volta sola, perché cambia poco nel tempo."
    ],
    "relatedGuides": [
      "lipoproteina-a",
      "colesterolo-ldl"
    ],
    "relatedTerms": [
      "lipoproteine",
      "ldl",
      "apolipoproteina",
      "colesterolo"
    ]
  },
  {
    "slug": "lipoproteine",
    "term": "Lipoproteine",
    "aliases": [
      "particelle lipoproteiche"
    ],
    "definition": "Le lipoproteine sono particelle che trasportano nel sangue grassi come colesterolo e trigliceridi, perché da soli non si sciolgono nel plasma. Sono formate da lipidi e proteine.",
    "inDetail": [
      "Le principali sono chilomicroni, VLDL, LDL e HDL, che si distinguono per densità e funzione.",
      "Nei referti si trovano di solito sotto forma del colesterolo che contengono (LDL, HDL) o dei trigliceridi."
    ],
    "relatedGuides": [
      "colesterolo-totale",
      "colesterolo-hdl",
      "colesterolo-ldl"
    ],
    "relatedTerms": [
      "hdl",
      "ldl",
      "vldl",
      "apolipoproteina",
      "trigliceridi",
      "lipoproteina-a"
    ]
  },
  {
    "slug": "magnesio",
    "term": "Magnesio",
    "aliases": [
      "magnesiemia",
      "Mg"
    ],
    "definition": "Il magnesio è un minerale necessario a muscoli, nervi ed enzimi. Nel sangue ne circola solo una piccola parte, mentre il resto è dentro le cellule e nelle ossa.",
    "inDetail": [
      "L'unità è mg/dL o mmol/L. Il livello nel sangue non sempre rispecchia quanto ne contiene il corpo.",
      "Viene spesso richiesto insieme a calcio, potassio e sodio."
    ],
    "relatedGuides": [
      "calcio",
      "potassio",
      "sodio"
    ],
    "relatedTerms": [
      "elettroliti",
      "calcio",
      "potassio",
      "fosforo"
    ]
  },
  {
    "slug": "marcatore",
    "term": "Marcatore",
    "aliases": [
      "biomarcatore",
      "marker"
    ],
    "definition": "Un marcatore, o biomarcatore, è una sostanza misurabile nel sangue o in altri materiali che segnala un processo dell'organismo, come un'infiammazione o l'attività di un organo.",
    "inDetail": [
      "Il termine è molto generico: il referto riporta il nome specifico della sostanza.",
      "Un marcatore da solo non basta a dire che cosa accada: il medico lo legge assieme a sintomi, storia e altri esami."
    ],
    "relatedGuides": [
      "cosa-chiedere-al-medico"
    ],
    "relatedTerms": [
      "psa",
      "troponina",
      "proteina-c-reattiva",
      "antigene"
    ]
  },
  {
    "slug": "mch",
    "term": "MCH (contenuto emoglobinico medio)",
    "aliases": [
      "MCH",
      "emoglobina corpuscolare media"
    ],
    "definition": "L'MCH indica quanta emoglobina contiene, in media, un singolo globulo rosso. Si calcola dividendo l'emoglobina per il numero dei globuli rossi.",
    "inDetail": [
      "L'unità è il picogrammo (pg), cioè un millesimo di miliardesimo di grammo.",
      "Si legge con MCV e MCHC, che descrivono le dimensioni e la concentrazione."
    ],
    "relatedGuides": [
      "mch-e-mchc",
      "mcv-volume-corpuscolare-medio"
    ],
    "relatedTerms": [
      "mchc",
      "mcv",
      "emoglobina",
      "globuli-rossi"
    ]
  },
  {
    "slug": "mchc",
    "term": "MCHC (concentrazione emoglobinica corpuscolare media)",
    "aliases": [
      "MCHC",
      "concentrazione media di emoglobina"
    ],
    "definition": "L'MCHC è la concentrazione media di emoglobina nei globuli rossi, cioè quanta emoglobina c'è rispetto al volume della cellula.",
    "inDetail": [
      "Si esprime in g/dL, la stessa unità dell'emoglobina. Rispetto agli altri indici varia poco da persona a persona.",
      "Va letto insieme a MCH e MCV, che descrivono contenuto e dimensione."
    ],
    "relatedGuides": [
      "mch-e-mchc",
      "mcv-volume-corpuscolare-medio"
    ],
    "relatedTerms": [
      "mch",
      "mcv",
      "emoglobina",
      "ematocrito"
    ]
  },
  {
    "slug": "mcv",
    "term": "MCV (volume corpuscolare medio)",
    "aliases": [
      "MCV",
      "volume globulare medio"
    ],
    "definition": "L'MCV indica il volume medio dei globuli rossi. Viene calcolato dallo strumento a partire da ematocrito e numero di globuli rossi.",
    "inDetail": [
      "L'unità è il femtolitro (fL), un milionesimo di miliardesimo di litro.",
      "Descrive la dimensione media dei globuli rossi, mentre l'RDW indica quanto sono diverse fra loro."
    ],
    "relatedGuides": [
      "mcv-volume-corpuscolare-medio",
      "rdw"
    ],
    "relatedTerms": [
      "mch",
      "mchc",
      "rdw",
      "globuli-rossi",
      "ematocrito"
    ]
  },
  {
    "slug": "metodo-analitico",
    "term": "Metodo analitico",
    "aliases": [
      "metodica",
      "tecnica di misura"
    ],
    "definition": "Il metodo analitico è la tecnica con cui il laboratorio misura una sostanza. Metodi diversi possono dare numeri leggermente diversi per lo stesso campione.",
    "inDetail": [
      "Il metodo e a volte lo strumento sono riportati nel referto o nelle note. L'intervallo di riferimento dipende da loro.",
      "Per questo, per seguire un valore nel tempo, è preferibile usare sempre lo stesso laboratorio."
    ],
    "relatedGuides": [
      "intervalli-di-riferimento",
      "perche-i-valori-cambiano"
    ],
    "relatedTerms": [
      "intervallo-di-riferimento",
      "variabilita-biologica",
      "unita-di-misura",
      "referto"
    ]
  },
  {
    "slug": "microalbuminuria",
    "term": "Microalbuminuria",
    "aliases": [
      "albuminuria",
      "albumina urinaria"
    ],
    "definition": "La microalbuminuria è la presenza nelle urine di piccole quantità di albumina, una proteina del sangue. È un esame sensibile, più della striscia reattiva standard.",
    "inDetail": [
      "Si misura nelle urine del mattino o delle 24 ore, in mg/L o mg/24 h; spesso è espressa come rapporto con la creatinina urinaria.",
      "Febbre, sforzi intensi o infezioni urinarie possono influire sul campione."
    ],
    "relatedGuides": [
      "microalbuminuria",
      "creatinina",
      "esame-delle-urine"
    ],
    "relatedTerms": [
      "rapporto-albumina-creatinina",
      "albumina",
      "proteinuria",
      "creatinina"
    ]
  },
  {
    "slug": "milligrammi-per-decilitro",
    "term": "Milligrammi per decilitro (mg/dL)",
    "aliases": [
      "mg/dL",
      "mg/100 mL"
    ],
    "definition": "È un'unità di concentrazione: indica quanti milligrammi di una sostanza sono contenuti in un decilitro (100 mL) di liquido. È molto usata per glicemia, colesterolo e creatinina.",
    "inDetail": [
      "Per passare ad altre unità (per esempio mmol/L) serve un fattore specifico per ciascuna sostanza.",
      "Confronta sempre l'unità del risultato con quella dell'intervallo di riferimento."
    ],
    "relatedGuides": [
      "unita-di-misura-nei-referti"
    ],
    "relatedTerms": [
      "millimoli-per-litro",
      "unita-di-misura",
      "glicemia",
      "colesterolo"
    ]
  },
  {
    "slug": "millimoli-per-litro",
    "term": "Millimoli per litro (mmol/L)",
    "aliases": [
      "mmol/L",
      "millimolare"
    ],
    "definition": "È un'unità di concentrazione che indica quante millimoli di una sostanza sono disciolte in un litro. È la scala del Sistema Internazionale, usata in molti paesi.",
    "inDetail": [
      "A parità di sostanza, i numeri in mmol/L sono diversi da quelli in mg/dL. Il fattore di conversione dipende dal peso molecolare.",
      "Alcuni referti riportano entrambe le unità."
    ],
    "relatedGuides": [
      "unita-di-misura-nei-referti"
    ],
    "relatedTerms": [
      "milligrammi-per-decilitro",
      "unita-di-misura",
      "glucosio",
      "elettroliti"
    ]
  },
  {
    "slug": "monociti",
    "term": "Monociti",
    "aliases": [
      "granulociti monociti"
    ],
    "definition": "I monociti sono globuli bianchi di grandi dimensioni che, passati nei tessuti, diventano macrofagi: cellule che inglobano germi e residui.",
    "inDetail": [
      "Nella formula leucocitaria sono riportati in percentuale e come numero assoluto.",
      "Come per gli altri tipi, conta il quadro complessivo della formula."
    ],
    "relatedGuides": [
      "globuli-bianchi-e-formula-leucocitaria"
    ],
    "relatedTerms": [
      "formula-leucocitaria",
      "linfociti",
      "neutrofili",
      "globuli-bianchi"
    ]
  },
  {
    "slug": "mpv",
    "term": "MPV (volume piastrinico medio)",
    "aliases": [
      "MPV",
      "volume medio piastrinico"
    ],
    "definition": "L'MPV è il volume medio delle piastrine, cioè delle cellule del sangue coinvolte nella coagulazione. Viene misurato dallo strumento insieme alla conta piastrinica.",
    "inDetail": [
      "L'unità è il femtolitro (fL), un milionesimo di miliardesimo di litro.",
      "Si legge insieme al numero di piastrine, riportato poco sopra nello stesso referto."
    ],
    "relatedGuides": [
      "piastrine"
    ],
    "relatedTerms": [
      "piastrine",
      "coagulazione",
      "emocromo"
    ]
  },
];

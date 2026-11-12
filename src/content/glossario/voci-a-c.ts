import type { GlossaryEntry } from "./schema";

/** Voci del glossario, lettere a-c. Bozze da revisione medica. */
export const GLOSSARIO_A_C: GlossaryEntry[] = [
  {
    "slug": "acido-folico",
    "term": "Acido folico",
    "aliases": [
      "vitamina B9",
      "folacina"
    ],
    "definition": "L'acido folico è la forma sintetica della vitamina B9, una vitamina del gruppo B necessaria alla formazione delle cellule, in particolare di quelle del sangue. Nel sangue si misurano i folati.",
    "inDetail": [
      "Nel referto di solito compare la voce «folati» o «acido folico» con un risultato in ng/mL o nmol/L. Il laboratorio stampa un intervallo di riferimento legato al suo metodo.",
      "Il valore dipende anche da quanto tempo prima del prelievo si è mangiato, quindi vale la pena controllare le istruzioni di preparazione."
    ],
    "relatedGuides": [
      "folati",
      "vitamina-b12",
      "prima-del-prelievo"
    ],
    "relatedTerms": [
      "folati",
      "omocisteina",
      "vitamina-b12"
    ]
  },
  {
    "slug": "acido-urico",
    "term": "Acido urico",
    "aliases": [
      "uricemia",
      "urato"
    ],
    "definition": "L'acido urico è una sostanza di scarto che il corpo produce quando smaltisce alcune molecole dette purine. Circola nel sangue e viene eliminato soprattutto dai reni con le urine.",
    "inDetail": [
      "Sul referto trovi «acido urico» o «uricemia», in genere in mg/dL oppure in µmol/L. Controlla l'unità di misura prima di confrontare numeri di referti diversi.",
      "I valori variano con sesso, età e metodo del laboratorio: conta l'intervallo stampato sul tuo referto e l'interpretazione del medico."
    ],
    "relatedGuides": [
      "acido-urico",
      "creatinina",
      "intervalli-di-riferimento"
    ],
    "relatedTerms": [
      "creatinina",
      "azotemia",
      "metodo-analitico"
    ]
  },
  {
    "slug": "albumina",
    "term": "Albumina",
    "aliases": [
      "albuminemia"
    ],
    "definition": "L'albumina è la proteina più abbondante nel plasma, prodotta dal fegato. Aiuta a trattenere i liquidi nei vasi e a trasportare molte sostanze, come ormoni e farmaci.",
    "inDetail": [
      "Nel referto il risultato è in genere espresso in g/dL o g/L. Può comparire da sola o insieme alle proteine totali e all'elettroforesi.",
      "Non va confusa con l'albumina nelle urine (microalbuminuria), che è un esame diverso su un altro campione."
    ],
    "relatedGuides": [
      "albumina",
      "proteine-totali-ed-elettroforesi",
      "microalbuminuria"
    ],
    "relatedTerms": [
      "proteine-totali",
      "elettroforesi",
      "microalbuminuria",
      "globuline"
    ]
  },
  {
    "slug": "alt",
    "term": "ALT (alanina aminotransferasi)",
    "aliases": [
      "GPT",
      "transaminasi ALT",
      "SGPT"
    ],
    "definition": "L'ALT è un enzima presente soprattutto nelle cellule del fegato. Nel sangue se ne misura l'attività: si usa come uno degli indicatori dello stato delle cellule epatiche.",
    "inDetail": [
      "L'attività si esprime di solito in U/L (unità internazionali per litro). Il laboratorio stampa un intervallo di riferimento che può differire fra metodi e fra uomini e donne.",
      "Sul referto compare spesso insieme a AST e gamma GT: il medico legge le voci insieme, non una per volta."
    ],
    "relatedGuides": [
      "transaminasi-alt-ast",
      "gamma-gt"
    ],
    "relatedTerms": [
      "ast",
      "transaminasi",
      "enzima",
      "gamma-gt",
      "unita-internazionali"
    ]
  },
  {
    "slug": "amilasi",
    "term": "Amilasi",
    "aliases": [
      "alfa-amilasi"
    ],
    "definition": "L'amilasi è un enzima che aiuta a digerire gli amidi. Si produce soprattutto nel pancreas e nelle ghiandole salivari, e se ne misura l'attività nel sangue o nelle urine.",
    "inDetail": [
      "L'unità tipica è U/L. Dato che la sorgente può essere pancreatica o salivare, alcuni referti riportano anche l'amilasi pancreatica.",
      "Spesso è richiesta insieme alla lipasi; il medico valuta le due voci nel contesto della richiesta."
    ],
    "relatedGuides": [
      "amilasi-e-lipasi"
    ],
    "relatedTerms": [
      "lipasi",
      "enzima",
      "unita-internazionali"
    ]
  },
  {
    "slug": "anemia",
    "term": "Anemia",
    "aliases": [
      "carenza di globuli rossi",
      "riduzione dell'emoglobina"
    ],
    "definition": "Con «anemia» si indica una riduzione dell'emoglobina nel sangue, cioè della proteina dei globuli rossi che trasporta l'ossigeno. È un termine descrittivo che ha molte cause diverse.",
    "inDetail": [
      "Il referto non riporta la parola «anemia»: riporta emoglobina, globuli rossi, ematocrito e gli indici corpuscolari (MCV, MCH, MCHC). È il medico a valutarli insieme.",
      "Capire quale tipo e perché richiede in genere altri esami, per esempio ferritina, vitamina B12 e folati."
    ],
    "relatedGuides": [
      "emocromo",
      "emoglobina",
      "ferritina",
      "vitamina-b12"
    ],
    "relatedTerms": [
      "emoglobina",
      "globuli-rossi",
      "ematocrito",
      "mcv",
      "ferritina"
    ]
  },
  {
    "slug": "anticorpi",
    "term": "Anticorpi",
    "aliases": [
      "immunoglobuline specifiche"
    ],
    "definition": "Gli anticorpi sono proteine prodotte dal sistema immunitario che riconoscono una specifica molecola, detta antigene. Nel sangue se ne cercano di diversi tipi, per esempio contro un virus o contro un tessuto del corpo.",
    "inDetail": [
      "Un referto può riportare un anticorpo come «presente/assente», come titolo (una diluizione) o come concentrazione in unità arbitrarie. Il metodo cambia da laboratorio a laboratorio.",
      "La stessa sigla può indicare anticorpi molto diversi: conta il nome completo dell'esame."
    ],
    "relatedGuides": [
      "anticorpi-anti-tpo",
      "anticorpi-anti-tireoglobulina"
    ],
    "relatedTerms": [
      "antigene",
      "autoanticorpi",
      "immunoglobuline",
      "unita-internazionali"
    ]
  },
  {
    "slug": "anticorpi-anti-tpo",
    "term": "Anticorpi anti-TPO",
    "aliases": [
      "anti-TPO",
      "anticorpi antiperossidasi tiroidea",
      "AbTPO"
    ],
    "definition": "Gli anticorpi anti-TPO sono anticorpi diretti contro la tireoperossidasi, un enzima della tiroide. Sono un tipo di autoanticorpo che si misura nel sangue.",
    "inDetail": [
      "L'esame è quantitativo: il risultato è in UI/mL o kU/L e il laboratorio indica una soglia propria. Soglie e unità cambiano con il metodo.",
      "Si legge insieme al TSH e agli ormoni tiroidei, perché da soli non descrivono come funziona la tiroide."
    ],
    "relatedGuides": [
      "anticorpi-anti-tpo",
      "tsh",
      "anticorpi-anti-tireoglobulina"
    ],
    "relatedTerms": [
      "autoanticorpi",
      "tireoglobulina",
      "tsh",
      "ft4"
    ]
  },
  {
    "slug": "anticorpi-anti-tireoglobulina",
    "term": "Anticorpi anti-tireoglobulina",
    "aliases": [
      "anti-Tg",
      "AbTg",
      "TgAb"
    ],
    "definition": "Sono anticorpi diretti contro la tireoglobulina, una proteina prodotta dalla tiroide. Rientrano fra gli autoanticorpi e si misurano con un prelievo di sangue.",
    "inDetail": [
      "Il risultato è espresso in UI/mL o kU/L secondo il metodo; il laboratorio stampa la propria soglia di riferimento.",
      "Quando si segue il dosaggio della tireoglobulina, la presenza di questi anticorpi può interferire sul risultato: per questo il laboratorio spesso li misura insieme."
    ],
    "relatedGuides": [
      "anticorpi-anti-tireoglobulina",
      "anticorpi-anti-tpo",
      "tsh"
    ],
    "relatedTerms": [
      "tireoglobulina",
      "autoanticorpi",
      "anticorpi-anti-tpo",
      "anticorpi"
    ]
  },
  {
    "slug": "antigene",
    "term": "Antigene",
    "aliases": [
      "Ag"
    ],
    "definition": "Un antigene è una molecola che il sistema immunitario riconosce e contro cui può produrre anticorpi. Può far parte di un virus, di un batterio o di una cellula dell'organismo.",
    "inDetail": [
      "In un referto «antigene» indica spesso la ricerca diretta di una sostanza, a differenza dell'«anticorpo», che indica la risposta dell'organismo a quella sostanza.",
      "Anche alcuni marcatori, come il PSA (antigene prostatico specifico), hanno «antigene» nel nome pur essendo dosati come proteine."
    ],
    "relatedGuides": [
      "psa"
    ],
    "relatedTerms": [
      "anticorpi",
      "marcatore",
      "psa"
    ]
  },
  {
    "slug": "apolipoproteina",
    "term": "Apolipoproteina",
    "aliases": [
      "Apo",
      "apoB",
      "apoA1"
    ],
    "definition": "Le apolipoproteine sono le proteine che fanno parte delle lipoproteine, le particelle che trasportano nel sangue colesterolo e trigliceridi. Ne esistono vari tipi, per esempio apoA1 e apoB.",
    "inDetail": [
      "Sul referto trovi sigle come «apoB» o «apoA-I», in genere in mg/dL o g/L. Il numero descrive quante particelle di un certo tipo circolano, non la quantità di colesterolo.",
      "L'esame non fa parte del profilo lipidico di base: viene richiesto in situazioni specifiche."
    ],
    "relatedGuides": [
      "colesterolo-ldl",
      "lipoproteina-a"
    ],
    "relatedTerms": [
      "lipoproteine",
      "lipoproteina-a",
      "colesterolo",
      "ldl",
      "hdl"
    ]
  },
  {
    "slug": "aptt",
    "term": "aPTT (tempo di tromboplastina parziale attivata)",
    "aliases": [
      "PTT",
      "tempo di tromboplastina parziale"
    ],
    "definition": "L'aPTT è un test di coagulazione che misura in secondi quanto tempo impiega il plasma a formare un coagulo dopo l'aggiunta di reagenti. Esplora una parte dei fattori della coagulazione.",
    "inDetail": [
      "Il risultato è in secondi, spesso affiancato da un rapporto (ratio) rispetto a un controllo. Reagenti e strumenti diversi producono intervalli diversi.",
      "Il campione viene raccolto in una provetta con anticoagulante e va riempita fino al segno: un prelievo non corretto può alterare il tempo."
    ],
    "relatedGuides": [
      "aptt",
      "pt-inr",
      "fibrinogeno"
    ],
    "relatedTerms": [
      "coagulazione",
      "pt-tempo-di-protrombina",
      "inr",
      "fibrinogeno",
      "plasma"
    ]
  },
  {
    "slug": "ast",
    "term": "AST (aspartato aminotransferasi)",
    "aliases": [
      "GOT",
      "SGOT",
      "transaminasi AST"
    ],
    "definition": "L'AST è un enzima presente in diversi tessuti, fra cui fegato, muscoli e cuore. Se ne misura l'attività nel sangue insieme a quella dell'ALT.",
    "inDetail": [
      "L'unità è di solito U/L. Poiché l'AST non è specifica del fegato, il medico la legge insieme ad ALT, gamma GT e talvolta CK o LDH.",
      "Un'attività fisica intensa nei giorni precedenti può influire sul risultato: è utile dirlo al medico."
    ],
    "relatedGuides": [
      "transaminasi-alt-ast",
      "ldh"
    ],
    "relatedTerms": [
      "alt",
      "transaminasi",
      "creatinchinasi-ck",
      "ldh",
      "enzima"
    ]
  },
  {
    "slug": "autoanticorpi",
    "term": "Autoanticorpi",
    "aliases": [
      "anticorpi anti-self"
    ],
    "definition": "Gli autoanticorpi sono anticorpi diretti contro molecole o tessuti dell'organismo stesso. Si cercano con esami del sangue specifici, scelti in base alla domanda clinica.",
    "inDetail": [
      "Ogni autoanticorpo ha un proprio metodo, una propria unità e una propria soglia. Per questo non si possono confrontare numeri di esami con nomi diversi.",
      "La loro presenza in un referto non basta, da sola, a descrivere una situazione: serve la valutazione del medico."
    ],
    "relatedGuides": [
      "anticorpi-anti-tpo",
      "anticorpi-anti-tireoglobulina"
    ],
    "relatedTerms": [
      "anticorpi",
      "anticorpi-anti-tpo",
      "anticorpi-anti-tireoglobulina",
      "antigene"
    ]
  },
  {
    "slug": "azotemia",
    "term": "Azotemia",
    "aliases": [
      "urea nel sangue",
      "BUN"
    ],
    "definition": "L'azotemia è la quantità di urea presente nel sangue. L'urea è un prodotto di scarto del metabolismo delle proteine che i reni eliminano con le urine.",
    "inDetail": [
      "Si esprime in mg/dL (urea) oppure in mmol/L; alcuni paesi riportano il BUN, cioè l'azoto ureico, che ha un numero diverso per la stessa quantità.",
      "Il valore dipende anche da alimentazione e da quanto si è bevuto, quindi si legge con la creatinina."
    ],
    "relatedGuides": [
      "azotemia-urea",
      "creatinina",
      "egfr-filtrato-glomerulare"
    ],
    "relatedTerms": [
      "urea",
      "creatinina",
      "egfr",
      "milligrammi-per-decilitro"
    ]
  },
  {
    "slug": "basofili",
    "term": "Basofili",
    "aliases": [
      "granulociti basofili"
    ],
    "definition": "I basofili sono un tipo di globuli bianchi, i meno numerosi. Contengono granuli con sostanze coinvolte nelle reazioni allergiche e infiammatorie.",
    "inDetail": [
      "Nella formula leucocitaria compaiono come percentuale e come numero assoluto (cellule per microlitro o 10^9/L).",
      "Poiché sono pochissimi, piccole variazioni di conteggio sono frequenti; il medico guarda il quadro complessivo della formula."
    ],
    "relatedGuides": [
      "globuli-bianchi-e-formula-leucocitaria",
      "emocromo"
    ],
    "relatedTerms": [
      "globuli-bianchi",
      "formula-leucocitaria",
      "eosinofili",
      "neutrofili",
      "cellule-per-microlitro"
    ]
  },
  {
    "slug": "bicarbonato",
    "term": "Bicarbonato",
    "aliases": [
      "HCO3",
      "CO2 totale"
    ],
    "definition": "Il bicarbonato è una sostanza disciolta nel sangue che contribuisce a mantenere stabile l'acidità dei liquidi del corpo. È anche uno degli elettroliti.",
    "inDetail": [
      "Si misura in mmol/L (o mEq/L). Su alcuni referti compare come «CO2 totale» o «bicarbonati».",
      "Spesso viene richiesto in un pannello insieme a sodio, potassio e cloro."
    ],
    "relatedGuides": [
      "sodio",
      "potassio"
    ],
    "relatedTerms": [
      "elettroliti",
      "sodio",
      "potassio",
      "cloro"
    ]
  },
  {
    "slug": "bilirubina",
    "term": "Bilirubina",
    "aliases": [
      "bilirubina totale"
    ],
    "definition": "La bilirubina è un pigmento giallo che si forma quando vengono demoliti i globuli rossi vecchi. Il fegato la elabora e la elimina con la bile.",
    "inDetail": [
      "Il referto riporta di norma bilirubina totale, diretta e indiretta, in mg/dL o µmol/L. La totale è la somma delle altre due.",
      "Alcune persone hanno valori che oscillano con digiuno o stanchezza; il medico guarda le tre voci insieme."
    ],
    "relatedGuides": [
      "bilirubina",
      "transaminasi-alt-ast"
    ],
    "relatedTerms": [
      "bilirubina-diretta",
      "bilirubina-indiretta",
      "emolisi",
      "urobilinogeno",
      "milligrammi-per-decilitro"
    ]
  },
  {
    "slug": "bilirubina-diretta",
    "term": "Bilirubina diretta",
    "aliases": [
      "bilirubina coniugata"
    ],
    "definition": "La bilirubina diretta è la quota di bilirubina già elaborata dal fegato, resa solubile in acqua e pronta per essere eliminata con la bile.",
    "inDetail": [
      "Si indica anche come «coniugata». Viene stampata in mg/dL o µmol/L sotto la bilirubina totale.",
      "Insieme all'indiretta aiuta il medico a capire in quale tappa del percorso della bilirubina si osservi la variazione."
    ],
    "relatedGuides": [
      "bilirubina"
    ],
    "relatedTerms": [
      "bilirubina",
      "bilirubina-indiretta",
      "fosfatasi-alcalina",
      "gamma-gt"
    ]
  },
  {
    "slug": "bilirubina-indiretta",
    "term": "Bilirubina indiretta",
    "aliases": [
      "bilirubina non coniugata"
    ],
    "definition": "La bilirubina indiretta è la quota di bilirubina non ancora elaborata dal fegato, che viaggia nel sangue legata all'albumina. Di solito è calcolata, non misurata direttamente.",
    "inDetail": [
      "Il laboratorio la ricava sottraendo la diretta dalla totale. L'unità è mg/dL o µmol/L.",
      "Il valore può essere influenzato dalla demolizione dei globuli rossi e dal digiuno."
    ],
    "relatedGuides": [
      "bilirubina"
    ],
    "relatedTerms": [
      "bilirubina",
      "bilirubina-diretta",
      "emolisi",
      "albumina"
    ]
  },
  {
    "slug": "calcio",
    "term": "Calcio",
    "aliases": [
      "calcemia",
      "calcio totale"
    ],
    "definition": "Il calcio è un minerale presente soprattutto nelle ossa. Una piccola parte circola nel sangue e serve a muscoli, nervi e coagulazione. Si misura come calcemia.",
    "inDetail": [
      "L'unità è mg/dL o mmol/L. Il calcio totale dipende in parte dall'albumina, per questo alcuni laboratori riportano anche un calcio corretto o ionizzato.",
      "Viene regolato da paratormone e vitamina D, che si dosano con esami separati."
    ],
    "relatedGuides": [
      "calcio",
      "vitamina-d",
      "albumina"
    ],
    "relatedTerms": [
      "albumina",
      "vitamina-d",
      "elettroliti",
      "fosforo",
      "magnesio"
    ]
  },
  {
    "slug": "campione",
    "term": "Campione biologico",
    "aliases": [
      "campione",
      "provetta"
    ],
    "definition": "Il campione è la quantità di sangue, urina o altro materiale prelevata dal corpo per essere analizzata in laboratorio. Ogni esame richiede il tipo di campione e di provetta adatti.",
    "inDetail": [
      "Sul referto può comparire il tipo di materiale: siero, plasma, sangue intero, urina del mattino, urine delle 24 ore.",
      "Orario del prelievo, digiuno e conservazione incidono sulla qualità del campione e sul risultato."
    ],
    "relatedGuides": [
      "prima-del-prelievo",
      "perche-i-valori-cambiano"
    ],
    "relatedTerms": [
      "prelievo",
      "siero",
      "plasma",
      "emolisi"
    ]
  },
  {
    "slug": "cellule-per-microlitro",
    "term": "Cellule per microlitro",
    "aliases": [
      "/µL",
      "10^9/L",
      "per mm3"
    ],
    "definition": "È un modo di esprimere il numero di cellule del sangue: quante ce ne sono in un microlitro, cioè in un millesimo di millilitro. Equivale a «per mm3».",
    "inDetail": [
      "Molti referti usano 10^9/L (miliardi per litro) per globuli bianchi e piastrine e 10^12/L per i globuli rossi: sono unità equivalenti, scritte in modo diverso.",
      "Controlla l'unità stampata accanto al numero e usa lo stesso intervallo di riferimento per il confronto."
    ],
    "relatedGuides": [
      "unita-di-misura-nei-referti",
      "emocromo"
    ],
    "relatedTerms": [
      "globuli-bianchi",
      "globuli-rossi",
      "piastrine",
      "unita-di-misura"
    ]
  },
  {
    "slug": "chetoni",
    "term": "Chetoni",
    "aliases": [
      "corpi chetonici",
      "acetone",
      "chetonuria"
    ],
    "definition": "I chetoni sono sostanze che il fegato produce quando il corpo usa i grassi come fonte di energia. Si cercano soprattutto nelle urine con una striscia reattiva.",
    "inDetail": [
      "Nell'esame delle urine compaiono come «corpi chetonici» e si riportano con una scala (assenti, tracce, +, ++).",
      "Digiuno prolungato, attività intensa o alimentazione molto povera di carboidrati possono renderli rilevabili."
    ],
    "relatedGuides": [
      "esame-delle-urine"
    ],
    "relatedTerms": [
      "esame-delle-urine",
      "glicosuria",
      "digiuno",
      "sedimento-urinario"
    ]
  },
  {
    "slug": "clearance-della-creatinina",
    "term": "Clearance della creatinina",
    "aliases": [
      "clearance creatinina",
      "CrCl"
    ],
    "definition": "È una stima del volume di sangue che i reni ripuliscono dalla creatinina in un minuto. Si calcola da creatinina nel sangue, creatinina nelle urine raccolte e volume urinario.",
    "inDetail": [
      "L'unità è mL/min. Richiede spesso la raccolta delle urine delle 24 ore, con le istruzioni del laboratorio.",
      "Una raccolta incompleta altera il calcolo. L'eGFR è invece una stima ottenuta con una formula dal solo prelievo."
    ],
    "relatedGuides": [
      "creatinina",
      "egfr-filtrato-glomerulare"
    ],
    "relatedTerms": [
      "creatinina",
      "egfr",
      "diuresi",
      "urea"
    ]
  },
  {
    "slug": "cloro",
    "term": "Cloro",
    "aliases": [
      "cloruri",
      "cloremia"
    ],
    "definition": "Il cloro è un elettrolita presente nel sangue sotto forma di cloruro. Insieme a sodio e potassio contribuisce all'equilibrio dei liquidi dell'organismo.",
    "inDetail": [
      "L'unità è mmol/L (o mEq/L). Compare tipicamente nel pannello degli elettroliti.",
      "Si interpreta insieme a sodio e bicarbonato; il medico valuta le voci in coppia."
    ],
    "relatedGuides": [
      "sodio",
      "potassio"
    ],
    "relatedTerms": [
      "elettroliti",
      "sodio",
      "potassio",
      "bicarbonato"
    ]
  },
  {
    "slug": "coagulazione",
    "term": "Coagulazione",
    "aliases": [
      "emostasi"
    ],
    "definition": "La coagulazione è il processo con cui il sangue forma un coagulo per chiudere una lesione. Coinvolge piastrine, proteine dette fattori della coagulazione e il fibrinogeno.",
    "inDetail": [
      "I test di base sono PT/INR, aPTT e fibrinogeno. Ciascuno esplora una parte del processo e si misura in secondi o in mg/dL.",
      "I reagenti usati dal laboratorio cambiano gli intervalli: confronta sempre con quelli stampati sul tuo referto."
    ],
    "relatedGuides": [
      "pt-inr",
      "aptt",
      "fibrinogeno",
      "piastrine"
    ],
    "relatedTerms": [
      "pt-tempo-di-protrombina",
      "inr",
      "aptt",
      "fibrinogeno",
      "piastrine",
      "d-dimero"
    ]
  },
  {
    "slug": "colesterolo",
    "term": "Colesterolo",
    "aliases": [
      "colesterolo totale"
    ],
    "definition": "Il colesterolo è una sostanza grassa necessaria alle membrane delle cellule e alla produzione di ormoni. Viaggia nel sangue dentro particelle chiamate lipoproteine, come HDL e LDL.",
    "inDetail": [
      "Il referto riporta colesterolo totale, HDL, LDL e spesso trigliceridi, in mg/dL o mmol/L. Il passaggio da un'unità all'altra richiede un fattore di conversione.",
      "Il totale è la somma di quello contenuto nelle diverse lipoproteine, per questo da solo dice poco: si leggono tutte le voci insieme."
    ],
    "relatedGuides": [
      "colesterolo-totale",
      "colesterolo-hdl",
      "colesterolo-ldl"
    ],
    "relatedTerms": [
      "hdl",
      "ldl",
      "lipoproteine",
      "trigliceridi",
      "lipidi",
      "milligrammi-per-decilitro"
    ]
  },
  {
    "slug": "colesterolo-hdl",
    "term": "Colesterolo HDL",
    "aliases": [
      "HDL",
      "colesterolo buono",
      "lipoproteine ad alta densità"
    ],
    "definition": "È il colesterolo contenuto nelle lipoproteine ad alta densità (HDL), che riportano colesterolo dai tessuti verso il fegato. Si misura nel sangue.",
    "inDetail": [
      "L'unità è mg/dL o mmol/L. Sul referto si trova nel profilo lipidico accanto a totale, LDL e trigliceridi.",
      "Per questa voce un intervallo di riferimento può avere limiti diversi tra uomini e donne."
    ],
    "relatedGuides": [
      "colesterolo-hdl",
      "colesterolo-totale"
    ],
    "relatedTerms": [
      "hdl",
      "colesterolo",
      "colesterolo-ldl",
      "lipoproteine"
    ]
  },
  {
    "slug": "colesterolo-ldl",
    "term": "Colesterolo LDL",
    "aliases": [
      "LDL",
      "colesterolo cattivo",
      "lipoproteine a bassa densità"
    ],
    "definition": "È il colesterolo contenuto nelle lipoproteine a bassa densità (LDL), che lo trasportano dal fegato ai tessuti. Può essere misurato direttamente o calcolato con una formula.",
    "inDetail": [
      "Molti laboratori lo calcolano a partire da totale, HDL e trigliceridi; la formula usata dovrebbe essere indicata nel referto. L'unità è mg/dL o mmol/L.",
      "Il calcolo perde precisione quando i trigliceridi sono molto alti: in questo caso si può preferire il dosaggio diretto."
    ],
    "relatedGuides": [
      "colesterolo-ldl",
      "colesterolo-non-hdl",
      "trigliceridi"
    ],
    "relatedTerms": [
      "ldl",
      "colesterolo",
      "apolipoproteina",
      "trigliceridi",
      "vldl"
    ]
  },
  {
    "slug": "cortisolo",
    "term": "Cortisolo",
    "aliases": [
      "ormone dello stress",
      "cortisolemia"
    ],
    "definition": "Il cortisolo è un ormone prodotto dalle ghiandole surrenali. Segue un ritmo nelle 24 ore, con valori più alti al mattino, e interviene nella risposta allo stress e nel metabolismo.",
    "inDetail": [
      "L'unità è µg/dL o nmol/L. Il risultato dipende molto dall'orario del prelievo, che il referto dovrebbe riportare.",
      "Può essere dosato anche nella saliva o nelle urine; sono esami diversi con intervalli diversi."
    ],
    "relatedGuides": [
      "cortisolo",
      "prima-del-prelievo"
    ],
    "relatedTerms": [
      "ormone",
      "ritmo-circadiano",
      "prelievo",
      "siero"
    ]
  },
  {
    "slug": "creatinina",
    "term": "Creatinina",
    "aliases": [
      "creatininemia"
    ],
    "definition": "La creatinina è un prodotto di scarto dei muscoli, eliminato dai reni. La sua concentrazione nel sangue è uno degli indicatori usati per valutare come i reni filtrano.",
    "inDetail": [
      "L'unità è mg/dL o µmol/L. Dipende da massa muscolare, sesso ed età, per cui due persone possono avere valori diversi senza che ciò abbia un significato.",
      "Con la creatinina molti laboratori calcolano l'eGFR, che tiene conto di età e sesso."
    ],
    "relatedGuides": [
      "creatinina",
      "egfr-filtrato-glomerulare",
      "azotemia-urea"
    ],
    "relatedTerms": [
      "egfr",
      "clearance-della-creatinina",
      "urea",
      "azotemia",
      "milligrammi-per-decilitro"
    ]
  },
  {
    "slug": "creatinchinasi-ck",
    "term": "Creatinchinasi (CK)",
    "aliases": [
      "CK",
      "CPK",
      "creatinfosfochinasi"
    ],
    "definition": "La creatinchinasi (CK) è un enzima presente soprattutto nei muscoli scheletrici, nel cuore e nel cervello. Se ne misura l'attività nel sangue.",
    "inDetail": [
      "L'unità è U/L. Sforzi fisici intensi, anche nei giorni prima del prelievo, possono modificarla.",
      "Esistono frazioni specifiche (come la CK-MB); sul referto la voce va letta con il nome completo."
    ],
    "relatedGuides": [
      "transaminasi-alt-ast",
      "ldh"
    ],
    "relatedTerms": [
      "enzima",
      "ast",
      "ldh",
      "troponina",
      "unita-internazionali"
    ]
  },
  {
    "slug": "curva-da-carico",
    "term": "Curva da carico",
    "aliases": [
      "OGTT",
      "test di tolleranza al glucosio",
      "curva glicemica"
    ],
    "definition": "È un test in cui si misura più volte la glicemia dopo aver bevuto una quantità stabilita di glucosio, per vedere come l'organismo lo gestisce nel tempo.",
    "inDetail": [
      "Si fa un prelievo a digiuno e uno o più prelievi a distanza fissa dal carico (per esempio dopo 60 e 120 minuti), con valori in mg/dL o mmol/L.",
      "Durante il test si resta a riposo e non si mangia: il laboratorio dà le istruzioni di preparazione."
    ],
    "relatedGuides": [
      "curva-da-carico-di-glucosio",
      "glicemia",
      "insulinemia"
    ],
    "relatedTerms": [
      "glicemia",
      "glucosio",
      "insulina",
      "digiuno"
    ]
  },
];

import type { GlossaryEntry } from "./schema";

/** Voci del glossario, lettere d-g. Bozze da revisione medica. */
export const GLOSSARIO_D_G: GlossaryEntry[] = [
  {
    "slug": "d-dimero",
    "term": "D-dimero",
    "aliases": [
      "D-dimer",
      "prodotti di degradazione della fibrina"
    ],
    "definition": "Il D-dimero è un frammento che si forma quando un coagulo di fibrina viene demolito. Si misura nel sangue come indicatore dell'attività di formazione e scioglimento dei coaguli.",
    "inDetail": [
      "Le unità variano molto: ng/mL FEU, µg/mL DDU o altre. Le due scale non sono sovrapponibili, quindi conta l'unità riportata.",
      "Il valore aumenta per molte ragioni diverse, e dipende anche dall'età: serve il giudizio del medico."
    ],
    "relatedGuides": [
      "d-dimero",
      "fibrinogeno"
    ],
    "relatedTerms": [
      "coagulazione",
      "fibrinogeno",
      "plasma",
      "unita-di-misura"
    ]
  },
  {
    "slug": "densita-urinaria",
    "term": "Densità urinaria",
    "aliases": [
      "peso specifico delle urine",
      "PS"
    ],
    "definition": "La densità urinaria indica quanto sono concentrate le urine, cioè quante sostanze sono disciolte in rapporto all'acqua. Si misura sul campione di urina.",
    "inDetail": [
      "Nell'esame delle urine è un numero adimensionale vicino a 1,000 (per esempio 1,015). Cambia nel corso della giornata e con la quantità di liquidi bevuti.",
      "Va letta insieme a colore, pH e al quadro generale dell'esame."
    ],
    "relatedGuides": [
      "esame-delle-urine"
    ],
    "relatedTerms": [
      "esame-delle-urine",
      "diuresi",
      "ph-urinario",
      "sedimento-urinario"
    ]
  },
  {
    "slug": "digiuno",
    "term": "Digiuno prima del prelievo",
    "aliases": [
      "a digiuno",
      "digiuno"
    ],
    "definition": "Il digiuno è l'astensione da cibo e bevande diverse dall'acqua per un numero di ore stabilito prima del prelievo. Serve a ridurre l'effetto dell'ultimo pasto su alcuni esami.",
    "inDetail": [
      "Per glicemia, trigliceridi e alcuni altri dosaggi il pasto precedente può modificare il risultato. Il numero di ore richieste viene indicato dal laboratorio.",
      "Se non hai rispettato le istruzioni, è utile segnalarlo al medico e al personale del prelievo."
    ],
    "relatedGuides": [
      "prima-del-prelievo",
      "glicemia",
      "trigliceridi"
    ],
    "relatedTerms": [
      "prelievo",
      "glicemia",
      "trigliceridi",
      "campione"
    ]
  },
  {
    "slug": "diuresi",
    "term": "Diuresi",
    "aliases": [
      "quantità di urina",
      "volume urinario"
    ],
    "definition": "La diuresi è la quantità di urina prodotta in un certo periodo, di solito in 24 ore. Dipende da quanto si beve, dal clima, dall'attività fisica e dal funzionamento dei reni.",
    "inDetail": [
      "Nei referti con urine delle 24 ore compare in mL/24 h, perché serve per calcolare quanto di una sostanza è stato eliminato in totale.",
      "Una raccolta incompleta rende inutilizzabili i calcoli: segui le istruzioni di raccolta del laboratorio."
    ],
    "relatedGuides": [
      "esame-delle-urine",
      "egfr-filtrato-glomerulare"
    ],
    "relatedTerms": [
      "clearance-della-creatinina",
      "densita-urinaria",
      "esame-delle-urine"
    ]
  },
  {
    "slug": "egfr",
    "term": "eGFR (filtrato glomerulare stimato)",
    "aliases": [
      "GFR stimato",
      "VFG",
      "velocità di filtrazione glomerulare"
    ],
    "definition": "L'eGFR è una stima di quanto sangue i reni filtrano in un minuto. Non si misura direttamente: si calcola con una formula a partire da creatinina, età e sesso.",
    "inDetail": [
      "Si esprime in mL/min/1,73 m². Formule diverse (come CKD-EPI) possono dare risultati leggermente diversi: il referto dovrebbe indicare quale è stata usata.",
      "Per valori molto alti o bassi di massa muscolare la formula è meno precisa."
    ],
    "relatedGuides": [
      "egfr-filtrato-glomerulare",
      "creatinina"
    ],
    "relatedTerms": [
      "creatinina",
      "clearance-della-creatinina",
      "urea",
      "microalbuminuria"
    ]
  },
  {
    "slug": "elettroforesi",
    "term": "Elettroforesi proteica",
    "aliases": [
      "elettroforesi delle proteine sieriche",
      "protidogramma"
    ],
    "definition": "È un esame che separa le proteine del siero in gruppi (albumina e varie globuline) facendole migrare in un campo elettrico. Il risultato è un tracciato con picchi.",
    "inDetail": [
      "Il referto riporta le frazioni (albumina, alfa-1, alfa-2, beta, gamma) in percentuale e in g/dL, spesso con una descrizione del tracciato.",
      "Si legge insieme alle proteine totali; eventuali picchi o bande vengono commentati dal medico o dal laboratorio."
    ],
    "relatedGuides": [
      "proteine-totali-ed-elettroforesi",
      "albumina"
    ],
    "relatedTerms": [
      "proteine-totali",
      "albumina",
      "globuline",
      "gamma-globuline",
      "immunoglobuline"
    ]
  },
  {
    "slug": "elettroliti",
    "term": "Elettroliti",
    "aliases": [
      "sali minerali",
      "ioni"
    ],
    "definition": "Gli elettroliti sono minerali con carica elettrica disciolti nei liquidi del corpo, come sodio, potassio, cloro, calcio e magnesio. Servono a nervi, muscoli e all'equilibrio dei liquidi.",
    "inDetail": [
      "Sul referto si trovano spesso in un gruppo («ionogramma» o «elettroliti sierici») con unità mmol/L o mEq/L.",
      "Si leggono in relazione fra loro e con la funzionalità renale."
    ],
    "relatedGuides": [
      "sodio",
      "potassio",
      "calcio"
    ],
    "relatedTerms": [
      "sodio",
      "potassio",
      "cloro",
      "bicarbonato",
      "magnesio",
      "calcio"
    ]
  },
  {
    "slug": "ematocrito",
    "term": "Ematocrito",
    "aliases": [
      "Hct",
      "HCT"
    ],
    "definition": "L'ematocrito è la percentuale del volume del sangue occupata dai globuli rossi. Si ricava dall'emocromo.",
    "inDetail": [
      "Si esprime in percentuale (%) o come frazione (L/L). Dipende da sesso, età e idratazione.",
      "Va letto insieme a emoglobina e conta dei globuli rossi, con cui è strettamente collegato."
    ],
    "relatedGuides": [
      "ematocrito",
      "emoglobina",
      "globuli-rossi"
    ],
    "relatedTerms": [
      "emoglobina",
      "eritrociti",
      "globuli-rossi",
      "emocromo"
    ]
  },
  {
    "slug": "emocromo",
    "term": "Emocromo",
    "aliases": [
      "esame emocromocitometrico",
      "CBC",
      "emocromo completo"
    ],
    "definition": "L'emocromo è l'esame che conta e descrive le cellule del sangue: globuli rossi, globuli bianchi e piastrine, con alcuni parametri che ne descrivono dimensioni e contenuto.",
    "inDetail": [
      "Il referto è lungo: globuli rossi, emoglobina, ematocrito, indici (MCV, MCH, MCHC, RDW), globuli bianchi con formula leucocitaria, piastrine e MPV.",
      "Ogni voce ha unità e intervallo propri; lo strumento che esegue l'analisi dà risultati leggermente diversi da un laboratorio all'altro."
    ],
    "relatedGuides": [
      "emocromo",
      "globuli-rossi",
      "globuli-bianchi-e-formula-leucocitaria",
      "piastrine"
    ],
    "relatedTerms": [
      "globuli-rossi",
      "globuli-bianchi",
      "piastrine",
      "emoglobina",
      "formula-leucocitaria",
      "mcv"
    ]
  },
  {
    "slug": "emoglobina",
    "term": "Emoglobina",
    "aliases": [
      "Hb",
      "HGB"
    ],
    "definition": "L'emoglobina è la proteina dei globuli rossi che contiene ferro e trasporta l'ossigeno dai polmoni ai tessuti. Si misura nell'emocromo.",
    "inDetail": [
      "L'unità è g/dL (talvolta g/L). Dipende da sesso, età e altitudine di residenza.",
      "Non va confusa con l'emoglobina glicata (HbA1c), un esame diverso legato alla glicemia."
    ],
    "relatedGuides": [
      "emoglobina",
      "emocromo",
      "ferritina"
    ],
    "relatedTerms": [
      "ematocrito",
      "globuli-rossi",
      "anemia",
      "emoglobina-glicata",
      "mch"
    ]
  },
  {
    "slug": "emoglobina-glicata",
    "term": "Emoglobina glicata",
    "aliases": [
      "HbA1c",
      "A1c",
      "glicata"
    ],
    "definition": "L'emoglobina glicata (HbA1c) indica la quota di emoglobina a cui si è legato il glucosio. Riflette l'andamento della glicemia negli ultimi due-tre mesi circa.",
    "inDetail": [
      "Si esprime in percentuale (%) o in mmol/mol: sono due scale diverse e il referto può riportarle entrambe.",
      "Non richiede il digiuno. Alcune condizioni dei globuli rossi possono renderla meno attendibile."
    ],
    "relatedGuides": [
      "emoglobina-glicata",
      "glicemia"
    ],
    "relatedTerms": [
      "glicemia",
      "glucosio",
      "emoglobina",
      "globuli-rossi",
      "unita-di-misura"
    ]
  },
  {
    "slug": "emolisi",
    "term": "Emolisi",
    "aliases": [
      "rottura dei globuli rossi",
      "campione emolizzato"
    ],
    "definition": "L'emolisi è la rottura dei globuli rossi, che liberano il loro contenuto nel liquido circostante. Può avvenire nel corpo, ma più spesso è un effetto della raccolta o della conservazione del campione.",
    "inDetail": [
      "Un campione emolizzato è facile da riconoscere perché il siero appare rosato. Alcuni esami, come il potassio, ne risentono molto.",
      "In questi casi il laboratorio può segnalare una nota nel referto o chiedere di ripetere il prelievo."
    ],
    "relatedGuides": [
      "prima-del-prelievo",
      "potassio"
    ],
    "relatedTerms": [
      "campione",
      "siero",
      "potassio",
      "ldh",
      "bilirubina"
    ]
  },
  {
    "slug": "enzima",
    "term": "Enzima",
    "aliases": [
      "enzimi"
    ],
    "definition": "Un enzima è una proteina che accelera una reazione chimica nell'organismo. Nei referti, di molti enzimi si misura l'attività nel sangue, non la quantità.",
    "inDetail": [
      "L'attività si esprime in U/L (unità internazionali per litro). Il valore dipende da temperatura e metodo di misura, per questo gli intervalli cambiano fra laboratori.",
      "ALT, AST, gamma GT, amilasi, lipasi, LDH e CK sono esempi di enzimi misurati comunemente."
    ],
    "relatedGuides": [
      "transaminasi-alt-ast",
      "gamma-gt"
    ],
    "relatedTerms": [
      "alt",
      "ast",
      "gamma-gt",
      "lipasi",
      "unita-internazionali"
    ]
  },
  {
    "slug": "eosinofili",
    "term": "Eosinofili",
    "aliases": [
      "granulociti eosinofili"
    ],
    "definition": "Gli eosinofili sono un tipo di globuli bianchi coinvolti nelle reazioni allergiche e nella risposta ad alcuni parassiti.",
    "inDetail": [
      "Nella formula leucocitaria sono riportati in percentuale e come numero assoluto (cellule per microlitro o 10^9/L).",
      "Il numero cambia nell'arco della giornata e in alcune stagioni."
    ],
    "relatedGuides": [
      "globuli-bianchi-e-formula-leucocitaria"
    ],
    "relatedTerms": [
      "formula-leucocitaria",
      "basofili",
      "neutrofili",
      "leucociti",
      "cellule-per-microlitro"
    ]
  },
  {
    "slug": "eritrociti",
    "term": "Eritrociti",
    "aliases": [
      "globuli rossi",
      "RBC"
    ],
    "definition": "Eritrociti è il nome scientifico dei globuli rossi, le cellule del sangue che trasportano l'ossigeno grazie all'emoglobina.",
    "inDetail": [
      "Sul referto compaiono come «RBC» o «globuli rossi», in 10^12/L o milioni per microlitro.",
      "Il numero si legge insieme a emoglobina, ematocrito e indici corpuscolari."
    ],
    "relatedGuides": [
      "globuli-rossi",
      "emocromo"
    ],
    "relatedTerms": [
      "globuli-rossi",
      "emoglobina",
      "ematocrito",
      "reticolociti"
    ]
  },
  {
    "slug": "esame-delle-urine",
    "term": "Esame delle urine",
    "aliases": [
      "esame urine completo",
      "analisi delle urine",
      "urine standard"
    ],
    "definition": "È l'insieme di tre controlli su un campione di urina: aspetto fisico, esame chimico con striscia reattiva ed eventuale osservazione al microscopio del sedimento.",
    "inDetail": [
      "Le voci chimiche (pH, proteine, glucosio, chetoni, nitriti, sangue) sono spesso riportate come assenti/presenti o con una scala a croci.",
      "Il campione ideale è in genere quello del mattino, a metà del getto: segui le istruzioni del laboratorio."
    ],
    "relatedGuides": [
      "esame-delle-urine",
      "microalbuminuria"
    ],
    "relatedTerms": [
      "densita-urinaria",
      "ph-urinario",
      "proteinuria",
      "glicosuria",
      "sedimento-urinario",
      "nitriti-urinari"
    ]
  },
  {
    "slug": "estradiolo",
    "term": "Estradiolo",
    "aliases": [
      "E2",
      "17-beta-estradiolo"
    ],
    "definition": "L'estradiolo è il principale ormone estrogeno. Nelle donne è prodotto soprattutto dalle ovaie e varia molto nel corso del ciclo; è presente in quantità minori anche negli uomini.",
    "inDetail": [
      "L'unità è pg/mL o pmol/L. Il laboratorio indica intervalli diversi per fase del ciclo, menopausa e sesso.",
      "Per un confronto sensato conta il giorno del ciclo in cui è stato fatto il prelievo."
    ],
    "relatedGuides": [
      "fsh-e-lh"
    ],
    "relatedTerms": [
      "ormone",
      "fsh",
      "lh",
      "progesterone"
    ]
  },
  {
    "slug": "ferritina",
    "term": "Ferritina",
    "aliases": [
      "ferritina sierica"
    ],
    "definition": "La ferritina è una proteina che immagazzina il ferro nelle cellule. Piccole quantità passano nel sangue e la loro misura è usata come indicatore delle riserve di ferro.",
    "inDetail": [
      "L'unità è ng/mL o µg/L (equivalenti). Aumenta anche in presenza di infiammazione, per questo si legge con altri esami.",
      "Viene interpretata insieme a sideremia, transferrina e saturazione."
    ],
    "relatedGuides": [
      "ferritina",
      "sideremia",
      "transferrina-e-saturazione"
    ],
    "relatedTerms": [
      "sideremia",
      "transferrina",
      "saturazione-della-transferrina",
      "anemia"
    ]
  },
  {
    "slug": "fibrinogeno",
    "term": "Fibrinogeno",
    "aliases": [
      "fattore I"
    ],
    "definition": "Il fibrinogeno è una proteina prodotta dal fegato che, durante la coagulazione, si trasforma in fibrina e forma la rete del coagulo. Aumenta anche nelle situazioni di infiammazione.",
    "inDetail": [
      "L'unità tipica è mg/dL o g/L. Si misura sul plasma con campione prelevato in provetta con anticoagulante.",
      "Si legge con PT e aPTT per avere un quadro della coagulazione."
    ],
    "relatedGuides": [
      "fibrinogeno",
      "pt-inr",
      "aptt"
    ],
    "relatedTerms": [
      "coagulazione",
      "d-dimero",
      "plasma",
      "proteina-c-reattiva"
    ]
  },
  {
    "slug": "folati",
    "term": "Folati",
    "aliases": [
      "vitamina B9",
      "acido folico sierico"
    ],
    "definition": "I folati sono la forma naturale della vitamina B9, presente soprattutto in verdure a foglia e legumi. Servono alla produzione di DNA e di nuove cellule, comprese quelle del sangue.",
    "inDetail": [
      "Il risultato è in ng/mL o nmol/L. Può riflettere anche l'ultimo pasto, quindi conta il digiuno.",
      "Si interpreta spesso insieme a vitamina B12 e omocisteina."
    ],
    "relatedGuides": [
      "folati",
      "vitamina-b12",
      "omocisteina"
    ],
    "relatedTerms": [
      "acido-folico",
      "vitamina-b12",
      "omocisteina",
      "digiuno"
    ]
  },
  {
    "slug": "formula-leucocitaria",
    "term": "Formula leucocitaria",
    "aliases": [
      "conta differenziale",
      "formula bianca"
    ],
    "definition": "La formula leucocitaria indica quanti globuli bianchi di ciascun tipo (neutrofili, linfociti, monociti, eosinofili, basofili) sono presenti nel sangue.",
    "inDetail": [
      "Ogni tipo è riportato come percentuale sul totale e come numero assoluto (10^9/L o cellule per microlitro). Il numero assoluto è spesso più informativo.",
      "Compare dopo i globuli bianchi totali nell'emocromo."
    ],
    "relatedGuides": [
      "globuli-bianchi-e-formula-leucocitaria",
      "emocromo"
    ],
    "relatedTerms": [
      "globuli-bianchi",
      "neutrofili",
      "linfociti",
      "monociti",
      "eosinofili",
      "basofili"
    ]
  },
  {
    "slug": "fosfatasi-alcalina",
    "term": "Fosfatasi alcalina",
    "aliases": [
      "ALP",
      "ALK-P",
      "fosfatasi"
    ],
    "definition": "La fosfatasi alcalina (ALP) è un enzima presente soprattutto in fegato, vie biliari e ossa. Se ne misura l'attività nel sangue.",
    "inDetail": [
      "L'unità è U/L. Cambia con l'età: nei periodi di crescita rapida l'attività è fisiologicamente più alta.",
      "Si legge con gamma GT, bilirubina e transaminasi per capire da quale organo possa derivare."
    ],
    "relatedGuides": [
      "fosfatasi-alcalina",
      "gamma-gt",
      "transaminasi-alt-ast"
    ],
    "relatedTerms": [
      "enzima",
      "gamma-gt",
      "bilirubina",
      "alt",
      "calcio"
    ]
  },
  {
    "slug": "fosforo",
    "term": "Fosforo",
    "aliases": [
      "fosfato",
      "fosfatemia"
    ],
    "definition": "Il fosforo è un minerale presente nelle ossa e nelle cellule; nel sangue circola come fosfato. Lavora insieme al calcio ed è regolato dai reni.",
    "inDetail": [
      "L'unità è mg/dL o mmol/L. Il valore può variare con il momento della giornata e con i pasti.",
      "Si richiede spesso insieme a calcio e funzionalità renale."
    ],
    "relatedGuides": [
      "calcio",
      "creatinina"
    ],
    "relatedTerms": [
      "calcio",
      "elettroliti",
      "magnesio",
      "vitamina-d"
    ]
  },
  {
    "slug": "fsh",
    "term": "FSH (ormone follicolo-stimolante)",
    "aliases": [
      "FSH",
      "follitropina"
    ],
    "definition": "L'FSH è un ormone prodotto dall'ipofisi che stimola le ovaie nelle donne e la produzione di spermatozoi negli uomini.",
    "inDetail": [
      "L'unità è mUI/mL o UI/L. Nelle donne il valore cambia con la fase del ciclo, per questo il referto può indicare intervalli per fase.",
      "Si dosa spesso insieme a LH ed estradiolo o testosterone."
    ],
    "relatedGuides": [
      "fsh-e-lh"
    ],
    "relatedTerms": [
      "lh",
      "estradiolo",
      "testosterone",
      "ormone",
      "progesterone"
    ]
  },
  {
    "slug": "ft3",
    "term": "FT3 (triiodotironina libera)",
    "aliases": [
      "T3 libera",
      "triiodotironina libera"
    ],
    "definition": "L'FT3 è la quota di triiodotironina, un ormone tiroideo, non legata alle proteine del sangue e quindi disponibile per le cellule.",
    "inDetail": [
      "L'unità è pg/mL o pmol/L. Il metodo del laboratorio incide sull'intervallo.",
      "Si legge con TSH e FT4: da solo spiega poco della funzione della tiroide."
    ],
    "relatedGuides": [
      "ft3-triiodotironina-libera",
      "tsh",
      "ft4-tiroxina-libera"
    ],
    "relatedTerms": [
      "ft4",
      "tsh",
      "ormone",
      "tireoglobulina"
    ]
  },
  {
    "slug": "ft4",
    "term": "FT4 (tiroxina libera)",
    "aliases": [
      "T4 libera",
      "tiroxina libera"
    ],
    "definition": "L'FT4 è la quota di tiroxina, il principale ormone prodotto dalla tiroide, non legata alle proteine del sangue. È la forma attiva misurata nel sangue.",
    "inDetail": [
      "L'unità è ng/dL o pmol/L. Gli intervalli cambiano con il metodo.",
      "Si interpreta insieme al TSH, l'ormone ipofisario che regola la tiroide."
    ],
    "relatedGuides": [
      "ft4-tiroxina-libera",
      "tsh"
    ],
    "relatedTerms": [
      "tsh",
      "ft3",
      "ormone",
      "anticorpi-anti-tpo"
    ]
  },
  {
    "slug": "gamma-globuline",
    "term": "Gamma globuline",
    "aliases": [
      "frazione gamma",
      "gammaglobuline"
    ],
    "definition": "Le gamma globuline sono la frazione di proteine del sangue in cui si trovano la maggior parte degli anticorpi (immunoglobuline). Compaiono nell'elettroforesi proteica.",
    "inDetail": [
      "Nel referto sono riportate in percentuale e in g/dL come «gamma» accanto a albumina e altre globuline.",
      "Una forma particolare del tracciato in questa zona viene descritta dal laboratorio con un commento."
    ],
    "relatedGuides": [
      "proteine-totali-ed-elettroforesi"
    ],
    "relatedTerms": [
      "elettroforesi",
      "globuline",
      "immunoglobuline",
      "albumina"
    ]
  },
  {
    "slug": "gamma-gt",
    "term": "Gamma GT (gamma-glutamil transferasi)",
    "aliases": [
      "GGT",
      "gamma-glutamiltransferasi"
    ],
    "definition": "La gamma GT è un enzima presente nelle cellule del fegato e delle vie biliari. Se ne misura l'attività nel sangue come uno degli indicatori epatici.",
    "inDetail": [
      "L'unità è U/L. L'intervallo è spesso diverso fra uomini e donne.",
      "Viene letta insieme a fosfatasi alcalina, transaminasi e bilirubina."
    ],
    "relatedGuides": [
      "gamma-gt",
      "fosfatasi-alcalina",
      "transaminasi-alt-ast"
    ],
    "relatedTerms": [
      "enzima",
      "alt",
      "ast",
      "fosfatasi-alcalina",
      "bilirubina"
    ]
  },
  {
    "slug": "glicemia",
    "term": "Glicemia",
    "aliases": [
      "glucosio nel sangue",
      "glicemia a digiuno"
    ],
    "definition": "La glicemia è la concentrazione di glucosio nel sangue. Il glucosio è la principale fonte di energia delle cellule, e il suo livello varia nella giornata e con i pasti.",
    "inDetail": [
      "L'unità è mg/dL o mmol/L. La glicemia «a digiuno» richiede alcune ore senza mangiare, indicate dal laboratorio.",
      "Un singolo valore fotografa un momento; per l'andamento nel tempo si usa l'emoglobina glicata."
    ],
    "relatedGuides": [
      "glicemia",
      "emoglobina-glicata",
      "curva-da-carico-di-glucosio"
    ],
    "relatedTerms": [
      "glucosio",
      "digiuno",
      "emoglobina-glicata",
      "insulina",
      "glicosuria"
    ]
  },
  {
    "slug": "glicosuria",
    "term": "Glicosuria",
    "aliases": [
      "glucosio nelle urine"
    ],
    "definition": "La glicosuria è la presenza di glucosio nelle urine. Si cerca con la striscia reattiva dell'esame delle urine.",
    "inDetail": [
      "Sul referto compare come «glucosio» con esito assente/presente o a scala. Alcune strisce danno risultato in mg/dL.",
      "Il risultato dipende anche da quando si è mangiato prima della raccolta."
    ],
    "relatedGuides": [
      "esame-delle-urine",
      "glicemia"
    ],
    "relatedTerms": [
      "glicemia",
      "glucosio",
      "esame-delle-urine",
      "chetoni"
    ]
  },
  {
    "slug": "globuli-bianchi",
    "term": "Globuli bianchi",
    "aliases": [
      "WBC",
      "leucociti"
    ],
    "definition": "I globuli bianchi sono le cellule del sangue che fanno parte del sistema immunitario. Ne esistono cinque tipi principali, contati nella formula leucocitaria.",
    "inDetail": [
      "Il totale si esprime in 10^9/L o in cellule per microlitro, e varia con età, ora del giorno e stato generale.",
      "L'attenzione va al totale e alla ripartizione tra i vari tipi."
    ],
    "relatedGuides": [
      "globuli-bianchi-e-formula-leucocitaria",
      "emocromo"
    ],
    "relatedTerms": [
      "leucociti",
      "formula-leucocitaria",
      "neutrofili",
      "linfociti",
      "cellule-per-microlitro"
    ]
  },
  {
    "slug": "globuli-rossi",
    "term": "Globuli rossi",
    "aliases": [
      "RBC",
      "eritrociti",
      "emazie"
    ],
    "definition": "I globuli rossi sono le cellule più numerose del sangue. Contengono emoglobina e trasportano ossigeno dai polmoni ai tessuti.",
    "inDetail": [
      "Il numero si esprime in 10^12/L (o milioni per microlitro). Le dimensioni e il contenuto sono descritti da MCV, MCH, MCHC e RDW.",
      "Sono contati nell'emocromo insieme a emoglobina ed ematocrito."
    ],
    "relatedGuides": [
      "globuli-rossi",
      "emocromo",
      "mcv-volume-corpuscolare-medio"
    ],
    "relatedTerms": [
      "eritrociti",
      "emoglobina",
      "ematocrito",
      "mcv",
      "rdw",
      "reticolociti"
    ]
  },
  {
    "slug": "globuline",
    "term": "Globuline",
    "aliases": [
      "frazioni globuliniche"
    ],
    "definition": "Le globuline sono un gruppo di proteine del sangue diverse dall'albumina: comprendono, fra le altre, proteine di trasporto e le immunoglobuline.",
    "inDetail": [
      "Nel referto spesso non sono indicate direttamente: si ricavano sottraendo l'albumina dalle proteine totali, o dall'elettroforesi.",
      "Il rapporto albumina/globuline può comparire come valore calcolato."
    ],
    "relatedGuides": [
      "proteine-totali-ed-elettroforesi",
      "albumina"
    ],
    "relatedTerms": [
      "proteine-totali",
      "albumina",
      "gamma-globuline",
      "elettroforesi",
      "immunoglobuline"
    ]
  },
  {
    "slug": "glucosio",
    "term": "Glucosio",
    "aliases": [
      "zucchero nel sangue"
    ],
    "definition": "Il glucosio è uno zucchero semplice, la principale fonte di energia delle cellule. Nel referto lo trovi come glicemia (nel sangue) o come glicosuria (nelle urine).",
    "inDetail": [
      "Nel sangue si misura in mg/dL o mmol/L; per passare da una unità all'altra serve un fattore di conversione.",
      "Il livello cambia con i pasti: per questo molti esami richiedono il digiuno."
    ],
    "relatedGuides": [
      "glicemia",
      "unita-di-misura-nei-referti"
    ],
    "relatedTerms": [
      "glicemia",
      "glicosuria",
      "insulina",
      "emoglobina-glicata",
      "digiuno"
    ]
  },
];

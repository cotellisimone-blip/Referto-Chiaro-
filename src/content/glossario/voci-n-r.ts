import type { GlossaryEntry } from "./schema";

/** Voci del glossario, lettere n-r. Bozze da revisione medica. */
export const GLOSSARIO_N_R: GlossaryEntry[] = [
  {
    "slug": "neutrofili",
    "term": "Neutrofili",
    "aliases": [
      "granulociti neutrofili"
    ],
    "definition": "I neutrofili sono il tipo più numeroso di globuli bianchi. Sono tra le prime cellule a intervenire contro batteri e altri germi.",
    "inDetail": [
      "Nella formula leucocitaria sono in percentuale e come numero assoluto (10^9/L o cellule per microlitro).",
      "Il numero assoluto è spesso più utile della percentuale."
    ],
    "relatedGuides": [
      "globuli-bianchi-e-formula-leucocitaria"
    ],
    "relatedTerms": [
      "globuli-bianchi",
      "formula-leucocitaria",
      "linfociti",
      "cellule-per-microlitro"
    ]
  },
  {
    "slug": "nitriti-urinari",
    "term": "Nitriti urinari",
    "aliases": [
      "nitriti"
    ],
    "definition": "I nitriti nelle urine sono sostanze che si formano quando alcuni batteri trasformano i nitrati presenti nelle urine. Si cercano con la striscia reattiva.",
    "inDetail": [
      "Il risultato è presente/assente. Il campione dovrebbe essere raccolto con cura e non lasciato a lungo prima dell'analisi.",
      "Una risposta assente non esclude che ci siano batteri: il medico la legge con le altre voci."
    ],
    "relatedGuides": [
      "esame-delle-urine"
    ],
    "relatedTerms": [
      "esame-delle-urine",
      "leucociti",
      "sedimento-urinario",
      "ph-urinario"
    ]
  },
  {
    "slug": "omocisteina",
    "term": "Omocisteina",
    "aliases": [
      "Hcy",
      "omocisteinemia"
    ],
    "definition": "L'omocisteina è un aminoacido che si forma durante il metabolismo di un altro aminoacido, la metionina. Per essere smaltita servono vitamina B12, folati e vitamina B6.",
    "inDetail": [
      "L'unità è µmol/L. Il valore è sensibile al digiuno e alla conservazione del campione, che va separato in fretta.",
      "Si interpreta con vitamina B12 e folati."
    ],
    "relatedGuides": [
      "omocisteina",
      "vitamina-b12",
      "folati"
    ],
    "relatedTerms": [
      "vitamina-b12",
      "folati",
      "acido-folico",
      "digiuno"
    ]
  },
  {
    "slug": "ormone",
    "term": "Ormone",
    "aliases": [
      "ormoni"
    ],
    "definition": "Un ormone è una sostanza prodotta da una ghiandola che, trasportata dal sangue, regola funzioni di altri organi: metabolismo, crescita, riproduzione, risposta allo stress.",
    "inDetail": [
      "Molti ormoni variano durante la giornata, il mese o la vita. Orario del prelievo e fase del ciclo possono essere indicati nel referto.",
      "I laboratori usano metodi diversi, per questo gli intervalli non coincidono."
    ],
    "relatedGuides": [
      "tsh",
      "cortisolo",
      "testosterone"
    ],
    "relatedTerms": [
      "ritmo-circadiano",
      "tsh",
      "cortisolo",
      "insulina",
      "fsh"
    ]
  },
  {
    "slug": "peptide-c",
    "term": "Peptide C",
    "aliases": [
      "C-peptide",
      "peptide connettore"
    ],
    "definition": "Il peptide C è un frammento che si libera quando il pancreas produce insulina. Ne viene prodotta una quantità equivalente, quindi il suo livello riflette la produzione di insulina.",
    "inDetail": [
      "L'unità è ng/mL o nmol/L. È più stabile dell'insulina e dura più a lungo nel sangue.",
      "Viene interpretato con glicemia e insulina."
    ],
    "relatedGuides": [
      "peptide-c",
      "insulinemia",
      "glicemia"
    ],
    "relatedTerms": [
      "insulina",
      "glicemia",
      "ormone",
      "digiuno"
    ]
  },
  {
    "slug": "ph-urinario",
    "term": "pH urinario",
    "aliases": [
      "pH delle urine"
    ],
    "definition": "Il pH urinario misura quanto sono acide o alcaline le urine. Cambia nel corso della giornata e con alimentazione e idratazione.",
    "inDetail": [
      "Nell'esame delle urine è un numero indicativamente tra 5 e 8, letto con la striscia reattiva.",
      "Un campione lasciato a lungo prima dell'analisi può cambiare pH."
    ],
    "relatedGuides": [
      "esame-delle-urine"
    ],
    "relatedTerms": [
      "esame-delle-urine",
      "densita-urinaria",
      "sedimento-urinario",
      "nitriti-urinari"
    ]
  },
  {
    "slug": "piastrine",
    "term": "Piastrine",
    "aliases": [
      "PLT",
      "trombociti"
    ],
    "definition": "Le piastrine sono frammenti di cellule che circolano nel sangue e aiutano a chiudere le lesioni dei vasi formando un tappo e avviando la coagulazione.",
    "inDetail": [
      "Il numero si esprime in 10^9/L o migliaia per microlitro.",
      "A volte il conteggio automatico risulta diverso a causa di aggregati nella provetta; il laboratorio può ripetere l'analisi su un altro campione."
    ],
    "relatedGuides": [
      "piastrine",
      "emocromo"
    ],
    "relatedTerms": [
      "mpv",
      "coagulazione",
      "emocromo",
      "globuli-rossi"
    ]
  },
  {
    "slug": "plasma",
    "term": "Plasma",
    "aliases": [
      "plasma sanguigno"
    ],
    "definition": "Il plasma è la parte liquida del sangue, ottenuta eliminando le cellule con la centrifuga. Contiene acqua, proteine, sali e molte altre sostanze.",
    "inDetail": [
      "Per alcuni esami (coagulazione) il campione è plasma, ottenuto da una provetta con anticoagulante.",
      "Il siero è simile ma privo dei fattori della coagulazione."
    ],
    "relatedGuides": [
      "pt-inr",
      "aptt"
    ],
    "relatedTerms": [
      "siero",
      "coagulazione",
      "fibrinogeno",
      "campione"
    ]
  },
  {
    "slug": "potassio",
    "term": "Potassio",
    "aliases": [
      "potassiemia",
      "K"
    ],
    "definition": "Il potassio è un minerale che si trova soprattutto dentro le cellule. Quello presente nel sangue è importante per il funzionamento di muscoli e cuore.",
    "inDetail": [
      "L'unità è mmol/L (o mEq/L). Una provetta lasciata a lungo o con globuli rossi rotti può far risultare il valore più alto.",
      "I reni regolano il potassio: si legge con la creatinina."
    ],
    "relatedGuides": [
      "potassio",
      "sodio",
      "creatinina"
    ],
    "relatedTerms": [
      "sodio",
      "elettroliti",
      "emolisi",
      "cloro",
      "magnesio"
    ]
  },
  {
    "slug": "prelievo",
    "term": "Prelievo di sangue",
    "aliases": [
      "prelievo venoso",
      "prelievo ematico"
    ],
    "definition": "Il prelievo è la raccolta di una piccola quantità di sangue, di solito da una vena del braccio, in provette diverse a seconda degli esami richiesti.",
    "inDetail": [
      "Il laboratorio indica le regole di preparazione: digiuno, orario, sospensioni concordate con il medico.",
      "La procedura (posizione, tempo del laccio emostatico) può incidere su alcuni risultati."
    ],
    "relatedGuides": [
      "prima-del-prelievo",
      "perche-i-valori-cambiano"
    ],
    "relatedTerms": [
      "digiuno",
      "campione",
      "emolisi",
      "siero"
    ]
  },
  {
    "slug": "procalcitonina",
    "term": "Procalcitonina",
    "aliases": [
      "PCT"
    ],
    "definition": "La procalcitonina è una proteina precursore di un ormone, prodotta in quantità maggiori in presenza di alcune infezioni. Si misura nel sangue.",
    "inDetail": [
      "L'unità è ng/mL o µg/L. Si richiede in contesti clinici specifici, spesso in ospedale.",
      "Il risultato si interpreta con quadro clinico e altri esami."
    ],
    "relatedGuides": [
      "procalcitonina",
      "pcr-proteina-c-reattiva"
    ],
    "relatedTerms": [
      "proteina-c-reattiva",
      "marcatore",
      "ves"
    ]
  },
  {
    "slug": "progesterone",
    "term": "Progesterone",
    "aliases": [
      "P4"
    ],
    "definition": "Il progesterone è un ormone prodotto soprattutto dalle ovaie dopo l'ovulazione e, in gravidanza, dalla placenta. Prepara l'utero e ne sostiene la funzione.",
    "inDetail": [
      "L'unità è ng/mL o nmol/L. Il valore dipende dalla fase del ciclo: il referto indica spesso intervalli per fase.",
      "Per confrontare risultati serve conoscere il giorno del ciclo del prelievo."
    ],
    "relatedGuides": [
      "fsh-e-lh"
    ],
    "relatedTerms": [
      "estradiolo",
      "lh",
      "fsh",
      "ormone"
    ]
  },
  {
    "slug": "prolattina",
    "term": "Prolattina",
    "aliases": [
      "PRL"
    ],
    "definition": "La prolattina è un ormone prodotto dall'ipofisi. Stimola la produzione di latte dopo il parto, ma è presente anche in chi non allatta.",
    "inDetail": [
      "L'unità è ng/mL o mUI/L. Stress, sonno e perfino il prelievo stesso possono modificarla, quindi a volte si ripete.",
      "Anche il momento della giornata in cui si fa il prelievo può incidere sul risultato."
    ],
    "relatedGuides": [
      "prolattina",
      "prima-del-prelievo"
    ],
    "relatedTerms": [
      "ormone",
      "ritmo-circadiano",
      "prelievo"
    ]
  },
  {
    "slug": "proteina-c-reattiva",
    "term": "Proteina C reattiva",
    "aliases": [
      "PCR",
      "CRP"
    ],
    "definition": "La proteina C reattiva (PCR) è una proteina prodotta dal fegato che aumenta nel sangue in presenza di infiammazione. Si misura con un prelievo.",
    "inDetail": [
      "L'unità è mg/L o mg/dL: controlla bene quale, perché i numeri sono molto diversi. Esiste anche una versione «ad alta sensibilità» con scala propria.",
      "Aumenta in molte situazioni diverse e il valore da solo non indica la causa."
    ],
    "relatedGuides": [
      "pcr-proteina-c-reattiva",
      "ves"
    ],
    "relatedTerms": [
      "ves",
      "procalcitonina",
      "fibrinogeno",
      "marcatore"
    ]
  },
  {
    "slug": "proteine-totali",
    "term": "Proteine totali",
    "aliases": [
      "proteinemia"
    ],
    "definition": "Le proteine totali sono la quantità complessiva di proteine nel siero, soprattutto albumina e globuline.",
    "inDetail": [
      "L'unità è g/dL o g/L. Va letta con albumina ed elettroforesi, che le suddividono.",
      "Il valore risente della quantità di liquidi nel corpo."
    ],
    "relatedGuides": [
      "proteine-totali-ed-elettroforesi",
      "albumina"
    ],
    "relatedTerms": [
      "albumina",
      "globuline",
      "elettroforesi",
      "siero"
    ]
  },
  {
    "slug": "proteinuria",
    "term": "Proteinuria",
    "aliases": [
      "proteine nelle urine"
    ],
    "definition": "La proteinuria è la presenza di proteine nelle urine. Nell'esame standard si cerca con la striscia reattiva, mentre per quantità piccole si usano esami più sensibili.",
    "inDetail": [
      "Sul referto è espressa come assente/tracce/croci oppure in mg/dL o mg/24 h.",
      "Sforzo, febbre e urine molto concentrate possono influire sul risultato."
    ],
    "relatedGuides": [
      "esame-delle-urine",
      "microalbuminuria"
    ],
    "relatedTerms": [
      "microalbuminuria",
      "albumina",
      "esame-delle-urine",
      "rapporto-albumina-creatinina"
    ]
  },
  {
    "slug": "psa",
    "term": "PSA (antigene prostatico specifico)",
    "aliases": [
      "PSA",
      "antigene prostatico"
    ],
    "definition": "Il PSA è una proteina prodotta dalle cellule della prostata. Una piccola quota passa nel sangue e può essere misurata.",
    "inDetail": [
      "L'unità è ng/mL. Esiste il PSA totale e quello libero, riportati con un rapporto.",
      "Il valore cambia con età, volume della prostata e alcuni fattori recenti, come uno sforzo in bicicletta o un esame urologico."
    ],
    "relatedGuides": [
      "psa"
    ],
    "relatedTerms": [
      "antigene",
      "marcatore",
      "testosterone"
    ]
  },
  {
    "slug": "pt-tempo-di-protrombina",
    "term": "PT (tempo di protrombina)",
    "aliases": [
      "PT",
      "tempo di Quick",
      "Quick"
    ],
    "definition": "Il PT è un test di coagulazione che misura in secondi quanto tempo impiega il plasma a coagulare dopo l'aggiunta di reagenti. Esplora la via estrinseca della coagulazione.",
    "inDetail": [
      "Il risultato è espresso in secondi, come percentuale di attività e come INR.",
      "Reagenti diversi danno tempi diversi; l'INR serve proprio a renderli confrontabili."
    ],
    "relatedGuides": [
      "pt-inr",
      "aptt"
    ],
    "relatedTerms": [
      "inr",
      "aptt",
      "coagulazione",
      "plasma"
    ]
  },
  {
    "slug": "rapporto-albumina-creatinina",
    "term": "Rapporto albumina/creatinina",
    "aliases": [
      "ACR",
      "UACR"
    ],
    "definition": "È il rapporto fra l'albumina e la creatinina misurate in un campione di urina. Serve a stimare la perdita di albumina compensando la concentrazione delle urine.",
    "inDetail": [
      "L'unità è mg/g o mg/mmol. Si usa spesso un campione del mattino, evitando sforzi nelle ore precedenti.",
      "Più misure ripetute aiutano a valutarne l'andamento."
    ],
    "relatedGuides": [
      "microalbuminuria",
      "creatinina"
    ],
    "relatedTerms": [
      "microalbuminuria",
      "albumina",
      "creatinina",
      "proteinuria"
    ]
  },
  {
    "slug": "rdw",
    "term": "RDW (ampiezza di distribuzione dei globuli rossi)",
    "aliases": [
      "RDW",
      "anisocitosi"
    ],
    "definition": "L'RDW indica quanto i globuli rossi sono diversi fra loro per dimensione. Viene calcolato dallo strumento nell'emocromo.",
    "inDetail": [
      "Si esprime in percentuale (RDW-CV) o in fL (RDW-SD).",
      "Si legge con MCV, che indica la dimensione media."
    ],
    "relatedGuides": [
      "rdw",
      "mcv-volume-corpuscolare-medio"
    ],
    "relatedTerms": [
      "mcv",
      "globuli-rossi",
      "emocromo",
      "mch"
    ]
  },
  {
    "slug": "referto",
    "term": "Referto",
    "aliases": [
      "referto di laboratorio",
      "esito"
    ],
    "definition": "Il referto è il documento con cui il laboratorio comunica i risultati degli esami. Riporta dati del campione, risultati, unità di misura e intervalli di riferimento.",
    "inDetail": [
      "Controlla che i dati personali, la data del prelievo e il tipo di campione siano quelli corretti.",
      "Eventuali note del laboratorio, per esempio su un campione non idoneo, vanno lette con attenzione."
    ],
    "relatedGuides": [
      "come-leggere-un-referto-di-laboratorio",
      "cosa-chiedere-al-medico"
    ],
    "relatedTerms": [
      "intervallo-di-riferimento",
      "unita-di-misura",
      "campione",
      "valore-critico"
    ]
  },
  {
    "slug": "reticolociti",
    "term": "Reticolociti",
    "aliases": [
      "reticolociti"
    ],
    "definition": "I reticolociti sono globuli rossi giovani, appena usciti dal midollo osseo. Il loro numero indica quanto velocemente il midollo ne produce di nuovi.",
    "inDetail": [
      "Sono riportati in percentuale e in numero assoluto (10^9/L). Fanno parte di un emocromo con reticolociti.",
      "Si leggono con emoglobina e globuli rossi."
    ],
    "relatedGuides": [
      "emocromo",
      "globuli-rossi"
    ],
    "relatedTerms": [
      "globuli-rossi",
      "eritrociti",
      "emoglobina",
      "mcv"
    ]
  },
  {
    "slug": "ritmo-circadiano",
    "term": "Ritmo circadiano",
    "aliases": [
      "ritmo sonno-veglia",
      "variazione giornaliera"
    ],
    "definition": "Il ritmo circadiano è il ciclo di circa 24 ore che regola molte funzioni dell'organismo. Alcuni ormoni e altre sostanze ne seguono l'andamento.",
    "inDetail": [
      "Per questo alcuni esami, come cortisolo e prolattina, vanno eseguiti a un'ora precisa. L'orario del prelievo è utile nel referto.",
      "Anche ferro e potassio possono variare nella giornata."
    ],
    "relatedGuides": [
      "prima-del-prelievo",
      "perche-i-valori-cambiano"
    ],
    "relatedTerms": [
      "cortisolo",
      "ormone",
      "prolattina",
      "variabilita-biologica"
    ]
  },
];

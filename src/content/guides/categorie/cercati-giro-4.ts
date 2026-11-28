import type { Guide } from "../schema";

/**
 * 19/11/2026 (quarto giro, punto 4): sei esami che si cercano e che non avevano una guida (ricerca del sito senza
 * risultati per CEA, CA 125, fattore reumatoide, ANA, Helicobacter, calprotectina, radiografia del torace, ecografia
 * della tiroide). Come tutte le guide cliniche sono BOZZE in attesa di revisione medica: restano fuori dai motori di
 * ricerca. Fonti lette il 19/11/2026 (MedlinePlus e NHS); il testo non aggiunge niente che le fonti non dicano.
 */
export const GUIDE_CERCATI_GIRO_4: Guide[] = [
  {
    slug: "marcatori-tumorali",
    title: "Marcatori tumorali (CEA, CA 125, CA 19-9): come leggerli",
    metaDescription: "CEA, CA 125 e CA 19-9: che cosa sono i marcatori tumorali, perché un valore sopra l'intervallo non basta a dire nulla e che cosa chiedere al medico.",
    category: "ormoni",
    examName: "Marcatori tumorali",
    aliases: ["CEA", "CA 125", "CA 19-9", "CA 15-3", "marker tumorali", "antigene carcinoembrionario", "marcatori"],
    summary: "I marcatori tumorali sono sostanze misurate nel sangue che il medico usa soprattutto per seguire nel tempo una malattia già nota. Da soli non bastano per dire se c'è un tumore: anche condizioni non tumorali possono farli salire.",
    sections: {
      whatItMeasures: [
        "Un marcatore tumorale è una sostanza che può essere prodotta dalle cellule di un tumore, oppure da cellule sane in risposta al tumore. Si misura di solito nel sangue. CEA, CA 125 e CA 19-9 sono tre dei più richiesti; ognuno è collegato ad alcuni tipi di tumore, ma nessuno è specifico di uno solo.",
        "Non tutti i tumori hanno un marcatore conosciuto, e una persona con un tumore può avere valori nell'intervallo: per questo un singolo numero non basta a dire che cosa sta succedendo.",
      ],
      whyRequested: [
        "Il medico li richiede soprattutto dopo una diagnosi: per seguire come va una cura (valori che scendono nel tempo di solito accompagnano una cura che funziona) e per i controlli dopo la fine delle terapie. Come esame per chi non ha sintomi hanno un ruolo limitato, riservato a situazioni particolari decise dal medico.",
      ],
      howToRead: [
        "Accanto al numero il laboratorio stampa un intervallo o una soglia, che dipende dal metodo usato. Due laboratori diversi possono dare numeri diversi per lo stesso campione: per confrontare valori nel tempo conviene, quando possibile, usare lo stesso laboratorio.",
        "Un numero sopra la soglia non vuol dire avere un tumore: anche condizioni non tumorali possono farlo salire, e l'esame non dice da dove viene la sostanza misurata. Per il medico conta soprattutto come cambia il valore da un prelievo all'altro, insieme alla visita e agli altri esami.",
      ],
      factors: [
        "Metodo e laboratorio usati: le soglie non sono intercambiabili.",
        "Condizioni non tumorali che possono far salire alcuni marcatori, che il medico conosce.",
        "Per CA 125: il momento del ciclo mestruale.",
        "Per gli esami sulle urine: mestruazioni o emorroidi che sanguinano, da dire a chi esegue il prelievo.",
        "Il confronto con i valori precedenti della stessa persona.",
      ],
    },
    unitsAndRanges: {
      commonUnits: ["ng/mL", "µg/L", "U/mL", "kU/L"],
      rangeNote: "Il CEA è di solito espresso in ng/mL (o µg/L, che è lo stesso numero); CA 125 e CA 19-9 in U/mL (o kU/L). Il valore si confronta solo con la soglia stampata dallo stesso laboratorio, e per seguire l'andamento conta il confronto con i prelievi precedenti.",
    },
    questionsForDoctor: [
      "Per quale motivo ha richiesto questo marcatore nel mio caso?",
      "Il mio valore va confrontato con un prelievo precedente? Quando conviene ripeterlo?",
      "Ci sono condizioni, diverse da un tumore, che possono averlo fatto salire?",
      "Conviene rifarlo nello stesso laboratorio per poter confrontare i numeri?",
      "Quali altri esami servono per capire il risultato?",
    ],
    faq: [
      { q: "Un marcatore sopra l'intervallo vuol dire che ho un tumore?", a: "No. Anche condizioni non tumorali possono farlo salire, e l'esame non dice da dove viene la sostanza misurata. Che cosa significa per te lo valuta il medico, insieme alla visita e agli altri esami." },
      { q: "Un valore nell'intervallo esclude un tumore?", a: "No: alcune persone con un tumore non producono quantità alte del marcatore. Per questo i marcatori si usano soprattutto per seguire nel tempo una situazione già nota." },
      { q: "Posso confrontare valori di laboratori diversi?", a: "Con cautela: metodi diversi danno numeri diversi per lo stesso campione. Quando possibile, per seguire l'andamento si usa lo stesso laboratorio." },
    ],
    relatedGuides: ["psa", "intervalli-di-riferimento", "perche-i-valori-cambiano", "cosa-chiedere-al-medico"],
    glossaryTerms: ["marcatore", "antigene", "metodo-analitico", "intervallo-di-riferimento", "siero"],
    sources: [
      { title: "Tumor Marker Tests — MedlinePlus", url: "https://medlineplus.gov/lab-tests/tumor-marker-tests/" },
      { title: "CA-125 Blood Test (Ovarian Cancer) — MedlinePlus", url: "https://medlineplus.gov/lab-tests/ca-125-blood-test-ovarian-cancer/" },
      { title: "CA 19-9 Blood Test (Pancreatic Cancer) — MedlinePlus", url: "https://medlineplus.gov/lab-tests/ca-19-9-blood-test-pancreatic-cancer/" },
    ],
    lastUpdated: "2026-11-19",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "fattore-reumatoide-e-ana",
    title: "Fattore reumatoide e ANA: come leggere il referto",
    metaDescription: "Fattore reumatoide (FR, Reuma test) e anticorpi antinucleo (ANA): che cosa cercano, perché un positivo da solo non basta, che cosa chiedere al medico.",
    category: "infiammazione",
    examName: "Fattore reumatoide e ANA",
    aliases: ["fattore reumatoide", "FR", "Reuma test", "RF", "ANA", "anticorpi antinucleo", "anticorpi anti nucleo", "autoanticorpi"],
    summary: "Fattore reumatoide e ANA sono anticorpi che il sistema immunitario a volte produce contro le cellule dell'organismo. Aiutano il medico insieme ai sintomi e ad altri esami: un positivo da solo non basta, e si trova anche in persone sane.",
    sections: {
      whatItMeasures: [
        "Il fattore reumatoide (FR o «Reuma test») è un anticorpo rivolto contro altri anticorpi dell'organismo. Si cerca con un normale prelievo di sangue, e sul referto può essere scritto anche RF.",
        "Gli ANA (anticorpi antinucleo) sono anticorpi rivolti contro il nucleo delle cellule dell'organismo. Averne pochi è comune; il laboratorio dice se ne trova abbastanza da considerare l'esame positivo.",
      ],
      whyRequested: [
        "Il medico li richiede quando cerca di capire la causa di sintomi come dolori o gonfiore alle articolazioni, rigidità, stanchezza prolungata, febbre o eruzioni della pelle. Servono, insieme ad altri esami, per valutare le malattie autoimmuni, in cui il sistema immunitario si rivolge contro l'organismo stesso.",
      ],
      howToRead: [
        "Il fattore reumatoide è spesso riportato come «positivo» o «negativo», a volte con un numero e la soglia del laboratorio accanto. Gli ANA possono essere scritti come positivo o negativo, oppure con una diluizione (per esempio 1:80 o 1:160) e la descrizione dell'aspetto visto al microscopio: queste sigle le spiega il medico.",
        "Un risultato positivo non basta da solo: anche persone sane possono avere questi anticorpi, e gli ANA diventano più frequenti con l'età. Un risultato negativo non esclude una malattia autoimmune. Il medico legge l'esito insieme ai sintomi, alla visita e agli altri esami.",
      ],
      factors: [
        "Età: con gli anni è più frequente trovare ANA, anche senza malattie.",
        "Alcuni farmaci, che possono far comparire anticorpi antinucleo: dillo al medico, senza sospenderli da solo.",
        "Infezioni virali recenti, che a volte rendono positivo l'esame per un periodo.",
        "Metodo del laboratorio e soglia usata per dire «positivo».",
        "Infezioni di lunga durata, che possono far salire il fattore reumatoide.",
      ],
    },
    unitsAndRanges: {
      commonUnits: ["positivo / negativo", "UI/mL", "1:80, 1:160…"],
      rangeNote: "Il fattore reumatoide può essere espresso in UI/mL con la soglia del laboratorio, oppure solo come positivo o negativo. Gli ANA si riportano spesso come diluizione: più è alto il secondo numero (1:320 rispetto a 1:80), più anticorpi sono stati trovati. Le soglie dipendono dal laboratorio.",
    },
    questionsForDoctor: [
      "Per quale motivo ha richiesto questi esami nel mio caso?",
      "Che cosa vogliono dire la diluizione e l'aspetto scritti accanto agli ANA?",
      "I farmaci che prendo possono aver influito sul risultato?",
      "Servono altri esami per capire il risultato?",
      "Conviene ripetere l'esame più avanti?",
    ],
    faq: [
      { q: "Ho gli ANA positivi: vuol dire che ho una malattia autoimmune?", a: "Non necessariamente. Anche persone sane possono avere ANA positivi, soprattutto con l'età, e alcuni farmaci o un'infezione recente possono farli comparire. Il medico legge l'esito insieme ai sintomi e ad altri esami." },
      { q: "Il fattore reumatoide negativo esclude l'artrite reumatoide?", a: "No: alcune persone con artrite reumatoide hanno poco o niente fattore reumatoide. Se i sintomi continuano, il medico può richiedere altri esami." },
      { q: "Serve il digiuno?", a: "Di solito no: è un normale prelievo di sangue. Segui comunque le istruzioni del laboratorio, che possono valere per altri esami richiesti insieme." },
    ],
    relatedGuides: ["pcr-proteina-c-reattiva", "ves", "emocromo", "cosa-chiedere-al-medico"],
    glossaryTerms: ["autoanticorpi", "anticorpi", "immunoglobuline", "unita-internazionali", "metodo-analitico"],
    sources: [
      { title: "Rheumatoid Factor (RF) Test — MedlinePlus", url: "https://medlineplus.gov/lab-tests/rheumatoid-factor-rf-test/" },
      { title: "ANA (Antinuclear Antibody) Test — MedlinePlus", url: "https://medlineplus.gov/lab-tests/ana-antinuclear-antibody-test/" },
      { title: "Autoantibody Testing — MedlinePlus", url: "https://medlineplus.gov/lab-tests/autoantibody-testing/" },
    ],
    lastUpdated: "2026-11-19",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "helicobacter-pylori",
    title: "Helicobacter pylori: i test e come leggere l'esito",
    metaDescription: "Helicobacter pylori: breath test, ricerca nelle feci, esame del sangue e biopsia. Come prepararsi, che cosa vuol dire positivo o negativo, cosa chiedere.",
    category: "ormoni",
    examName: "Helicobacter pylori",
    aliases: ["Helicobacter", "H. pylori", "breath test", "urea breath test", "antigene fecale helicobacter", "helicobacter feci"],
    summary: "L'Helicobacter pylori è un batterio che può vivere nello stomaco. Si cerca con il breath test, con un campione di feci, più raramente con il sangue o con una biopsia durante la gastroscopia. Ogni test ha la sua preparazione.",
    sections: {
      whatItMeasures: [
        "I test cercano il batterio Helicobacter pylori in modi diversi. Il breath test (test del respiro) misura nell'aria espirata una sostanza che il batterio produce dopo che hai bevuto una soluzione con urea marcata. La ricerca nelle feci cerca pezzetti del batterio (antigeni) o il suo materiale genetico.",
        "L'esame del sangue cerca gli anticorpi contro il batterio: non distingue un'infezione in corso da una passata, per questo oggi si usa poco. La biopsia è un piccolo campione di tessuto preso durante la gastroscopia.",
      ],
      whyRequested: [
        "Il medico lo richiede quando cerca la causa di disturbi dello stomaco, per esempio bruciore o dolore nella parte alta della pancia, e quando ci sono ulcere. Dopo una cura, spesso si ripete il test per controllare che il batterio non ci sia più.",
      ],
      howToRead: [
        "L'esito è di solito scritto come «positivo» o «negativo». Positivo al breath test o alla ricerca nelle feci vuol dire di solito che il batterio è presente in quel momento; positivo all'esame del sangue può dipendere anche da un'infezione del passato.",
        "Negativo vuol dire che il batterio non è stato trovato. Se nei giorni prima hai preso alcuni farmaci, il test può risultare negativo anche se il batterio c'è: per questo la preparazione conta. Che cosa fare dopo lo decide il medico.",
      ],
      factors: [
        "Farmaci per lo stomaco (inibitori di pompa), antibiotici e prodotti a base di bismuto nelle settimane prima: il medico dice se e quando sospenderli.",
        "Per il breath test: il digiuno di alcune ore richiesto dal laboratorio.",
        "Tipo di test usato: sangue, feci, respiro o biopsia non danno la stessa informazione.",
        "Tempo trascorso dalla fine di una cura, quando il test serve da controllo.",
        "Campione di feci raccolto o conservato in modo diverso dalle istruzioni.",
      ],
    },
    unitsAndRanges: {
      commonUnits: ["positivo / negativo", "indice"],
      rangeNote: "Di solito l'esito è positivo o negativo. Alcuni laboratori riportano anche un valore o un indice con la soglia accanto: si confronta solo con la soglia stampata sullo stesso referto, perché dipende dal metodo.",
    },
    questionsForDoctor: [
      "Quale test è stato usato e che cosa dice nel mio caso?",
      "Devo sospendere qualche farmaco prima del test? Per quanto tempo?",
      "Se l'esito è positivo, che cosa succede dopo?",
      "Dopo la cura, quando va ripetuto il test di controllo?",
      "I miei familiari devono fare qualche controllo?",
    ],
    faq: [
      { q: "Come si fa il breath test?", a: "Si soffia in un contenitore, poi si beve una soluzione con urea marcata e dopo alcuni minuti si soffia di nuovo. Il laboratorio confronta i due campioni d'aria. Di solito si chiede di arrivare a digiuno da alcune ore." },
      { q: "Perché mi hanno detto di sospendere dei farmaci prima del test?", a: "Alcuni farmaci per lo stomaco, gli antibiotici e i prodotti con bismuto possono rendere il test negativo anche se il batterio c'è. Quali e per quanto tempo lo indica il medico: non sospendere nulla da solo." },
      { q: "Positivo all'esame del sangue vuol dire che ho l'infezione adesso?", a: "Non per forza: gli anticorpi possono restare anche dopo un'infezione passata. Per questo il medico preferisce spesso il breath test o la ricerca nelle feci." },
    ],
    relatedGuides: ["gastroscopia", "sangue-occulto-nelle-feci", "cosa-chiedere-al-medico"],
    glossaryTerms: ["antigene", "anticorpi", "campione", "referto"],
    sources: [
      { title: "Helicobacter pylori (H. pylori) Tests — MedlinePlus", url: "https://medlineplus.gov/lab-tests/helicobacter-pylori-h-pylori-tests/" },
      { title: "Helicobacter pylori — Leeds Teaching Hospitals NHS Trust", url: "https://www.leedsth.nhs.uk/services/pathology/tests/helicobacter-pylori/" },
    ],
    lastUpdated: "2026-11-19",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "calprotectina-fecale",
    title: "Calprotectina fecale: come si raccoglie e come leggerla",
    metaDescription: "La calprotectina nelle feci misura l'infiammazione dell'intestino. Come raccogliere il campione, che cosa vuol dire il numero, che cosa chiedere al medico.",
    category: "infiammazione",
    examName: "Calprotectina fecale",
    aliases: ["calprotectina", "calprotectina feci", "calprotectina fecale", "esame delle feci infiammazione"],
    summary: "La calprotectina è una proteina che alcuni globuli bianchi rilasciano nell'intestino quando c'è infiammazione. Si misura in un campione di feci e aiuta il medico a capire se i disturbi intestinali vengono da un'infiammazione.",
    sections: {
      whatItMeasures: [
        "La calprotectina è una proteina contenuta nei neutrofili, un tipo di globuli bianchi. Quando l'intestino è infiammato i neutrofili arrivano nella parete dell'intestino e la calprotectina passa nelle feci. Piccole quantità sono comuni; quantità maggiori accompagnano l'infiammazione.",
      ],
      whyRequested: [
        "Il medico la richiede quando ci sono disturbi intestinali che durano, come diarrea o dolore alla pancia, per distinguere i disturbi con infiammazione dell'intestino da quelli senza infiammazione. Nelle persone con una malattia infiammatoria intestinale già nota serve a seguire come va nel tempo.",
      ],
      howToRead: [
        "Il referto riporta un numero, di solito in µg per grammo di feci, con una o più soglie del laboratorio accanto. A volte il medico chiede di ripetere l'esame dopo qualche settimana, per vedere come cambia il valore.",
        "Più il numero è alto, più infiammazione c'è nell'intestino, ma l'esame non dice da che cosa dipende: le cause possibili sono diverse, tra cui infezioni intestinali e alcuni farmaci. Che cosa significa per te lo valuta il medico.",
      ],
      factors: [
        "Antinfiammatori come aspirina, ibuprofene e naprossene: dillo al medico, senza sospenderli da solo.",
        "Farmaci per l'acidità di stomaco (inibitori di pompa, come omeprazolo).",
        "Infezioni intestinali recenti o in corso.",
        "Campione contaminato da urina, carta igienica o acqua del water.",
        "Tempo tra raccolta e consegna, e conservazione del campione.",
      ],
    },
    unitsAndRanges: {
      commonUnits: ["µg/g", "mg/kg"],
      rangeNote: "Il valore è espresso in µg per grammo di feci (lo stesso numero in mg/kg). Il laboratorio stampa una o due soglie che dipendono dal metodo: il numero si confronta solo con quelle dello stesso referto.",
    },
    questionsForDoctor: [
      "Per quale motivo ha richiesto la calprotectina nel mio caso?",
      "Conviene ripetere l'esame tra qualche settimana nel mio caso?",
      "I farmaci che prendo possono aver influito sul risultato?",
      "Servono altri esami, per esempio una colonscopia?",
      "Come raccolgo il campione la prossima volta, se va ripetuto?",
    ],
    faq: [
      { q: "Come si raccoglie il campione?", a: "Si raccolgono le feci in un contenitore pulito e asciutto, o su un foglio apposito sopra il water, evitando urina, carta igienica e acqua. Si chiude bene il contenitore con nome, data e ora e lo si consegna come indicato dal laboratorio." },
      { q: "Un valore alto vuol dire che ho una malattia intestinale cronica?", a: "Non necessariamente: anche un'infezione intestinale o alcuni farmaci possono far salire la calprotectina. Il medico legge il numero insieme ai disturbi e ad altri esami, e a volte chiede di ripeterlo." },
      { q: "Serve una preparazione?", a: "Di solito non serve una dieta. Chiedi al medico se prendi antinfiammatori o farmaci per lo stomaco: possono influire sul risultato, ma non vanno sospesi senza il suo parere." },
    ],
    relatedGuides: ["colonscopia", "sangue-occulto-nelle-feci", "pcr-proteina-c-reattiva", "esami-per-la-celiachia"],
    glossaryTerms: ["neutrofili", "globuli-bianchi", "campione", "metodo-analitico"],
    sources: [
      { title: "Calprotectin Stool Test — MedlinePlus", url: "https://medlineplus.gov/lab-tests/calprotectin-stool-test/" },
      { title: "Faecal Calprotectin Test — University College London Hospitals NHS", url: "https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/faecal-calprotectin-test" },
    ],
    lastUpdated: "2026-11-19",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "radiografia-del-torace",
    title: "Radiografia del torace: come si fa e cosa c'è nel referto",
    metaDescription: "La radiografia del torace (Rx torace, lastra ai polmoni): come prepararsi, come si svolge, quanto dura e che cosa trovi scritto nel referto del radiologo.",
    category: "immagini",
    examName: "Radiografia del torace",
    aliases: ["Rx torace", "RX torace", "lastra ai polmoni", "radiografia polmoni", "radiografia del petto", "lastra torace"],
    summary: "La radiografia del torace è un'immagine di polmoni, cuore e ossa del torace fatta con una piccola quantità di raggi X. Dura pochi minuti e non serve preparazione: il referto lo scrive il medico radiologo.",
    sections: {
      whatItMeasures: [
        "La radiografia usa una piccola quantità di radiazioni per fare un'immagine dell'interno del corpo. Nel torace mostra i polmoni, l'ombra del cuore, i grandi vasi, il diaframma e le ossa come coste e colonna. Di solito si fanno due immagini: una di fronte e una di lato.",
      ],
      whyRequested: [
        "Il medico la richiede quando cerca la causa di sintomi come tosse che dura, febbre con difficoltà a respirare o dolore al torace, per controllare l'andamento di un problema già noto, oppure prima di un intervento.",
      ],
      howToRead: [
        "Il referto del radiologo descrive che cosa si vede, area per area: i polmoni, la forma del cuore, gli angoli in fondo ai polmoni, le ossa. A volte confronta l'immagine con una radiografia precedente, se gliela porti.",
        "Le parole del referto sono tecniche e una descrizione da sola non dice che cosa significa per te: lo spiega il medico che ha richiesto l'esame, che conosce i tuoi sintomi. Se il radiologo propone un altro esame, per esempio una TAC, lo scrive in fondo.",
      ],
      factors: [
        "Gravidanza in corso o possibile: va detto prima dell'esame.",
        "Oggetti di metallo sul torace (collane, ganci del reggiseno), che si vedono nell'immagine.",
        "Respiro trattenuto e immobilità durante lo scatto.",
        "Radiografie precedenti da portare, utili per il confronto.",
        "Posizione possibile: in piedi, seduti o sdraiati, che cambia un po' l'immagine.",
      ],
    },
    procedure: {
      preparation: [
        "Di solito non serve nessuna preparazione: si mangia e si prendono i farmaci come sempre. Ti chiederanno di togliere gioielli e indumenti con parti metalliche sul torace e a volte di indossare un camice. Se sei incinta o potresti esserlo, dillo prima.",
      ],
      whatToExpect: [
        "Ti metti in piedi davanti a una lastra, con il petto appoggiato. Il tecnico di radiologia ti chiede di fare un respiro profondo e di trattenerlo per qualche secondo mentre scatta l'immagine; poi lo stesso di lato. Non si sente niente.",
      ],
      duration: "Pochi minuti per le immagini, in tutto circa un quarto d'ora",
      afterwards: [
        "Puoi tornare subito alle tue attività. Il referto arriva lo stesso giorno o nei giorni seguenti, secondo la struttura: se non lo ricevi nei tempi indicati, chiama chi ti ha fatto l'esame o il tuo medico.",
      ],
      reportContains: [
        "Tipo di esame e numero di immagini (di fronte, di lato).",
        "Descrizione dei polmoni e degli spazi intorno.",
        "Forma e dimensioni dell'ombra del cuore.",
        "Ossa del torace visibili nell'immagine.",
        "Confronto con esami precedenti, quando disponibili.",
        "Conclusioni del radiologo ed eventuali esami proposti.",
      ],
    },
    questionsForDoctor: [
      "Che cosa vogliono dire le parole scritte nel mio referto?",
      "Il radiologo ha confrontato l'immagine con le mie radiografie precedenti?",
      "Serve un altro esame per capire meglio?",
      "Quando conviene ripetere la radiografia, se serve?",
      "Devo portarle le immagini oltre al referto?",
    ],
    faq: [
      { q: "La radiografia del torace fa male o è pericolosa?", a: "Non fa male. Usa una piccola quantità di radiazioni ed è considerata un esame molto sicuro; il medico la richiede quando l'informazione serve. Se sei incinta o potresti esserlo, dillo prima." },
      { q: "Devo essere a digiuno?", a: "No, per la radiografia del torace non serve il digiuno. Puoi prendere i farmaci come sempre." },
      { q: "Perché il referto parla di una radiografia precedente?", a: "Il radiologo confronta le immagini quando le ha a disposizione: aiuta a capire se qualcosa è cambiato. Porta sempre le radiografie precedenti, anche su CD o con il codice per scaricarle." },
    ],
    relatedGuides: ["radiografia", "come-leggere-un-referto-di-radiologia", "tac-tomografia-computerizzata", "spirometria"],
    glossaryTerms: ["referto"],
    sources: [
      { title: "X-ray — NHS", url: "https://www.nhs.uk/conditions/x-ray/" },
      { title: "X-Rays — MedlinePlus", url: "https://medlineplus.gov/xrays.html" },
      { title: "Chest x-ray, patient information — University Hospital Southampton NHS", url: "https://www.uhs.nhs.uk/departments/radiology-scans-and-imaging/patient-information/chest-x-ray" },
    ],
    lastUpdated: "2026-11-19",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "ecografia-della-tiroide",
    title: "Ecografia della tiroide: come si fa e cosa c'è nel referto",
    metaDescription: "L'ecografia della tiroide: come si svolge, se serve una preparazione, che cosa descrive il referto (noduli, cisti, dimensioni) e che cosa chiedere al medico.",
    category: "immagini",
    examName: "Ecografia della tiroide",
    aliases: ["ecografia tiroide", "eco tiroide", "ecografia tiroidea", "ecografia del collo", "noduli tiroide", "nodulo tiroideo"],
    summary: "L'ecografia della tiroide usa gli ultrasuoni per vedere la ghiandola alla base del collo. Non usa radiazioni, non fa male e non serve preparazione. Il referto descrive dimensioni, aspetto e, se ci sono, i noduli.",
    sections: {
      whatItMeasures: [
        "L'ecografia usa gli ultrasuoni: una sonda appoggiata sul collo invia onde sonore e un computer trasforma gli echi in un'immagine. Mostra la forma e le dimensioni della tiroide, il suo aspetto interno e le strutture vicine, come i linfonodi del collo.",
      ],
      whyRequested: [
        "Il medico la richiede di solito quando alla visita sente un nodulo o una tiroide ingrossata, quando gli esami del sangue della tiroide lo suggeriscono, oppure per seguire nel tempo noduli già noti.",
      ],
      howToRead: [
        "Il referto descrive le dimensioni dei due lobi, l'aspetto del tessuto e, se ci sono, i noduli: quanti, dove, quanto misurano e come appaiono. Una cisti è un nodulo pieno di liquido. Molti referti danno a ogni nodulo un punteggio secondo una classificazione, con le caratteristiche che l'hanno determinato.",
        "Trovare un nodulo è frequente e una descrizione da sola non dice che cosa significa per te: lo valuta il medico insieme agli esami del sangue. A volte propone un agoaspirato, un prelievo di poche cellule con un ago sottile, fatto con l'aiuto dell'ecografia.",
      ],
      factors: [
        "Esperienza di chi esegue l'esame e apparecchio usato.",
        "Classificazione usata per descrivere i noduli, che può cambiare da un centro all'altro.",
        "Confronto con ecografie precedenti, utile per vedere se un nodulo è cambiato.",
        "Esami del sangue della tiroide recenti, da portare alla visita.",
        "Posizione del collo durante l'esame.",
      ],
    },
    procedure: {
      preparation: [
        "Non serve nessuna preparazione: puoi mangiare e prendere i farmaci come sempre. Conviene indossare abiti che lascino libero il collo e togliere collane. Porta le ecografie precedenti e gli esami del sangue della tiroide, se li hai.",
      ],
      whatToExpect: [
        "Ti sdrai sul lettino con un cuscino sotto le spalle, così il collo resta un po' disteso. Il medico mette sul collo un gel a base d'acqua, che può sembrare freddo, e muove la sonda sopra la tiroide. Non fa male e non usa radiazioni.",
      ],
      duration: "Di solito tra 10 e 20 minuti",
      afterwards: [
        "Puoi tornare subito alle tue attività: basta togliere il gel. Il referto di solito si riceve a fine esame o nei giorni seguenti, con le immagini principali.",
      ],
      reportContains: [
        "Dimensioni della tiroide e dei due lobi.",
        "Aspetto del tessuto della ghiandola.",
        "Noduli o cisti: numero, posizione, misure e descrizione.",
        "Eventuale punteggio dei noduli secondo una classificazione.",
        "Linfonodi del collo, se descritti.",
        "Confronto con esami precedenti ed eventuali esami proposti.",
      ],
    },
    questionsForDoctor: [
      "Che cosa vuol dire la descrizione dei noduli nel mio referto?",
      "Che cosa indica il punteggio scritto accanto al nodulo?",
      "Serve un agoaspirato o basta un controllo nel tempo?",
      "Quando va ripetuta l'ecografia?",
      "Gli esami del sangue della tiroide vanno ripetuti insieme?",
    ],
    faq: [
      { q: "Avere un nodulo alla tiroide vuol dire avere un tumore?", a: "No. I noduli della tiroide sono frequenti e nella maggior parte dei casi non sono tumori. L'aspetto all'ecografia aiuta il medico a decidere se basta un controllo nel tempo o se serve un approfondimento." },
      { q: "Serve il digiuno o sospendere i farmaci per la tiroide?", a: "No, per l'ecografia non serve il digiuno e i farmaci si prendono come sempre, a meno che il medico non dica diversamente per altri esami fatti lo stesso giorno." },
      { q: "Che cos'è l'agoaspirato?", a: "È il prelievo di poche cellule da un nodulo con un ago sottile, guidato dall'ecografia. Le cellule vengono guardate al microscopio. È il medico a proporlo quando serve." },
    ],
    relatedGuides: ["ecografia", "tsh", "ft4-tiroxina-libera", "anticorpi-anti-tpo", "come-leggere-un-referto-di-radiologia"],
    glossaryTerms: ["tsh", "ft4", "referto"],
    sources: [
      { title: "Thyroid ultrasound — MedlinePlus Medical Encyclopedia", url: "https://medlineplus.gov/ency/article/003776.htm" },
      { title: "Thyroid nodule — MedlinePlus Medical Encyclopedia", url: "https://medlineplus.gov/ency/article/007265.htm" },
      { title: "Investigations of thyroid nodules — East Kent Hospitals NHS", url: "https://leaflets.ekhuft.nhs.uk/investigations-of-thyroid-nodules/html/" },
    ],
    lastUpdated: "2026-11-19",
    reviewStatus: "draft-needs-clinical-review",
  },
];

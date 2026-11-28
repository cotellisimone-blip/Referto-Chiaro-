import type { Guide } from "../schema";

/**
 * 18/11/2026 (terzo giro, punto 12): cinque esami che si cercano spesso e che non avevano una guida.
 * Come tutte le guide cliniche sono BOZZE in attesa di revisione medica: restano fuori dai motori di ricerca.
 * Le fonti indicate sono state lette il 18/11/2026; età e intervalli degli screening cambiano per Regione
 * e il testo rimanda sempre alla lettera d'invito.
 */
export const GUIDE_SCREENING_E_ALTRI: Guide[] = [
  {
    slug: "pap-test-e-hpv-test",
    title: "Pap test e HPV test: come si fanno e come leggere l'esito",
    metaDescription: "Pap test e HPV test nello screening del collo dell'utero: che cosa cercano, come si fa il prelievo, come è scritto l'esito e che cosa chiedere al medico.",
    category: "ormoni",
    examName: "Pap test e HPV test",
    aliases: ["pap test", "paptest", "HPV test", "test HPV", "screening cervicale", "papilloma virus", "striscio"],
    summary: "Pap test e HPV test si fanno con lo stesso prelievo dal collo dell'utero. Il primo guarda le cellule, il secondo cerca il virus HPV. Sono esami di screening: l'esito dice se servono altri controlli, non dà una risposta definitiva.",
    sections: {
      whatItMeasures: [
        "Il Pap test è l'analisi al microscopio delle cellule che rivestono il collo dell'utero, prelevate con una spatolina o uno spazzolino morbido. Serve a vedere se ci sono cellule con alterazioni.",
        "Il test HPV si fa sullo stesso tipo di prelievo e cerca il DNA del virus del papilloma umano (HPV) nella mucosa del collo dell'utero. Può indicare anche il tipo di virus trovato. Trovare il virus non equivale ad avere una lesione: dice solo che serve guardare meglio.",
      ],
      whyRequested: [
        "Sono gli esami dello screening del collo dell'utero, offerto alle donne a partire dai 25 anni e fino ai 64. In quasi tutte le Regioni esiste un programma organizzato che invita a intervalli regolari; l'esame si può fare anche dal proprio ginecologo. Quale dei due test e ogni quanti anni dipende dall'età e dal programma della Regione: lo indica la lettera d'invito.",
      ],
      howToRead: [
        "L'esito dell'HPV test è scritto come «negativo» (virus non trovato) o «positivo» (virus trovato). Se il virus non c'è, di solito non serve altro fino all'invito successivo. Se c'è, il laboratorio guarda le cellule dello stesso prelievo.",
        "L'esito del Pap test descrive le cellule: senza alterazioni, oppure con alterazioni indicate con sigle che il medico spiega. A volte l'esito è «inadeguato» o «non valutabile»: vuol dire che il campione non bastava per leggere bene e che va ripetuto, non che qualcosa non va.",
        "Quando l'esito chiede un approfondimento, il passo successivo è di solito la colposcopia, un esame che osserva il collo dell'utero più da vicino. È il programma di screening o il medico a dire se e quando farla.",
      ],
      factors: [
        "Mestruazioni in corso: il prelievo si programma in un altro momento.",
        "Campione con poche cellule o difficile da leggere, che porta a ripetere il prelievo.",
        "Infiammazioni o infezioni vaginali in corso.",
        "Rapporti, lavande, ovuli o creme vaginali nei giorni prima: segui le istruzioni dell'invito.",
        "Tipo di test usato e intervallo previsto dal programma della tua Regione.",
      ],
    },
    procedure: {
      preparation: [
        "Segui le istruzioni scritte sull'invito o date dall'ambulatorio: di solito indicano di evitare i giorni delle mestruazioni e, nei giorni prima, lavande, ovuli e creme vaginali. Se hai dubbi sulla data, chiama il numero indicato.",
      ],
      whatToExpect: [
        "Ti sdrai sul lettino ginecologico. L'ostetrica o il medico inserisce in vagina uno strumento liscio, lo speculum, per vedere il collo dell'utero, e con uno spazzolino morbido preleva un piccolo campione di cellule. Può dare fastidio, ma dura poco. Puoi chiedere di fermarti in qualsiasi momento.",
      ],
      duration: "Meno di 5 minuti per il prelievo, circa 10 per tutto l'appuntamento",
      afterwards: [
        "Puoi riprendere subito le attività di ogni giorno. L'esito arriva per lettera, nel Fascicolo Sanitario o con le modalità indicate dal programma: se dopo il tempo previsto non hai ricevuto nulla, chiama il centro screening.",
      ],
      reportContains: [
        "Tipo di test eseguito: Pap test, HPV test o entrambi.",
        "Esito dell'HPV test: negativo o positivo, a volte con il tipo di virus.",
        "Descrizione delle cellule nel Pap test, con eventuali sigle.",
        "Adeguatezza del campione: se il prelievo bastava per la lettura.",
        "Indicazione del passo successivo: nuovo invito, ripetizione o colposcopia.",
      ],
    },
    questionsForDoctor: [
      "Quale test è stato fatto sul mio prelievo: Pap test, HPV test o entrambi?",
      "Che cosa vogliono dire le sigle scritte sul mio esito?",
      "Quando è previsto il prossimo controllo nel mio caso?",
      "Se mi viene proposta la colposcopia, come si svolge e dove si prenota?",
      "Il vaccino contro l'HPV cambia qualcosa nei miei controlli?",
    ],
    faq: [
      { q: "Un HPV test positivo vuol dire che ho un tumore?", a: "No. Vuol dire che è stato trovato il virus, cosa frequente. Il laboratorio guarda le cellule dello stesso prelievo e il programma di screening indica se serve un controllo ravvicinato o una colposcopia. Che cosa significa per te lo spiega il medico." },
      { q: "Perché mi hanno chiesto di ripetere il prelievo?", a: "Quando l'esito è «inadeguato» o «non valutabile» il campione non bastava per essere letto bene. Ripetere non vuol dire che è stato trovato qualcosa." },
      { q: "Ogni quanto va fatto?", a: "Dipende dall'età e dal tipo di test usato dal programma della tua Regione. L'invito indica l'intervallo previsto; per situazioni particolari decide il medico." },
    ],
    relatedGuides: ["mammografia", "ecografia", "cosa-chiedere-al-medico"],
    glossaryTerms: ["campione", "referto", "marcatore"],
    sources: [
      { title: "Indicatori Passi: screening cervicale — EpiCentro, Istituto Superiore di Sanità", url: "https://www.epicentro.iss.it/passi/indicatori/screeningutero" },
      { title: "Infezioni da papillomavirus umano (HPV) — ISSalute", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/h/hpv-virus-del-papilloma-umano" },
      { title: "Cervical screening: what happens at your appointment — NHS", url: "https://www.nhs.uk/conditions/cervical-screening/what-happens/" },
      { title: "Cervical screening: your results — NHS", url: "https://www.nhs.uk/conditions/cervical-screening/your-results/" },
    ],
    lastUpdated: "2026-11-18",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "sangue-occulto-nelle-feci",
    title: "Sangue occulto nelle feci: come si fa e come leggere l'esito",
    metaDescription: "Il sangue occulto nelle feci nello screening del colon-retto: come si raccoglie il campione, che cosa vuol dire positivo o negativo, che cosa chiedere.",
    category: "ormoni",
    examName: "Sangue occulto nelle feci",
    aliases: ["sangue occulto", "SOF", "FIT", "ricerca sangue occulto", "screening colon retto", "esame delle feci"],
    summary: "L'esame cerca piccolissime quantità di sangue in un campione di feci, non visibili a occhio. È l'esame dello screening del colon-retto: un esito positivo dice che serve un approfondimento, non da dove viene il sangue.",
    sections: {
      whatItMeasures: [
        "L'esame cerca in un piccolo campione di feci tracce di sangue troppo piccole per essere viste. Il metodo oggi più usato negli screening è il test immunochimico (FIT), che riconosce l'emoglobina umana e richiede un solo campione.",
        "Esiste anche un metodo più vecchio, il test al guaiaco, che richiede tre raccolte in giorni diversi e alcune attenzioni su dieta e farmaci. Il foglio di istruzioni del laboratorio dice quale metodo viene usato.",
      ],
      whyRequested: [
        "È l'esame dello screening del colon-retto, proposto ogni due anni alle persone tra i 50 e i 69 anni, salvo indicazioni diverse del medico o del programma della Regione. Il medico può prescriverlo anche in altri casi.",
      ],
      howToRead: [
        "L'esito è quasi sempre scritto come «negativo» o «positivo». Alcuni laboratori riportano anche un numero, con la soglia usata dal laboratorio accanto: vale solo per quel metodo.",
        "Negativo vuol dire che nel campione non sono state trovate tracce di sangue. Il sangue però può non essere distribuito in modo uniforme nelle feci o comparire a giorni alterni: per questo l'esame si ripete a intervalli regolari.",
        "Positivo vuol dire che è stato trovato sangue, ma l'esame non dice da dove viene né perché. Le cause possibili sono molte e diverse tra loro, per esempio emorroidi, polipi o infiammazioni. Per capirlo serve un approfondimento, di solito la colonscopia, che viene proposta dal programma o dal medico.",
      ],
      factors: [
        "Mestruazioni in corso: meglio raccogliere il campione in un altro momento.",
        "Sanguinamento da emorroidi o dalle gengive, anche dopo cure dal dentista.",
        "Farmaci come aspirina, antinfiammatori e anticoagulanti: dillo al medico, senza sospenderli da solo.",
        "Con il test al guaiaco: carne rossa, alcuni alimenti e la vitamina C nei giorni prima.",
        "Campione raccolto o conservato in modo diverso da quanto indicato nelle istruzioni.",
        "Sanguinamento intermittente, che può non essere presente nel giorno della raccolta.",
      ],
    },
    unitsAndRanges: {
      commonUnits: ["positivo / negativo", "ng/mL", "µg/g"],
      rangeNote: "Di solito il referto riporta solo «positivo» o «negativo». Quando c'è un numero, è espresso in ng/mL o in µg per grammo di feci e si confronta solo con la soglia stampata dallo stesso laboratorio: metodi diversi usano soglie diverse.",
    },
    questionsForDoctor: [
      "Con quale metodo è stato fatto il mio esame?",
      "Il mio esito è positivo: quale approfondimento è previsto e dove si prenota?",
      "I farmaci che prendo possono aver influito sul risultato?",
      "Quando è previsto il prossimo esame nel mio caso?",
      "Ho familiari con problemi al colon: cambia qualcosa nei miei controlli?",
    ],
    faq: [
      { q: "Un esito positivo vuol dire che ho un tumore?", a: "No. Vuol dire che nel campione c'era sangue, e le cause possibili sono molte. Per capire da dove viene serve un approfondimento, di solito la colonscopia. Che cosa significa per te lo valuta il medico." },
      { q: "Devo seguire una dieta prima della raccolta?", a: "Con il test immunochimico (FIT), il più usato, non serve nessuna dieta né preparazione. Con il test al guaiaco sì: le istruzioni del laboratorio indicano che cosa evitare nei giorni prima." },
      { q: "Se l'esito è negativo posso non rifarlo?", a: "L'esame si ripete a intervalli regolari perché un sanguinamento può essere intermittente. L'intervallo lo indica il programma di screening o il medico." },
    ],
    relatedGuides: ["colonscopia", "emocromo", "ferritina", "cosa-chiedere-al-medico"],
    glossaryTerms: ["campione", "emoglobina", "metodo-analitico", "referto"],
    sources: [
      { title: "Esame del sangue occulto: quando farlo — ISSalute", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/a/analisi-cliniche/sangue-occulto" },
    ],
    lastUpdated: "2026-11-18",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "urinocoltura",
    title: "Urinocoltura: come si raccoglie e come leggere il referto",
    metaDescription: "L'urinocoltura cerca batteri e lieviti nelle urine. Come raccogliere il campione, che cosa vogliono dire UFC/mL e antibiogramma, che cosa chiedere.",
    category: "reni",
    examName: "Urinocoltura",
    aliases: ["esame colturale delle urine", "urinocultura", "coltura delle urine", "antibiogramma", "cistite esame"],
    summary: "L'urinocoltura cerca e identifica batteri e lieviti nelle urine. Il referto dice se sono cresciuti, quali e in che quantità (UFC/mL) e, se serve, a quali antibiotici sono sensibili. Conta molto come si raccoglie il campione.",
    sections: {
      whatItMeasures: [
        "L'urinocoltura è l'esame che rileva e identifica i batteri e i lieviti presenti nelle urine. Il laboratorio mette una piccola quantità di urina su un terreno di coltura e osserva, dopo 24-48 ore, se crescono microrganismi, quali sono e quanti.",
        "Se la coltura è positiva, il laboratorio esegue di solito l'antibiogramma: prova diversi antibiotici sul batterio trovato e scrive per ciascuno se il batterio è sensibile, intermedio o resistente.",
      ],
      whyRequested: [
        "Il medico la richiede in presenza di disturbi come bruciore, bisogno frequente o urgente di urinare, a volte con febbre, oppure quando l'esame delle urine mostra batteri o globuli bianchi. Viene richiesta anche in gravidanza e prima di alcune procedure. Non è un esame di controllo per chi non ha disturbi.",
      ],
      howToRead: [
        "Il risultato è espresso in unità formanti colonia per millilitro (UFC/mL, a volte CFU/mL): quante colonie sono cresciute. «Negativa» vuol dire che la crescita è stata minima o assente. «Positiva» vuol dire che è cresciuto un microrganismo sopra la soglia usata dal laboratorio, e il referto ne riporta il nome.",
        "Se crescono più tipi di batteri insieme, il referto può parlare di «flora mista» o di possibile contaminazione: di solito vuol dire che il campione si è sporcato durante la raccolta, e può essere chiesto di ripeterlo.",
        "L'antibiogramma è una tabella: per ogni antibiotico una lettera (S sensibile, I intermedio, R resistente) e a volte un numero, la MIC. Serve al medico per scegliere; non è un'indicazione da seguire da soli. L'urinocoltura si legge sempre insieme all'esame delle urine e ai disturbi.",
      ],
      factors: [
        "Raccolta non corretta: primo getto, contenitore non sterile, igiene non fatta.",
        "Tempo e temperatura: il campione va consegnato presto o tenuto in frigorifero.",
        "Antibiotici in corso o finiti da poco: dillo sempre al medico e al laboratorio.",
        "Mestruazioni: meglio aspettare alcuni giorni dalla fine.",
        "Urina rimasta poco in vescica: l'ideale è quella del primo mattino.",
        "Catetere vescicale: le soglie e la lettura sono diverse.",
      ],
    },
    unitsAndRanges: {
      commonUnits: ["UFC/mL", "CFU/mL", "S / I / R"],
      rangeNote: "Il numero di colonie è espresso in UFC/mL. La soglia oltre la quale la coltura è considerata positiva dipende dal modo di raccolta, dai disturbi e dal laboratorio: vale quella indicata sul tuo referto. Nell'antibiogramma S, I e R descrivono il batterio, non la persona.",
    },
    questionsForDoctor: [
      "Il referto parla di contaminazione: devo ripetere la raccolta?",
      "Quale microrganismo è stato trovato e che cosa comporta nel mio caso?",
      "Che cosa mi dice l'antibiogramma?",
      "Avevo preso un antibiotico da poco: il risultato è attendibile?",
      "Dopo la cura serve un'urinocoltura di controllo?",
    ],
    faq: [
      { q: "Come si raccoglie bene il campione?", a: "Con le mani lavate e dopo l'igiene intima, si lascia andare il primo getto, si raccoglie il secondo nel contenitore sterile senza toccarne l'interno e si finisce di urinare nel water. Il campione va consegnato il prima possibile o tenuto in frigorifero: segui le istruzioni del laboratorio." },
      { q: "Perché il risultato arriva dopo qualche giorno?", a: "Perché i microrganismi devono avere il tempo di crescere: servono 24-48 ore di incubazione, più il tempo per l'antibiogramma quando la coltura è positiva." },
      { q: "Una coltura positiva vuol dire sempre infezione?", a: "Non sempre. Il medico la legge insieme all'esame delle urine e ai disturbi: batteri senza altri segni possono indicare una contaminazione del campione o una semplice presenza senza infezione." },
    ],
    relatedGuides: ["esame-delle-urine", "pcr-proteina-c-reattiva", "creatinina", "cosa-chiedere-al-medico"],
    glossaryTerms: ["esame-delle-urine", "campione", "leucociti", "nitriti-urinari", "sedimento-urinario"],
    sources: [
      { title: "Urinocoltura — Lab Tests Online Italia", url: "https://labtestsonline.it/lto-tests/urinocoltura.html" },
    ],
    lastUpdated: "2026-11-18",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "beta-hcg",
    title: "Beta-hCG: che cosa misura e come leggere il referto",
    metaDescription: "La beta-hCG è l'ormone della gravidanza. Differenza tra esame delle urine e del sangue, unità mUI/mL, perché a volte si ripete e che cosa chiedere al medico.",
    category: "ormoni",
    examName: "Beta-hCG",
    aliases: ["beta hCG", "bhCG", "βhCG", "test di gravidanza", "gonadotropina corionica", "hCG"],
    summary: "La beta-hCG è un ormone prodotto dalla placenta: si cerca nelle urine o si misura nel sangue per sapere se è iniziata una gravidanza. Il referto la riporta come positivo/negativo o come numero in mUI/mL, che cambia molto da persona a persona.",
    sections: {
      whatItMeasures: [
        "La gonadotropina corionica umana (hCG) è un ormone prodotto dalla placenta, che comincia a formarlo dopo che l'ovulo fecondato si è impiantato nell'utero. L'esame cerca o misura questo ormone.",
        "Il test sulle urine e il test «qualitativo» sul sangue dicono solo se l'ormone c'è. Il test «quantitativo» sul sangue ne misura la quantità esatta e riesce a rilevarne anche quantità molto piccole.",
      ],
      whyRequested: [
        "Si fa per sapere se è iniziata una gravidanza. L'esame del sangue quantitativo viene richiesto dal medico anche per seguire le prime settimane, quando serve. Più di rado la hCG viene misurata per altri motivi, che il medico spiega.",
      ],
      howToRead: [
        "Il test qualitativo è scritto come «positivo» o «negativo». Un test fatto troppo presto può risultare negativo anche se la gravidanza è iniziata, perché l'ormone non è ancora abbastanza: per questo a volte si ripete dopo alcuni giorni.",
        "Il test quantitativo riporta un numero in mUI/mL (o UI/L). Nelle prime settimane la hCG sale rapidamente, poi scende leggermente. I valori attesi per ogni settimana sono intervalli molto ampi: due persone alla stessa settimana possono avere numeri molto diversi.",
        "Per questo il singolo numero dice poco: quando serve, il medico chiede di ripetere il prelievo a distanza di giorni nello stesso laboratorio e guarda come cambia, insieme all'ecografia.",
      ],
      factors: [
        "Momento del test: troppo presto l'ormone può non essere ancora rilevabile.",
        "Urine molto diluite, per esempio dopo aver bevuto molto: meglio le prime del mattino.",
        "Farmaci per la fertilità che contengono hCG: dillo al medico.",
        "Laboratorio e metodo diversi tra un prelievo e l'altro.",
        "Gravidanza gemellare, in cui i valori possono essere più alti.",
      ],
    },
    unitsAndRanges: {
      commonUnits: ["mUI/mL", "UI/L", "positivo / negativo"],
      rangeNote: "La beta-hCG quantitativa si esprime in mUI/mL (equivalenti a UI/L). Il referto riporta spesso una tabella di intervalli per settimana di gravidanza: sono molto ampi e cambiano con il laboratorio. Il confronto ha senso solo tra prelievi fatti nello stesso laboratorio.",
    },
    questionsForDoctor: [
      "Il mio valore va ripetuto? Dopo quanti giorni e nello stesso laboratorio?",
      "Come si legge il mio numero rispetto alla tabella stampata sul referto?",
      "Ho fatto il test presto: quando conviene rifarlo?",
      "I farmaci che prendo possono influire sul risultato?",
      "Quando è prevista la prima ecografia?",
    ],
    faq: [
      { q: "Qual è la differenza tra il test delle urine e quello del sangue?", a: "Il test delle urine, anche quello fatto a casa, dice se l'ormone c'è. L'esame del sangue può rilevarne quantità più piccole e, nella forma quantitativa, ne misura la quantità. Il risultato del sangue richiede da qualche ora a un giorno o più." },
      { q: "Dal numero si capisce a che settimana sono?", a: "Solo in modo molto approssimativo: gli intervalli per ogni settimana sono molto ampi e si sovrappongono. La datazione la fa il medico, di solito con l'ecografia." },
      { q: "Il test di casa è negativo ma il ciclo non arriva: che cosa faccio?", a: "Un test fatto troppo presto può essere negativo perché l'ormone è ancora poco. Di solito si ripete dopo circa una settimana; se il dubbio resta, parlane con il medico." },
    ],
    relatedGuides: ["fsh-e-lh", "prolattina", "ecografia", "prima-del-prelievo", "cosa-chiedere-al-medico"],
    glossaryTerms: ["ormone", "progesterone", "estradiolo", "unita-internazionali", "metodo-analitico"],
    sources: [
      { title: "Pregnancy Test — MedlinePlus", url: "https://medlineplus.gov/lab-tests/pregnancy-test/" },
      { title: "HCG blood test, quantitative — MedlinePlus", url: "https://medlineplus.gov/ency/article/003510.htm" },
    ],
    lastUpdated: "2026-11-18",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "esami-per-la-celiachia",
    title: "Esami per la celiachia: quali sono e come leggere il referto",
    metaDescription: "Gli esami del sangue per la celiachia: anticorpi anti-transglutaminasi, IgA totali e altri. Perché non togliere il glutine prima e che cosa chiedere al medico.",
    category: "ormoni",
    examName: "Esami per la celiachia",
    aliases: ["celiachia", "anti-transglutaminasi", "transglutaminasi", "tTG", "anti-endomisio", "EMA", "IgA totali", "glutine"],
    summary: "Gli esami del sangue per la celiachia cercano anticorpi che di solito sono presenti in chi è celiaco. Da soli non bastano per una conclusione: l'esito va confermato dallo specialista. Prima del prelievo non bisogna togliere il glutine.",
    sections: {
      whatItMeasures: [
        "Il prelievo cerca nel sangue gli anticorpi che di solito sono presenti nelle persone con celiachia. L'esame più usato è quello degli anticorpi anti-transglutaminasi di classe IgA (tTG-IgA).",
        "Insieme si misurano spesso le IgA totali, per sapere se la persona ne produce poche: in quel caso il primo esame può risultare negativo anche se la celiachia c'è, e il laboratorio usa anticorpi di un'altra classe o altri esami, come gli anticorpi anti-gliadina deamidata (DGP). Gli anticorpi anti-endomisio (EMA) sono un altro esame dello stesso gruppo.",
      ],
      whyRequested: [
        "Il medico li richiede in presenza di disturbi intestinali che durano, stanchezza prolungata, perdita di peso o anemia senza una spiegazione, e quando un genitore, un fratello o un figlio è celiaco. Gli stessi anticorpi vengono poi controllati nel tempo in chi ha già la conferma.",
      ],
      howToRead: [
        "Il referto riporta per ogni anticorpo un numero con la sua unità e la soglia del laboratorio, oppure la scritta «negativo», «positivo» o «dubbio». Le unità e le soglie cambiano da un laboratorio all'altro e non si confrontano tra loro.",
        "Un esito positivo dice che gli anticorpi sono stati trovati: il medico di solito indirizza al gastroenterologo, che può chiedere altri esami del sangue o una biopsia dell'intestino fatta con la gastroscopia. È lo specialista a confermare o escludere la celiachia.",
        "Un esito negativo rende la celiachia meno probabile, ma a volte gli anticorpi mancano anche in chi è celiaco: se i disturbi continuano, il medico può decidere di approfondire lo stesso.",
      ],
      factors: [
        "Dieta senza glutine o con poco glutine prima del prelievo: può rendere l'esame negativo.",
        "Poche IgA totali, che rendono inaffidabili gli anticorpi di classe IgA.",
        "Età: nei bambini piccoli possono essere usati esami diversi.",
        "Metodo e laboratorio: soglie e unità non sono le stesse ovunque.",
      ],
    },
    unitsAndRanges: {
      commonUnits: ["U/mL", "UA/mL", "mg/dL (IgA totali)", "positivo / negativo"],
      rangeNote: "Gli anticorpi sono espressi in unità che dipendono dal metodo (U/mL, UA/mL o altre), le IgA totali in mg/dL. Vale solo la soglia stampata sul tuo referto. Per seguire i valori nel tempo conviene usare lo stesso laboratorio.",
    },
    questionsForDoctor: [
      "Quali anticorpi sono stati cercati nel mio prelievo?",
      "Le mie IgA totali permettono di fidarsi del risultato?",
      "Devo continuare a mangiare glutine fino alla fine degli accertamenti?",
      "Serve la visita dal gastroenterologo o una biopsia?",
      "I miei familiari devono fare l'esame?",
    ],
    faq: [
      { q: "Posso togliere il glutine prima di fare gli esami?", a: "No: per avere risultati attendibili bisogna continuare a mangiare alimenti con glutine fino alla fine degli accertamenti, e non iniziare la dieta prima che lo specialista abbia confermato. Per quanto tempo e in che quantità lo indica il medico." },
      { q: "Gli anticorpi positivi bastano per dire che sono celiaco?", a: "Da soli no. Indicano che è probabile, ma la conferma spetta allo specialista, che può chiedere altri esami del sangue o una biopsia dell'intestino." },
      { q: "Perché sul referto ci sono anche le IgA totali?", a: "Perché alcune persone producono poche IgA. In quel caso gli anticorpi anti-transglutaminasi di classe IgA possono risultare negativi anche se la celiachia c'è, e servono esami diversi." },
    ],
    relatedGuides: ["gastroscopia", "ferritina", "emocromo", "vitamina-b12", "folati", "cosa-chiedere-al-medico"],
    glossaryTerms: ["anticorpi", "autoanticorpi", "immunoglobuline", "metodo-analitico", "intervallo-di-riferimento"],
    sources: [
      { title: "Coeliac disease: diagnosis — NHS", url: "https://www.nhs.uk/conditions/coeliac-disease/diagnosis/" },
      { title: "Celiac Disease Screening — MedlinePlus", url: "https://medlineplus.gov/lab-tests/celiac-disease-screening/" },
    ],
    lastUpdated: "2026-11-18",
    reviewStatus: "draft-needs-clinical-review",
  },
];

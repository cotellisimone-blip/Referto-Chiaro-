import type { Guide } from "../schema";

/** Guide della categoria «endoscopie» (esami strumentali). Bozze editoriali, da revisione medica. */
export const GUIDE_ENDOSCOPIE: Guide[] = [
  {
    slug: "gastroscopia",
    title: "Gastroscopia (EGDS): preparazione, esame e referto",
    metaDescription: "La gastroscopia osserva esofago, stomaco e duodeno con un sottile tubo flessibile. Digiuno, sedazione, durata, biopsie e come leggere il referto.",
    category: "endoscopie",
    examName: "Gastroscopia (EGDS)",
    aliases: ["EGDS", "esofagogastroduodenoscopia", "endoscopia digestiva alta", "gastroscopia con biopsia"],
    summary: "La gastroscopia usa un tubo sottile e flessibile con una telecamera per osservare esofago, stomaco e duodeno. Il referto descrive la mucosa e indica eventuali prelievi (biopsie) inviati in laboratorio.",
    sections: {
      whatItMeasures: [
        "La gastroscopia, o esofagogastroduodenoscopia (EGDS), permette di osservare direttamente l'interno di esofago, stomaco e prima parte dell'intestino (duodeno). Un tubo flessibile della larghezza di un dito, con una luce e una telecamera, passa dalla bocca e trasmette le immagini su uno schermo.",
        "Durante l'esame il medico può prelevare piccoli frammenti di tessuto (biopsie) da analizzare al microscopio, e in alcuni casi eseguire piccoli gesti operativi. L'esame non misura valori nel sangue: descrive ciò che si vede sulla superficie interna.",
      ],
      whyRequested: [
        "Il medico può richiedere la gastroscopia per studiare disturbi dell'apparato digerente alto, per approfondire altri esami, per controllare una situazione già nota o prima di alcune terapie. Quando farla e con quale tipo di sedazione lo decidono il medico e l'endoscopista.",
      ],
      howToRead: [
        "Il referto descrive in sequenza esofago, stomaco (fondo, corpo, antro) e duodeno, con termini sull'aspetto della mucosa: «eritema» (arrossamento), «erosioni», «ulcere», «ernia iatale», «pliche». Ogni reperto è descritto con sede e dimensioni, quando utili.",
        "Se sono state fatte biopsie, il referto endoscopico lo segnala ma il risultato arriva a parte, con l'esame istologico, di solito dopo alcuni giorni. «Mucosa nei limiti» indica un aspetto compatibile con quanto atteso; «non si apprezzano lesioni focali» significa che non si sono viste formazioni circoscritte. Il significato per te lo valuta il medico.",
      ],
      factors: [
        "Presenza di residui di cibo nello stomaco, che ostacolano la visione se il digiuno non è stato rispettato.",
        "Farmaci anticoagulanti o antiaggreganti, rilevanti per le biopsie, da riferire al medico.",
        "Sedazione scelta e collaborazione durante l'esame.",
        "Riflesso del vomito e difficoltà ad avere il tubo in bocca.",
        "Condizioni respiratorie e cardiache, che influenzano la scelta della sedazione.",
        "Esperienza dell'operatore e qualità dell'apparecchio.",
      ],
    },
    procedure: {
      preparation: [
        "Per vedere bene lo stomaco serve di solito il digiuno da cibi solidi per alcune ore e da liquidi per un tempo più breve: segui con precisione le istruzioni scritte della struttura. I farmaci da assumere o sospendere (compresi anticoagulanti e antidiabetici) vanno concordati con il medico: non decidere da solo.",
        "Dillo prima al personale se hai allergie, malattie cardiache o respiratorie, se sei in gravidanza o se hai già avuto problemi con la sedazione. Se è prevista la sedazione, di solito ti serve un accompagnatore e non puoi guidare dopo l'esame.",
      ],
      whatToExpect: [
        "Ti sdrai sul fianco sinistro. Può essere applicato uno spray anestetico alla gola e, se previsto, ti viene somministrato un sedativo in vena. Ti viene messo un boccaglio fra i denti per proteggere lo strumento. Poi il medico introduce il tubo, che passa dalla bocca verso lo stomaco: non ostacola il respiro.",
        "Puoi avvertire un senso di gonfiore o di conati mentre viene insufflata aria per distendere le pareti. Respira lentamente e rilassati. Se necessario, il medico preleva biopsie, che non causano dolore. A fine esame l'aria viene aspirata e il tubo ritirato.",
      ],
      duration: "Da 10 a 20 minuti per l'esame, più preparazione e osservazione",
      afterwards: [
        "Dopo l'esame resti in osservazione finché non passano gli effetti del sedativo o dell'anestesia locale della gola. Aspetta di recuperare la sensibilità prima di bere e mangiare e segui le indicazioni del personale. Il gonfiore passa in breve tempo.",
        "Se sono state fatte biopsie il risultato istologico arriva dopo alcuni giorni. Se nelle ore successive compaiono dolore forte, difficoltà a respirare, vomito con sangue o febbre, contatta subito la struttura o il pronto soccorso.",
      ],
      reportContains: [
        "Tipo di sedazione o anestesia usata e qualità della preparazione.",
        "Descrizione di esofago, stomaco e duodeno.",
        "Reperti con sede e dimensioni, ad esempio erosioni, ulcere o ernia.",
        "Biopsie o altri prelievi eseguiti e dove.",
        "Eventuali complicanze o eventi durante l'esame.",
        "Conclusioni e indicazioni successive, compreso l'esame istologico.",
      ],
    },
    questionsForDoctor: [
      "Quale domanda clinica doveva chiarire la gastroscopia?",
      "Sono state fatte biopsie e quando avrò il risultato?",
      "Termini come «eritema» o «erosioni» come vanno letti nel mio caso?",
      "Devo seguire precauzioni particolari dopo l'esame?",
      "Serve ripetere l'esame o fare altri accertamenti?",
    ],
    faq: [
      { q: "La gastroscopia è dolorosa?", a: "Di solito è fastidiosa ma non dolorosa. Si possono avvertire conati o gonfiore. Con la sedazione molte persone ricordano poco dell'esame. Le opzioni disponibili le discuti con il medico e la struttura." },
      { q: "Perché è importante il digiuno?", a: "Perché residui di cibo nello stomaco impediscono la visione e possono essere inalati durante l'esame. Per questo le istruzioni sul digiuno vanno seguite con precisione." },
      { q: "Il risultato delle biopsie è nel referto?", a: "No: il referto endoscopico segnala le biopsie fatte, ma l'esame istologico viene eseguito in laboratorio e il risultato arriva dopo alcuni giorni, in un documento a parte." },
    ],
    relatedGuides: ["colonscopia", "ecografia-addominale", "cosa-chiedere-al-medico", "come-leggere-un-referto-di-laboratorio"],
    glossaryTerms: ["referto", "digiuno"],
    sources: [{ title: "Gastroscopia (EGDS) — ISSalute", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/g/gastroscopia-esami-di-accertamento" }, { title: "Gastroscopy — NHS", url: "https://www.nhs.uk/tests-and-treatments/gastroscopy/" }],
    lastUpdated: "2026-11-07",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "colonscopia",
    title: "Colonscopia: preparazione intestinale, esame e referto",
    metaDescription: "La colonscopia osserva l'interno del colon con un tubo flessibile. Preparazione intestinale, sedazione, durata, polipi e biopsie e come leggere il referto.",
    category: "endoscopie",
    examName: "Colonscopia",
    aliases: ["colonscopia totale", "pancolonscopia", "endoscopia del colon", "colonscopia con biopsia"],
    summary: "La colonscopia usa un tubo flessibile con telecamera per osservare l'interno di retto e colon. Richiede una pulizia intestinale accurata; il referto indica qualità della preparazione, reperti e prelievi.",
    sections: {
      whatItMeasures: [
        "La colonscopia permette di osservare direttamente la superficie interna del retto e del colon, fino al punto in cui l'intestino tenue si unisce al colon. Un tubo flessibile con luce e telecamera viene introdotto dall'ano e avanzato con delicatezza, mentre le immagini compaiono sullo schermo.",
        "Durante l'esame si può insufflare aria o anidride carbonica per distendere le pareti, e prelevare biopsie o asportare piccole formazioni chiamate polipi, che poi vengono analizzate in laboratorio. L'esame non misura valori nel sangue: descrive ciò che si vede.",
      ],
      whyRequested: [
        "Il medico può richiedere la colonscopia per approfondire sintomi intestinali, per completare altri esami, per controlli nel tempo di situazioni già note o nell'ambito di programmi di screening. Se e quando eseguirla e con quale sedazione lo decidono il medico e l'endoscopista.",
      ],
      howToRead: [
        "Il referto indica prima la qualità della preparazione intestinale (spesso con una scala, per esempio «adeguata» o «insufficiente») e fin dove è arrivato lo strumento (per esempio fino al «cieco» o all'«ileo terminale»). Poi descrive i segmenti del colon e i reperti con sede, dimensione e aspetto.",
        "Termini ricorrenti: «polipo» è una piccola formazione sporgente dalla parete, descritta per dimensione e forma; «diverticoli» sono piccole sacche della parete; «mucosa nei limiti» indica un aspetto compatibile con quanto atteso. Se sono stati asportati polipi o fatte biopsie, il referto lo segnala e il risultato istologico arriva a parte, dopo alcuni giorni; il medico indica poi eventuali controlli.",
      ],
      factors: [
        "Qualità della pulizia intestinale: se insufficiente, parti del colon possono non essere ben visibili.",
        "Anatomia del colon e aderenze da interventi precedenti, che influenzano la percorribilità.",
        "Farmaci anticoagulanti o antiaggreganti, da gestire con il medico prima delle biopsie o dell'asportazione di polipi.",
        "Tipo di sedazione e tolleranza dell'insufflazione.",
        "Condizioni cardiache, respiratorie e renali, che influenzano la scelta della preparazione.",
        "Esperienza dell'operatore e tempo dedicato all'osservazione.",
      ],
    },
    procedure: {
      preparation: [
        "La preparazione è la parte più importante: nei giorni precedenti si segue una dieta povera di scorie e il giorno prima si assume una soluzione per pulire l'intestino, con molta acqua, secondo lo schema scritto dalla struttura. Segui con precisione tempi e dosaggi indicati dalla struttura: una pulizia incompleta può costringere a ripetere l'esame.",
        "Dillo prima al personale se hai diabete, malattie del cuore, dei reni o respiratorie, allergie, se sei in gravidanza o se assumi anticoagulanti, antiaggreganti, ferro o altri farmaci: la gestione dei farmaci va concordata con il medico, non decidere da solo. Se è prevista la sedazione ti serve un accompagnatore.",
      ],
      whatToExpect: [
        "Ti viene dato un camice e ti sdrai sul fianco sinistro. Se prevista, ti viene somministrata una sedazione in vena. Il medico introduce il tubo dall'ano e lo fa avanzare lungo l'intestino; l'aria introdotta può dare crampi o senso di gonfiore.",
        "Durante l'esame puoi essere invitato a cambiare posizione. Se compaiono polipi o aree da studiare, il medico può asportarli o prelevare tessuto con strumenti passati nel canale del tubo. Al ritiro l'aria viene aspirata.",
      ],
      duration: "Da 20 a 45 minuti per l'esame, più preparazione e osservazione",
      afterwards: [
        "Dopo l'esame resti in osservazione finché non passano gli effetti della sedazione. Possono restare gonfiore e gas per un po'. Segui le indicazioni su alimentazione, guida e farmaci date dal personale; se sono stati asportati polipi, le indicazioni possono essere più specifiche.",
        "Se nelle ore o nei giorni seguenti compaiono dolore addominale forte, febbre, sanguinamento abbondante o vomito persistente, contatta subito la struttura o il pronto soccorso. Il risultato istologico arriva dopo alcuni giorni.",
      ],
      reportContains: [
        "Qualità della preparazione intestinale.",
        "Tipo di sedazione e punto raggiunto dallo strumento.",
        "Descrizione dei segmenti del colon e della mucosa.",
        "Reperti con sede, dimensione e aspetto, come polipi o diverticoli.",
        "Biopsie e polipectomie eseguite.",
        "Eventuali eventi durante l'esame.",
        "Conclusioni e indicazioni sui controlli e sull'esame istologico.",
      ],
    },
    questionsForDoctor: [
      "La preparazione è risultata adeguata e l'esame è stato completo?",
      "Sono stati asportati polipi o fatte biopsie? Quando avrò il risultato?",
      "Come devo leggere i termini del referto, come «polipo» o «diverticoli», nel mio caso?",
      "Devo ripetere la colonscopia e dopo quanto tempo?",
      "Come devo gestire i miei farmaci prima e dopo l'esame?",
    ],
    faq: [
      { q: "Perché la preparazione è così importante?", a: "Perché solo un colon pulito permette di vedere bene la parete. Se la pulizia è insufficiente, alcune zone possono non essere valutabili e l'esame potrebbe essere ripetuto." },
      { q: "La colonscopia è dolorosa?", a: "Può dare crampi o gonfiore, e la sensazione varia da persona a persona. Con la sedazione l'esame è in genere meglio tollerato. Discuti le opzioni con il medico e la struttura." },
      { q: "Quando arriva il risultato delle biopsie?", a: "L'esame istologico viene fatto in laboratorio e il risultato arriva di solito dopo alcuni giorni, in un documento separato dal referto endoscopico. Il medico ti spiega come ritirarlo e come leggerlo." },
    ],
    relatedGuides: ["gastroscopia", "ecografia-addominale", "cosa-chiedere-al-medico", "come-leggere-un-referto-di-laboratorio"],
    glossaryTerms: ["referto", "digiuno"],
    sources: [{ title: "Colonscopia: che cos'è e quando farla — ISSalute", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/c/colonscopia-esami-di-accertamento" }, { title: "Colonoscopy — NHS", url: "https://www.nhs.uk/tests-and-treatments/colonoscopy/" }],
    lastUpdated: "2026-11-07",
    reviewStatus: "draft-needs-clinical-review",
  },
];

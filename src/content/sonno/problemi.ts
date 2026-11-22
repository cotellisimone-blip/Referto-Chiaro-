import type { SonnoPagina } from "./schema";

/**
 * Sezione sonno, le cinque porte «per problema» (22/11/2026). Si entra da quello che si vive, non dal nome della
 * malattia. Bozze: le rilegge e le firma un medico prima dell'indicizzazione.
 */

const BOZZA = { stato: "bozza" } as const;
const OGGI = "2026-11-22";

const ESRS = { ente: "European Sleep Research Society (ESRS)", titolo: "European Insomnia Guideline 2023, J Sleep Res 2023", url: "https://onlinelibrary.wiley.com/doi/10.1111/jsr.14035" };
const ISS_INSONNIA = { ente: "ISSalute (Istituto superiore di sanità)", titolo: "Insonnia: cause, cure e accorgimenti utili", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/i/insonnia" };
const NHS_INSONNIA = { ente: "NHS", titolo: "Insomnia", url: "https://www.nhs.uk/conditions/insomnia/" };
const NHS_APNEE = { ente: "NHS", titolo: "Sleep apnoea", url: "https://www.nhs.uk/conditions/sleep-apnoea/" };
const AIMS = { ente: "Associazione italiana di medicina del sonno (AIMS)", titolo: "Materiali per i pazienti sul sonno", url: "https://www.sonnomed.it" };

export const NON_MI_ADDORMENTO: SonnoPagina = {
  slug: "non-mi-addormento",
  tipo: "problema",
  porta: "Non mi addormento",
  icona: "s-letto",
  riga: "La mente che non si spegne, l'orologio che corre. Perché succede, che cosa lo mantiene e che cosa aiuta davvero.",
  seoTitle: "Non riesco ad addormentarmi: perché e cosa fare",
  metaDescription: "Fai fatica ad addormentarti la sera? Perché succede, che cosa mantiene il problema, che cosa dicono le linee guida europee e quando parlarne con il medico.",
  titolo: "Non mi addormento:",
  em: "quando il letto diventa il posto dei pensieri.",
  inBreve: [
    "Metterci più di mezz'ora ad addormentarsi, quasi tutte le sere e da settimane, è la forma più comune di insonnia.",
    "Spesso nasce da un periodo difficile e poi si mantiene da sola: più si cerca il sonno, più si allontana. Non è una questione di forza di volontà.",
    "Le linee guida europee indicano come primo percorso la terapia cognitivo-comportamentale per l'insonnia (CBT-I), prima dei farmaci.",
  ],
  sezioni: [
    {
      id: "perche",
      kicker: "Per capire",
      titolo: "Perché il sonno non arriva",
      blocchi: [
        {
          p: "Per addormentarsi servono due condizioni insieme: abbastanza «pressione» del sonno, che cresce con le ore passate svegli, e l'orologio interno che dice «è notte». Se una delle due manca, il sonno tarda. Succede, per esempio, dopo un pisolino lungo nel pomeriggio (la pressione si è scaricata) o quando si va a letto molto prima del solito (l'orologio non è ancora pronto).",
        },
        {
          p: "C'è poi un terzo ingrediente: l'allerta. Il cervello non si addormenta se percepisce qualcosa da tenere d'occhio. Preoccupazioni, una giornata tesa, ma anche la paura stessa di non dormire tengono acceso il sistema di allarme. È per questo che a volte ci si addormenta sul divano e ci si sveglia del tutto appena si entra in camera.",
        },
        {
          p: "Gli studiosi del sonno descrivono l'insonnia con tre gruppi di fattori: quelli che predispongono (un carattere più incline a rimuginare, la familiarità), quelli che la fanno partire (un lutto, un trasloco, una malattia, un periodo di lavoro intenso) e quelli che la mantengono. Sono questi ultimi a contare di più dopo qualche settimana, e sono anche quelli su cui si può lavorare.",
        },
      ],
    },
    {
      id: "cosa-mantiene",
      kicker: "Il circolo",
      titolo: "Che cosa mantiene il problema",
      blocchi: [
        {
          punti: [
            "Andare a letto prima per «recuperare»: si passa più tempo a letto svegli, e il letto si associa alla veglia.",
            "Restare a letto a rigirarsi per ore, guardando l'ora: ogni controllo dell'orologio riaccende l'allerta.",
            "Alzarsi tardi o fare pisolini lunghi dopo una notte storta: la sera dopo la pressione del sonno è più bassa.",
            "Usare il letto per lavorare, scorrere il telefono, discutere: il cervello impara che lì si sta svegli.",
            "Caffè o bevande con caffeina nel pomeriggio, alcol la sera per «rilassarsi»: l'alcol fa addormentare prima ma frammenta la seconda metà della notte.",
            "Pensieri del tipo «se non dormo domani sarà un disastro»: alzano l'ansia proprio nel momento in cui servirebbe calma.",
          ],
          stile: "segni",
        },
        {
          riquadro: {
            tono: "nota",
            titolo: "Non è colpa tua",
            testo: "Sono reazioni naturali a qualche notte difficile: chiunque, dopo una notte in bianco, cerca di recuperare. Il problema è che, ripetute per settimane, insegnano al cervello a restare sveglio a letto. Riconoscerle è il primo passo del percorso con il professionista.",
          },
        },
      ],
    },
    {
      id: "cosa-aiuta",
      kicker: "Che cosa aiuta",
      titolo: "Che cosa dicono le linee guida",
      blocchi: [
        {
          p: "Le linee guida europee sull'insonnia (ESRS 2023) raccomandano come primo percorso, per gli adulti di qualsiasi età, la terapia cognitivo-comportamentale per l'insonnia (CBT-I). Lavora proprio sui fattori che mantengono il problema: orari, abitudini a letto, pensieri sul sonno. Si fa con uno psicologo o un medico formati, in gruppo, o con programmi digitali guidati, di solito in 4-8 incontri.",
        },
        {
          p: "Le regole di «igiene del sonno» (camera buia e fresca, niente schermi prima di dormire, caffè solo al mattino) sono utili come base, ma da sole, dicono le stesse linee guida, non bastano a curare un'insonnia che dura da mesi. I farmaci hanno un ruolo, di solito per periodi brevi e sempre decisi dal medico.",
        },
        { vai: { href: "/malattie/sonno/terapia-cognitivo-comportamentale", titolo: "La terapia cognitivo-comportamentale, spiegata", testo: "Le cinque parti del percorso, che cosa aspettarsi, dove trovarla in Italia." } },
        {
          punti: [
            "Un orario fisso per alzarsi, tutti i giorni, anche nel fine settimana: è l'àncora dell'orologio interno.",
            "A letto solo quando arriva il sonno, non quando «è ora».",
            "Se dopo un tempo che sembra lungo (circa 20 minuti, senza guardare l'orologio) il sonno non arriva, alzarsi, fare qualcosa di tranquillo con luce bassa e tornare a letto quando le palpebre pesano.",
            "Un'ora di «atterraggio» prima di dormire: luci basse, niente lavoro, niente discussioni.",
            "Scrivere le preoccupazioni su un foglio nel tardo pomeriggio, con un possibile primo passo per ciascuna: a letto non serve più tenerle a mente.",
          ],
          stile: "numeri",
        },
        { p: "Sono indicazioni generali che fanno parte dei percorsi di CBT-I. Non sostituiscono il percorso vero, che si adatta alla persona: se la difficoltà dura da più di tre mesi, conviene parlarne con il medico." },
      ],
    },
    {
      id: "da-guardare",
      kicker: "Da non trascurare",
      titolo: "Quando dietro c'è altro",
      blocchi: [
        {
          p: "A volte la difficoltà ad addormentarsi ha una causa precisa da cercare: l'ansia o un periodo di umore basso, il dolore, il bisogno di urinare di notte, i sintomi delle gambe senza riposo, alcuni farmaci (per esempio certi decongestionanti, cortisonici, alcuni antidepressivi) o la tiroide che lavora troppo. Il medico ne terrà conto prima di parlare di insonnia «pura».",
        },
        {
          p: "C'è anche chi non ha insonnia ma un orologio interno spostato in avanti: si addormenta facilmente, ma solo molto tardi (all'una, alle due), e al mattino fatica ad alzarsi. È frequente negli adolescenti e nei giovani adulti, si chiama ritardo di fase e si affronta in modo diverso, soprattutto con la luce al momento giusto.",
        },
        { vai: { href: "/malattie/sonno/gambe-senza-riposo", titolo: "Bisogno di muovere le gambe la sera?", testo: "Potrebbe essere la sindrome delle gambe senza riposo: i quattro segni tipici." } },
      ],
    },
  ],
  autovalutazione: "autovalutazione-insonnia",
  domande: [
    "Dal mio diario del sonno, la mia è insonnia o un orologio interno spostato?",
    "Qualcuno dei farmaci che prendo può rendere più difficile addormentarmi?",
    "Esiste un percorso di terapia cognitivo-comportamentale per l'insonnia vicino a me o online?",
    "Ansia o umore possono avere un ruolo? A chi posso rivolgermi?",
    "Se serve un farmaco, per quanto tempo e come si smette?",
  ],
  faq: [
    {
      d: "Quanto tempo è «normale» per addormentarsi?",
      r: "Nella maggior parte degli adulti il sonno arriva entro 15-20 minuti. Nelle ricerche sull'insonnia si considera significativo un tempo superiore a 30 minuti, per più sere a settimana. Una sera storta ogni tanto capita a tutti.",
    },
    {
      d: "Leggere a letto aiuta o peggiora?",
      r: "Per chi dorme bene non è un problema. Per chi ha insonnia, i percorsi di terapia cognitivo-comportamentale suggeriscono di leggere fuori dal letto, con luce bassa, e di andare a letto solo quando arriva il sonno: serve a ricostruire il legame tra letto e sonno.",
    },
    {
      d: "Gli schermi la sera fanno davvero male al sonno?",
      r: "La luce degli schermi può ritardare un po' l'orologio interno, ma l'effetto più forte è un altro: tengono la mente attiva (messaggi, notizie, video). Più che il filtro della luce blu, aiuta smettere di usarli nell'ultima ora.",
    },
  ],
  correlate: ["percorso-due-settimane", "terapia-cognitivo-comportamentale", "come-funziona-il-sonno", "farmaci-e-melatonina"],
  ricerche: ["non riesco ad addormentarmi", "non mi addormento", "difficoltà ad addormentarsi", "insonnia iniziale", "mente che non si spegne", "pensieri la notte", "addormentarsi velocemente"],
  fonti: [ESRS, ISS_INSONNIA, NHS_INSONNIA, AIMS],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const MI_SVEGLIO_DI_NOTTE: SonnoPagina = {
  slug: "mi-sveglio-di-notte",
  tipo: "problema",
  porta: "Mi sveglio di notte",
  icona: "s-risvegli",
  riga: "Risvegli lunghi o troppo presto al mattino: quando sono normali, quando sono insonnia e che cosa può esserci dietro.",
  seoTitle: "Mi sveglio di notte e non riesco a riaddormentarmi",
  metaDescription: "Risvegli notturni e risveglio precoce: quanti sono normali, che cosa li causa (dal bagno alle apnee), che cosa aiuta e quando parlarne con il medico.",
  titolo: "Mi sveglio di notte:",
  em: "e poi il sonno non torna.",
  inBreve: [
    "Svegliarsi qualche volta per notte capita a tutti e spesso non si ricorda. Diventa un problema quando si resta svegli a lungo, o ci si sveglia all'alba senza riaddormentarsi.",
    "Dietro i risvegli ci possono essere l'insonnia, ma anche il bisogno di urinare, il dolore, il reflusso, le apnee notturne, l'alcol della sera.",
    "Il diario del sonno di due settimane aiuta il medico a capire quale strada seguire.",
  ],
  sezioni: [
    {
      id: "normali",
      kicker: "Per capire",
      titolo: "Quanti risvegli sono normali",
      blocchi: [
        {
          p: "Il sonno è fatto di cicli di circa 90 minuti. Alla fine di ogni ciclo il sonno si alleggerisce, e brevi risvegli di pochi secondi sono del tutto normali: la maggior parte non lascia ricordo. Con l'età il sonno profondo diminuisce e i risvegli diventano più frequenti e più consapevoli: a 70 anni è comune svegliarsi due o tre volte.",
        },
        {
          p: "Si parla di insonnia di mantenimento quando, quasi tutte le notti, si resta svegli a lungo (nelle ricerche, più di 30 minuti in tutto) e di giorno se ne pagano le conseguenze. Il risveglio precoce, invece, è quando ci si sveglia molto prima della sveglia, per esempio alle 4, e il sonno non torna più.",
        },
        { disegno: "ipnogramma" },
      ],
    },
    {
      id: "cause",
      kicker: "Che cosa c'è dietro",
      titolo: "Le cause più frequenti",
      blocchi: [
        {
          tabella: {
            colonne: ["Che cosa noti", "Che cosa può esserci dietro"],
            righe: [
              ["Ti svegli per andare in bagno, più volte", "Nicturia: liquidi la sera, prostata, diabete, scompenso, alcuni diuretici. È da riferire al medico."],
              ["Ti svegli con il fiato corto, sudato o con la bocca secca; chi dorme con te ti sente russare", "Apnee ostruttive del sonno"],
              ["Bruciore o sapore acido salendo in gola", "Reflusso gastroesofageo, peggiorato da cena abbondante e tardi"],
              ["Dolore che ti sveglia (schiena, articolazioni)", "Il dolore frammenta il sonno; va gestito con chi ti cura"],
              ["Ti svegli dopo l'alcol della sera, verso le 3-4", "L'alcol fa addormentare prima ma rende più leggera e frammentata la seconda metà della notte"],
              ["Risvegli all'alba con pensieri cupi, poca voglia di tutto", "Un periodo di umore basso: il risveglio precoce è uno dei segni da riferire"],
              ["Caldo, vampate, sudorazioni notturne", "Menopausa, ma anche altre cause da far valutare se sono nuove"],
            ],
          },
          nota: "La tabella aiuta a orientarsi, non a capire la causa nel tuo caso: per quello serve il medico.",
        },
      ],
    },
    {
      id: "nel-risveglio",
      kicker: "Nel momento",
      titolo: "Che cosa fare quando ti svegli",
      blocchi: [
        {
          punti: [
            "Non guardare l'ora: sapere che sono le 3:12 accende il calcolo delle ore che restano e l'ansia.",
            "Se ti senti agitato e il sonno non torna dopo un tempo che sembra lungo, alzati, vai in un'altra stanza con luce bassa e fai qualcosa di noioso. Torna a letto quando il sonno arriva.",
            "Evita il telefono e il cibo: insegnano all'orologio interno che a quell'ora si è svegli.",
            "Alzati comunque all'ora solita: recuperare dormendo fino a tardi rende più difficile la notte dopo.",
          ],
          stile: "numeri",
        },
        {
          riquadro: {
            tono: "nota",
            titolo: "Il risveglio precoce merita una domanda in più",
            testo: "Svegliarsi molto presto ogni mattina, con tristezza o perdita di interesse per le cose, è un segno che il medico vuole conoscere: in quel caso curare l'umore aiuta anche il sonno. Se compaiono pensieri di farti del male, chiama il 112.",
          },
        },
      ],
    },
    {
      id: "misurare",
      kicker: "Misurare",
      titolo: "Due numeri da segnare nel diario",
      blocchi: [
        {
          p: "Per i risvegli, al medico servono due informazioni che spesso si ricordano male: quanti minuti in tutto sei rimasto sveglio durante la notte, e a che ora ti sei svegliato l'ultima volta, se prima di alzarti. Il diario del sonno di Cura Privata ha due caselle apposta, facoltative: con queste il sito calcola il sonno stimato e l'efficienza del sonno, cioè quanta parte del tempo a letto passi dormendo.",
        },
        { vai: { href: "/malattie/sonno/percorso-due-settimane", titolo: "Il percorso di due settimane", testo: "Autovalutazione, diario ogni mattina, foglio per il medico: come funziona." } },
      ],
    },
  ],
  quandoChiamare: {
    subito: ["Pensieri di farti del male o di non voler più vivere: chiama il 112 o fatti accompagnare al pronto soccorso.", "Ti svegli con dolore al petto, fiato molto corto o una debolezza improvvisa di un braccio o del viso."],
    presto: [
      "Ti svegli più volte a notte per urinare, ed è una novità.",
      "Sudorazioni notturne abbondanti senza una causa chiara, o con calo di peso.",
      "Chi dorme con te nota pause del respiro.",
    ],
  },
  autovalutazione: "autovalutazione-insonnia",
  domande: [
    "I miei risvegli possono dipendere da un disturbo da cercare (apnee, prostata, reflusso, dolore)?",
    "I farmaci che prendo la sera possono svegliarmi di notte?",
    "Il risveglio precoce può avere a che fare con l'umore?",
    "Ha senso un esame del sonno nel mio caso?",
  ],
  faq: [
    {
      d: "Mi sveglio sempre alla stessa ora: perché?",
      r: "Spesso è la fine di un ciclo di sonno che cade alla stessa ora perché gli orari sono regolari, e il controllo dell'orologio rinforza l'abitudine. A volte c'è un motivo preciso (la vescica, un rumore, il riscaldamento che parte): il diario aiuta a scoprirlo.",
    },
    {
      d: "È vero che una volta si dormiva in due turni?",
      r: "Alcuni storici hanno descritto un «primo» e un «secondo» sonno nell'Europa preindustriale. È un'ipotesi interessante, ma non significa che restare svegli a lungo ogni notte sia normale oggi: se ti fa stare male di giorno, vale la pena parlarne.",
    },
  ],
  correlate: ["percorso-due-settimane", "non-mi-addormento", "russo-e-sono-stanco", "come-funziona-il-sonno"],
  ricerche: ["mi sveglio di notte", "risvegli notturni frequenti", "mi sveglio alle 3", "mi sveglio alle 4", "risveglio precoce", "non riesco a riaddormentarmi", "sonno interrotto"],
  fonti: [ESRS, NHS_INSONNIA, ISS_INSONNIA, { ente: "MedlinePlus (NIH)", titolo: "Healthy Sleep", url: "https://medlineplus.gov/healthysleep.html" }],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const RUSSO_E_SONO_STANCO: SonnoPagina = {
  slug: "russo-e-sono-stanco",
  tipo: "problema",
  porta: "Russo e sono stanco",
  icona: "s-russare",
  riga: "Russare forte, pause del respiro, sonno di giorno: i segni delle apnee notturne e perché conviene parlarne presto.",
  seoTitle: "Russo e sono stanco: possono essere apnee?",
  metaDescription: "Russare forte, pause del respiro e sonnolenza di giorno sono i segni tipici delle apnee notturne. Che cosa fare, che esame si fa e perché non trascurarle.",
  titolo: "Russo e sono stanco:",
  em: "il segnale che vale una visita.",
  inBreve: [
    "Russare forte con pause del respiro, sbuffi e sonno durante il giorno sono i segni tipici delle apnee ostruttive del sonno.",
    "Sono molto comuni dopo i 50 anni e con il sovrappeso, spesso non riconosciute. Non curate, si associano a pressione alta, problemi di cuore e incidenti alla guida.",
    "Si studiano con un esame del sonno, anche a casa, e si possono curare: il primo passo è parlarne con il medico.",
  ],
  sezioni: [
    {
      id: "che-succede",
      kicker: "Per capire",
      titolo: "Che cosa succede di notte",
      blocchi: [
        {
          p: "Durante il sonno i muscoli della gola si rilassano. In alcune persone le pareti della gola si avvicinano fino a vibrare (il russare) o a chiudersi del tutto per dieci secondi o più: è un'apnea. Il respiro riprende quando il cervello, allarmato dal calo di ossigeno, provoca un micro-risveglio, spesso con uno sbuffo. Può succedere decine di volte all'ora, senza che la persona se ne accorga.",
        },
        {
          p: "Il risultato è un sonno spezzettato anche quando sembra lungo: ci si sveglia stanchi, con mal di testa, bocca secca, e durante il giorno ci si addormenta facilmente. Chi dorme accanto, spesso, è il primo ad accorgersene.",
        },
      ],
    },
    {
      id: "segni",
      kicker: "I segni",
      titolo: "Russare semplice o apnee?",
      blocchi: [
        {
          tabella: {
            colonne: ["Russare semplice", "Possibili apnee"],
            righe: [
              ["Russare regolare, anche forte", "Russare forte e irregolare, con silenzi e poi sbuffi o «soffocamenti»"],
              ["Ci si sveglia riposati", "Ci si sveglia stanchi anche dopo molte ore a letto"],
              ["Di giorno nessun sonno anomalo", "Sonno di giorno, colpi di sonno alla guida, concentrazione scarsa"],
              ["—", "Mal di testa al mattino, bocca secca, bisogno di urinare di notte"],
              ["—", "Pressione alta difficile da tenere sotto controllo"],
            ],
          },
          nota: "Le apnee sono più frequenti negli uomini, dopo la menopausa nelle donne, dopo i 50 anni, con il sovrappeso, il collo largo, il naso chiuso, le tonsille grandi.",
        },
        {
          riquadro: {
            tono: "attenzione",
            titolo: "Sonno alla guida: fermati",
            testo: "Se ti capita di avere colpi di sonno guidando, fermati in un posto sicuro appena puoi. Il sonno alla guida è una causa importante di incidenti. Parlane con il medico in tempi brevi: nel frattempo non guidare quando hai sonno.",
          },
        },
      ],
    },
    {
      id: "perche-importa",
      kicker: "Perché importa",
      titolo: "Perché conviene non aspettare",
      blocchi: [
        {
          p: "Le apnee ostruttive non curate, soprattutto quelle moderate e gravi, si associano a pressione alta, fibrillazione atriale, ictus, diabete di tipo 2 e incidenti stradali e sul lavoro. Le cure riducono la sonnolenza e migliorano la qualità della vita; sulla pressione l'effetto c'è ma in genere è contenuto.",
        },
        {
          p: "In Italia, come in tutta l'Unione europea, le apnee ostruttive moderate o gravi con sonnolenza importante contano per l'idoneità alla guida (direttiva 2014/85/UE): chi ha la diagnosi viene valutato e, con una cura efficace e i controlli, di norma può continuare a guidare.",
        },
        { vai: { href: "/malattie/sonno/apnee-notturne", titolo: "Le apnee notturne, spiegate per bene", testo: "Che cosa sono, come si misurano, quali cure esistono." } },
      ],
    },
    {
      id: "esame",
      kicker: "Il percorso",
      titolo: "Che cosa succede dal medico",
      blocchi: [
        {
          punti: [
            "Il medico ti fa domande sul sonno e sulla sonnolenza, misura pressione, peso e circonferenza del collo, guarda naso e gola.",
            "Se il sospetto è concreto, propone un esame del sonno: spesso un monitoraggio cardiorespiratorio a casa, a volte una polisonnografia in un centro del sonno.",
            "Con il referto in mano, lo specialista (pneumologo, neurologo, otorino o medico del sonno) spiega il risultato e le possibilità di cura.",
          ],
          stile: "numeri",
        },
        { vai: { href: "/malattie/sonno/esame-del-sonno", titolo: "L'esame del sonno e il suo referto", testo: "Come si fa a casa o in ospedale, e come leggere IAH, ODI, saturazione." } },
      ],
    },
  ],
  quandoChiamare: {
    subito: ["Una persona che di notte smette di respirare a lungo, diventa bluastra o non si riesce a svegliare: chiama il 112."],
    presto: [
      "Colpi di sonno alla guida o al lavoro: parlane con il medico in tempi brevi, e nel frattempo non guidare con sonno.",
      "Chi dorme con te nota pause del respiro.",
      "Pressione alta che resta alta nonostante le cure.",
    ],
  },
  autovalutazione: "autovalutazione-apnee",
  domande: [
    "I miei segni fanno pensare alle apnee notturne? Serve un esame del sonno?",
    "L'esame si può fare a casa o serve il centro del sonno?",
    "Quanto aspetto per l'esame, e nel frattempo posso guidare?",
    "Il mio peso, il naso chiuso o i farmaci che prendo possono avere un ruolo?",
  ],
  faq: [
    {
      d: "Le app che registrano il russare servono?",
      r: "Possono aiutare a far sentire al medico come russi e se ci sono silenzi e sbuffi, ma non misurano il respiro né l'ossigeno: non sostituiscono l'esame del sonno.",
    },
    {
      d: "Anche le donne hanno le apnee?",
      r: "Sì. Prima della menopausa sono meno frequenti, poi la differenza con gli uomini si riduce. Nelle donne i segni sono spesso meno tipici: più stanchezza, insonnia e mal di testa al mattino che russare forte.",
    },
    {
      d: "I bambini che russano?",
      r: "Un bambino che russa quasi ogni notte, respira a bocca aperta o fa pause del respiro va fatto vedere dal pediatra: spesso c'entrano tonsille e adenoidi.",
    },
  ],
  correlate: ["apnee-notturne", "esame-del-sonno", "quando-andare-dal-medico"],
  ricerche: ["russo", "russare forte", "russare e stanchezza", "sonnolenza diurna", "stanco al mattino", "pause del respiro", "mi addormento di giorno", "colpi di sonno"],
  fonti: [
    NHS_APNEE,
    { ente: "MedlinePlus (NIH)", titolo: "Sleep Apnea", url: "https://medlineplus.gov/sleepapnea.html" },
    { ente: "Unione europea", titolo: "Direttiva 2014/85/UE sulla patente di guida (apnee ostruttive del sonno)", url: "https://eur-lex.europa.eu/eli/dir/2014/85/oj" },
    { ente: "American Academy of Sleep Medicine", titolo: "Sleep Education: apnee ostruttive del sonno", url: "https://sleepeducation.org" },
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const LAVORO_A_TURNI: SonnoPagina = {
  slug: "lavoro-a-turni",
  tipo: "problema",
  porta: "Lavoro a turni",
  icona: "s-turni",
  riga: "Notti, turni che ruotano, sonno di giorno: perché l'orologio interno protesta e che cosa aiuta a proteggere il sonno.",
  seoTitle: "Lavoro a turni e sonno: come dormire meglio",
  metaDescription: "Turni di notte e turni che ruotano mettono in difficoltà l'orologio interno. Che cosa succede, come proteggere il sonno di giorno, quando sentire il medico.",
  titolo: "Lavoro a turni:",
  em: "dormire quando il mondo è sveglio.",
  inBreve: [
    "Chi lavora di notte o a turni chiede al corpo di dormire quando l'orologio interno dice «giorno»: il sonno è più corto e più leggero.",
    "Luce, buio, orari dei pasti e pisolini usati al momento giusto aiutano l'orologio a seguire i turni.",
    "Insonnia o sonno che non passano, o colpi di sonno alla guida verso casa, sono un motivo per parlarne con il medico, anche con il medico competente del lavoro.",
  ],
  sezioni: [
    {
      id: "orologio",
      kicker: "Per capire",
      titolo: "Perché è così difficile",
      blocchi: [
        {
          p: "L'orologio interno si regola soprattutto con la luce. Dopo un turno di notte, tornando a casa al mattino, la luce del giorno gli dice «sveglia»: il sonno che segue è di solito più corto di una o due ore e più leggero. Nel cuore della notte, invece, verso le 3-5, l'orologio spinge verso il sonno: è il momento della giornata in cui attenzione e riflessi sono al minimo.",
        },
        {
          p: "Alcune persone si adattano bene, altre molto meno. Quando insonnia o sonnolenza eccessiva legate ai turni durano almeno tre mesi e fanno stare male, i medici del sonno parlano di disturbo da lavoro a turni.",
        },
        { disegno: "due-processi" },
      ],
    },
    {
      id: "cosa-aiuta",
      kicker: "Che cosa aiuta",
      titolo: "Proteggere il sonno di giorno",
      blocchi: [
        {
          punti: [
            "Camera buia davvero (tende oscuranti o mascherina), silenziosa (tappi, telefono in modalità notte), fresca.",
            "Occhiali da sole sul tragitto di ritorno dopo la notte: meno luce al mattino, più facile addormentarsi.",
            "Un blocco di sonno principale sempre alla stessa ora nei giorni di notte, più un pisolino breve se serve.",
            "Un pisolino prima del primo turno di notte, nel pomeriggio, riduce la sonnolenza nelle ore difficili.",
            "Luce intensa nella prima parte del turno di notte, se l'ambiente di lavoro lo permette.",
            "Caffè all'inizio del turno, non nelle ultime ore: il sonno al rientro ne soffrirebbe.",
            "Pasti leggeri durante la notte, e lontano dall'ora in cui andrai a dormire.",
          ],
          stile: "segni",
        },
        {
          riquadro: {
            tono: "attenzione",
            titolo: "Il viaggio di ritorno",
            testo: "Dopo una notte di lavoro il rischio di colpi di sonno alla guida è alto. Se ti senti assonnato, non metterti alla guida: un pisolino di 15-20 minuti prima di partire, un passaggio o i mezzi pubblici sono scelte più sicure.",
          },
        },
      ],
    },
    {
      id: "turni",
      kicker: "L'organizzazione",
      titolo: "Che cosa dicono gli studi sui turni",
      blocchi: [
        {
          p: "Gli studi sull'organizzazione del lavoro indicano che i turni che ruotano «in avanti» (mattina, poi pomeriggio, poi notte) sono più facili da sopportare di quelli che ruotano all'indietro, che poche notti di fila pesano meno di molte, e che servono almeno due giorni di riposo dopo una serie di notti. Sono scelte dell'organizzazione, non della persona, ma è utile conoscerle per parlarne con il medico competente.",
        },
        {
          p: "Nel lungo periodo il lavoro notturno si associa a più disturbi del sonno, dell'umore, della digestione e del metabolismo. Il medico competente e il medico di famiglia sono le persone giuste con cui fare il punto, soprattutto se compaiono altri problemi di salute.",
        },
      ],
    },
    {
      id: "melatonina",
      kicker: "Farmaci",
      titolo: "Melatonina e farmaci per stare svegli",
      blocchi: [
        {
          p: "La melatonina e i farmaci che aiutano a restare svegli sono a volte usati nel lavoro a turni, ma le prove sono limitate e i tempi di assunzione contano molto: è un argomento da affrontare con il medico, che conosce le altre cure e i turni reali.",
        },
        { vai: { href: "/malattie/sonno/farmaci-e-melatonina", titolo: "Farmaci per dormire e melatonina, spiegati", testo: "Che cosa sono, che cosa dicono le linee guida, perché decide il medico." } },
      ],
    },
  ],
  quandoChiamare: {
    subito: ["Un colpo di sonno alla guida con un incidente o un quasi incidente, con ferite o malessere: chiama il 112."],
    presto: [
      "Colpi di sonno alla guida o durante il lavoro, anche senza conseguenze.",
      "Insonnia o sonnolenza che durano da mesi e non migliorano nei giorni liberi.",
      "Umore basso, irritabilità, difficoltà di concentrazione che peggiorano.",
    ],
  },
  autovalutazione: "autovalutazione-sonnolenza",
  domande: [
    "Il mio modo di dormire dopo le notti è compatibile con il mio lavoro, o serve un aiuto?",
    "Ha senso parlarne con il medico competente per i turni?",
    "La melatonina potrebbe avere un ruolo nel mio caso, e a che ora?",
    "La sonnolenza che ho può dipendere anche da altro, per esempio dalle apnee?",
  ],
  faq: [
    {
      d: "Nei giorni liberi devo tornare agli orari normali?",
      r: "Dipende dal tipo di turni. Molti trovano utile un compromesso: andare a letto un po' più tardi e alzarsi un po' più tardi nei giorni liberi, senza ribaltare del tutto gli orari. Il diario del sonno aiuta a capire che cosa funziona per te.",
    },
    {
      d: "Quanto deve durare il pisolino durante la pausa?",
      r: "In genere si consigliano pisolini brevi, di 15-20 minuti: si evita di entrare nel sonno profondo e di svegliarsi intontiti. Dove il lavoro lo permette, è una delle misure più studiate.",
    },
  ],
  correlate: ["come-funziona-il-sonno", "percorso-due-settimane", "russo-e-sono-stanco"],
  ricerche: ["lavoro a turni", "turni di notte", "dormire di giorno", "turnista sonno", "lavoro notturno sonno", "infermiere turni dormire"],
  fonti: [
    { ente: "American Academy of Sleep Medicine", titolo: "Sleep Education: disturbo da lavoro a turni", url: "https://sleepeducation.org" },
    { ente: "NIOSH (CDC)", titolo: "Work schedules: shift work and long hours", url: "https://www.cdc.gov/niosh/" },
    ESRS,
    AIMS,
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const GAMBE_SENZA_RIPOSO: SonnoPagina = {
  slug: "gambe-senza-riposo",
  tipo: "problema",
  porta: "Gambe senza riposo",
  icona: "s-gambe",
  riga: "Bisogno di muovere le gambe la sera, a letto: i quattro segni tipici, il legame con il ferro e quando parlarne.",
  seoTitle: "Gambe senza riposo: sintomi e cosa fare",
  metaDescription: "Bisogno irresistibile di muovere le gambe la sera? I quattro segni tipici della sindrome delle gambe senza riposo, il ruolo del ferro, quando parlarne.",
  titolo: "Gambe senza riposo:",
  em: "quando le gambe non vogliono stare ferme.",
  inBreve: [
    "La sindrome delle gambe senza riposo dà un bisogno forte di muovere le gambe, con fastidio, quando si sta fermi la sera o a letto. Muovendosi passa.",
    "Riguarda alcune persone su cento, più spesso le donne, in gravidanza, con poco ferro o con malattie dei reni.",
    "Si riconosce da quattro segni tipici: il medico li verifica, controlla il ferro e i farmaci che prendi e, se serve, propone una cura.",
  ],
  sezioni: [
    {
      id: "segni",
      kicker: "I segni",
      titolo: "I quattro segni tipici",
      blocchi: [
        {
          punti: [
            "Un bisogno forte di muovere le gambe, quasi sempre con una sensazione sgradevole: formicolio, «tirare», «scosse» dentro, a volte difficile da descrivere.",
            "Il bisogno compare o peggiora quando sei fermo: seduto, sdraiato, in auto, al cinema.",
            "Muovendoti, camminando o stirando le gambe il fastidio passa, almeno finché ti muovi.",
            "È più forte la sera e la notte, mentre al mattino è assente o molto più leggero.",
          ],
          stile: "numeri",
        },
        {
          p: "Il gruppo internazionale di studio (IRLSSG) descrive la sindrome con questi segni, più un quinto: che non siano spiegati da altro, come crampi, posizioni scomode, gonfiore o dolori articolari. È il medico a fare questa distinzione. Molte persone hanno anche piccoli scatti ripetuti delle gambe durante il sonno, che chi dorme accanto nota.",
        },
      ],
    },
    {
      id: "cause",
      kicker: "Che cosa c'entra",
      titolo: "Ferro, gravidanza, farmaci",
      blocchi: [
        {
          p: "In molte persone la sindrome è di famiglia. In altre compare o peggiora con condizioni precise: poco ferro nelle riserve (si misura con la ferritina), gravidanza (soprattutto negli ultimi mesi, di solito passa dopo il parto), malattia renale cronica, neuropatie. Il ferro ha un ruolo particolare: nel cervello serve per la dopamina, e gli specialisti delle gambe senza riposo leggono la ferritina con soglie diverse da quelle usate per l'anemia.",
        },
        {
          p: "Alcuni farmaci possono peggiorare i sintomi: certi antistaminici che fanno venire sonno (anche quelli da banco per dormire), alcuni antidepressivi, alcuni farmaci contro la nausea. Non vanno lasciati di tua iniziativa: segnalali al medico, che valuta se ci sono alternative.",
        },
        { vai: { href: "/guide/ferritina", titolo: "La ferritina, spiegata", testo: "Che cosa misura, come si legge nel referto, che cosa chiedere al medico." } },
      ],
    },
    {
      id: "cosa-aiuta",
      kicker: "Che cosa aiuta",
      titolo: "Abitudini e cure",
      blocchi: [
        {
          punti: [
            "Muoversi di giorno, con un'attività regolare e non troppo intensa la sera.",
            "Stretching, un massaggio o un bagno caldo prima di dormire: aiutano alcune persone.",
            "Meno caffeina, alcol e fumo, che in molti peggiorano i sintomi.",
            "Tenere la mente occupata nei momenti fermi (un cruciverba, un lavoro manuale) a volte riduce il fastidio.",
          ],
          stile: "segni",
        },
        {
          p: "Quando i sintomi disturbano il sonno, il medico può proporre di correggere il ferro, se è basso, e valutare una cura. Alcuni farmaci usati in passato come prima scelta, se presi a lungo, possono peggiorare i sintomi (lo chiamano «augmentation»): per questo la cura va seguita nel tempo con il medico o il neurologo.",
        },
      ],
    },
  ],
  quandoChiamare: {
    subito: ["Gamba gonfia, calda, dolente da un lato solo, con fiato corto: può essere una trombosi, chiama il 112."],
    presto: [
      "I sintomi ti tolgono il sonno più notti a settimana.",
      "I sintomi sono comparsi in gravidanza o dopo un nuovo farmaco.",
      "Formicolii o debolezza che ci sono anche di giorno, al mattino, o che salgono verso l'alto.",
    ],
  },
  autovalutazione: "autovalutazione-gambe",
  domande: [
    "I miei sintomi corrispondono alle gambe senza riposo o a qualcos'altro?",
    "Ha senso controllare la ferritina e il ferro?",
    "Qualcuno dei farmaci che prendo può peggiorare i sintomi?",
    "Se serve una cura, come si controlla nel tempo che non peggiori i sintomi?",
  ],
  faq: [
    {
      d: "Sono crampi?",
      r: "I crampi sono contrazioni dolorose di un muscolo, che si sente duro, e passano stirandolo. Nelle gambe senza riposo il muscolo non si contrae: c'è un bisogno di muoversi con un fastidio più vago, che passa muovendosi e torna appena ci si ferma.",
    },
    {
      d: "Posso prendere il ferro da solo?",
      r: "No, meglio di no senza esami: il ferro in eccesso fa male e non tutte le gambe senza riposo dipendono dal ferro. Il medico decide se e come correggerlo dopo aver visto ferritina e ferro.",
    },
  ],
  correlate: ["non-mi-addormento", "quando-andare-dal-medico", "farmaci-e-melatonina"],
  ricerche: ["gambe senza riposo", "sindrome delle gambe senza riposo", "gambe irrequiete", "formicolio gambe a letto", "muovere le gambe di notte", "restless legs", "willis ekbom"],
  fonti: [
    { ente: "NHS", titolo: "Restless legs syndrome", url: "https://www.nhs.uk/conditions/restless-legs-syndrome/" },
    { ente: "MedlinePlus (NIH)", titolo: "Restless Legs", url: "https://medlineplus.gov/restlesslegs.html" },
    { ente: "International RLS Study Group (IRLSSG)", titolo: "Criteri diagnostici e materiali", url: "https://irlssg.org" },
    AIMS,
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

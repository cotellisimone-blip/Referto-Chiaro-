import type { SonnoPagina } from "./schema";

/**
 * Sezione sonno, le pagine tecniche (22/11/2026): come funziona il sonno, la terapia cognitivo-comportamentale, i
 * farmaci, le apnee, l'esame del sonno e il suo referto, quando andare dal medico. Spiegano: non prescrivono. In
 * particolare la pagina della CBT-I descrive la restrizione del sonno come principio, senza calcolare orari per chi
 * legge (vedi SONNO_EXTRA_FORBIDDEN). Bozze in attesa di firma medica.
 */

const BOZZA = { stato: "bozza" } as const;
const OGGI = "2026-11-22";

const ESRS = { ente: "European Sleep Research Society (ESRS)", titolo: "European Insomnia Guideline 2023, J Sleep Res 2023", url: "https://onlinelibrary.wiley.com/doi/10.1111/jsr.14035" };
const NHS_APNEE = { ente: "NHS", titolo: "Sleep apnoea", url: "https://www.nhs.uk/conditions/sleep-apnoea/" };
const AASM_SCORING = { ente: "American Academy of Sleep Medicine", titolo: "AASM Manual for the Scoring of Sleep and Associated Events", url: "https://aasm.org/clinical-resources/scoring-manual/" };
const AASM_OSA_TEST = {
  ente: "American Academy of Sleep Medicine, J Clin Sleep Med 2017",
  titolo: "Clinical practice guideline for diagnostic testing for adult obstructive sleep apnea",
  url: "https://jcsm.aasm.org/doi/10.5664/jcsm.6506",
};
const AIMS = { ente: "Associazione italiana di medicina del sonno (AIMS)", titolo: "Materiali per i pazienti sul sonno", url: "https://www.sonnomed.it" };

export const COME_FUNZIONA: SonnoPagina = {
  slug: "come-funziona-il-sonno",
  tipo: "spiegazione",
  porta: "Come funziona il sonno",
  icona: "s-onde",
  riga: "Pressione del sonno e orologio interno, fasi e cicli, che cosa cambia con l'età: la base per capire tutto il resto.",
  seoTitle: "Come funziona il sonno: fasi, cicli e orologio",
  metaDescription: "Le due forze che regolano il sonno, le fasi (leggero, profondo, REM), i cicli di 90 minuti e come cambia il sonno con l'età. Spiegato in parole semplici.",
  titolo: "Come funziona il sonno:",
  em: "due forze, quattro fasi, cinque cicli.",
  inBreve: [
    "Il sonno è regolato da due forze: la pressione del sonno, che cresce con le ore da svegli, e l'orologio interno, che segue la luce.",
    "Una notte è fatta di 4-6 cicli di circa 90 minuti: sonno leggero, profondo e REM, quello dei sogni più vividi.",
    "Con l'età il sonno profondo diminuisce e i risvegli aumentano: succede a tutti, e non sempre è insonnia.",
  ],
  sezioni: [
    {
      id: "due-forze",
      kicker: "Le due forze",
      titolo: "Pressione del sonno e orologio interno",
      blocchi: [
        {
          p: "La prima forza è la pressione del sonno. Più ore si resta svegli, più nel cervello si accumulano sostanze (tra cui l'adenosina) che spingono verso il sonno. Dormire la scarica. La caffeina funziona proprio bloccando l'adenosina: per questo un caffè nel pomeriggio può pesare sulla sera, perché il suo effetto dura molte ore.",
        },
        {
          p: "La seconda forza è l'orologio interno, o ritmo circadiano: un insieme di cellule del cervello, sopra l'incrocio dei nervi ottici, che scandisce le 24 ore e regola sonno, temperatura, ormoni. Si sincronizza soprattutto con la luce del mattino. La sera, al buio, il corpo produce melatonina, il segnale chimico della notte.",
        },
        { disegno: "due-processi" },
        {
          p: "Ci si addormenta bene quando le due forze sono d'accordo: tanta pressione e orologio sulla «notte». Ecco perché un pisolino lungo, andare a letto troppo presto o un orologio spostato (jet lag, turni, adolescenza) rendono difficile addormentarsi anche quando si è stanchi.",
        },
      ],
    },
    {
      id: "fasi",
      kicker: "Le fasi",
      titolo: "Che cosa succede in una notte",
      blocchi: [
        {
          tabella: {
            colonne: ["Fase", "Che cosa succede", "Quanto, in un adulto"],
            righe: [
              ["N1, addormentamento", "Passaggio dalla veglia al sonno, ci si sveglia facilmente", "Pochi minuti per ciclo"],
              ["N2, sonno leggero", "Il corpo rallenta, la temperatura scende; è la fase più lunga", "Circa metà della notte"],
              ["N3, sonno profondo", "Onde lente nel cervello; è difficile svegliarsi; serve a recuperare", "Soprattutto nella prima metà della notte"],
              ["REM", "Occhi che si muovono, muscoli rilassati, sogni vividi; serve a memoria ed emozioni", "Soprattutto verso il mattino"],
            ],
          },
          nota: "Le fasi le distingue la polisonnografia, che registra l'attività del cervello. Gli orologi e gli anelli le stimano dal movimento e dal battito: utili per le abitudini, meno precisi sulle fasi.",
        },
        { disegno: "ipnogramma" },
        {
          p: "Il disegno si chiama ipnogramma: è il modo in cui il medico del sonno vede una notte. Si notano i cicli, il sonno profondo concentrato all'inizio, il REM che si allunga verso il mattino, e i brevi risvegli tra un ciclo e l'altro, che di solito non si ricordano.",
        },
      ],
    },
    {
      id: "eta",
      kicker: "Con gli anni",
      titolo: "Come cambia il sonno con l'età",
      blocchi: [
        {
          punti: [
            "Adolescenti: l'orologio si sposta in avanti, si ha sonno più tardi e si fatica al mattino. Non è pigrizia.",
            "Adulti: per la maggior parte servono almeno 7 ore; il bisogno varia da persona a persona.",
            "Dopo i 60 anni: meno sonno profondo, più risvegli, orologio spostato indietro (sonno presto la sera, risveglio presto).",
            "In menopausa: vampate e sudorazioni possono spezzare il sonno; aumentano anche le apnee notturne.",
          ],
          stile: "segni",
        },
        {
          riquadro: {
            tono: "nota",
            titolo: "Quante ore servono davvero",
            testo: "Le società scientifiche indicano per gli adulti almeno 7 ore a notte, in media tra 7 e 9. Il numero giusto è quello con cui ti senti sveglio e in forma di giorno, senza bisogno di recuperare nel fine settimana.",
          },
        },
      ],
    },
    {
      id: "misure",
      kicker: "I numeri del diario",
      titolo: "Tempo a letto, sonno ed efficienza",
      blocchi: [
        {
          p: "Nel diario del sonno si usano poche misure, le stesse del diario di consenso usato nella ricerca (Consensus Sleep Diary): il tempo a letto (da quando spegni la luce a quando ti alzi), il tempo per addormentarti, i minuti svegli durante la notte, l'ora dell'ultimo risveglio. Da qui si ricava il sonno stimato.",
        },
        {
          p: "L'efficienza del sonno è la parte del tempo a letto passata dormendo: 6 ore di sonno su 8 a letto fanno il 75%. Nelle ricerche sull'insonnia valori sotto l'85% sono considerati bassi, ma il numero da solo non dice se c'è un disturbo: va letto con il medico, insieme a come stai di giorno.",
        },
        { vai: { href: "/prenditi-cura-di-te/sonno/percorso-due-settimane", titolo: "Calcolali sulle tue notti", testo: "Due settimane di diario: il sito fa i conti e prepara il foglio per il medico." } },
      ],
    },
  ],
  domande: [
    "Le ore che dormo bastano per me?",
    "Il mio orologio interno è spostato in avanti o indietro?",
    "I dati del mio orologio o anello sono attendibili per le fasi del sonno?",
  ],
  faq: [
    {
      d: "Si può recuperare il sonno nel fine settimana?",
      r: "In parte sì, ma dormire molto più a lungo il sabato e la domenica sposta l'orologio interno e rende difficile la domenica sera. Gli studiosi lo chiamano «jet lag sociale»: il diario del sonno di Cura Privata calcola quanto si spostano le tue notti nel fine settimana.",
    },
    {
      d: "Sognare tanto vuol dire dormire male?",
      r: "No: si sogna ogni notte, soprattutto nel REM. Si ricordano di più i sogni quando ci si sveglia durante o subito dopo una fase REM, per esempio con un sonno più frammentato.",
    },
  ],
  correlate: ["non-mi-addormento", "mi-sveglio-di-notte", "lavoro-a-turni", "percorso-due-settimane"],
  ricerche: ["come funziona il sonno", "fasi del sonno", "sonno rem", "sonno profondo", "cicli del sonno", "ritmo circadiano", "quante ore dormire", "efficienza del sonno"],
  fonti: [
    { ente: "MedlinePlus (NIH)", titolo: "Healthy Sleep", url: "https://medlineplus.gov/healthysleep.html" },
    { ente: "Carney CE e altri, Sleep 2012", titolo: "The Consensus Sleep Diary: standardizing prospective sleep self-monitoring", url: "https://academic.oup.com/sleep/article/35/2/287/2558991" },
    AASM_SCORING,
    { ente: "American Academy of Sleep Medicine", titolo: "Sleep Education: quante ore di sonno servono", url: "https://sleepeducation.org" },
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const CBT_I: SonnoPagina = {
  slug: "terapia-cognitivo-comportamentale",
  tipo: "spiegazione",
  porta: "La terapia senza farmaci",
  icona: "s-cbti",
  riga: "La CBT-I è il primo percorso per l'insonnia cronica secondo le linee guida europee: le sue cinque parti e dove trovarla.",
  seoTitle: "Terapia cognitivo-comportamentale per l'insonnia",
  metaDescription: "La CBT-I è il primo percorso per l'insonnia cronica secondo le linee guida europee 2023. Le sue parti, quanto dura, che cosa aspettarsi e dove trovarla.",
  titolo: "La terapia cognitivo-comportamentale:",
  em: "il primo percorso per l'insonnia.",
  inBreve: [
    "La terapia cognitivo-comportamentale per l'insonnia (CBT-I) è il trattamento raccomandato come prima scelta per l'insonnia cronica negli adulti di ogni età (ESRS 2023).",
    "Lavora su orari, abitudini e pensieri che mantengono l'insonnia, in 4-8 incontri con un professionista o con programmi digitali guidati.",
    "I benefici durano nel tempo, più a lungo di quelli dei farmaci. Le prime settimane possono essere faticose: per questo va seguita da chi la conosce.",
  ],
  sezioni: [
    {
      id: "che-cose",
      kicker: "Per capire",
      titolo: "Che cos'è e perché funziona",
      blocchi: [
        {
          p: "La CBT-I non è una chiacchierata sul sonno: è un percorso strutturato, con compiti tra un incontro e l'altro e il diario del sonno come strumento principale. Parte dall'idea che l'insonnia cronica, qualunque sia stata la causa iniziale, è mantenuta da abitudini e pensieri che si possono cambiare.",
        },
        {
          p: "Le linee guida europee del 2023 (Società europea di ricerca sul sonno, ESRS) la raccomandano come primo trattamento per l'insonnia cronica, anche quando ci sono altri problemi di salute come dolore, ansia, depressione o malattie croniche. Le prove dicono che migliora il tempo per addormentarsi, i risvegli e la qualità percepita del sonno, e che i benefici restano mesi e anni dopo la fine del percorso.",
        },
      ],
    },
    {
      id: "parti",
      kicker: "Le parti",
      titolo: "Le cinque parti del percorso",
      blocchi: [
        {
          tabella: {
            colonne: ["Parte", "In che cosa consiste"],
            righe: [
              ["Conoscere il sonno", "Come funzionano pressione del sonno e orologio interno; che cosa ci si può aspettare; abitudini di base."],
              ["Controllo degli stimoli", "Ricostruire il legame tra letto e sonno: a letto solo con il sonno, alzarsi se non arriva, orario fisso per alzarsi."],
              ["Restrizione del tempo a letto", "Per un periodo si accorcia il tempo passato a letto, per avvicinarlo al sonno reale e rendere il sonno più compatto."],
              ["Lavoro sui pensieri", "Riconoscere e ridimensionare le convinzioni che alimentano l'ansia da sonno («se non dormo 8 ore sto male tutto il giorno»)."],
              ["Rilassamento", "Tecniche per abbassare l'allerta: respirazione, rilassamento muscolare, attenzione al presente."],
            ],
          },
        },
        {
          riquadro: {
            tono: "attenzione",
            titolo: "La restrizione del sonno si fa con un professionista",
            testo: "La restrizione del tempo a letto è la parte più efficace e la più delicata: all'inizio aumenta la sonnolenza di giorno. Va impostata e aggiustata settimana per settimana da chi segue il percorso, partendo dal diario. Non è adatta a tutti: per esempio con epilessia, disturbo bipolare, apnee non curate, o per chi guida per lavoro serve una valutazione in più. Per questo Cura Privata non calcola orari: ti aiuta a preparare il diario da portare.",
          },
        },
      ],
    },
    {
      id: "come-si-fa",
      kicker: "In pratica",
      titolo: "Come si svolge",
      blocchi: [
        {
          punti: [
            "Prima dell'inizio: una o due settimane di diario del sonno, per fotografare la situazione.",
            "Da 4 a 8 incontri, di solito uno a settimana, singoli o in piccoli gruppi, anche in video.",
            "Tra un incontro e l'altro: il diario ogni mattina e le indicazioni concordate.",
            "Alla fine: un piano per gestire da soli le notti storte che capiteranno ancora.",
          ],
          stile: "numeri",
        },
        {
          p: "Esistono anche programmi digitali di CBT-I, con o senza un terapeuta che segue a distanza. Le linee guida europee li considerano un'opzione valida, soprattutto dove i professionisti formati sono pochi. La qualità varia molto: conviene chiedere al medico quali sono stati studiati.",
        },
      ],
    },
    {
      id: "dove",
      kicker: "Dove trovarla",
      titolo: "A chi rivolgersi in Italia",
      blocchi: [
        {
          p: "In Italia la CBT-I la offrono psicologi e psicoterapeuti formati in medicina del sonno, alcuni centri di medicina del sonno ospedalieri e universitari, e alcuni servizi pubblici di psicologia. Il medico di famiglia può indicare le strutture della zona. L'Associazione italiana di medicina del sonno (AIMS) pubblica l'elenco dei centri del sonno accreditati.",
        },
        { vai: { href: "/prenditi-cura-di-te/sonno/percorso-due-settimane", titolo: "Prepara il diario di due settimane", testo: "È quello che il professionista ti chiederà al primo incontro." } },
      ],
    },
  ],
  domande: [
    "La CBT-I è adatta a me? Ci sono motivi per cui la restrizione del sonno andrebbe adattata?",
    "Conosce psicologi o centri del sonno che la fanno, anche online?",
    "Posso iniziarla mentre prendo un farmaco per dormire? Come si coordina?",
    "Quale programma digitale è stato studiato e potrebbe andare bene per me?",
  ],
  faq: [
    {
      d: "Funziona anche se prendo già sonniferi da anni?",
      r: "Sì, la CBT-I viene usata anche per aiutare chi vuole ridurre gradualmente i farmaci per dormire. La riduzione si decide e si segue con il medico: smettere di colpo dopo un uso lungo può dare un rimbalzo dell'insonnia.",
    },
    {
      d: "Funziona anche dopo i 70 anni?",
      r: "Sì: le linee guida europee la raccomandano per gli adulti di ogni età. Negli anziani è ancora più importante, perché i farmaci per dormire aumentano il rischio di cadute e confusione.",
    },
    {
      d: "Quanto costa?",
      r: "Dipende da chi la offre: nei servizi pubblici con il ticket, privatamente con la tariffa del professionista. Alcuni programmi digitali hanno un costo a parte. Chiedi al medico di famiglia quali strade ci sono nella tua zona.",
    },
  ],
  correlate: ["non-mi-addormento", "farmaci-e-melatonina", "percorso-due-settimane"],
  ricerche: ["cbt-i", "cbti", "terapia cognitivo comportamentale insonnia", "curare insonnia senza farmaci", "restrizione del sonno", "controllo degli stimoli", "psicologo insonnia"],
  fonti: [
    ESRS,
    { ente: "NICE", titolo: "Sleepio to treat insomnia and insomnia symptoms (MTG70): CBT-I digitale", url: "https://www.nice.org.uk/guidance/mtg70" },
    AIMS,
    { ente: "NHS", titolo: "Insomnia", url: "https://www.nhs.uk/conditions/insomnia/" },
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const FARMACI: SonnoPagina = {
  slug: "farmaci-e-melatonina",
  tipo: "spiegazione",
  porta: "Farmaci e melatonina",
  icona: "s-farmaci",
  riga: "Sonniferi, melatonina, antistaminici, prodotti da banco: che cosa sono, che cosa dicono le linee guida, perché decide il medico.",
  seoTitle: "Farmaci per dormire e melatonina: cosa sapere",
  metaDescription: "Sonniferi, melatonina, antistaminici e prodotti da banco per dormire: che cosa sono, che cosa dicono le linee guida europee e quali domande fare al medico.",
  titolo: "Farmaci e melatonina:",
  em: "che cosa sono, e perché decide il medico.",
  inBreve: [
    "Questa pagina spiega che cosa sono i farmaci per dormire: non ne consiglia nessuno. Se e quale usare lo decide il medico, che conosce la tua storia e le altre cure.",
    "Le linee guida europee li riservano a quando la terapia cognitivo-comportamentale non basta o non è disponibile, di solito per periodi brevi.",
    "Anche melatonina, antistaminici e prodotti da banco hanno effetti e interazioni: vanno detti al medico e al farmacista.",
  ],
  sezioni: [
    {
      id: "famiglie",
      kicker: "Le famiglie",
      titolo: "I farmaci per dormire, uno per uno",
      blocchi: [
        {
          tabella: {
            colonne: ["Famiglia", "Come agiscono", "Linee guida europee (ESRS 2023)"],
            righe: [
              ["Benzodiazepine e farmaci «Z» (per esempio zolpidem)", "Potenziano il freno naturale del cervello (GABA)", "Efficaci nel breve periodo; di norma non oltre 4 settimane, per il rischio di dipendenza e tolleranza"],
              ["Antagonisti dell'orexina (per esempio daridorexant)", "Spengono il segnale chimico che tiene svegli", "Possono essere usati fino a 3 mesi, a volte di più con rivalutazione del medico"],
              ["Antidepressivi sedativi a basse dosi", "Effetto sedativo, non antidepressivo, a quelle dosi", "Possibili nel breve periodo, se gli altri percorsi non bastano"],
              ["Melatonina a rilascio prolungato (farmaco con ricetta)", "Rinforza il segnale della notte", "Possibile fino a 3 mesi dopo i 55 anni"],
              ["Antistaminici sedativi (anche da banco)", "Bloccano l'istamina, danno sonnolenza", "Non raccomandati per l'insonnia: prove deboli, effetti collaterali"],
              ["Prodotti a base di erbe (valeriana e altri)", "Varie sostanze vegetali", "Non raccomandati: prove insufficienti"],
            ],
          },
          nota: "I nomi sono esempi per riconoscere la famiglia, non indicazioni. Le linee guida europee raccomandano di usare i farmaci solo se la CBT-I non è efficace o non è disponibile.",
        },
      ],
    },
    {
      id: "rischi",
      kicker: "Da sapere",
      titolo: "Gli effetti di cui parlare con il medico",
      blocchi: [
        {
          punti: [
            "Sonnolenza il giorno dopo, riflessi più lenti: attenzione alla guida, soprattutto nei primi giorni.",
            "Cadute e confusione nelle persone anziane, soprattutto di notte andando in bagno.",
            "Tolleranza e dipendenza con benzodiazepine e farmaci «Z» presi a lungo.",
            "Interazioni con alcol, oppioidi, altri sedativi, alcuni antibiotici e antifungini.",
            "Comportamenti complessi nel sonno (camminare, mangiare, persino guidare senza ricordarlo), descritti con i farmaci «Z»: vanno riferiti subito.",
            "Apnee notturne: alcuni sedativi possono peggiorarle.",
          ],
          stile: "segni",
        },
        {
          riquadro: {
            tono: "attenzione",
            titolo: "Le decisioni sulla cura restano al medico",
            testo: "Ridurre o smettere un farmaco per dormire preso da tempo si fa con il medico, con un piano graduale. Smettere di colpo può dare un rimbalzo dell'insonnia e, con alcuni farmaci, altri disturbi. La terapia cognitivo-comportamentale aiuta molto in questa fase.",
          },
        },
      ],
    },
    {
      id: "melatonina",
      kicker: "La melatonina",
      titolo: "Melatonina: quando ha senso e quando no",
      blocchi: [
        {
          p: "La melatonina è il segnale chimico della notte prodotto dal corpo. In Italia si trova in due forme: negli integratori, con quantità limitate per legge, e come farmaco con ricetta a rilascio prolungato, pensato per le persone sopra i 55 anni con insonnia.",
        },
        {
          p: "Funziona meglio come «spostatore» dell'orologio interno che come sonnifero: è studiata per il jet lag, per alcuni disturbi del ritmo (per esempio chi si addormenta solo molto tardi) e in alcune situazioni particolari. Per l'insonnia cronica le linee guida europee non raccomandano la melatonina a rilascio rapido e danno un ruolo limitato a quella a rilascio prolungato. L'ora in cui si prende conta quanto la quantità: è uno dei motivi per parlarne con il medico o il farmacista.",
        },
        { vai: { href: "/integratori", titolo: "Gli integratori, spiegati", testo: "Che cosa sono, quale esame li riguarda e che cosa chiedere al medico." } },
      ],
    },
    {
      id: "da-banco",
      kicker: "Senza ricetta",
      titolo: "Prodotti da banco e «naturali»",
      blocchi: [
        {
          p: "Molti prodotti da banco per dormire contengono antistaminici sedativi (come la doxilamina o la difenidramina). Fanno venire sonno, ma l'effetto sull'insonnia cronica è scarso e possono dare bocca secca, stitichezza, difficoltà a urinare, confusione negli anziani; possono anche peggiorare le gambe senza riposo.",
        },
        {
          p: "«Naturale» non vuol dire innocuo: anche le erbe possono avere effetti e interazioni. Porta sempre al medico l'elenco completo di quello che prendi, compresi integratori e tisane particolari.",
        },
      ],
    },
  ],
  domande: [
    "Nel mio caso un farmaco per dormire è utile? Per quanto tempo?",
    "Come si combina con le altre cure che prendo, e con l'alcol?",
    "Posso guidare il giorno dopo?",
    "Se lo prendo da tempo, come potrei ridurlo in sicurezza?",
    "La melatonina ha senso per me, e in quale forma?",
  ],
  faq: [
    {
      d: "Perché il medico non mi dà semplicemente un sonnifero?",
      r: "Perché per l'insonnia cronica i farmaci aiutano nel breve periodo ma non agiscono su ciò che la mantiene, e hanno rischi che crescono con il tempo. Le linee guida chiedono di partire dalla CBT-I e di usare i farmaci quando servono, per il tempo giusto.",
    },
    {
      d: "La melatonina crea dipendenza?",
      r: "Non dà la dipendenza delle benzodiazepine, ma non è priva di effetti: sonnolenza, mal di testa, interazioni con alcuni farmaci. In gravidanza, allattamento, nei bambini e con altre cure, chiedi sempre al medico.",
    },
  ],
  correlate: ["terapia-cognitivo-comportamentale", "non-mi-addormento", "gambe-senza-riposo"],
  ricerche: ["sonnifero", "sonniferi", "farmaci per dormire", "melatonina", "benzodiazepine", "zolpidem", "antistaminico per dormire", "valeriana", "daridorexant"],
  fonti: [
    ESRS,
    { ente: "Agenzia europea per i medicinali (EMA)", titolo: "Circadin (melatonina a rilascio prolungato): scheda del medicinale", url: "https://www.ema.europa.eu/en/medicines/human/EPAR/circadin" },
    { ente: "Agenzia europea per i medicinali (EMA)", titolo: "Quviviq (daridorexant): scheda del medicinale", url: "https://www.ema.europa.eu/en/medicines/human/EPAR/quviviq" },
    { ente: "AIFA", titolo: "Agenzia italiana del farmaco: informazioni sui medicinali", url: "https://www.aifa.gov.it" },
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const APNEE: SonnoPagina = {
  slug: "apnee-notturne",
  tipo: "spiegazione",
  porta: "Le apnee notturne",
  icona: "s-russare",
  riga: "Che cosa sono le apnee ostruttive del sonno, chi rischia, come si misura la gravità e quali cure esistono.",
  seoTitle: "Apnee notturne: cosa sono, rischi e cure",
  metaDescription: "Apnee ostruttive del sonno: che cosa sono, segni d'allarme, chi rischia di più, come si misura la gravità (IAH) e quali cure esistono, dalla CPAP al bite.",
  titolo: "Le apnee notturne:",
  em: "quando il respiro si ferma nel sonno.",
  inBreve: [
    "Nelle apnee ostruttive del sonno la gola si chiude più volte durante la notte, il respiro si ferma e l'ossigeno scende.",
    "Sono molto diffuse e poco riconosciute: in Italia si stima che riguardino milioni di adulti, molti senza saperlo.",
    "Si diagnosticano con un esame del sonno e si curano: la cura più studiata è la CPAP, ma non è l'unica.",
  ],
  sezioni: [
    {
      id: "che-cosa",
      kicker: "Per capire",
      titolo: "Apnee, ipopnee, desaturazioni",
      blocchi: [
        {
          p: "Un'apnea è una pausa del respiro di almeno 10 secondi. Un'ipopnea è un respiro molto ridotto, sempre per almeno 10 secondi, con un calo dell'ossigeno nel sangue o un micro-risveglio. La desaturazione è proprio quel calo dell'ossigeno, misurato dal saturimetro al dito.",
        },
        {
          p: "Nelle apnee ostruttive il cervello continua a comandare il respiro, ma la gola è chiusa: torace e addome si muovono «contro» un tubo bloccato. Nelle apnee centrali, più rare, è il comando del cervello che si interrompe: si vedono in alcune malattie del cuore, con certi farmaci, in alta quota.",
        },
      ],
    },
    {
      id: "gravita",
      kicker: "In numeri",
      titolo: "Come si misura la gravità",
      blocchi: [
        {
          p: "Il numero principale è l'indice di apnea-ipopnea (IAH, in inglese AHI): quanti eventi in media per ogni ora di sonno. Le soglie usate dalla medicina del sonno sono queste.",
        },
        {
          tabella: {
            colonne: ["IAH, eventi per ora", "Come si chiama"],
            righe: [
              ["Meno di 5", "Nessuna apnea significativa negli adulti"],
              ["Da 5 a 14", "Apnee lievi"],
              ["Da 15 a 29", "Apnee moderate"],
              ["30 o più", "Apnee gravi"],
            ],
          },
          nota: "Soglie dell'American Academy of Sleep Medicine, usate anche in Europa. La scelta della cura non dipende solo dal numero: contano sintomi, sonnolenza, altre malattie, lavoro.",
        },
      ],
    },
    {
      id: "rischio",
      kicker: "Chi rischia",
      titolo: "Fattori che rendono le apnee più probabili",
      blocchi: [
        {
          punti: [
            "Sovrappeso e obesità, soprattutto con grasso attorno al collo.",
            "Età sopra i 50 anni; sesso maschile; donne dopo la menopausa.",
            "Mandibola piccola o arretrata, tonsille grandi, naso spesso chiuso.",
            "Alcol la sera, sedativi, fumo.",
            "Pressione alta difficile da controllare, fibrillazione atriale, diabete di tipo 2.",
            "Dormire sulla schiena (in alcune persone le apnee ci sono quasi solo in quella posizione).",
          ],
          stile: "segni",
        },
      ],
    },
    {
      id: "cure",
      kicker: "Le cure",
      titolo: "Che cosa può proporre lo specialista",
      blocchi: [
        {
          tabella: {
            colonne: ["Cura", "In che cosa consiste"],
            righe: [
              ["CPAP", "Una piccola macchina manda aria a pressione leggera attraverso una maschera e tiene aperta la gola. È la cura più studiata per le apnee moderate e gravi."],
              ["Apparecchio di avanzamento mandibolare", "Un bite fatto su misura dal dentista o dall'ortodontista, che porta avanti la mandibola durante il sonno. Un'opzione per apnee lievi o moderate, o per chi non tollera la CPAP."],
              ["Terapia posizionale", "Dispositivi che evitano di dormire sulla schiena, quando le apnee sono legate alla posizione."],
              ["Calo di peso", "Riduce le apnee in chi è in sovrappeso; spesso si affianca alle altre cure."],
              ["Chirurgia", "In casi selezionati: naso, palato, tonsille, mandibola, o stimolazione del nervo della lingua. La valuta l'otorino o il chirurgo maxillo-facciale."],
            ],
          },
          nota: "Quale cura e quando lo decide lo specialista con te. Qui le descriviamo solo per sapere di che cosa si parla.",
        },
        {
          p: "Con la CPAP serve qualche settimana per abituarsi. I problemi più comuni (maschera che dà fastidio, naso secco, aria che esce) di solito si risolvono cambiando maschera o regolazioni: è importante parlarne con il centro che la segue invece di lasciarla nell'armadio.",
        },
      ],
    },
  ],
  quandoChiamare: {
    subito: ["Una persona che di notte smette di respirare a lungo, diventa bluastra o non si riesce a svegliare: chiama il 112."],
    presto: ["Colpi di sonno alla guida o al lavoro.", "Pause del respiro notate da chi dorme con te, con sonnolenza di giorno."],
  },
  autovalutazione: "autovalutazione-apnee",
  domande: [
    "Con i miei sintomi ha senso un esame del sonno?",
    "Con il mio IAH quali cure sono possibili per me?",
    "Che cosa posso fare se la CPAP mi dà fastidio?",
    "Le apnee possono pesare sulla mia pressione o sul mio cuore?",
  ],
  faq: [
    {
      d: "La CPAP è per sempre?",
      r: "Le apnee ostruttive sono di solito una condizione cronica e la CPAP la tiene sotto controllo finché la si usa. In alcune persone, per esempio dopo un calo di peso importante, lo specialista può rivalutare la necessità con un nuovo esame.",
    },
    {
      d: "Ci sono farmaci per le apnee?",
      r: "Per le apnee ostruttive la cura resta meccanica (CPAP, bite, posizione) o chirurgica, insieme al calo di peso quando serve. Alcuni farmaci per l'obesità hanno mostrato di ridurre le apnee: se ne parla con lo specialista.",
    },
  ],
  correlate: ["russo-e-sono-stanco", "esame-del-sonno", "quando-andare-dal-medico"],
  ricerche: ["apnee notturne", "apnea ostruttiva del sonno", "osas", "osa", "cpap", "iah", "ahi", "apnee nel sonno", "bite per russare"],
  fonti: [NHS_APNEE, AASM_SCORING, AASM_OSA_TEST, { ente: "MedlinePlus (NIH)", titolo: "Sleep Apnea", url: "https://medlineplus.gov/sleepapnea.html" }, AIMS],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const ESAME_DEL_SONNO: SonnoPagina = {
  slug: "esame-del-sonno",
  tipo: "spiegazione",
  porta: "L'esame del sonno",
  icona: "s-esame",
  riga: "Polisonnografia e monitoraggio a casa: come si fanno, come prepararsi e come leggere il referto riga per riga.",
  seoTitle: "Polisonnografia ed esame del sonno: il referto",
  metaDescription: "Polisonnografia e monitoraggio cardiorespiratorio a casa: come si fanno, come prepararsi e come leggere il referto (IAH, ODI, saturazione, T90, posizione).",
  titolo: "L'esame del sonno:",
  em: "come si fa e come si legge il referto.",
  inBreve: [
    "Per studiare le apnee si usa spesso il monitoraggio cardiorespiratorio notturno, a casa. La polisonnografia, più completa, registra anche il cervello e si fa di solito in un centro del sonno.",
    "Il numero principale del referto è l'IAH: eventi di apnea e ipopnea per ora. Accanto ci sono saturazione dell'ossigeno, ODI, posizione, russamento.",
    "Il referto si legge con lo specialista. Qui trovi il significato delle voci, per arrivare alla visita con le domande giuste.",
  ],
  sezioni: [
    {
      id: "tipi",
      kicker: "I due esami",
      titolo: "A casa o in ospedale",
      blocchi: [
        {
          tabella: {
            colonne: ["A confronto", "Monitoraggio a casa (poligrafia)", "Polisonnografia"],
            righe: [
              ["Dove", "Nel tuo letto, con un apparecchio portatile", "Di solito in un centro del sonno, a volte a casa"],
              ["Che cosa registra", "Flusso d'aria dal naso, movimenti di torace e addome, ossigeno, battito, posizione, russamento", "Tutto quello della poligrafia, più cervello (EEG), occhi, muscoli, gambe, spesso video"],
              ["Per che cosa serve", "Sospetto di apnee ostruttive moderate o gravi, senza altre malattie importanti", "Casi dubbi, altri disturbi del sonno (narcolessia, movimenti delle gambe, comportamenti nel sonno), malattie di cuore o polmoni"],
              ["Un limite", "Non sa quando dormi davvero: conta le ore di registrazione e può sottostimare", "Più impegnativa, liste d'attesa più lunghe"],
            ],
          },
          nota: "Le linee guida dell'American Academy of Sleep Medicine accettano il monitoraggio a casa per gli adulti con sospetto chiaro di apnee e senza altre malattie importanti; se è negativo ma il sospetto resta, si passa alla polisonnografia.",
        },
      ],
    },
    {
      id: "prepararsi",
      kicker: "La notte dell'esame",
      titolo: "Come prepararsi",
      blocchi: [
        {
          punti: [
            "Fai una giornata il più possibile normale: niente pisolini lunghi, caffè solo al mattino, niente alcol la sera.",
            "Prendi le cure di sempre, salvo indicazioni diverse del centro: chiedi prima se prendi farmaci per dormire.",
            "Capelli puliti e senza prodotti, se c'è l'EEG; unghie senza smalto sul dito del saturimetro.",
            "Porta il diario del sonno delle due settimane precedenti, se ce l'hai.",
            "Annota la mattina dopo com'è andata: quanto ti è sembrato di dormire, risvegli, bagno. Aiuta chi legge l'esame.",
          ],
          stile: "numeri",
        },
      ],
    },
    {
      id: "referto",
      kicker: "Il referto",
      titolo: "Le voci del referto, una per una",
      blocchi: [
        {
          tabella: {
            colonne: ["Voce", "Che cosa vuol dire"],
            righe: [
              ["IAH o AHI (indice di apnea-ipopnea)", "Apnee più ipopnee per ora di sonno. A casa a volte si chiama REI o IDR, perché è per ora di registrazione."],
              ["Apnee ostruttive, centrali, miste", "Quante pause e di che tipo: con lo sforzo del torace (ostruttive) o senza (centrali)."],
              ["ODI (indice di desaturazione)", "Quante volte all'ora l'ossigeno scende di almeno il 3 o il 4%."],
              ["SpO2 media e minima (nadir)", "L'ossigeno nel sangue in media durante la notte, e il valore più basso raggiunto."],
              ["T90", "La parte della notte passata con l'ossigeno sotto il 90%."],
              ["IAH supino e non supino", "Gli eventi sulla schiena e sui fianchi: dice se le apnee dipendono dalla posizione."],
              ["Russamento", "Quanto tempo o quanti episodi di russare sono stati registrati."],
              ["Efficienza, latenza, REM, arousal (solo polisonnografia)", "Quanta parte del tempo a letto è sonno, quanto ci hai messo ad addormentarti, quanto REM, quanti micro-risvegli."],
              ["PLM index (solo polisonnografia)", "Movimenti periodici delle gambe per ora di sonno."],
            ],
          },
          nota: "Per l'IAH negli adulti: meno di 5 nessuna apnea significativa, 5-14 lieve, 15-29 moderata, 30 o più grave (AASM). Il significato nel tuo caso lo spiega lo specialista.",
        },
        { vai: { href: "/lettura-referti", titolo: "Hai il referto in PDF o in foto?", testo: "Caricalo: ti spieghiamo ogni riga in parole semplici e prepariamo le domande per lo specialista." } },
      ],
    },
    {
      id: "dopo",
      kicker: "Dopo l'esame",
      titolo: "Che cosa succede dopo",
      blocchi: [
        {
          p: "Il tracciato viene letto e «siglato» a mano da un tecnico o da un medico del sonno, evento per evento, seguendo le regole internazionali. Poi lo specialista ti spiega il risultato e, se ci sono apnee, le possibilità di cura. Se il risultato non torna con i sintomi, può proporre un secondo esame o la polisonnografia completa.",
        },
        { vai: { href: "/prenditi-cura-di-te/sonno/apnee-notturne", titolo: "Le cure delle apnee", testo: "CPAP, bite, terapia posizionale, calo di peso, chirurgia: che cosa sono." } },
      ],
    },
  ],
  domande: [
    "Il mio IAH è stato calcolato per ora di sonno o di registrazione?",
    "Le apnee sono soprattutto ostruttive o centrali?",
    "Dipendono dalla posizione sulla schiena?",
    "I cali di ossigeno (ODI, T90) cambiano qualcosa per il mio cuore o la mia pressione?",
    "Serve una polisonnografia completa?",
  ],
  faq: [
    {
      d: "E se quella notte dormo male per via dei fili?",
      r: "Capita spesso, ed è previsto: anche una notte non perfetta di solito basta a vedere le apnee. Annota la mattina dopo come ti è sembrata la notte; se la registrazione è troppo breve, il centro la ripete.",
    },
    {
      d: "Lo smartwatch che misura l'ossigeno può sostituire l'esame?",
      r: "No. Alcuni orologi segnalano possibili apnee e possono essere un buon motivo per parlarne con il medico, ma non misurano il flusso d'aria né lo sforzo del respiro e non sono un esame diagnostico.",
    },
  ],
  correlate: ["apnee-notturne", "russo-e-sono-stanco", "come-funziona-il-sonno"],
  ricerche: ["polisonnografia", "esame del sonno", "monitoraggio cardiorespiratorio", "poligrafia", "esame apnee notturne", "referto polisonnografia", "odi", "t90", "saturazione notturna"],
  fonti: [AASM_OSA_TEST, AASM_SCORING, NHS_APNEE, AIMS],
  aggiornato: OGGI,
  revisione: BOZZA,
};

export const QUANDO_DAL_MEDICO: SonnoPagina = {
  slug: "quando-andare-dal-medico",
  tipo: "spiegazione",
  porta: "Quando andare dal medico",
  icona: "allarme",
  riga: "Quando chiamare il 112, quando sentire il medico in tempi brevi e quando basta parlarne alla prossima visita.",
  seoTitle: "Disturbi del sonno: quando andare dal medico",
  metaDescription: "Sonno alla guida, pause del respiro, comportamenti strani nel sonno, insonnia da mesi: quando chiamare il 112, quando sentire il medico e che cosa portare.",
  titolo: "Quando andare dal medico:",
  em: "i segnali da non aspettare.",
  inBreve: [
    "Alcuni segnali vanno detti al medico in tempi brevi: colpi di sonno alla guida, pause del respiro, comportamenti violenti nel sonno, sonno improvviso e irresistibile di giorno.",
    "Pensieri di farsi del male, una persona che non respira o non si sveglia: si chiama il 112.",
    "Per tutto il resto, due settimane di diario del sonno rendono la visita molto più utile.",
  ],
  sezioni: [
    {
      id: "presto",
      kicker: "Senza aspettare",
      titolo: "Da riferire al medico in tempi brevi",
      blocchi: [
        {
          punti: [
            "Colpi di sonno alla guida, o il bisogno di fermarti perché ti si chiudono gli occhi.",
            "Pause del respiro, soffocamenti o sbuffi notati da chi dorme con te.",
            "Sonno di giorno improvviso e irresistibile, anche dopo notti normali, o cedimento dei muscoli (ginocchia che si piegano) quando ridi o ti emozioni.",
            "Movimenti violenti nel sonno, come se vivessi i sogni (calci, pugni, cadere dal letto), soprattutto se comparsi dopo i 50 anni.",
            "Insonnia comparsa con tristezza, ansia, perdita di interesse, o con un nuovo farmaco.",
            "Russare, pause del respiro o sonnolenza in un bambino.",
          ],
          stile: "segni",
        },
        {
          p: "Alcuni di questi segni possono indicare disturbi specifici del sonno, come la narcolessia o il disturbo comportamentale del sonno REM, che vanno valutati da un neurologo o da un centro del sonno. Il medico di famiglia è il primo passo.",
        },
      ],
    },
    {
      id: "visita",
      kicker: "Alla prossima visita",
      titolo: "Da portare alla visita, senza fretta",
      blocchi: [
        {
          punti: [
            "Insonnia da più di tre mesi, almeno tre notti a settimana, che ti pesa di giorno.",
            "Stanchezza che non passa anche dormendo abbastanza.",
            "Bisogno di muovere le gambe la sera, che ti toglie il sonno.",
            "Uso di farmaci o prodotti per dormire da più di qualche settimana.",
            "Lavoro a turni che ti fa dormire male da mesi.",
          ],
          stile: "segni",
        },
      ],
    },
    {
      id: "cosa-portare",
      kicker: "Preparare la visita",
      titolo: "Che cosa portare",
      blocchi: [
        {
          punti: [
            "Il diario del sonno di due settimane, con il foglio per il medico.",
            "L'elenco completo di farmaci, integratori e prodotti da banco, con gli orari.",
            "Quanto caffè, tè, bevande con caffeina e alcol in una giornata tipo.",
            "Se puoi, il racconto di chi dorme con te: russare, pause, movimenti.",
            "I risultati delle autovalutazioni del sito, se le hai fatte: sono un punto di partenza per la conversazione, non un esame.",
          ],
          stile: "numeri",
        },
        { vai: { href: "/prenditi-cura-di-te/sonno/percorso-due-settimane", titolo: "Il percorso di due settimane", testo: "Autovalutazione, diario, foglio per il medico: tutto in un posto." } },
        { vai: { href: "/strumenti/preparati-alla-visita", titolo: "Preparati alla visita", testo: "Che cosa portare e che cosa chiedere, in due minuti." } },
      ],
    },
  ],
  quandoChiamare: {
    subito: [
      "Pensieri di farti del male o di non voler più vivere, anche se legati a notti senza sonno: chiama il 112.",
      "Una persona che di notte smette di respirare a lungo, diventa bluastra o non si riesce a svegliare.",
      "Confusione improvvisa, difficoltà a parlare, debolezza di un lato del corpo, al risveglio o di notte.",
      "Dolore al petto o fiato molto corto che ti sveglia.",
    ],
    presto: ["Colpi di sonno alla guida: nel frattempo non guidare quando hai sonno.", "Pause del respiro notate da chi dorme con te."],
  },
  domande: [
    "Il mio problema di sonno può dipendere da un'altra malattia o da un farmaco?",
    "Serve un esame del sonno o una visita in un centro del sonno?",
    "Posso guidare in sicurezza mentre capiamo che cosa succede?",
    "Quale percorso mi propone, e in quanto tempo?",
  ],
  faq: [
    {
      d: "Il medico di famiglia si occupa di sonno?",
      r: "Sì: è il primo riferimento. Valuta i sintomi, cerca le cause più comuni, prescrive gli esami e, se serve, invia a un centro di medicina del sonno, a un pneumologo, a un neurologo o a uno psicologo.",
    },
    {
      d: "Di notte e nei festivi a chi mi rivolgo?",
      r: "Per un'emergenza il 112. Per un problema che non può aspettare ma non è un'emergenza c'è la guardia medica, gratuita, al 116117.",
    },
  ],
  correlate: ["russo-e-sono-stanco", "percorso-due-settimane", "gambe-senza-riposo"],
  ricerche: ["disturbi del sonno quando preoccuparsi", "colpo di sonno alla guida", "addormentarsi alla guida", "narcolessia", "parlare nel sonno", "muoversi nel sonno", "centro del sonno"],
  fonti: [
    { ente: "NHS", titolo: "Insomnia: when to see a GP", url: "https://www.nhs.uk/conditions/insomnia/" },
    NHS_APNEE,
    { ente: "MedlinePlus (NIH)", titolo: "Sleep Disorders", url: "https://medlineplus.gov/sleepdisorders.html" },
    AIMS,
  ],
  aggiornato: OGGI,
  revisione: BOZZA,
};

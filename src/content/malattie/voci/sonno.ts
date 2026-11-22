import type { Malattia } from "../schema";

/**
 * Area sonno: pagina principale sull'insonnia e capo della sezione sonno (22/11/2026), che vive sotto
 * /malattie/sonno/{argomento} (src/content/sonno): le porte per problema compaiono in cima a questa pagina.
 */
export const SONNO: Malattia = {
  slug: "sonno",
  area: "Sonno",
  nome: "Insonnia",
  nomeMedico: "Insonnia e disturbi del sonno",
  altriNomi: ["insonnia cronica", "disturbi del sonno", "dormire male", "apnee notturne"],
  tono: "vi",
  icona: "luna",
  riga: "Dormire male per settimane non è un destino. Si entra dal problema, con un percorso di due settimane e un foglio per il medico.",
  seoTitle: "Insonnia: cause, apnee notturne e che cosa fare",
  metaDescription: "Insonnia e sonno disturbato: quando diventa cronica, che cosa sono le apnee notturne, le abitudini che aiutano e perché un diario del sonno serve.",
  titolo: "Insonnia:",
  em: "quando le notti storte diventano un'abitudine.",
  inBreve: [
    "Si parla di insonnia quando fai fatica ad addormentarti, ti svegli spesso o troppo presto, e di giorno ne paghi le conseguenze: stanchezza, umore, concentrazione.",
    "Se succede almeno tre notti a settimana da più di tre mesi, i medici la chiamano insonnia cronica. Riguarda circa un adulto su dieci.",
    "Esistono percorsi efficaci, che non si basano solo sui farmaci. Anche russare forte con pause del respiro è un disturbo del sonno da riferire al medico.",
  ],
  cheCose: [
    "Il sonno ha bisogno di due cose: la «pressione» del sonno, che cresce con le ore da svegli, e l'orologio interno, che segue la luce e il buio. L'insonnia nasce spesso da un periodo difficile (un lutto, un ricovero, un cambio di lavoro) e poi si mantiene da sola: si va a letto preoccupati di non dormire, si resta svegli a letto a lungo, e il letto diventa il posto della veglia.",
    "Le linee guida europee sull'insonnia (Società europea di ricerca sul sonno, ESRS 2023) indicano come primo percorso la terapia cognitivo-comportamentale per l'insonnia, chiamata CBT-I: alcune settimane di lavoro su orari, abitudini e pensieri legati al sonno, con un professionista o con programmi guidati. I farmaci per dormire hanno un ruolo, ma di solito per periodi brevi e sempre decisi dal medico.",
    "Le apnee ostruttive del sonno sono un'altra cosa: durante il sonno la gola si chiude e il respiro si ferma per qualche secondo, molte volte per notte. Chi dorme accanto sente russare forte, con pause e sbuffi. Di giorno si ha molto sonno, mal di testa al mattino, a volte pressione alta. Sono più frequenti con il sovrappeso e dopo i 50 anni.",
  ],
  comeSiManifesta: {
    testo: [
      "Il disturbo non è solo quante ore dormi: conta come ti senti di giorno. Alcune persone dormono sei ore e stanno bene, altre ne dormono otto e si svegliano stanche.",
    ],
    segni: [
      "Più di mezz'ora per addormentarsi, quasi tutte le sere.",
      "Risvegli lunghi durante la notte, o al mattino molto prima della sveglia.",
      "Stanchezza, irritabilità, difficoltà di concentrazione durante il giorno.",
      "Russare forte con pause del respiro notate da chi dorme vicino (apnee).",
      "Sonno durante il giorno, fino ad addormentarsi davanti alla televisione o guidando.",
      "Bisogno irresistibile di muovere le gambe la sera, a letto.",
    ],
  },
  quandoChiamare: {
    subito: [
      "Pensieri di farti del male o di non voler più vivere, anche se legati a notti senza sonno: chiama il 112 o fatti accompagnare al pronto soccorso.",
      "Una persona che di notte smette di respirare a lungo, diventa bluastra o non si riesce a svegliare.",
    ],
    presto: [
      "Ti addormenti alla guida o al lavoro: è un motivo per parlarne con il medico in tempi brevi, e per non guidare quando hai sonno.",
      "Chi dorme vicino nota pause del respiro, russare forte e sbuffi.",
      "Insonnia da più di tre mesi, o che ti fa stare male di giorno.",
      "Insonnia comparsa con tristezza, ansia, perdita di interesse per le cose.",
    ],
  },
  esami: [],
  esamiNota: "Per l'insonnia di solito non servono esami del sangue: conta il diario del sonno di due settimane. Se il medico sospetta le apnee notturne può proporre un monitoraggio cardiorespiratorio notturno o una polisonnografia, in un centro del sonno.",
  ogniGiorno: [
    "Le indicazioni generali per chi dorme male sono semplici, ma funzionano solo se costanti: alzarsi alla stessa ora tutti i giorni, anche nel fine settimana; usare il letto solo per dormire; alzarsi se dopo 20 minuti non arriva il sonno e tornare a letto quando arriva; luce del giorno al mattino; schermi lontani nell'ultima ora.",
    "Caffè, tè e bevande con caffeina nel pomeriggio, alcol la sera e pasti abbondanti prima di dormire peggiorano il sonno, anche quando sembrano aiutare ad addormentarsi.",
    "I sonniferi, anche quelli da banco, e la melatonina sono farmaci o integratori da valutare con il medico o il farmacista, soprattutto in chi è anziano o prende altre cure.",
  ],
  diario: { slug: "sonno", testo: "Ora di andare a letto, minuti per addormentarsi, risvegli e come ti senti al mattino: il diario calcola l'efficienza del sonno e prepara il foglio per il medico." },
  domande: [
    "La mia è insonnia cronica o un periodo passeggero?",
    "Potrei avere le apnee notturne? Serve un esame del sonno?",
    "Esiste un percorso di terapia cognitivo-comportamentale per l'insonnia vicino a me o online?",
    "Qualcuno dei farmaci che prendo può disturbare il sonno?",
    "Per quanto tempo è sensato usare un farmaco per dormire, se serve?",
  ],
  faq: [
    {
      d: "Quante ore bisogna dormire?",
      r: "Per la maggior parte degli adulti le società scientifiche indicano tra 7 e 9 ore, ma il bisogno varia da persona a persona e con l'età. Più del numero conta come ti senti di giorno.",
    },
    {
      d: "Mi sveglio alle 4 e non mi riaddormento: è insonnia?",
      r: "Il risveglio precoce è una delle forme dell'insonnia. Se succede spesso, da settimane, e ti fa stare male di giorno, vale la pena parlarne con il medico, anche perché a volte si accompagna a un periodo di umore basso.",
    },
    {
      d: "Russare è pericoloso?",
      r: "Russare da solo è molto comune. Diventa un segnale da riferire al medico quando è forte, con pause del respiro, sbuffi, e sonno durante il giorno: sono i segni tipici delle apnee ostruttive del sonno, che si possono studiare e curare.",
    },
    {
      d: "La melatonina aiuta a dormire?",
      r: "La melatonina può aiutare in situazioni precise, come il jet lag o alcuni disturbi dell'orologio interno. Per l'insonnia cronica le linee guida europee non la indicano come primo percorso. Se usarla e come, chiedilo al medico o al farmacista.",
    },
  ],
  glossario: ["ritmo-circadiano", "cortisolo", "ormone"],
  correlate: ["peso", "mal-di-testa", "asma"],
  ricerche: [
    "insonnia",
    "dormire male",
    "non riesco a dormire",
    "svegliarsi presto",
    "sonno disturbato",
    "disturbi del sonno",
    "stanchezza al mattino",
  ],
  fonti: [
    { ente: "ISSalute (Istituto superiore di sanità)", titolo: "Insonnia: cause, cure e accorgimenti utili", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/i/insonnia" },
    { ente: "ESRS, Journal of Sleep Research", titolo: "Linee guida europee sull'insonnia 2023", url: "https://onlinelibrary.wiley.com/doi/10.1111/jsr.14035" },
    { ente: "NHS", titolo: "Sleep apnoea", url: "https://www.nhs.uk/conditions/sleep-apnoea/" },
    { ente: "AIMS", titolo: "Associazione italiana di medicina del sonno", url: "https://www.sonnomed.it" },
  ],
  aggiornato: "2026-11-22",
  revisione: { stato: "bozza" },
};

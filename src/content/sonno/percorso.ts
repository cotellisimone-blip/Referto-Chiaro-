import type { SonnoPagina } from "./schema";

/**
 * Il percorso di due settimane (22/11/2026): autovalutazione → diario del sonno ogni mattina → foglio per il medico.
 * Il sito fa i conti (tempo a letto, sonno stimato, efficienza, regolarità degli orari, fine settimana) e li DESCRIVE:
 * non dice se vanno bene, non propone orari, non sostituisce la visita.
 */
export const PERCORSO: SonnoPagina = {
  slug: "percorso-due-settimane",
  tipo: "percorso",
  porta: "Il percorso di due settimane",
  icona: "s-settimane",
  riga: "Un'autovalutazione, due settimane di diario ogni mattina, un foglio di una pagina da portare al medico.",
  seoTitle: "Diario del sonno di due settimane, gratis",
  metaDescription: "Percorso gratuito di due settimane: autovalutazione, diario del sonno ogni mattina e un foglio per il medico, con efficienza e regolarità calcolate.",
  titolo: "Il percorso di due settimane:",
  em: "arrivare dal medico con le notti in mano.",
  inBreve: [
    "Prima: un'autovalutazione di due minuti, con domande scritte da noi, per mettere a fuoco il problema.",
    "Poi: due settimane di diario, un minuto ogni mattina. Il sito calcola tempo a letto, sonno stimato, efficienza e regolarità degli orari.",
    "Alla fine: un foglio PDF di una pagina per il medico, con le medie e le notti una per una. Il sito descrive i numeri, non li giudica.",
  ],
  sezioni: [
    {
      id: "passo-1",
      kicker: "Passo 1 · Oggi",
      titolo: "Un'autovalutazione di due minuti",
      blocchi: [
        {
          p: "Scegli quella che somiglia di più a quello che vivi. Sono domande scritte da noi, ispirate ai temi dei questionari usati dai medici del sonno, con le fonti: non sono quei questionari e non danno una diagnosi, ma aiutano a dare un nome alle cose e a scegliere le domande per la visita. Le risposte restano sul tuo telefono: se vuoi, aggiungi il risultato al foglio per il medico.",
        },
        { vai: { href: "/prenditi-cura-di-te/sonno/autovalutazione-insonnia", titolo: "Quanto pesa l'insonnia", testo: "Sei domande su addormentarsi, risvegli, risveglio precoce e giornate." } },
        { vai: { href: "/prenditi-cura-di-te/sonno/autovalutazione-sonnolenza", titolo: "Sonnolenza di giorno", testo: "Quanto ti capita di appisolarti nelle situazioni di tutti i giorni." } },
        { vai: { href: "/prenditi-cura-di-te/sonno/autovalutazione-apnee", titolo: "Segnali delle apnee notturne", testo: "Russare, pause del respiro e i fattori che rendono le apnee più probabili." } },
        { vai: { href: "/prenditi-cura-di-te/sonno/autovalutazione-gambe", titolo: "Gambe senza riposo", testo: "I quattro segni tipici, con domande semplici." } },
      ],
    },
    {
      id: "passo-2",
      kicker: "Passo 2 · Per 14 mattine",
      titolo: "Il diario, ogni mattina",
      blocchi: [
        {
          p: "Ogni mattina, entro un'ora dal risveglio: a che ora hai spento la luce, quanto ci hai messo ad addormentarti (una stima), quante volte ti sei svegliato e quanti minuti in tutto sei rimasto sveglio, se ti sei svegliato definitivamente prima di alzarti, a che ora ti sei alzato e com'è andata. Un minuto, dal telefono o sul foglio da stampare.",
        },
        {
          punti: [
            "Compila anche le notti buone: dicono al medico quanto quelle difficili.",
            "Non guardare l'orologio di notte per «misurare»: le stime del mattino bastano e sono quelle che contano.",
            "Pisolini, caffè dopo pranzo, alcol, farmaci per dormire, turni: scrivili nella nota.",
            "Se salti una mattina, non importa: riprendi la successiva.",
            "Puoi impostare un promemoria sul telefono alle 8, dal diario stesso.",
          ],
          stile: "segni",
        },
        { vai: { href: "/area-personale/diari/sonno", titolo: "Apri il diario del sonno", testo: "Nell'area personale, gratis. C'è anche un account di prova con notti di esempio." } },
        { vai: { href: "/diari/sonno", titolo: "Preferisci la carta?", testo: "Il diario da stampare e la guida in cinque passi." } },
      ],
    },
    {
      id: "conti",
      kicker: "I conti del sito",
      titolo: "Che cosa calcola il sito",
      blocchi: [
        {
          tabella: {
            colonne: ["Misura", "Come si calcola"],
            righe: [
              ["Tempo a letto", "Dall'ora in cui spegni la luce a quella in cui ti alzi."],
              ["Sonno stimato", "Tempo a letto meno i minuti per addormentarti, i minuti svegli di notte e il tempo tra l'ultimo risveglio e l'alzarti."],
              ["Efficienza del sonno", "Sonno stimato diviso tempo a letto, in percentuale."],
              ["Regolarità degli orari", "Di quanto cambiano, da una notte all'altra, l'ora in cui vai a letto e quella in cui ti alzi (deviazione standard, in minuti)."],
              ["Fine settimana", "Di quanto si sposta la metà della notte il venerdì e il sabato rispetto agli altri giorni."],
              ["Notti oltre 30 minuti", "Quante notti hai impiegato più di mezz'ora ad addormentarti, e quante sei rimasto sveglio più di mezz'ora in tutto."],
            ],
          },
          nota: "Sono le misure del diario di consenso usato nella ricerca (Consensus Sleep Diary). Il sito le descrive: non dice se sono buone o cattive, e non propone orari. Le legge il medico, insieme a come stai.",
        },
      ],
    },
    {
      id: "passo-3",
      kicker: "Passo 3 · Il giorno della visita",
      titolo: "Il foglio per il medico",
      blocchi: [
        {
          p: "Dal diario, «Foglio per il medico (PDF)»: una pagina con il periodo, le medie, le notti una per una, i risultati delle autovalutazioni che hai scelto di aggiungere e uno spazio per le note del medico. Stampalo o mostralo dal telefono. Insieme al foglio, porta l'elenco dei farmaci e degli integratori.",
        },
        {
          riquadro: {
            tono: "nota",
            titolo: "Che cosa il percorso non fa",
            testo: "Non fa diagnosi, non sostituisce la visita, non imposta una terapia. In particolare non calcola orari di «restrizione del sonno»: quella parte della terapia cognitivo-comportamentale si fa con un professionista, che parte proprio dal tuo diario.",
          },
        },
        { vai: { href: "/prenditi-cura-di-te/sonno/quando-andare-dal-medico", titolo: "Quando non aspettare due settimane", testo: "Sonno alla guida, pause del respiro, pensieri di farti del male: i segnali per muoversi subito." } },
      ],
    },
  ],
  domande: [
    "Guardando il mio diario, che cosa le sembra più importante?",
    "La mia efficienza e la regolarità degli orari che cosa dicono, nel mio caso?",
    "Serve un esame del sonno, o un percorso di terapia cognitivo-comportamentale?",
    "Devo continuare il diario, e per quanto?",
  ],
  faq: [
    {
      d: "Perché proprio due settimane?",
      r: "Una settimana sola può essere poco rappresentativa (un periodo di lavoro, un raffreddore). Due settimane comprendono due fine settimana e sono il periodo che usano spesso i medici e i percorsi di terapia cognitivo-comportamentale.",
    },
    {
      d: "Il mio orologio misura già il sonno: devo comunque compilare?",
      r: "Conviene, perché il diario dice come hai vissuto la notte tu, ed è su questo che lavorano i medici dell'insonnia. Se vuoi, porta tutti e due: le differenze sono spesso interessanti.",
    },
    {
      d: "Chi vede il mio diario?",
      r: "Solo tu, e chi decidi tu: il foglio per il medico lo scarichi e lo porti. Le risposte delle autovalutazioni restano sul telefono e non arrivano a Cura Privata.",
    },
  ],
  correlate: ["non-mi-addormento", "mi-sveglio-di-notte", "terapia-cognitivo-comportamentale", "quando-andare-dal-medico"],
  ricerche: ["diario del sonno", "diario del sonno da compilare", "efficienza del sonno calcolo", "test del sonno", "questionario sonno", "foglio per il medico sonno"],
  fonti: [
    { ente: "Carney CE e altri, Sleep 2012", titolo: "The Consensus Sleep Diary: standardizing prospective sleep self-monitoring", url: "https://academic.oup.com/sleep/article/35/2/287/2558991" },
    { ente: "European Sleep Research Society (ESRS)", titolo: "European Insomnia Guideline 2023, J Sleep Res 2023", url: "https://onlinelibrary.wiley.com/doi/10.1111/jsr.14035" },
    { ente: "Associazione italiana di medicina del sonno (AIMS)", titolo: "Materiali per i pazienti sul sonno", url: "https://www.sonnomed.it" },
  ],
  aggiornato: "2026-11-22",
  revisione: { stato: "bozza" },
};

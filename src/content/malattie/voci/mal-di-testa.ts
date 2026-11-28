import type { Malattia } from "../schema";

export const MAL_DI_TESTA: Malattia = {
  slug: "mal-di-testa",
  area: "Mal di testa",
  nome: "Mal di testa",
  nomeMedico: "Cefalea",
  altriNomi: ["cefalea", "emicrania", "cefalea tensiva", "cefalea muscolo-tensiva"],
  tono: "sc",
  icona: "testa",
  riga: "Emicrania, cefalea tensiva e gli altri tipi. Come riconoscerli e i segnali per cui non si aspetta.",
  seoTitle: "Mal di testa: emicrania, cefalea e segnali",
  metaDescription: "Mal di testa: come si distinguono emicrania e cefalea tensiva, i segnali per cui chiamare subito il 112 e perché un diario aiuta il medico.",
  titolo: "Mal di testa:",
  em: "riconoscerlo, e sapere quando non aspettare.",
  inBreve: [
    "Quasi tutti hanno mal di testa ogni tanto. Nella grande maggioranza dei casi è una cefalea «primaria», come l'emicrania o la cefalea tensiva: fastidiosa, ma non segno di un'altra malattia.",
    "Riconoscere il tipo aiuta il medico a scegliere la cura giusta. Un diario di qualche settimana dice più di molte descrizioni a memoria.",
    "Alcuni segnali, come un dolore improvviso e fortissimo o insieme a debolezza o difficoltà a parlare, vanno trattati come un'emergenza: si chiama il 112.",
  ],
  cheCose: [
    "I medici distinguono le cefalee primarie, in cui il mal di testa è il disturbo in sé, dalle cefalee secondarie, in cui il dolore è il segnale di qualcos'altro, per esempio un'infezione, un trauma o un problema dei vasi del cervello. Le primarie sono di gran lunga le più frequenti.",
    "L'emicrania dà un dolore pulsante, spesso da un lato della testa, che peggiora con il movimento e si accompagna a nausea e fastidio per luce e rumori. Dura da qualche ora a tre giorni. In una parte delle persone è preceduta dall'aura: luci a zig-zag, punti ciechi o formicolii che durano fino a un'ora. Colpisce di più le donne ed è spesso legata a ciclo, sonno, digiuno o stress.",
    "La cefalea tensiva è la più comune: un dolore sordo, a cerchio o a casco, dai due lati, che non peggiora salendo le scale e di solito non dà nausea. Più rara è la cefalea a grappolo: un dolore fortissimo attorno a un occhio, con lacrimazione e naso chiuso dallo stesso lato, a periodi.",
    "Usare antidolorifici per il mal di testa molti giorni al mese, nel tempo, può rendere il mal di testa più frequente: si chiama cefalea da uso eccessivo di farmaci. È un motivo per parlarne con il medico, non per smettere da soli una cura.",
  ],
  comeSiManifesta: {
    testo: [
      "Per capire di che mal di testa si tratta, al medico servono dettagli che a memoria si perdono: quando inizia, quanto dura, dove fa male, che cosa lo accompagna, che cosa hai preso e se ha funzionato.",
    ],
    segni: [
      "Emicrania: dolore pulsante, spesso da un lato, con nausea e fastidio per luce e rumori.",
      "Aura: disturbi della vista o formicolii che precedono il dolore e passano entro un'ora.",
      "Cefalea tensiva: dolore a cerchio, dai due lati, che non peggiora con il movimento.",
      "Cefalea a grappolo: dolore fortissimo attorno a un occhio, con lacrimazione, a periodi.",
      "Mal di testa sempre più frequente, in chi prende antidolorifici molti giorni al mese.",
    ],
  },
  quandoChiamare: {
    subito: [
      "Un mal di testa improvviso e fortissimo, che raggiunge il massimo in pochi secondi o minuti, «il peggiore della vita».",
      "Mal di testa con debolezza o formicolio di un lato del corpo, bocca storta, difficoltà a parlare, perdita della vista o confusione.",
      "Mal di testa con febbre alta, collo rigido e macchie sulla pelle.",
      "Mal di testa dopo un colpo alla testa, con vomito, sonnolenza o confusione, oppure con convulsioni.",
    ],
    presto: [
      "Un mal di testa nuovo e diverso dal solito, soprattutto dopo i 50 anni.",
      "Un mal di testa che peggiora di settimana in settimana, o che sveglia di notte con vomito.",
      "Mal di testa che peggiora tossendo, sforzandosi o sdraiandosi.",
      "Mal di testa in gravidanza, in chi ha un tumore o difese immunitarie basse.",
      "Antidolorifici presi più di 10 giorni al mese per il mal di testa.",
    ],
  },
  esami: [
    { guida: "tac-o-risonanza", perche: "Nella maggior parte dei mal di testa non servono. Il medico le chiede solo in casi scelti: la guida spiega la differenza tra le due." },
    { guida: "elettroencefalogramma-eeg", perche: "Non è un esame per il mal di testa: si usa se il medico sospetta altro, per esempio crisi epilettiche." },
  ],
  esamiNota: "Per l'emicrania e la cefalea tensiva di solito non servono esami: conta il racconto. Per questo il diario è lo strumento più utile da portare alla visita.",
  ogniGiorno: [
    "Molte persone con emicrania riconoscono i propri fattori scatenanti: sonno irregolare, pasti saltati, poca acqua, alcol, ciclo mestruale, stress e il calo di tensione del fine settimana. Il diario aiuta a vederli.",
    "Orari regolari di sonno e pasti, movimento costante e pause durante il lavoro al computer sono le indicazioni generali delle società scientifiche per chi ha mal di testa frequenti.",
    "Quando il mal di testa torna spesso, esistono cure di prevenzione: se e quali usare lo decide il medico o il centro cefalee, insieme a te.",
  ],
  diario: { slug: "cefalea", testo: "Giorni con mal di testa, durata, intensità e farmaci presi: il diario conta i giorni del mese e prepara il foglio per il medico." },
  domande: [
    "Che tipo di mal di testa è il mio, secondo lei?",
    "Ci sono segnali per cui dovrei tornare subito o chiamare il 112?",
    "Quanti giorni al mese posso usare l'antidolorifico senza rischiare di peggiorare il mal di testa?",
    "Ha senso una cura di prevenzione, visto quanti giorni al mese ho mal di testa?",
    "Serve una visita al centro cefalee o dal neurologo?",
  ],
  faq: [
    {
      d: "Ho mal di testa tutti i giorni: che cosa può essere?",
      r: "Un mal di testa quasi quotidiano può avere diverse spiegazioni: una cefalea tensiva cronica, un'emicrania diventata frequente, l'uso eccessivo di antidolorifici o altro. Non è una cosa da capire da soli: un diario di quattro settimane portato al medico è il punto di partenza più utile.",
    },
    {
      d: "Quando il mal di testa è pericoloso?",
      r: "Sono segnali d'allarme un dolore improvviso e fortissimo, il mal di testa con debolezza di un lato, difficoltà a parlare, perdita della vista, confusione, febbre con collo rigido, o dopo un colpo alla testa. In questi casi si chiama il 112.",
    },
    {
      d: "Emicrania e cervicale sono la stessa cosa?",
      r: "No. Il dolore al collo può accompagnare sia l'emicrania sia la cefalea tensiva, ma «cervicale» non è il nome di un tipo di mal di testa. Il medico distingue il tipo dal racconto completo.",
    },
    {
      d: "Il mal di testa dipende dalla pressione alta?",
      r: "Molto raramente. La pressione alta di solito non dà mal di testa; fanno eccezione valori molto alti, che vanno trattati come urgenti se accompagnati da altri disturbi. Misurarla quando hai mal di testa può comunque aiutare il medico.",
    },
  ],
  glossario: ["referto", "ritmo-circadiano", "valore-critico"],
  correlate: ["sonno", "pressione-alta"],
  ricerche: [
    "mal di testa",
    "cefalea",
    "emicrania",
    "cefalea tensiva",
    "emicrania con aura",
    "mal di testa forte",
    "mal di testa tutti i giorni",
    "mal di testa frequente",
    "cefalea a grappolo",
    "mal di testa da farmaci",
    "dolore alla testa",
  ],
  fonti: [
    { ente: "ISSalute (Istituto superiore di sanità)", titolo: "Mal di testa: disturbi, cause e cure", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/m/mal-di-testa" },
    { ente: "ISSalute", titolo: "Emicrania: con aura, senz'aura, silente", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/e/emicrania" },
    { ente: "ISSalute", titolo: "Cefalea di tipo tensivo", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/c/cefalea-di-tipo-tensivo" },
    { ente: "ISSalute", titolo: "Mal di testa da antidolorifici", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/m/mal-di-testa-da-antidolorifici" },
    { ente: "SISC", titolo: "Società italiana per lo studio delle cefalee", url: "https://www.sisc.it" },
  ],
  aggiornato: "2026-11-22",
  revisione: { stato: "bozza" },
};

import type { Malattia } from "../schema";

export const ASMA: Malattia = {
  slug: "asma",
  area: "Respiro",
  nome: "Asma",
  nomeMedico: "Asma bronchiale",
  altriNomi: ["asma bronchiale", "asma allergica", "broncospasmo"],
  tono: "es",
  icona: "respiro",
  riga: "Bronchi sensibili che si chiudono a tratti. Come si riconosce, il picco di flusso e i segnali d'allarme.",
  seoTitle: "Asma: sintomi, spirometria e picco di flusso",
  metaDescription: "Asma bronchiale: i sintomi tipici, la differenza con la BPCO, la spirometria e il picco di flusso, e quando un attacco richiede il 112.",
  titolo: "Asma:",
  em: "quando i bronchi si chiudono a tratti.",
  inBreve: [
    "Nell'asma i bronchi sono infiammati e sensibili: a tratti si restringono, e l'aria passa a fatica. Tra un episodio e l'altro si può stare bene.",
    "I disturbi tipici sono fischi nel petto, fiato corto, petto stretto e tosse, spesso di notte o al mattino presto, e variano nel tempo.",
    "Con la cura giusta la maggior parte delle persone con asma fa una vita piena. Un piano scritto con il medico dice che cosa fare se peggiora.",
  ],
  cheCose: [
    "L'asma è un'infiammazione cronica dei bronchi, i tubi che portano l'aria ai polmoni. Quando incontrano uno stimolo (allergeni come acari, pollini o peli di animali, fumo, aria fredda, sforzo, infezioni) i bronchi si stringono, si gonfiano e producono muco. Il restringimento è reversibile: passa da solo o con i farmaci.",
    "Può iniziare a qualsiasi età. Nei bambini e nei giovani è spesso legata alle allergie; negli adulti può comparire anche senza allergie, a volte dopo un'infezione o per esposizioni sul lavoro.",
    "L'asma è diversa dalla BPCO (broncopneumopatia cronica ostruttiva), che riguarda di solito chi ha fumato a lungo, compare dopo i 40 anni e dà un fiato corto che non va e viene ma tende a peggiorare lentamente. Le due condizioni a volte si sovrappongono: la spirometria aiuta il medico a distinguerle.",
  ],
  comeSiManifesta: {
    testo: [
      "Il segno caratteristico dell'asma è la variabilità: i disturbi vanno e vengono, cambiano da un giorno all'altro e peggiorano con alcuni stimoli precisi.",
    ],
    segni: [
      "Fischi o sibili nel petto quando si respira.",
      "Fiato corto, a riposo o sotto sforzo.",
      "Senso di petto stretto, come una fascia.",
      "Tosse, spesso secca, che peggiora di notte o al mattino presto.",
      "Disturbi che compaiono con raffreddori, sforzo, aria fredda, fumo o allergeni.",
    ],
  },
  quandoChiamare: {
    subito: [
      "Fiato così corto da non riuscire a finire una frase, a camminare o a mangiare.",
      "Labbra o unghie bluastre, sonnolenza, confusione, grande fatica a respirare.",
      "Il farmaco «al bisogno» per il respiro non fa effetto o l'effetto dura pochissimo.",
    ],
    presto: [
      "Usi il farmaco al bisogno più spesso del solito, o più di due volte a settimana.",
      "Ti svegli di notte per tosse o fiato corto.",
      "Il picco di flusso scende sotto i valori indicati dal medico nel tuo piano scritto.",
      "Disturbi che limitano le attività di ogni giorno o lo sport.",
    ],
  },
  esami: [
    { guida: "spirometria", perche: "L'esame principale: misura quanta aria soffi e quanto in fretta, prima e dopo un farmaco che apre i bronchi." },
    { guida: "radiografia-del-torace", perche: "Non serve a vedere l'asma, ma a volte il medico la chiede per escludere altre cause di tosse o fiato corto." },
    { guida: "emocromo", perche: "La formula dei globuli bianchi (eosinofili) aiuta lo specialista a capire alcuni tipi di asma." },
  ],
  esamiNota: "Se si sospetta un'allergia, lo specialista può proporre test cutanei o esami del sangue per gli allergeni.",
  ogniGiorno: [
    "Le linee guida internazionali sull'asma (GINA) indicano per quasi tutte le persone con asma un farmaco di fondo che spegne l'infiammazione, oltre a quello al bisogno: quali farmaci, a che dosi e per quanto tempo lo decide il medico. Usare bene l'inalatore conta quanto il farmaco: vale la pena farsi mostrare la tecnica.",
    "Evitare il fumo, anche passivo, e ridurre gli stimoli che scatenano l'asma, quando si conoscono, aiuta a stare meglio. Il vaccino antinfluenzale è indicato per le persone con asma.",
    "Un piano d'azione scritto, preparato con il medico, dice che cosa fare se i disturbi o il picco di flusso peggiorano: chi lo ha usa meno il pronto soccorso.",
  ],
  diario: { slug: "respiro", testo: "Il picco di flusso al mattino e alla sera, con i sintomi e i farmaci al bisogno: il diario mostra la variabilità e prepara il foglio per il medico." },
  domande: [
    "La mia è asma, BPCO o tutte e due?",
    "Qual è il mio farmaco di fondo e quale quello al bisogno?",
    "Può controllare come uso l'inalatore?",
    "Posso avere un piano d'azione scritto, con i valori del picco di flusso a cui fare attenzione?",
    "Servono esami per le allergie?",
    "Ogni quanto devo ripetere la spirometria?",
  ],
  faq: [
    {
      d: "L'asma passa con l'età?",
      r: "Nei bambini l'asma a volte migliora molto durante l'adolescenza, ma può tornare da adulti. Negli adulti l'asma di solito resta, con periodi migliori e peggiori. L'obiettivo della cura è che i disturbi siano rari e che la vita non ne sia limitata.",
    },
    {
      d: "Che cos'è il picco di flusso?",
      r: "È la velocità massima con cui riesci a soffiare fuori l'aria, misurata con un piccolo strumento di plastica. Annotarlo mattina e sera mostra quanto cambiano i bronchi da un giorno all'altro, un'informazione utile al medico.",
    },
    {
      d: "Tosse secca di notte: può essere asma?",
      r: "La tosse notturna può essere un segno di asma, ma anche di reflusso, naso chiuso, alcuni farmaci o altro. Se dura più di qualche settimana è un buon motivo per parlarne con il medico, che può proporre una spirometria.",
    },
  ],
  glossario: ["eosinofili", "emocromo", "formula-leucocitaria"],
  correlate: ["sonno", "peso"],
  ricerche: [
    "asma",
    "asma bronchiale",
    "asma allergica",
    "fischi nel petto",
    "sibili",
    "fiato corto",
    "respiro corto",
    "tosse notturna",
    "tosse secca di notte",
    "picco di flusso",
    "bpco",
    "broncospasmo",
  ],
  fonti: [
    { ente: "ISSalute (Istituto superiore di sanità)", titolo: "Asma: disturbi, cause e cura", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/a/asma" },
    { ente: "NHS", titolo: "Peak flow test", url: "https://www.nhs.uk/conditions/peak-flow-test/" },
    { ente: "SIP/IRS", titolo: "Società italiana di pneumologia", url: "https://www.sipirs.it" },
  ],
  aggiornato: "2026-11-22",
  revisione: { stato: "bozza" },
};

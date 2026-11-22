import type { Malattia } from "../schema";

export const TIROIDE: Malattia = {
  slug: "tiroide",
  area: "Tiroide",
  nome: "Tiroide",
  nomeMedico: "Malattie della tiroide",
  altriNomi: ["ipotiroidismo", "ipertiroidismo", "tiroidite di Hashimoto", "noduli tiroidei", "morbo di Basedow"],
  tono: "gu",
  icona: "tiroide",
  riga: "Quando lavora troppo poco o troppo. Ipotiroidismo, ipertiroidismo, Hashimoto e noduli, con il TSH al centro.",
  seoTitle: "Tiroide: ipotiroidismo, ipertiroidismo, noduli",
  metaDescription: "Tiroide: che cosa sono ipotiroidismo, ipertiroidismo, tiroidite di Hashimoto e noduli, quali esami si fanno e quando chiamare il medico.",
  titolo: "Tiroide:",
  em: "quando lavora troppo poco, o troppo.",
  inBreve: [
    "La tiroide è una piccola ghiandola alla base del collo che regola il ritmo del corpo: battito, temperatura, energia, peso, intestino.",
    "Può lavorare troppo poco (ipotiroidismo) o troppo (ipertiroidismo), e può avere noduli, nella grande maggioranza benigni.",
    "Il primo esame è quasi sempre il TSH. Le malattie della tiroide sono comuni, soprattutto nelle donne, e di solito si curano bene.",
  ],
  cheCose: [
    "La tiroide produce due ormoni, la tiroxina (T4) e la triiodotironina (T3), usando lo iodio che arriva con il cibo. Un'altra ghiandola, l'ipofisi, nel cervello, la regola con il TSH: quando gli ormoni tiroidei sono pochi il TSH sale per «spronarla», quando sono troppi scende. Per questo il TSH è il primo esame da guardare.",
    "L'ipotiroidismo è la condizione più frequente. In Italia la causa principale è la tiroidite di Hashimoto, in cui il sistema immunitario infiamma lentamente la tiroide; si riconosce dagli anticorpi anti-TPO. Esiste anche una forma lieve, detta subclinica, con TSH un po' alto e ormoni ancora entro l'intervallo: se e quando curarla lo valuta il medico.",
    "L'ipertiroidismo, meno frequente, è spesso dovuto al morbo di Basedow-Graves (anche questo legato al sistema immunitario, a volte con occhi sporgenti) o a noduli che producono troppi ormoni. I noduli della tiroide sono molto comuni con l'età e si trovano spesso per caso con un'ecografia: la grande maggioranza è benigna, e l'ecografia aiuta il medico a decidere quali approfondire.",
  ],
  comeSiManifesta: {
    testo: [
      "I disturbi della tiroide sono spesso vaghi e arrivano piano, per questo si confondono con stress, età o stanchezza. Nelle persone anziane possono essere ancora più sfumati.",
    ],
    segni: [
      "Ipotiroidismo: stanchezza, freddo, aumento di peso, stitichezza, pelle secca, capelli fragili, lentezza, umore giù.",
      "Ipertiroidismo: battito veloce o palpitazioni, calo di peso, caldo e sudore, tremore delle mani, nervosismo, insonnia, diarrea.",
      "Noduli: di solito nessun disturbo; a volte un rigonfiamento visibile alla base del collo.",
      "Gozzo: la tiroide ingrossata, che può dare senso di peso al collo.",
      "Cicli irregolari o difficoltà ad avere una gravidanza, in entrambe le condizioni.",
    ],
  },
  quandoChiamare: {
    subito: [
      "Battito molto veloce o irregolare con dolore al petto, svenimento o fiato corto.",
      "Febbre alta con agitazione, confusione e battito velocissimo in chi ha l'ipertiroidismo.",
      "Difficoltà a respirare per un rigonfiamento del collo.",
    ],
    presto: [
      "Un nodulo o un rigonfiamento del collo che cresce in fretta, è duro o fa male.",
      "Fatica a deglutire o voce rauca che non passa.",
      "Gravidanza o desiderio di gravidanza in chi ha una malattia della tiroide o prende ormone tiroideo.",
      "Palpitazioni, calo di peso e tremore comparsi nelle ultime settimane.",
    ],
  },
  esami: [
    { guida: "tsh", perche: "Il primo esame: sale quando la tiroide lavora poco, scende quando lavora troppo." },
    { guida: "ft4-tiroxina-libera", perche: "L'ormone tiroideo libero: con il TSH dice se la tiroide lavora troppo o troppo poco." },
    { guida: "ft3-triiodotironina-libera", perche: "Utile soprattutto quando si sospetta un ipertiroidismo." },
    { guida: "anticorpi-anti-tpo", perche: "Gli anticorpi della tiroidite di Hashimoto: raccontano la causa, non quanto lavora la tiroide." },
    { guida: "anticorpi-anti-tireoglobulina", perche: "Altri anticorpi contro la tiroide, che il medico a volte affianca agli anti-TPO." },
    { guida: "ecografia-della-tiroide", perche: "Mostra forma, dimensioni e noduli. Le loro caratteristiche aiutano a decidere se servono altri esami." },
  ],
  ogniGiorno: [
    "Lo iodio è indispensabile alla tiroide. In Italia il Ministero della salute promuove da anni l'uso del sale iodato, al posto del sale comune e senza aumentare la quantità totale di sale.",
    "Chi prende l'ormone tiroideo di solito lo assume a digiuno, lontano dalla colazione e da alcuni farmaci e integratori (ferro, calcio) che ne riducono l'assorbimento: orari e modalità li indica il medico o il farmacista.",
    "Le malattie della tiroide vanno seguite nel tempo con il TSH, a intervalli che decide il medico. In gravidanza i controlli diventano più frequenti.",
  ],
  domande: [
    "Il mio TSH, insieme all'FT4, che cosa dice della mia tiroide?",
    "Ho bisogno di misurare gli anticorpi o di fare un'ecografia?",
    "Il nodulo che ho ha caratteristiche da approfondire?",
    "Ogni quanto devo ripetere il TSH?",
    "Se desidero una gravidanza, che cosa cambia per la mia tiroide?",
  ],
  faq: [
    {
      d: "TSH alto: che cosa vuol dire?",
      r: "Un TSH più alto dell'intervallo del laboratorio di solito accompagna una tiroide che lavora meno. Ma il TSH cambia anche con l'età, l'orario, alcune malattie e alcuni farmaci, e a volte torna da solo. Il medico lo legge insieme all'FT4 e di solito lo ripete prima di decidere. La guida al TSH spiega come si legge il referto.",
    },
    {
      d: "La tiroidite di Hashimoto si cura?",
      r: "La tiroidite di Hashimoto non si «spegne», ma nella maggior parte delle persone si gestisce bene: si controlla il TSH nel tempo e, se la tiroide comincia a lavorare poco, il medico può prescrivere l'ormone tiroideo. Molte persone con anticorpi positivi hanno una tiroide che funziona per anni senza cure.",
    },
    {
      d: "I noduli alla tiroide sono pericolosi?",
      r: "I noduli sono molto comuni e nella grande maggioranza dei casi sono benigni. L'ecografia ne descrive le caratteristiche; su quelli che lo richiedono il medico può proporre un agoaspirato, un piccolo prelievo con un ago sottile.",
    },
  ],
  glossario: ["tsh", "ft4", "ft3", "anticorpi-anti-tpo", "anticorpi-anti-tireoglobulina", "tireoglobulina", "ormone", "autoanticorpi"],
  correlate: ["peso", "anemia"],
  ricerche: [
    "tiroide",
    "ipotiroidismo",
    "ipertiroidismo",
    "tiroidite di hashimoto",
    "hashimoto",
    "noduli tiroide",
    "nodulo tiroideo",
    "basedow",
    "gozzo",
    "tiroide pigra",
    "sintomi tiroide",
  ],
  fonti: [
    { ente: "ISSalute (Istituto superiore di sanità)", titolo: "Malattie della tiroide", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/m/malattie-della-tiroide" },
    { ente: "ISSalute", titolo: "Ipotiroidismo: disturbi, cause e cure", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/i/ipotiroidismo" },
    { ente: "ISSalute", titolo: "Tiroiditi: disturbi, cause e cura", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/t/tiroiditi" },
    { ente: "ISSalute", titolo: "Il gozzo: diffuso e nodulare", url: "https://www.issalute.it/index.php/saluteaz-saz/g/680-gozzo" },
  ],
  aggiornato: "2026-11-22",
  revisione: { stato: "bozza" },
};

import type { Malattia } from "../schema";

export const COLESTEROLO_ALTO: Malattia = {
  slug: "colesterolo-alto",
  area: "Colesterolo",
  nome: "Colesterolo alto",
  nomeMedico: "Ipercolesterolemia",
  altriNomi: ["ipercolesterolemia", "dislipidemia", "colesterolo LDL alto", "grassi nel sangue alti"],
  tono: "sh",
  icona: "vaso",
  riga: "Non si sente, ma conta per cuore e arterie. LDL, HDL, trigliceridi e perché il valore giusto dipende da te.",
  seoTitle: "Colesterolo alto: LDL, HDL, rischio e controlli",
  metaDescription: "Colesterolo alto (ipercolesterolemia): che cosa misurano LDL e HDL, perché l'obiettivo dipende dal rischio del cuore, la carta del rischio ISS.",
  titolo: "Colesterolo alto:",
  em: "un numero che conta insieme agli altri.",
  inBreve: [
    "Il colesterolo alto non dà disturbi. Si scopre con gli esami del sangue, e il valore che pesa di più è il colesterolo LDL, chiamato «cattivo».",
    "Con gli anni l'LDL in eccesso si deposita nelle pareti delle arterie e le restringe: è uno dei motivi principali di infarto e ictus.",
    "Non esiste un valore giusto uguale per tutti: l'obiettivo dipende dal rischio complessivo del cuore, che il medico calcola insieme a età, pressione, fumo e diabete.",
  ],
  cheCose: [
    "Il colesterolo è un grasso indispensabile: serve a costruire le cellule e alcuni ormoni. Lo produce soprattutto il fegato, e una parte arriva dal cibo. Viaggia nel sangue dentro «pacchetti» chiamati lipoproteine. Le LDL portano il colesterolo verso i tessuti e, quando sono troppe, lo depositano nelle arterie. Le HDL lo riportano al fegato. I trigliceridi sono un altro tipo di grasso, legato soprattutto a zuccheri, alcol e peso.",
    "Nella maggior parte delle persone il colesterolo alto dipende da un insieme di familiarità, alimentazione, peso e movimento. In circa una persona su 250 c'è una causa genetica, l'ipercolesterolemia familiare: l'LDL è molto alto fin da giovani e in famiglia ci sono stati infarti precoci. Riconoscerla è importante anche per i parenti.",
    "In Italia, per le persone tra 35 e 69 anni senza malattie del cuore, l'Istituto superiore di sanità ha preparato la carta del rischio del Progetto Cuore: stima la probabilità di un infarto o di un ictus nei dieci anni successivi a partire da età, sesso, pressione, colesterolo totale, fumo e diabete. Il medico usa strumenti come questo per decidere l'obiettivo di LDL.",
  ],
  comeSiManifesta: {
    testo: [
      "Il colesterolo alto in sé non dà sintomi. A volte, nelle forme familiari con valori molto alti, compaiono segni visibili che vale la pena mostrare al medico.",
    ],
    segni: [
      "Nessun disturbo: è la regola.",
      "Valori alti trovati negli esami del sangue di controllo.",
      "Piccoli rilievi giallastri sulle palpebre (xantelasmi) o sui tendini delle mani e del tallone (xantomi).",
      "Un anello biancastro attorno all'iride prima dei 45 anni.",
      "Familiari stretti con infarto o ictus prima dei 55 anni negli uomini e dei 65 nelle donne.",
    ],
  },
  quandoChiamare: {
    subito: [
      "Dolore o peso al centro del petto che dura più di qualche minuto, che può salire al braccio, al collo o alla mandibola, con sudore freddo o nausea.",
      "Debolezza di un lato del corpo, bocca storta, difficoltà a parlare o a vedere: possibili segni di ictus.",
    ],
    presto: [
      "Dolore al petto o fiato corto che compaiono con lo sforzo e passano con il riposo.",
      "Dolore ai polpacci camminando, che passa fermandosi.",
      "LDL molto alto agli esami, soprattutto da giovane o con familiari che hanno avuto infarti precoci.",
    ],
  },
  esami: [
    { guida: "colesterolo-ldl", perche: "Il colesterolo «cattivo»: il numero su cui il medico fissa l'obiettivo." },
    { guida: "colesterolo-hdl", perche: "Il colesterolo «buono», che riporta il colesterolo al fegato." },
    { guida: "colesterolo-totale", perche: "La somma di tutto il colesterolo: entra nella carta del rischio." },
    { guida: "trigliceridi", perche: "Un altro grasso del sangue, legato a zuccheri, alcol e peso." },
    { guida: "colesterolo-non-hdl", perche: "Tutto il colesterolo che può depositarsi nelle arterie: utile quando i trigliceridi sono alti." },
    { guida: "lipoproteina-a", perche: "Un fattore ereditario: le società europee suggeriscono di misurarla almeno una volta nella vita." },
  ],
  ogniGiorno: [
    "Le indicazioni generali per abbassare il colesterolo LDL riguardano soprattutto i grassi: meno grassi saturi (burro, formaggi grassi, carni lavorate, dolci industriali), più legumi, verdura, cereali integrali, frutta secca, pesce, e olio extravergine d'oliva come condimento principale. Il colesterolo del cibo, per esempio delle uova, pesa meno di quanto si pensi.",
    "Movimento regolare, peso adeguato e niente fumo migliorano l'HDL e i trigliceridi e proteggono le arterie anche per vie che il colesterolo non misura.",
    "Quando le abitudini non bastano o il rischio è alto, il medico può proporre farmaci. Se iniziarli, quali e con quale obiettivo lo decide lui; non conviene confrontare i propri valori con quelli di amici o parenti, perché gli obiettivi cambiano da persona a persona.",
  ],
  domande: [
    "Qual è il mio rischio cardiovascolare a dieci anni?",
    "Qual è l'obiettivo di colesterolo LDL nel mio caso?",
    "È utile misurare la lipoproteina(a)?",
    "Con i valori e la storia della mia famiglia, è possibile un'ipercolesterolemia familiare? Vanno controllati i miei figli?",
    "Ogni quanto ripetere gli esami dei grassi nel sangue?",
  ],
  faq: [
    {
      d: "Colesterolo 240: è alto?",
      r: "Il colesterolo totale da solo dice poco. Conta soprattutto l'LDL, e il suo obiettivo cambia molto da persona a persona: più basso per chi ha già avuto un infarto o ha il diabete, più alto per chi ha un rischio basso. Il referto riporta l'intervallo del laboratorio, ma l'obiettivo per te lo fissa il medico.",
    },
    {
      d: "Il colesterolo HDL alto fa bene?",
      r: "L'HDL è chiamato «buono» perché riporta il colesterolo al fegato, e valori bassi si accompagnano a un rischio maggiore. Ma alzarlo non basta a proteggere il cuore, e valori molto alti non danno vantaggi in più. Il medico guarda soprattutto l'LDL.",
    },
    {
      d: "Si può abbassare il colesterolo solo con l'alimentazione?",
      r: "Le abitudini abbassano l'LDL, di solito di una parte (spesso tra il 10 e il 20%). Per alcune persone basta, per altre no, soprattutto con un rischio alto o una forma familiare. Lo si capisce ripetendo gli esami dopo qualche mese.",
    },
  ],
  glossario: ["colesterolo", "colesterolo-ldl", "colesterolo-hdl", "ldl", "hdl", "trigliceridi", "lipoproteina-a", "lipoproteine", "lipidi", "apolipoproteina"],
  correlate: ["pressione-alta", "diabete", "peso", "fegato-grasso"],
  ricerche: [
    "colesterolo alto",
    "colesterolo",
    "ipercolesterolemia",
    "colesterolo cattivo",
    "colesterolo buono",
    "colesterolo 240",
    "rischio cardiovascolare",
    "carta del rischio",
    "ipercolesterolemia familiare",
    "grassi nel sangue",
  ],
  fonti: [
    { ente: "ISS, Progetto Cuore", titolo: "Carta del rischio cardiovascolare", url: "https://www.cuore.iss.it/valutazione/carte" },
    { ente: "ISSalute (Istituto superiore di sanità)", titolo: "Colesterolo e dieta", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/c/colesterolo-e-dieta" },
    { ente: "ISSalute", titolo: "Xantomi", url: "https://www.issalute.it/index.php/la-salute-dalla-a-alla-z-menu/x/xantomi" },
    { ente: "NHS", titolo: "High cholesterol: cholesterol levels", url: "https://www.nhs.uk/conditions/high-cholesterol/cholesterol-levels/" },
  ],
  aggiornato: "2026-11-22",
  revisione: { stato: "bozza" },
};

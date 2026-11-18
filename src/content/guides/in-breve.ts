/**
 * Righe del riquadro «In breve» scritte a mano, dove la prima frase della guida era troppo lunga
 * per stare nel riquadro. Ogni riga riassume il testo già presente nella guida, senza aggiungere
 * affermazioni: se cambia il testo della guida, va riletta anche la riga qui.
 */
export interface InBreve {
  /** «Che cosa misura» */
  what?: string;
  /** «Quando si fa» o «Quando serve» */
  when?: string;
}

export const IN_BREVE: Record<string, InBreve> = {
  "perche-i-valori-cambiano": {
    when: "Quando il medico confronta i risultati nel tempo per capire se una variazione è piccola o merita attenzione.",
  },
  "fascicolo-sanitario-elettronico": {
    when: "Quando vuoi trovare i tuoi referti in un solo posto, anche dopo anni, e farli consultare al medico che ti segue.",
  },
  "referti-online-e-per-email": {
    what: "Il servizio con cui una struttura ti mette a disposizione il referto su un sito protetto o te lo invia per email.",
  },
  "fotografare-un-referto": {
    when: "Quando hai solo la copia su carta, o un medico ti chiede di anticipare gli esami prima della visita.",
  },
  "leggere-la-ricetta-classi-di-priorita": {
    what: "La ricetta, o impegnativa, è il documento con cui il medico prescrive una visita specialistica o un esame.",
  },
  emocromo: {
    when: "Nei controlli periodici, con sintomi come stanchezza o febbre, prima di interventi e durante alcune terapie.",
  },
  "globuli-rossi": {
    when: "Nei controlli generali, in caso di stanchezza o pallore, prima di interventi: fa parte dell'emocromo.",
  },
  emoglobina: {
    when: "Nei controlli generali, in caso di stanchezza, pallore o respiro corto, prima di un intervento e in gravidanza.",
  },
  ematocrito: {
    when: "Nei controlli, prima di interventi e in gravidanza: fa parte dell'emocromo di base.",
  },
  "mcv-volume-corpuscolare-medio": {
    when: "Con l'emocromo: il medico lo usa soprattutto quando l'emoglobina è fuori dall'intervallo stampato.",
  },
  "mch-e-mchc": {
    what: "L'MCH è la quantità media di emoglobina contenuta in un globulo rosso; l'MCHC ne indica la concentrazione.",
  },
  rdw: {
    when: "Con l'emocromo: completa l'MCV e il medico lo legge insieme agli altri indici, non da solo.",
  },
  "globuli-bianchi-e-formula-leucocitaria": {
    when: "In caso di febbre, infezioni sospette o sintomi generali, prima di terapie o interventi e nei controlli nel tempo.",
  },
  piastrine: {
    what: "Le piastrine sono piccoli frammenti di cellule che partecipano alla fase iniziale della coagulazione.",
    when: "Nei controlli di routine, prima di interventi, con lividi o sanguinamenti insoliti e durante alcune terapie.",
  },
  glicemia: {
    what: "La glicemia è la concentrazione nel sangue di glucosio, lo zucchero che le cellule usano come energia.",
    when: "Nei controlli periodici, con sintomi come sete intensa o stanchezza, e in gravidanza se il medico lo indica.",
  },
  "emoglobina-glicata": {
    when: "Quando il medico vuole vedere l'andamento della glicemia nel tempo e non solo di un momento. Non richiede digiuno.",
  },
  insulinemia: {
    what: "L'insulina è un ormone prodotto dal pancreas che fa entrare il glucosio nelle cellule e abbassa la glicemia.",
    when: "Quando il medico la aggiunge alla glicemia per una domanda precisa: non è un esame di routine per tutti.",
  },
  "curva-da-carico-di-glucosio": {
    what: "La curva da carico (OGTT) valuta come cambia la glicemia dopo aver bevuto una soluzione zuccherina.",
    when: "Quando la sola glicemia a digiuno non basta, oppure in gravidanza secondo i protocolli ostetrici.",
  },
  "peptide-c": {
    what: "Il peptide C viene prodotto dal pancreas insieme all'insulina, in quantità uguali.",
    when: "In contesti specifici, spesso insieme alla glicemia: è un esame specialistico, non di routine.",
  },
  "colesterolo-hdl": {
    what: "Le HDL sono particelle che trasportano colesterolo nel sangue, tra l'altro dai tessuti verso il fegato.",
    when: "Nei controlli periodici, insieme a colesterolo totale e LDL: fa parte del profilo lipidico standard.",
  },
  "colesterolo-ldl": {
    when: "Quando il medico valuta il quadro dei lipidi, definisce obiettivi personali o segue l'andamento nel tempo.",
  },
  trigliceridi: {
    when: "Nei controlli periodici, insieme a colesterolo totale, HDL e LDL: fanno parte del profilo lipidico di base.",
  },
  "colesterolo-non-hdl": {
    when: "Quando il medico lo affianca all'LDL, in particolare se i trigliceridi sono alti.",
  },
  "lipoproteina-a": {
    when: "Quando il medico la chiede, per esempio per familiarità di problemi cardiovascolari precoci: non è nel profilo di base.",
  },
  "transaminasi-alt-ast": {
    what: "ALT (o GPT) e AST (o GOT) sono enzimi che partecipano al metabolismo degli amminoacidi.",
    when: "In molti controlli generali, per seguire un valore nel tempo o l'effetto di farmaci e integratori sul fegato.",
  },
  "gamma-gt": {
    when: "Quando il medico la chiede con transaminasi e fosfatasi alcalina per guardare fegato e vie biliari.",
  },
  "fosfatasi-alcalina": {
    when: "Nel controllo di fegato e vie biliari e nella valutazione di alcune condizioni delle ossa.",
  },
  bilirubina: {
    when: "Per valutare fegato e vie biliari, o per approfondire una colorazione giallastra di pelle o occhi.",
  },
  albumina: {
    when: "Per valutare lo stato nutrizionale, completare gli esami del fegato o capire una perdita di proteine con le urine.",
  },
  "proteine-totali-ed-elettroforesi": {
    when: "Le proteine totali nei controlli generali; l'elettroforesi quando il medico vuole approfondire un valore alterato.",
  },
  ldh: {
    when: "Negli esami generali, o quando il medico vuole completare il quadro di altre voci come AST, ALT o bilirubina.",
  },
  creatinina: {
    when: "Nei controlli generali, prima di esami con mezzo di contrasto e in chi assume farmaci che passano dai reni.",
  },
  "acido-urico": {
    when: "Nei controlli generali, con dolori articolari acuti, nella valutazione dei calcoli renali o di alcuni farmaci.",
  },
  sodio: {
    what: "Il sodio è un minerale con carica elettrica (elettrolita) che aiuta a regolare la distribuzione dell'acqua nel corpo.",
    when: "Nei controlli generali, durante malattie acute e quando il medico valuta l'idratazione o i reni.",
  },
  potassio: {
    when: "Nei controlli generali, durante malattie acute con perdita di liquidi e in chi assume alcuni diuretici o farmaci per la pressione.",
  },
  "esame-delle-urine": {
    when: "Come esame di controllo, per approfondire sintomi urinari o per valutare i reni.",
  },
  microalbuminuria: {
    when: "Per seguire nel tempo l'effetto sui reni di condizioni come diabete e pressione alta.",
  },
  tsh: {
    what: "Il TSH è l'ormone, prodotto dall'ipofisi, che comunica alla tiroide quanto ormone produrre.",
  },
  "ft4-tiroxina-libera": {
    when: "Insieme al TSH, oppure come secondo passo se il TSH è fuori dall'intervallo stampato.",
  },
  "anticorpi-anti-tpo": {
    when: "Quando il medico vuole capire se dietro un'alterazione della tiroide c'è una componente autoimmune.",
  },
  sideremia: {
    when: "Per approfondire un emocromo con indici fuori intervallo o una stanchezza persistente, quasi sempre con altri esami.",
  },
  "transferrina-e-saturazione": {
    what: "La transferrina è la proteina del sangue che lega il ferro e lo porta ai tessuti che lo utilizzano.",
  },
  "vitamina-b12": {
    what: "La vitamina B12, o cobalamina, è una vitamina che il corpo non produce e che arriva con gli alimenti di origine animale.",
    when: "Quando l'emocromo mostra globuli rossi di volume diverso dall'atteso, o con alcuni regimi alimentari e farmaci.",
  },
  folati: {
    when: "Insieme alla B12, quando l'emocromo mostra globuli rossi di volume diverso dall'atteso, e in gravidanza.",
  },
  "vitamina-d": {
    when: "Quando il medico vuole valutare le riserve, per esempio con poca esposizione al sole: non è uno screening per tutti.",
  },
  omocisteina: {
    when: "In contesti selezionati, per esempio per approfondire B12 o folati al limite: non è un esame di routine.",
  },
  "pcr-proteina-c-reattiva": {
    when: "Con sintomi come febbre o dolori, per seguire una situazione già nota o dopo un intervento.",
  },
  ves: {
    when: "Con sintomi generici o dolori, o per seguire nel tempo alcune malattie infiammatorie già note.",
  },
  "pt-inr": {
    what: "Il tempo di protrombina (PT) misura in secondi quanto impiega il plasma a coagulare; l'INR lo rende confrontabile.",
    when: "Prima di interventi, con sanguinamenti o lividi inspiegati e in chi assume farmaci che agiscono sulla vitamina K.",
  },
  aptt: {
    what: "L'aPTT misura in secondi il tempo che serve al plasma per coagulare dopo l'aggiunta di un reagente.",
    when: "Prima di interventi, con sanguinamenti o lividi inspiegati e in chi assume farmaci come l'eparina.",
  },
  fibrinogeno: {
    when: "Insieme a PT e aPTT per completare la valutazione della coagulazione, o prima di alcune procedure.",
  },
  "d-dimero": {
    when: "Quando il medico deve decidere se approfondire con altri accertamenti legati alla coagulazione.",
  },
  procalcitonina: {
    what: "La procalcitonina è una sostanza che, in presenza di infezioni batteriche diffuse, viene prodotta in grandi quantità.",
    when: "Soprattutto in ospedale e in pronto soccorso: non è un esame di routine né un controllo senza sintomi.",
  },
  cortisolo: {
    when: "Quando il medico valuta la funzione dei surreni, in presenza di sintomi o di altri esami che lo suggeriscono.",
  },
  prolattina: {
    when: "Con irregolarità del ciclo, difficoltà di concepimento o altri sintomi legati all'equilibrio ormonale.",
  },
  calcio: {
    what: "Il calcio è un minerale essenziale per ossa e denti, ma anche per muscoli, nervi e coagulazione.",
  },
  psa: {
    what: "Il PSA è una proteina prodotta dalle cellule della prostata, presente in piccola quantità anche nel sangue.",
    when: "Per valutare la prostata o sintomi urinari; senza sintomi, è una scelta da discutere con il medico.",
  },
  "amilasi-e-lipasi": {
    when: "Con dolore addominale o sintomi dell'apparato digerente, quando il medico vuole valutare il pancreas.",
  },
  testosterone: {
    what: "Il testosterone è un ormone prodotto soprattutto dai testicoli e, in quantità minori, da ovaie e surreni.",
    when: "Con calo del desiderio o della forza, difficoltà di concepimento, irregolarità del ciclo o peluria eccessiva.",
  },
  "fsh-e-lh": {
    when: "Con irregolarità del ciclo, difficoltà di concepimento o sintomi legati a menopausa e pubertà.",
  },
  radiografia: {
    when: "Per osservare una parte del corpo, controllare l'esito di un trattamento o completare altri accertamenti.",
  },
  ecografia: {
    when: "Per osservare una zona o un organo, o per seguire nel tempo un reperto già noto.",
  },
  "ecografia-addominale": {
    when: "Con sintomi addominali, per completare gli esami del sangue su fegato e reni o per un controllo programmato.",
  },
  ecodoppler: {
    when: "Per studiare vene o arterie di una zona, o per controllare nel tempo un reperto già noto.",
  },
  "tac-tomografia-computerizzata": {
    when: "Quando il medico vuole osservare una zona in modo più dettagliato di quanto consentano altri esami.",
  },
  "tac-con-mezzo-di-contrasto": {
    when: "Quando la TAC senza contrasto non basta, per esempio per studiare i vasi o distinguere meglio alcuni tessuti.",
  },
  "risonanza-magnetica": {
    when: "Per studiare in dettaglio una zona o approfondire il risultato di un altro esame.",
  },
  "risonanza-con-mezzo-di-contrasto": {
    when: "Quando radiologo o medico vogliono studiare meglio alcuni tessuti, vasi o aree già osservate senza contrasto.",
  },
  mammografia: {
    what: "La mammografia produce immagini della mammella con una quantità bassa di raggi X.",
    when: "Nei programmi di screening o su richiesta del medico, per approfondire un sintomo o per un controllo.",
  },
  "moc-densitometria-ossea": {
    what: "La MOC (detta anche DEXA o DXA) misura quanto minerale, soprattutto calcio, è presente in una porzione di osso.",
    when: "Quando il medico vuole valutare la densità delle ossa, per esempio per età, storia clinica o terapie.",
  },
  "tac-o-risonanza": {
    when: "Lo decide il medico in base a ciò che deve osservare: non esiste un esame «migliore» in assoluto.",
  },
  "come-leggere-un-referto-di-radiologia": {
    when: "Quando vuoi capire che cosa è stato fatto e preparare le domande per il medico che ha richiesto l'esame.",
  },
  "elettrocardiogramma-ecg": {
    when: "In una visita di controllo, prima di un intervento o dello sport, o con sintomi che riguardano il cuore.",
  },
  "holter-ecg": {
    what: "L'Holter registra il segnale elettrico del cuore in modo continuo per un giorno o più, durante la vita normale.",
    when: "Quando i sintomi compaiono in modo intermittente e il medico vuole osservare il cuore su un tempo più lungo.",
  },
  "holter-pressorio": {
    when: "Quando il medico vuole vedere l'andamento della pressione nella vita quotidiana, fuori dallo studio.",
  },
  ecocardiogramma: {
    when: "Per vedere struttura e movimento del cuore, o per approfondire il risultato di altri esami.",
  },
  "prova-da-sforzo": {
    when: "Per valutare la risposta del cuore all'esercizio, per un'idoneità o per seguire una situazione nota.",
  },
  spirometria: {
    when: "Con sintomi respiratori, per seguire nel tempo una situazione nota o prima di alcuni interventi.",
  },
  "elettroencefalogramma-eeg": {
    what: "L'EEG registra i piccoli segnali elettrici del cervello con elettrodi posti sul cuoio capelluto.",
    when: "Quando il medico, di solito un neurologo, vuole studiare l'attività elettrica del cervello.",
  },
  "elettromiografia-emg": {
    what: "L'elettromiografia registra l'attività elettrica dei muscoli, a riposo e durante la contrazione.",
    when: "Con sintomi come formicolii, debolezza o dolore, quando il medico vuole studiare nervi e muscoli.",
  },
  gastroscopia: {
    what: "La gastroscopia permette di osservare direttamente l'interno di esofago, stomaco e duodeno.",
    when: "Con disturbi di esofago e stomaco, per approfondire altri esami o controllare una situazione già nota.",
  },
  colonscopia: {
    what: "La colonscopia permette di osservare direttamente la superficie interna del retto e del colon.",
    when: "Con sintomi intestinali, per controlli nel tempo o nell'ambito dei programmi di screening.",
  },
};

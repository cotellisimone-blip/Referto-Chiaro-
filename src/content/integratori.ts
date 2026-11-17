import { z } from "zod";

/**
 * Guide agli integratori (15/11/2026, sezione «Online»). Come le guide agli esami sono BOZZE EDITORIALI da revisione
 * medica: dicono che cos'è un integratore, perché se ne parla, quale esame del referto lo riguarda e che cosa chiedere.
 * Mai se prenderlo, quanto o per quanto: quello lo decide il medico (o il farmacista, per le interazioni).
 * Niente dosi, niente promesse, niente marchi. tests/unit/integratori.test.ts applica le stesse frasi vietate delle guide.
 */

export const INTEGRATORI_GROUPS = {
  vitamine: "Vitamine",
  minerali: "Minerali",
  altri: "Altri integratori",
} as const;

export type IntegratoreGroup = keyof typeof INTEGRATORI_GROUPS;

const para = z.string().min(40).max(700);
const bullet = z.string().min(8).max(260);

export const IntegratoreSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(3).max(40),
    group: z.enum(Object.keys(INTEGRATORI_GROUPS) as [IntegratoreGroup, ...IntegratoreGroup[]]),
    aka: z.array(z.string().min(2).max(40)).max(5),
    /** Una riga per l'elenco. */
    oneLine: z.string().min(20).max(90),
    summary: z.string().min(80).max(320),
    whatItIs: z.array(para).min(1).max(3),
    whereFound: z.array(z.string().min(4).max(260)).min(1).max(6),
    whyTalked: z.array(para).min(1).max(3),
    /** L'esame del referto che lo riguarda, con la guida collegata quando c'è. */
    onReport: z.object({ exams: z.array(z.string().min(2).max(50)).min(1).max(4), guide: z.string().nullable(), text: para }),
    careful: z.array(bullet).min(3).max(6),
    questions: z.array(bullet).min(3).max(5),
    sources: z.array(z.object({ title: z.string().min(3).max(120), url: z.string().url() })).min(1).max(4),
    lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    reviewStatus: z.literal("draft-needs-clinical-review"),
  })
  .strict();

export type Integratore = z.infer<typeof IntegratoreSchema>;

export const INTEGRATORI_SOURCE_DOMAINS = ["ods.od.nih.gov", "nhs.uk", "salute.gov.it", "issalute.it", "medlineplus.gov", "efsa.europa.eu"];

const ODS = (page: string, title: string) => ({ title: `${title} — NIH Office of Dietary Supplements`, url: `https://ods.od.nih.gov/factsheets/${page}-Consumer/` });
const NHS = (page: string, title: string) => ({ title: `${title} — NHS`, url: `https://www.nhs.uk/conditions/vitamins-and-minerals/${page}/` });

/** Le domande che valgono per tutti: in testa a ogni scheda, così nessuna scheda sembra un invito a comprare. */
export const INTEGRATORI_PRIMA_DI_TUTTO = [
  "Un integratore non sostituisce un'alimentazione varia né una terapia.",
  "Anche se si compra senza ricetta, può interferire con i farmaci che prendi: dillo sempre al medico e al farmacista.",
  "Gravidanza, allattamento, bambini, malattie croniche e terapie in corso sono situazioni in cui la scelta spetta al medico.",
];

export const INTEGRATORI: Integratore[] = [
  {
    slug: "vitamina-d",
    name: "Vitamina D",
    group: "vitamine",
    aka: ["colecalciferolo", "vitamina D3", "25-OH vitamina D"],
    oneLine: "La vitamina del sole, legata alle ossa e al calcio.",
    summary: "La vitamina D si forma soprattutto nella pelle esposta al sole e aiuta l'organismo a usare il calcio. È uno degli integratori più diffusi: sul referto la trovi come 25-OH vitamina D.",
    whatItIs: [
      "La vitamina D è una vitamina che il corpo produce in gran parte da solo, quando la pelle riceve la luce del sole. Una quota minore arriva dagli alimenti. Serve, tra l'altro, ad assorbire il calcio e il fosforo, importanti per ossa e denti.",
      "Negli integratori si trova di solito come colecalciferolo (vitamina D3), in gocce, capsule o fiale. Esistono anche prodotti su ricetta, usati dal medico in situazioni precise.",
    ],
    whereFound: ["Esposizione della pelle alla luce del sole", "Pesci grassi come salmone, sgombro e sardine", "Tuorlo d'uovo", "Alcuni alimenti arricchiti, come certi latti e cereali"],
    whyTalked: [
      "Se ne parla molto perché in inverno, a chi esce poco o a chi ha la pelle sempre coperta può capitare di produrne meno. Per questo il medico, in alcune persone, chiede l'esame del sangue e decide se e come integrarla.",
    ],
    onReport: {
      exams: ["25-OH vitamina D", "Calcio"],
      guide: "vitamina-d",
      text: "Sul referto compare come 25-OH vitamina D (o 25-idrossivitamina D), in ng/mL o nmol/L. Accanto c'è l'intervallo del laboratorio, che a volte riporta più fasce. Se prendi già un integratore, il valore ne risente: dillo a chi legge l'esame.",
    },
    careful: [
      "È una vitamina che si accumula nell'organismo: più non vuol dire meglio, e l'eccesso può alzare il calcio nel sangue.",
      "Attenzione a sommare più prodotti che la contengono, come multivitaminici e gocce.",
      "Alcuni farmaci e alcune malattie dei reni o delle ghiandole paratiroidi cambiano il modo in cui l'organismo la usa.",
      "Quantità e durata le decide il medico, che di solito valuta anche il calcio.",
    ],
    questions: [
      "Nel mio caso ha senso controllare la vitamina D?",
      "Il valore che vedo sul referto va letto insieme al calcio?",
      "Se prendo già un integratore, quando conviene ripetere l'esame?",
      "Ci sono interazioni con i farmaci che prendo?",
    ],
    sources: [ODS("VitaminD", "Vitamin D"), NHS("vitamin-d", "Vitamin D")],
    lastUpdated: "2026-11-15",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "ferro",
    name: "Ferro",
    group: "minerali",
    aka: ["solfato ferroso", "ferro bisglicinato", "ferro liposomiale"],
    oneLine: "Il minerale dell'emoglobina, che porta l'ossigeno.",
    summary: "Il ferro serve a produrre l'emoglobina, la proteina dei globuli rossi che trasporta l'ossigeno. Le riserve si leggono sul referto con la ferritina, il ferro circolante con la sideremia.",
    whatItIs: [
      "Il ferro è un minerale che l'organismo non produce: arriva dal cibo. Una parte è usata subito per l'emoglobina, un'altra viene messa da parte nelle riserve, legata alla ferritina.",
      "Gli integratori di ferro esistono in molte forme, che si differenziano per quanto vengono assorbite e per come vengono tollerate dallo stomaco.",
    ],
    whereFound: ["Carne rossa, pesce e frutti di mare", "Legumi come lenticchie, ceci e fagioli", "Verdure a foglia verde scuro", "Cereali arricchiti", "La vitamina C nello stesso pasto ne aiuta l'assorbimento"],
    whyTalked: [
      "Se ne parla perché mestruazioni abbondanti, gravidanza, donazioni di sangue o un'alimentazione con poco ferro possono ridurre le riserve. Stanchezza e pallore hanno però molte cause diverse: è il medico che, con gli esami, capisce se c'entra il ferro.",
    ],
    onReport: {
      exams: ["Ferritina", "Sideremia", "Transferrina e saturazione", "Emoglobina"],
      guide: "ferritina",
      text: "Le riserve si leggono con la ferritina; la sideremia dice quanto ferro circola in quel momento e cambia molto durante la giornata. Il medico legge questi valori insieme all'emocromo.",
    },
    careful: [
      "Il ferro in eccesso non viene eliminato facilmente: integrarlo senza un esame può nascondere il problema o creare un accumulo.",
      "Può dare disturbi allo stomaco e all'intestino e scurire le feci.",
      "Interferisce con l'assorbimento di alcuni farmaci, per esempio per la tiroide, e di alcuni antibiotici: i tempi tra uno e l'altro li indica il medico o il farmacista.",
      "Va tenuto lontano dalla portata dei bambini: per loro è pericoloso anche in piccole quantità.",
    ],
    questions: [
      "Prima di pensare a un integratore, quali esami del ferro servono?",
      "La mia ferritina va letta insieme all'emocromo o ad altri valori?",
      "Se lo prendo, quando ripetere gli esami?",
      "Come distanziarlo dagli altri farmaci che prendo?",
    ],
    sources: [ODS("Iron", "Iron"), NHS("iron", "Iron")],
    lastUpdated: "2026-11-15",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "vitamina-b12",
    name: "Vitamina B12",
    group: "vitamine",
    aka: ["cobalamina", "cianocobalamina", "metilcobalamina"],
    oneLine: "Serve ai globuli rossi e al sistema nervoso.",
    summary: "La vitamina B12 serve a formare i globuli rossi e al buon funzionamento dei nervi. Si trova quasi solo negli alimenti di origine animale: per questo se ne parla con chi segue un'alimentazione vegana.",
    whatItIs: [
      "La vitamina B12, o cobalamina, partecipa alla produzione dei globuli rossi e del DNA e al funzionamento del sistema nervoso. Per essere assorbita ha bisogno di una proteina prodotta dallo stomaco.",
    ],
    whereFound: ["Carne, pesce e frutti di mare", "Uova di gallina", "Latte e formaggi", "Alimenti vegetali arricchiti, come alcune bevande vegetali"],
    whyTalked: [
      "Se ne parla con chi segue un'alimentazione vegana o vegetariana, con le persone anziane, con chi ha avuto interventi allo stomaco o all'intestino e con chi prende da tempo alcuni farmaci, per esempio per l'acidità di stomaco o per il diabete.",
    ],
    onReport: {
      exams: ["Vitamina B12", "MCV", "Omocisteina"],
      guide: "vitamina-b12",
      text: "Sul referto la trovi come vitamina B12 o cobalamina, in pg/mL o pmol/L. Il medico la legge spesso insieme all'MCV dell'emocromo, ai folati e talvolta all'omocisteina.",
    },
    careful: [
      "Un integratore preso prima del prelievo può alzare il valore e rendere l'esame meno chiaro: segnalalo.",
      "Quando il problema è l'assorbimento, la via e la forma le sceglie il medico.",
      "Alcuni farmaci usati a lungo ne riducono l'assorbimento: è utile parlarne alla visita.",
    ],
    questions: [
      "Con la mia alimentazione ha senso controllare la B12?",
      "Va letta insieme all'MCV o ai folati?",
      "I farmaci che prendo da tempo possono incidere sulla B12?",
    ],
    sources: [ODS("VitaminB12", "Vitamin B12"), NHS("vitamin-b", "B vitamins and folic acid")],
    lastUpdated: "2026-11-15",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "acido-folico",
    name: "Acido folico",
    group: "vitamine",
    aka: ["folati", "vitamina B9", "folato"],
    oneLine: "La vitamina B9, di cui si parla prima della gravidanza.",
    summary: "I folati (vitamina B9) servono a formare nuove cellule. L'acido folico è la forma usata negli integratori: se ne parla soprattutto con chi desidera una gravidanza.",
    whatItIs: [
      "I folati sono vitamine del gruppo B presenti negli alimenti; l'acido folico è la forma che si usa negli integratori e negli alimenti arricchiti. Partecipano alla produzione del DNA e dei globuli rossi.",
    ],
    whereFound: ["Verdure a foglia verde, come spinaci e broccoli", "Legumi come ceci e lenticchie", "Agrumi e succo d'arancia", "Cereali arricchiti"],
    whyTalked: [
      "Le istituzioni sanitarie raccomandano di parlarne con il medico quando si cerca una gravidanza, perché è importante nelle prime settimane. Se ne parla anche con chi ha carenze di vitamine del gruppo B o prende alcuni farmaci.",
    ],
    onReport: {
      exams: ["Folati", "Vitamina B12", "MCV"],
      guide: "folati",
      text: "Sul referto compare come folati o acido folico sierico, in ng/mL o nmol/L. Si legge di solito insieme alla vitamina B12 e all'emocromo.",
    },
    careful: [
      "Può rendere meno visibile sull'emocromo una carenza di vitamina B12: per questo il medico spesso controlla le due insieme.",
      "Alcuni farmaci, per esempio certi antiepilettici e il metotrexato, interagiscono con i folati.",
      "In gravidanza e prima della gravidanza quantità e tempi li indica il medico o il ginecologo.",
    ],
    questions: [
      "Sto pensando a una gravidanza: di che cosa dobbiamo parlare?",
      "Folati e vitamina B12 vanno controllati insieme nel mio caso?",
      "I farmaci che prendo interagiscono con l'acido folico?",
    ],
    sources: [ODS("Folate", "Folate"), NHS("vitamin-b", "B vitamins and folic acid")],
    lastUpdated: "2026-11-15",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "magnesio",
    name: "Magnesio",
    group: "minerali",
    aka: ["magnesio citrato", "magnesio pidolato", "Mg"],
    oneLine: "Un minerale per muscoli, nervi e ossa.",
    summary: "Il magnesio partecipa a centinaia di reazioni dell'organismo, tra cui il lavoro di muscoli e nervi. È tra gli integratori più venduti, spesso insieme al potassio.",
    whatItIs: [
      "Il magnesio è un minerale presente soprattutto nelle ossa e dentro le cellule. Partecipa alla produzione di energia, al funzionamento di muscoli e nervi e alla regolazione del ritmo del cuore.",
    ],
    whereFound: ["Frutta secca e semi", "Legumi secchi", "Cereali integrali", "Verdure a foglia verde", "Alcune acque minerali"],
    whyTalked: [
      "Se ne parla d'estate, con lo sport e il caldo, e in chi prende alcuni farmaci, come certi diuretici o farmaci per l'acidità di stomaco usati a lungo. Crampi e stanchezza però hanno molte cause.",
    ],
    onReport: {
      exams: ["Magnesio (magnesiemia)", "Potassio", "Calcio"],
      guide: "potassio",
      text: "Sul referto lo trovi come magnesio o magnesiemia, in mg/dL o mmol/L. Il valore nel sangue rappresenta solo una piccola parte del magnesio dell'organismo, per questo il medico lo legge insieme agli altri sali.",
    },
    careful: [
      "Chi ha problemi ai reni elimina meno magnesio: in questi casi l'integrazione va decisa con il medico.",
      "In quantità elevate può dare effetti sull'intestino.",
      "Riduce l'assorbimento di alcuni farmaci, per esempio certi antibiotici e farmaci per le ossa: i tempi li indica il medico o il farmacista.",
    ],
    questions: [
      "I miei esami dicono qualcosa sul magnesio e sugli altri sali?",
      "Con i farmaci che prendo ha senso controllarlo?",
      "I reni vanno controllati prima di pensare a un integratore?",
    ],
    sources: [ODS("Magnesium", "Magnesium"), NHS("others", "Other vitamins and minerals")],
    lastUpdated: "2026-11-15",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "omega-3",
    name: "Omega-3",
    group: "altri",
    aka: ["olio di pesce", "EPA e DHA", "acidi grassi omega-3"],
    oneLine: "Grassi del pesce, di cui si parla per cuore e trigliceridi.",
    summary: "Gli omega-3 sono grassi che l'organismo non produce da solo, presenti soprattutto nel pesce. Se ne parla per il cuore e per i trigliceridi, che compaiono sul referto dei lipidi.",
    whatItIs: [
      "Gli omega-3 sono acidi grassi «essenziali»: servono e devono arrivare con il cibo. I principali sono l'ALA delle piante e l'EPA e il DHA del pesce.",
      "Negli integratori si trovano come olio di pesce, olio di krill o oli di alghe. Esistono anche preparati su ricetta, usati dal medico in situazioni precise.",
    ],
    whereFound: ["Pesci grassi come salmone, sgombro, sardine e alici", "Noci", "Semi di lino e di chia", "Oli di alghe"],
    whyTalked: [
      "Se ne parla perché un'alimentazione con pesce è associata alla salute del cuore. I risultati degli studi sugli integratori sono però diversi da persona a persona: è il medico che valuta se hanno senso nel quadro complessivo.",
    ],
    onReport: {
      exams: ["Trigliceridi", "Colesterolo HDL e LDL"],
      guide: "trigliceridi",
      text: "Gli omega-3 non hanno di solito un esame dedicato nei referti comuni. Il medico guarda il profilo dei lipidi: trigliceridi, colesterolo totale, HDL e LDL.",
    },
    careful: [
      "Possono sommarsi all'effetto dei farmaci che rendono il sangue più fluido: dillo al medico prima di un intervento o di un esame invasivo.",
      "Chi è allergico a pesce o crostacei deve leggere bene l'origine del prodotto.",
      "Non sostituiscono le terapie per colesterolo o trigliceridi decise dal medico.",
    ],
    questions: [
      "Con i miei trigliceridi ha senso parlare di omega-3?",
      "Ci sono interazioni con i farmaci che prendo per il sangue o la pressione?",
      "Che cosa posso cambiare prima nell'alimentazione?",
    ],
    sources: [ODS("Omega3FattyAcids", "Omega-3 Fatty Acids")],
    lastUpdated: "2026-11-15",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "probiotici",
    name: "Probiotici",
    group: "altri",
    aka: ["fermenti lattici", "lactobacilli", "bifidobatteri"],
    oneLine: "I «fermenti lattici»: microrganismi vivi per l'intestino.",
    summary: "I probiotici sono microrganismi vivi, spesso chiamati fermenti lattici. Ogni ceppo ha caratteristiche proprie: quello che vale per uno non vale per tutti.",
    whatItIs: [
      "I probiotici sono batteri o lieviti vivi che si trovano in alcuni alimenti fermentati e negli integratori. Il nome del ceppo, scritto in etichetta con lettere e numeri, è importante: gli studi riguardano ceppi precisi.",
    ],
    whereFound: ["Yogurt e latti fermentati", "Kefir", "Alcuni formaggi stagionati", "Verdure fermentate come i crauti"],
    whyTalked: [
      "Se ne parla spesso durante o dopo una terapia antibiotica e per i disturbi dell'intestino. Gli effetti dipendono dal ceppo e dalla situazione: il medico o il farmacista aiutano a capire se e quale prodotto ha senso.",
    ],
    onReport: {
      exams: ["Nessun esame del sangue dedicato"],
      guide: null,
      text: "I probiotici non hanno un valore da leggere sul referto del sangue. Se hai disturbi intestinali che durano, il medico può chiedere esami specifici delle feci o altri approfondimenti.",
    },
    careful: [
      "Chi ha le difese immunitarie molto basse o un catetere venoso deve parlarne con il medico prima.",
      "Durante un antibiotico, i tempi tra l'uno e l'altro li indica il medico o il farmacista.",
      "Disturbi intestinali che durano, con sangue nelle feci o calo di peso, vanno riferiti al medico e non trattati da soli.",
    ],
    questions: [
      "Durante l'antibiotico ha senso un probiotico? Quale e quando?",
      "I miei disturbi intestinali richiedono qualche esame?",
      "Ci sono situazioni in cui per me è meglio evitarli?",
    ],
    sources: [ODS("Probiotics", "Probiotics")],
    lastUpdated: "2026-11-15",
    reviewStatus: "draft-needs-clinical-review",
  },
  {
    slug: "multivitaminici",
    name: "Multivitaminici",
    group: "altri",
    aka: ["multivitaminici e minerali", "complessi vitaminici"],
    oneLine: "Più vitamine e minerali in un solo prodotto.",
    summary: "I multivitaminici mettono insieme vitamine e minerali in una sola compressa. Sono comodi, ma chi ne prende più di uno rischia di sommare le stesse sostanze.",
    whatItIs: [
      "Un multivitaminico contiene un insieme di vitamine e minerali, in quantità che cambiano molto da un prodotto all'altro. Alcuni sono pensati per età o momenti particolari della vita.",
    ],
    whereFound: ["Un'alimentazione varia, con frutta, verdura, cereali, legumi e proteine, apporta già la maggior parte delle vitamine e dei minerali"],
    whyTalked: [
      "Se ne parla come «aiuto» nei periodi di stanchezza o di alimentazione poco varia. Stanchezza e affaticamento però hanno molte cause, che è meglio capire con il medico prima di aggiungere integratori.",
    ],
    onReport: {
      exams: ["Vitamina D", "Vitamina B12", "Ferritina"],
      guide: "vitamina-d",
      text: "Un multivitaminico può modificare alcuni valori del referto, come vitamina D, vitamina B12 e folati. Segnala sempre al medico che lo prendi, anche se ti sembra un prodotto leggero.",
    },
    careful: [
      "Prendere più integratori insieme può far sommare le stesse vitamine, in particolare A, D ed E, e il ferro.",
      "La biotina, presente in molti prodotti per capelli e unghie, può alterare alcuni esami del sangue, tra cui quelli della tiroide: dillo prima del prelievo.",
      "Fumatori ed ex fumatori dovrebbero parlare con il medico dei prodotti con beta-carotene.",
    ],
    questions: [
      "Con quello che mangio e i miei esami, mi serve davvero?",
      "Devo sospendere qualche integratore prima del prossimo prelievo?",
      "Sto prendendo due prodotti che contengono le stesse sostanze?",
    ],
    sources: [ODS("MVMS", "Multivitamin/mineral Supplements")],
    lastUpdated: "2026-11-15",
    reviewStatus: "draft-needs-clinical-review",
  },
];

/**
 * 17/11/2026 (20 interventi, punto 15): le schede che rimandano a una guida, per il collegamento di ritorno dalla guida
 * dell'esame alla scheda dell'integratore.
 */
export function integratoriForGuide(guideSlug: string): Integratore[] {
  return INTEGRATORI.filter((i) => i.onReport.guide === guideSlug);
}

export function getIntegratore(slug: string): Integratore | null {
  return INTEGRATORI.find((i) => i.slug === slug) ?? null;
}

/** Colori della capsula disegnata accanto a ogni scheda (riempimento, bordo). Solo grafica. */
export const INTEGRATORI_COLORS: Record<string, [string, string]> = {
  "vitamina-d": ["#F1D27A", "#8A6A10"],
  ferro: ["#E89A7C", "#A4471F"],
  "vitamina-b12": ["#F6B98E", "#A4471F"],
  "acido-folico": ["#B9E3A8", "#3D7A2A"],
  magnesio: ["#C9D4F2", "#3B4F8F"],
  "omega-3": ["#7BE0D2", "#00756F"],
  probiotici: ["#EBD9F2", "#6E4A80"],
  multivitaminici: ["#FFD2B8", "#A4471F"],
};

/**
 * «Preparati alla visita in 2 minuti» (pacchetto «Memorabile»). Contenuti pratici e NON diagnostici:
 * che cosa portare, che cosa preparare, che cosa chiedere. Nessuna domanda su sintomi o valori.
 * Bozza editoriale: da far rivedere al medico revisore insieme alle guide.
 */

export const VISIT_TYPES = [
  { id: "famiglia", label: "Dal medico di famiglia" },
  { id: "specialistica", label: "Una visita specialistica" },
  { id: "risultati", label: "Per parlare dei risultati di esami" },
  { id: "nuovo", label: "Per un disturbo nuovo" },
  { id: "controllo", label: "Un controllo dopo una cura o un intervento" },
] as const;

export const HAVE = [
  { id: "referti", label: "Referti di esami recenti" },
  { id: "immagini", label: "Immagini o CD di esami (ecografie, radiografie…)" },
  { id: "lettere", label: "Lettere di dimissione o relazioni di altri medici" },
  { id: "farmaci", label: "Farmaci o integratori che prendi" },
  { id: "impegnativa", label: "Impegnativa o prescrizione della visita" },
] as const;

export const TOPICS = [
  { id: "capire", label: "Capire un risultato o una diagnosi" },
  { id: "disturbo", label: "Un disturbo e come è cambiato" },
  { id: "farmaci", label: "I farmaci: orari, effetti, interazioni" },
  { id: "esami", label: "Esami o controlli da fare dopo" },
  { id: "abitudini", label: "Alimentazione, attività, abitudini" },
  { id: "lavoro", label: "Lavoro, certificati, tempi di recupero" },
] as const;

export type VisitType = (typeof VISIT_TYPES)[number]["id"];
export type HaveId = (typeof HAVE)[number]["id"];
export type TopicId = (typeof TOPICS)[number]["id"];

const BRING_ALWAYS = ["Tessera sanitaria e documento d'identità", "Questa lista, stampata o sul telefono"];

const BRING: Partial<Record<VisitType | HaveId, string[]>> = {
  specialistica: ["L'impegnativa del medico di famiglia, se serve", "Gli esami che lo specialista potrebbe chiederti di vedere"],
  risultati: ["Tutti i referti, anche quelli precedenti per confrontarli"],
  controllo: ["La lettera di dimissione o la relazione dell'ultima visita"],
  referti: ["I referti recenti, in ordine di data"],
  immagini: ["Le immagini o il CD, insieme al referto scritto"],
  lettere: ["Lettere di dimissione e relazioni di altri medici"],
  farmaci: ["L'elenco dei farmaci e degli integratori, con dosi e orari (o le confezioni)"],
  impegnativa: ["L'impegnativa o la prescrizione della visita"],
};

const PREPARE_ALWAYS = ["Scrivi le 3 domande più importanti per te: falle per prime"];

const PREPARE: Partial<Record<VisitType | TopicId, string[]>> = {
  nuovo: ["Quando è iniziato il disturbo e com'è cambiato nel tempo", "Che cosa lo migliora o lo peggiora, con parole tue"],
  disturbo: ["Annota quando succede e quanto dura, per qualche giorno prima della visita"],
  farmaci: ["Eventuali effetti che hai notato da quando prendi un farmaco"],
  controllo: ["Com'è andata da allora: che cosa è migliorato e che cosa no"],
  lavoro: ["Le date e le esigenze di lavoro che il medico dovrebbe conoscere"],
  specialistica: ["Le visite e gli esami già fatti per lo stesso motivo, con le date"],
};

const ASK_ALWAYS = ["Che cosa devo fare da qui alla prossima visita?", "Quando devo richiamarla o tornare, e a chi mi rivolgo se ho dubbi?"];

const ASK: Record<TopicId, string[]> = {
  capire: ["Può spiegarmi con parole semplici che cosa significa questo risultato nel mio caso?", "Serve qualche approfondimento, oppure va bene così?"],
  disturbo: ["Che cosa può causare quello che sento, e che cosa possiamo escludere?", "Quali segnali dovrebbero farmi richiamare subito?"],
  farmaci: ["Come e quando devo prendere questo farmaco, e per quanto tempo?", "Ci sono effetti da tenere d'occhio o interazioni con quello che prendo già?"],
  esami: ["Quali esami o controlli servono, e perché?", "Tra quanto tempo conviene ripeterli?"],
  abitudini: ["C'è qualcosa nelle mie abitudini che conviene cambiare, nel mio caso?"],
  lavoro: ["Quali sono i tempi di recupero realistici per me?", "Mi serve un certificato o una documentazione per il lavoro?"],
};

const uniq = (xs: string[]) => Array.from(new Set(xs));

export function buildVisitPlan(input: { type: VisitType | null; have: HaveId[]; topics: TopicId[] }) {
  const keysBring = [input.type, ...input.have].filter(Boolean) as (VisitType | HaveId)[];
  const keysPrep = [input.type, ...input.topics].filter(Boolean) as (VisitType | TopicId)[];
  return {
    bring: uniq([...keysBring.flatMap((k) => BRING[k] ?? []), ...BRING_ALWAYS]),
    prepare: uniq([...keysPrep.flatMap((k) => PREPARE[k] ?? []), ...PREPARE_ALWAYS]),
    ask: uniq([...(input.topics.length ? input.topics : (["capire"] as TopicId[])).flatMap((t) => ASK[t]), ...ASK_ALWAYS]),
  };
}

const VALID = {
  type: new Set<string>(VISIT_TYPES.map((v) => v.id)),
  have: new Set<string>(HAVE.map((v) => v.id)),
  topics: new Set<string>(TOPICS.map((v) => v.id)),
};

/** Legge lo stato dall'URL accettando solo identificatori noti (niente testo libero nell'indirizzo). */
export function parseVisitParams(sp: { get(k: string): string | null }) {
  const list = (k: string, ok: Set<string>) => (sp.get(k) ?? "").split(",").filter((x) => ok.has(x));
  const t = sp.get("tipo");
  return {
    type: (t && VALID.type.has(t) ? t : null) as VisitType | null,
    have: list("ho", VALID.have) as HaveId[],
    topics: list("temi", VALID.topics) as TopicId[],
  };
}

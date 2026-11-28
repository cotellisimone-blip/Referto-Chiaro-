import {
  AREAS,
  AREA_NOTES,
  CONDITIONS_NOTE,
  DOCTOR_QUESTIONS,
  GOALS,
  HAVE,
  NOT_ROUTINE,
  NOT_SAID,
  PDP_CONTENT_VERSION,
  type Area,
  type AreaId,
  type ContextAnswers,
  type GoalId,
  type HaveId,
} from "@/content/punto-di-partenza";

/**
 * Motore di «Punto di Partenza»: regole fisse e leggibili, nessuna AI, nessun punteggio di rischio.
 * Le risposte restano nel browser: questa funzione è pura e gira sul dispositivo della persona.
 */

export interface PdpAnswers {
  goal: GoalId | null;
  have: HaveId[];
  context: ContextAnswers;
  /** Scelte esplicite sulle aree (true = ho già informazioni recenti). Se manca, vale la proposta da «Cosa hai già». */
  areaOverrides: Partial<Record<AreaId, boolean>>;
  notes: string;
}

export const EMPTY_ANSWERS: PdpAnswers = {
  goal: null,
  have: [],
  context: { age: null, smoke: null, activity: null, familiarity: null, conditions: null },
  areaOverrides: {},
  notes: "",
};

export interface MapArea {
  area: Area;
  notes: string[];
}

export interface PdpMap {
  version: string;
  goalLabel: string | null;
  available: string[];
  documented: MapArea[];
  /** Aree di base non ancora documentate. */
  toDiscussBase: MapArea[];
  /** Aree contestuali non ancora documentate: «da discutere, se pertinente». */
  toDiscussContextual: MapArea[];
  notRoutine: typeof NOT_ROUTINE;
  generalNotes: string[];
  questions: string[];
  /** Completezza della mappa (0–100): informazioni fornite, non stato di salute. */
  completeness: number;
  completenessParts: { given: number; total: number };
}

/** L'area risulta documentata? Scelta esplicita, altrimenti proposta da «Cosa hai già». */
export function isDocumented(a: PdpAnswers, id: AreaId): boolean {
  const o = a.areaOverrides[id];
  if (o !== undefined) return o;
  return a.have.some((h) => HAVE.find((x) => x.id === h)?.areas.includes(id));
}

/** «Nessuno / non ricordo» esclude le altre voci, e viceversa. */
export function toggleHave(list: HaveId[], id: HaveId): HaveId[] {
  if (list.includes(id)) return list.filter((x) => x !== id);
  if (id === "nessuno") return ["nessuno"];
  return [...list.filter((x) => x !== "nessuno"), id];
}

function answered(v: string | null): boolean {
  return v !== null && v !== NOT_SAID && v !== "non-so";
}

export function completeness(a: PdpAnswers): { pct: number; given: number; total: number } {
  const ctx = Object.values(a.context).filter(answered).length;
  const areas = AREAS.filter((x) => isDocumented(a, x.id)).length;
  const total = Object.keys(a.context).length + AREAS.length;
  const given = ctx + areas;
  return { pct: Math.round((given / total) * 100), given, total };
}

function notesFor(a: PdpAnswers, id: AreaId): string[] {
  const out: string[] = [];
  const c = a.context;
  if (c.smoke === "si" && AREA_NOTES.smoke.areas.includes(id)) out.push(AREA_NOTES.smoke.text);
  if (c.activity === "raramente" && AREA_NOTES.activity.areas.includes(id)) out.push(AREA_NOTES.activity.text);
  if (c.familiarity === "si" && AREA_NOTES.familiarity.areas.includes(id)) out.push(AREA_NOTES.familiarity.text);
  if (answered(c.age) && AREA_NOTES.age.areas.includes(id)) out.push(AREA_NOTES.age.text);
  return out;
}

export function buildMap(a: PdpAnswers): PdpMap {
  const all = AREAS.map((area) => ({ area, notes: notesFor(a, area.id) }));
  const documented = all.filter((x) => isDocumented(a, x.area.id));
  const open = all.filter((x) => !isDocumented(a, x.area.id));
  const hasExams = a.have.some((h) => h !== "nessuno");

  const q: string[] = [DOCTOR_QUESTIONS.base, hasExams ? DOCTOR_QUESTIONS.haveExams : DOCTOR_QUESTIONS.noExams];
  if (!isDocumented(a, "screening")) q.push(DOCTOR_QUESTIONS.screening);
  if (a.context.smoke === "si" || a.context.activity === "raramente") q.push(DOCTOR_QUESTIONS.habits);
  if (a.context.familiarity === "si") q.push(DOCTOR_QUESTIONS.familiarity);
  if (a.goal === "organizzare" || a.goal === "documentazione") q.push(DOCTOR_QUESTIONS.organize);
  q.push(DOCTOR_QUESTIONS.timing);
  // Da 4 a 6 domande: le prime sono sempre le più generali, «quando rivederci» chiude sempre la lista.
  const questions = q.length > 6 ? [...q.slice(0, 5), DOCTOR_QUESTIONS.timing] : q;
  while (questions.length < 4) questions.splice(questions.length - 1, 0, DOCTOR_QUESTIONS.organize);

  const c = completeness(a);
  return {
    version: PDP_CONTENT_VERSION,
    goalLabel: GOALS.find((g) => g.id === a.goal)?.label ?? null,
    available: a.have.filter((h) => h !== "nessuno").map((h) => HAVE.find((x) => x.id === h)!.label),
    documented,
    toDiscussBase: open.filter((x) => x.area.category === "base"),
    toDiscussContextual: open.filter((x) => x.area.category === "contextual"),
    notRoutine: NOT_ROUTINE,
    generalNotes: a.context.conditions === "si" ? [CONDITIONS_NOTE] : [],
    questions: [...new Set(questions)],
    completeness: c.pct,
    completenessParts: { given: c.given, total: c.total },
  };
}

/** Testo semplice della scheda (copia negli appunti, anteprima di stampa, test). */
export function mapToText(m: PdpMap, notes = ""): string {
  const lines = ["PUNTO DI PARTENZA — Cura Privata", ""];
  if (m.goalLabel) lines.push(`Obiettivo: ${m.goalLabel}`, "");
  lines.push(`Completezza delle informazioni: ${m.completeness}% (misura la mappa, non la salute)`, "");
  lines.push("Informazioni già disponibili:", ...(m.available.length ? m.available.map((x) => `- ${x}`) : ["- nessuna indicata"]), "");
  lines.push("Già documentato:", ...(m.documented.length ? m.documented.map((x) => `- ${x.area.title}`) : ["- nessuna area"]), "");
  lines.push("Da discutere con il medico:", ...m.toDiscussBase.map((x) => `- ${x.area.title}`), "");
  lines.push("Da discutere, se pertinente nel tuo caso:", ...m.toDiscussContextual.map((x) => `- ${x.area.title}`), "");
  lines.push("Non di routine senza un motivo clinico:", ...m.notRoutine.map((x) => `- ${x.title}`), "");
  lines.push("Domande per il medico:", ...m.questions.map((x, i) => `${i + 1}. ${x}`));
  if (notes.trim()) lines.push("", "Note:", notes.trim());
  return lines.join("\n");
}

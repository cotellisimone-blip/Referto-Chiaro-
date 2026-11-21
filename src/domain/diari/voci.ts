import { z } from "zod";
import { fold, icsEscape } from "@/domain/famiglia/promemoria";
import type { Diario, DiarioSlug } from "./catalogo";

/**
 * Le voci dei diari (21/11/2026): una misura della pressione, una glicemia, un episodio di mal di testa (o la spunta
 * «oggi niente»). Le scrive la persona; il sito controlla solo che il numero sia plausibile (contro gli errori di
 * battitura) e ne calcola le medie. Nessuna soglia, nessun colore «alto» o «basso», nessun giudizio.
 */

export const MOMENTI_GLICEMIA = {
  digiuno: "A digiuno",
  "prima-pasto": "Prima di un pasto",
  "dopo-pasto": "2 ore dopo il pasto",
  sera: "Prima di dormire",
  altro: "Altro momento",
} as const;
export type MomentoGlicemia = keyof typeof MOMENTI_GLICEMIA;

export const INTENSITA = { lieve: "Lieve", media: "Media", forte: "Forte" } as const;
export type Intensita = keyof typeof INTENSITA;
export const INTENSITA_AIUTO: Record<Intensita, string> = {
  lieve: "Fai tutto",
  media: "Fai le cose a fatica",
  forte: "Ti fermi",
};

export const SINTOMI = { nausea: "Nausea", luce: "Fastidio per la luce", rumori: "Fastidio per i rumori", vista: "Disturbi della vista prima" } as const;
export type Sintomo = keyof typeof SINTOMI;

export interface DatiPressione {
  sys: number;
  dia: number;
  bpm: number | null;
}
export interface DatiGlicemia {
  mgdl: number;
  momento: MomentoGlicemia;
}
export interface DatiCefalea {
  tipo: "episodio" | "nessuno";
  intensita: Intensita | null;
  durataOre: number | null;
  sintomi: Sintomo[];
  farmaco: string | null;
}

export type VoceDiario =
  | { id: string; profileId: string | null; diario: "pressione"; at: string; dati: DatiPressione; note: string | null; createdAt: string }
  | { id: string; profileId: string | null; diario: "glicemia"; at: string; dati: DatiGlicemia; note: string | null; createdAt: string }
  | { id: string; profileId: string | null; diario: "cefalea"; at: string; dati: DatiCefalea; note: string | null; createdAt: string };

/** «2026-11-21T07:32»: data e ora locali di chi misura (il mattino resta mattino anche in viaggio). */
export const AT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const base = {
  profileId: z.string().max(64).nullable().optional(),
  at: z.string().regex(AT_RE, "Data o ora non valida."),
  note: z.string().trim().max(200, "Al massimo 200 caratteri.").nullable().optional(),
};

/** Limiti contro gli errori di battitura (non sono soglie cliniche: qualsiasi numero vero ci sta). */
export const LIMITI = {
  sys: [60, 280],
  dia: [30, 180],
  bpm: [25, 240],
  mgdl: [15, 700],
  durataOre: [0, 168],
} as const;
const msgNumero = "Controlla il numero: sembra un errore di battitura.";

export const VoceInputSchema = z.discriminatedUnion("diario", [
  z
    .object({
      diario: z.literal("pressione"),
      ...base,
      dati: z
        .object({
          sys: z.number().int().min(LIMITI.sys[0], msgNumero).max(LIMITI.sys[1], msgNumero),
          dia: z.number().int().min(LIMITI.dia[0], msgNumero).max(LIMITI.dia[1], msgNumero),
          bpm: z.number().int().min(LIMITI.bpm[0], msgNumero).max(LIMITI.bpm[1], msgNumero).nullable().optional(),
        })
        .strict()
        .refine((d) => d.sys > d.dia, "La massima deve essere più alta della minima: forse sono invertite?"),
    })
    .strict(),
  z
    .object({
      diario: z.literal("glicemia"),
      ...base,
      dati: z
        .object({
          mgdl: z.number().int().min(LIMITI.mgdl[0], msgNumero).max(LIMITI.mgdl[1], msgNumero),
          momento: z.enum(Object.keys(MOMENTI_GLICEMIA) as [MomentoGlicemia, ...MomentoGlicemia[]]),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      diario: z.literal("cefalea"),
      ...base,
      dati: z
        .object({
          tipo: z.enum(["episodio", "nessuno"]),
          intensita: z.enum(["lieve", "media", "forte"]).nullable().optional(),
          durataOre: z.number().min(LIMITI.durataOre[0]).max(LIMITI.durataOre[1], "Al massimo una settimana.").nullable().optional(),
          sintomi: z.array(z.enum(Object.keys(SINTOMI) as [Sintomo, ...Sintomo[]])).max(4).optional(),
          farmaco: z.string().trim().max(60, "Al massimo 60 caratteri.").nullable().optional(),
        })
        .strict()
        .refine((d) => d.tipo === "nessuno" || d.intensita, "Scegli quanto era forte."),
    })
    .strict(),
]);
export type VoceInput = z.infer<typeof VoceInputSchema>;

/** I dati come si salvano: campi facoltativi a null, sintomi in ordine fisso, niente campi di un episodio nella spunta «niente». */
export type NuovaVoce = VoceDiario extends infer V ? (V extends VoceDiario ? Omit<V, "id" | "createdAt"> : never) : never;

export function normalizza(input: VoceInput): NuovaVoce {
  const note = input.note?.trim() || null;
  const profileId = input.profileId ?? null;
  if (input.diario === "pressione") return { diario: "pressione", at: input.at, profileId, note, dati: { sys: input.dati.sys, dia: input.dati.dia, bpm: input.dati.bpm ?? null } };
  if (input.diario === "glicemia") return { diario: "glicemia", at: input.at, profileId, note, dati: { mgdl: input.dati.mgdl, momento: input.dati.momento } };
  const d = input.dati;
  const dati: DatiCefalea =
    d.tipo === "nessuno"
      ? { tipo: "nessuno", intensita: null, durataOre: null, sintomi: [], farmaco: null }
      : {
          tipo: "episodio",
          intensita: d.intensita ?? null,
          durataOre: d.durataOre ?? null,
          sintomi: (Object.keys(SINTOMI) as Sintomo[]).filter((s) => d.sintomi?.includes(s)),
          farmaco: d.farmaco?.trim() || null,
        };
  return { diario: "cefalea", at: input.at, profileId, note, dati };
}

/** La data e l'ora devono essere vere, non nel futuro (oltre un'ora di tolleranza) e non più vecchie di due anni. */
export function isPlausibleAt(at: string, now = new Date()): boolean {
  if (!AT_RE.test(at)) return false;
  const d = new Date(`${at}:00`);
  if (Number.isNaN(d.getTime())) return false;
  const [y, m, day] = at.slice(0, 10).split("-").map(Number);
  if (d.getFullYear() !== y || d.getMonth() + 1 !== m || d.getDate() !== day) return false;
  return d.getTime() <= now.getTime() + 3600_000 && d.getTime() >= now.getTime() - 2 * 366 * 864e5;
}

/** Adesso, nel formato delle voci (ora locale del dispositivo). */
export function nowAt(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function dayOf(at: string) {
  return at.slice(0, 10);
}

/** Mattina fino alle 12, sera dalle 17: come chiede il protocollo della pressione a casa. */
export function fascia(at: string): "mattina" | "giorno" | "sera" {
  const h = Number(at.slice(11, 13));
  if (h < 12) return "mattina";
  if (h >= 17) return "sera";
  return "giorno";
}

const GIORNI = ["dom", "lun", "mar", "mer", "gio", "ven", "sab"];
const MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
/** «sab 21 nov» */
export function giornoBreve(day: string): string {
  const d = new Date(`${day}T12:00:00Z`);
  return `${GIORNI[d.getUTCDay()]} ${d.getUTCDate()} ${MESI[d.getUTCMonth()]}`;
}
/** «21/11/2026» */
export function dataIt(day: string): string {
  const [y, m, d] = day.split("-");
  return `${d}/${m}/${y}`;
}

export function addDays(day: string, n: number): string {
  return new Date(Date.parse(`${day}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
}

const media = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null);

type Voce<K extends DiarioSlug> = Extract<VoceDiario, { diario: K }>;

export function ordina<T extends { at: string; createdAt: string }>(xs: T[]): T[] {
  return [...xs].sort((a, b) => (a.at === b.at ? a.createdAt.localeCompare(b.createdAt) : a.at.localeCompare(b.at)));
}

/** Le voci degli ultimi `giorni` giorni, oggi compreso. */
export function periodo<T extends { at: string }>(xs: T[], giorni: number, oggi: string): T[] {
  const dal = addDays(oggi, -(giorni - 1));
  return xs.filter((x) => dayOf(x.at) >= dal && dayOf(x.at) <= oggi);
}

export interface MediaPressione {
  sys: number;
  dia: number;
  n: number;
}
export interface RiepilogoPressione {
  dal: string | null;
  al: string | null;
  giorni: number;
  misure: number;
  /** Le linee guida escludono il primo giorno quando i giorni sono almeno 4. */
  senzaPrimoGiorno: boolean;
  totale: MediaPressione | null;
  mattina: MediaPressione | null;
  sera: MediaPressione | null;
  bpm: number | null;
}

function mediaP(xs: Voce<"pressione">[]): MediaPressione | null {
  if (!xs.length) return null;
  return { sys: media(xs.map((x) => x.dati.sys))!, dia: media(xs.map((x) => x.dati.dia))!, n: xs.length };
}

export function riepilogoPressione(all: VoceDiario[], giorni = 7, oggi = nowAt().slice(0, 10)): RiepilogoPressione {
  const xs = ordina(periodo(all.filter((x): x is Voce<"pressione"> => x.diario === "pressione"), giorni, oggi));
  const days = [...new Set(xs.map((x) => dayOf(x.at)))];
  const senzaPrimoGiorno = days.length >= 4;
  const usate = senzaPrimoGiorno ? xs.filter((x) => dayOf(x.at) !== days[0]) : xs;
  const bpm = usate.map((x) => x.dati.bpm).filter((b): b is number => b !== null);
  return {
    dal: days[0] ?? null,
    al: days[days.length - 1] ?? null,
    giorni: days.length,
    misure: xs.length,
    senzaPrimoGiorno,
    totale: mediaP(usate),
    mattina: mediaP(usate.filter((x) => fascia(x.at) === "mattina")),
    sera: mediaP(usate.filter((x) => fascia(x.at) === "sera")),
    bpm: media(bpm),
  };
}

export interface StatGlicemia {
  momento: MomentoGlicemia;
  n: number;
  media: number;
  min: number;
  max: number;
}
export interface RiepilogoGlicemia {
  dal: string | null;
  al: string | null;
  misure: number;
  perMomento: StatGlicemia[];
}

export function riepilogoGlicemia(all: VoceDiario[], giorni = 14, oggi = nowAt().slice(0, 10)): RiepilogoGlicemia {
  const xs = ordina(periodo(all.filter((x): x is Voce<"glicemia"> => x.diario === "glicemia"), giorni, oggi));
  const perMomento: StatGlicemia[] = [];
  for (const momento of Object.keys(MOMENTI_GLICEMIA) as MomentoGlicemia[]) {
    const v = xs.filter((x) => x.dati.momento === momento).map((x) => x.dati.mgdl);
    if (v.length) perMomento.push({ momento, n: v.length, media: media(v)!, min: Math.min(...v), max: Math.max(...v) });
  }
  return { dal: xs[0] ? dayOf(xs[0].at) : null, al: xs.length ? dayOf(xs[xs.length - 1].at) : null, misure: xs.length, perMomento };
}

export interface RiepilogoCefalea {
  dal: string;
  al: string;
  giorniPeriodo: number;
  /** Giorni con almeno una voce (episodio o «niente»): dicono quanto è completo il diario. */
  giorniSegnati: number;
  giorniConDolore: number;
  episodi: number;
  perIntensita: Record<Intensita, number>;
  giorniConFarmaco: number;
  durataMedia: number | null;
  /** Per il calendario: ogni giorno del periodo, con l'episodio più forte. */
  calendario: { day: string; stato: "vuoto" | "nessuno" | Intensita; farmaco: boolean }[];
}

const RANK: Record<Intensita, number> = { lieve: 1, media: 2, forte: 3 };

export function riepilogoCefalea(all: VoceDiario[], giorni = 30, oggi = nowAt().slice(0, 10)): RiepilogoCefalea {
  const xs = ordina(periodo(all.filter((x): x is Voce<"cefalea"> => x.diario === "cefalea"), giorni, oggi));
  const ep = xs.filter((x) => x.dati.tipo === "episodio");
  const perIntensita: Record<Intensita, number> = { lieve: 0, media: 0, forte: 0 };
  for (const x of ep) if (x.dati.intensita) perIntensita[x.dati.intensita]++;
  const dal = addDays(oggi, -(giorni - 1));
  const calendario: RiepilogoCefalea["calendario"] = [];
  for (let i = 0; i < giorni; i++) {
    const day = addDays(dal, i);
    const v = xs.filter((x) => dayOf(x.at) === day);
    const e = v.filter((x) => x.dati.tipo === "episodio" && x.dati.intensita);
    const worst = e.map((x) => x.dati.intensita!).sort((a, b) => RANK[b] - RANK[a])[0];
    calendario.push({ day, stato: worst ?? (v.length ? "nessuno" : "vuoto"), farmaco: e.some((x) => Boolean(x.dati.farmaco)) });
  }
  const durate = ep.map((x) => x.dati.durataOre).filter((d): d is number => d !== null);
  return {
    dal,
    al: oggi,
    giorniPeriodo: giorni,
    giorniSegnati: calendario.filter((c) => c.stato !== "vuoto").length,
    giorniConDolore: calendario.filter((c) => c.stato !== "vuoto" && c.stato !== "nessuno").length,
    episodi: ep.length,
    perIntensita,
    giorniConFarmaco: calendario.filter((c) => c.farmaco).length,
    durataMedia: durate.length ? Math.round((durate.reduce((a, b) => a + b, 0) / durate.length) * 10) / 10 : null,
    calendario,
  };
}

/** La voce in una riga, per gli elenchi e il foglio: «128/82 · 66 battiti», «104 mg/dL · a digiuno», «Forte · 4 ore». */
export function rigaVoce(v: VoceDiario): string {
  if (v.diario === "pressione") return `${v.dati.sys}/${v.dati.dia}${v.dati.bpm ? ` · ${v.dati.bpm} battiti` : ""}`;
  if (v.diario === "glicemia") return `${v.dati.mgdl} mg/dL · ${MOMENTI_GLICEMIA[v.dati.momento].toLowerCase()}`;
  if (v.dati.tipo === "nessuno") return "Niente mal di testa";
  const parts: string[] = [INTENSITA[v.dati.intensita ?? "lieve"]];
  if (v.dati.durataOre !== null) parts.push(durataTesto(v.dati.durataOre));
  if (v.dati.sintomi.length) parts.push(v.dati.sintomi.map((s) => SINTOMI[s].toLowerCase()).join(", "));
  if (v.dati.farmaco) parts.push(`preso: ${v.dati.farmaco}`);
  return parts.join(" · ");
}

export function durataTesto(ore: number): string {
  if (ore < 1) return `${Math.round(ore * 60)} minuti`;
  if (ore === 1) return "1 ora";
  return `${String(ore).replace(".", ",")} ore`;
}

/**
 * Promemoria nel calendario del telefono: un evento che si ripete ogni giorno, a ogni orario scelto, per `giorni`
 * giorni, con l'avviso all'ora giusta. Il titolo non contiene numeri né nomi di malattie: dice solo che cosa fare.
 */
export function buildDiarioIcs(d: Pick<Diario, "slug" | "nome" | "promemoria">, orari: string[], giorni: number, dal: string, stamp = new Date()): string {
  const dtstamp = stamp.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Cura Privata//Diari//IT", "CALSCALE:GREGORIAN"];
  for (const o of orari.filter((x) => /^\d{2}:\d{2}$/.test(x))) {
    const start = `${dal.replace(/-/g, "")}T${o.replace(":", "")}00`;
    const endM = Number(o.slice(0, 2)) * 60 + Number(o.slice(3)) + 10;
    const end = `${dal.replace(/-/g, "")}T${String(Math.floor(endM / 60) % 24).padStart(2, "0")}${String(endM % 60).padStart(2, "0")}00`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:diario-${d.slug}-${dal}-${o.replace(":", "")}@cura-privata`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `RRULE:FREQ=DAILY;COUNT=${Math.max(1, Math.min(90, giorni))}`,
      `SUMMARY:${icsEscape(d.promemoria.testo)}`,
      `DESCRIPTION:${icsEscape(`Diario: ${d.nome}. Scrivi la misura nella tua area personale di Cura Privata.`)}`,
      "BEGIN:VALARM",
      "TRIGGER:PT0M",
      "ACTION:DISPLAY",
      `DESCRIPTION:${icsEscape(d.promemoria.testo)}`,
      "END:VALARM",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

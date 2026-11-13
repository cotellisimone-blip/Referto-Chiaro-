import type { ExtractedDocument } from "@/domain/extraction/schema";
import { isReadable } from "@/domain/extraction/schema";
import {
  formatItalianNumber,
  parseLocaleNumber,
} from "@/domain/extraction/numbers";
import {
  parseReferenceRange,
  positionInPrintedRange,
  type RangePosition,
} from "@/domain/extraction/reference";
import { normalizeName } from "@/domain/dossier/build-dossier";

/**
 * «La tua salute nel tempo» (13/11/2026): ogni referto confermato si aggiunge ai precedenti della stessa persona
 * e, esame per esame, si vede come si muovono i numeri.
 *
 * Regole, le stesse del dossier e di «A colpo d'occhio»:
 * - entrano solo i valori CONFERMATI dalla persona, leggibili e numerici;
 * - si mettono in fila solo valori con stesso nome e stessa unità di misura;
 * - nessun giudizio: si dice dove cade il numero rispetto all'intervallo STAMPATO e di quanto è cambiato, mai se va bene.
 * Tutto è calcolato dal codice, mai dall'AI. Le domande per il medico restano domande.
 */

export interface TimelineInput {
  documentId: string;
  title: string;
  extracted: ExtractedDocument;
  confirmedObservationIds: string[];
}

export interface SeriesPoint {
  documentId: string;
  documentTitle: string;
  date: string;
  valueRaw: string;
  value: number;
  decimals: number;
  referenceRaw: string | null;
  position: RangePosition;
}

export interface Series {
  key: string;
  name: string;
  unit: string;
  points: SeriesPoint[];
  /** Intervallo stampato uguale in tutti i referti: si può disegnare una fascia sola. */
  band: { low: number | null; high: number | null; raw: string } | null;
  /** «Dal 10/11/2023 al 04/11/2026: da 86 a 92 mg/dL (+6).» Solo con almeno due punti. */
  changeText: string | null;
  /** «Rispetto al 06/11/2025: +2 mg/dL.» Solo con almeno tre punti. */
  lastStepText: string | null;
  /** Posizione dell'ultimo numero, a parole. */
  lastPositionText: string;
  outsideCount: number;
  question: string | null;
}

export interface Timeline {
  series: Series[];
  /** Esami misurati una volta sola: si elencano, non si disegnano. */
  single: Series[];
  notes: string[];
  documentCount: number;
  span: { from: string; to: string } | null;
  questions: string[];
}

export function fmtDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

const POSITION_TEXT: Record<RangePosition, string> = {
  inside: "dentro l'intervallo stampato",
  "above-range": "sopra l'intervallo stampato",
  "below-range": "sotto l'intervallo stampato",
  "not-comparable": "senza un intervallo stampato confrontabile",
};
export const positionText = (p: RangePosition) => POSITION_TEXT[p];

function signed(delta: number, decimals: number): string {
  if (delta === 0) return "nessuna differenza";
  return `${delta > 0 ? "+" : "−"}${formatItalianNumber(Math.abs(delta), decimals)}`;
}

function bandOf(raw: string | null): Series["band"] {
  const r = parseReferenceRange(raw);
  if (r.kind === "between") return { low: r.low, high: r.high, raw: raw ?? "" };
  if (r.kind === "below") return { low: null, high: r.high, raw: raw ?? "" };
  if (r.kind === "above") return { low: r.low, high: null, raw: raw ?? "" };
  return null;
}

export function buildTimeline(items: TimelineInput[]): Timeline {
  const sorted = [...items].sort((a, b) =>
    a.extracted.reportDate.localeCompare(b.extracted.reportDate),
  );
  const groups = new Map<
    string,
    { name: string; unit: string; points: SeriesPoint[] }
  >();
  const unitsByName = new Map<string, Set<string>>();
  for (const it of sorted) {
    const confirmed = new Set(it.confirmedObservationIds);
    for (const obs of it.extracted.observations) {
      if (!confirmed.has(obs.id) || !isReadable(obs)) continue;
      const num = parseLocaleNumber(obs.valueRaw);
      if (!num.ok) continue;
      const nameKey = normalizeName(obs.nameRaw);
      const unit = (obs.unitRaw ?? "").trim();
      const key = `${nameKey}|${unit.toLowerCase()}`;
      unitsByName.set(
        nameKey,
        (unitsByName.get(nameKey) ?? new Set()).add(unit.toLowerCase()),
      );
      const g = groups.get(key) ?? { name: obs.nameRaw, unit, points: [] };
      g.name = obs.nameRaw; // il nome più recente, come stampato
      g.points.push({
        documentId: it.documentId,
        documentTitle: it.title,
        date: it.extracted.reportDate,
        valueRaw: obs.valueRaw!,
        value: num.value,
        decimals: num.decimals,
        referenceRaw: obs.referenceRaw,
        position: positionInPrintedRange(
          num.value,
          parseReferenceRange(obs.referenceRaw),
        ),
      });
      groups.set(key, g);
    }
  }

  const all: Series[] = [...groups.entries()].map(([key, g]) => {
    const pts = g.points;
    const first = pts[0];
    const last = pts[pts.length - 1];
    const refs = new Set(
      pts.map((p) => (p.referenceRaw ?? "").replace(/\s+/g, " ").trim()),
    );
    const band = refs.size === 1 ? bandOf(last.referenceRaw) : null;
    const unit = g.unit;
    const u = unit ? ` ${unit}` : "";
    const outsideCount = pts.filter(
      (p) => p.position === "above-range" || p.position === "below-range",
    ).length;
    let changeText: string | null = null;
    let lastStepText: string | null = null;
    if (pts.length >= 2) {
      const dec = Math.max(first.decimals, last.decimals);
      changeText =
        first.value === last.value
          ? `Stesso numero il ${fmtDate(first.date)} e il ${fmtDate(last.date)}: ${last.valueRaw}${u}.`
          : `Dal ${fmtDate(first.date)} al ${fmtDate(last.date)}: da ${first.valueRaw} a ${last.valueRaw}${u} (${signed(last.value - first.value, dec)}).`;
    }
    if (pts.length >= 3) {
      const prev = pts[pts.length - 2];
      const dec = Math.max(prev.decimals, last.decimals);
      lastStepText = `Rispetto al ${fmtDate(prev.date)}: ${signed(last.value - prev.value, dec)}${last.value === prev.value ? "" : u}.`;
    }
    let question: string | null = null;
    const lastOut =
      last.position === "above-range" || last.position === "below-range";
    if (pts.length >= 2 && lastOut) {
      question = `${g.name}: dal ${fmtDate(first.date)} al ${fmtDate(last.date)} il numero è passato da ${first.valueRaw} a ${last.valueRaw}${u} e l'ultimo è ${last.position === "above-range" ? "sopra" : "sotto"} l'intervallo stampato dal laboratorio. Che cosa significa nel mio caso, se significa qualcosa?`;
    } else if (pts.length >= 2 && outsideCount > 0) {
      question = `${g.name}: in ${outsideCount} ${outsideCount === 1 ? "referto" : "referti"} su ${pts.length} il numero era fuori dall'intervallo stampato, nell'ultimo no. È utile parlarne alla prossima visita?`;
    }
    return {
      key,
      name: g.name,
      unit,
      points: pts,
      band,
      changeText,
      lastStepText,
      lastPositionText: `Ultimo numero ${POSITION_TEXT[last.position]}`,
      outsideCount,
      question,
    };
  });

  // Prima le serie con almeno due punti in cui l'ultimo numero è fuori dall'intervallo, poi le altre (ordine del referto più recente).
  const rank = (s: Series) => {
    const last = s.points[s.points.length - 1];
    return last.position === "above-range" || last.position === "below-range"
      ? 0
      : s.outsideCount
        ? 1
        : 2;
  };
  const multi = all
    .filter((s) => s.points.length >= 2)
    .sort((a, b) => rank(a) - rank(b));
  const single = all.filter((s) => s.points.length < 2);

  const notes: string[] = [];
  for (const [nameKey, units] of unitsByName) {
    if (units.size > 1) {
      const name =
        all.find((s) => s.key.startsWith(`${nameKey}|`))?.name ?? nameKey;
      notes.push(
        `${name}: unità di misura diverse tra i referti, quindi i numeri sono mostrati in righe separate e non messi in fila.`,
      );
    }
  }
  if (multi.some((s) => !s.band))
    notes.push(
      "Quando l'intervallo stampato cambia da un referto all'altro, la fascia colorata non si disegna: ogni punto riporta il suo intervallo.",
    );

  const dates = sorted.map((s) => s.extracted.reportDate);
  return {
    series: multi,
    single,
    notes,
    documentCount: sorted.length,
    span: dates.length ? { from: dates[0], to: dates[dates.length - 1] } : null,
    questions: multi.map((s) => s.question).filter((q): q is string => !!q),
  };
}

export const NEL_TEMPO_LIMITI = [
  "Mettiamo in fila numeri dello stesso esame con la stessa unità di misura. Non diciamo se un andamento va bene o male: lo può dire solo il medico.",
  "Laboratori e metodi diversi possono dare numeri diversi anche per la stessa persona nello stesso giorno.",
  "Entrano solo i valori che hai confermato. Quelli non leggibili restano fuori dal grafico.",
  "In caso di urgenza non usare questo servizio: in Italia chiama il 112.",
];

/**
 * Geometria del grafico, in unità astratte (0–100 orizzontale, 0–100 verticale dall'alto).
 * L'asse orizzontale segue il calendario: due referti a un mese di distanza stanno vicini.
 */
export function chartGeometry(s: Pick<Series, "points" | "band">) {
  const t = s.points.map((p) => Date.parse(p.date));
  const t0 = Math.min(...t);
  const t1 = Math.max(...t);
  const vals = s.points.map((p) => p.value);
  if (s.band?.low != null) vals.push(s.band.low);
  if (s.band?.high != null) vals.push(s.band.high);
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  const pad = (hi - lo || Math.abs(hi) || 1) * 0.18;
  lo -= pad;
  hi += pad;
  const x = (ms: number) => (t1 === t0 ? 50 : 6 + ((ms - t0) / (t1 - t0)) * 88);
  const y = (v: number) => 100 - ((v - lo) / (hi - lo)) * 100;
  return {
    points: s.points.map((p, i) => ({
      x: Math.round(x(t[i]) * 10) / 10,
      y: Math.round(y(p.value) * 10) / 10,
      p,
    })),
    band: s.band
      ? {
          top: s.band.high != null ? y(s.band.high) : 0,
          bottom: s.band.low != null ? y(s.band.low) : 100,
        }
      : null,
  };
}

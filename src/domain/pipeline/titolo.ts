import type { ExtractedDocument } from "@/domain/extraction/schema";

/**
 * 18/11/2026 (terzo giro, punti 3 e 4).
 * Il nome di un referto: finché la persona non lo cambia, lo scegliamo noi dal tipo e dalla data del prelievo
 * («Emocromo del 12 settembre 2026»), mai dal nome del file («IMG_2041.jpg»).
 * L'impronta serve a riconoscere lo stesso referto caricato due volte, anche da due fotografie diverse:
 * guarda solo ciò che è stampato (data e righe), non il file.
 */
const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

/** «4 novembre 2026» da «2026-11-04». Se la data non è valida restituisce stringa vuota. */
export function longDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return "";
  const month = MESI[Number(m[2]) - 1];
  return month ? `${Number(m[3])} ${month} ${m[1]}` : "";
}

/** Nome per un referto caricato, quando non sappiamo altro che la data. */
export const UPLOAD_BASE_TITLE = "Esami";

export function autoTitle(base: string, reportDate: string): string {
  const d = longDate(reportDate);
  const b = base.trim() || UPLOAD_BASE_TITLE;
  return d ? `${b} del ${d}` : b;
}

/** Quando sul documento non c'è una data leggibile non ne inventiamo una: il nome dice il giorno del caricamento. */
export function uploadedTitle(today: string): string {
  const d = longDate(today);
  return d ? `${UPLOAD_BASE_TITLE} caricati il ${d}` : UPLOAD_BASE_TITLE;
}

export const TITLE_MAX = 80;

/** Il nome scritto dalla persona: una riga, senza caratteri di controllo, al massimo 80 caratteri. Vuoto = non valido. */
export function cleanTitle(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const t = input.replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, TITLE_MAX).trim();
  return t.length ? t : null;
}

const norm = (s: string | null | undefined) => (s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9,.<>%/]+/g, "");

/** Stessa data e stesse righe (nome, valore, unità) = stesso referto. */
export function fingerprint(doc: Pick<ExtractedDocument, "reportDate" | "observations">): string {
  const rows = doc.observations.map((o) => `${norm(o.nameRaw)}=${norm(o.valueRaw)}${norm(o.unitRaw)}`).sort();
  return `${doc.reportDate}|${rows.join("|")}`;
}

interface DocLike {
  id: string;
  profileId: string | null;
  createdAt: string;
  extracted: Pick<ExtractedDocument, "reportDate" | "observations"> | null;
}

/** Il referto uguale più vecchio della stessa persona, se c'è. */
export function findOlderTwin<T extends DocLike>(doc: T, all: T[]): T | null {
  if (!doc.extracted) return null;
  const fp = fingerprint(doc.extracted);
  const twins = all
    .filter((d) => d.id !== doc.id && d.profileId === doc.profileId && d.extracted && fingerprint(d.extracted) === fp)
    .filter((d) => d.createdAt < doc.createdAt || (d.createdAt === doc.createdAt && d.id < doc.id))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return twins[0] ?? null;
}

/** Tra referti uguali ne resta uno: quello con più righe confermate, a parità il più vecchio. */
export function dropTwins<T extends DocLike & { verification: { confirmedObservationIds: string[] } | null }>(docs: T[]): T[] {
  const best = new Map<string, T>();
  const out: T[] = [];
  for (const d of [...docs].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) {
    if (!d.extracted) {
      out.push(d);
      continue;
    }
    const key = `${d.profileId ?? "io"}#${fingerprint(d.extracted)}`;
    const cur = best.get(key);
    if (!cur || (d.verification?.confirmedObservationIds.length ?? 0) > (cur.verification?.confirmedObservationIds.length ?? 0)) best.set(key, d);
  }
  return [...out, ...best.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

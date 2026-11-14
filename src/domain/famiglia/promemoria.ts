import { z } from "zod";

/**
 * Promemoria (13/11/2026): ciò che riporta le persone su Cura Privata senza che debbano ricordarselo.
 *
 * Non suggeriamo MAI quando ripetere un esame: le date le mette la persona (di solito su indicazione del medico).
 * Tre tipi: una visita (con le domande da portare), un controllo da ripetere, altro.
 * L'email di promemoria non contiene il titolo né dettagli sanitari: dice solo che c'è un promemoria e quando.
 */

export const TIPI = {
  visita: "Visita dal medico",
  controllo: "Esame o controllo da ripetere",
  altro: "Altro",
} as const;
export type TipoPromemoria = keyof typeof TIPI;

export interface Promemoria {
  id: string;
  profileId: string | null;
  kind: TipoPromemoria;
  title: string;
  dueDate: string;
  note: string | null;
  questions: string[];
  doneAt: string | null;
  createdAt: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const PromemoriaInputSchema = z
  .object({
    profileId: z.string().max(64).nullable().optional(),
    kind: z.enum(Object.keys(TIPI) as [TipoPromemoria, ...TipoPromemoria[]]),
    title: z
      .string()
      .trim()
      .min(1, "Scrivi di che cosa si tratta.")
      .max(80, "Al massimo 80 caratteri."),
    dueDate: z.string().regex(DATE_RE, "Data non valida."),
    note: z.string().trim().max(300).nullable().optional(),
    questions: z.array(z.string().trim().min(1).max(400)).max(12).optional(),
  })
  .strict();
export type PromemoriaInput = z.infer<typeof PromemoriaInputSchema>;

export const PromemoriaPatchSchema = z
  .object({
    done: z.boolean().optional(),
    addQuestions: z.array(z.string().trim().min(1).max(400)).max(12).optional(),
    removeQuestion: z.number().int().min(0).max(11).optional(),
  })
  .strict();

/** La data deve essere vera e non troppo lontana (un anno indietro, cinque avanti). */
export function isPlausibleDue(due: string, today = todayIso()): boolean {
  if (!DATE_RE.test(due)) return false;
  const d = new Date(`${due}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== due)
    return false;
  const t = new Date(`${today}T00:00:00Z`).getTime();
  return d.getTime() >= t - 366 * 864e5 && d.getTime() <= t + 5 * 366 * 864e5;
}

export function todayIso(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round(
    (Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) /
      864e5,
  );
}

/** «Oggi», «Domani», «Tra 5 giorni», «Tra 3 settimane», «Il 12/03/2027», «5 giorni fa». */
export function whenLabel(due: string, today = todayIso()): string {
  const n = daysBetween(today, due);
  if (n === 0) return "Oggi";
  if (n === 1) return "Domani";
  if (n === -1) return "Ieri";
  if (n < 0) return n > -30 ? `${-n} giorni fa` : `Il ${fmt(due)}`;
  if (n < 14) return `Tra ${n} giorni`;
  if (n < 60) return `Tra ${Math.round(n / 7)} settimane`;
  return `Il ${fmt(due)}`;
}

function fmt(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** Prima i promemoria da fare, dal più vicino; poi quelli fatti, dal più recente. */
export function sortPromemoria<
  T extends Pick<Promemoria, "dueDate" | "doneAt">,
>(list: T[]): T[] {
  const open = list
    .filter((r) => !r.doneAt)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const done = list
    .filter((r) => r.doneAt)
    .sort((a, b) => (b.doneAt ?? "").localeCompare(a.doneAt ?? ""));
  return [...open, ...done];
}

/** Quando parte l'email: tre giorni prima (o subito, se il promemoria è più vicino), una volta sola. */
export function needsEmail(
  r: Pick<Promemoria, "dueDate" | "doneAt"> & { emailSentAt: string | null },
  today = todayIso(),
): boolean {
  if (r.doneAt || r.emailSentAt) return false;
  const n = daysBetween(today, r.dueDate);
  return n >= 0 && n <= 3;
}

const icsEscape = (s: string) =>
  s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

/** Righe di un file .ics lunghe al massimo 75 ottetti, come chiede lo standard. */
function fold(line: string): string {
  const out: string[] = [];
  let cur = "";
  for (const ch of line) {
    if (new TextEncoder().encode(cur + ch).length > 74) {
      out.push(cur);
      cur = ` ${ch}`;
    } else cur += ch;
  }
  out.push(cur);
  return out.join("\r\n");
}

/**
 * Evento di calendario per tutto il giorno, con un avviso il giorno prima. Il titolo è quello scritto dalla persona:
 * l'interfaccia ricorda che finisce nel suo calendario.
 */
export function buildIcs(
  r: Pick<Promemoria, "id" | "title" | "dueDate" | "kind">,
  personName: string | null,
  stamp = new Date(),
): string {
  const d = r.dueDate.replace(/-/g, "");
  const next = new Date(Date.parse(`${r.dueDate}T00:00:00Z`) + 864e5)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const dtstamp = stamp
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
  const summary = personName ? `${r.title} (${personName})` : r.title;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cura Privata//Promemoria//IT",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${r.id}@cura-privata`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${d}`,
    `DTEND;VALUE=DATE:${next}`,
    `SUMMARY:${icsEscape(summary)}`,
    `DESCRIPTION:${icsEscape(r.kind === "visita" ? "Le domande da portare sono nella tua area personale di Cura Privata." : "Promemoria creato nella tua area personale di Cura Privata.")}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${icsEscape(summary)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function icsFileName(r: Pick<Promemoria, "dueDate">): string {
  return `promemoria-${r.dueDate}.ics`;
}

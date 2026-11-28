import { clsx } from "clsx";
import { BellRing, MessageCircleQuestion } from "lucide-react";
import { buildTimeline, type Series } from "@/domain/famiglia/nel-tempo";
import { DEMO_HISTORY, getSyntheticDocument } from "@/fixtures/synthetic";
import { TrendCard } from "./trend-chart";

/**
 * Pezzi veri di prodotto per le pagine pubbliche: lo stesso calcolo e lo stesso disegno dell'area personale,
 * sui referti inventati di «Lucia (esempio)». Nessun dato reale, nessun numero scritto a mano.
 */
export function exampleSeries(name: string): Series | null {
  const docs = DEMO_HISTORY.filter((h) => h.owner === "lucia")
    .map((h) => ({ h, d: getSyntheticDocument(h.sampleId) }))
    .filter(
      (
        x,
      ): x is {
        h: (typeof DEMO_HISTORY)[number];
        d: NonNullable<ReturnType<typeof getSyntheticDocument>>;
      } => !!x.d,
    );
  const t = buildTimeline(
    docs.map(({ h, d }) => ({
      documentId: h.sampleId,
      title: h.title,
      extracted: d,
      confirmedObservationIds: d.observations.map((o) => o.id),
    })),
  );
  return t.series.find((s) => s.name === name) ?? null;
}

export function exampleQuestion(name: string): string | null {
  return exampleSeries(name)?.question ?? null;
}

const PEOPLE = [
  { initials: "Tu", name: "Tu", sub: "5 referti", tone: "persona-tone-io" },
  {
    initials: "LU",
    name: "Lucia",
    sub: "Mamma · 4 referti",
    tone: "persona-tone-0",
  },
  {
    initials: "GI",
    name: "Giulio",
    sub: "Figlio · 1 referto",
    tone: "persona-tone-1",
  },
];

/** La famiglia in tre pillole (nomi di esempio). */
export function ExamplePeople({
  active = 1,
  className,
}: {
  active?: number;
  className?: string;
}) {
  return (
    <div
      className={clsx("persona-switch", className)}
      aria-label="Esempio: le persone di una famiglia"
      role="group"
    >
      {PEOPLE.map((p, i) => (
        <span
          key={p.name}
          className={clsx("persona-pill", i === active && "persona-pill-on")}
        >
          <span
            aria-hidden
            className={clsx("persona-avatar persona-avatar-sm", p.tone)}
          >
            {p.initials}
          </span>
          <span className="min-w-0 text-left">
            <span className="block truncate font-bold">{p.name}</span>
            <span className="block truncate text-[0.9375rem] font-semibold text-muted">
              {p.sub}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}

/** Un promemoria di visita come appare nell'area personale. */
export function ExampleReminder({ questions }: { questions: number }) {
  return (
    <div className="rem-card is-soon">
      <span className="rem-date" aria-hidden>
        <span className="rem-date-month">gio</span>
        <span className="rem-date-day">19</span>
        <span className="rem-date-year">visita</span>
      </span>
      <div className="min-w-0">
        <span className="rem-when">
          <BellRing aria-hidden className="h-4 w-4" /> Tra 6 giorni
        </span>
        <p className="mt-2 text-[1.1875rem] font-extrabold leading-snug text-ink">
          Visita dal medico di famiglia con la mamma
        </p>
        <p className="mt-1 flex items-center gap-2 text-[1rem] text-ink-soft">
          <MessageCircleQuestion aria-hidden className="h-4 w-4 text-teal" />{" "}
          {questions} {questions === 1 ? "domanda pronta" : "domande pronte"},
          con gli ultimi numeri accanto
        </p>
      </div>
    </div>
  );
}

/** Scheda dell'andamento di un esame di esempio. */
export function ExampleTrend({
  name,
  compact = false,
}: {
  name: string;
  compact?: boolean;
}) {
  const s = exampleSeries(name);
  return s ? <TrendCard series={s} compact={compact} /> : null;
}

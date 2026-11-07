"use client";

import { ScanEye } from "lucide-react";
import type { Explanation } from "@/domain/reporting/explanation-schema";

/** Vista della spiegazione: riepilogo, valori con citazione, esclusi, domande, limiti. */
export function ExplanationView({ explanation, onReveal }: { explanation: Explanation; onReveal: (line: number) => void }) {
  return (
    <div className="space-y-6">
      <div className="grain relative overflow-hidden rounded-[var(--radius-lg)] bg-mist p-6 sm:p-7">
        <p className="eyebrow">In breve</p>
        <p className="mt-3 font-serif text-[1.375rem] leading-snug text-ink sm:text-2xl">{explanation.summary}</p>
      </div>

      <ol className="space-y-4" aria-label="Spiegazione dei valori">
        {explanation.items.map((it, i) => (
          <li key={it.sourceObservationId} className="card relative overflow-hidden p-5 pl-6 sm:p-6 sm:pl-7">
            <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(180deg,var(--color-teal),var(--color-sage))]" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h3 className="flex items-baseline gap-3 text-xl font-semibold text-ink">
                <span className="num text-xl text-sage" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {it.nameExact}
              </h3>
              <p className="tabular rounded-full bg-canvas px-3.5 py-1.5 font-mono text-[1.0625rem]">
                <strong className="text-ink">{it.originalValueExact}</strong> <span className="text-muted">{it.originalUnitExact}</span>
              </p>
            </div>
            <p className="mt-4 text-lg text-ink">{it.plainLanguageDefinition}</p>
            <p className="mt-3 text-[1.0625rem] text-ink-soft">
              Intervallo stampato: <span className="tabular font-semibold text-ink">{it.originalReferenceExact}</span>. {it.printedRangeNote}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
              <span className="text-sm text-muted">{it.limits}</span>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-mist px-3.5 text-sm font-semibold text-teal-deep hover:bg-line/60"
                onClick={() => onReveal(it.sourceCitation.line)}
              >
                <ScanEye aria-hidden className="h-4 w-4" /> Pag. {it.sourceCitation.page}, riga {it.sourceCitation.line}
                <span className="sr-only">: mostra {it.nameExact} nel documento</span>
              </button>
            </div>
          </li>
        ))}
      </ol>

      {explanation.excludedObservations.length ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-muted/40 p-5 sm:p-6">
          <p className="text-lg font-semibold text-ink">Non inclusi nella spiegazione</p>
          <ul className="mt-2 space-y-1 text-[1.0625rem] text-muted">
            {explanation.excludedObservations.map((e) => (
              <li key={e.id}>
                <span className="text-ink">{e.nameExact}</span>: {e.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="card p-6 sm:p-7">
        <p className="eyebrow">Per la visita</p>
        <h3 className="mt-3 font-serif text-2xl sm:text-[1.75rem]">Domande da portare al medico</h3>
        <ol className="mt-5 space-y-4">
          {explanation.questionsForDoctor.map((q, i) => (
            <li key={q} className="flex gap-4 text-lg">
              <span aria-hidden className="num w-7 shrink-0 text-2xl text-sage">
                {i + 1}
              </span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-cream/60 p-5 text-[1.0625rem] text-ink sm:p-6">
        <p className="font-semibold">Limiti di questa spiegazione</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {explanation.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

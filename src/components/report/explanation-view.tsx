"use client";

import { ScanEye } from "lucide-react";
import type { Explanation } from "@/domain/reporting/explanation-schema";

/** Vista della spiegazione: riepilogo, valori con citazione, esclusi, domande, limiti. */
export function ExplanationView({ explanation, onReveal }: { explanation: Explanation; onReveal: (line: number) => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-mist p-5 sm:p-6">
        <p className="eyebrow">In breve</p>
        <p className="mt-2 text-lg text-ink">{explanation.summary}</p>
      </div>

      <ol className="space-y-4" aria-label="Spiegazione dei valori">
        {explanation.items.map((it) => (
          <li key={it.sourceObservationId} className="card p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-semibold text-ink">{it.nameExact}</h3>
              <p className="tabular font-mono">
                <strong>{it.originalValueExact}</strong> <span className="text-muted">{it.originalUnitExact}</span>
              </p>
            </div>
            <p className="mt-3 text-ink">{it.plainLanguageDefinition}</p>
            <p className="mt-3 text-[0.9375rem] text-muted">
              Intervallo stampato: <span className="tabular font-semibold text-ink">{it.originalReferenceExact}</span>. {it.printedRangeNote}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
              <span className="text-xs text-muted">{it.limits}</span>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-teal hover:bg-mist"
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
        <div className="rounded-2xl border border-dashed border-muted/40 p-5">
          <p className="font-semibold text-ink">Non inclusi nella spiegazione</p>
          <ul className="mt-2 space-y-1 text-[0.9375rem] text-muted">
            {explanation.excludedObservations.map((e) => (
              <li key={e.id}>
                <span className="text-ink">{e.nameExact}</span>: {e.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="card p-5 sm:p-6">
        <h3 className="font-serif text-2xl">Domande da portare al medico</h3>
        <ul className="mt-4 space-y-3">
          {explanation.questionsForDoctor.map((q) => (
            <li key={q} className="flex gap-3">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-cream/60 p-5 text-[0.9375rem] text-ink">
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

"use client";

import { clsx } from "clsx";
import { AlertTriangle, CheckCheck, ScanEye } from "lucide-react";

export interface VerifiableObservation {
  id: string;
  nameRaw: string;
  valueRaw: string | null;
  unitRaw: string | null;
  referenceRaw: string | null;
  sourcePage: number;
  sourceLine: number;
  parseConfidence: "high" | "medium" | "low";
}

export const isReadableObs = (o: VerifiableObservation) => o.valueRaw !== null && o.parseConfidence !== "low";

/** Elenco dei valori estratti da confermare uno per uno. Le righe illeggibili non si possono confermare. */
export function VerificationList({
  observations,
  confirmed,
  onToggle,
  onSetAll,
  onHighlight,
  onReveal,
}: {
  observations: VerifiableObservation[];
  confirmed: string[];
  onToggle: (id: string) => void;
  onSetAll: (ids: string[]) => void;
  onHighlight: (line: number) => void;
  onReveal: (line: number) => void;
}) {
  const readableIds = observations.filter(isReadableObs).map((o) => o.id);
  const allConfirmed = readableIds.every((id) => confirmed.includes(id));
  return (
    <fieldset>
      <legend className="sr-only">Valori estratti dal documento</legend>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted" aria-live="polite">
          <span className="tabular font-semibold text-ink">{confirmed.length}</span> di {readableIds.length} valori leggibili confermati
        </p>
        <button type="button" className="btn btn-ghost min-h-11 text-sm" onClick={() => onSetAll(allConfirmed ? [] : readableIds)}>
          <CheckCheck aria-hidden className="h-4 w-4" />
          {allConfirmed ? "Togli tutte le conferme" : "Conferma tutti i valori leggibili"}
        </button>
      </div>
      <ul className="space-y-3">
        {observations.map((o) => {
          const ok = isReadableObs(o);
          const checked = confirmed.includes(o.id);
          const inputId = `conf-${o.id}`;
          return (
            <li
              key={o.id}
              onMouseEnter={() => onHighlight(o.sourceLine)}
              onFocus={() => onHighlight(o.sourceLine)}
              className={clsx("rounded-2xl border bg-paper p-4 transition-colors duration-150 sm:p-5", !ok ? "border-dashed border-muted/40 bg-canvas" : checked ? "border-teal/60 shadow-[var(--shadow-card)]" : "border-line")}
            >
              <div className="flex items-start gap-4">
                {ok ? (
                  <input id={inputId} type="checkbox" checked={checked} onChange={() => onToggle(o.id)} className="mt-1 h-6 w-6 shrink-0 cursor-pointer rounded-md accent-[var(--color-teal)]" aria-describedby={`${inputId}-src`} />
                ) : (
                  <AlertTriangle aria-hidden className="mt-1 h-6 w-6 shrink-0 text-warn" />
                )}
                <div className="min-w-0 flex-1">
                  <label htmlFor={ok ? inputId : undefined} className={clsx("block", ok && "cursor-pointer")}>
                    <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="font-semibold text-ink">{o.nameRaw}</span>
                      <span className="tabular font-mono text-[0.9375rem]">
                        {ok ? (
                          <>
                            <strong className="text-ink">{o.valueRaw}</strong> <span className="text-muted">{o.unitRaw}</span>
                          </>
                        ) : (
                          <span className="text-warn">non leggibile</span>
                        )}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-muted">
                      Intervallo stampato: <span className="tabular">{o.referenceRaw ?? "non riportato"}</span>
                    </span>
                  </label>
                  <p id={`${inputId}-src`} className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                    <ScanEye aria-hidden className="h-3.5 w-3.5" /> Pagina {o.sourcePage}, riga {o.sourceLine}
                    <button type="button" className="ml-1 underline underline-offset-2 hover:text-teal lg:hidden" onClick={() => onReveal(o.sourceLine)}>
                      mostra
                    </button>
                  </p>
                  {!ok ? <p className="mt-3 rounded-lg bg-cream/70 px-3 py-2 text-sm text-ink">Valore non leggibile: verifica il documento originale. Non lo includeremo nella spiegazione.</p> : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

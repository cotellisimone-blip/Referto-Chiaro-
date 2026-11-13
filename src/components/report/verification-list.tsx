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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-[1.0625rem] text-ink-soft" aria-live="polite">
          <span className="tabular font-bold text-ink">{confirmed.length}</span> di {readableIds.length} valori leggibili confermati
        </p>
        <button type="button" className="btn btn-secondary btn-sm max-sm:w-full" onClick={() => onSetAll(allConfirmed ? [] : readableIds)}>
          <CheckCheck aria-hidden className="h-5 w-5" />
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
              className={clsx("rounded-[1.25rem] border bg-paper p-4 transition-colors duration-150 sm:p-5", !ok ? "border-dashed border-muted/40 bg-canvas" : checked ? "border-teal/60 shadow-[var(--shadow-card)]" : "border-line")}
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
                      <span className="text-lg font-bold leading-snug text-ink">{o.nameRaw}</span>
                      <span className="tabular whitespace-nowrap text-lg">
                        {ok ? (
                          <>
                            <strong className="font-extrabold text-ink">{o.valueRaw}</strong> <span className="text-muted">{o.unitRaw}</span>
                          </>
                        ) : (
                          <span className="font-semibold text-warn">non leggibile</span>
                        )}
                      </span>
                    </span>
                    <span className="mt-1 block text-base text-muted">
                      Intervallo stampato: <span className="tabular text-ink-soft">{o.referenceRaw ?? "non riportato"}</span>
                    </span>
                  </label>
                  {/* Su computer il documento è accanto e la riga si accende al passaggio; su telefono e tablet la si raggiunge con un tocco. */}
                  <p id={`${inputId}-src`} className="mt-2 text-[0.9375rem] text-muted">
                    <span className="hidden items-center gap-1.5 lg:inline-flex">
                      <ScanEye aria-hidden className="h-4 w-4 shrink-0" /> Pagina {o.sourcePage}, riga {o.sourceLine}
                    </span>
                    <button
                      type="button"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-mist px-4 font-semibold text-teal-deep lg:hidden"
                      onClick={() => onReveal(o.sourceLine)}
                    >
                      <ScanEye aria-hidden className="h-4 w-4 shrink-0" /> Vedi nel documento: riga {o.sourceLine}
                    </button>
                  </p>
                  {!ok ? <p className="mt-3 rounded-xl bg-cream/70 px-4 py-3 text-base text-ink">Valore non leggibile: verifica il documento originale. Non lo includeremo nella spiegazione.</p> : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

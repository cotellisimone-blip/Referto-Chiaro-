import { clsx } from "clsx";
import { Check } from "lucide-react";

/**
 * Indicatore di avanzamento a passi: numeri in cerchio, barra che si riempie, stato annunciato ai lettori di schermo.
 * Su telefono i nomi non starebbero in colonna («Docu…»): restano i numeri e, sotto, il nome intero del passo attuale.
 */
export function Stepper({ steps, step, label }: { steps: readonly string[]; step: number; label: string }) {
  const current = Math.min(Math.max(step, 0), steps.length - 1);
  return (
    <nav aria-label={label} className="no-print">
      <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li key={s} aria-current={state === "current" ? "step" : undefined} className="min-w-0">
              <div className={clsx("h-2 rounded-full transition-colors duration-300", state === "todo" ? "bg-line" : state === "done" ? "bg-sage" : "bg-teal")} />
              <p className={clsx("mt-3 flex items-center gap-2 text-sm font-semibold sm:text-[0.9375rem]", state === "todo" ? "text-muted" : "text-ink")}>
                <span
                  className={clsx(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm sm:h-7 sm:w-7 sm:text-xs",
                    state === "done" ? "bg-sage text-white" : state === "current" ? "bg-strong text-on-strong" : "border border-line bg-paper text-muted",
                  )}
                  aria-hidden
                >
                  {state === "done" ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="sr-only sm:not-sr-only sm:truncate">{s}</span>
                <span className="sr-only">{state === "done" ? " (completato)" : state === "current" ? " (passaggio attuale)" : ""}</span>
              </p>
            </li>
          );
        })}
      </ol>
      {/* Solo telefono, solo visivo: il nome è già nella lista per i lettori di schermo. */}
      <p aria-hidden data-step-current className="mt-3 text-lg font-bold leading-snug text-ink sm:hidden">
        <span className="font-semibold text-muted">
          Passo {current + 1} di {steps.length} ·{" "}
        </span>
        {steps[current]}
      </p>
    </nav>
  );
}

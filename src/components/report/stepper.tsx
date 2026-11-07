import { clsx } from "clsx";
import { Check } from "lucide-react";

/** Indicatore di avanzamento a passi, con stato annunciato ai lettori di schermo. */
export function Stepper({ steps, step, label }: { steps: readonly string[]; step: number; label: string }) {
  return (
    <nav aria-label={label} className="no-print">
      <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((s, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li key={s} aria-current={state === "current" ? "step" : undefined} className="min-w-0">
              <div className={clsx("h-1.5 rounded-full transition-colors duration-200", state === "todo" ? "bg-line" : "bg-teal")} />
              <p className={clsx("mt-2 flex items-center gap-1.5 truncate text-xs font-semibold sm:text-sm", state === "todo" ? "text-muted" : "text-ink")}>
                {state === "done" ? <Check aria-hidden className="h-3.5 w-3.5 shrink-0 text-sage-deep" /> : <span className="tabular hidden text-muted sm:inline">{i + 1}.</span>}
                <span className="truncate">{s}</span>
                <span className="sr-only">{state === "done" ? " (completato)" : state === "current" ? " (passaggio attuale)" : ""}</span>
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

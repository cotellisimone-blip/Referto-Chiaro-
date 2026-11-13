import { clsx } from "clsx";
import { Check } from "lucide-react";

/**
 * Indicatore di avanzamento a passi, lo stesso in tutto il sito: pallini numerati uniti da una linea.
 * Da tablet in su ogni pallino ha il suo nome. Su telefono i nomi non starebbero in colonna («Docu…»):
 * restano i numeri e, sotto, una riga con il nome intero del passo attuale, che va a capo quando serve
 * (schermi stretti, testo grande). I nomi di tutti i passi restano nella lista per i lettori di schermo.
 */
export function Stepper({ steps, step, label, className }: { steps: readonly string[]; step: number; label: string; className?: string }) {
  const current = step >= 0 && step < steps.length ? steps[step] : null;
  return (
    <nav aria-label={label} className={clsx("pdp-stepper no-print", className)}>
      <ol className="pdp-steps" style={{ "--steps": steps.length } as React.CSSProperties}>
        {steps.map((s, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li key={s} className={clsx("pdp-step", `pdp-step-${state}`)} aria-current={state === "current" ? "step" : undefined}>
              <span aria-hidden className="pdp-step-dot">
                {state === "done" ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className="pdp-step-label">
                {s}
                {state === "done" ? <span className="sr-only"> (completato)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
      {current ? (
        <p aria-hidden className="pdp-step-now" data-step-current="">
          <span className="pdp-step-count">
            Passo {step + 1} di {steps.length} ·
          </span>{" "}
          <span className="pdp-step-name">{current}</span>
        </p>
      ) : null}
    </nav>
  );
}

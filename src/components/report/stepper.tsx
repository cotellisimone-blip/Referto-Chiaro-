import { clsx } from "clsx";
import { Check } from "lucide-react";

/**
 * Indicatore di avanzamento a passi, lo stesso degli strumenti gratuiti: pallini numerati uniti da una linea.
 * Su telefono i nomi non starebbero in colonna («Docu…»): restano i numeri e, sotto, il nome intero del passo attuale;
 * gli altri nomi restano nella lista per i lettori di schermo.
 */
export function Stepper({ steps, step, label }: { steps: readonly string[]; step: number; label: string }) {
  return (
    <nav aria-label={label} className="no-print">
      <ol className="pdp-stepper" style={{ "--steps": steps.length } as React.CSSProperties}>
        {steps.map((s, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li key={s} className={clsx("pdp-step", `pdp-step-${state}`)} aria-current={state === "current" ? "step" : undefined}>
              <span aria-hidden className="pdp-step-dot">
                {state === "done" ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className="pdp-step-label" data-step-current={state === "current" ? "" : undefined}>
                <span aria-hidden className="pdp-step-count">
                  Passo {i + 1} di {steps.length} ·{" "}
                </span>
                {s}
                {state === "done" ? <span className="sr-only"> (completato)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";

/** Avviso fisso dei percorsi con un medico nella versione dimostrativa: dice subito che è una simulazione. */
export function SimulationCallout({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="callout callout-warn">
      <span aria-hidden className="callout-ico">
        <FlaskConical />
      </span>
      <div>
        <p className="callout-title">Simulazione, non un servizio medico</p>
        <p className="callout-text">{children}</p>
      </div>
    </div>
  );
}

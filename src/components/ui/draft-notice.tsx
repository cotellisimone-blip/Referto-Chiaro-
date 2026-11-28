import { FileWarning } from "lucide-react";

/** Etichetta obbligatoria per testi legali non ancora revisionati da un professionista. */
export function DraftNotice() {
  return (
    <div role="note" className="callout callout-warn max-w-[46rem]">
      <span aria-hidden className="callout-ico">
        <FileWarning />
      </span>
      <div>
        <p className="callout-title tracking-[0.04em]">BOZZA — DA REVISIONARE</p>
        <p className="callout-text">Questo testo è una bozza di lavoro e non è stato approvato da un consulente legale. Non descrive un servizio attivo e non va considerato un documento legalmente valido.</p>
      </div>
    </div>
  );
}

/** Testo corrente delle pagine di lettura (progetto, sicurezza, note legali): corpo grande, titoli netti, puntini di marca. */
export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose-rc">{children}</div>;
}

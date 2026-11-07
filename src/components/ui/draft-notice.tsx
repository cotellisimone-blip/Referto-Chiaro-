import { FileWarning } from "lucide-react";

/** Etichetta obbligatoria per testi legali non ancora revisionati da un professionista. */
export function DraftNotice() {
  return (
    <div role="note" className="mt-8 flex gap-3 rounded-2xl border border-warn/30 bg-cream/70 p-5">
      <FileWarning aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
      <div>
        <p className="font-semibold text-ink">BOZZA — DA REVISIONARE</p>
        <p className="mt-1 text-[0.9375rem] text-ink">
          Questo testo è una bozza di lavoro e non è stato approvato da un consulente legale. Non descrive un servizio attivo e non va considerato
          un documento legalmente valido.
        </p>
      </div>
    </div>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl space-y-5 text-[1.0625rem] text-ink [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_p]:text-ink-soft [&_ul]:space-y-2">
      {children}
    </div>
  );
}

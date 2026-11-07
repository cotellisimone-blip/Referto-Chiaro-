import { FileText, ScanEye } from "lucide-react";

/**
 * Anatomia del foglio che la persona riceve: un'anteprima fedele del report
 * (in breve, un valore con la fonte, le domande), costruita in HTML con i token del tema.
 * Dati inventati, identici alla fixture della demo. Solo decorativo: il testo vero è nella pagina.
 */
export function ReportAnatomy() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px]">
      <div className="sheet p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <FileText className="h-4 w-4 text-teal" /> Riepilogo per la visita
          </span>
          <span className="chip bg-cream text-ink">Demo · dati inventati</span>
        </div>

        <p className="eyebrow mt-6">In breve</p>
        <p className="mt-2 font-serif text-[1.375rem] leading-snug text-ink">Cinque valori letti dal referto, spiegati uno per uno. Nessuna conclusione: quella spetta al medico.</p>

        <div className="mt-6 rounded-2xl border border-line bg-canvas p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="text-lg font-semibold text-ink">Emoglobina glicata (HbA1c)</span>
            <span className="tabular font-mono text-lg">
              <strong className="text-ink">5,1</strong> <span className="text-muted">%</span>
            </span>
          </div>
          <p className="mt-2 text-[1.0625rem] text-ink-soft">Racconta l&apos;andamento medio dello zucchero nel sangue nelle ultime settimane.</p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1 text-sm font-semibold text-teal">
            <ScanEye className="h-4 w-4" /> Pagina 1, riga 5
          </p>
        </div>

        <p className="mt-6 font-serif text-xl text-ink">Domande da portare al medico</p>
        <ol className="mt-3 space-y-2 text-[1.0625rem] text-ink-soft">
          {["Questi valori vanno ripetuti? Tra quanto?", "C'è qualcosa che devo cambiare prima del prossimo prelievo?"].map((q, i) => (
            <li key={q} className="flex gap-3">
              <span className="num w-6 shrink-0 text-xl text-sage">{i + 1}</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Etichette che spiegano il foglio */}
      <span className="float-slow absolute left-0 top-[27%] hidden -translate-x-[58%] rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink shadow-[var(--shadow-card)] lg:inline-flex">
        Parole comuni
      </span>
      <span className="float-slower absolute right-0 top-[48%] hidden translate-x-[58%] rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink shadow-[var(--shadow-card)] lg:inline-flex">
        Numero = referto
      </span>
      <span className="float-slow absolute bottom-[12%] left-0 hidden -translate-x-[58%] rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-ink shadow-[var(--shadow-card)] lg:inline-flex">
        Pronto per la visita
      </span>
    </div>
  );
}

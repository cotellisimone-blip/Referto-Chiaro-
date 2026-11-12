import { ArrowRight, Check, FileText, MessageCircleQuestionMark } from "lucide-react";
import { clsx } from "clsx";

/*
 * Pezzi veri di prodotto, in HTML: il report che la persona riceve e il foglio da cui parte.
 * Dati inventati (nessuna persona reale). Le frasi descrivono dove cade il valore, non lo giudicano.
 * Sono illustrazioni: il testo che serve è sempre nella pagina accanto, quindi restano fuori dai lettori di schermo.
 */

// Ciclo 3, fase 3: gli stessi valori del referto di esempio (src/fixtures/synthetic/referto-lab-001.json), così la
// scheda in home, la pagina Capisci e l'esempio raccontano lo stesso referto.
const VALUES = [
  { name: "Glicemia", value: "92", unit: "mg/dL", range: "70 – 99", pos: 64, note: "Dentro l'intervallo del laboratorio" },
  { name: "Colesterolo LDL", value: "134", unit: "mg/dL", range: "< 115", pos: 86, out: true, note: "Sopra l'intervallo del laboratorio" },
  { name: "Creatinina", value: "0,89", unit: "mg/dL", range: "0,70 – 1,20", pos: 40, note: "Dentro l'intervallo del laboratorio" },
] as const;

/** Sigla come la stampano molti laboratori, nel facsimile di partenza. */
const SIGLA: Record<(typeof VALUES)[number]["name"], string> = { Glicemia: "GLU", "Colesterolo LDL": "LDL", Creatinina: "CREA" };

function ValueRow({ v, compact = false }: { v: (typeof VALUES)[number]; compact?: boolean }) {
  return (
    <div className={clsx("rounded-2xl border px-4", compact ? "py-3" : "py-3.5", "out" in v ? "border-warn/35 bg-cream" : "border-line bg-canvas")}>
      <p className="flex items-baseline justify-between gap-3">
        <span className="text-[1.0625rem] font-bold text-ink">{v.name}</span>
        <span className="tabular whitespace-nowrap text-[1.0625rem] font-bold text-ink">
          {v.value} <span className="text-sm font-medium text-muted">{v.unit}</span>
        </span>
      </p>
      <span className="range-bar mt-2.5">
        <i />
        <b className={"out" in v ? "out" : undefined} style={{ left: `${v.pos}%` }} />
      </span>
      <p className={clsx("mt-2 text-[0.9375rem] font-semibold leading-snug", "out" in v ? "text-warn" : "text-teal-deep")}>{v.note}</p>
    </div>
  );
}

/** Il report in miniatura che esce dalla fotografia della hero. */
export function MiniReport({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx("rounded-[1.75rem] border border-line bg-paper p-4 shadow-[var(--shadow-float)]", className)}>
      <p className="flex items-center justify-between gap-2 px-1 pb-3">
        <span className="inline-flex items-center gap-2 text-[1.0625rem] font-extrabold text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-marker-soft text-teal-deep">
            <FileText className="h-4 w-4" />
          </span>
          Il tuo report
        </span>
        <span className="rounded-full bg-mist px-2.5 py-0.5 text-sm font-semibold text-ink-soft">Esempio</span>
      </p>
      <div className="space-y-2.5">
        <ValueRow v={VALUES[0]} compact />
        <ValueRow v={VALUES[1]} compact />
      </div>
    </div>
  );
}

/**
 * «Dal referto al report»: il foglio del laboratorio com'è (dietro, inclinato) e lo stesso contenuto reso chiaro
 * (davanti). Su telefono si impilano, con il report che copre il fondo del foglio; da tablet in su stanno affiancati.
 */
export function ReportTransform({ className }: { className?: string }) {
  return (
    <div aria-hidden className={clsx("transform-stage scope-light", className)}>
      <div className="transform-doc p-4 pb-16 sm:p-5 sm:pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#5b6b70]">Laboratorio analisi · referto</p>
        <div className="mt-3 border-y border-[#d9dfe0] py-1 text-sm">
          <p className="grid grid-cols-[1fr_0.7fr_1.2fr] gap-2 border-b border-dashed border-[#d9dfe0] py-1.5 font-bold">
            <span>ESAME</span>
            <span>RIS.</span>
            <span>VAL. RIF.</span>
          </p>
          {VALUES.map((v) => (
            <p key={v.name} className="grid grid-cols-[1fr_0.7fr_1.2fr] gap-2 py-2">
              <span className="uppercase">{SIGLA[v.name]}</span>
              <span className="font-bold">
                {v.value}
                {"out" in v ? "*" : ""}
              </span>
              <span className="whitespace-nowrap">{v.range}</span>
            </p>
          ))}
        </div>
      </div>
      <span className="transform-arrow">
        <ArrowRight className="h-6 w-6" strokeWidth={2.6} />
      </span>
      <div className="transform-report p-4 sm:p-5">
        <p className="flex items-center justify-between gap-2 px-1 pb-3">
          <span className="inline-flex items-center gap-2 text-lg font-extrabold text-ink">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-marker-soft text-teal-deep">
              <Check className="h-5 w-5" strokeWidth={3} />
            </span>
            Il tuo report
          </span>
          <span className="rounded-full bg-mist px-2.5 py-0.5 text-sm font-semibold text-ink-soft">Dati inventati</span>
        </p>
        <div className="space-y-2.5">
          <div className="hidden sm:block">
            <ValueRow v={VALUES[0]} />
          </div>
          <ValueRow v={VALUES[1]} />
        </div>
        <p className="mt-3 flex items-center gap-2.5 rounded-2xl bg-mist px-4 py-3 text-[1.0625rem] font-bold text-ink">
          <MessageCircleQuestionMark className="h-5 w-5 shrink-0 text-teal" />
          Le domande per il tuo medico
        </p>
      </div>
    </div>
  );
}

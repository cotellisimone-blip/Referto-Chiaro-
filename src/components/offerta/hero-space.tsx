import { CalendarClock, Check, FileText, Mic, PenLine, Stethoscope, Video } from "lucide-react";
import { JourneyThread } from "./journey";

/**
 * Visual della hero, costruito in HTML/SVG (niente foto generate, niente persone finte):
 * i tre servizi come tre fogli dello stesso spazio, uniti dalla linea del Journey.
 * Decorativo per i lettori di schermo: le informazioni vere sono nel testo accanto.
 */
export function HeroSpace() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px] select-none">
      <JourneyThread className="absolute -left-10 top-1/2 h-40 w-[120%] -translate-y-1/2 opacity-90" />
      <div className="relative grid gap-4 sm:gap-5">
        {/* 1. Capisci */}
        <div className="tone-capisci service-card w-[88%] p-5 shadow-[var(--shadow-lift)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className="tone-icon h-11 w-11">
              <FileText className="h-5 w-5" />
            </span>
            <p className="text-[1.0625rem] font-bold text-ink">Capisci il tuo referto</p>
          </div>
          <div className="mt-4 space-y-2.5 font-mono text-[0.9375rem] text-ink-soft">
            <p className="flex justify-between gap-3">
              <span>Glicemia</span>
              <span className="tabular">92 mg/dL</span>
            </p>
            <p className="flex justify-between gap-3 rounded-md bg-marker-soft px-2 py-0.5 text-ink">
              <span>Emoglobina glicata</span>
              <span className="tabular">5,1 %</span>
            </p>
          </div>
          <p className="mt-3 text-[0.9375rem] text-ink">«Racconta l&apos;andamento medio dello zucchero nelle ultime settimane.»</p>
        </div>
        {/* 2. Secondo parere */}
        <div className="tone-parere service-card ml-auto w-[82%] p-5 shadow-[var(--shadow-lift)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="tone-icon h-11 w-11">
                <Stethoscope className="h-5 w-5" />
              </span>
              <p className="text-[1.0625rem] font-bold text-ink">Secondo parere</p>
            </div>
            <span className="chip bg-paper text-ink">
              <Check className="h-4 w-4 text-teal" /> Firmato
            </span>
          </div>
          <div className="mt-4 space-y-2">
            <span className="block h-2.5 w-full rounded-full bg-line" />
            <span className="block h-2.5 w-11/12 rounded-full bg-line" />
            <span className="block h-2.5 w-3/4 rounded-full bg-line" />
          </div>
          <p className="mt-3 flex items-center gap-2 text-[0.9375rem] text-muted">
            <PenLine className="tone-text h-4 w-4" /> Parere scritto dal medico
          </p>
        </div>
        {/* 3. Parla con un medico */}
        <div className="tone-medico service-card w-[86%] p-5 shadow-[var(--shadow-float)] sm:ml-6 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="tone-icon h-11 w-11">
              <Video className="h-5 w-5" />
            </span>
            <p className="text-[1.0625rem] font-bold text-ink">Parla con un medico</p>
          </div>
          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-strong p-3 text-on-strong">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-strong-soft">
              <Stethoscope className="h-7 w-7 text-marker" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 text-[0.9375rem]">
                <CalendarClock className="h-4 w-4" /> Appuntamento confermato
              </span>
              <span className="mt-1 block text-[0.9375rem] text-on-strong-soft">I documenti sono già condivisi</span>
            </span>
            <span className="flex gap-1.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <Mic className="h-4 w-4" />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                <Video className="h-4 w-4" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

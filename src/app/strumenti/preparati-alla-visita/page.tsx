import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock3, Lock, Printer } from "lucide-react";
import { VisitPrep } from "@/components/tools/visit-prep";
import { absoluteUrl } from "@/lib/seo";
import { coreService } from "@/domain/offerta";

export const metadata: Metadata = {
  title: "Preparati alla visita in 2 minuti",
  description: "Strumento gratuito: tre domande pratiche e ottieni la lista di cosa portare, cosa preparare e cosa chiedere al medico. Nessun dato personale, nessuna registrazione.",
  alternates: { canonical: absoluteUrl("/strumenti/preparati-alla-visita") },
};

const PREVIEW = ["Che cosa significa il mio risultato?", "Servono altri esami o controlli?", "Quali sono i prossimi passi?", "Che cosa devo tenere d'occhio?"];

export default function PreparatiAllaVisitaPage() {
  const capisci = coreService("capisci");
  const medico = coreService("parla-con-un-medico");
  return (
    <>
      <section aria-labelledby="prep-titolo" className="tone-capisci relative overflow-hidden bg-[linear-gradient(180deg,var(--tone-bg),var(--color-canvas))]">
        <div className="container-rc grid items-center gap-10 pb-10 pt-10 sm:pt-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow">Strumento gratuito</p>
            <h1 id="prep-titolo" className="display-xl mt-5">
              Preparati alla visita <span className="marker">in 2 minuti</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-ink-soft">Tre domande pratiche, una lista pronta: che cosa portare, che cosa preparare e che cosa chiedere. Così in visita non dimentichi niente.</p>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[1.0625rem] text-ink-soft">
              <li className="flex items-center gap-2">
                <Clock3 aria-hidden className="h-5 w-5 text-teal" /> Circa 2 minuti
              </li>
              <li className="flex items-center gap-2">
                <Lock aria-hidden className="h-5 w-5 text-teal" /> Nessun dato personale, nessuna registrazione
              </li>
              <li className="flex items-center gap-2">
                <Printer aria-hidden className="h-5 w-5 text-teal" /> Da stampare o tenere sul telefono
              </li>
            </ul>
          </div>
          {/* Anteprima del risultato, costruita in HTML (niente immagini con testo) */}
          <div aria-hidden className="mx-auto hidden w-full max-w-[320px] rounded-[2.25rem] border-[10px] border-strong bg-paper p-5 shadow-[var(--shadow-float)] lg:block">
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-line" />
            <p className="text-sm font-bold uppercase tracking-wide text-teal">Da chiedere al medico</p>
            <ul className="mt-3 space-y-2.5">
              {PREVIEW.map((q) => (
                <li key={q} className="flex items-start gap-2.5 rounded-xl bg-mist px-3 py-2.5 text-[0.9375rem] font-semibold text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-teal text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <Suspense fallback={<div className="container-rc py-10" aria-busy="true"><div className="h-64 animate-pulse rounded-2xl bg-mist" /></div>}>
        <VisitPrep />
      </Suspense>
      <section aria-labelledby="dopo-titolo" className="no-print border-t border-line/70 bg-paper py-14 sm:py-20">
        <div className="container-rc">
          <h2 id="dopo-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Vuoi arrivare ancora più preparato?
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {[
              { s: capisci, title: "Hai un referto? Capiscilo prima della visita.", text: "Valori e sigle in parole semplici, con le domande giuste." },
              { s: medico, title: "Preferisci parlarne prima con un medico?", text: "Un videoconsulto con i tuoi documenti già letti." },
            ].map(({ s, title, text }) => (
              <li key={s.id} className={`tone-${s.tone}`}>
                <Link href={s.href} className="service-card group p-6 sm:p-7">
                  <span className="text-xl font-bold text-ink">{title}</span>
                  <span className="mt-2 text-lg text-ink-soft">{text}</span>
                  <span className="tone-text mt-4 inline-flex items-center gap-2 font-bold">
                    {s.name} <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-[1.0625rem] text-muted">
            Le indicazioni di questa pagina sono pratiche e generali: non valutano la tua salute. Sono una bozza editoriale in attesa di revisione medica, come le nostre guide.
          </p>
        </div>
      </section>
    </>
  );
}

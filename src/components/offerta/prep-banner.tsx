import Link from "next/link";
import { ArrowRight, Check, ClipboardList } from "lucide-react";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";

const QUESTIONS = ["Che cosa significa il mio referto?", "Ci sono valori da tenere d'occhio?", "Quali sono i prossimi passi?", "Servono altri esami?", "C'è qualcosa da cambiare nelle mie abitudini?"];

/**
 * Banner «Preparati alla visita in 2 minuti» (immagine 04 del pacchetto): foto illustrativa di una paziente
 * e un telefono con la lista che si spunta da sola. Titolo, testo e pulsante sono HTML veri.
 */
export function PrepBanner() {
  const p = ILLUSTRATIVE_PHOTOS.preparati;
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-[linear-gradient(120deg,var(--color-ivory),var(--color-tint-capisci))] shadow-[var(--shadow-lift)]">
      <div aria-hidden className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,var(--color-marker),transparent)] opacity-40" />
      <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.6fr_0.75fr] lg:gap-6 lg:p-12">
        <div>
          <p className="eyebrow">Gratis, senza registrarti</p>
          <h2 id="preparati-titolo" className="display-lg mt-4 text-[2.25rem] sm:text-[3rem]">
            Preparati alla visita <span className="marker marker-animate">in 2 minuti</span>.
          </h2>
          <p className="mt-5 max-w-lg text-xl text-ink-soft">Tre domande pratiche, nessun dato sanitario. Ottieni la lista di cosa portare e cosa chiedere al medico, da stampare o tenere sul telefono.</p>
          <Link href="/strumenti/preparati-alla-visita" className="btn btn-primary btn-lg mt-8">
            Inizia, è gratis <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
        </div>
        {SHOW_ILLUSTRATIVE_PHOTOS ? (
          <figure className="relative mx-auto hidden w-full max-w-[260px] overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-float)] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} width={p.width} height={p.height} alt={p.alt} className="aspect-[425/640] w-full object-cover object-top" />
            <figcaption className="absolute bottom-2 right-3 rounded-full bg-black/45 px-2 py-0.5 text-xs text-white">Immagine illustrativa</figcaption>
          </figure>
        ) : null}
        <div aria-hidden className="phone-mock mx-auto w-full max-w-[300px] rotate-[3deg] p-4 pt-6">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-marker-soft text-teal-deep">
            <ClipboardList className="h-7 w-7" />
          </span>
          <ul className="check-seq space-y-2.5">
            {QUESTIONS.map((q) => (
              <li key={q} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3 py-2.5 text-[0.9375rem] font-semibold leading-snug text-ink">
                <span className="check-box">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                {q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

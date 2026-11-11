import Link from "next/link";
import { ArrowRight, Compass, FileText } from "lucide-react";
import { coreService, entryPriceLabel, publicPricesEnabled } from "@/domain/offerta";

/**
 * Doppio ingresso della home (V3): chi non ha ancora esami parte gratis da «Punto di Partenza»,
 * chi ha un referto lo rende chiaro. Due card di pari peso, impilate su telefono.
 */
export function DualEntry() {
  const capisci = coreService("capisci");
  const prices = publicPricesEnabled();
  return (
    <section aria-labelledby="ingressi-titolo" className="dual-entry py-10 sm:py-14">
      <div className="container-rc">
        <h2 id="ingressi-titolo" className="sr-only">
          Da dove vuoi iniziare
        </h2>
        <ul className="grid gap-5 md:grid-cols-2">
          <li className="tone-partenza">
            <Link href="/punto-di-partenza" data-track="cta-pdp" className="entry-card group">
              <span className="flex items-center justify-between gap-3">
                <span className="eyebrow eyebrow-plain">Non hai ancora gli esami?</span>
                <span className="entry-badge">Gratis</span>
              </span>
              <span className="mt-4 flex items-start gap-4">
                <Compass aria-hidden className="tone-text mt-1 h-9 w-9 shrink-0" strokeWidth={1.7} />
                <span>
                  <span className="block text-[1.75rem] font-extrabold leading-tight text-ink sm:text-[2rem]">Parti dalla tua salute.</span>
                  <span className="mt-2 block text-lg text-ink-soft">Crea gratuitamente il tuo Punto di Partenza e prepara una scheda semplice da discutere con il medico.</span>
                </span>
              </span>
              <span className="btn btn-primary btn-lg mt-6 self-start">
                Inizia gratis <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </span>
            </Link>
          </li>
          <li className="tone-capisci">
            <Link href={capisci.href} data-track="cta-capisci" className="entry-card group">
              <span className="flex items-center justify-between gap-3">
                <span className="eyebrow eyebrow-plain">Hai già un referto?</span>
                {prices ? <span className="entry-badge">Primo referto {entryPriceLabel()}</span> : null}
              </span>
              <span className="mt-4 flex items-start gap-4">
                <FileText aria-hidden className="tone-text mt-1 h-9 w-9 shrink-0" strokeWidth={1.7} />
                <span>
                  <span className="block text-[1.75rem] font-extrabold leading-tight text-ink sm:text-[2rem]">Rendilo chiaro.</span>
                  <span className="mt-2 block text-lg text-ink-soft">Caricalo e trasformalo in un report ordinato, di norma in pochi minuti.</span>
                </span>
              </span>
              <span className="btn btn-secondary btn-lg mt-6 self-start">
                {prices ? `Primo referto ${entryPriceLabel()}` : "Rendi chiaro il referto"} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

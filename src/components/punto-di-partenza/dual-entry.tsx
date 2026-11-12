import Link from "next/link";
import { ArrowRight, Check, FileText, Search } from "lucide-react";
import { coreService, entryPriceLabel, publicPricesEnabled } from "@/domain/offerta";

/**
 * Doppio ingresso della home (V3): chi non ha ancora esami parte gratis da «Punto di Partenza»,
 * chi ha un referto lo rende chiaro. Due card di pari peso (stesso pulsante primario), impilate su telefono.
 */
export function DualEntry() {
  const capisci = coreService("capisci");
  const prices = publicPricesEnabled();
  return (
    <section aria-labelledby="ingressi-titolo" className="dual-entry">
      <div className="container-rc">
        <h2 id="ingressi-titolo" className="sr-only">
          Da dove vuoi iniziare
        </h2>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
          <li className="tone-partenza">
            <Link href="/punto-di-partenza" data-track="cta-pdp" className="entry-card group">
              <span className="entry-top">
                <span className="eyebrow eyebrow-plain">Non hai ancora gli esami?</span>
                <span className="entry-badge">Gratis</span>
              </span>
              <span className="entry-body">
                <span aria-hidden className="pdp-art entry-art">
                  <span className="pdp-art-sheet">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="pdp-art-badge">
                    <Check strokeWidth={3} />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="entry-title">Parti dalla tua salute.</span>
                  <span className="mt-2 block text-lg leading-snug text-ink-soft">Crea gratuitamente il tuo Punto di Partenza e prepara una scheda semplice per la prossima visita.</span>
                </span>
              </span>
              <span className="entry-foot">
                <span className="btn btn-primary btn-lg">
                  Inizia gratis <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </span>
              </span>
            </Link>
          </li>
          <li className="tone-capisci">
            <Link href={capisci.href} data-track="cta-capisci" className="entry-card entry-card-plain group">
              <span className="entry-top">
                <span className="eyebrow eyebrow-plain">Hai già un referto?</span>
                {/* Ciclo 2, fase 3: su telefono il prezzo è già sotto il titolo della pagina; il badge resta da 640 px. */}
                {prices ? <span className="entry-badge entry-badge-soft hidden sm:inline-flex">Primo referto {entryPriceLabel()}</span> : null}
              </span>
              <span className="entry-body">
                <span aria-hidden className="pdp-art pdp-art-report entry-art">
                  <span className="pdp-art-sheet">
                    <FileText strokeWidth={1.6} />
                    <i />
                    <i />
                  </span>
                  <span className="pdp-art-badge">
                    <Search strokeWidth={2.6} />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="entry-title">Rendilo chiaro.</span>
                  <span className="mt-2 block text-lg leading-snug text-ink-soft">Caricalo e trasformalo in un report ordinato, di norma in pochi minuti.</span>
                </span>
              </span>
              <span className="entry-foot">
                <span className="btn btn-primary btn-lg">
                  Rendi chiaro il referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

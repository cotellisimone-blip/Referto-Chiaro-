import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { coreService, entryPriceLabel, publicPricesEnabled } from "@/domain/offerta";

/**
 * Doppio ingresso della home (V3): chi non ha ancora esami parte gratis da «Punto di Partenza», chi ha un referto
 * lo rende chiaro. Due schede di pari peso, impilate su telefono; in ognuna un pezzo di prodotto in miniatura
 * (decorativo: il testo accanto dice già tutto).
 */
export function DualEntry() {
  const capisci = coreService("capisci");
  const prices = publicPricesEnabled();
  return (
    <section aria-labelledby="ingressi-titolo" className="relative pb-4 pt-8 sm:pt-10">
      <div className="container-rc">
        <h2 id="ingressi-titolo" className="sr-only">
          Da dove vuoi iniziare
        </h2>
        <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
          <li>
            <Link href="/punto-di-partenza" data-track="cta-pdp" className="entry-card entry-card-mint group">
              <span className="entry-top">
                <span className="entry-q">Non hai ancora gli esami?</span>
                <span className="entry-badge">Gratis</span>
              </span>
              <span className="entry-title">Parti dalla tua salute.</span>
              <span className="entry-text">Rispondi a poche domande, senza registrarti. Ne esce una scheda ordinata da portare alla prossima visita.</span>
              <span className="entry-foot">
                <span className="btn btn-primary btn-lg">
                  Inizia gratis <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </span>
              </span>
              <span aria-hidden className="entry-art">
                <span className="mini-sheet block">
                  <span className="mb-2 block text-[0.6875rem] font-extrabold uppercase tracking-[0.12em] text-sage-deep">Il tuo punto di partenza</span>
                  {["Che cosa hai già fatto", "Di che cosa parlare", "Le tue domande"].map((t) => (
                    <span key={t} className="mini-row">
                      <span className="mini-check">
                        <Check strokeWidth={3.4} />
                      </span>
                      {t}
                    </span>
                  ))}
                </span>
              </span>
            </Link>
          </li>
          <li>
            <Link href={capisci.href} data-track="cta-capisci" className="entry-card entry-card-warm group">
              <span className="entry-top">
                <span className="entry-q">Hai già un referto?</span>
                {prices ? <span className="entry-badge entry-badge-soft">Primo referto {entryPriceLabel()}</span> : null}
              </span>
              <span className="entry-title">Rendilo chiaro.</span>
              <span className="entry-text">Lo carichi e, di norma in pochi minuti, diventa un report ordinato: ogni valore in parole semplici.</span>
              <span className="entry-foot">
                <span className="btn btn-primary btn-lg">
                  Rendi chiaro il referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </span>
              </span>
              <span aria-hidden className="entry-art">
                <span className="mini-sheet block">
                  <span className="mb-2 flex items-center justify-between font-mono text-[0.75rem] font-bold text-muted">
                    <span>LDL</span>
                    <span>134 *</span>
                  </span>
                  <span className="mini-row !bg-cream">
                    <span className="min-w-0">
                      <span className="block">Colesterolo LDL</span>
                      <span className="mt-0.5 block text-[0.75rem] font-semibold text-warn">Sopra l&apos;intervallo del laboratorio</span>
                    </span>
                  </span>
                  <span className="mini-row">
                    <span className="mini-check">
                      <Check strokeWidth={3.4} />
                    </span>
                    Domande per la visita
                  </span>
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

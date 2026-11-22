import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PERCORSO } from "@/components/site/nav";
import { mediciEnabled } from "@/lib/medici";
import { formatEuro, firstPromoEnabled, firstRefertoCents, priceCents, publicPricesEnabled } from "@/domain/offerta";
import { prestazionePrice } from "@/domain/prestazioni/listino";

/**
 * «Da dove parto?» (22/11/2026, analisi di chiarezza, punto 21, sì di Simone): il pulsante «Aiutami» porta qui, e qui ci
 * sono cinque risposte, una per passo del percorso. Ognuna dice se è gratis o quanto costa. Nessuna domanda sulla salute.
 */
const RISPOSTE: Record<number, string> = {
  1: "Non so da dove cominciare",
  2: "Voglio sapere quali esami fare alla mia età",
  3: "Ho un referto e voglio capirlo",
  4: "Voglio parlarne con un medico",
  5: "Voglio stare meglio: sonno, alimentazione, integratori",
};

/** `passi`: il titolo è il nome del passo e sotto c'è che cosa trovi (per Servizi); altrimenti la risposta in prima persona. */
export function DaDoveParto({ passi = false }: { passi?: boolean } = {}) {
  const prices = publicPricesEnabled();
  const medici = mediciEnabled();
  const promo = firstPromoEnabled() && firstRefertoCents() < priceCents("capisci");
  const costo: Record<number, string> = {
    1: "Gratis",
    2: "Gratis",
    3: prices ? (promo ? `Il primo ${formatEuro(firstRefertoCents())}, poi ${formatEuro(priceCents("capisci"))}` : `${formatEuro(priceCents("capisci"))} a referto`) : "A pagamento",
    4: medici ? (prices ? `In video ${prestazionePrice("video")}` : "A pagamento") : "In arrivo",
    5: "Gratis",
  };
  return (
    <ol className="ddp" data-testid={passi ? "cinque-passi" : "da-dove-parto"}>
      {PERCORSO.map((p) => (
        <li key={p.n}>
          <Link href={p.href} className="ddp-a" data-passo={p.n}>
            <span className="ddp-n" aria-hidden>
              {p.n}
            </span>
            <span className="ddp-t">
              <b>{passi ? p.label : RISPOSTE[p.n]}</b>
              <span>
                {passi ? p.desc : `Passo ${p.n} · ${p.label}`} · <i>{costo[p.n]}</i>
              </span>
            </span>
            <ArrowRight aria-hidden className="ddp-go" />
          </Link>
        </li>
      ))}
    </ol>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { famigliaIncludes, famigliaPrice } from "@/domain/famiglia/piano";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleDashed,
  Clock3,
  UserRound,
} from "lucide-react";
import { OFFER_ICON, OfferPrice } from "@/components/offerta/service-triad";
import { FaqList } from "@/components/ui/faq-list";
import { Wave } from "@/components/ui/wave";
import { publicOfferItems } from "@/domain/prestazioni/offerta-completa";
import { mediciEnabled } from "@/lib/medici";
import { PrestoMedico } from "@/components/site/presto-medico";
import {
  PRESTAZIONI,
  type PrestazioneKind,
} from "@/domain/prestazioni/listino";
import { cancelTerms } from "@/domain/prestazioni/engine";
import {
  PRICE_NOTE,
  firstRefertoCents,
  formatEuro,
  priceCents,
  publicPricesEnabled,
  upgradeCostCents,
  upgradeEnabled,
  serviceStart,
} from "@/domain/offerta";

export const metadata: Metadata = {
  title: "Prezzi",
  description: mediciEnabled()
    ? "I servizi di Cura Privata a confronto: referto spiegato, visita a domicilio, videoconsulto e secondo parere. Che cosa includono, tempi e prezzo, prima di pagare."
    : "Quanto costa Cura Privata: il primo referto spiegato, i successivi e che cosa è gratis. Che cosa include, tempi e prezzo, prima di pagare.",
  alternates: { canonical: "/prezzi" },
};

const START_LABEL: Record<PrestazioneKind, string> = {
  domicilio: "Richiedi la visita",
  video: "Prenota il videoconsulto",
  parere: "Richiedi il secondo parere",
};

const PAY_FAQ = [
  [
    "Perché il primo referto costa meno?",
    `Per farti provare il servizio: il primo referto che rendi chiaro costa ${formatEuro(firstRefertoCents())}, una sola volta per persona. Dal secondo, ${formatEuro(priceCents("capisci"))} per referto. Nessun abbonamento.`,
  ],
  [
    "Quando pago?",
    "Solo alla fine del percorso di richiesta, dopo aver visto prezzo e tempi. Con un medico paghi solo dopo che ha confermato. Nessun abbonamento e nessun rinnovo automatico.",
  ],
  [
    "Posso annullare una visita o un videoconsulto?",
    `${cancelTerms("domicilio")} Per il videoconsulto il termine è di 1 ora.`,
  ],
  [
    "E se il medico non può accettare il mio caso?",
    "Se il medico ritiene che la documentazione non basti o che serva una visita in presenza, il caso non viene preso in carico e il pagamento ti viene restituito. Le condizioni complete saranno pubblicate prima del lancio.",
  ],
  [
    "Posso passare da un servizio all'altro?",
    "Sì: i documenti che hai già caricato restano nella tua area personale e non li ricarichi. Se inizi con «Capisci il tuo referto» e poi vuoi parlarne con un medico, riparti da dove eri.",
  ],
  [
    "Come pago?",
    "Con carta, tramite un fornitore di pagamenti certificato: Cura Privata non vede né conserva i dati della carta.",
  ],
] as const;

/**
 * Prezzi, grafica «Luce»: i quattro servizi a confronto, righe allineate tra le schede (per chi, prezzo, tempi,
 * che cosa include, azione). Nomi, prezzi e tempi arrivano dal listino unico.
 */
export default function PrezziPage() {
  const prices = publicPricesEnabled();
  const medici = mediciEnabled();
  const upgrade = upgradeEnabled() && medici;
  return (
    <>
      <section
        aria-labelledby="prezzi-titolo"
        className="page-hero page-hero-wave"
      >
        <div className="container-rc page-hero-inner page-hero-overlap">
          <p className="eyebrow">Prezzi</p>
          <h1 id="prezzi-titolo" className="page-title mt-4 max-w-[16ch]">
            Un prezzo chiaro, prima di pagare.
          </h1>
          <p className="lead mt-5 max-w-[40rem]">
            {medici
              ? "Il referto spiegato, oppure un medico: a casa, in video o per un secondo parere. "
              : "Il referto spiegato, valore per valore. Il tuo spazio, con i numeri nel tempo e i promemoria, è gratis. "}
            Nessun abbonamento. In questa versione dimostrativa nessun
            pagamento è reale.
          </p>
        </div>
        <Wave className="text-canvas" />
      </section>

      <section aria-label="Confronto dei servizi" className="price-section">
        <div className="container-rc">
          <ul className="price-grid">
            {publicOfferItems().map((s) => {
              const Icon = OFFER_ICON[s.icon];
              const start = s.kind
                ? {
                    href: PRESTAZIONI[s.kind].startHref,
                    label: START_LABEL[s.kind],
                  }
                : serviceStart(s.coreId!);
              return (
                <li key={s.key} className={`tone-${s.tone}`}>
                  <article
                    className="price-card"
                    aria-labelledby={`prezzo-${s.key}`}
                    data-servizio={s.key}
                  >
                    <div className="price-card-head">
                      <span aria-hidden className="tile-ico tile-ico-tone">
                        <Icon />
                      </span>
                      <h2 id={`prezzo-${s.key}`} className="price-card-name">
                        {s.name}
                      </h2>
                    </div>
                    <p className="price-card-for">{s.forWhom}</p>
                    <div className="price-card-price">
                      {prices ? <OfferPrice item={s} size="lg" /> : null}
                    </div>
                    <p className="svc-meta price-card-time">
                      <Clock3 aria-hidden />
                      {s.timing}
                    </p>
                    <details className="price-details">
                      <summary>
                        Che cosa include{" "}
                        <ChevronDown aria-hidden className="h-5 w-5" />
                      </summary>
                      <p className="svc-meta">
                        <UserRound aria-hidden />
                        {s.who}
                      </p>
                      <ul>
                        {s.includes.map((x) => (
                          <li key={x}>
                            <Check aria-hidden />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </details>
                    <div className="price-card-foot">
                      <Link
                        href={start.href}
                        className="btn btn-primary w-full"
                      >
                        {start.label}{" "}
                        <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                      </Link>
                      <Link
                        href={s.href}
                        className="link inline-flex min-h-11 items-center justify-center font-semibold"
                      >
                        Dettagli del servizio
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 px-1 text-[1rem] text-muted">{PRICE_NOTE}</p>
          {medici ? null : <PrestoMedico className="mt-8" />}
          {upgrade && prices ? (
            <p className="mt-4 rounded-2xl bg-mist px-5 py-4 text-lg text-ink">
              Hai già usato «Capisci il tuo referto»? Per parlarne con un medico
              ti scaliamo quanto pagato per il referto:{" "}
              {formatEuro(upgradeCostCents("capisci", "parla-con-un-medico"))}.
            </p>
          ) : null}
        </div>
      </section>

      {/* 13/11/2026: il piano Famiglia è una PROPOSTA. Oggi i servizi si pagano uno per uno. */}
      {prices ? (
        <section
          aria-labelledby="piano-famiglia-titolo"
          className="section pb-0"
        >
          <div className="container-rc">
            <div
              className="fam-plan grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center"
              data-testid="piano-famiglia"
            >
              <div className="min-w-0">
                <span className="fam-proposal">
                  <CircleDashed aria-hidden className="h-4 w-4" /> In proposta,
                  prezzo da confermare
                </span>
                <h2 id="piano-famiglia-titolo" className="display-md mt-4">
                  Cura Privata Famiglia
                </h2>
                <p className="mt-3 text-[1.0625rem] text-ink-soft">
                  Oggi nessun abbonamento: ogni servizio si paga quando lo usi.
                  Stiamo valutando un piano unico per chi segue la salute di più
                  persone. Il tuo spazio personale resterebbe gratis.
                </p>
                <p className="mt-5">
                  <span className="fam-plan-price">
                    {famigliaPrice().amount}
                  </span>{" "}
                  <span className="text-[1.125rem] font-semibold text-ink-soft">
                    {famigliaPrice().per}
                  </span>
                  <span className="mt-1 block text-[1rem] text-muted">
                    {famigliaPrice().monthly}
                  </span>
                </p>
                <Link href="/famiglia#piano" className="btn btn-secondary mt-6">
                  Come funzionerebbe{" "}
                  <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
              </div>
              <ul className="check-list min-w-0">
                {famigliaIncludes().map((t) => (
                  <li key={t}>
                    <span aria-hidden className="check-dot">
                      <Check />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="pagamenti-titolo" className="section">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          <div>
            <p className="eyebrow">Pagamenti</p>
            <h2 id="pagamenti-titolo" className="display-lg mt-3">
              Senza sorprese.
            </h2>
            <p className="lead mt-4">
              Vedi sempre prezzo e tempi prima di pagare.
              {medici ? " Con un medico, paghi solo dopo la sua conferma." : ""}
            </p>
          </div>
          <FaqList items={(medici ? PAY_FAQ : PAY_FAQ.map(([q, a]) => [q, a.replace(" Con un medico paghi solo dopo che ha confermato.", "")]).filter(([q, a]) => !/medic|visita/i.test(q + a))).map(([q, a]) => ({ q, a }))} />
        </div>
      </section>
    </>
  );
}

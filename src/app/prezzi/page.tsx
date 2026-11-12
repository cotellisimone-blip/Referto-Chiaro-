import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock3, UserRound } from "lucide-react";
import { OFFER_ICON, OfferPrice } from "@/components/offerta/service-triad";
import { offerItems } from "@/domain/prestazioni/offerta-completa";
import { PRESTAZIONI, type PrestazioneKind } from "@/domain/prestazioni/listino";
import { cancelTerms } from "@/domain/prestazioni/engine";
import { PRICE_NOTE, firstRefertoCents, formatEuro, priceCents, publicPricesEnabled, upgradeCostCents, upgradeEnabled, serviceStart } from "@/domain/offerta";

export const metadata: Metadata = {
  title: "Prezzi",
  description: "I servizi di Cura Privata a confronto: referto spiegato, visita a domicilio, videoconsulto e secondo parere. Che cosa includono, tempi e prezzo, prima di pagare.",
  alternates: { canonical: "/prezzi" },
};

const START_LABEL: Record<PrestazioneKind, string> = { domicilio: "Richiedi la visita", video: "Prenota il videoconsulto", parere: "Richiedi il secondo parere" };

const PAY_FAQ = [
  ["Perché il primo referto costa meno?", `Per farti provare il servizio: il primo referto che rendi chiaro costa ${formatEuro(firstRefertoCents())}, una sola volta per persona. Dal secondo, ${formatEuro(priceCents("capisci"))} per referto. Nessun abbonamento.`],
  ["Quando pago?", "Solo alla fine del percorso di richiesta, dopo aver visto prezzo e tempi. Con un medico paghi solo dopo che ha confermato. Nessun abbonamento e nessun rinnovo automatico."],
  ["Posso annullare una visita o un videoconsulto?", `${cancelTerms("domicilio")} Per il videoconsulto il termine è di 1 ora.`],
  ["E se il medico non può accettare il mio caso?", "Se il medico ritiene che la documentazione non basti o che serva una visita in presenza, il caso non viene preso in carico e il pagamento ti viene restituito. Le condizioni complete saranno pubblicate prima del lancio."],
  ["Posso passare da un servizio all'altro?", "Sì: i documenti che hai già caricato restano nella tua area personale e non li ricarichi. Se inizi con «Capisci il tuo referto» e poi vuoi parlarne con un medico, riparti da dove eri."],
  ["Come pago?", "Con carta, tramite un fornitore di pagamenti certificato: Cura Privata non vede né conserva i dati della carta."],
] as const;

export default function PrezziPage() {
  const prices = publicPricesEnabled();
  const upgrade = upgradeEnabled();
  return (
    <>
      <section aria-labelledby="prezzi-titolo" className="bg-ivory-wash">
        <div className="container-rc pb-10 pt-12 sm:pt-16">
          <p className="eyebrow">Prezzi</p>
          <h1 id="prezzi-titolo" className="display-xl mt-5 max-w-3xl">
            <span className="marker">Un prezzo chiaro</span>, prima di pagare.
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-ink-soft">Il referto spiegato, oppure un medico: a casa, in video o per un secondo parere. In questa versione dimostrativa nessun pagamento è reale.</p>
        </div>
      </section>
      <section aria-label="Confronto dei servizi" className="pb-16 pt-6 sm:pb-24">
        <div className="container-rc">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 xl:grid-cols-4">
            {offerItems().map((s) => {
              const Icon = OFFER_ICON[s.icon];
              const start = s.kind ? { href: PRESTAZIONI[s.kind].startHref, label: START_LABEL[s.kind] } : serviceStart(s.coreId!);
              return (
                <li key={s.key} className={`tone-${s.tone}`}>
                  <article className="service-card tone-band p-6" aria-labelledby={`prezzo-${s.key}`} data-servizio={s.key}>
                    <div className="flex items-start gap-3">
                      <span className="tone-icon h-12 w-12 shrink-0">
                        <Icon aria-hidden className="h-6 w-6" />
                      </span>
                      <h2 id={`prezzo-${s.key}`} className="text-[1.375rem] font-bold leading-tight text-ink">
                        {s.name}
                      </h2>
                    </div>
                    <p className="mt-3 text-[1.0625rem] text-ink-soft xl:min-h-[4.75em]">{s.forWhom}</p>
                    {prices ? <OfferPrice item={s} size="lg" className="mt-4" /> : null}
                    <p className="mt-4 flex items-start gap-2 text-[1.0625rem] text-ink">
                      <Clock3 aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                      {s.timing}
                    </p>
                    <details className="mt-4 border-t border-line pt-3">
                      <summary className="flex min-h-11 cursor-pointer items-center text-[1.0625rem] font-semibold text-ink">Che cosa include</summary>
                      <p className="mt-2 flex items-start gap-2 text-[1.0625rem] text-ink">
                        <UserRound aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                        {s.who}
                      </p>
                      <ul className="mt-3 space-y-2.5 text-[1.0625rem] text-ink-soft">
                        {s.includes.map((x) => (
                          <li key={x} className="flex gap-2.5">
                            <Check aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </details>
                    <div className="mt-auto flex flex-col gap-1 pt-5">
                      <Link href={start.href} className="btn btn-primary">
                        {start.label} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                      </Link>
                      <Link href={s.href} className="link inline-flex min-h-11 items-center justify-center font-semibold">
                        Dettagli del servizio
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 text-[1.0625rem] text-muted">{PRICE_NOTE}</p>
          {upgrade && prices ? (
            <p className="mt-4 rounded-2xl bg-mist px-5 py-4 text-lg text-ink">
              Hai già usato «Capisci il tuo referto»? Per parlarne con un medico ti scaliamo quanto pagato per il referto: {formatEuro(upgradeCostCents("capisci", "parla-con-un-medico"))}.
            </p>
          ) : null}
        </div>
      </section>
      <section aria-labelledby="pagamenti-titolo" className="border-t border-line/70 bg-paper py-16 sm:py-24">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 id="pagamenti-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Pagamenti, senza sorprese
          </h2>
          <dl className="space-y-6">
            {PAY_FAQ.map(([q, a]) => (
              <div key={q}>
                <dt className="text-xl font-bold text-ink">{q}</dt>
                <dd className="mt-1 text-lg text-ink-soft">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock3, FileText, Stethoscope, UserRound, Video } from "lucide-react";
import { CORE_SERVICES, PRICE_NOTE, formatEuro, priceLabel, publicPricesEnabled, upgradeCostCents, upgradeEnabled } from "@/domain/offerta";

export const metadata: Metadata = {
  title: "Prezzi",
  description: "I tre servizi di Cura Privata a confronto: che cosa includono, tempi, chi se ne occupa e prezzo, prima di pagare.",
  alternates: { canonical: "/prezzi" },
};

const ICON = { file: FileText, stethoscope: Stethoscope, video: Video } as const;

const PAY_FAQ = [
  ["Quando pago?", "Solo alla fine del percorso di richiesta, dopo aver visto prezzo e tempi. Nessun abbonamento e nessun rinnovo automatico."],
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
            Tre servizi. <span className="marker">Un prezzo chiaro</span>, prima di pagare.
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-ink-soft">Scegli in base a ciò che ti serve. In questa versione dimostrativa nessun pagamento è reale.</p>
        </div>
      </section>
      <section aria-label="Confronto dei servizi" className="pb-16 pt-6 sm:pb-24">
        <div className="container-rc">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-3">
            {CORE_SERVICES.map((s) => {
              const Icon = ICON[s.icon];
              return (
                <li key={s.id} className={`tone-${s.tone}`}>
                  <article className="service-card tone-band p-6 sm:p-8" aria-labelledby={`prezzo-${s.id}`}>
                    <span className="tone-icon h-14 w-14">
                      <Icon aria-hidden className="h-7 w-7" />
                    </span>
                    <h2 id={`prezzo-${s.id}`} className="mt-5 text-[1.625rem] font-bold leading-tight text-ink lg:min-h-[2.5em]">
                      {s.name}
                    </h2>
                    <p className="mt-2 text-lg text-ink-soft lg:min-h-[4.5em]">{s.forWhom}</p>
                    {prices ? <p className="stat-num mt-6 text-[2.5rem] leading-none text-ink">{priceLabel(s.id)}</p> : null}
                    <p className="mt-4 flex items-start gap-2 text-[1.0625rem] text-ink">
                      <Clock3 aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                      {s.timing}
                    </p>
                    <p className="mt-2 flex items-start gap-2 text-[1.0625rem] text-ink">
                      <UserRound aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                      {s.who}
                    </p>
                    <ul className="mt-6 space-y-3 border-t border-line pt-5 text-[1.0625rem] text-ink-soft">
                      {s.includes.map((t) => (
                        <li key={t} className="flex gap-2.5">
                          <Check aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-col gap-2 pt-8">
                      <Link href={s.startHref} className="btn btn-primary">
                        {s.startLabel} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                      </Link>
                      <Link href={s.href} className="btn btn-ghost">
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
              Hai già usato «Capisci il tuo referto»? Per parlarne con un medico paghi solo la differenza: {formatEuro(upgradeCostCents("capisci", "parla-con-un-medico"))}.
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

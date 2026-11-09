import Link from "next/link";
import { ArrowRight, Check, CircleDashed, Clock3, FileText, Stethoscope, UserRound, Video, X } from "lucide-react";
import { clsx } from "clsx";
import { CORE_SERVICES, PRICE_NOTE, coreService, priceLabel, publicPricesEnabled, type CoreServiceId } from "@/domain/offerta";
import { VideoSlot } from "./video-slot";
import { WaitlistForm } from "@/components/site/waitlist-form";

const ICON = { file: FileText, stethoscope: Stethoscope, video: Video } as const;

/**
 * Pagina di un servizio protagonista: una frase, che cosa include, tempi, prezzo, un solo percorso.
 * Stesso schema per i tre servizi, contenuti da src/domain/offerta.ts. Il riquadro «stato» dice sempre la verità.
 */
export function ServiceLanding({
  id,
  secondaryCta,
  prerequisites,
  waitlist,
  children,
}: {
  id: CoreServiceId;
  secondaryCta?: { href: string; label: string };
  /** Che cosa manca prima del servizio reale (detto chiaramente, non in piccolo). */
  prerequisites: string[];
  waitlist?: "secondo-parere" | "visite";
  children?: React.ReactNode;
}) {
  const s = coreService(id);
  const Icon = ICON[s.icon];
  const prices = publicPricesEnabled();
  const others = CORE_SERVICES.filter((x) => x.id !== id);
  return (
    <div className={`tone-${s.tone}`}>
      {/* HERO del servizio */}
      <section aria-labelledby="servizio-titolo" className="relative overflow-hidden bg-[linear-gradient(180deg,var(--tone-bg),var(--color-canvas))]">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14 lg:pb-20 lg:pt-16">
          <div>
            <p className="eyebrow">{s.verb.replace(/\.$/, "")}</p>
            <h1 id="servizio-titolo" className="display-xl mt-5 text-ink">
              {s.name}
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-ink-soft sm:text-[1.375rem] sm:leading-snug">{s.oneLiner}</p>
            <p className="mt-4 max-w-2xl text-lg text-ink">
              <strong>Per chi:</strong> {s.forWhom}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={s.startHref} className="btn btn-primary btn-lg">
                {s.startLabel} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              {secondaryCta ? (
                <Link href={secondaryCta.href} className="btn btn-secondary btn-lg">
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          </div>
          {/* Riepilogo d'acquisto: prezzo, tempi, chi, cosa ricevi */}
          <aside aria-label="In breve" className="service-card p-6 sm:p-7">
            <div className="flex items-center gap-4">
              <span className="tone-icon h-14 w-14 shrink-0">
                <Icon aria-hidden className="h-7 w-7" />
              </span>
              {prices ? (
                <p>
                  <span className="block text-[0.9375rem] text-muted">Prezzo</span>
                  <span className="stat-num block text-[2rem] leading-none text-ink">{priceLabel(s.id)}</span>
                </p>
              ) : null}
            </div>
            <dl className="mt-6 space-y-4 text-[1.0625rem]">
              <div>
                <dt className="flex items-center gap-3 font-bold text-ink">
                  <Clock3 aria-hidden className="tone-text h-5 w-5 shrink-0" />
                  Tempi
                </dt>
                <dd className="pl-8 text-ink-soft">{s.timing}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-3 font-bold text-ink">
                  <UserRound aria-hidden className="tone-text h-5 w-5 shrink-0" />
                  Chi se ne occupa
                </dt>
                <dd className="pl-8 text-ink-soft">{s.who}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-3 font-bold text-ink">
                  <Check aria-hidden className="tone-text h-5 w-5 shrink-0" />
                  Che cosa ricevi
                </dt>
                <dd className="pl-8 text-ink-soft">{s.receives}</dd>
              </div>
            </dl>
            {prices ? <p className="mt-5 border-t border-line pt-4 text-[0.9375rem] text-muted">{PRICE_NOTE}</p> : null}
          </aside>
        </div>
      </section>

      {/* STATO REALE */}
      <div className="container-rc">
        <div role="note" className="mt-8 flex items-start gap-3 rounded-2xl border border-dashed border-warn/50 bg-cream px-5 py-4 text-[1.0625rem] text-ink">
          <CircleDashed aria-hidden className="mt-1 h-5 w-5 shrink-0 text-warn" />
          <p>
            <strong>Versione dimostrativa.</strong> Puoi provare tutto il percorso su documenti inventati: pagamento e medico sono simulati e non c&apos;è alcun addebito. Il servizio reale parte solo dopo le verifiche elencate più sotto.
          </p>
        </div>
      </div>

      {/* COME FUNZIONA: un solo percorso */}
      <section aria-labelledby="passi-titolo" className="py-16 sm:py-24">
        <div className="container-rc">
          <h2 id="passi-titolo" className="display-lg">
            Come funziona, in tre passi.
          </h2>
          <ol className="relative mt-10 grid gap-5 md:grid-cols-3">
            {s.steps.map((st, i) => (
              <li key={st.title} className="card relative p-6 sm:p-7">
                <span aria-hidden className="tone-icon h-12 w-12 text-xl font-extrabold">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-[1.375rem] font-bold leading-tight text-ink">
                  <span className="sr-only">Passo {i + 1}: </span>
                  {st.title}
                </h3>
                <p className="mt-2 text-lg text-ink-soft">{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* INCLUDE / NON È PER */}
      <section aria-labelledby="include-titolo" className="bg-paper py-16 sm:py-24">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 id="include-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
              Che cosa include
            </h2>
            <ul className="mt-6 space-y-4 text-lg text-ink">
              {s.includes.map((t) => (
                <li key={t} className="flex gap-3">
                  <Check aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display-lg text-[2rem] sm:text-[2.5rem]">Quando non è la strada giusta</h2>
            <ul className="mt-6 space-y-4 text-lg text-ink-soft">
              {s.notFor.map((t) => (
                <li key={t} className="flex gap-3">
                  <X aria-hidden className="mt-1 h-5 w-5 shrink-0 text-danger" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {children}

      {/* VIDEO */}
      <section aria-label="Video del servizio" className="py-16 sm:py-24">
        <div className="container-rc max-w-4xl">
          <VideoSlot id={s.id} />
        </div>
      </section>

      {/* PRIMA DEL SERVIZIO REALE */}
      <section aria-labelledby="prerequisiti-titolo" className="bg-mist py-16 sm:py-20">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div>
            <p className="eyebrow">Trasparenza</p>
            <h2 id="prerequisiti-titolo" className="display-lg mt-4 text-[2rem] sm:text-[2.5rem]">
              Prima di attivarlo davvero
            </h2>
            <ul className="mt-6 space-y-3 text-lg text-ink-soft">
              {prerequisites.map((p) => (
                <li key={p} className="flex gap-3">
                  <CircleDashed aria-hidden className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          {waitlist ? (
            <div>
              <h2 className="text-2xl font-bold text-ink">Avvisami quando parte</h2>
              <p className="mt-2 text-lg text-ink-soft">Solo la tua email: nessun dato sanitario.</p>
              <div className="mt-5">
                <WaitlistForm interest={waitlist} />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* GLI ALTRI DUE SERVIZI */}
      <section aria-labelledby="altri-titolo" className="py-16 sm:py-24">
        <div className="container-rc">
          <h2 id="altri-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Gli altri servizi di Cura Privata
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {others.map((o) => {
              const OIcon = ICON[o.icon];
              return (
                <li key={o.id} className={clsx(`tone-${o.tone}`)}>
                  <Link href={o.href} className="service-card group flex-row items-center gap-5 p-6">
                    <span className="tone-icon h-14 w-14 shrink-0">
                      <OIcon aria-hidden className="h-7 w-7" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xl font-bold text-ink">{o.name}</span>
                      <span className="block text-[1.0625rem] text-ink-soft">{o.forWhom}</span>
                    </span>
                    <ArrowRight aria-hidden className="tone-text h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

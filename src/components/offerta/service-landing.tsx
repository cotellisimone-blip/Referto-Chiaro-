import Link from "next/link";
import { ArrowRight, Check, CircleDashed, Clock3, Gift, UserRound, X } from "lucide-react";
import { clsx } from "clsx";
import { CORE_SERVICES, INFORMATIVE_NOTE, PRICE_NOTE, coreService, priceDisplay, publicPricesEnabled, type CoreServiceId } from "@/domain/offerta";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS, VIDEOS } from "@/content/media";
import { PriceTag } from "./price-tag";
import { VideoSlot } from "./video-slot";
import { ReportTransform } from "./report-visuals";
import { CallCard, OpinionSheet } from "./next-levels";

/**
 * L'identità di ciascuna pagina servizio, dentro la stessa marca:
 * Capisci = turchese e menta, velocità e chiarezza · Parla con un medico = caldo e umano ·
 * Secondo parere = autorevole, fondo blu profondo. Titolo e azione dal copy «Evoluzione v2»;
 * nome, frase, tempi, prezzo e contenuti restano quelli di src/domain/offerta.ts.
 */
const IDENTITY: Record<CoreServiceId, { headline: string; cta: string; hero: string; strong: boolean; track: string }> = {
  capisci: { headline: "Il tuo referto, finalmente leggibile.", cta: "Rendi chiaro il mio referto", hero: "stage-mint", strong: false, track: "cta-capisci" },
  "parla-con-un-medico": { headline: "Non sai quale specialista ti serve? Parti da un medico.", cta: "Prenota il videoconsulto", hero: "stage-warm", strong: false, track: "cta-medico" },
  "secondo-parere": { headline: "Quando vuoi un'altra valutazione, da uno specialista.", cta: "Richiedi un secondo parere", hero: "scope-strong stage-blue", strong: true, track: "cta-parere" },
};

function HeroVisual({ id }: { id: CoreServiceId }) {
  if (id === "capisci") {
    return (
      <div className="relative sm:pr-2">
        <ReportTransform />
      </div>
    );
  }
  if (id === "parla-con-un-medico") {
    const photo = ILLUSTRATIVE_PHOTOS.scrivaniaPortrait;
    return (
      <div className="relative mx-auto w-full max-w-[26rem] pb-8 lg:ml-auto lg:mr-0">
        <span aria-hidden className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--tone-accent)_40%,transparent),transparent)]" />
        {SHOW_ILLUSTRATIVE_PHOTOS ? (
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-tl-[7rem] shadow-[var(--shadow-float)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
            <figcaption className="caption-illus right-3 top-3">Immagine illustrativa</figcaption>
          </figure>
        ) : (
          <div className="aspect-[4/5] rounded-[2.5rem] bg-[var(--tone-bg)]" />
        )}
        <CallCard className="absolute bottom-0 left-4 right-10 lg:-left-12 lg:right-16" />
      </div>
    );
  }
  return (
    <div className="relative mx-auto w-full max-w-[27rem] lg:ml-auto lg:mr-0">
      <span aria-hidden className="absolute -inset-6 rounded-[3rem] border border-white/10" />
      <OpinionSheet className="relative rotate-[1.5deg] sm:p-8" />
    </div>
  );
}

/**
 * Pagina di un servizio protagonista: un titolo che parte dal bisogno, il prezzo, un'azione sola, che cosa include.
 * Stesso scheletro per i tre servizi, tre identità. Il riquadro «stato» dice sempre la verità.
 */
export function ServiceLanding({
  id,
  secondaryCta,
  children,
}: {
  id: CoreServiceId;
  secondaryCta?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  const s = coreService(id);
  const look = IDENTITY[id];
  const prices = publicPricesEnabled();
  const others = CORE_SERVICES.filter((x) => x.id !== id).sort((a, b) => a.level.n - b.level.n);
  const facts = [
    { icon: Clock3, label: "Tempi", text: s.timing },
    { icon: UserRound, label: "Chi se ne occupa", text: s.who },
    { icon: Gift, label: "Che cosa ricevi", text: s.receives },
  ];
  return (
    <div className={`tone-${s.tone}`}>
      {/* HERO del servizio */}
      <section aria-labelledby="servizio-titolo" className={clsx("relative overflow-hidden", `tone-${s.tone}`, look.hero)}>
        <div className={clsx("container-rc grid grid-cols-[minmax(0,1fr)] items-center gap-12 pb-16 pt-10 sm:pt-14 lg:gap-16 lg:pb-24 lg:pt-20", id === "capisci" ? "lg:grid-cols-[0.92fr_1.08fr]" : "lg:grid-cols-[1.12fr_0.88fr]")}>
          <div>
            <p className="eyebrow !text-[var(--tone-accent)]">
              Livello {s.level.n} · {s.name}
            </p>
            <h1 id="servizio-titolo" className="display-xl mt-5 text-[2.375rem] text-ink sm:text-[3.25rem] lg:text-[3.75rem]">
              {look.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-ink-soft sm:text-[1.375rem] sm:leading-snug">{s.oneLiner}</p>
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10">
              {prices ? <PriceTag id={s.id} size="lg" /> : null}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href={s.startHref} data-track={look.track} className={clsx("btn btn-lg", look.strong ? "btn-mint" : "btn-primary")}>
                  {look.cta} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
              </div>
            </div>
            {secondaryCta ? (
              <p className="mt-5">
                <Link href={secondaryCta.href} className="link inline-flex min-h-11 items-center text-lg font-semibold">
                  {secondaryCta.label}
                </Link>
              </p>
            ) : null}
            {id === "capisci" ? <p className="mt-3 max-w-xl text-[1.0625rem] text-muted">{INFORMATIVE_NOTE}</p> : null}
          </div>
          <HeroVisual id={id} />
        </div>
      </section>

      {/* IN BREVE: tempi, chi se ne occupa, che cosa ricevi */}
      <section aria-label="In breve" className="border-b border-line bg-paper">
        <div className="container-rc py-8 sm:py-10">
          <dl className="grid gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
            {facts.map(({ icon: Icon, label, text }) => (
              <div key={label} className="md:px-8 md:first:pl-0 md:last:pr-0">
                <dt className="flex items-center gap-3 text-lg font-bold text-ink">
                  <Icon aria-hidden className="tone-text h-6 w-6 shrink-0" strokeWidth={1.8} />
                  {label}
                </dt>
                <dd className="mt-1.5 text-[1.0625rem] leading-snug text-ink-soft">{text}</dd>
              </div>
            ))}
          </dl>
          <p role="note" className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line pt-5 text-[1.0625rem] text-ink-soft">
            <CircleDashed aria-hidden className="h-5 w-5 shrink-0 text-warn" />
            <span>
              <strong className="text-ink">Versione dimostrativa:</strong> provi tutto su documenti inventati, senza addebiti.
            </span>
            <Link href="/stato-del-progetto" className="link font-semibold">
              Che cosa manca per il servizio reale
            </Link>
          </p>
          {prices ? <p className="mt-2 text-[0.9375rem] text-muted">{PRICE_NOTE}</p> : null}
        </div>
      </section>

      {/* COME FUNZIONA: tre passi su una linea, non tre schede */}
      <section aria-labelledby="passi-titolo" className="py-14 sm:py-20">
        <div className="container-rc">
          <h2 id="passi-titolo" className="display-lg">
            Come funziona, in tre passi.
          </h2>
          <ol className="relative mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            <span aria-hidden className="absolute left-6 right-[16%] top-6 hidden h-0.5 bg-[linear-gradient(90deg,var(--tone-accent),transparent)] opacity-40 md:block" />
            {s.steps.map((st, i) => (
              <li key={st.title} className="relative flex gap-5 md:block">
                <span aria-hidden className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--tone-accent)] text-xl font-extrabold text-canvas ring-8 ring-canvas">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[1.5rem] font-bold leading-tight text-ink md:mt-6">
                    <span className="sr-only">Passo {i + 1}: </span>
                    {st.title}
                  </h3>
                  <p className="mt-2 text-lg text-ink-soft">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* CHE COSA INCLUDE (60) · QUANDO NON È LA STRADA GIUSTA (40) */}
          <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[1.35fr_0.85fr] lg:gap-6">
            <div className="rounded-[2rem] border border-[color-mix(in_srgb,var(--tone-accent)_20%,transparent)] bg-[linear-gradient(160deg,var(--tone-bg),var(--color-paper)_80%)] p-7 sm:p-10">
              <h2 id="include-titolo" className="text-[1.75rem] font-extrabold tracking-[-0.01em] text-ink">
                Che cosa include
              </h2>
              <ul className="mt-5 space-y-3.5 text-lg text-ink">
                {s.includes.map((t) => (
                  <li key={t} className="flex gap-3.5">
                    <span aria-hidden className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--tone-accent)] text-canvas">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-line bg-paper p-7 sm:p-10">
              <h2 className="text-[1.75rem] font-extrabold leading-tight tracking-[-0.01em] text-ink">Quando non è la strada giusta</h2>
              <ul className="mt-5 space-y-3.5 text-lg text-ink-soft">
                {s.notFor.map((t) => (
                  <li key={t} className="flex gap-3.5">
                    <X aria-hidden className="mt-1 h-5 w-5 shrink-0 text-danger" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {children}

      {/* VIDEO: solo quando il filmato esiste davvero */}
      {VIDEOS[s.id]?.src ? (
        <section aria-label="Video del servizio" className="py-12 sm:py-20">
          <div className="container-rc max-w-4xl">
            <VideoSlot id={s.id} />
          </div>
        </section>
      ) : null}

      {/* GLI ALTRI DUE LIVELLI */}
      <section aria-labelledby="altri-titolo" className="bg-paper py-14 sm:py-20">
        <div className="container-rc">
          <h2 id="altri-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Gli altri livelli di Cura Privata
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {others.map((o) => (
              <li key={o.id} className={`tone-${o.tone}`}>
                <Link href={o.href} className="level-step group">
                  <span className="flex items-start justify-between gap-4">
                    <span className="text-[0.9375rem] font-bold uppercase tracking-[0.08em] text-[var(--tone-accent)]">
                      Livello {o.level.n} · {o.level.verb}
                    </span>
                    {prices ? (
                      <span className="text-right">
                        {priceDisplay(o.id).lead ? <span className="block text-[0.9375rem] font-semibold text-ink-soft">{priceDisplay(o.id).lead}</span> : null}
                        <span className="stat-num block whitespace-nowrap text-[1.5rem] text-ink">{priceDisplay(o.id).amount}</span>
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-3 block text-[1.625rem] font-bold leading-tight text-ink">{o.name}</span>
                  <span className="mt-2 block text-lg text-ink-soft">{o.forWhom}</span>
                  <span className="tone-text mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-lg font-bold">
                    Scopri <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

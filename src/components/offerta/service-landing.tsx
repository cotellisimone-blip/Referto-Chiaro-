import Link from "next/link";
import { ArrowRight, Check, CircleDashed, Clock3, Gift, UserRound, X } from "lucide-react";
import { clsx } from "clsx";
import { INFORMATIVE_NOTE, PRICE_NOTE, VETRINA_TRY, coreService, publicPricesEnabled, serviceStart, type CoreServiceId } from "@/domain/offerta";
import { WAITLIST_INTEREST } from "@/content/stato-progetto";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { TrackView } from "@/components/site/track";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS, VIDEOS } from "@/content/media";
import { Photo } from "@/components/ui/photo";
import { Wave } from "@/components/ui/wave";
import { PriceTag } from "./price-tag";
import { readFlags } from "@/lib/feature-flags";
import { VideoSlot } from "./video-slot";
import { ReportTransform } from "./report-visuals";
import { CallCard, OpinionSheet } from "./service-visuals";
import { OtherServices } from "./other-services";

/**
 * L'identità di ciascuna pagina servizio, dentro la stessa marca (grafica «Luce», 12/11/2026):
 * Capisci = luce di menta e il referto che diventa report · Videoconsulto = luce calda e una persona ·
 * Secondo parere = fondo petrolio e il foglio firmato. Titolo e azione dal copy «Evoluzione v2»;
 * nome, frase, tempi, prezzo e contenuti restano quelli di src/domain/offerta.ts.
 */
const VIEW_EVENT: Record<CoreServiceId, string> = { capisci: "visita-capisci", "parla-con-un-medico": "visita-medico", "secondo-parere": "visita-parere" };

const IDENTITY: Record<CoreServiceId, { eyebrow: string; headline: string; cta: string; strong: boolean; track: string }> = {
  capisci: { eyebrow: "Capisci il tuo referto", headline: "Il tuo referto, finalmente leggibile.", cta: "Rendi chiaro il mio referto", strong: false, track: "cta-capisci" },
  "parla-con-un-medico": { eyebrow: "Videoconsulto con un medico", headline: "Non sai quale specialista ti serve? Parti da un medico.", cta: "Prenota il videoconsulto", strong: false, track: "cta-medico" },
  "secondo-parere": { eyebrow: "Secondo parere specialistico", headline: "Quando vuoi un'altra valutazione, da uno specialista.", cta: "Richiedi un secondo parere", strong: true, track: "cta-parere" },
};

function HeroVisual({ id }: { id: CoreServiceId }) {
  if (id === "capisci") {
    return (
      // Su telefono la trasformazione si vede più sotto, nel «prima e dopo» con il cursore.
      <div className="relative mx-auto hidden w-full max-w-[34rem] sm:block lg:mr-0">
        <ReportTransform />
      </div>
    );
  }
  if (id === "parla-con-un-medico") {
    return (
      // Su telefono la scheda di vetro sta sotto il viso (sporge dal bordo della foto), da tablet in su le si appoggia sopra.
      <div className="relative mx-auto w-full max-w-[26rem] pb-[4.75rem] sm:pb-7 lg:ml-auto lg:mr-0">
        {SHOW_ILLUSTRATIVE_PHOTOS ? (
          <figure className="svc-photo">
            <Photo photo={ILLUSTRATIVE_PHOTOS.ritratto} sizes="(min-width: 1024px) 26rem, 92vw" priority />
            <figcaption className="caption-illus right-3 top-3">Immagine illustrativa</figcaption>
          </figure>
        ) : (
          <div className="aspect-[4/3] rounded-[2.5rem] bg-[var(--tone-bg)] sm:aspect-[4/5]" />
        )}
        <CallCard className="absolute bottom-0 left-3 right-3 sm:left-4 sm:right-10 lg:-left-12 lg:right-16" />
      </div>
    );
  }
  return (
    <div className="relative mx-auto w-full max-w-[27rem] lg:ml-auto lg:mr-0">
      <span aria-hidden className="absolute -inset-5 rounded-[2.5rem] border border-white/10 sm:-inset-6" />
      <OpinionSheet className="relative rotate-[1.5deg] sm:p-8" />
    </div>
  );
}

/**
 * Pagina di un servizio protagonista: un titolo che parte dal bisogno, il prezzo, un'azione sola, che cosa include.
 * Stesso scheletro per i tre servizi, tre identità. Il riquadro «versione dimostrativa» dice sempre la verità.
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
  const vetrina = readFlags().vetrina;
  const start = serviceStart(id);
  const interest = WAITLIST_INTEREST[id];
  const facts = [
    { icon: Clock3, label: "Tempi", text: s.timing },
    { icon: UserRound, label: "Chi se ne occupa", text: s.who },
    { icon: Gift, label: "Che cosa ricevi", text: s.receives },
  ];
  return (
    <div className={`tone-${s.tone}`}>
      <TrackView event={VIEW_EVENT[id]} />

      {/* APERTURA del servizio. Lo «scope» scuro sta sul contenuto, così l'onda prende il colore della pagina. */}
      <section aria-labelledby="servizio-titolo" className={clsx("svc-hero", look.strong && "bg-petrol")}>
        <div className={clsx("container-rc svc-hero-grid", look.strong && `scope-strong tone-${s.tone}`)}>
          <div>
            <p className="eyebrow tone-text">{look.eyebrow}</p>
            <h1 id="servizio-titolo" className="page-title mt-4">
              {look.headline}
            </h1>
            <p className="lead mt-5 max-w-[36rem]">{s.oneLiner}</p>
            <div className="svc-buy">
              {prices ? <PriceTag id={s.id} size="lg" /> : null}
              <Link href={start.href} data-track={look.track} className={clsx("btn btn-lg", look.strong ? "btn-mint" : "btn-primary")}>
                {vetrina ? start.label : look.cta} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
            </div>
            {vetrina ? (
              // Profilo vetrina: il servizio non è aperto. L'azione principale porta alla lista d'attesa; accanto,
              // la prova senza registrazione (esempio o account demo condiviso). Mai un modulo di registrazione.
              <div className="mt-5 max-w-xl" data-testid="vetrina-avviso">
                <p className="text-lg text-ink-soft">Il servizio non è ancora aperto. Lasciaci la tua email e ti avvisiamo quando parte; intanto puoi provarlo con dati inventati.</p>
                <Link href={VETRINA_TRY[id].href} className="link mt-2 inline-flex min-h-11 items-center text-lg font-semibold">
                  {VETRINA_TRY[id].label}
                </Link>
              </div>
            ) : secondaryCta ? (
              <p className="mt-4">
                <Link href={secondaryCta.href} className="link inline-flex min-h-11 items-center text-lg font-semibold">
                  {secondaryCta.label}
                </Link>
              </p>
            ) : null}
            {id === "capisci" ? <p className="mt-2 max-w-xl text-[1rem] text-muted">{INFORMATIVE_NOTE}</p> : null}
          </div>
          <HeroVisual id={id} />
        </div>
        <Wave className="text-canvas" />
      </section>

      {/* IN BREVE: tempi, chi se ne occupa, che cosa ricevi. Una scheda sola, a cavallo dell'onda. */}
      <section aria-label="In breve">
        <div className="container-rc">
          <div className="svc-facts">
            <dl className="svc-facts-grid">
              {facts.map(({ icon: Icon, label, text }) => (
                <div key={label} className="svc-fact">
                  <dt>
                    <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone">
                      <Icon />
                    </span>
                    {label}
                  </dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
            <p role="note" className="svc-note">
              <CircleDashed aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
              <span>
                <strong className="text-ink">Versione dimostrativa:</strong> provi tutto su documenti inventati, senza addebiti.{" "}
                <Link href="/stato-del-progetto" className="link font-semibold">
                  Che cosa manca per il servizio reale
                </Link>
              </span>
            </p>
          </div>
          {prices ? <p className="mt-3 px-1 text-[0.9375rem] text-muted">{PRICE_NOTE}</p> : null}
        </div>
      </section>

      {/* COME FUNZIONA: tre passi sul filo */}
      <section aria-labelledby="passi-titolo" className="section">
        <div className="container-rc">
          <h2 id="passi-titolo" className="display-lg">
            Come funziona, in tre passi.
          </h2>
          <ol className="steps mt-7 sm:mt-12">
            {s.steps.map((st, i) => (
              <li key={st.title} className="step">
                <span aria-hidden className="step-num">
                  {i + 1}
                </span>
                <div>
                  <h3 className="step-title">
                    <span className="sr-only">Passo {i + 1}: </span>
                    {st.title}
                  </h3>
                  <p className="step-text">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* CHE COSA INCLUDE · QUANDO NON È LA STRADA GIUSTA */}
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 sm:mt-16 lg:grid-cols-[1.35fr_0.85fr] lg:gap-6">
            <div className="incl-card">
              <h2 id="include-titolo" className="box-title">
                Che cosa include
              </h2>
              <ul className="check-list">
                {s.includes.map((t) => (
                  <li key={t}>
                    <span aria-hidden className="check-dot">
                      <Check />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="excl-card">
              <h2 className="box-title">Quando non è la strada giusta</h2>
              <ul className="check-list text-ink-soft">
                {s.notFor.map((t) => (
                  <li key={t}>
                    <span aria-hidden className="cross-dot">
                      <X />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {vetrina && interest ? (
        <section id="avvisami" aria-labelledby="avvisami-titolo" className="panel-section section scroll-mt-24 bg-mist">
          <div className="container-rc max-w-2xl">
            <p className="eyebrow">Lista d&apos;attesa</p>
            <h2 id="avvisami-titolo" className="display-lg mt-3">
              Avvisami quando parte.
            </h2>
            <p className="mt-3 text-lg text-ink-soft">Solo la tua email, per un interesse non vincolante. Non scrivere informazioni sulla tua salute.</p>
            <div className="mt-6">
              <WaitlistForm interest={interest} />
            </div>
          </div>
        </section>
      ) : null}

      {children}

      {/* VIDEO: solo quando il filmato esiste davvero */}
      {VIDEOS[s.id]?.src ? (
        <section aria-label="Video del servizio" className="section">
          <div className="container-rc max-w-4xl">
            <VideoSlot id={s.id} />
          </div>
        </section>
      ) : null}

      {/* GLI ALTRI SERVIZI */}
      <OtherServices exclude={id} />
    </div>
  );
}

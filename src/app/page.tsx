import Link from "next/link";
import { ArrowRight, Ban, Clock3, FolderHeart, Phone, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { MiniReport } from "@/components/offerta/report-visuals";
import { BeforeAfter } from "@/components/offerta/before-after";
import { Journey } from "@/components/offerta/journey";
import { Trust } from "@/components/offerta/trust";
import { PriceTag } from "@/components/offerta/price-tag";
import { MobileHelpBar } from "@/components/site/mobile-help-bar";
import { TrackView } from "@/components/site/track";
import { DualEntry } from "@/components/punto-di-partenza/dual-entry";
import { FeaturedPrestazione } from "@/components/prestazioni/public";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { HERO_SUBTITLE, PAYOFF_LINES, PRICE_NOTE, coreService, entryPriceLabel, isVetrina, priceDisplay, publicPricesEnabled } from "@/domain/offerta";

/*
 * Home di Cura Privata. 11/11/2026, «home più calma» su richiesta del titolare: troppe volte «medico», troppe
 * informazioni. Cinque blocchi dopo la hero, e i servizi con un medico si presentano una volta sola (i tre livelli):
 * 1 hero (payoff, due azioni, fotografia) · 1b doppio ingresso · 2 il referto prima e dopo, con il cursore ·
 * 3 i livelli · 4 fiducia, in quattro fatti · 5 chiusura con il 112.
 * «Preparati alla visita» resta nel menu e nel piè di pagina. Prezzi e nomi da src/domain/offerta.ts.
 */

const MICROTRUST = [
  { icon: Sparkles, text: "Digitale e automatico" },
  { icon: Clock3, text: "Di norma pochi minuti" },
  { icon: FolderHeart, text: "PDF e area personale" },
  { icon: Ban, text: "Nessuna diagnosi" },
];

export default function Home() {
  const prices = publicPricesEnabled();
  const photo = ILLUSTRATIVE_PHOTOS.hero;
  const square = ILLUSTRATIVE_PHOTOS.heroSquare;
  const capisci = coreService("capisci");
  const pdp = puntoDiPartenzaEnabled();
  const capisciPrice = priceDisplay("capisci");
  return (
    <>
      <TrackView event="visita-home" />

      {/* 1 · HERO */}
      <section aria-labelledby="hero-titolo" className="hero2">
        <div className="container-rc relative">
          <div className="pt-6 lg:max-w-[52%] lg:py-16">
            {/* 12/11/2026: in evidenza la prestazione con un medico davvero disponibile (il domicilio quando ha copertura). */}
            <FeaturedPrestazione vetrina={isVetrina()} />
            <h1 id="hero-titolo" className="display-xl hero-payoff text-ink">
              <span className="block">{PAYOFF_LINES[0]}</span>
              <span className="block">
                <span className="marker marker-animate">{PAYOFF_LINES[1]}</span>
              </span>
              <span className="block">{PAYOFF_LINES[2]}</span>
            </h1>
            <p className="mt-6 max-w-[32rem] text-xl text-ink-soft sm:text-[1.375rem] sm:leading-snug">{HERO_SUBTITLE}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={capisci.href} data-track="cta-capisci" className="btn btn-primary btn-lg">
                Ho un referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/servizi" className="btn btn-secondary btn-lg">
                Scopri tutti i servizi
              </Link>
            </div>
            {/* Ciclo 1: prezzo e ingresso gratuito già nella prima schermata, anche su telefono */}
            {prices || pdp ? (
              <p className="hero-facts mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-lg text-ink-soft">
                {prices ? (
                  <span>
                    <strong className="text-ink">{capisciPrice.lead ? `${capisciPrice.lead} ${capisciPrice.amount}` : capisciPrice.amount}</strong>
                    {capisciPrice.note ? `, ${capisciPrice.note}` : ""}
                  </span>
                ) : null}
                {pdp ? (
                  <Link href="/punto-di-partenza" data-track="cta-pdp" className="link inline-flex min-h-11 items-center font-semibold">
                    Non hai ancora esami? Parti gratis
                  </Link>
                ) : null}
              </p>
            ) : null}
          </div>
        </div>
        {/* Una sola immagine: ritaglio 1:1 su telefono (sotto le azioni), fotografia larga che esce dal margine su desktop */}
        <div className="hero2-visual">
          {SHOW_ILLUSTRATIVE_PHOTOS ? (
            <figure className="hero2-photo">
              <picture>
                <source media="(min-width: 1024px)" srcSet={photo.src} width={photo.width} height={photo.height} />
                <img src={square.src} width={square.width} height={square.height} alt={square.alt} fetchPriority="high" decoding="async" />
              </picture>
              <figcaption className="caption-illus right-4 top-4">Immagine illustrativa</figcaption>
            </figure>
          ) : null}
          <MiniReport className="hero2-card" />
        </div>
      </section>

      {/* 1b · DOPPIO INGRESSO (V3): senza esami → Punto di Partenza, gratis; con un referto → Capisci */}
      {pdp ? <DualEntry /> : null}

      {/* 2 · IL PRODOTTO D'INGRESSO, con il referto prima e dopo (cursore, anche su telefono) */}
      <section id="referto" aria-labelledby="referto-titolo" className="tone-capisci bg-mist py-10 sm:py-16">
        <div className="container-rc">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow">
                Livello {capisci.level.n} · {capisci.level.verb}
              </p>
              <h2 id="referto-titolo" className="display-lg mt-4 text-[2.25rem] sm:text-[3.25rem]">
                {pdp ? "Come diventa chiaro un referto." : "Parti dal tuo referto."}
              </h2>
              <p className="mt-4 max-w-xl text-xl text-ink-soft">Sposta il cursore: a sinistra il referto com&apos;è, a destra lo stesso spiegato in parole semplici.</p>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              {prices ? <PriceTag id="capisci" size="hero" /> : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link href={capisci.href} data-track="cta-capisci" className="btn btn-primary btn-lg sm:whitespace-nowrap">
                  Rendi chiaro il mio referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                <Link href="/referti/esempio" className="btn btn-secondary btn-lg sm:whitespace-nowrap">
                  Guarda un esempio
                </Link>
              </div>
            </div>
          </div>
          <Reveal className="mt-8 sm:mt-10">
            <BeforeAfter />
          </Reveal>
          {pdp ? null : (
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-7 lg:grid-cols-4">
            {MICROTRUST.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-lg font-semibold leading-tight text-ink">
                <Icon aria-hidden className="h-6 w-6 shrink-0 text-teal" strokeWidth={1.8} />
                {text}
              </li>
            ))}
          </ul>
          )}
        </div>
      </section>

      {/* 3 · I LIVELLI: unico punto in cui si presentano i servizi con un medico */}
      <section aria-labelledby="livelli-titolo" className="py-10 sm:py-14">
        <div className="container-rc">
          <div className="lg:flex lg:items-start lg:justify-between lg:gap-10">
            <h2 id="livelli-titolo" className="display-lg max-w-xl">
              {pdp ? "Parti gratis. Poi scegli tu fin dove arrivare." : "Tre livelli. Scegli tu fin dove arrivare."}
            </h2>
            <p className="mt-4 max-w-xs text-xl text-ink-soft lg:mt-2 lg:text-right">
              <Link href="/inizia" className="link font-semibold">
                Ti aiutiamo a scegliere
              </Link>
            </p>
          </div>
          <div className="mt-7 lg:-mt-6">
            <Journey withStart={pdp} />
          </div>
          {prices ? <p className="mt-6 text-[1.0625rem] text-muted">{PRICE_NOTE}</p> : null}
        </div>
      </section>

      {/* 4 · FIDUCIA */}
      <section aria-labelledby="fiducia-titolo" className="scope-strong bg-strong py-8 sm:py-14">
        <div className="container-rc">
          <Trust />
        </div>
      </section>

      {/* 5 · CHIUSURA */}
      <section aria-labelledby="chiusura-titolo" className="scope-strong stage-teal py-8 sm:py-14">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] items-end gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            {pdp ? (
              <h2 id="chiusura-titolo" className="display-lg">
                Prima capisci da dove parti.
                <span className="mt-2 block text-[#7be0d2]">Poi, quando arrivano i risultati, ti aiutiamo a leggerli.</span>
              </h2>
            ) : (
              <h2 id="chiusura-titolo" className="display-xl">
                Hai già un referto?
                <span className="mt-2 block text-[#7be0d2]">Rendilo chiaro{prices ? ` da ${entryPriceLabel()}` : ""}.</span>
              </h2>
            )}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={capisci.href} data-track="cta-capisci" className="btn btn-mint btn-lg">
                Rendi chiaro il mio referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              {pdp ? (
                <Link href="/punto-di-partenza" data-track="cta-pdp" className="btn btn-secondary btn-lg">
                  Inizia gratis dal Punto di Partenza
                </Link>
              ) : (
                <Link href="/inizia" className="btn btn-secondary btn-lg">
                  Ti aiutiamo a scegliere
                </Link>
              )}
            </div>
          </div>
          <p className="flex items-start gap-4 rounded-2xl border border-white/25 bg-black/15 p-5 text-lg text-ink">
            <Phone aria-hidden className="mt-1 h-6 w-6 shrink-0 text-danger" />
            <span>
              <strong>Non per le emergenze.</strong> Se stai male adesso chiama il <strong>112</strong>.
            </span>
          </p>
        </div>
      </section>

      <MobileHelpBar />
    </>
  );
}

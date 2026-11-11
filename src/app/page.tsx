import Link from "next/link";
import { ArrowRight, Ban, Clock3, FolderHeart, Phone, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { MiniReport, ReportTransform } from "@/components/offerta/report-visuals";
import { NextLevels } from "@/components/offerta/next-levels";
import { Journey } from "@/components/offerta/journey";
import { Trust } from "@/components/offerta/trust";
import { PrepBanner } from "@/components/offerta/prep-banner";
import { PriceTag } from "@/components/offerta/price-tag";
import { MobileHelpBar } from "@/components/site/mobile-help-bar";
import { TrackView } from "@/components/site/track";
import { DualEntry } from "@/components/punto-di-partenza/dual-entry";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { HERO_SUBTITLE, PRICE_NOTE, coreService, entryPriceLabel, priceDisplay, publicPricesEnabled } from "@/domain/offerta";

/*
 * Home di Cura Privata, «Evoluzione v2» (11/11/2026). Sette blocchi, chiari e forti alternati:
 * V3 (11/11/2026): dopo la hero il doppio ingresso «Punto di Partenza, gratis» / «Hai già un referto?».
 * 1 hero (payoff, due sole azioni, fotografia + un pezzo vero di prodotto) · 2 il prodotto d'ingresso, «Parti dal tuo
 * referto» · 3 «Se una spiegazione non basta»: i due livelli umani, diversi tra loro · 4 i tre livelli ·
 * 5 fiducia · 6 lo strumento gratuito · 7 chiusura con il 112.
 * Testo grande, righe corte, nessun dato inventato. Le foto sono illustrative (pazienti, mai medici).
 * Prezzi e nomi arrivano da src/domain/offerta.ts.
 */

const MICROTRUST = [
  { icon: Sparkles, text: "Digitale e automatico" },
  { icon: Clock3, text: "Di norma pochi minuti" },
  { icon: FolderHeart, text: "PDF e area personale" },
  { icon: Ban, text: "Nessuna diagnosi" },
];

const STEPS = ["Carichi il referto", "Controlli i valori", "Ricevi il report"];

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
          <div className="pt-10 lg:max-w-[52%] lg:py-20">
            <h1 id="hero-titolo" className="display-xl hero-payoff text-ink">
              <span className="block">Capisci.</span>
              <span className="block">Chiedi un secondo parere.</span>
              <span className="block">
                <span className="marker marker-animate">Parla con un medico.</span>
              </span>
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

      {/* 2 · IL PRODOTTO D'INGRESSO */}
      <section id="referto" aria-labelledby="referto-titolo" className={`scope-strong tone-capisci stage-petrol overflow-hidden py-10 sm:py-14`}>
        <div className="container-rc">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div>
              <p className="eyebrow">
                Livello {capisci.level.n} · {capisci.level.verb}
              </p>
              <h2 id="referto-titolo" className="display-lg mt-4 text-[2.25rem] sm:text-[3.25rem]">
                {pdp ? "Come diventa chiaro un referto." : "Parti dal tuo referto."}
              </h2>
              <p className="mt-5 max-w-lg text-xl text-ink-soft">Pieno di sigle e valori? Diventa un report chiaro e ordinato, utile da portare al medico.</p>
              {prices ? <PriceTag id="capisci" size="hero" className="mt-8" /> : null}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link href={capisci.href} data-track="cta-capisci" className="btn btn-mint btn-lg sm:whitespace-nowrap">
                  Rendi chiaro il mio referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                <Link href="/referti/esempio" className="btn btn-secondary btn-lg sm:whitespace-nowrap">
                  Guarda un esempio
                </Link>
              </div>
            </div>
            <Reveal>
              <ReportTransform />
              <ol className="mt-9 hidden gap-x-4 gap-y-3 sm:grid sm:grid-cols-3">
                {STEPS.map((t, i) => (
                  <li key={t} className="flex items-center gap-3 text-lg font-bold text-ink">
                    <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7be0d2] text-base font-extrabold text-[#0c3340]">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
          {/* V3: con il doppio ingresso sopra, il blocco si accorcia (le rassicurazioni stanno già nelle due card) */}
          {pdp ? null : (
          <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-7 lg:grid-cols-4">
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

      {/* 3 · SE UNA SPIEGAZIONE NON BASTA */}
      <section id="servizi" aria-labelledby="servizi-titolo" className="py-10 sm:py-14">
        <div className="container-rc">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 id="servizi-titolo" className="display-lg max-w-2xl">
              Se una spiegazione non basta.
            </h2>
          </div>
          <div className="mt-7">
            <NextLevels />
          </div>
          {prices ? (
            <p className="mt-6 flex flex-col gap-2 text-[1.0625rem] text-muted sm:flex-row sm:items-center sm:justify-between">
              <span>{PRICE_NOTE}</span>
              <Link href="/prezzi" className="link font-semibold">
                Confronta i servizi
              </Link>
            </p>
          ) : null}
        </div>
      </section>

      {/* 4 · TRE LIVELLI */}
      <section aria-labelledby="livelli-titolo" className="bg-mist py-10 sm:py-14">
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
        </div>
      </section>

      {/* 5 · FIDUCIA */}
      <section aria-labelledby="fiducia-titolo" className="scope-strong bg-strong py-10 sm:py-14">
        <div className="container-rc">
          <Trust />
        </div>
      </section>

      {/* 6 · LO STRUMENTO GRATUITO */}
      <section aria-labelledby="preparati-titolo" className="bg-ivory py-10 sm:py-14">
        <div className="container-rc">
          <PrepBanner />
        </div>
      </section>

      {/* 7 · CHIUSURA */}
      <section aria-labelledby="chiusura-titolo" className="scope-strong stage-teal py-10 sm:py-14">
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

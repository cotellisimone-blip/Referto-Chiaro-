import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Wave } from "@/components/ui/wave";
import { Photo } from "@/components/ui/photo";
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
import { mediciEnabled } from "@/lib/medici";
import { PrestoMedico } from "@/components/site/presto-medico";
import {
  ExampleTrend,
} from "@/components/famiglia/showcase";
import { famigliaPrice } from "@/domain/famiglia/piano";
import { BellRing, LineChart, Users } from "lucide-react";
import {
  HERO_PROMISE_SUBTITLE,
  PAYOFF_LINES,
  PRICE_NOTE,
  coreService,
  entryPriceLabel,
  isVetrina,
  priceDisplay,
  publicPricesEnabled,
} from "@/domain/offerta";

/*
 * Home di Cura Privata, grafica «Luce» (12/11/2026). Resta la «home calma» voluta dal titolare: sei blocchi, i servizi
 * con un medico presentati una volta sola.
 * 1 apertura (annuncio, payoff in tre tappe, due azioni, la fotografia fusa nella luce) · 1b i due ingressi ·
 * 2 il referto prima e dopo, con il cursore · 3 il percorso sul filo · 4 fiducia, in quattro fatti · 5 chiusura con il 112.
 * «Preparati alla visita» resta nel menu e nel piè di pagina. Prezzi e nomi da src/domain/offerta.ts.
 */
export default function Home() {
  const prices = publicPricesEnabled();
  const capisci = coreService("capisci");
  const pdp = puntoDiPartenzaEnabled();
  const capisciPrice = priceDisplay("capisci");
  const medici = mediciEnabled();
  return (
    <>
      <TrackView event="visita-home" />

      {/* 1 · APERTURA */}
      <section aria-labelledby="hero-titolo" className="hero">
        <div className="container-rc hero-inner">
          <div className="hero-copy">
            {/* 12/11/2026: in evidenza la prestazione con un medico davvero disponibile (il domicilio quando ha copertura). */}
            {medici ? <FeaturedPrestazione vetrina={isVetrina()} /> : null}
            {/* 13/11/2026: la promessa che fa restare diventa il titolo; i tre servizi restano la porta d'ingresso, subito sotto. */}
            <h1 id="hero-titolo" className="promise">
              Tutta la salute della tua famiglia,{" "}
              <span className="marker">finalmente chiara.</span>
            </h1>
            <p className="payoff payoff-sm mt-5">
              <span>{PAYOFF_LINES[0]}</span> <span>{PAYOFF_LINES[1]}</span>{" "}
              <span>{PAYOFF_LINES[2]}</span>
            </p>
            <p className="lead mt-5 max-w-[34rem]">{HERO_PROMISE_SUBTITLE}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={capisci.href}
                data-track="cta-capisci"
                className="btn btn-primary btn-lg"
              >
                Ho un referto{" "}
                <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/servizi" className="btn btn-secondary btn-lg">
                Scopri tutti i servizi
              </Link>
            </div>
            {/* Prezzo e ingresso gratuito già nella prima schermata, anche su telefono */}
            {prices || pdp ? (
              <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-0.5 text-[1.0625rem] text-ink-soft">
                {prices ? (
                  <span>
                    <strong className="text-ink">
                      {capisciPrice.lead
                        ? `${capisciPrice.lead} ${capisciPrice.amount}`
                        : capisciPrice.amount}
                    </strong>
                    {capisciPrice.note ? `, ${capisciPrice.note}` : ""}
                  </span>
                ) : null}
                {pdp ? (
                  <Link
                    href="/punto-di-partenza"
                    data-track="cta-pdp"
                    className="link inline-flex min-h-11 items-center font-semibold"
                  >
                    Non hai ancora esami? Parti gratis
                  </Link>
                ) : null}
              </p>
            ) : null}
          </div>
        </div>
        {/* La fotografia si fonde nella luce dell'apertura; sopra, un pezzo vero di prodotto su vetro. */}
        <div className="hero-photo">
          {SHOW_ILLUSTRATIVE_PHOTOS ? (
            <figure className="contents">
              <Photo
                photo={ILLUSTRATIVE_PHOTOS.hero}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <figcaption className="caption-illus">
                Immagine illustrativa
              </figcaption>
            </figure>
          ) : null}
          <MiniReport className="hero-card" />
        </div>
        <Wave double className="text-canvas" />
      </section>

      {/* 1b · I DUE INGRESSI (V3): senza esami → Punto di Partenza, gratis; con un referto → Capisci */}
      {pdp ? <DualEntry /> : null}

      {/* 2 · IL PRODOTTO D'INGRESSO, con il referto prima e dopo (cursore, anche su telefono) */}
      <section
        id="referto"
        aria-labelledby="referto-titolo"
        className="panel-section grain section mt-8 bg-mist sm:mt-12"
      >
        <div className="container-rc">
          <div className="referto-grid">
            <div className="referto-copy">
              <p className="eyebrow">{capisci.name}</p>
              <h2 id="referto-titolo" className="display-lg mt-4">
                {pdp
                  ? "Come diventa chiaro un referto."
                  : "Parti dal tuo referto."}
              </h2>
              <p className="lead mt-4 max-w-xl">
                Sposta il cursore: a sinistra il referto com&apos;è, a destra lo
                stesso referto, spiegato valore per valore.
              </p>
            </div>
            <Reveal className="referto-demo">
              <BeforeAfter />
            </Reveal>
            <div className="referto-buy flex flex-col gap-5 lg:items-end">
              {prices ? (
                <PriceTag id="capisci" size="hero" className="lg:text-right" />
              ) : null}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={capisci.href}
                  data-track="cta-capisci"
                  className="btn btn-primary btn-lg sm:whitespace-nowrap"
                >
                  Rendi chiaro il mio referto{" "}
                  <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                <Link
                  href="/referti/esempio"
                  className="btn btn-secondary btn-lg sm:whitespace-nowrap"
                >
                  Guarda un esempio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2b · PERCHÉ SI RESTA (13/11/2026): la storia di tutta la famiglia, nel tempo. Pezzi veri di prodotto su referti inventati. */}
      <section
        id="famiglia"
        aria-labelledby="famiglia-titolo"
        className="section-tight"
      >
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div className="min-w-0">
            <p className="eyebrow">Famiglia e salute nel tempo</p>
            <h2 id="famiglia-titolo" className="display-lg mt-4">
              Un referto si capisce una volta. Una storia serve per anni.
            </h2>
            <p className="lead mt-4">
              Ogni referto si aggiunge ai precedenti, per te e per chi segui.
              Prima della visita, le domande sono già pronte.
            </p>
            <ul className="fam-chips mt-5 hidden sm:flex" aria-label="Che cosa trovi">
              {[
                { icon: LineChart, t: "I numeri, nel tempo" },
                { icon: Users, t: "Tutta la famiglia" },
                { icon: BellRing, t: "La visita, già preparata" },
              ].map(({ icon: Icon, t }) => (
                <li key={t}>
                  <Icon aria-hidden className="h-5 w-5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/famiglia"
                data-track="cta-famiglia"
                className="btn btn-primary btn-lg"
              >
                Scopri Famiglia{" "}
                <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              {prices ? (
                <span className="text-[1.0625rem] text-ink-soft">
                  Il tuo spazio è gratis. Per la famiglia,{" "}
                  <strong className="text-ink">{famigliaPrice().label}</strong>{" "}
                  <span className="text-muted">(proposta)</span>
                </span>
              ) : null}
            </div>
          </div>
          {/* Su schermi larghi un grafico vero accanto al testo; su telefono la home resta corta e il grafico è a un tocco. */}
          <Reveal className="hidden min-w-0 lg:block">
            <ExampleTrend name="Creatinina" compact />
          </Reveal>
        </div>
      </section>

      {/* 3 · IL PERCORSO: unico punto in cui si presentano i servizi con un medico */}
      <section aria-labelledby="livelli-titolo" className="section">
        <div className="container-rc">
          <div className="max-w-3xl lg:mx-auto lg:text-center">
            <p className="eyebrow">Il percorso</p>
            <h2 id="livelli-titolo" className="display-lg mt-4">
              {pdp
                ? "Parti gratis. Poi scegli tu fin dove arrivare."
                : "Tre livelli. Scegli tu fin dove arrivare."}
            </h2>
            <p className="lead mt-4">
              Ogni tappa vale da sola: entri da quella che ti serve.{" "}
              <Link
                href="/inizia"
                className="link whitespace-nowrap font-semibold"
              >
                Ti aiutiamo a scegliere
              </Link>
            </p>
          </div>
          <div className="mt-8 lg:mt-12">
            <Journey withStart={pdp} />
          </div>
          {prices ? (
            <p className="mt-6 text-[1rem] text-muted lg:mt-8 lg:text-center">
              {PRICE_NOTE}
            </p>
          ) : null}
          {/* 13/11/2026: senza medici, l'unico accenno ai servizi con un medico. */}
          {medici ? null : <PrestoMedico className="mt-10 lg:mt-14" />}
        </div>
      </section>

      {/* 4 · FIDUCIA */}
      <section
        aria-labelledby="fiducia-titolo"
        className="panel-section scope-strong section bg-petrol"
      >
        <div className="container-rc">
          <Trust />
        </div>
      </section>

      {/* 5 · CHIUSURA */}
      <section aria-labelledby="chiusura-titolo" className="section">
        <div className="container-rc">
          <div className="closing-card">
            {SHOW_ILLUSTRATIVE_PHOTOS ? (
              <figure className="closing-photo">
                {/* Su telefono il dettaglio delle mani, in orizzontale; da tablet in su la scena con la persona. */}
                <Photo
                  photo={ILLUSTRATIVE_PHOTOS.mani}
                  sizes="100vw"
                  className="closing-photo-wide"
                />
                <Photo
                  photo={ILLUSTRATIVE_PHOTOS.scrivania}
                  sizes="(min-width: 900px) 46vw, 1px"
                  className="closing-photo-tall"
                />
                <figcaption className="caption-illus right-4 top-4">
                  Immagine illustrativa
                </figcaption>
              </figure>
            ) : null}
            <div className="closing-copy">
              <h2 id="chiusura-titolo" className="display-lg">
                {pdp ? "Prima capisci da dove parti." : "Hai già un referto?"}
              </h2>
              <p className="lead mt-3 max-w-[26rem] font-semibold text-teal">
                {pdp
                  ? "Poi, quando arrivano i risultati, ti aiutiamo a leggerli."
                  : `Rendilo chiaro${prices ? ` da ${entryPriceLabel()}` : ""}.`}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={capisci.href}
                  data-track="cta-capisci"
                  className="btn btn-primary btn-lg whitespace-nowrap"
                >
                  Rendi chiaro il mio referto{" "}
                  <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                {pdp ? (
                  <Link
                    href="/punto-di-partenza"
                    data-track="cta-pdp"
                    className="btn btn-secondary btn-lg whitespace-nowrap"
                  >
                    Parti gratis, senza esami
                  </Link>
                ) : (
                  <Link href="/inizia" className="btn btn-secondary btn-lg">
                    Ti aiutiamo a scegliere
                  </Link>
                )}
              </div>
              <p className="emergency-note mt-7">
                <span aria-hidden>
                  <Phone className="h-4 w-4" />
                </span>
                <span>
                  <strong>Non per le emergenze.</strong> Se stai male adesso
                  chiama il <strong>112</strong>.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <MobileHelpBar />
    </>
  );
}

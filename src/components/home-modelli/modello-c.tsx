import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { MiniReport } from "@/components/offerta/report-visuals";
import { CallCard, HomeVisitVisual, OpinionSheet } from "@/components/offerta/service-visuals";
import { Trust } from "@/components/offerta/trust";
import { SheetArt } from "@/components/punto-di-partenza/guide";
import { ExamplePeople, ExampleReminder, ExampleTrend } from "@/components/famiglia/showcase";
import { Emergenza, ModelloBar, catalogo, type Voce } from "./catalogo";

/**
 * MODELLO C · «Vetrina»: audace. Apertura scura con un titolo enorme e tre pezzi veri di prodotto sospesi;
 * poi una vetrina a mosaico, dove ogni servizio è una tessera con il suo «oggetto» (report, mappa della visita,
 * videochiamata, sintesi firmata, grafico nel tempo) e il suo prezzo. Per far capire in un colpo d'occhio quanto c'è.
 */
function Tessera({ v, size, children }: { v: Voce; size: "xl" | "tall" | "wide" | "sm"; children?: React.ReactNode }) {
  const Icon = v.icon;
  return (
    <li className={`hm-tile hm-tile-${size} tone-${v.tone ?? "partenza"}`}>
      <Link href={v.href} className="hm-tile-link">
        <span className="hm-tile-head">
          <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone shrink-0">
            <Icon />
          </span>
          {v.price ? <span className="hm-tile-price">{v.price}</span> : null}
        </span>
        <span className="hm-tile-name">{v.name}</span>
        <span className="hm-tile-line">
          {v.line}
          {v.priceNote ? ` ${v.priceNote[0].toUpperCase()}${v.priceNote.slice(1)}.` : ""}
        </span>
        {children ? <span aria-hidden className="hm-tile-art">{children}</span> : null}
        <span className="hm-tile-go">
          Scopri <ArrowRight aria-hidden className="h-4 w-4" />
        </span>
      </Link>
    </li>
  );
}

export function ModelloC() {
  const by = Object.fromEntries(catalogo().map((v) => [v.id, v])) as Record<string, Voce>;
  return (
    <>
      <ModelloBar current="c" />
      <section aria-labelledby="c-titolo" className="scope-strong hm-c-hero">
        <div className="container-rc hm-c-hero-grid">
          <div className="min-w-0">
            <p className="eyebrow">Cura Privata</p>
            <h1 id="c-titolo" className="hm-c-title mt-5">
              La tua salute.
              <br />
              <span className="hm-c-title-mark">Finalmente chiara.</span>
            </h1>
            <p className="hm-c-lead mt-6">
              Referti spiegati in parole semplici. Medici a casa o in video. Secondi pareri. E tutti i numeri della famiglia, in fila negli anni.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/referti" className="btn btn-primary btn-lg">
                Ho un referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <a href="#c-vetrina" className="btn btn-secondary btn-lg">
                Guarda tutto
              </a>
            </div>
          </div>
          <div aria-hidden className="hm-c-float">
            <MiniReport className="hm-c-f1" />
            <div className="hm-c-f2 scope-light">
              <ExampleTrend name="Glicemia" compact />
            </div>
            <CallCard className="hm-c-f3 scope-light" />
          </div>
        </div>
      </section>

      <section id="c-vetrina" aria-labelledby="c-vetrina-t" className="section">
        <div className="container-rc">
          <div className="hm-c-head">
            <h2 id="c-vetrina-t" className="display-lg">Tutto quello che c&apos;è.</h2>
            <p className="lead">Dal gratuito al medico che viene a casa. Ogni tessera porta al suo servizio.</p>
          </div>
          <ul className="hm-bento mt-10">
            <Tessera v={by.capisci} size="xl">
              <MiniReport />
            </Tessera>
            <Tessera v={by.domicilio} size="tall">
              <HomeVisitVisual />
            </Tessera>
            <Tessera v={by.video} size="sm">
              <CallCard />
            </Tessera>
            <Tessera v={by.parere} size="sm">
              <OpinionSheet />
            </Tessera>
            <Tessera v={by.tempo} size="wide">
              <ExampleTrend name="Emoglobina" compact />
            </Tessera>
            <Tessera v={by.promemoria} size="sm">
              <ExampleReminder questions={3} />
            </Tessera>
            <Tessera v={by.famiglia} size="sm">
              <ExamplePeople />
            </Tessera>
            <Tessera v={by.pdp} size="sm">
              <SheetArt />
            </Tessera>
            <Tessera v={by.visita} size="sm" />
            <Tessera v={by.guide} size="wide" />
          </ul>
        </div>
      </section>

      <section aria-labelledby="fiducia-titolo" className="panel-section scope-strong section bg-petrol">
        <div className="container-rc">
          <Trust />
        </div>
      </section>

      <section aria-labelledby="c-chiusura" className="section-tight">
        <Reveal className="container-rc">
          <div className="hm-c-close">
            <h2 id="c-chiusura" className="display-lg">Comincia da quello che hai in mano.</h2>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/referti" className="btn btn-primary btn-lg">
                Rendi chiaro il mio referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/punto-di-partenza" className="btn btn-secondary btn-lg">
                Parti gratis, senza esami
              </Link>
            </div>
            <Emergenza className="mt-8" />
          </div>
        </Reveal>
      </section>
    </>
  );
}

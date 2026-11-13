import Link from "next/link";
import { ArrowRight, Compass, FileText, Home, Stethoscope } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { Wave } from "@/components/ui/wave";
import { Reveal } from "@/components/ui/reveal";
import { BeforeAfter } from "@/components/offerta/before-after";
import { Trust } from "@/components/offerta/trust";
import { ExampleTrend } from "@/components/famiglia/showcase";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { GRUPPI, ModelloBar, Emergenza, VoceRiga, catalogo, vociDi, type Gruppo } from "./catalogo";

/**
 * MODELLO A · «Sportello»: la home come un buon sportello. Prima la domanda «di che cosa hai bisogno?»,
 * con quattro risposte grandi; poi tutto il catalogo, in quattro colonne ordinate; poi una prova vera; poi la fiducia.
 * Per chi arriva con un bisogno preciso e vuole trovarlo in tre secondi.
 */
const BISOGNI = [
  { icon: FileText, t: "Ho un referto da capire", d: "Lo spieghiamo valore per valore.", href: "/referti", tone: "capisci" },
  { icon: Home, t: "Mi serve un medico", d: "A casa tua o in video, su appuntamento.", href: "/servizi/visita-a-domicilio", tone: "medico" },
  { icon: Stethoscope, t: "Vorrei un secondo parere", d: "Uno specialista legge i tuoi documenti.", href: "/servizi/secondo-parere", tone: "parere" },
  { icon: Compass, t: "Non so da dove partire", d: "Poche domande, gratis, senza account.", href: "/punto-di-partenza", tone: "partenza" },
] as const;

export function ModelloA() {
  const gruppi: Gruppo[] = ["parti", "capisci", "medico", "tempo"];
  const n = catalogo().length;
  return (
    <>
      <ModelloBar current="a" />
      <section aria-labelledby="a-titolo" className="hero hm-a-hero">
        <div className="container-rc hm-a-hero-grid">
          <div className="min-w-0">
            <p className="eyebrow">Cura Privata</p>
            <h1 id="a-titolo" className="promise mt-4">
              Di che cosa hai bisogno <span className="marker">oggi?</span>
            </h1>
            <p className="lead mt-5 max-w-[34rem]">
              Referti spiegati, medici a casa o in video, secondi pareri e la storia della salute di tutta la famiglia. In un posto solo, in parole semplici.
            </p>
            <ul className="hm-a-needs mt-8">
              {BISOGNI.map(({ icon: Icon, t, d, href, tone }) => (
                <li key={t}>
                  <Link href={href} className={`hm-need tone-${tone}`}>
                    <span aria-hidden className="tile-ico tile-ico-tone shrink-0">
                      <Icon />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="hm-need-t">{t}</span>
                      <span className="hm-need-d">{d}</span>
                    </span>
                    <ArrowRight aria-hidden className="h-5 w-5 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {SHOW_ILLUSTRATIVE_PHOTOS ? (
            <figure className="hm-a-photo">
              <Photo photo={ILLUSTRATIVE_PHOTOS.ritratto} sizes="(min-width: 1024px) 40vw, 1px" priority />
              <figcaption className="caption-illus">Immagine illustrativa</figcaption>
            </figure>
          ) : null}
        </div>
        <Wave double className="text-canvas" />
      </section>

      <section aria-labelledby="a-tutto" className="section">
        <div className="container-rc">
          <div className="max-w-3xl">
            <p className="eyebrow">Tutto Cura Privata</p>
            <h2 id="a-tutto" className="display-lg mt-4">
              {n} cose che facciamo, tutte in un posto. Il prezzo lo vedi sempre prima.
            </h2>
          </div>
          <div className="hm-a-cols mt-10">
            {gruppi.map((g) => (
              <div key={g} className="hm-col">
                <h3 className="hm-col-title">{GRUPPI[g].title}</h3>
                <p className="hm-col-line">{GRUPPI[g].line}</p>
                <ul className="hm-rows mt-4">
                  {vociDi(g).map((v) => (
                    <VoceRiga key={v.id} v={v} headingLevel={4} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="a-prova" className="panel-section grain section bg-mist">
        <div className="container-rc hm-a-proof">
          <div className="min-w-0">
            <p className="eyebrow">Una prova, non una promessa</p>
            <h2 id="a-prova" className="display-lg mt-4">Il referto com&apos;è, e lo stesso referto spiegato.</h2>
            <p className="lead mt-4">Sposta il cursore. Poi, referto dopo referto, ogni esame diventa una linea che puoi portare al medico.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/referti/esempio" className="btn btn-primary btn-lg">
                Prova su un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
            </div>
          </div>
          <Reveal className="min-w-0">
            <BeforeAfter />
          </Reveal>
          <Reveal className="hidden min-w-0 lg:block">
            <ExampleTrend name="Creatinina" compact />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="fiducia-titolo" className="panel-section scope-strong section bg-petrol">
        <div className="container-rc">
          <Trust />
        </div>
      </section>

      <section aria-labelledby="a-chiusura" className="section-tight">
        <div className="container-rc text-center">
          <h2 id="a-chiusura" className="display-lg">Non sai che cosa scegliere?</h2>
          <p className="lead mx-auto mt-3 max-w-xl">Tre domande, nessun dato sanitario: ti indichiamo il servizio giusto.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/inizia" className="btn btn-primary btn-lg">
              Ti aiutiamo a scegliere <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
            <Link href="/punto-di-partenza" className="btn btn-secondary btn-lg">
              Parti gratis
            </Link>
          </div>
          <Emergenza className="mx-auto mt-8 justify-center" />
        </div>
      </section>
    </>
  );
}

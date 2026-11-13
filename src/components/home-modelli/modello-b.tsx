import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { Wave } from "@/components/ui/wave";
import { Reveal } from "@/components/ui/reveal";
import { BeforeAfter } from "@/components/offerta/before-after";
import { CallCard, HomeVisitVisual, OpinionSheet } from "@/components/offerta/service-visuals";
import { Trust } from "@/components/offerta/trust";
import { SheetArt } from "@/components/punto-di-partenza/guide";
import { ExamplePeople, ExampleReminder, ExampleTrend } from "@/components/famiglia/showcase";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { Emergenza, ModelloBar, VoceRiga, vociDi } from "./catalogo";

/**
 * MODELLO B · «Racconto»: la home come una storia in quattro capitoli, lungo un filo.
 * Prima di tutto (gratis) → arriva un referto → quando serve una persona → negli anni, per chi ami.
 * Ogni capitolo mostra un pezzo vero di prodotto e i servizi di quel momento, con il prezzo.
 * Per chi non sa ancora che cosa gli serve: si riconosce in un momento della storia.
 */
const CAPITOLI = [
  { n: "1", id: "b-prima", k: "parti", kicker: "Prima di tutto", title: "Capire da dove parti. Gratis.", lead: "Prima degli esami o della visita: poche domande, una scheda ordinata, le cose da chiedere." },
  { n: "2", id: "b-referto", k: "capisci", kicker: "Arriva un referto", title: "Ogni numero, in parole semplici.", lead: "Lo carichi, controlli i valori letti e ricevi un report: che cosa misura ogni esame, dove si trova rispetto all'intervallo stampato, che cosa chiedere." },
  { n: "3", id: "b-medico", k: "medico", kicker: "Quando serve una persona", title: "Un medico, a casa o in video.", lead: "Medici abilitati e identificabili. Prima di pagare vedi chi è, quando arriva e quanto costa." },
  { n: "4", id: "b-tempo", k: "tempo", kicker: "Negli anni, per chi ami", title: "La storia della salute di tutta la famiglia.", lead: "Ogni referto si aggiunge ai precedenti. Una scheda per te e per chi segui, e prima di ogni visita le domande sono già pronte." },
] as const;

function Visual({ k }: { k: (typeof CAPITOLI)[number]["k"] }) {
  if (k === "parti") return <SheetArt className="hm-b-sheet" />;
  if (k === "capisci") return <BeforeAfter />;
  if (k === "medico")
    return (
      <div className="hm-b-medico">
        <HomeVisitVisual />
        <div className="hm-b-medico-side">
          <CallCard />
          <OpinionSheet className="hidden sm:block" />
        </div>
      </div>
    );
  return (
    <div className="hm-b-tempo">
      <ExampleTrend name="Creatinina" compact />
      <div className="hm-b-tempo-side">
        <ExamplePeople />
        <ExampleReminder questions={3} />
      </div>
    </div>
  );
}

export function ModelloB() {
  return (
    <>
      <ModelloBar current="b" />
      <section aria-labelledby="b-titolo" className="hm-b-hero">
        {SHOW_ILLUSTRATIVE_PHOTOS ? (
          <figure className="hm-b-hero-photo">
            <Photo photo={ILLUSTRATIVE_PHOTOS.scrivania} sizes="(min-width: 1024px) 45vw, 100vw" priority />
            <figcaption className="caption-illus">Immagine illustrativa</figcaption>
          </figure>
        ) : null}
        <div className="container-rc hm-b-hero-copy">
          <p className="eyebrow">Cura Privata</p>
          <h1 id="b-titolo" className="promise mt-4">
            Dal primo referto a tutta la <span className="marker">famiglia.</span>
          </h1>
          <p className="lead mt-5 max-w-[32rem]">
            Capire, parlare con un medico, tenere tutto in ordine negli anni. Una sola casa per la salute di chi ami.
          </p>
          <ol className="hm-b-index mt-8" aria-label="I quattro momenti">
            {CAPITOLI.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`}>
                  <span className="hm-b-index-n">{c.n}</span>
                  {c.kicker}
                </a>
              </li>
            ))}
          </ol>
        </div>
        <Wave double className="text-canvas" />
      </section>

      <div className="hm-b-story">
        {CAPITOLI.map((c, i) => (
          <section key={c.id} id={c.id} aria-labelledby={`${c.id}-t`} className={`hm-b-chapter ${i % 2 ? "is-flip" : ""}`}>
            <div className="container-rc hm-b-chapter-grid">
              <div className="hm-b-chapter-copy min-w-0">
                <p className="hm-b-kicker">
                  <span aria-hidden className="hm-b-dot">{c.n}</span>
                  {c.kicker}
                </p>
                <h2 id={`${c.id}-t`} className="display-lg mt-3">{c.title}</h2>
                <p className="lead mt-4">{c.lead}</p>
                <ul className="hm-rows mt-6">
                  {vociDi(c.k).map((v) => (
                    <VoceRiga key={v.id} v={v} />
                  ))}
                </ul>
              </div>
              <Reveal className="hm-b-chapter-visual min-w-0">
                <Visual k={c.k} />
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <section aria-labelledby="fiducia-titolo" className="panel-section scope-strong section bg-petrol">
        <div className="container-rc">
          <Trust />
        </div>
      </section>

      <section aria-labelledby="b-chiusura" className="section-tight">
        <div className="container-rc hm-b-close">
          <h2 id="b-chiusura" className="display-lg">Da dove vuoi cominciare?</h2>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/referti" className="btn btn-primary btn-lg">
              Ho un referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
            <Link href="/punto-di-partenza" className="btn btn-secondary btn-lg">
              Parti gratis, senza esami
            </Link>
          </div>
          <Emergenza className="mt-8" />
        </div>
      </section>
    </>
  );
}

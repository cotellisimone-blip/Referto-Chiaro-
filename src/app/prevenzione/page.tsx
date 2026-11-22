import type { Metadata } from "next";
import Link from "next/link";
import { CategoryBadge } from "@/components/wow/category-art";
import { Activity, ArrowRight, BellRing, ChartLine, FileText, MapPin, SpellCheck, Users } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { PrevenzioneCards } from "@/components/sezioni/prevenzione-cards";
import { MiniPrevenzione, REFERTI_HREF, PercorsoSezioni } from "@/components/sezioni/parts";
import { EXAM_GUIDE_COUNT, GUIDE_CATEGORIES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";
import { PageLd } from "@/components/site/page-ld";

export const metadata: Metadata = {
  title: "I controlli per te: esami di base e screening",
  description: "Gli esami da conoscere, per la tua età: esami di base, screening gratuiti del Servizio sanitario, guide agli esami e promemoria. Gratis, senza registrarti.",
  alternates: { canonical: "/prevenzione" },
};

/**
 * 22/11/2026: passo 2 del percorso, «I controlli per te» (l'indirizzo resta /prevenzione). Gli integratori sono passati
 * al passo 5, il Punto di Partenza è il passo 1. Mai «fai questo esame»: che cosa esiste, che cosa dicono le linee guida
 * per età, e che la scelta la fa il medico.
 *
 * Prima: sezione 1 «Prevenzione» (15/11/2026 sera, Simone: «una sezione dedicata alla medicina preventiva, con esami da fare
 * e integrazione nutraceutica»). Tutto gratuito e senza indicazioni personali: aree da conoscere, guide, integratori
 * (mai dosi), promemoria. Il ponte porta alla sezione 2, quando un referto c'è già.
 */
export default function PrevenzionePage() {
  const pdp = puntoDiPartenzaEnabled();
  const cats = Object.entries(GUIDE_CATEGORIES).map(([id, c]) => ({ id, ...c }));
  return (
    <div className="tm ds">
      <PageLd path="/prevenzione" meta={metadata} name="I controlli per te" />
      <section className="ds-ph ds-ph-1" aria-labelledby="pv-titolo">
        <div className="tm-wrap">
          <PercorsoSezioni current={2} />
        </div>
        <div className="tm-wrap ds-ph-g">
          <div>
            <p className="ds-sec-tag ds-sec-tag-1">
              <span>2</span> I controlli per te
            </p>
            <h1 id="pv-titolo">
              Gli esami da conoscere, <em>per la tua età.</em>
            </h1>
            <p className="tm-lead">Gli esami di base, gli screening gratuiti del Servizio sanitario, che cosa misura ogni esame. Da portare al medico: la scelta la fa lui. Gratis, senza registrarti.</p>
            <div className="tm-ctas">
              <Link href="/prevenzione/esami-di-base" className="tm-btn tm-btn-ink" data-track="cta-prevenzione">
                Gli esami di base
              </Link>
              <Link href="/prevenzione/screening" className="tm-btn tm-btn-line">
                Screening per età
              </Link>
            </div>
            <p className="tm-fine">
              {pdp ? (
                <>
                  Non sai da dove partire? <Link href="/punto-di-partenza">Passo 1: la tua mappa in poche domande</Link>.{" "}
                </>
              ) : null}
              Sono informazioni generali: che cosa fare nel tuo caso lo decide il tuo medico. Per un’urgenza chiama il 112.
            </p>
          </div>
          <div className="ds-ph-art">
            {SHOW_ILLUSTRATIVE_PHOTOS ? (
              <figure className="ds-ph-photo">
                <Photo photo={ILLUSTRATIVE_PHOTOS.ritratto} sizes="(min-width: 821px) 44vw, 100vw" priority />
                <figcaption className="tm-illus">Immagine illustrativa</figcaption>
              </figure>
            ) : null}
            <MiniPrevenzione />
          </div>
        </div>
      </section>

      <section className="ds-sec-light" aria-labelledby="pv-cosa">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Che cosa trovi</p>
              <h2 id="pv-cosa">
                Tre strumenti, <em>tutti gratuiti.</em>
              </h2>
            </div>
            <p>Nessuno ti dice quale esame fare: ti aiutano ad arrivare dal medico con le domande giuste. Se vuoi una prescrizione, c’è il passo 4.</p>
          </div>
          <PrevenzioneCards />
        </div>
      </section>

      <section className="ds-sec-light" aria-labelledby="pv-guide">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Guide agli esami</p>
              <h2 id="pv-guide">
                {EXAM_GUIDE_COUNT} esami, <em>spiegati uno per uno.</em>
              </h2>
            </div>
            <p>Esami del sangue, per immagini, del cuore, endoscopie. E {GLOSSARY.length} parole e sigle del referto, in una riga.</p>
          </div>
          <ul className="ds-cats">
            {cats.map((c) => (
              <li key={c.title}>
                <Link href="/guide" className="wow-catlink">
                  <CategoryBadge id={c.id} size={48} />
                  <span>
                    <b>{c.title}</b>
                    <span>{c.lead}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="ds-sec-end">
            <Link href="/guide" className="tm-btn tm-btn-ink">
              Tutte le guide <ArrowRight aria-hidden className="tm-ic" />
            </Link>
            {/* 22/11/2026: dalla Prevenzione alla sezione «Malattie». */}
            <Link href="/malattie" className="tm-btn tm-btn-line">
              <Activity aria-hidden className="tm-ic" /> Malattie spiegate
            </Link>
            <Link href="/glossario" className="tm-btn tm-btn-line">
              <SpellCheck aria-hidden className="tm-ic" /> Glossario
            </Link>
            <Link href="/strumenti" className="tm-tlink">
              Tutti gli strumenti gratuiti <ArrowRight aria-hidden className="tm-ic" />
            </Link>
          </div>
        </div>
      </section>

      <section className="ds-sec-light ds-sec-alt" aria-labelledby="pv-tempo">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Nel tempo</p>
              <h2 id="pv-tempo">
                I controlli di tutti, <em>al loro posto.</em>
              </h2>
            </div>
            <p>Segna quando rifare un esame, tieni insieme i referti di casa e arriva dal medico con una lista pronta.</p>
          </div>
          <ul className="ds-cards">
            {[
              { href: "/famiglia", icon: BellRing, t: "Promemoria dei controlli", d: "Segna quando rifare un esame, per te e per i tuoi cari: te lo ricordiamo noi." },
              { href: "/famiglia", icon: ChartLine, t: "Nel tempo", d: "Lo stesso esame, referto dopo referto, su un grafico." },
              { href: "/famiglia", icon: Users, t: "Per la famiglia", d: "I controlli dei tuoi cari, ognuno al suo posto." },
              { href: "/vicino-a-te", icon: MapPin, t: "Vicino a te", d: "Medico di famiglia, CUP, screening e guardia medica pubblica." },
            ].map(({ href, icon: I, t, d }) => (
              <li key={t}>
                <Link href={href} className="ds-card ds-card-small">
                  <span className="ds-card-t">
                    <I aria-hidden className="tm-ic" />
                    {t}
                  </span>
                  <span className="ds-card-d">{d}</span>
                  <span className="ds-card-go">
                    Scopri <ArrowRight aria-hidden className="tm-ic" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ds-bridge ds-bridge-pad" aria-labelledby="pv-ponte">
        <div className="tm-wrap">
          <Link href={REFERTI_HREF} className="ds-bridge-a ds-bridge-2">
            <span className="ds-door-ic" aria-hidden>
              <FileText className="tm-ic" />
            </span>
            <span>
              <span className="ds-sec-tag ds-sec-tag-2">
                <span>3</span> Capisci i referti
              </span>
              <span id="pv-ponte" className="ds-bridge-t">
                Hai già fatto gli esami? Leggi il referto in parole semplici.
              </span>
            </span>
            <ArrowRight aria-hidden className="tm-ic ds-bridge-go" />
          </Link>
        </div>
      </section>
    </div>
  );
}

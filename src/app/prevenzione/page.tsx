import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChartLine, FileText, MessageCircleQuestionMark, SpellCheck, Users } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { PrevenzioneCards } from "@/components/sezioni/prevenzione-cards";
import { MiniPrevenzione, REFERTI_HREF } from "@/components/sezioni/parts";
import { GUIDE_CATEGORIES, GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { INTEGRATORI, INTEGRATORI_COLORS, INTEGRATORI_GROUPS } from "@/content/integratori";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

export const metadata: Metadata = {
  title: "Prevenzione: esami da conoscere, guide e integratori",
  description: "La sezione Prevenzione di Cura Privata: il primo controllo gratuito, le guide agli esami e agli integratori, i promemoria dei controlli. Gratis, senza registrarti.",
  alternates: { canonical: "/prevenzione" },
};

/**
 * Sezione 1 «Prevenzione» (15/11/2026 sera, Simone: «una sezione dedicata alla medicina preventiva, con esami da fare
 * e integrazione nutraceutica»). Tutto gratuito e senza indicazioni personali: aree da conoscere, guide, integratori
 * (mai dosi), promemoria. Il ponte porta alla sezione 2, quando un referto c'è già.
 */
export default function PrevenzionePage() {
  const pdp = puntoDiPartenzaEnabled();
  const cats = Object.values(GUIDE_CATEGORIES);
  return (
    <div className="tm ds">
      <section className="ds-ph ds-ph-1" aria-labelledby="pv-titolo">
        <div className="tm-wrap ds-ph-g">
          <div>
            <Link href="/" className="ds-crumb">
              <ArrowLeft aria-hidden className="tm-ic" /> Home
            </Link>
            <p className="ds-sec-tag ds-sec-tag-1">
              <span>1</span> Sezione Prevenzione
            </p>
            <h1 id="pv-titolo">
              La prevenzione, <em>spiegata semplice.</em>
            </h1>
            <p className="tm-lead">Quali aree della salute conoscere, che cosa misurano gli esami, che cosa sapere sugli integratori. Gratis, senza registrarti.</p>
            <div className="tm-ctas">
              {pdp ? (
                <Link href="/punto-di-partenza" className="tm-btn tm-btn-ink" data-track="cta-prevenzione">
                  Fai il primo controllo, gratis
                </Link>
              ) : null}
              <Link href="/guide" className={pdp ? "tm-btn tm-btn-line" : "tm-btn tm-btn-ink"}>
                Guide agli esami
              </Link>
            </div>
            <p className="tm-fine">Sono informazioni generali: che cosa fare nel tuo caso lo decide il tuo medico. Per un’urgenza chiama il 112.</p>
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
                Quattro strumenti, <em>tutti gratuiti.</em>
              </h2>
            </div>
            <p>Nessuno ti dice che cosa prendere o quale esame fare: ti aiutano ad arrivare dal medico con le domande giuste.</p>
          </div>
          <PrevenzioneCards />
        </div>
      </section>

      <section className="ds-sec-light ds-sec-alt" aria-labelledby="pv-int">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Integratori e nutraceutica</p>
              <h2 id="pv-int">
                Integratori: <em>prima capire,</em> poi chiedere.
              </h2>
            </div>
            <p>Che cosa sono, perché se ne parla, quale esame del referto li riguarda e che cosa chiedere al medico. Mai quanto prenderne: quello lo decide lui.</p>
          </div>
          <ul className="ds-ints">
            {INTEGRATORI.map((i) => {
              const [c, d] = INTEGRATORI_COLORS[i.slug] ?? ["#F6B98E", "#A4471F"];
              return (
                <li key={i.slug}>
                  <Link href={`/integratori/${i.slug}`} className="ds-int">
                    <span aria-hidden className="ds-int-cap" style={{ "--c": c, "--d": d } as React.CSSProperties} />
                    <span className="ds-int-g">{INTEGRATORI_GROUPS[i.group]}</span>
                    <span className="ds-int-t">{i.name}</span>
                    <span className="ds-int-d">{i.oneLine}</span>
                    <span className="ds-int-go">
                      Leggi <ArrowRight aria-hidden className="tm-ic" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="ds-sec-light" aria-labelledby="pv-guide">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Guide agli esami</p>
              <h2 id="pv-guide">
                {GUIDES.length} esami, <em>spiegati uno per uno.</em>
              </h2>
            </div>
            <p>Esami del sangue, per immagini, del cuore, endoscopie. E {GLOSSARY.length} parole e sigle del referto, in una riga.</p>
          </div>
          <ul className="ds-cats">
            {cats.map((c) => (
              <li key={c.title}>
                <Link href="/guide">
                  <b>{c.title}</b>
                  <span>{c.lead}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="ds-sec-end">
            <Link href="/guide" className="tm-btn tm-btn-ink">
              Tutte le guide <ArrowRight aria-hidden className="tm-ic" />
            </Link>
            <Link href="/glossario" className="tm-btn tm-btn-line">
              <SpellCheck aria-hidden className="tm-ic" /> Glossario
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
          <ul className="ds-cards ds-cards-3">
            {[
              { href: "/famiglia", icon: ChartLine, t: "Nel tempo", d: "Lo stesso esame, referto dopo referto, su un grafico." },
              { href: "/famiglia", icon: Users, t: "Per la famiglia", d: "I controlli dei tuoi cari, ognuno al suo posto." },
              { href: "/strumenti/domande-per-il-medico", icon: MessageCircleQuestionMark, t: "Domande per il medico", d: "La tua lista, pronta da stampare. Gratis." },
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
                <span>2</span> Sezione Lettura referti
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

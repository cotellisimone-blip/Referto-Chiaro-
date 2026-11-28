import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleAlert, Footprints, Leaf, Moon, NotebookPen, Pill, Waves, Wind } from "lucide-react";
import { Jar } from "@/components/wow/jar";
import { Photo } from "@/components/ui/photo";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { MEDICI_HREF, PercorsoSezioni } from "@/components/sezioni/parts";
import { INTEGRATORI, INTEGRATORI_COLORS, INTEGRATORI_GROUPS } from "@/content/integratori";
import { SONNO_BASE } from "@/content/sonno";
import "@/components/sezioni/tre-momenti.css";
import "@/components/sezioni/sezioni.css";
import { PageLd } from "@/components/site/page-ld";
import { ScaffaleStrip } from "@/components/scaffale/scaffale-strip";

export const metadata: Metadata = {
  title: "Prenditi cura di te: sonno, intestino, integratori",
  description:
    "Che cosa puoi migliorare da oggi: sonno, alimentazione, intestino e microbiota, integratori e probiotici. Percorsi guidati e diari, gratis.",
  alternates: { canonical: "/prenditi-cura-di-te" },
};

type Area = { href: string | null; icon: typeof Moon; k: string; t: string; d: string; art: string[] };
const AREE: Area[] = [
  { href: SONNO_BASE, icon: Moon, k: "Pronto · due settimane", t: "Sonno", d: "Addormentarsi, risvegli, russare: un percorso di due settimane, quattro autovalutazioni e il diario.", art: ["Non mi addormento", "Mi sveglio di notte", "Russo e sono stanco"] },
  { href: "/prevenzione/alimentazione", icon: Leaf, k: "Gratis", t: "Alimentazione", d: "Le basi che valgono per quasi tutti, peso e girovita, le diete più note spiegate.", art: ["Varietà nel piatto", "Meno sale", "Acqua"] },
  { href: "/prevenzione/intestino-e-microbiota", icon: Waves, k: "Gratis", t: "Intestino e microbiota", d: "Che cos’è il microbiota, fibre e cibi fermentati, i probiotici ceppo per ceppo.", art: ["Fibre", "Fermentati", "Probiotici"] },
  { href: "/integratori", icon: Pill, k: "Gratis", t: "Integratori e probiotici", d: `${INTEGRATORI.length} schede: che cosa sono, che cosa dicono gli studi, che cosa chiedere al medico.`, art: ["Vitamina D", "Ferro", "Omega-3"] },
  { href: null, icon: Wind, k: "In preparazione", t: "Stress", d: "Respiro, pause, sonno e movimento: che cosa aiuta, e quando chiedere aiuto.", art: [] },
  { href: null, icon: Footprints, k: "In preparazione", t: "Movimento", d: "Quanto muoversi secondo l’Organizzazione mondiale della sanità, partendo da zero.", art: [] },
];

/**
 * Passo 5 del percorso, «Prenditi cura di te» (22/11/2026, Simone: «la quinta sezione e più importante è un percorso
 * guidato in cui l'utente può fin da subito regolare cose importanti per la propria salute, qualsiasi patologia
 * abbia»). Raccoglie il sonno (prima sotto Malattie), alimentazione, intestino e integratori; stress e movimento sono
 * annunciati. Consigli generali dalle linee guida, mai una terapia; gli integratori senza dosi.
 */
export default function PrendersiCuraPage() {
  return (
    <div className="tm ds">
      <PageLd path="/prenditi-cura-di-te" meta={metadata} name="Prenditi cura di te" />
      <section className="ds-ph ds-ph-1" aria-labelledby="pc-titolo">
        <div className="tm-wrap">
          <PercorsoSezioni current={5} />
        </div>
        <div className="tm-wrap ds-ph-g">
          <div>
            <p className="ds-sec-tag ds-sec-tag-1">
              <span>5</span> Prenditi cura di te
            </p>
            <h1 id="pc-titolo">
              Quello che puoi migliorare, <em>da oggi.</em>
            </h1>
            <p className="tm-lead">Qualunque sia la tua situazione: dormire, mangiare, l’intestino, lo stress, muoverti. Per ogni area le basi, un percorso guidato, un diario e un foglio da portare al medico. Gratis.</p>
            <div className="tm-ctas">
              <Link href={SONNO_BASE} className="tm-btn tm-btn-ink" data-track="cta-cura-sonno">
                Comincia dal sonno <ArrowRight aria-hidden className="tm-ic" />
              </Link>
              <Link href="/integratori" className="tm-btn tm-btn-line">
                Integratori e probiotici
              </Link>
            </div>
            <p className="tm-fine">Consigli generali dalle linee guida, non una terapia per te. Se prendi farmaci, sei in gravidanza o hai una malattia seguita da un medico, decide lui.</p>
          </div>
          <div className="ds-ph-art">
            {SHOW_ILLUSTRATIVE_PHOTOS ? (
              <figure className="ds-ph-photo">
                <Photo photo={ILLUSTRATIVE_PHOTOS.mani} sizes="(min-width: 821px) 44vw, 100vw" priority />
                <figcaption className="tm-illus">Immagine illustrativa</figcaption>
              </figure>
            ) : null}
            <div className="ds-mini ds-mini-1" aria-hidden>
              <p className="ds-mini-k">
                <span className="ds-mini-n">5</span> Il tuo percorso · esempio
              </p>
              <span className="ds-days">
                {Array.from({ length: 14 }, (_, i) => (
                  <i key={i} className={i < 9 ? "on" : i < 11 ? "half" : undefined} />
                ))}
              </span>
              <p className="ds-mini-st ds-mini-st-ok">9 notti su 14 nel diario</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ds-sec-light" aria-labelledby="pc-aree">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Le aree</p>
              <h2 id="pc-aree">
                Scegli da dove partire. <em>Una alla volta.</em>
              </h2>
            </div>
            <p>Si comincia dall’area che senti più vicina. Le altre restano qui, e ognuna rimanda alle altre quando c’entrano.</p>
          </div>
          <ul className="ds-cards ds-cards-3 ds-cura">
            {AREE.map(({ href, icon: Icon, k, t, d, art }) => {
              const body = (
                <>
                  {art.length ? (
                    <span className="ds-card-art" aria-hidden>
                      <span className="ds-art ds-art-pdp">
                        {art.map((x) => (
                          <i key={x}>{x}</i>
                        ))}
                      </span>
                    </span>
                  ) : null}
                  <span className="ds-card-k">{k}</span>
                  <span className="ds-card-t">
                    <Icon aria-hidden className="tm-ic" />
                    {t}
                  </span>
                  <span className="ds-card-d">{d}</span>
                  {href ? (
                    <span className="ds-card-go">
                      Apri <ArrowRight aria-hidden className="tm-ic" />
                    </span>
                  ) : null}
                </>
              );
              return (
                <li key={t}>
                  {href ? (
                    <Link href={href} className="ds-card ds-card-pdp">
                      {body}
                    </Link>
                  ) : (
                    <div className="ds-card ds-card-small ds-card-off">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="ds-sec-light ds-sec-alt" aria-labelledby="pc-come">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Come funziona un percorso</p>
              <h2 id="pc-come">
                Due settimane, <em>un foglio per il medico.</em>
              </h2>
            </div>
            <p>È il modello della sezione sonno, e lo porteremo nelle altre aree.</p>
          </div>
          <ol className="ds-cura-steps">
            <li>
              <b>Un’autovalutazione di due minuti</b>
              <span>Domande scritte da noi, ispirate ai questionari usati dai medici, con le fonti.</span>
            </li>
            <li>
              <b>Due settimane di piccole abitudini e un diario</b>
              <span>Lo scrivi dal telefono in pochi secondi. Le medie le calcoliamo noi.</span>
            </li>
            <li>
              <b>Un foglio di una pagina per il medico</b>
              <span>Da stampare o mostrare dal telefono: il medico legge tutto in un minuto.</span>
            </li>
          </ol>
          <div className="ds-sec-end">
            <Link href={`${SONNO_BASE}/percorso-due-settimane`} className="tm-btn tm-btn-ink">
              Il percorso del sonno <ArrowRight aria-hidden className="tm-ic" />
            </Link>
            <Link href="/diari" className="tm-btn tm-btn-line">
              <NotebookPen aria-hidden className="tm-ic" /> Tutti i diari della salute
            </Link>
          </div>
        </div>
      </section>

      <section className="ds-sec-light" aria-labelledby="pc-int">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Integratori</p>
              <h2 id="pc-int">
                Integratori: <em>prima capire,</em> poi chiedere.
              </h2>
            </div>
            <p>Che cosa sono, perché se ne parla, quale esame del referto li riguarda e che cosa chiedere al medico. Mai quanto prenderne: quello lo decide lui.</p>
          </div>
          <ul className="ds-ints ds-ints-rows">
            {INTEGRATORI.map((i) => {
              const [c, d] = INTEGRATORI_COLORS[i.slug] ?? ["#F6B98E", "#A4471F"];
              return (
                <li key={i.slug}>
                  <Link href={`/integratori/${i.slug}`} className="ds-int">
                    <Jar c={c} d={d} />
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

      <section className="ds-sec-light ds-sec-alt" aria-labelledby="pc-non">
        <div className="tm-wrap">
          <div className="ds-rule">
            <CircleAlert aria-hidden className="tm-ic" />
            <div>
              <h2 id="pc-non">Quando serve il medico, non un percorso</h2>
              <ul>
                <li>Se un disturbo è nuovo, forte o peggiora: parlane prima con il tuo medico.</li>
                <li>Se prendi farmaci, sei in gravidanza o allatti, o hai una malattia seguita da un medico: ogni cambiamento lo decidi con lui.</li>
                <li>Per un’emergenza chiama il 112. Di notte e nei festivi c’è la guardia medica pubblica, gratuita: il 116117 in Lombardia e in molte regioni, altrove il numero della tua ASL.</li>
              </ul>
            </div>
          </div>
          <div className="ds-sec-end">
            <Link href={MEDICI_HREF} className="tm-btn tm-btn-line">
              Passo 4: parla con un medico <ArrowRight aria-hidden className="tm-ic" />
            </Link>
          </div>
        </div>
      </section>

      {/* 22/11/2026 (analisi di chiarezza, punto 28): lo Scaffale in fondo, dopo le spiegazioni e la regola del medico. */}
      <section className="ds-sec-light ds-sec-tight">
        <div className="tm-wrap">
          <ScaffaleStrip />
        </div>
      </section>
    </div>
  );
}

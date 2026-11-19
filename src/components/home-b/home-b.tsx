import type { CSSProperties } from "react";
import Link from "next/link";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { Photo } from "@/components/ui/photo";
import { TrackView } from "@/components/site/track";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { mediciEnabled, secondoParereEnabled } from "@/lib/medici";
import { PRICE_NOTE, firstPromoEnabled, firstRefertoCents, formatEuro, priceCents, publicPricesEnabled, serviceStart } from "@/domain/offerta";
import { PRESTAZIONI, prestazionePrice } from "@/domain/prestazioni/listino";
import { HomeSimboli, Ic } from "./simboli";
import { HomeMoto } from "./moto";
import { readTitolare } from "@/domain/titolare";
import "./home-b.css";

/** Indirizzi delle pagine a cui portano le tessere. */
export const HOME_B_LINKS = {
  fattiConoscere: "/punto-di-partenza",
  esamiDiBase: "/prevenzione/esami-di-base",
  guidaPersonale: "/lettura-referti#guida-personale",
  integratori: "/integratori",
  intestino: "/prevenzione/intestino-e-microbiota",
  alimentazione: "/prevenzione/alimentazione",
  screening: "/prevenzione/screening",
  vicino: "/vicino-a-te",
  neltempo: "/famiglia",
  scaffale: "/scaffale",
} as const;

const v = (o: Record<string, string>) => o as CSSProperties;

/*
 * La home «chiara e scura» (19/11/2026, approvata da Simone: «Sì a questa home»). Una sola pagina, due luci: nasce
 * chiara per tutti e diventa scura con il pulsante della testata, accanto alla lente. Struttura e testi sono quelli
 * delle immagini consegnate il 19/11 (anteprima https://claude.ai/artifact/8YarZdXRaVTkHZE4KSz3yK), con queste
 * differenze volute, dette a Simone:
 * - nessuna scritta sotto i 14 px (la regola del terzo giro, punto 9): etichette e assaggi sono un po' più grandi;
 * - la domanda «Fatti conoscere» elenca le domande vere del Punto di Partenza e dura «3–5 minuti», come la pagina;
 * - la guida personale è «costruita sui tuoi esami»: le risposte del Punto di Partenza non vengono salvate;
 * - lo Scaffale è «In arrivo»: non ci sono ancora partner, e non lo diamo per fatto.
 * I colori delle due luci sono in home-b.css; la luce la decide `data-theme` su <html> (src/lib/prefs-init.ts).
 */
export function HomeB() {
  const titolare = readTitolare();
  const attivo = mediciEnabled();
  const parere = secondoParereEnabled();
  const prices = publicPricesEnabled();
  const promo = firstPromoEnabled() && firstRefertoCents() < priceCents("capisci");
  const entry = formatEuro(promo ? firstRefertoCents() : priceCents("capisci"));
  const carica = serviceStart("capisci");

  return (
    <div className={`hb-home${attivo ? " hb-attivi" : " hb-arrivo"}`} data-medici={attivo ? "attivi" : "arrivo"}>
      <TrackView event="visita-home" />
      <HomeSimboli />
      <HomeMoto />

      {/* 1 · Prima schermata: il sole (o la luna), il titolo, il percorso in quattro passi, il medico */}
      <section className="hb-hero" aria-labelledby="hb-titolo">
        <span className="hb-astro" aria-hidden="true">
          <i style={v({ "--x": "-11%", "--y": "88%", "--s": "2px", "--d": "-1.2s" })} />
          <i style={v({ "--x": "29%", "--y": "115%", "--d": "-2.1s" })} />
          <i style={v({ "--x": "56%", "--y": "127%", "--s": "2px", "--d": "-.6s" })} />
          <i className="hb-solo-pc" style={v({ "--x": "-34%", "--y": "118%", "--s": "2px", "--d": "-2.8s" })} />
        </span>
        <div className="hb-wrap hb-hero-g">
          <div className="hb-hero-t">
            <p className="hb-kicker">Prevenzione e stato di salute</p>
            <h1 id="hb-titolo">
              La tua salute, <em>tutta in una pagina.</em>
            </h1>
            <p className="hb-lead">Capiscila da solo. Fai gli esami del sangue e delle urine, caricali qui e ricevi la tua guida completa: integratori, intestino, alimentazione.</p>
          </div>
          <div className="hb-hero-r">
            <nav className="hb-filo" aria-label="Il percorso, in quattro passi">
              <p className="hb-filo-h">Il percorso, in quattro passi</p>
              <div className="hb-filo-r">
                <svg className="hb-via" viewBox="0 0 400 52" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id="hb-g-via" gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="350" y2="0">
                      <stop offset="0" />
                      <stop offset=".5" />
                      <stop offset="1" />
                    </linearGradient>
                  </defs>
                  <path className="hb-via-l" d="M50 26C83 4 117 4 150 26S217 48 250 26S317 4 350 26" />
                  <path className="hb-via-p" pathLength={100} d="M50 26C83 4 117 4 150 26S217 48 250 26S317 4 350 26" />
                </svg>
                <ol>
                  {(
                    [
                      ["k-pr", "pr", "1", "Fatti conoscere", "3–5 minuti, gratis"],
                      ["k-es", "es", "2", "Fai gli esami", "Sangue e urine"],
                      ["k-re", "re", "3", "Carica il referto", "Spiegato in parole semplici"],
                      ["k-gu", "gu", "4", "Ricevi la tua guida", "Integratori, intestino, alimentazione"],
                    ] as const
                  ).map(([k, ic, n, b, s]) => (
                    <li key={n} className={`hb-${k}`}>
                      <a href={`#passo-${n}`}>
                        <span className="hb-st">
                          <Ic id={ic} />
                        </span>
                        <i>{n}</i>
                        <b>{b}</b>
                        <small>{s}</small>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
            <a className="hb-docq hb-k-me" href="#medico" data-track="home-medico">
              <span className="hb-wi">
                <Ic id="me" />
              </span>
              <span>
                <b>Un medico, in video o a casa tua</b>
                <small>
                  <i className="hb-lamp" />
                  {attivo ? (prices ? `Da ${prestazionePrice("video")} · scegli giorno e ora` : "Scegli giorno e ora") : "In arrivo · lascia la tua email"}
                </small>
              </span>
              <Ic id="go" className="hb-ic hb-go" />
            </a>
          </div>
        </div>
      </section>

      {/* 2 · Il percorso: le quattro tessere, una per passo */}
      <section className="hb-sec" aria-label="Il percorso">
        <div className="hb-wrap">
          <div className="hb-grid hb-g-path">
            <div className="hb-cell hb-c1" id="passo-1">
              <Link className="hb-tile hb-t-wide hb-k-pr" href={HOME_B_LINKS.fattiConoscere} data-track="home-passo-1">
                <span className="hb-num" aria-hidden="true">
                  1
                </span>
                <span className="hb-t-a">
                  <span className="hb-tile-top">
                    <span className="hb-wi">
                      <Ic id="pr" />
                    </span>
                    <span className="hb-kicker">Comincia da qui</span>
                  </span>
                  <h3>Fatti conoscere</h3>
                  <p>Poche domande: quanti anni hai, quali esami hai già fatto, se hai condizioni già seguite da un medico. Ricevi la tua mappa.</p>
                </span>
                <span className="hb-answers" aria-hidden="true">
                  <i>50–64 anni</i>
                  <i>Esami del sangue recenti</i>
                  <i>Non fumo</i>
                  <i>Attività fisica: ogni tanto</i>
                </span>
                <span className="hb-t-end">
                  <span className="hb-btn">
                    Inizia, gratis <Ic id="go" className="hb-ic" />
                  </span>
                  <span className="hb-chips">
                    <span className="hb-chip">3–5 minuti</span>
                    <span className="hb-chip">Senza registrarti</span>
                  </span>
                </span>
              </Link>
              <span className="hb-conn hb-d-down hb-wd-right" style={v({ "--cx": "25%" })} aria-hidden="true">
                <Ic id="go" />
              </span>
            </div>
            <div className="hb-cell hb-c2" id="passo-2">
              <Link className="hb-tile hb-k-es" href={HOME_B_LINKS.esamiDiBase} data-track="home-passo-2">
                <span className="hb-num" aria-hidden="true">
                  2
                </span>
                <span className="hb-wi">
                  <Ic id="es" />
                </span>
                <h3>Fai gli esami di base</h3>
                <p>Sangue e urine, con l’elenco pronto.</p>
                <span className="hb-mini hb-m-list" aria-hidden="true">
                  <i>Emocromo</i>
                  <i>Glicemia</i>
                  <i>Colesterolo</i>
                  <i>Esame urine</i>
                  <i className="hb-w">Creatinina</i>
                  <i className="hb-w">Transaminasi</i>
                </span>
                <span className="hb-chips">
                  <span className="hb-chip hb-hot">Senza ricetta*</span>
                </span>
              </Link>
              <span className="hb-conn hb-d-right hb-wd-right" aria-hidden="true">
                <Ic id="go" />
              </span>
            </div>
            <div className="hb-cell hb-c3" id="passo-3">
              <Link className="hb-tile hb-k-re" href={carica.href} data-track="home-passo-3">
                <span className="hb-num" aria-hidden="true">
                  3
                </span>
                <span className="hb-wi">
                  <Ic id="re" />
                </span>
                <h3>Carica il referto</h3>
                <p>Lo capisci in parole semplici.</p>
                <span className="hb-mini hb-m-doc" aria-hidden="true">
                  <span className="hb-val">
                    <b>TSH</b>
                    <span>2,1 mUI/L</span>
                  </span>
                  <span className="hb-say">È l’ormone che regola la tiroide.</span>
                  <span className="hb-val hb-w">
                    <b>Glicemia</b>
                    <span>92 mg/dL</span>
                  </span>
                  <span className="hb-say hb-w">È lo zucchero nel sangue, a digiuno.</span>
                </span>
                <span className="hb-chips">
                  <span className="hb-chip">{carica.waitlist ? "In arrivo" : prices ? `Da ${entry}` : "Senza abbonamento"}</span>
                </span>
              </Link>
              <span className="hb-conn hb-d-down" aria-hidden="true">
                <Ic id="go" />
              </span>
            </div>
            <div className="hb-cell hb-c4" id="passo-4">
              <Link className="hb-tile hb-t-wide hb-k-gu" href={HOME_B_LINKS.guidaPersonale} data-track="home-passo-4">
                <span className="hb-num" aria-hidden="true">
                  4
                </span>
                <span className="hb-t-a">
                  <span className="hb-tile-top">
                    <span className="hb-wi">
                      <Ic id="gu" />
                    </span>
                    <span className="hb-kicker">Dai tuoi esami</span>
                  </span>
                  <h3>Ricevi la tua guida personale</h3>
                  <p>Una guida completa, costruita sui tuoi esami. Per preparare il tuo piano insieme al medico o al farmacista.</p>
                  <span className="hb-chips">
                    <span className="hb-chip">Novità</span>
                    <span className="hb-chip">Inclusa nel report</span>
                  </span>
                </span>
                <span className="hb-gp">
                  <span className="hb-gp-h">
                    <span>La tua guida</span>
                    <span className="hb-chip">Esempio</span>
                  </span>
                  <span className="hb-gp-r hb-k-in">
                    <span className="hb-wi">
                      <Ic id="in" />
                    </span>
                    <span>
                      <b>Integratori e nutraceutica</b>
                      <small>Ferritina sotto l’intervallo del tuo laboratorio: che cosa chiedere al medico</small>
                    </span>
                  </span>
                  <span className="hb-gp-r hb-k-mi">
                    <span className="hb-wi">
                      <Ic id="mi" />
                    </span>
                    <span>
                      <b>Intestino e microbiota</b>
                      <small>Equilibrio intestinale: fibre, fermentati, probiotici</small>
                    </span>
                  </span>
                  <span className="hb-gp-r hb-k-al">
                    <span className="hb-wi">
                      <Ic id="al" />
                    </span>
                    <span>
                      <b>Alimentazione, peso e forma</b>
                      <small>Colesterolo LDL sopra l’intervallo: che cosa dice la ricerca</small>
                    </span>
                  </span>
                </span>
              </Link>
            </div>
          </div>
          <p className="hb-foot-note">
            <span>* In molti laboratori privati gli esami di base si fanno a pagamento anche senza ricetta. Con la ricetta del tuo medico, molti sono a carico del servizio sanitario.</span>
          </p>
          {/* Il prezzo intero accanto al «Da» della tessera 3: il primo referto e i successivi, con la nota del listino. */}
          {prices ? (
            <p className="hb-foot-note">
              <span>
                Lettura referti: {promo ? `il primo referto ${entry}, poi ${formatEuro(priceCents("capisci"))}` : `${entry} a referto`}. {PRICE_NOTE}
              </span>
            </p>
          ) : null}
        </div>
      </section>

      {/* 3 · Il medico: in video o a casa. Acceso con i medici di Brescia, oppure «In arrivo» con la lista d'attesa. */}
      <section className="hb-doc" id="medico" aria-labelledby="hb-medico-titolo">
        <div className="hb-wrap">
          <div className="hb-doc-p hb-k-me">
            <div className="hb-doc-head">
              <p className="hb-kicker">
                <span className="hb-chip hb-doc-state">{attivo ? "Medici a Brescia" : "In arrivo"}</span>
                <span>Un medico per te</span>
              </p>
              <h2 id="hb-medico-titolo">
                Un medico, <em>in video o a casa tua.</em>
              </h2>
              <p className="hb-lead">Quando vuoi parlarne con una persona. Il medico ha già davanti i tuoi esami e la tua guida.</p>
            </div>
            <div className="hb-doc-opts">
              <div className="hb-doc-o">
                <figure>
                  {SHOW_ILLUSTRATIVE_PHOTOS ? (
                    <>
                      <Photo photo={ILLUSTRATIVE_PHOTOS.ritratto} sizes="(min-width: 900px) 300px, 50vw" style={{ objectPosition: "50% 42%" }} />
                      <figcaption>Immagine illustrativa</figcaption>
                    </>
                  ) : null}
                </figure>
                <div className="hb-in">
                  <span className="hb-wi">
                    <Ic id="video" />
                  </span>
                  <h3>In video</h3>
                  <p>Parli con il medico dal telefono, da dove sei.</p>
                  {attivo ? (
                    <>
                      {prices ? <span className="hb-price">{prestazionePrice("video")}</span> : null}
                      <Link className="hb-btn" href={PRESTAZIONI.video.startHref} data-track="home-prenota-video">
                        Prenota<span className="sr-only"> il videoconsulto</span>
                      </Link>
                    </>
                  ) : null}
                </div>
              </div>
              <div className="hb-doc-o">
                <figure>
                  {SHOW_ILLUSTRATIVE_PHOTOS ? (
                    <>
                      <Photo photo={ILLUSTRATIVE_PHOTOS.hero} sizes="(min-width: 900px) 300px, 50vw" style={{ objectPosition: "38% 30%" }} />
                      <figcaption>Immagine illustrativa</figcaption>
                    </>
                  ) : null}
                </figure>
                <div className="hb-in">
                  <span className="hb-wi">
                    <Ic id="casa" />
                  </span>
                  <h3>A casa tua</h3>
                  <p>Il medico viene da te. Si parte da Brescia città.</p>
                  {attivo ? (
                    <>
                      {prices ? <span className="hb-price">{prestazionePrice("domicilio")}</span> : null}
                      <Link className="hb-btn" href={PRESTAZIONI.domicilio.startHref} data-track="home-prenota-casa">
                        Prenota<span className="sr-only"> la visita a casa</span>
                      </Link>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="hb-doc-how">
              <p className="hb-doc-how-h">{attivo ? "Come funziona" : "Come funzionerà"}</p>
              <ol className="hb-doc-steps">
                <li>Scegli giorno e ora</li>
                <li>Il medico legge prima i tuoi esami</li>
                <li>Ricevi un riepilogo scritto</li>
              </ol>
            </div>
            {attivo ? (
              <p className="hb-doc-chi">
                <Link href="/medici#i-medici">Chi sono i medici: Sara, Elena e Riccardo, medici di medicina generale a Brescia</Link>
              </p>
            ) : (
              <div className="hb-doc-wait" id="avvisami">
                <p>
                  <b>Stiamo scegliendo i medici.</b> Lascia la tua email: ti scriviamo quando parte.
                </p>
                <WaitlistForm interest="domicilio" compact />
              </div>
            )}
            <p className="hb-doc-112">
              Per esigenze non urgenti. Per un’emergenza chiama il 112. Di notte e nei festivi c’è anche la guardia medica pubblica, gratuita: 116117.
              {attivo ? (
                <>
                  {" "}
                  <Link className="hb-doc-more" href={PRESTAZIONI.parere.href}>
                    Ti serve un secondo parere?{parere ? "" : " In arrivo"}
                  </Link>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </section>

      {/* 4 · Da esplorare: i quattro mondi della guida, gratis */}
      <section className="hb-sec" id="esplora" aria-labelledby="hb-esplora-titolo">
        <div className="hb-wrap">
          <div className="hb-sec-h">
            <p className="hb-kicker">Da esplorare, gratis</p>
            <h2 id="hb-esplora-titolo">
              La tua guida ti porta qui. <em>Oppure entra quando vuoi.</em>
            </h2>
          </div>
          <div className="hb-grid hb-g-mondi">
            <Link className="hb-tile hb-k-in" href={HOME_B_LINKS.integratori}>
              <Ic id="in" className="hb-art" />
              <span className="hb-wi">
                <Ic id="in" />
              </span>
              <h3>Integratori e nutraceutica</h3>
              <p>Capire prima di prendere</p>
              <span className="hb-mini hb-w-prove" aria-hidden="true">
                <span className="hb-pv" style={v({ "--w": "92%" })}>
                  <b>Prove solide</b>
                </span>
                <span className="hb-pv" style={v({ "--w": "62%" })}>
                  <b>Prove iniziali</b>
                </span>
                <span className="hb-pv" style={v({ "--w": "34%" })}>
                  <b>Da chiarire</b>
                </span>
              </span>
            </Link>
            <Link className="hb-tile hb-k-mi" href={HOME_B_LINKS.intestino}>
              <Ic id="mi" className="hb-art" />
              <span className="hb-wi">
                <Ic id="mi" />
              </span>
              <h3>Intestino e microbiota</h3>
              <p>Equilibrio intestinale: fibre, fermentati, probiotici</p>
              <span className="hb-mini hb-w-svg hb-w-flora" aria-hidden="true">
                <svg viewBox="0 0 240 62" preserveAspectRatio="xMidYMid slice" focusable="false">
                  <circle className="hb-a hb-fl" cx="70" cy="30" r="13" />
                  <circle className="hb-b" cx="93" cy="16" r="8" />
                  <rect className="hb-b hb-fl2" x="100" y="33" width="34" height="13" rx="6.5" transform="rotate(-16 117 39.5)" />
                  <circle className="hb-a" cx="146" cy="19" r="6.5" />
                  <circle className="hb-a" cx="157" cy="25.5" r="5" />
                  <circle className="hb-a" cx="166" cy="31.5" r="3.8" />
                  <circle className="hb-a" cx="172.5" cy="37" r="2.8" />
                  <circle className="hb-c" cx="180" cy="15" r="7" />
                  <rect className="hb-c hb-fl" x="48" y="46" width="24" height="10" rx="5" transform="rotate(12 60 51)" />
                  <circle className="hb-d" cx="52" cy="13" r="3.5" />
                  <circle className="hb-d" cx="121" cy="13" r="2.6" />
                  <circle className="hb-d" cx="150" cy="49" r="3.2" />
                  <circle className="hb-d" cx="188" cy="50" r="2.4" />
                  <circle className="hb-d" cx="97" cy="54" r="2.4" />
                  <circle className="hb-b" cx="22" cy="24" r="9" />
                  <circle className="hb-c" cx="31" cy="48" r="5" />
                  <circle className="hb-d" cx="8" cy="46" r="3" />
                  <rect className="hb-b" x="200" y="34" width="28" height="11" rx="5.5" transform="rotate(-24 214 39.5)" />
                  <circle className="hb-a" cx="219" cy="14" r="6" />
                  <circle className="hb-d" cx="234" cy="52" r="3" />
                </svg>
              </span>
            </Link>
            <Link className="hb-tile hb-k-al" href={HOME_B_LINKS.alimentazione}>
              <Ic id="al" className="hb-art" />
              <span className="hb-wi">
                <Ic id="al" />
              </span>
              <h3>Alimentazione, peso e forma</h3>
              <p>Diete, proteine e aminoacidi, recupero</p>
              <span className="hb-mini hb-w-piatto" aria-hidden="true">
                <svg viewBox="0 0 42 42" focusable="false">
                  <circle cx="21" cy="21" r="15.9155" strokeDasharray="47 53" />
                  <circle className="hb-p2" cx="21" cy="21" r="15.9155" strokeDasharray="22 78" strokeDashoffset="-50" />
                  <circle className="hb-p3" cx="21" cy="21" r="15.9155" strokeDasharray="22 78" strokeDashoffset="-75" />
                </svg>
                <span className="hb-lg">
                  <i>Verdure</i>
                  <i style={v({ "--o": ".58" })}>Cereali</i>
                  <i style={v({ "--o": ".3" })}>Proteine</i>
                </span>
              </span>
            </Link>
            <Link className="hb-tile hb-k-sc" href={HOME_B_LINKS.screening}>
              <Ic id="sc" className="hb-art" />
              <span className="hb-wi">
                <Ic id="sc" />
              </span>
              <h3>Screening ed esami particolari</h3>
              <p>Quali chiedere al medico, e quando</p>
              <span className="hb-mini hb-w-eta" aria-hidden="true">
                <span className="hb-et-c">
                  <span>Per età</span>
                  <b>50–69 anni</b>
                </span>
                <span className="hb-et">
                  <i>30</i>
                  <i>40</i>
                  <i className="hb-on">50</i>
                  <i className="hb-on">60</i>
                  <i>70</i>
                </span>
              </span>
            </Link>
          </div>
          <p className="hb-foot-note">
            <Ic id="sh" className="hb-ic" />
            <span>
              Presto, in fondo alle pagine, ci sarà <b>lo Scaffale</b>: i prodotti dei partner, sempre segnati come pubblicità.
            </span>
          </p>
        </div>
      </section>

      {/* 5 · Sempre con te: vicino a casa e nel tempo */}
      <section className="hb-sec" id="sempre" aria-labelledby="hb-sempre-titolo">
        <div className="hb-wrap">
          <div className="hb-sec-h">
            <p className="hb-kicker">Sempre con te</p>
            <h2 id="hb-sempre-titolo">
              Vicino a casa, <em>e nel tempo.</em>
            </h2>
          </div>
          <div className="hb-grid hb-g-sempre">
            <Link className="hb-tile hb-k-vi" href={HOME_B_LINKS.vicino}>
              <Ic id="vi" className="hb-art" />
              <span className="hb-wi">
                <Ic id="vi" />
              </span>
              <h3>Vicino a te</h3>
              <p>Medico di famiglia, CUP, screening gratuiti, guardia medica pubblica</p>
              <span className="hb-mini hb-w-svg hb-w-map" aria-hidden="true">
                <svg viewBox="0 0 240 62" preserveAspectRatio="xMidYMid slice" focusable="false">
                  <path className="hb-pk" d="M128 -4h48l10 28-32 12-30-14z" />
                  <path className="hb-rd" d="M-6 22L246 4M-6 52l252-20M62 -6l14 74M118 -6l-6 74M166 -6l22 74M18 -6l8 74M214 -6l14 74" />
                  <path className="hb-rt" d="M70 47C90 45 102 37 114 35s26 2 38-4" />
                  <circle className="hb-tu" cx="70" cy="47" r="4" />
                  <circle className="hb-on" cx="152" cy="31" r="5" />
                  <path className="hb-pin" d="M152 31c-5-6.5-8-10-8-14a8 8 0 0 1 16 0c0 4-3 7.5-8 14z" />
                  <circle className="hb-pc" cx="152" cy="17" r="2.8" />
                </svg>
              </span>
              <span className="hb-chips">
                <span className="hb-chip">Gratis</span>
              </span>
            </Link>
            <Link className="hb-tile hb-k-te" href={HOME_B_LINKS.neltempo}>
              <Ic id="te" className="hb-art" />
              <span className="hb-wi">
                <Ic id="te" />
              </span>
              <h3>Nel tempo</h3>
              <p>I referti in ordine, l’andamento dei valori, i promemoria</p>
              <span className="hb-mini hb-w-svg hb-w-and" aria-hidden="true">
                <svg viewBox="0 0 160 62" preserveAspectRatio="none" focusable="false">
                  <rect className="hb-bn" x="0" y="25" width="160" height="20" />
                  <path className="hb-bl" d="M0 25h160M0 45h160" />
                  <path className="hb-ln" d="M14 16L47 30 80 24 113 38 146 33" />
                  <path className="hb-pt" d="M14 16l.01 0M47 30l.01 0M80 24l.01 0M113 38l.01 0" />
                  <path className="hb-pt hb-ul" d="M146 33l.01 0" />
                  <path className="hb-uc" d="M146 33l.01 0" />
                </svg>
                <i className="hb-tag">Esempio</i>
              </span>
              <span className="hb-chips">
                <span className="hb-chip">Gratis</span>
              </span>
            </Link>
            <Link className="hb-tile hb-k-sh hb-span2" id="scaffale" href={HOME_B_LINKS.scaffale}>
              <span className="hb-wi">
                <Ic id="sh" />
              </span>
              <h3>Lo Scaffale</h3>
              <p>Integratori, probiotici e prodotti per lo sport di aziende partner. Li troverai in fondo alle pagine, sempre segnati come pubblicità.</p>
              <span className="hb-mini hb-w-svg hb-w-scaf" aria-hidden="true">
                <svg viewBox="0 0 300 76" preserveAspectRatio="xMidYMid meet" focusable="false">
                  <g transform="translate(64 2)">
                    <rect className="hb-f2" x="9" y="6" width="18" height="10" rx="2.5" />
                    <rect className="hb-f1" x="3" y="16" width="30" height="44" rx="7" />
                    <rect className="hb-lb" x="8" y="30" width="20" height="14" rx="3" />
                  </g>
                  <g transform="translate(126 2)">
                    <rect className="hb-f2" x="4" y="22" width="40" height="9" rx="3" />
                    <rect className="hb-f1" x="1" y="31" width="46" height="29" rx="8" />
                    <rect className="hb-lb" x="10" y="39" width="28" height="12" rx="3" />
                  </g>
                  <g transform="translate(200 2)">
                    <rect className="hb-f1" x="2" y="14" width="36" height="46" rx="5" />
                    <path className="hb-ln" d="M2 26h36" />
                    <circle className="hb-lb" cx="20" cy="43" r="7" />
                  </g>
                  <rect className="hb-rip" x="34" y="62" width="232" height="5" rx="2.5" />
                </svg>
                <i className="hb-tag">Pubblicità</i>
              </span>
              <span className="hb-chips">
                <span className="hb-chip hb-hot">In arrivo</span>
                <span className="hb-chip">Spazio partner</span>
                <span className="hb-chip">Criteri pubblici</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6 · Perché fidarsi, in quattro righe */}
      <section className="hb-sec hb-sec-trust" aria-label="Perché fidarsi">
        <div className="hb-wrap">
          <div className="hb-trust">
            <div>
              <Ic id="dono" className="hb-ic" />
              <b>Gratis per capire</b>
              <span>Paghi solo quando carichi un referto o chiedi un medico.</span>
            </div>
            <div>
              <Ic id="scudo" className="hb-ic" />
              <b>Mai diagnosi</b>
              <span>Ti aiutiamo ad arrivare dal medico preparato.</span>
            </div>
            <div>
              <Ic id="bilancia" className="hb-ic" />
              <b>Prove dichiarate</b>
              <span>Per ogni argomento ti diciamo quanto è sicuro.</span>
            </div>
            <div>
              <Ic id="lucchetto" className="hb-ic" />
              <b>I tuoi dati restano tuoi</b>
              <span>Li cancelli quando vuoi, con un tocco.</span>
            </div>
          </div>
          {/* Segnaposto voluto da Simone (16/11/2026) finché non dà i dati veri: si vede che manca, non si inventa. */}
          <p className="hb-trust-chi">
            <Link href="/chi-siamo">Chi c’è dietro</Link>
            {titolare ? (
              <span>
                {titolare.name}
                {titolare.address ? ` · ${titolare.address}` : ""} · P.IVA {titolare.vat}
              </span>
            ) : (
              <span className="hb-todo" data-segnaposto="titolare">
                Nome, sede e P.IVA: da completare
              </span>
            )}
          </p>
        </div>
      </section>
    </div>
  );
}

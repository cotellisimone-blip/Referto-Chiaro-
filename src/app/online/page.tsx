import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChartLine, ClipboardList, Home, MessageCircleQuestionMark, SpellCheck, Users } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { DemoReferto } from "@/components/home/demo-referto";
import { OnlineCards } from "@/components/sezioni/online-cards";
import { DOMICILIO_HREF, MiniReferto, StatoDomicilio } from "@/components/sezioni/parts";
import { GUIDE_CATEGORIES, GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { INTEGRATORI, INTEGRATORI_COLORS, INTEGRATORI_GROUPS } from "@/content/integratori";
import { PRICE_NOTE, coreService, firstPromoEnabled, firstRefertoCents, formatEuro, priceCents, publicPricesEnabled } from "@/domain/offerta";
import { mediciEnabled } from "@/lib/medici";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

export const metadata: Metadata = {
  title: "Online: capire referti, esami e integratori",
  description: "La sezione Online di Cura Privata: primo controllo gratuito, referto spiegato in parole semplici, guide agli esami e agli integratori. Da casa, quando vuoi.",
  alternates: { canonical: "/online" },
};

/**
 * Sezione 1 «Online» (15/11/2026): tutto quello che si fa da uno schermo. Apertura chiara (carta e menta), le quattro
 * cose, la prova del referto da toccare, le guide agli integratori, la salute nel tempo e il ponte verso la sezione 2.
 */
export default function OnlinePage() {
  const prices = publicPricesEnabled();
  const promo = firstPromoEnabled() && firstRefertoCents() < priceCents("capisci");
  const std = formatEuro(priceCents("capisci"));
  const first = formatEuro(firstRefertoCents());
  const capisci = coreService("capisci");
  const pdp = puntoDiPartenzaEnabled();
  const attivo = mediciEnabled();
  const cats = Object.values(GUIDE_CATEGORIES);
  return (
    <div className="tm ds">
      <section className="ds-ph ds-ph-1" aria-labelledby="on-titolo">
        <div className="tm-wrap ds-ph-g">
          <div>
            <Link href="/" className="ds-crumb">
              <ArrowLeft aria-hidden className="tm-ic" /> Home
            </Link>
            <p className="ds-sec-tag ds-sec-tag-1">
              <span>1</span> Sezione Online
            </p>
            <h1 id="on-titolo">
              Capire la tua salute, <em>da casa.</em>
            </h1>
            <p className="tm-lead">Dal primo controllo alla lettura del referto, fino alle guide su esami e integratori. Gratis per cominciare, senza abbonamento.</p>
            <div className="tm-ctas">
              <Link href={capisci.href} className="tm-btn tm-btn-ink" data-track="cta-capisci">
                Carica un referto
                {prices ? (
                  <>
                    <span className="tm-sep" aria-hidden /> <span className="tm-lite">{promo ? `il primo ${first}` : std}</span>
                  </>
                ) : null}
              </Link>
              {pdp ? (
                <Link href="/punto-di-partenza" className="tm-btn tm-btn-line">
                  Primo controllo, gratis
                </Link>
              ) : (
                <Link href="/referti/esempio" className="tm-btn tm-btn-line">
                  Guarda un esempio
                </Link>
              )}
            </div>
            <p className="tm-fine">Non è una diagnosi e non sostituisce il tuo medico. Per un’urgenza chiama il 112.</p>
          </div>
          <div className="ds-ph-art">
            {SHOW_ILLUSTRATIVE_PHOTOS ? (
              <figure className="ds-ph-photo">
                <Photo photo={ILLUSTRATIVE_PHOTOS.ritratto} sizes="(min-width: 821px) 44vw, 100vw" priority />
                <figcaption className="tm-illus">Immagine illustrativa</figcaption>
              </figure>
            ) : null}
            <MiniReferto />
          </div>
        </div>
      </section>

      <section className="ds-sec-light" aria-labelledby="on-cosa">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Che cosa trovi</p>
              <h2 id="on-cosa">
                Quattro cose, <em>una più utile dell’altra.</em>
              </h2>
            </div>
            <p>Tre sono gratuite e non chiedono di registrarti. La quarta è il referto spiegato: paghi solo dopo aver controllato i valori.</p>
          </div>
          <OnlineCards />
          {prices ? <p className="tm-note">{PRICE_NOTE}</p> : null}
        </div>
      </section>

      <section className="ds-sec-light ds-sec-alt" aria-labelledby="on-prova">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Il referto spiegato</p>
              <h2 id="on-prova">
                Lo stesso referto, <em>da così a così.</em>
              </h2>
            </div>
            <p>Tocca una riga: accanto la leggi in parole semplici. È un esempio, con dati inventati.</p>
          </div>
          <DemoReferto />
          <ol className="tm-how">
            <li>
              <span className="tm-n">1</span>
              <b>Carichi il referto</b>
              <span className="tm-d">Un PDF o una foto del foglio.</span>
            </li>
            <li>
              <span className="tm-n">2</span>
              <b>Controlli i valori letti</b>
              <span className="tm-d">Li confermi tu, uno per uno.</span>
            </li>
            <li>
              <span className="tm-n">3</span>
              <b>Paghi e leggi il report</b>
              <span className="tm-d">Di norma in pochi minuti.</span>
            </li>
            <li className="tm-how-cta">
              <Link href="/referti/esempio" className="tm-tlink">
                Apri l’esempio completo
              </Link>
            </li>
          </ol>
        </div>
      </section>

      <section className="ds-sec-light" aria-labelledby="on-int">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Nuovo · guide agli integratori</p>
              <h2 id="on-int">
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

      <section className="ds-sec-light ds-sec-alt" aria-labelledby="on-guide">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Guide alla salute</p>
              <h2 id="on-guide">
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

      <section className="ds-sec-light" aria-labelledby="on-tempo">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Anche dopo</p>
              <h2 id="on-tempo">
                I referti di tutti, <em>in fila negli anni.</em>
              </h2>
            </div>
            <p>Quello che carichi resta nel tuo spazio: lo ritrovi, lo confronti con il precedente, lo porti al medico.</p>
          </div>
          <ul className="ds-cards ds-cards-3">
            {[
              { href: "/famiglia", icon: ChartLine, t: "Nel tempo", d: "Lo stesso esame, referto dopo referto, su un grafico." },
              { href: "/famiglia", icon: Users, t: "Per la famiglia", d: "I referti dei tuoi cari, ognuno al suo posto." },
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
          <Link href="/strumenti" className="tm-tlink">
            <ClipboardList aria-hidden className="tm-ic" /> Tutti gli strumenti gratuiti
          </Link>
        </div>
      </section>

      <section className="ds-bridge" aria-labelledby="on-ponte">
        <div className="tm-wrap">
          <Link href={DOMICILIO_HREF} className="ds-bridge-a">
            <span className="ds-door-ic" aria-hidden>
              <Home className="tm-ic" />
            </span>
            <span>
              <span className="ds-sec-tag ds-sec-tag-2">
                <span>2</span> Sezione A domicilio <StatoDomicilio attivo={attivo} dark />
              </span>
              <span id="on-ponte" className="ds-bridge-t">
                Quando serve una persona, il medico viene da te.
              </span>
            </span>
            <ArrowRight aria-hidden className="tm-ic ds-bridge-go" />
          </Link>
        </div>
      </section>
    </div>
  );
}

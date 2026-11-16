import type { Metadata } from "next";
import Link from "next/link";
import { StepScene } from "@/components/wow/scenes";
import { FoglioMedico } from "@/components/wow/foglio";
import { ArrowRight, ChartLine, FileCheck2, MessageCircleQuestionMark, Printer, ShieldCheck, SpellCheck, Stethoscope } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { BeforeAfter } from "@/components/offerta/before-after";
import { MEDICI_HREF, MiniReferto, StatoDomicilio, PercorsoSezioni } from "@/components/sezioni/parts";
import { GLOSSARY } from "@/content/glossario";
import { PRICE_NOTE, coreService, firstPromoEnabled, firstRefertoCents, formatEuro, priceCents, publicPricesEnabled } from "@/domain/offerta";
import { mediciEnabled } from "@/lib/medici";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

export const metadata: Metadata = {
  title: "Lettura referti: il tuo referto in parole semplici",
  description: "La sezione Lettura referti di Cura Privata: carichi il referto, controlli i valori letti e leggi accanto a ogni riga che cosa misura e dove sta il tuo numero. Non è una diagnosi.",
  alternates: { canonical: "/lettura-referti" },
};

/**
 * Sezione 2 «Lettura referti» (15/11/2026 sera, Simone: lettura dei referti e medici separate). Il servizio a pagamento
 * del sito: apertura menta, la prova da toccare, i tre passi, che cosa ricevi, i limiti detti chiaro, e il ponte verso
 * la sezione 3 quando serve un medico.
 */
export default function LetturaRefertiPage() {
  const prices = publicPricesEnabled();
  const promo = firstPromoEnabled() && firstRefertoCents() < priceCents("capisci");
  const std = formatEuro(priceCents("capisci"));
  const first = formatEuro(firstRefertoCents());
  const capisci = coreService("capisci");
  const attivo = mediciEnabled();
  return (
    <div className="tm ds">
      <section className="ds-ph ds-ph-2" aria-labelledby="lr-titolo">
        <div className="tm-wrap">
          <PercorsoSezioni current={2} />
        </div>
        <div className="tm-wrap ds-ph-g">
          <div>
            <p className="ds-sec-tag ds-sec-tag-2">
              <span>2</span> Sezione Lettura referti
            </p>
            <h1 id="lr-titolo">
              Il tuo referto, <em>in parole semplici.</em>
            </h1>
            <p className="tm-lead">Carichi il referto, controlli i valori letti e leggi accanto a ogni riga che cosa misura e dove sta il tuo numero. Di norma in pochi minuti.</p>
            <div className="ds-ph-buy">
              {prices ? (
                <p className="ds-price ds-price-ink">
                  <b>{promo ? first : std}</b>
                  <span>{promo ? `il primo referto, poi ${std}` : "a referto, senza abbonamento"}</span>
                </p>
              ) : null}
              <Link href={capisci.href} className="tm-btn tm-btn-ink" data-track="cta-capisci">
                Carica un referto <ArrowRight aria-hidden className="tm-ic" />
              </Link>
            </div>
            <p className="tm-fine">Non è una diagnosi e non sostituisce il tuo medico. Paghi solo dopo aver controllato i valori.</p>
          </div>
          <div className="ds-ph-art">
            {SHOW_ILLUSTRATIVE_PHOTOS ? (
              <figure className="ds-ph-photo">
                <Photo photo={ILLUSTRATIVE_PHOTOS.hero} sizes="(min-width: 821px) 44vw, 100vw" priority />
                <figcaption className="tm-illus">Immagine illustrativa</figcaption>
              </figure>
            ) : null}
            <MiniReferto />
          </div>
        </div>
      </section>

      <section className="ds-sec-light" aria-labelledby="lr-prova">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Prova adesso</p>
              <h2 id="lr-prova">
                Lo stesso referto, <em>da così a così.</em>
              </h2>
            </div>
            <p>Trascina il cursore con il dito: da una parte il referto com’è, dall’altra lo stesso referto in parole semplici.</p>
          </div>
          <BeforeAfter />
          <ol className="tm-how">
            <li>
              <StepScene n={1} />
              <span className="tm-n">1</span>
              <b>Carichi il referto</b>
              <span className="tm-d">Un PDF o una foto del foglio.</span>
            </li>
            <li>
              <StepScene n={2} />
              <span className="tm-n">2</span>
              <b>Controlli i valori letti</b>
              <span className="tm-d">Li confermi tu, uno per uno.</span>
            </li>
            <li>
              <StepScene n={3} />
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
          {prices ? <p className="tm-note">{PRICE_NOTE}</p> : null}
        </div>
      </section>

      <section className="ds-sec-light ds-sec-alt" aria-labelledby="lr-ricevi">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Che cosa ricevi</p>
              <h2 id="lr-ricevi">
                Un report chiaro, <em>da portare al medico.</em>
              </h2>
            </div>
            <p>Resta nel tuo spazio: lo ritrovi, lo confronti con il referto precedente, lo stampi.</p>
          </div>
          <ul className="ds-cards ds-cards-3">
            {[
              { href: "/referti/esempio", icon: FileCheck2, t: "Riga per riga", d: "Che cosa misura ogni esame e dove sta il tuo numero rispetto all’intervallo stampato." },
              { href: "/strumenti/domande-per-il-medico", icon: MessageCircleQuestionMark, t: "Le domande giuste", d: "Le domande da fare al medico, legate agli esami del tuo referto." },
              { href: "/referti/esempio", icon: Printer, t: "Un foglio per la visita", d: "Un PDF di una pagina, da stampare o mostrare dal telefono." },
              { href: "/famiglia", icon: ChartLine, t: "Nel tempo", d: "Lo stesso esame, referto dopo referto, su un grafico." },
              { href: "/glossario", icon: SpellCheck, t: "Glossario", d: `${GLOSSARY.length} parole e sigle del referto, in una riga. Gratis.` },
              { href: "/sicurezza-e-privacy", icon: ShieldCheck, t: "I tuoi dati", d: "Mai venduti. Li cancelli quando vuoi, un referto o tutto." },
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
          <div className="wow-sheet-wrap mt-14">
            <div>
              <p className="tm-kicker">Il foglio per la visita</p>
              <h3 className="wow-h3">
                Una pagina, <em>da portare al medico.</em>
              </h3>
              <p className="mt-3 text-[1.125rem] text-[var(--t-soft)]">I tuoi numeri, quelli fuori dall’intervallo segnati, e le domande da fare. Da stampare o da mostrare dal telefono.</p>
              <Link href="/referti/esempio" className="tm-tlink mt-4 inline-flex">
                Apri l’esempio completo
              </Link>
            </div>
            <FoglioMedico />
          </div>
        </div>
      </section>

      <section className="ds-sec-light" aria-labelledby="lr-limiti">
        <div className="tm-wrap">
          <div className="ds-rule">
            <ShieldCheck aria-hidden className="tm-ic" />
            <div>
              <h2 id="lr-limiti">Che cosa non fa</h2>
              <ul>
                <li>Non fa diagnosi e non dice che cosa fare: il giudizio spetta al medico.</li>
                <li>La spiegazione la scrive un sistema automatico; i numeri restano quelli del tuo referto, confermati da te.</li>
                <li>Non è per le urgenze: se stai male adesso, chiama il 112.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="ds-bridge" aria-labelledby="lr-ponte">
        <div className="tm-wrap">
          <Link href={MEDICI_HREF} className="ds-bridge-a">
            <span className="ds-door-ic" aria-hidden>
              <Stethoscope className="tm-ic" />
            </span>
            <span>
              <span className="ds-sec-tag ds-sec-tag-3">
                <span>3</span> Sezione Medici <StatoDomicilio attivo={attivo} dark />
              </span>
              <span id="lr-ponte" className="ds-bridge-t">
                Dopo il referto, se serve: un medico in video, a casa o per un secondo parere.
              </span>
            </span>
            <ArrowRight aria-hidden className="tm-ic ds-bridge-go" />
          </Link>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { StepScene } from "@/components/wow/scenes";
import { FoglioMedico } from "@/components/wow/foglio";
import { ArrowRight, Check, ChartLine, FileCheck2, MessageCircleQuestionMark, Printer, ShieldCheck, SpellCheck, Stethoscope } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { BeforeAfter } from "@/components/offerta/before-after";
import { MEDICI_HREF, MiniReferto, StatoDomicilio, PercorsoSezioni } from "@/components/sezioni/parts";
import { GLOSSARY } from "@/content/glossario";
import { PRICE_NOTE, VETRINA_TRY, coreService, firstPromoEnabled, firstRefertoCents, formatEuro, priceCents, publicPricesEnabled, serviceStart } from "@/domain/offerta";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { TrackView } from "@/components/site/track";
import { readFlags } from "@/lib/feature-flags";
import { mediciEnabled } from "@/lib/medici";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";
import { PageLd, capisciServiceLd } from "@/components/site/page-ld";

export const metadata: Metadata = {
  title: "Lettura referti: il tuo referto in parole semplici",
  description: "Carichi il referto, controlli i valori letti e leggi accanto a ogni riga che cosa misura e dove sta il tuo numero. In parole semplici. Non è una diagnosi.",
  alternates: { canonical: "/lettura-referti" },
};

/**
 * Sezione 2 «Lettura referti» (15/11/2026 sera, Simone: lettura dei referti e medici separate). Il servizio a pagamento
 * del sito: apertura menta, la prova da toccare, i tre passi, che cosa ricevi, i limiti detti chiaro, e il ponte verso
 * la sezione 3 quando serve un medico.
 * 17/11/2026 (20 interventi, punto 1): è l'unica pagina del servizio. La vecchia /referti («Capisci il tuo referto»)
 * reindirizza qui e ha portato con sé che cosa include, le domande prima di cominciare, il conteggio delle visite e,
 * nel profilo vetrina, la lista d'attesa. «Carica un referto» porta al caricamento (punto 2), non a un'altra pagina.
 */
export default function LetturaRefertiPage() {
  const prices = publicPricesEnabled();
  const promo = firstPromoEnabled() && firstRefertoCents() < priceCents("capisci");
  const std = formatEuro(priceCents("capisci"));
  const first = formatEuro(firstRefertoCents());
  const capisci = coreService("capisci");
  const attivo = mediciEnabled();
  const vetrina = readFlags().vetrina;
  const start = serviceStart("capisci");
  return (
    <div className="tm ds">
      <PageLd path="/lettura-referti" meta={metadata} name="Lettura referti" service={capisciServiceLd()} />
      <TrackView event="visita-capisci" />
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
              <Link href={start.href} className="tm-btn tm-btn-carica" data-track="cta-capisci">
                {vetrina ? start.label : "Carica un referto"} <ArrowRight aria-hidden className="tm-ic" />
              </Link>
            </div>
            {vetrina ? (
              // Profilo vetrina: il servizio non è aperto. L'azione porta alla lista d'attesa; accanto, la prova senza registrazione.
              <p className="tm-fine" data-testid="vetrina-avviso">
                Il servizio non è ancora aperto: lasciaci la tua email e ti avvisiamo quando parte.{" "}
                <Link href={VETRINA_TRY.capisci.href} className="tm-tlink">
                  {VETRINA_TRY.capisci.label}
                </Link>
              </p>
            ) : null}
            <p className="tm-fine">Non è una diagnosi e non sostituisce il tuo medico. Paghi solo dopo aver controllato i valori.</p>
          </div>
          <div className="ds-ph-art">
            {SHOW_ILLUSTRATIVE_PHOTOS ? (
              <figure className="ds-ph-photo ds-ph-photo-mani">
                <Photo photo={ILLUSTRATIVE_PHOTOS.mani} sizes="(min-width: 821px) 44vw, 100vw" priority />
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

      <section className="ds-sec-light" aria-labelledby="lr-include">
        <div className="tm-wrap ds-incl">
          <div className="ds-incl-card">
            <h2 id="lr-include">Che cosa include</h2>
            <ul>
              {capisci.includes.map((t) => (
                <li key={t}>
                  <Check aria-hidden className="tm-ic" />
                  {t}
                </li>
              ))}
            </ul>
            <p role="note" className="tm-fine">
              <strong>Versione dimostrativa:</strong> provi tutto su documenti inventati, senza addebiti.{" "}
              <Link href="/stato-del-progetto" className="tm-tlink">
                Che cosa manca per il servizio reale
              </Link>
            </p>
          </div>
          <div className="ds-rule">
            <ShieldCheck aria-hidden className="tm-ic" />
            <div>
              <h2 id="lr-limiti">Che cosa non fa</h2>
              <ul>
                <li>Non fa diagnosi e non dice che cosa fare: il giudizio spetta al medico.</li>
                <li>La spiegazione la scrive un sistema automatico; i numeri restano quelli del tuo referto, confermati da te.</li>
                <li>Non è per le urgenze: se stai male adesso, chiama il 112.</li>
                <li>Non legge immagini diagnostiche, referti istologici o genetici.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {vetrina ? (
        <section id="avvisami" className="ds-sec-light ds-sec-alt scroll-mt-24" aria-labelledby="lr-avvisami">
          <div className="tm-wrap max-w-2xl">
            <p className="tm-kicker">Lista d’attesa</p>
            <h2 id="lr-avvisami" className="wow-h3">
              Avvisami <em>quando parte.</em>
            </h2>
            <p className="mb-6 mt-3 text-[1.125rem] text-[var(--t-soft)]">Solo la tua email, per un interesse non vincolante. Non scrivere informazioni sulla tua salute.</p>
            <WaitlistForm interest="completo" />
          </div>
        </section>
      ) : null}

      <section id="domande" className="ds-sec-light ds-sec-alt" aria-labelledby="lr-domande">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Prima di cominciare</p>
              <h2 id="lr-domande">
                Le domande <em>da farsi prima.</em>
              </h2>
            </div>
            <p>
              <Link href="/domande-frequenti" className="tm-tlink">
                Tutte le domande frequenti
              </Link>
            </p>
          </div>
          <FaqList items={FAQ.filter((f) => f.topic === "servizio" || f.topic === "dati").slice(0, 3)} />
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

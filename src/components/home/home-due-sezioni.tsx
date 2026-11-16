import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  MessageCircle,
  Users,
  Ban,
  Eye,
  LockKeyhole,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { MobileHelpBar } from "@/components/site/mobile-help-bar";
import { TrackView } from "@/components/site/track";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { DemoReferto } from "@/components/home/demo-referto";
import { CercaParola, Domande } from "@/components/home/home-client";
import { MediciProva } from "@/components/sezioni/medici";
import { PrevenzioneCards } from "@/components/sezioni/prevenzione-cards";
import { MEDICI_HREF, MiniReferto, MiniVisita, PREVENZIONE_HREF, Porte, REFERTI_HREF, ServiziMedico, StatoDomicilio } from "@/components/sezioni/parts";
import { mediciEnabled } from "@/lib/medici";
import { readTitolare } from "@/domain/titolare";
import { PRICE_NOTE, coreService, firstPromoEnabled, firstRefertoCents, formatEuro, priceCents, publicPricesEnabled } from "@/domain/offerta";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

/*
 * 15/11/2026 sera, Simone: tre sezioni separate. 1 «Prevenzione» (esami da conoscere, guide agli esami e agli
 * integratori, promemoria) · 2 «Lettura referti» (il referto spiegato, con la prova da toccare) · 3 «Medici» (video,
 * casa, secondo parere, medici di prova). L'apertura ha tre porte, una per sezione, e il resto della home le segue
 * nello stesso ordine. Sotto, la versione precedente a due sezioni, per memoria:
 * Home «a due sezioni» (15/11/2026, richiesta di Simone): chi arriva capisce subito che Cura Privata fa due cose.
 * 1 apertura con le due porte · 2 striscia dei fatti · 3 sezione 1 «Online» (primo controllo, referto spiegato con la
 * prova da toccare, guide agli esami e agli integratori) · 4 sezione 2 «A domicilio» (fascia scura: come funziona,
 * medici, prezzi) · 5 le domande giuste · 6 chiusura con «Cerca una parola».
 * La sezione 2 segue l'interruttore dei medici (src/lib/medici.ts): accesi = «Versione di prova» con i medici inventati
 * e il percorso completo; spenti = «In arrivo», senza medici né prezzi, con la lista d'attesa.
 */
export function HomeDueSezioni() {
  const prices = publicPricesEnabled();
  const attivo = mediciEnabled();
  const titolare = readTitolare();
  const promo = firstPromoEnabled() && firstRefertoCents() < priceCents("capisci");
  const std = formatEuro(priceCents("capisci"));
  const first = formatEuro(firstRefertoCents());
  const entry = promo ? first : std;
  const capisci = coreService("capisci");

  return (
    <>
      <div className="tm ds">
        <TrackView event="visita-home" />

        {/* 1 · APERTURA: che cosa fa Cura Privata, in una frase e due porte */}
        <section className="ds-hero" aria-labelledby="hero-titolo">
          <div className="tm-wrap ds-hero-g">
            <div className="ds-hero-copy">
              <p className="tm-kicker">Cura Privata · la tua salute, in tre passi</p>
              <h1 id="hero-titolo">
                Previeni. Capisci. <br />
                <em>Un medico, se serve.</em>
              </h1>
              <p className="tm-lead ds-lead">
                <b>Prevenzione</b>: quali esami conoscere, con guide agli esami e agli integratori. <b>Lettura referti</b>: il tuo referto spiegato in parole
                semplici. <b>Medici</b>: in video, a casa o per un secondo parere.
              </p>
              <p className="tm-fine ds-fine">
                <ShieldCheck aria-hidden className="tm-ic" />
                Non è un servizio di urgenza: per un’emergenza chiama il 112.
              </p>
            </div>
            <div className="ds-hero-doors">
              <Porte attivo={attivo} entry={entry} prices={prices} />
            </div>
            <div className="ds-hero-art">
              {SHOW_ILLUSTRATIVE_PHOTOS ? (
                <figure className="ds-hero-photo">
                  <Photo photo={ILLUSTRATIVE_PHOTOS.hero} sizes="(min-width: 821px) 46vw, 100vw" priority />
                  <figcaption className="tm-illus">Immagine illustrativa</figcaption>
                </figure>
              ) : (
                <div className="ds-hero-photo ds-hero-photo-empty" />
              )}
              <MiniReferto />
              <MiniVisita attivo={attivo} />
            </div>
          </div>
        </section>

        {/* 2 · PERCHÉ FIDARSI (proposta 16/11/2026): chi c'è dietro, come parlarci, che fine fanno i dati, da dove viene quello che scriviamo */}
        <section className="ds-trust" aria-labelledby="trust-titolo">
          <div className="tm-wrap">
            <h2 id="trust-titolo" className="ds-trust-h">Perché fidarsi</h2>
            <ul>
              <li>
                <Link href="/chi-siamo">
                  <Users aria-hidden className="tm-ic" />
                  <b>Chi c’è dietro</b>
                  {titolare ? (
                    <span>
                      {titolare.name}
                      {titolare.address ? ` · ${titolare.address}` : ""} · P.IVA {titolare.vat}
                    </span>
                  ) : (
                    // Segnaposto voluto da Simone (16/11/2026) finché non dà i dati veri: si vede che manca, non si inventa.
                    <span className="ds-todo" data-segnaposto="titolare">
                      Nome, sede e P.IVA: da completare
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/contatti">
                  <MessageCircle aria-hidden className="tm-ic" />
                  <b>Risponde una persona</b>
                  <span>Scrivici: niente risponditori automatici</span>
                </Link>
              </li>
              <li>
                <Link href="/sicurezza-e-privacy">
                  <LockKeyhole aria-hidden className="tm-ic" />
                  <b>Dati mai venduti</b>
                  <span>Li cancelli quando vuoi, con un clic</span>
                </Link>
              </li>
              <li>
                <Link href="/guide">
                  <BookOpen aria-hidden className="tm-ic" />
                  <b>Fonti ufficiali</b>
                  <span>Ogni guida dice da dove viene</span>
                </Link>
              </li>
            </ul>
          </div>
        </section>

        {/* 3 · SEZIONE 1: PREVENZIONE */}
        <section id="prevenzione" className="tm-sec ds-s1" aria-labelledby="s1-titolo">
          <div className="tm-wrap">
            <div className="tm-sec-h">
              <div>
                <p className="ds-sec-tag ds-sec-tag-1">
                  <span>1</span> Prevenzione
                </p>
                <h2 id="s1-titolo">
                  Prima del referto: <br className="tm-d-only" />
                  <em>sapere che cosa controllare.</em>
                </h2>
              </div>
              <p>Quali aree della salute conoscere alla tua età, che cosa misurano gli esami, che cosa sapere sugli integratori. Tutto gratis, senza registrarti.</p>
            </div>
            <PrevenzioneCards />
            <div className="ds-sec-end">
              <Link href="/punto-di-partenza" className="tm-btn tm-btn-ink" data-track="cta-prevenzione">
                Fai il primo controllo, gratis
              </Link>
              <Link href={PREVENZIONE_HREF} className="tm-btn tm-btn-line">
                Tutta la sezione Prevenzione <ArrowRight aria-hidden className="tm-ic" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4 · SEZIONE 2: LETTURA REFERTI */}
        <section id="lettura-referti" className="ds-s2" aria-labelledby="s2-titolo">
          <div className="tm-wrap">
            <div className="tm-sec-h">
              <div>
                <p className="ds-sec-tag ds-sec-tag-2">
                  <span>2</span> Lettura referti
                </p>
                <h2 id="s2-titolo">
                  Il tuo referto, <br className="tm-d-only" />
                  <em>in parole semplici.</em>
                </h2>
              </div>
              <p>
                Carichi il referto, controlli i valori letti e leggi accanto a ogni riga che cosa misura e dove sta il tuo numero.
                {prices ? (promo ? ` Il primo ${first}, poi ${std}.` : ` ${std} a referto.`) : " Senza abbonamento."}
              </p>
            </div>
            <div className="ds-try">
              <div className="ds-try-h">
                <p className="tm-kicker">Prova adesso, con un esempio</p>
                <h3>
                  Tocca una riga del referto: <em>accanto la leggi spiegata.</em>
                </h3>
              </div>
              <DemoReferto />
            </div>
            <div className="ds-sec-end">
              <Link href={capisci.href} className="tm-btn tm-btn-ink" data-track="cta-capisci">
                Carica un referto
                {prices ? (
                  <>
                    <span className="tm-sep" aria-hidden /> <span className="tm-lite">{promo ? `il primo ${first}` : std}</span>
                  </>
                ) : null}
              </Link>
              <Link href={REFERTI_HREF} className="tm-btn tm-btn-line">
                Tutta la sezione Lettura referti <ArrowRight aria-hidden className="tm-ic" />
              </Link>
            </div>
            {prices ? <p className="tm-note">{PRICE_NOTE}</p> : null}
          </div>
        </section>

        {/* 5 · SEZIONE 3: MEDICI */}
        <section id="medici" className="ds-s3" aria-labelledby="s3-titolo">
          <div className="tm-wrap">
            <div className="ds-s3-h">
              <div>
                <p className="ds-sec-tag ds-sec-tag-3">
                  <span>3</span> Medici <StatoDomicilio attivo={attivo} dark />
                </p>
                <h2 id="s3-titolo">
                  Quando serve una persona, <br className="tm-d-only" />
                  <em>un medico.</em>
                </h2>
              </div>
              <p>
                In video, a casa tua o di un familiare (per cominciare a Brescia città), oppure un secondo parere di uno specialista. Per esigenze non urgenti.
                {attivo ? " Qui sotto medici e fasce sono di prova: nessuno verrà davvero." : " Lo stiamo preparando: lascia la tua email e ti avvisiamo."}
              </p>
            </div>

            <ServiziMedico prices={prices} attivo={attivo} dark />

            {attivo ? (
              <>
                <div className="ds-s3-sub">
                  <h3>I medici della tua zona</h3>
                  <p>Profili di prova, con persone inventate. Mai foto: solo nome, iscrizione all’Ordine e che cosa fanno.</p>
                </div>
                <MediciProva compact />
              </>
            ) : (
              <div className="ds-wait">
                <div>
                  <h3>Avvisami quando parte nella mia zona</h3>
                  <p>Email e CAP, nient’altro. Partiamo dalle zone con più richieste.</p>
                </div>
                <WaitlistForm interest="domicilio" compact />
              </div>
            )}

            <div className="ds-sec-end">
              <Link href={MEDICI_HREF} className="tm-btn tm-btn-mint" data-track="cta-medici">
                {attivo ? "Tutta la sezione Medici" : "Scopri come funzionerà"} <ArrowRight aria-hidden className="tm-ic" />
              </Link>
              {attivo ? (
                <Link href="/prova" className="tm-btn ds-btn-ghost">
                  Prova il percorso completo
                </Link>
              ) : null}
            </div>
            <p className="ds-s3-fine">
              <Phone aria-hidden className="tm-ic" />
              Non è un servizio di urgenza. Per le emergenze chiama il 112; per la continuità assistenziale (ex guardia medica) il 116117.
            </p>
          </div>
        </section>

        {/* 6 · LE DOMANDE GIUSTE */}
        <section className="tm-sec" aria-labelledby="domande-titolo">
          <div className="tm-wrap">
            <div className="tm-sec-h">
              <div>
                <p className="tm-kicker">Le domande giuste</p>
                <h2 id="domande-titolo">
                  Non facciamo diagnosi.
                  <br />
                  <em>Facciamo chiarezza.</em>
                </h2>
              </div>
              <p>Sei domande che è giusto farsi prima di affidarci un referto, o di aprire la porta a un medico.</p>
            </div>
            <Domande
              items={[
                {
                  icon: <Ban aria-hidden className="tm-ic" />,
                  q: "La spiegazione del referto è una diagnosi?",
                  a: "No. Ti diciamo che cosa misura ogni esame e dove sta il tuo numero rispetto all’intervallo stampato. Il giudizio spetta al medico.",
                },
                {
                  icon: <Sparkles aria-hidden className="tm-ic" />,
                  q: "Chi scrive la spiegazione?",
                  a: "Un sistema automatico: nessun medico la rivede. I numeri restano quelli del tuo referto, e li confermi tu prima di pagare.",
                },
                {
                  icon: <Stethoscope aria-hidden className="tm-ic" />,
                  q: "Chi viene a casa?",
                  a: "Un medico di medicina generale iscritto all’Ordine: prima di pagare leggi il suo nome e l’orario confermato.",
                },
                {
                  icon: <Eye aria-hidden className="tm-ic" />,
                  q: "Chi vede i miei documenti?",
                  a: "Tu. E soltanto chi scegli tu, quando lo scegli: anche il medico vede solo quello che condividi.",
                },
                {
                  icon: <LockKeyhole aria-hidden className="tm-ic" />,
                  q: "Che fine fanno i miei dati?",
                  a: "Mai venduti, mai usati per la pubblicità. Li puoi cancellare quando vuoi, un referto o tutto il tuo spazio.",
                },
                {
                  icon: <Phone aria-hidden className="tm-ic" />,
                  q: "E se è urgente?",
                  a: "Non siamo il posto giusto. Se stai male adesso, il numero da chiamare è il 112.",
                },
              ]}
            />
            <Link href="/sicurezza-e-privacy" className="tm-tlink">
              Sicurezza e privacy, per esteso <ArrowRight aria-hidden className="tm-ic" />
            </Link>
          </div>
        </section>

        {/* 7 · CHIUSURA */}
        <section className="tm-end ds-end" aria-labelledby="chiusura-titolo">
          <div className="tm-wrap">
            <div className="ds-end-g">
              <h2 id="chiusura-titolo">
                Da dove vuoi <em>cominciare?</em>
              </h2>
              <Porte attivo={attivo} entry={entry} prices={prices} />
            </div>
            <div className="tm-find">
              <h3>
                Hai solo una parola in testa?
                <br />
                <em>Cercala.</em>
              </h3>
              <CercaParola examples={["Emocromo", "Ferritina", "Vitamina D", "Colesterolo LDL", "TSH"]} />
            </div>
          </div>
        </section>
      </div>
      <MobileHelpBar />
    </>
  );
}

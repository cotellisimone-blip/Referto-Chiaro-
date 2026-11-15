import Link from "next/link";
import {
  ArrowRight,
  Ban,
  CalendarCheck,
  ClipboardCheck,
  Eye,
  FileText,
  LockKeyhole,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
} from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { MobileHelpBar } from "@/components/site/mobile-help-bar";
import { TrackView } from "@/components/site/track";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { DemoReferto } from "@/components/home/demo-referto";
import { CercaParola, Domande } from "@/components/home/home-client";
import { MediciProva } from "@/components/sezioni/medici";
import { OnlineCards } from "@/components/sezioni/online-cards";
import { DOMICILIO_HREF, MiniReferto, MiniVisita, ONLINE_HREF, Porte, ServiziMedico, StatoDomicilio } from "@/components/sezioni/parts";
import { mediciEnabled } from "@/lib/medici";
import { GUIDES } from "@/content/guides";
import { INTEGRATORI } from "@/content/integratori";
import { PRICE_NOTE, coreService, firstPromoEnabled, firstRefertoCents, formatEuro, priceCents, publicPricesEnabled } from "@/domain/offerta";
import { prestazionePrice } from "@/domain/prestazioni/listino";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

/*
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
  const promo = firstPromoEnabled() && firstRefertoCents() < priceCents("capisci");
  const std = formatEuro(priceCents("capisci"));
  const first = formatEuro(firstRefertoCents());
  const entry = promo ? first : std;
  const capisci = coreService("capisci");
  const nGuide = GUIDES.length;
  const nInt = INTEGRATORI.length;

  return (
    <>
      <div className="tm ds">
        <TrackView event="visita-home" />

        {/* 1 · APERTURA: che cosa fa Cura Privata, in una frase e due porte */}
        <section className="ds-hero" aria-labelledby="hero-titolo">
          <div className="tm-wrap ds-hero-g">
            <div className="ds-hero-copy">
              <p className="tm-kicker">Cura Privata · online e a domicilio</p>
              <h1 id="hero-titolo">
                Capisci i tuoi esami. <br />
                <em>Il medico viene da te.</em>
              </h1>
              <p className="tm-lead ds-lead">
                Cura Privata fa due cose. <b>Online</b> ti spiega referti, esami e integratori in parole semplici. <b>A domicilio</b> ti manda un medico a casa,
                quando serve.
              </p>
              <Porte attivo={attivo} entry={entry} prices={prices} />
              <p className="tm-fine ds-fine">
                <ShieldCheck aria-hidden className="tm-ic" />
                Non è un servizio di urgenza: per un’emergenza chiama il 112.
              </p>
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

        {/* 2 · FATTI */}
        <section className="tm-strip ds-strip" aria-label="In breve">
          <div className="tm-wrap">
            <ul>
              <li>
                <Sparkles aria-hidden className="tm-ic" />
                <b>Gratis per cominciare</b>
                <span>primo controllo e {nGuide + nInt} guide</span>
              </li>
              <li>
                <FileText aria-hidden className="tm-ic" />
                <b>Referto spiegato</b>
                <span>{prices ? (promo ? `il primo ${first}, poi ${std}` : `${std} a referto`) : "senza abbonamento"}</span>
              </li>
              <li>
                <Stethoscope aria-hidden className="tm-ic" />
                <b>Medico a casa</b>
                <span>{attivo ? (prices ? `${prestazionePrice("domicilio")} prezzo fisso, a Brescia` : "prezzo fisso, a Brescia") : "in arrivo, a Brescia"}</span>
              </li>
              <li>
                <Timer aria-hidden className="tm-ic" />
                <b>Paghi quando sai tutto</b>
                <span>prezzo, orario e nome prima</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 3 · SEZIONE 1: ONLINE */}
        <section id="online" className="tm-sec ds-s1" aria-labelledby="s1-titolo">
          <div className="tm-wrap">
            <div className="tm-sec-h">
              <div>
                <p className="ds-sec-tag ds-sec-tag-1">
                  <span>1</span> Sezione Online
                </p>
                <h2 id="s1-titolo">
                  Da casa, quando vuoi: <br className="tm-d-only" />
                  <em>capire.</em>
                </h2>
              </div>
              <p>Tutto quello che si fa da uno schermo: dal primo controllo alla lettura del referto, fino alle guide su esami e integratori.</p>
            </div>
            <OnlineCards />
            {prices ? <p className="tm-note">{PRICE_NOTE}</p> : null}

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
              <Link href={ONLINE_HREF} className="tm-btn tm-btn-line">
                Tutta la sezione Online <ArrowRight aria-hidden className="tm-ic" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4 · SEZIONE 2: A DOMICILIO */}
        <section id="a-domicilio" className="ds-s2" aria-labelledby="s2-titolo">
          <div className="tm-wrap">
            <div className="ds-s2-h">
              <div>
                <p className="ds-sec-tag ds-sec-tag-2">
                  <span>2</span> Sezione A domicilio <StatoDomicilio attivo={attivo} dark />
                </p>
                <h2 id="s2-titolo">
                  Quando serve una persona, <br className="tm-d-only" />
                  <em>il medico viene da te.</em>
                </h2>
              </div>
              <p>
                Un medico di medicina generale, a casa tua o di un tuo familiare, per esigenze non urgenti. Per cominciare a Brescia città.
                {attivo ? " Qui sotto i medici e le fasce sono di prova: nessuno verrà davvero." : " Lo stiamo preparando: lascia la tua email e ti avvisiamo."}
              </p>
            </div>

            <ol className="ds-steps">
              <li>
                <span className="ds-step-n">1</span>
                <MapPin aria-hidden className="tm-ic" />
                <b>Scrivi il CAP</b>
                <span>Sai subito se arriviamo da te.</span>
              </li>
              <li>
                <span className="ds-step-n">2</span>
                <CalendarCheck aria-hidden className="tm-ic" />
                <b>Scegli una fascia</b>
                <span>Solo orari davvero liberi.</span>
              </li>
              <li>
                <span className="ds-step-n">3</span>
                <ClipboardCheck aria-hidden className="tm-ic" />
                <b>Il medico conferma</b>
                <span>Vedi nome, orario e prezzo. Solo allora paghi.</span>
              </li>
              <li>
                <span className="ds-step-n">4</span>
                <FileText aria-hidden className="tm-ic" />
                <b>Visita e riepilogo</b>
                <span>Circa 45 minuti, poi un riepilogo scritto.</span>
              </li>
            </ol>

            {attivo ? (
              <>
                <div className="ds-s2-sub">
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

            <div className="ds-s2-sub">
              <h3>Con un medico, in tre modi</h3>
            </div>
            <ServiziMedico prices={prices} attivo={attivo} dark />

            <div className="ds-sec-end">
              <Link href={DOMICILIO_HREF} className="tm-btn tm-btn-mint" data-track="cta-domicilio">
                {attivo ? "Verifica se arriviamo da te" : "Scopri come funzionerà"} <ArrowRight aria-hidden className="tm-ic" />
              </Link>
              {attivo ? (
                <Link href="/prova" className="tm-btn ds-btn-ghost">
                  Prova il percorso completo
                </Link>
              ) : null}
            </div>
            <p className="ds-s2-fine">
              <Phone aria-hidden className="tm-ic" />
              Non è un servizio di urgenza. Per le emergenze chiama il 112; per la continuità assistenziale (ex guardia medica) il 116117.
            </p>
          </div>
        </section>

        {/* 5 · LE DOMANDE GIUSTE */}
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

        {/* 6 · CHIUSURA */}
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

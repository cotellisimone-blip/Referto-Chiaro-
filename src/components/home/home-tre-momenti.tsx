import Link from "next/link";
import {
  Archive,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BadgeEuro,
  Ban,
  BellRing,
  BookOpen,
  ChartLine,
  Check,
  ClipboardList,
  Compass,
  Eye,
  ListChecks,
  LockKeyhole,
  MessageCircleQuestionMark,
  Phone,
  Sparkles,
  Timer,
  Trash2,
  Users,
} from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { Photo } from "@/components/ui/photo";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { MobileHelpBar } from "@/components/site/mobile-help-bar";
import { TrackView } from "@/components/site/track";
import { DemoReferto } from "@/components/home/demo-referto";
import { CercaParola, Domande } from "@/components/home/home-client";
import { TrendEsempio } from "@/components/home/trend";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { CON_UN_MEDICO_HREF, mediciEnabled } from "@/lib/medici";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import {
  PRICE_NOTE,
  coreService,
  firstPromoEnabled,
  firstRefertoCents,
  formatEuro,
  priceCents,
  publicPricesEnabled,
} from "@/domain/offerta";
import "@/components/home/tre-momenti.css";

/*
 * Home «I tre momenti» (proposta del 14/11/2026, approvata da Simone per la fase 1). Grafica «Carta»: carta calda,
 * titoli in Fraunces, l'evidenziatore menta solo dove «si fa chiarezza».
 * 1 apertura (foto, foglietto del referto, telefono con il report) · 1b striscia dei fatti · 2 da così a così (il referto
 * che si tocca) · 3 i tre momenti + «Presto anche con un medico» · 4 nel tempo, per tutta la famiglia (fascia scura) ·
 * 5 le domande giuste · 6 chiusura con «Cerca una parola». Prezzi e numeri dal codice (offerta, guide, glossario), mai a mano.
 * I servizi con un medico restano spenti (src/lib/medici.ts): qui solo il riquadro «Presto anche con un medico», senza prezzi.
 */
/** 15/11/2026: sostituita in home da HomeDueSezioni; resta qui, pronta, se si vuole tornare indietro. */
export function HomeTreMomenti() {
  const prices = publicPricesEnabled();
  const promo =
    firstPromoEnabled() && firstRefertoCents() < priceCents("capisci");
  const std = formatEuro(priceCents("capisci"));
  const first = formatEuro(firstRefertoCents());
  const entry = promo ? first : std;
  const capisci = coreService("capisci");
  const pdp = puntoDiPartenzaEnabled();
  const medici = mediciEnabled();
  const nGuide = GUIDES.length;
  const nParole = GLOSSARY.length;

  const ctaPrice = prices
    ? promo
      ? `il primo ${first}`
      : `${std} a referto`
    : null;

  return (
    <>
      <div className="tm">
        <TrackView event="visita-home" />

        {/* 1 · APERTURA */}
        <section className="tm-hero" aria-labelledby="hero-titolo">
          {SHOW_ILLUSTRATIVE_PHOTOS ? (
            <figure className="tm-hero-photo">
              <Photo
                photo={ILLUSTRATIVE_PHOTOS.scrivania}
                sizes="(min-width: 821px) 40vw, 100vw"
                priority
              />
              <figcaption className="tm-illus">
                Immagine illustrativa
              </figcaption>
            </figure>
          ) : null}
          <div className="tm-wrap">
            <div className="tm-hero-copy">
              <p className="tm-kicker">Referti spiegati in parole semplici</p>
              <h1 id="hero-titolo">
                Tutta la salute <br className="tm-d-only" />
                della tua famiglia, <br />
                <em>finalmente chiara.</em>
              </h1>
              <p className="tm-lead">
                I referti di tutti in un posto solo, messi in fila negli anni.<br className="tm-d-only" />
                <span className="tm-d-only">
                  {" "}
                  E prima di ogni visita, le domande giuste per il tuo medico.
                </span>
              </p>
              <div className="tm-ctas">
                <Link
                  href={capisci.href}
                  className="tm-btn tm-btn-ink"
                  data-track="cta-capisci"
                >
                  Carica un referto
                  {ctaPrice ? (
                    <>
                      <span className="tm-sep" aria-hidden />{" "}
                      <span className="tm-lite">{ctaPrice}</span>
                    </>
                  ) : null}
                </Link>
                <Link
                  href="/referti/esempio"
                  className="tm-btn tm-btn-line"
                  data-track="cta-esempio"
                >
                  Guarda un esempio
                </Link>
              </div>
              <p className="tm-fine">
                Non è una diagnosi e non sostituisce il tuo medico.
                <br className="tm-d-only" /> Per un’urgenza chiama il 112.
              </p>
            </div>
          </div>
          {/* Il foglietto «com'è scritto sul referto» e il telefono con il report: un'immagine del prodotto, su dati inventati. */}
          <div className="tm-slip" aria-hidden>
            <p className="tm-slip-k">Com’è scritto sul referto</p>
            <p className="tm-slip-h">
              <span>ESAME</span>
              <span>RIS.</span>
              <span>U.M.</span>
              <span>VAL. RIF.</span>
            </p>
            <p className="tm-slip-r">
              <span>COLESTEROLO LDL</span>
              <span>
                <mark>
                  <b>134 *</b>
                </mark>
              </span>
              <span>mg/dL</span>
              <span>&lt; 115</span>
            </p>
            <span className="tm-slip-a">
              <ArrowDown className="tm-ic" />
            </span>
          </div>
          <div className="tm-hero-phone" aria-hidden>
            <div className="tm-phone">
              <div className="tm-screen">
                <div className="tm-island" />
                <div className="tm-app-top">
                  <LogoMark className="tm-app-logo" />
                  <b>Il tuo report</b>
                  <span className="tm-ex">Esempio</span>
                </div>
                <p className="tm-app-sub">Esami del sangue · 12 marzo 2026</p>
                <p className="tm-app-title">
                  Quattro valori,
                  <br />
                  in parole semplici
                </p>
                <div className="tm-glance">
                  <span className="tm-g-in">
                    <b>3</b>dentro l’intervallo
                  </span>
                  <span className="tm-g-out">
                    <b>1</b>sopra l’intervallo
                  </span>
                </div>
                <div className="tm-pv tm-out">
                  <div className="tm-r">
                    <b>Colesterolo LDL</b>
                    <span>
                      <b>134</b> mg/dL
                    </span>
                  </div>
                  <div
                    className="tm-rb"
                    style={
                      { "--b0": "0%", "--b1": "70%" } as React.CSSProperties
                    }
                  >
                    <i style={{ left: "82%" }} />
                  </div>
                  <p className="tm-st">
                    <ArrowUp className="tm-ic" />
                    Sopra l’intervallo del laboratorio
                  </p>
                </div>
                <div className="tm-pv">
                  <div className="tm-r">
                    <b>Glicemia</b>
                    <span>
                      <b>92</b> mg/dL
                    </span>
                  </div>
                  <div
                    className="tm-rb"
                    style={
                      { "--b0": "24%", "--b1": "76%" } as React.CSSProperties
                    }
                  >
                    <i style={{ left: "64%" }} />
                  </div>
                  <p className="tm-st">
                    <Check className="tm-ic" />
                    Dentro l’intervallo del laboratorio
                  </p>
                </div>
                <p className="tm-more">
                  <span>Altri 2 valori dentro l’intervallo</span>
                  <span>Apri ›</span>
                </p>
                <div className="tm-ask">
                  <p className="tm-k">
                    <MessageCircleQuestionMark className="tm-ic" />
                    Da chiedere al medico
                  </p>
                  <p>
                    «Il colesterolo LDL è sopra l’intervallo stampato: che cosa
                    significa nel mio caso?»
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 1b · LA STRISCIA DEI FATTI */}
        <section className="tm-strip" aria-label="In breve">
          <div className="tm-wrap">
            <ul>
              {prices ? (
                <li>
                  <BadgeEuro aria-hidden className="tm-ic" />
                  <b>
                    {promo ? `Il primo referto ${first}` : `${std} a referto`}
                  </b>
                  <span>
                    {promo
                      ? `poi ${std}, senza abbonamento`
                      : "senza abbonamento"}
                  </span>
                </li>
              ) : null}
              <li>
                <ListChecks aria-hidden className="tm-ic" />
                <b>Prima controlli, poi paghi</b>
                <span>vedi i valori prima di pagare</span>
              </li>
              <li>
                <Timer aria-hidden className="tm-ic" />
                <b>Di norma in pochi minuti</b>
                <span>dal pagamento al report</span>
              </li>
              <li>
                <BookOpen aria-hidden className="tm-ic" />
                <b>Guide e strumenti gratis</b>
                <span>
                  {nGuide} esami e {nParole} parole
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* 2 · DA COSÌ A COSÌ */}
        <section
          id="referto"
          className="tm-sec"
          aria-labelledby="referto-titolo"
        >
          <div className="tm-wrap">
            <div className="tm-sec-h">
              <div>
                <p className="tm-kicker">Guarda come funziona</p>
                <h2 id="referto-titolo">
                  Lo stesso referto, <br className="tm-d-only" />
                  <em>da così a così.</em>
                </h2>
              </div>
              <p>
                Tocca una riga del referto: accanto la leggi in parole semplici.{" "}
                <span className="tm-d-only">
                  Qui è un esempio, con dati inventati.
                </span>
              </p>
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
                <Link
                  href={capisci.href}
                  className="tm-btn tm-btn-ink"
                  data-track="cta-capisci"
                >
                  Carica il tuo referto{" "}
                  <ArrowRight aria-hidden className="tm-ic" />
                </Link>
                <Link href="/referti/esempio" className="tm-tlink">
                  Apri l’esempio completo
                </Link>
              </li>
            </ol>
          </div>
        </section>

        {/* 3 · I TRE MOMENTI */}
        <section
          className="tm-sec tm-sec-line"
          aria-labelledby="momenti-titolo"
        >
          <div className="tm-wrap">
            <div className="tm-sec-h tm-wide">
              <div>
                <p className="tm-kicker">Tutto quello che trovi</p>
                <h2 id="momenti-titolo">
                  Oggi, prima della visita, <br className="tm-d-only" />
                  <em>negli anni.</em>
                </h2>
              </div>
              <p>
                Tre momenti, e per ognuno una cosa chiara. Molto è gratis: si
                paga solo la spiegazione del referto, e il prezzo lo vedi sempre
                prima.
              </p>
            </div>
            <div className="tm-mom">
              <div className="tm-m-col tm-paid">
                <div className="tm-in">
                  <p className="tm-m-n" aria-hidden>
                    1
                  </p>
                  <p className="tm-lab">Quando arriva un referto</p>
                  <h3>{capisci.name}</h3>
                  {prices ? (
                    <p className="tm-m-price">
                      {entry}
                      <small>
                        {promo
                          ? `il primo referto, poi ${std} per referto`
                          : "per referto"}
                      </small>
                    </p>
                  ) : null}
                  <ul className="tm-rows">
                    <li>
                      <Check aria-hidden className="tm-ic" />
                      <div>
                        <b>Ogni valore in parole semplici</b>
                        <span>
                          Con l’intervallo stampato dal tuo laboratorio
                        </span>
                      </div>
                    </li>
                    <li>
                      <Check aria-hidden className="tm-ic" />
                      <div>
                        <b>Le domande per il tuo medico</b>
                        <span>Da 3 a 5, a partire dai tuoi numeri</span>
                      </div>
                    </li>
                    <li>
                      <Check aria-hidden className="tm-ic" />
                      <div>
                        <b>Un foglio per la visita</b>
                        <span>
                          In PDF, da stampare o&nbsp;mostrare dal telefono
                        </span>
                      </div>
                    </li>
                  </ul>
                  <Link
                    href={capisci.href}
                    className="tm-btn tm-btn-ink"
                    data-track="cta-capisci"
                  >
                    Carica un referto{" "}
                    <ArrowRight aria-hidden className="tm-ic" />
                  </Link>
                  <p className="tm-auto">
                    È automatico: nessun medico lo rivede.
                  </p>
                </div>
              </div>
              <div className="tm-m-col">
                <div className="tm-in">
                  <p className="tm-m-n" aria-hidden>
                    2
                  </p>
                  <p className="tm-lab">Prima di una visita</p>
                  <h3>Arrivi preparato</h3>
                  <p className="tm-m-price">
                    Gratis<small>anche senza registrarti</small>
                  </p>
                  <ul className="tm-rows tm-links">
                    <li>
                      <ClipboardList aria-hidden className="tm-ic" />
                      <Link href="/strumenti/preparati-alla-visita">
                        <b>Preparati alla visita</b>
                        <span>Cosa portare e cosa chiedere, in 2 minuti</span>
                      </Link>
                    </li>
                    <li>
                      <MessageCircleQuestionMark
                        aria-hidden
                        className="tm-ic"
                      />
                      <Link href="/strumenti/domande-per-il-medico">
                        <b>Domande per il medico</b>
                        <span>La tua lista, pronta da stampare</span>
                      </Link>
                    </li>
                    {pdp ? (
                      <li>
                        <Compass aria-hidden className="tm-ic" />
                        <Link href="/punto-di-partenza" data-track="cta-pdp">
                          <b>Punto di partenza</b>
                          <span>
                            Non hai esami?{" "}
                            <span className="tm-d-only">
                              10 aree da conoscere e una scheda
                            </span>
                            <span className="tm-m-only">Si parte da qui</span>
                          </span>
                        </Link>
                      </li>
                    ) : null}
                    <li>
                      <BookOpen aria-hidden className="tm-ic" />
                      <Link href="/guide">
                        <b>Guide e glossario</b>
                        <span>
                          {nGuide} esami e {nParole} parole, con le fonti
                          dichiarate
                        </span>
                      </Link>
                    </li>
                  </ul>
                  <Link href="/strumenti" className="tm-tlink">
                    Scegli uno strumento{" "}
                    <ArrowRight aria-hidden className="tm-ic" />
                  </Link>
                </div>
              </div>
              <div className="tm-m-col tm-m3">
                <div className="tm-in">
                  <p className="tm-m-n" aria-hidden>
                    3
                  </p>
                  <p className="tm-lab">Negli anni</p>
                  <h3>Tieni il filo</h3>
                  <p className="tm-m-price">
                    Gratis<small>nel tuo spazio personale</small>
                  </p>
                  <ul className="tm-rows">
                    <li>
                      <Archive aria-hidden className="tm-ic" />
                      <div>
                        <b>Archivio</b>
                        <span>I tuoi referti, ordinati per data</span>
                      </div>
                    </li>
                    <li>
                      <ChartLine aria-hidden className="tm-ic" />
                      <div>
                        <b>Nel tempo</b>
                        <span>I tuoi numeri, esame per esame</span>
                      </div>
                    </li>
                    <li>
                      <BellRing aria-hidden className="tm-ic" />
                      <div>
                        <b>Promemoria</b>
                        <span>Visite e controlli, nel tuo calendario</span>
                      </div>
                    </li>
                    <li className="tm-fam">
                      <Users aria-hidden className="tm-ic" />
                      <div>
                        <b>
                          Famiglia <small>piano in arrivo</small>
                        </b>
                        <span>Una scheda per ogni persona che segui</span>
                      </div>
                    </li>
                  </ul>
                  <Link href="/area-personale" className="tm-tlink">
                    Apri il tuo spazio{" "}
                    <ArrowRight aria-hidden className="tm-ic" />
                  </Link>
                </div>
              </div>
            </div>
            {prices ? <p className="tm-note">{PRICE_NOTE}</p> : null}
            {medici ? null : (
              <aside className="tm-presto" aria-labelledby="presto-titolo">
                <div>
                  <p className="tm-pk">In preparazione</p>
                  <h3 id="presto-titolo">Presto anche con un medico.</h3>
                </div>
                <p>
                  Visita a domicilio, videoconsulto e secondo parere partiranno
                  solo con medici abilitati e identificabili.{" "}
                  <span className="tm-d-only">
                    Lascia la tua email: ti scriviamo quando ci siamo.
                  </span>
                </p>
                <Link
                  href={CON_UN_MEDICO_HREF}
                  className="tm-btn tm-btn-line tm-btn-sm"
                  data-track="cta-presto-medico"
                >
                  Avvisami quando parte
                </Link>
              </aside>
            )}
          </div>
        </section>

        {/* 4 · NEL TEMPO, PER TUTTA LA FAMIGLIA */}
        <section
          id="famiglia"
          className="tm-band"
          aria-labelledby="famiglia-titolo"
        >
          <div className="tm-wrap">
            <div>
              <p className="tm-kicker">Nel tempo, per tutta la famiglia</p>
              <h2 id="famiglia-titolo">
                Un referto si capisce <br className="tm-d-only" />
                una volta.{" "}
                <em>
                  Una storia <br className="tm-d-only" />
                  serve per anni.
                </em>
              </h2>
              <p className="tm-lead">
                Ogni referto si aggiunge ai precedenti, per te e per chi segui.
                Prima della visita, le domande sono già pronte.
              </p>
              <ul className="tm-pillars">
                <li>
                  <span className="tm-p-ic" aria-hidden>
                    <ChartLine className="tm-ic" />
                  </span>
                  <div>
                    <b>I numeri, nel tempo</b>
                    <span>
                      Vedi come si muove ogni esame negli anni, con l’intervallo
                      stampato dal laboratorio accanto.
                    </span>
                  </div>
                </li>
                <li>
                  <span className="tm-p-ic" aria-hidden>
                    <Users className="tm-ic" />
                  </span>
                  <div>
                    <b>Tutta la famiglia, un account</b>
                    <span>
                      Una scheda per te e una per ogni familiare che segui. I
                      dati di ognuno restano separati.
                    </span>
                  </div>
                </li>
                <li>
                  <span className="tm-p-ic" aria-hidden>
                    <BellRing className="tm-ic" />
                  </span>
                  <div>
                    <b>La visita, già preparata</b>
                    <span>
                      Segni la visita e le domande nascono dai numeri. Tre
                      giorni prima ti arriva un’email, senza dettagli sanitari.
                    </span>
                  </div>
                </li>
              </ul>
              <Link
                href="/famiglia"
                className="tm-tlink"
                data-track="cta-famiglia"
              >
                Scopri Nel tempo e Famiglia{" "}
                <ArrowRight aria-hidden className="tm-ic" />
              </Link>
            </div>
            <div className="tm-story" aria-hidden>
              <div className="tm-people">
                <span className="tm-pill">
                  <span className="tm-av">TU</span>
                  <span>
                    Tu<small>5 referti</small>
                  </span>
                </span>
                <span className="tm-pill tm-on">
                  <span className="tm-av tm-av-2">LU</span>
                  <span>
                    Lucia<small>Mamma · 4 referti</small>
                  </span>
                </span>
                <span className="tm-pill">
                  <span className="tm-av tm-av-3">GI</span>
                  <span>
                    Giulio<small>Figlio · 1 referto</small>
                  </span>
                </span>
              </div>
              <div className="tm-trend">
                <div className="tm-trend-h">
                  <h3>Creatinina</h3>
                  <span className="tm-ex">Esempio</span>
                </div>
                <p className="tm-last">
                  <b>0,97</b>
                  <span>mg/dL</span>
                  <i>il 15 settembre 2026</i>
                </p>
                <p className="tm-pos">Sopra l’intervallo stampato</p>
                <TrendEsempio />
                <p className="tm-legend">
                  <span>
                    <i className="tm-lg-band" />
                    Intervallo stampato: 0,50 – 0,90
                  </span>
                  <span>
                    <i className="tm-lg-dot" />
                    Fuori dall’intervallo stampato
                  </span>
                </p>
              </div>
              <div className="tm-rem">
                <div className="tm-rem-d">
                  <small>gio</small>
                  <b>19</b>
                </div>
                <div>
                  <span className="tm-when">
                    <BellRing className="tm-ic" />
                    Tra 6 giorni
                  </span>
                  <b className="tm-t">
                    Visita dal medico di famiglia con la mamma
                  </b>
                  <span className="tm-s">
                    2 domande pronte, con gli ultimi numeri accanto
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5 · LE DOMANDE GIUSTE */}
        <section className="tm-sec" aria-labelledby="domande-titolo">
          <div className="tm-wrap">
            <div className="tm-sec-h">
              <div>
                <p className="tm-kicker">
                  Le domande giuste, prima di caricare
                </p>
                <h2 id="domande-titolo">
                  Non facciamo diagnosi.
                  <br />
                  <em>Facciamo chiarezza.</em>
                </h2>
              </div>
              <p>
                Sei domande che è giusto farsi prima di affidare un referto a
                qualcuno. Rispondiamo senza giri di parole.
              </p>
            </div>
            <Domande
              items={[
                {
                  icon: <Ban aria-hidden className="tm-ic" />,
                  q: "È una diagnosi?",
                  a: "No. Ti diciamo che cosa misura ogni esame e dove sta il tuo numero rispetto all’intervallo stampato. Il giudizio spetta al tuo medico.",
                },
                {
                  icon: <Sparkles aria-hidden className="tm-ic" />,
                  q: "Chi scrive la spiegazione?",
                  a: "Un sistema automatico: nessun medico la rivede. I numeri restano quelli del tuo referto, e li confermi tu prima di pagare.",
                },
                {
                  icon: <Eye aria-hidden className="tm-ic" />,
                  q: "Chi vede i miei documenti?",
                  a: "Tu. E soltanto chi scegli tu, quando lo scegli.",
                },
                {
                  icon: <LockKeyhole aria-hidden className="tm-ic" />,
                  q: "Che fine fanno i miei dati?",
                  a: "Mai venduti, mai usati per la pubblicità. Nelle email non scriviamo mai che cosa c’è nel referto.",
                },
                {
                  icon: <Trash2 aria-hidden className="tm-ic" />,
                  q: "Posso cancellare tutto?",
                  a: "Sì, quando vuoi: un solo referto, oppure tutto il tuo spazio.",
                },
                {
                  icon: <Phone aria-hidden className="tm-ic" />,
                  q: "E se è urgente?",
                  a: "Non siamo il posto giusto. Se stai male adesso, il numero da chiamare è il 112.",
                },
              ]}
            />
            <Link href="/sicurezza-e-privacy" className="tm-tlink">
              Sicurezza e privacy, per esteso{" "}
              <ArrowRight aria-hidden className="tm-ic" />
            </Link>
          </div>
        </section>

        {/* 6 · CHIUSURA */}
        <section className="tm-end" aria-labelledby="chiusura-titolo">
          <div className="tm-wrap">
            <div className="tm-end-g">
              {SHOW_ILLUSTRATIVE_PHOTOS ? (
                <figure>
                  <Photo
                    photo={ILLUSTRATIVE_PHOTOS.mani}
                    sizes="(min-width: 821px) 45vw, 100vw"
                  />
                  <figcaption className="tm-illus">
                    Immagine illustrativa
                  </figcaption>
                </figure>
              ) : null}
              <div>
                <h2 id="chiusura-titolo">
                  Il prossimo referto, <em>lo capisci tu.</em>
                </h2>
                <p className="tm-lead">
                  Lo carichi, controlli i valori, lo leggi in parole semplici.{" "}
                  <br className="tm-d-only" />E dal medico arrivi con le domande
                  giuste.
                </p>
                <div className="tm-ctas">
                  <Link
                    href={capisci.href}
                    className="tm-btn tm-btn-ink"
                    data-track="cta-capisci"
                  >
                    Carica un referto
                    {ctaPrice ? (
                      <>
                        <span className="tm-sep" aria-hidden />{" "}
                        <span className="tm-lite">{ctaPrice}</span>
                      </>
                    ) : null}
                  </Link>
                  <Link href="/referti/esempio" className="tm-btn tm-btn-line">
                    Guarda un esempio
                  </Link>
                </div>
              </div>
            </div>
            <div className="tm-find">
              <h3>
                Non hai un referto adesso?
                <br />
                <em>Cerca una parola.</em>
              </h3>
              <CercaParola
                examples={[
                  "Emocromo",
                  "Ferritina",
                  "TSH",
                  "Colesterolo LDL",
                  "Creatinina",
                ]}
              />
            </div>
          </div>
        </section>
      </div>
      <MobileHelpBar />
    </>
  );
}

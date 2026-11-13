import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, Check, CircleDashed, ClipboardCheck, Clock3, FileText, Gift, Home, Pill, Signpost, UserRound, X } from "lucide-react";
import { TrackView } from "@/components/site/track";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { cancelTerms } from "@/domain/prestazioni/engine";
import { FaqList } from "@/components/ui/faq-list";
import { Wave } from "@/components/ui/wave";
import { CoverageCheck } from "@/components/prestazioni/public";
import { EmergencyNumbers } from "@/components/prestazioni/ui";
import { HomeVisitVisual } from "@/components/offerta/service-visuals";
import { OtherServices } from "@/components/offerta/other-services";
import { PRESTAZIONI, prestazionePrice } from "@/domain/prestazioni/listino";
import { PRICE_NOTE, isVetrina, publicPricesEnabled } from "@/domain/offerta";

export const metadata: Metadata = {
  title: "Visita a domicilio con medico generalista",
  description: "Un medico di medicina generale a casa tua o di un familiare, per esigenze non urgenti. Brescia città come area pilota, prezzo fisso, fasce davvero disponibili.",
  alternates: { canonical: "/servizi/visita-a-domicilio" },
};

const FACTS = [
  { icon: Clock3, label: "Tempi", text: "Scegli tu tra le fasce libere. La visita dura circa 45 minuti." },
  { icon: UserRound, label: "Chi viene", text: "Un medico di medicina generale, abilitato e identificabile: leggi il suo nome prima di pagare." },
  { icon: Gift, label: "Che cosa ti resta", text: "Un riepilogo scritto della visita, con il prossimo passo indicato dal medico." },
];

const STEPS = [
  { icon: Home, title: "Verifichi comune e CAP", text: "Sai subito se arriviamo da te e quali fasce sono libere." },
  { icon: CalendarClock, title: "Scegli una fascia", text: "È una richiesta: il medico la conferma o te ne propone un'altra." },
  { icon: ClipboardCheck, title: "Confermi quando sai tutto", text: "Nome del medico, orario, indirizzo e prezzo totale: li vedi prima di pagare." },
];

const NOT_FOR = [
  "Emergenze: chiama il 112",
  "Continuità assistenziale pubblica (ex guardia medica): chiama il 116117 negli orari previsti",
  "Certificati di malattia, ricette del Servizio sanitario o visite specialistiche",
];

/** Ciclo 4: che cosa resta in mano dopo la visita. La prescrizione è una decisione del medico, mai una promessa. */
const AFTER = [
  { icon: FileText, title: "Un riepilogo scritto", text: "Che cosa ha controllato il medico e che cosa ti ha indicato. Lo ritrovi nella tua richiesta e lo puoi stampare." },
  { icon: Signpost, title: "Il prossimo passo", text: "Una riga chiara: nessun altro passo, il tuo medico di famiglia, esami, uno specialista o un controllo." },
  { icon: Pill, title: "Se serve, una prescrizione", text: "Dopo averti visitato il medico può lasciarti una prescrizione su ricetta bianca, se la ritiene necessaria. I farmaci su ricetta bianca sono a tuo carico." },
];

const FAQ_DOMICILIO = [
  { q: "Per chi è la visita a domicilio?", a: "Per chi ha un'esigenza non urgente e preferisce, o ha bisogno, di essere visitato a casa: per sé o per un familiare. La valutazione clinica è sempre del medico, che decide se serve altro." },
  { q: "Dove arrivate?", a: "Partiamo da Brescia città come area pilota. Inserisci comune e CAP: se non siamo ancora nella tua zona te lo diciamo subito e ti proponiamo un videoconsulto." },
  { q: "Quanto costa e quando pago?", a: "Il prezzo è fisso e comprende lo spostamento nell'area coperta. Non paghi nulla quando invii la richiesta: paghi solo dopo che il medico ha confermato l'orario e hai visto nome, orario, indirizzo e importo." },
  { q: "Posso annullare?", a: `Sì. Prima della conferma non c'è alcun addebito. Dopo la conferma: ${cancelTerms("domicilio").charAt(0).toLowerCase()}${cancelTerms("domicilio").slice(1)}` },
  { q: "Il medico può prescrivere farmaci?", a: "Decide il medico dopo averti visitato: se lo ritiene necessario può lasciarti una prescrizione su ricetta bianca, con i farmaci a tuo carico. Non rilascia certificati di malattia né ricette del Servizio sanitario: per quelli resta il tuo medico di famiglia." },
  { q: "Che cosa mi resta dopo la visita?", a: "Un riepilogo scritto nella tua richiesta, con il prossimo passo indicato dal medico. Lo puoi stampare o mostrare al tuo medico di famiglia." },
  { q: "E se ho bisogno subito?", a: "Questo non è un servizio di urgenza. Per le emergenze sanitarie chiama il 112. Per la continuità assistenziale pubblica chiama il 116117 negli orari previsti." },
];

/**
 * Visita a domicilio, grafica «Luce»: stessa ossatura delle altre pagine servizio (apertura con la tinta calda,
 * fatti in breve a cavallo dell'onda, passi sul filo, include/esclude), più la verifica di comune e CAP.
 */
export default function VisitaADomicilioPage() {
  const info = PRESTAZIONI.domicilio;
  const prices = publicPricesEnabled();
  const vetrina = isVetrina();
  return (
    <div className="tone-medico">
      <TrackView event="visita-domicilio" />

      {/* APERTURA */}
      <section aria-labelledby="dom-titolo" className="svc-hero">
        <div className="container-rc svc-hero-grid">
          <div>
            <p className="eyebrow tone-text">Novità · Brescia città</p>
            <h1 id="dom-titolo" className="page-title mt-4">
              Il medico a casa tua.
            </h1>
            <p className="lead mt-5 max-w-[36rem]">Un medico di medicina generale ti visita a casa, per esigenze non urgenti: per te o per un familiare. Scegli tra le fasce davvero libere.</p>
            <div className="svc-buy">
              {prices ? (
                <p className="price-tag">
                  <span className="stat-num block text-[2.75rem] leading-none text-ink">{prestazionePrice("domicilio")}</span>
                  <span className="mt-1 block text-[0.9375rem] text-muted">prezzo fisso, {info.durationLabel}</span>
                </p>
              ) : null}
              <Link href={info.startHref} data-track="cta-domicilio" className="btn btn-primary btn-lg">
                {vetrina ? "Provala nella demo" : "Richiedi la visita"} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
            </div>
            <p className="mt-4">
              <a href="#copertura" className="link inline-flex min-h-11 items-center text-lg font-semibold">
                Arriviamo da te? Verifica il CAP
              </a>
            </p>
          </div>
          <HomeVisitVisual />
        </div>
        <Wave className="text-canvas" />
      </section>

      {/* IN BREVE */}
      <section aria-label="In breve">
        <div className="container-rc">
          <div className="svc-facts">
            <dl className="svc-facts-grid">
              {FACTS.map(({ icon: Icon, label, text }) => (
                <div key={label} className="svc-fact">
                  <dt>
                    <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone">
                      <Icon />
                    </span>
                    {label}
                  </dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
            <p role="note" className="svc-note">
              <CircleDashed aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
              <span>
                <strong className="text-ink">Versione dimostrativa:</strong> medici, fasce e pagamenti sono simulati, senza addebiti.{" "}
                <Link href="/stato-del-progetto" className="link font-semibold">
                  Che cosa manca per il servizio reale
                </Link>
              </span>
            </p>
          </div>
          {prices ? <p className="mt-3 px-1 text-[0.9375rem] text-muted">{PRICE_NOTE}</p> : null}
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section aria-labelledby="come-titolo" className="section">
        <div className="container-rc">
          <h2 id="come-titolo" className="display-lg">
            Come funziona, in tre passi.
          </h2>
          <ol className="steps mt-7 sm:mt-12">
            {STEPS.map((st, i) => (
              <li key={st.title} className="step">
                <span aria-hidden className="step-num">
                  {i + 1}
                </span>
                <div>
                  <h3 className="step-title">
                    <span className="sr-only">Passo {i + 1}: </span>
                    {st.title}
                  </h3>
                  <p className="step-text">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-4 sm:mt-16 lg:grid-cols-[1.35fr_0.85fr] lg:gap-6">
            <div className="incl-card">
              <h2 className="box-title">Che cosa include</h2>
              <ul className="check-list">
                {info.includes.map((t) => (
                  <li key={t}>
                    <span aria-hidden className="check-dot">
                      <Check />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="excl-card">
              <h2 id="nonper-titolo" className="box-title">
                Quando non è la strada giusta
              </h2>
              <ul className="check-list text-ink-soft">
                {NOT_FOR.map((t) => (
                  <li key={t}>
                    <span aria-hidden className="cross-dot">
                      <X />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DOVE ARRIVIAMO: la verifica di comune e CAP */}
      <section id="copertura" aria-labelledby="copertura-titolo" className="panel-section section scroll-mt-24 bg-tone-soft">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
          <div>
            <p className="eyebrow tone-text">Area pilota</p>
            <h2 id="copertura-titolo" className="display-lg mt-3">
              Dove arriviamo
            </h2>
            <p className="lead mt-4">Per ora a Brescia città. Allarghiamo la zona solo quando abbiamo abbastanza medici per garantire le fasce che mostriamo.</p>
          </div>
          <div className="grid gap-4">
            <CoverageCheck />
            <EmergencyNumbers />
          </div>
        </div>
      </section>

      {/* DOPO LA VISITA */}
      <section aria-labelledby="dopo-titolo" className="section">
        <div className="container-rc">
          <h2 id="dopo-titolo" className="display-lg">
            Che cosa ti resta dopo la visita
          </h2>
          <ul className="mt-7 grid gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3">
            {AFTER.map(({ icon: Icon, title, text }) => (
              <li key={title} className="tile-card">
                <span aria-hidden className="tile-ico tile-ico-tone">
                  <Icon />
                </span>
                <div>
                  <h3 className="tile-card-title">{title}</h3>
                  <p className="tile-card-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {vetrina ? (
        <section id="avvisami" aria-labelledby="avvisami-titolo" className="panel-section section scroll-mt-24 bg-mist">
          <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div>
              <p className="eyebrow">Lista d&apos;attesa</p>
              <h2 id="avvisami-titolo" className="display-lg mt-3">
                Avvisami quando parte nella mia zona
              </h2>
              <p className="lead mt-4">Il servizio non è ancora attivo. Lascia email e CAP: partiamo dalle zone in cui c&apos;è più richiesta.</p>
            </div>
            <WaitlistForm interest="domicilio" />
          </div>
        </section>
      ) : null}

      {/* DOMANDE */}
      <section aria-labelledby="faq-dom-titolo" className="section">
        <div className="container-rc">
          <h2 id="faq-dom-titolo" className="display-md">
            Domande sulla visita a domicilio
          </h2>
          <div className="mt-5 sm:mt-8">
            <FaqList items={FAQ_DOMICILIO} />
          </div>
        </div>
      </section>

      <OtherServices exclude="domicilio" />
    </div>
  );
}

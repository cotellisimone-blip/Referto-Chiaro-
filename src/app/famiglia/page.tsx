import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Check,
  CircleDashed,
  LineChart,
  Phone,
  Users,
  X,
} from "lucide-react";
import { TrackView } from "@/components/site/track";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { FaqList } from "@/components/ui/faq-list";
import { Wave } from "@/components/ui/wave";
import {
  ExamplePeople,
  ExampleReminder,
  ExampleTrend,
  exampleQuestion,
} from "@/components/famiglia/showcase";
import {
  SPAZIO_GRATUITO,
  famigliaIncludes,
  famigliaPrice,
} from "@/domain/famiglia/piano";
import { publicPricesEnabled } from "@/domain/offerta";

export const metadata: Metadata = {
  title: "Famiglia: la salute di tutti, nel tempo",
  description:
    "I referti di tutta la famiglia in un posto solo: i numeri messi in fila negli anni, una scheda per ogni familiare, promemoria e il foglio per ogni visita. Senza diagnosi.",
  alternates: { canonical: "/famiglia" },
};

const PILLARS = [
  {
    icon: LineChart,
    title: "I numeri, nel tempo",
    text: "Ogni referto si aggiunge ai precedenti. Vedi come si muove ogni esame negli anni, con l'intervallo stampato dal laboratorio accanto. Più referti aggiungi, più la storia diventa utile al medico.",
  },
  {
    icon: Users,
    title: "Tutta la famiglia, un account",
    text: "Una scheda per te e una per ogni familiare che segui: un genitore, un figlio, il partner. I dati di ognuno restano separati, e li elimini quando vuoi.",
  },
  {
    icon: BellRing,
    title: "La visita, già preparata",
    text: "Segni la visita e le domande nascono dai numeri. Hai il foglio da portare al medico; tre giorni prima ti arriva un'email, senza dettagli sanitari.",
  },
];

const NOT_DONE = [
  "Non diciamo se un andamento va bene o male: lo può dire solo il medico",
  "Non suggeriamo quando ripetere un esame: la data la metti tu, di solito su indicazione del medico",
  "Il familiare non riceve email e non ha un accesso suo, per ora",
  "Non è un servizio per le emergenze: chiama il 112",
];

const FAQ = [
  {
    q: "Mia madre deve registrarsi?",
    a: "No. La sua scheda vive nel tuo account. Ti chiediamo perché puoi gestire i suoi dati (te lo ha chiesto, è tua figlia o tuo figlio minorenne, sei tutore o amministratore di sostegno) e registriamo la tua dichiarazione con la data.",
  },
  {
    q: "I miei fratelli possono vedere la scheda di nostra madre?",
    a: "Non ancora: oggi la scheda la vede solo chi l'ha creata. Un accesso condiviso, con permessi che decide chi ha creato la scheda, è tra le prossime cose da costruire.",
  },
  {
    q: "Che cosa succede se elimino una scheda?",
    a: "Spariscono subito i referti, i numeri e i promemoria di quella persona. Resta solo una riga nel registro delle attività che dice che la scheda è stata eliminata, senza contenuti.",
  },
  {
    q: "Perché i numeri di laboratori diversi non sono sempre in fila?",
    a: "Mettiamo in fila solo lo stesso esame con la stessa unità di misura. Se un laboratorio usa un'unità diversa, i numeri restano su righe separate: confrontarli richiede il medico.",
  },
  {
    q: "Lo spazio personale è gratis?",
    a: "Nella proposta sì: il tuo archivio, i tuoi numeri nel tempo e i tuoi promemoria restano gratuiti. Il piano Famiglia serve quando segui anche altre persone.",
  },
];

/**
 * «Famiglia» (13/11/2026): la promessa che fa restare. Referti e visite restano la porta d'ingresso; qui si spiega
 * perché si torna. Pezzi veri di prodotto sui referti inventati di «Lucia (esempio)». Il piano è una PROPOSTA.
 */
export default function FamigliaPage() {
  const prices = publicPricesEnabled();
  const p = famigliaPrice();
  const q = exampleQuestion("Creatinina");
  return (
    <div>
      <TrackView event="visita-famiglia" />

      {/* APERTURA */}
      <section aria-labelledby="fam-titolo" className="svc-hero">
        <div className="container-rc svc-hero-grid">
          <div className="min-w-0">
            <p className="eyebrow">Cura Privata Famiglia</p>
            <h1 id="fam-titolo" className="page-title mt-4">
              Tutta la salute della tua famiglia. Finalmente chiara, in un posto
              solo.
            </h1>
            <p className="lead mt-5 max-w-[38rem]">
              I tuoi referti, quelli di tua madre, quelli dei ragazzi: ognuno
              nella sua scheda, con i numeri messi in fila negli anni e le
              visite già preparate. Anche se abiti lontano.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/accedi?next=/area-personale/famiglia"
                data-track="cta-famiglia"
                className="btn btn-primary btn-lg"
              >
                Provala con una famiglia di esempio{" "}
                <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <a href="#piano" className="btn btn-secondary btn-lg">
                Il piano Famiglia
              </a>
            </div>
          </div>
          <div className="fam-hero-stack">
            <ExamplePeople />
            <ExampleTrend name="Creatinina" />
            <ExampleReminder questions={3} />
          </div>
        </div>
        <Wave className="text-canvas" />
      </section>

      {/* PERCHÉ SI RESTA */}
      <section aria-labelledby="perche-titolo" className="section">
        <div className="container-rc">
          <div className="max-w-3xl">
            <p className="eyebrow">Perché restare</p>
            <h2 id="perche-titolo" className="display-lg mt-4">
              Un referto si capisce una volta. Una storia serve per anni.
            </h2>
            <p className="lead mt-4">
              Chi segue la salute di qualcuno, la propria o quella di un
              genitore, ha bisogno di tre cose: vedere come cambiano i numeri,
              tenere tutto insieme, arrivare preparato alla visita.
            </p>
          </div>
          <ol className="fam-pillars mt-10">
            {PILLARS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="fam-pillar">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="fam-pillar-num">
                    {i + 1}
                  </span>
                  <span aria-hidden className="tile-ico tile-ico-sm">
                    <Icon />
                  </span>
                </div>
                <h3 className="text-[1.375rem] font-extrabold leading-tight text-ink">
                  {title}
                </h3>
                <p className="text-[1.0625rem] leading-relaxed text-ink-soft">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DAI NUMERI ALLE DOMANDE */}
      <section
        aria-labelledby="domande-titolo"
        className="panel-section section bg-mist"
      >
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-14">
          <div className="min-w-0">
            <p className="eyebrow">Dai numeri alle domande</p>
            <h2 id="domande-titolo" className="display-lg mt-4">
              Non ti diciamo che cosa significa. Ti aiutiamo a chiederlo.
            </h2>
            <p className="lead mt-4">
              Quando un numero esce dall&apos;intervallo stampato, o lo fa più
              volte, nasce una domanda per il medico. La scegli tu e finisce nel
              foglio della prossima visita, accanto agli ultimi numeri.
            </p>
          </div>
          {q ? (
            <figure className="form-card form-card-accent m-0">
              <figcaption className="eyebrow">
                Esempio, dai referti inventati di Lucia
              </figcaption>
              <blockquote className="mt-4 text-[1.1875rem] font-semibold leading-relaxed text-ink">
                «{q}»
              </blockquote>
              <p className="mt-4 text-[1rem] text-muted">
                Le domande nominano l&apos;esame e le date. Nessun aggettivo,
                nessuna diagnosi.
              </p>
            </figure>
          ) : null}
        </div>
      </section>

      {/* IL PIANO (proposta) */}
      <section
        id="piano"
        aria-labelledby="piano-titolo"
        className="section scroll-mt-24"
      >
        <div className="container-rc">
          <div className="max-w-3xl">
            <p className="eyebrow">Il piano</p>
            <h2 id="piano-titolo" className="display-lg mt-4">
              Il tuo spazio resta gratis. La famiglia, in un piano solo.
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="incl-card">
              <h3 className="box-title">Gratis, per te</h3>
              <ul className="check-list">
                {SPAZIO_GRATUITO.map((t) => (
                  <li key={t}>
                    <span aria-hidden className="check-dot">
                      <Check />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="fam-plan" data-testid="piano-famiglia">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-[1.5rem] font-extrabold text-ink">
                  Cura Privata Famiglia
                </h3>
                {p.proposal ? (
                  <span className="fam-proposal">
                    <CircleDashed aria-hidden className="h-4 w-4" /> Proposta,
                    prezzo da confermare
                  </span>
                ) : null}
              </div>
              {prices ? (
                <p className="mt-5">
                  <span className="fam-plan-price">{p.amount}</span>{" "}
                  <span className="text-[1.125rem] font-semibold text-ink-soft">
                    {p.per}
                  </span>
                  <span className="mt-1 block text-[1rem] text-muted">
                    {p.monthly}
                    {p.breakEven
                      ? `. Conviene già dal ${p.breakEven}° referto spiegato in un anno.`
                      : ""}
                  </span>
                </p>
              ) : null}
              <ul className="check-list mt-5">
                {famigliaIncludes().map((t) => (
                  <li key={t}>
                    <span aria-hidden className="check-dot">
                      <Check />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-7 grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
                <Link
                  href="/accedi?next=/area-personale/famiglia"
                  className="btn btn-primary btn-lg"
                >
                  Provala nella demo{" "}
                  <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                <div className="min-w-0">
                  <p className="text-[1rem] font-bold text-ink">
                    Avvisami quando parte
                  </p>
                  <WaitlistForm interest="famiglia" compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHE COSA NON FACCIAMO */}
      <section aria-labelledby="nonfa-titolo" className="section pt-0">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[1fr_1fr] lg:gap-10">
          <div className="excl-card">
            <h2 id="nonfa-titolo" className="box-title">
              Che cosa non facciamo
            </h2>
            <ul className="check-list text-ink-soft">
              {NOT_DONE.map((t) => (
                <li key={t}>
                  <span aria-hidden className="cross-dot">
                    <X />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h2 className="display-md">Domande frequenti</h2>
            <div className="mt-5">
              <FaqList items={FAQ} />
            </div>
          </div>
        </div>
        <div className="container-rc mt-10">
          <p className="emergency-note">
            <span aria-hidden>
              <Phone className="h-4 w-4" />
            </span>
            <span>
              <strong>Non per le emergenze.</strong> Se qualcuno sta male adesso
              chiama il <strong>112</strong>.
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}

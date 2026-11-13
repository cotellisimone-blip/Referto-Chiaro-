import type { Metadata } from "next";
import Link from "next/link";
import { CircleDashed, Languages, Palette, Plug, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { WaitlistForm } from "@/components/site/waitlist-form";

export const metadata: Metadata = {
  title: "Per le strutture",
  description: "Cura Privata per laboratori, poliambulatori e strutture sanitarie: referti più comprensibili per i pazienti. Lascia un contatto per saperne di più.",
  alternates: { canonical: "/per-le-strutture" },
};

const OFFER = [
  { icon: Languages, title: "Spiegazioni in parole semplici", text: "Accanto al referto, una spiegazione generale di che cosa misura ciascun esame, consegnata insieme ai risultati." },
  { icon: Palette, title: "Con il vostro marchio", text: "Il servizio presentato con l'identità della struttura. È un'ipotesi da definire insieme." },
  { icon: Plug, title: "Integrazione con i vostri sistemi", text: "È in valutazione: oggi non esiste ancora un'interfaccia disponibile." },
];

const NOT_DONE = [
  "Nessuna diagnosi e nessuna valutazione clinica: le decisioni restano ai professionisti sanitari.",
  "Nessun trattamento di dati dei vostri pazienti finché non saranno aperti i controlli previsti.",
  "Nessun accordo, listino o impegno di servizio: oggi esiste solo una dimostrazione con documenti inventati.",
];

const PILOT = [
  { title: "Ci raccontate il contesto", text: "Che tipo di struttura siete e come consegnate oggi i referti. Nessun dato di pazienti." },
  { title: "Definiamo insieme un perimetro", text: "Quali esami, quali limiti e quali verifiche legali servono prima di qualsiasi prova." },
  { title: "Una prova, solo a controlli aperti", text: "Un eventuale pilota partirebbe solo dopo le verifiche su privacy e sicurezza." },
];

/** Per le strutture, grafica «Luce»: un'idea dichiarata come tale, che cosa non facciamo, un solo modulo di interesse. */
export default function PerLeStrutturePage() {
  return (
    <>
      <PageHeader
        art="structures"
        eyebrow="Per le strutture"
        title="Referti più comprensibili, consegnati con i vostri risultati."
        lead="Laboratori, ambulatori, farmacie e associazioni di pazienti: stiamo valutando un programma pilota. Oggi è un'idea in preparazione, non un servizio attivo."
      >
        <p className="mt-6 flex max-w-[40rem] items-start gap-2.5 text-[1.0625rem] font-semibold leading-snug text-ink">
          <CircleDashed aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          Programma in preparazione: non trattiamo dati reali e non abbiamo partner attivi.
        </p>
        <p className="mt-6">
          <a href="#lista-strutture" className="btn btn-primary btn-lg">
            Manifesta il tuo interesse
          </a>
        </p>
      </PageHeader>

      <Section id="cosa-offriamo" eyebrow="Che cosa potremmo offrire" title="Ciò che stiamo valutando.">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:gap-5 lg:grid-cols-3">
          {OFFER.map(({ icon: Icon, title, text }) => (
            <li key={title} className="tile-card">
              <span aria-hidden className="tile-ico">
                <Icon />
              </span>
              <div>
                <h3 className="tile-card-title">{title}</h3>
                <p className="tile-card-text">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <section aria-labelledby="pilota-titolo" id="pilota" className="section scroll-mt-24">
        <div className="container-rc">
          <div className="max-w-3xl">
            <p className="eyebrow">Come potrebbe funzionare</p>
            <h2 id="pilota-titolo" className="display-lg mt-3">
              Un pilota, in tre passi.
            </h2>
            <p className="lead mt-4">È un&apos;ipotesi: il percorso può cambiare, nulla è ancora stato deciso.</p>
          </div>
          <ol className="steps mt-7 sm:mt-12">
            {PILOT.map((p, i) => (
              <li key={p.title} className="step">
                <span aria-hidden className="step-num">
                  {i + 1}
                </span>
                <div>
                  <h3 className="step-title">{p.title}</h3>
                  <p className="step-text">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Section id="cosa-non-facciamo" eyebrow="Per chiarezza" title="Che cosa non facciamo." size="md">
        <div className="excl-card max-w-[52rem]">
          <ul className="check-list text-ink-soft">
            {NOT_DONE.map((x) => (
              <li key={x}>
                <span aria-hidden className="cross-dot">
                  <X />
                </span>
                {x}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-lg text-ink-soft">
          Lo stato dei controlli è descritto nella pagina{" "}
          <Link href="/sicurezza-e-privacy" className="link font-semibold">
            sicurezza dei dati
          </Link>
          .
        </p>
      </Section>

      <Section id="lista-strutture" tone="mist" eyebrow="Lista d'attesa" title="Manifesta il tuo interesse." lead="Un contatto non vincolante: vi scriviamo solo quando il programma sarà pronto a partire.">
        <div className="max-w-2xl">
          <WaitlistForm interest="strutture" />
        </div>
      </Section>
    </>
  );
}

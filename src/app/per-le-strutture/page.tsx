import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { WaitlistForm } from "@/components/site/waitlist-form";

export const metadata: Metadata = { title: "Per le strutture" };

const OFFER = [
  { title: "Spiegazioni in linguaggio semplice", text: "Accanto al referto, una spiegazione generale di che cosa misura ciascun esame, consegnata insieme ai risultati." },
  { title: "Versione con il vostro marchio", text: "La possibilità di presentare il servizio con l'identità della struttura (white-label). È un'ipotesi da definire insieme." },
  { title: "API e integrazione", text: "L'integrazione con i vostri sistemi è in valutazione: non esiste ancora un'interfaccia disponibile." },
];

const NOT_DONE = [
  "Nessuna diagnosi e nessuna valutazione clinica: le decisioni restano ai professionisti sanitari.",
  "Nessun trattamento di dati dei vostri pazienti finché non saranno aperti i controlli di conformità previsti.",
  "Nessun accordo, listino o impegno di servizio: oggi esiste solo una dimostrazione con documenti inventati.",
];

const PILOT = [
  { n: "01", title: "Ci raccontate il contesto", text: "Che tipo di struttura siete e come consegnate oggi i referti. Nessun dato di pazienti." },
  { n: "02", title: "Definiamo insieme un perimetro", text: "Quali esami, quali limiti e quali verifiche legali servono prima di qualsiasi prova." },
  { n: "03", title: "Una prova, solo se i controlli sono aperti", text: "Un eventuale pilota partirebbe solo dopo le verifiche su privacy e sicurezza." },
];

export default function PerLeStrutturePage() {
  return (
    <>
      <PageHeader
        art="shield"
        eyebrow="Per le strutture"
        title="Referti più comprensibili, consegnati con i vostri risultati."
        lead="Laboratori, ambulatori, farmacie e associazioni di pazienti: stiamo valutando un programma pilota. Oggi è un'idea in preparazione, non un servizio attivo."
      >
        <div role="status" className="mt-8 rounded-2xl border border-line bg-paper p-5 sm:p-6">
          <p className="chip bg-cream text-ink">Programma in preparazione</p>
          <p className="mt-3 text-ink">Non trattiamo dati reali e non abbiamo partner attivi. Questa pagina serve a raccogliere manifestazioni di interesse non vincolanti.</p>
        </div>
      </PageHeader>
      <Section id="cosa-offriamo" eyebrow="Che cosa potremmo offrire" title="Ciò che stiamo valutando.">
        <ul className="grid gap-5 md:grid-cols-3">
          {OFFER.map((o) => (
            <li key={o.title} className="card card-lift p-6 sm:p-7">
              <h3 className="text-xl font-semibold text-ink">{o.title}</h3>
              <p className="mt-2 text-lg text-ink-soft">{o.text}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="cosa-non-facciamo" tone="paper" eyebrow="Per chiarezza" title="Che cosa non facciamo.">
        <ul className="max-w-3xl space-y-3 text-lg text-ink-soft">
          {NOT_DONE.map((x) => (
            <li key={x}>• {x}</li>
          ))}
        </ul>
        <p className="mt-8 text-muted">
          Lo stato dei controlli è descritto nella pagina{" "}
          <Link href="/sicurezza" className="link">
            sicurezza dei dati
          </Link>
          .
        </p>
      </Section>
      <Section id="pilota" eyebrow="Come potrebbe funzionare" title="Un pilota, in tre passi (ipotesi)." lead="Il percorso è indicativo e può cambiare: nulla è ancora stato deciso.">
        <ol className="grid gap-5 md:grid-cols-3">
          {PILOT.map((s) => (
            <li key={s.n} className="card p-6 sm:p-7">
              <span className="tabular font-serif text-3xl text-sage-deep">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section id="lista-strutture" tone="mist" eyebrow="Lista d'attesa" title="Manifesta il tuo interesse.">
        <div className="max-w-2xl">
          <WaitlistForm interest="strutture" />
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { IllustrationDialogue, IllustrationDossier, IllustrationMagnify, IllustrationTranslate } from "@/components/brand/illustrations";

export const metadata: Metadata = { title: "Come funziona" };

const PHASES = [
  { n: "01", Art: IllustrationMagnify, title: "Mostri un referto.", text: "Nella demo usi un documento inventato. In futuro, un PDF o una foto del tuo referto di laboratorio.", note: "Niente da installare. Funziona dal telefono." },
  { n: "02", Art: IllustrationDossier, title: "Controlli i valori.", text: "Ogni valore ha unità, intervallo e pagina. Se un dato non si legge, non lo indoviniamo: te lo diciamo.", note: "Confermi tu, una riga per volta." },
  { n: "03", Art: IllustrationTranslate, title: "Leggi la spiegazione.", text: "Parole comuni al posto delle sigle. Nessuna diagnosi. Ogni numero resta identico al referto.", note: "Con la fonte accanto: pagina e riga." },
  { n: "04", Art: IllustrationDialogue, title: "Vai dal medico preparato.", text: "Un foglio stampabile con valori, spiegazioni e domande. Le decisioni restano al medico.", note: "Lo stampi o lo mostri dal telefono." },
];

const CAN = ["Riportare valori, unità e intervalli come stampati", "Spiegare che cosa misura un esame", "Dire se un numero è dentro o fuori l'intervallo stampato", "Suggerire domande per il medico", "Fermarsi se un dato non si legge"];
const CANNOT = ["Fare diagnosi o dire se un valore è un problema per te", "Valutare l'urgenza o sostituire il pronto soccorso", "Consigliare farmaci o terapie", "Leggere immagini come TAC, risonanze o ecografie", "Firmarsi come parere medico"];

export default function ComeFunzionaPage() {
  return (
    <>
      <PageHeader art="magnify" eyebrow="Come funziona" title="Quattro passi, tutti sotto il tuo controllo." lead="Prima leggiamo il documento così com'è. Poi lo spieghiamo con parole comuni. In mezzo ci sei tu." />
      <div className="container-rc py-16 sm:py-24">
        <ol className="relative grid gap-8 sm:gap-10">
          <span aria-hidden className="absolute bottom-10 left-1/2 top-10 hidden w-px -translate-x-1/2 border-l-2 border-dashed border-line lg:block" />
          {PHASES.map(({ n, Art, title, text, note }, i) => (
            <Reveal as="li" key={n} className={`card card-lift relative grid items-center gap-6 p-7 sm:p-10 lg:grid-cols-[1fr_320px] ${i % 2 ? "lg:grid-cols-[320px_1fr]" : ""}`}>
              <div className={i % 2 ? "lg:order-2" : ""}>
                <span aria-hidden className="num text-[5rem] text-sage">{n}</span>
                <h2 className="mt-3 font-serif text-[2rem] leading-tight text-ink sm:text-[2.5rem]">
                  <span className="sr-only">Passo {i + 1}: </span>
                  {title}
                </h2>
                <p className="mt-4 max-w-xl text-xl text-ink-soft">{text}</p>
                <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-mist px-4 py-2 text-[0.9375rem] font-semibold text-teal-deep">
                  <Check aria-hidden className="h-4 w-4" /> {note}
                </p>
              </div>
              <div aria-hidden className={`reveal-art relative mx-auto w-full max-w-[320px] ${i % 2 ? "lg:order-1" : ""}`}>
                <div className="glow-cream absolute -inset-8 rounded-full" />
                <div className="relative">
                  <Art />
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="mt-14 text-center">
          <Link href="/esempio" className="btn btn-primary btn-lg">
            Provalo con un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
          <p className="mt-4 text-[1.0625rem] text-muted">Due minuti. Nessuna registrazione. Nessun dato personale.</p>
        </div>
      </div>

      <Section id="limiti" tone="mist" eyebrow="Trasparenza" title="Che cosa può fare, e che cosa no.">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="card overflow-hidden">
            <h3 className="flex items-center gap-3 border-b border-line bg-mist/60 px-6 py-4 text-xl font-semibold text-ink sm:px-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-deep text-white">
                <Check aria-hidden className="h-5 w-5" />
              </span>
              Può
            </h3>
            <ul className="space-y-4 p-6 text-lg sm:p-8">
              {CAN.map((c) => (
                <li key={c} className="flex gap-3">
                  <Check aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-sage-deep" /> {c}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="card overflow-hidden">
            <h3 className="flex items-center gap-3 border-b border-line bg-cream/50 px-6 py-4 text-xl font-semibold text-ink sm:px-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-strong text-on-strong">
                <X aria-hidden className="h-5 w-5" />
              </span>
              Non può, per scelta
            </h3>
            <ul className="space-y-4 p-6 text-lg sm:p-8">
              {CANNOT.map((c) => (
                <li key={c} className="flex gap-3">
                  <X aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-muted" /> {c}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section id="dati" eyebrow="I tuoi dati" title="Che cosa succede ai documenti.">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Oggi, nella demo", "Nessun documento reale. L'esempio è un file inventato: nessun dato personale viene inviato o salvato."],
            ["Quando il servizio sarà attivo", "Documenti in uno spazio privato e cifrato, visibile solo a te, cancellati secondo tempi dichiarati."],
            ["Mai", "Il contenuto dei referti non finisce in email, statistiche o pubblicità. Le email portano solo un avviso e un collegamento protetto."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 100} className="card card-lift p-6 sm:p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist">
                <ShieldCheck aria-hidden className="h-6 w-6 text-teal" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-lg text-ink-soft">{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="dossier" tone="mist" eyebrow="In preparazione" title="Il dossier con più referti." lead="Con il servizio Completo potrai riunire più referti in un unico documento ordinato per data. Confrontiamo solo esami davvero confrontabili: stesso esame, stessa unità. Nessun colore di allarme, nessun giudizio." />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { IllustrationDialogue, IllustrationDossier, IllustrationMagnify, IllustrationTranslate } from "@/components/brand/illustrations";

export const metadata: Metadata = { title: "Come funziona" };

const PHASES = [
  { n: 1, Art: IllustrationMagnify, title: "Mostri un referto.", text: "Nella demo usi un documento inventato. In futuro, un PDF o una foto del tuo referto di laboratorio." },
  { n: 2, Art: IllustrationDossier, title: "Controlli i valori.", text: "Ogni valore ha unità, intervallo e pagina. Se un dato non si legge, non lo indoviniamo: te lo diciamo." },
  { n: 3, Art: IllustrationTranslate, title: "Leggi la spiegazione.", text: "Parole comuni al posto delle sigle. Nessuna diagnosi. Ogni numero resta identico al referto." },
  { n: 4, Art: IllustrationDialogue, title: "Vai dal medico preparato.", text: "Un foglio stampabile con valori, spiegazioni e domande. Le decisioni restano al medico." },
];

const CAN = ["Riportare valori, unità e intervalli come stampati", "Spiegare che cosa misura un esame", "Dire se un numero è dentro o fuori l'intervallo stampato", "Suggerire domande per il medico", "Fermarsi se un dato non si legge"];
const CANNOT = ["Fare diagnosi o dire se un valore è un problema per te", "Valutare l'urgenza o sostituire il pronto soccorso", "Consigliare farmaci o terapie", "Leggere immagini come TAC, risonanze o ecografie", "Firmarsi come parere medico"];

export default function ComeFunzionaPage() {
  return (
    <>
      <PageHeader art="magnify" eyebrow="Come funziona" title="Quattro passi, tutti sotto il tuo controllo." lead="Prima leggiamo il documento così com'è. Poi lo spieghiamo con parole comuni. In mezzo ci sei tu." />
      <div className="container-rc py-14 sm:py-20">
        <ol className="grid gap-8 sm:gap-10">
          {PHASES.map(({ n, Art, title, text }, i) => (
            <Reveal as="li" key={n} className={`grid items-center gap-6 rounded-[var(--radius-xl)] border border-line bg-paper p-7 sm:p-10 lg:grid-cols-[1fr_300px] ${i % 2 ? "lg:grid-cols-[300px_1fr]" : ""}`}>
              <div className={i % 2 ? "lg:order-2" : ""}>
                <span aria-hidden className="step-number text-[4.5rem] text-sage">{n}</span>
                <h2 className="mt-2 font-serif text-[2rem] leading-tight text-ink sm:text-[2.5rem]">
                  <span className="sr-only">Passo {n}: </span>
                  {title}
                </h2>
                <p className="mt-4 max-w-xl text-xl text-ink-soft">{text}</p>
              </div>
              <div aria-hidden className={`reveal-art mx-auto w-full max-w-[300px] ${i % 2 ? "lg:order-1" : ""}`}>
                <Art />
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="mt-12 text-center">
          <Link href="/esempio" className="btn btn-primary btn-lg">
            Provalo con un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
        </div>
      </div>

      <Section id="limiti" tone="mist" eyebrow="Trasparenza" title="Che cosa può fare, e che cosa no.">
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="card p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-ink">Può</h3>
            <ul className="mt-5 space-y-4 text-lg">
              {CAN.map((c) => (
                <li key={c} className="flex gap-3">
                  <Check aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-sage-deep" /> {c}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120} className="card p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-ink">Non può</h3>
            <ul className="mt-5 space-y-4 text-lg">
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
            <Reveal key={t} delay={i * 100} className="card p-6 sm:p-7">
              <ShieldCheck aria-hidden className="h-8 w-8 text-teal" />
              <h3 className="mt-4 text-xl font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-lg text-ink-soft">{d}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="dossier" tone="mist" eyebrow="In preparazione" title="Il dossier con più referti." lead="Con il servizio Completo potrai riunire più referti in un unico documento ordinato per data. Confrontiamo solo esami davvero confrontabili: stesso esame, stessa unità. Nessun colore di allarme, nessun giudizio." />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Come funziona" };

const PHASES = [
  {
    n: "1",
    title: "Mostra un referto.",
    text: "Nella demo usi solo un documento inventato. Quando il servizio sarà attivo potrai caricare un PDF o una foto di un referto di laboratorio: il file verrà controllato, conservato in modo cifrato e cancellato secondo tempi dichiarati.",
  },
  {
    n: "2",
    title: "Controlla le informazioni.",
    text: "Ogni parametro è mostrato con unità, intervallo riportato e pagina di provenienza. Se il sistema non legge bene un dato, non lo indovina: te lo segnala e lo esclude.",
  },
  {
    n: "3",
    title: "Leggi una spiegazione chiara.",
    text: "Il testo chiarisce parole e contenuti del documento senza formulare diagnosi. Un controllo automatico verifica che ogni numero sia identico a quello confermato.",
  },
  {
    n: "4",
    title: "Porta le domande al medico.",
    text: "Scarichi un riepilogo stampabile con valori, spiegazioni e domande. Le decisioni mediche spettano sempre al professionista.",
  },
];

const CAN = [
  "Riportare valori, unità e intervalli esattamente come stampati",
  "Spiegare in generale che cosa misura un esame",
  "Dire in modo neutro se un numero è dentro o fuori l'intervallo stampato",
  "Suggerire domande da fare al medico",
  "Fermarsi quando un dato non è leggibile",
];
const CANNOT = [
  "Fare diagnosi o dire se un valore è un problema per te",
  "Valutare l'urgenza o sostituire il pronto soccorso",
  "Consigliare farmaci, terapie o quando ripetere gli esami",
  "Leggere immagini diagnostiche come TAC, RM o ecografie",
  "Firmarsi come parere medico",
];

export default function ComeFunzionaPage() {
  return (
    <>
      <PageHeader
        art="magnify"
        eyebrow="Come funziona"
        title="Dall'esame alla comprensione, con ogni passaggio sotto controllo."
        lead="Due fasi separate: prima leggiamo fedelmente il documento, poi lo spieghiamo con parole comuni. In mezzo ci sei tu, che controlli i valori."
      />
      <div className="container-rc py-14 sm:py-20">
        <ol className="relative space-y-10 border-l-2 border-line pl-8 sm:pl-12">
          {PHASES.map((p) => (
            <li key={p.n} className="relative max-w-3xl">
              <span className="tabular absolute -left-[3.05rem] flex h-10 w-10 items-center justify-center rounded-full border-2 border-line bg-paper font-serif text-lg text-teal sm:-left-[4.05rem]">
                {p.n}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl">{p.title}</h2>
              <p className="mt-3 text-lg text-muted">{p.text}</p>
            </li>
          ))}
        </ol>
        <Link href="/esempio" className="btn btn-primary mt-12">
          Provalo con un referto di esempio <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>

      <Section id="limiti" tone="paper" eyebrow="Trasparenza" title="Che cosa può fare, e che cosa no.">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <h3 className="font-semibold text-ink">Può</h3>
            <ul className="mt-4 space-y-3">
              {CAN.map((c) => (
                <li key={c} className="flex gap-3">
                  <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-sage-deep" /> {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 sm:p-8">
            <h3 className="font-semibold text-ink">Non può</h3>
            <ul className="mt-4 space-y-3">
              {CANNOT.map((c) => (
                <li key={c} className="flex gap-3">
                  <X aria-hidden className="mt-1 h-4 w-4 shrink-0 text-muted" /> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="dati" eyebrow="I tuoi dati" title="Che cosa succede ai documenti.">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Oggi, nella demo", "Non accettiamo documenti reali. L'esempio è un file inventato incluso nel sito: nessun dato personale viene inviato o salvato."],
            ["Quando il servizio sarà attivo", "I documenti saranno conservati in uno spazio privato e cifrato, accessibile solo a te, e cancellati secondo tempi indicati chiaramente."],
            ["Mai", "Non inseriamo il contenuto dei referti in email, statistiche o strumenti pubblicitari. Le email contengono solo un avviso e un collegamento protetto."],
          ].map(([t, d]) => (
            <div key={t} className="card p-6">
              <ShieldCheck aria-hidden className="h-6 w-6 text-teal" />
              <h3 className="mt-4 font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-[0.9375rem] text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="dossier"
        tone="mist"
        eyebrow="In preparazione"
        title="Il dossier con più referti."
        lead="Con il servizio Completo potrai riunire più referti in un unico documento ordinato per data. I valori saranno messi a confronto solo quando sono davvero confrontabili: stesso esame, stessa unità di misura, intervalli coerenti. Nessun giudizio sull'andamento della salute, nessun colore di allarme."
      />
    </>
  );
}

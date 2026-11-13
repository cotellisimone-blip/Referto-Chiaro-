import type { Metadata } from "next";
import Link from "next/link";
import { Ban, CircleDashed, EyeOff, FileWarning, FlaskConical, ScanSearch, UserRoundCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Sicurezza dei dati",
  description: "Come proteggiamo i tuoi documenti: cifratura, accessi registrati, medici che vedono solo ciò che scegli, nessun dato venduto o usato per pubblicità.",
  alternates: { canonical: "/sicurezza-e-privacy" },
};

const PRINCIPLES = [
  { icon: EyeOff, title: "Il referto non va in giro", text: "Nessun contenuto dei referti finisce in registri tecnici, statistiche, indirizzi web o email." },
  { icon: UserRoundCheck, title: "Il medico vede solo ciò che scegli", text: "Decidi tu quali documenti condividere, e solo finché il caso è aperto. Ogni accesso è registrato." },
  { icon: ScanSearch, title: "Numeri controllati", text: "Un controllo automatico verifica che i numeri spiegati coincidano con quelli stampati sul documento." },
  { icon: FileWarning, title: "Un documento non dà ordini", text: "Le istruzioni che dovessero trovarsi scritte dentro un documento sono trattate come semplice testo." },
  { icon: Ban, title: "Mai venduti, mai pubblicità", text: "I tuoi dati non vengono venduti né usati per mostrarti pubblicità." },
];

/** Le verifiche ancora aperte: nessuna è data per fatta finché non lo è. */
const BEFORE = [
  { title: "Dispositivo medico e intelligenza artificiale", text: "Valutazione dell'inquadramento come dispositivo medico (MDR) e degli obblighi sull'intelligenza artificiale." },
  { title: "Dati sanitari", text: "Valutazione GDPR per i dati sanitari, valutazione d'impatto e contratti con i fornitori." },
  { title: "Revisione clinica", text: "Revisione dei testi da parte di un medico e controlli di qualità indipendenti." },
  { title: "Prove di sicurezza", text: "Test su caricamento, conservazione cifrata e cancellazione dei documenti." },
];

export default function Page() {
  return (
    <>
      <PageHeader art="shield" eyebrow="Sicurezza e privacy" title="I tuoi referti restano tuoi." lead="Come proteggiamo, e proteggeremo, le tue informazioni. Senza promesse che non possiamo verificare." />

      <section aria-labelledby="oggi-titolo" className="section">
        <div className="container-rc">
          <div className="callout max-w-[52rem]">
            <span aria-hidden className="callout-ico">
              <FlaskConical />
            </span>
            <div>
              <h2 id="oggi-titolo" className="callout-title">
                Oggi: solo dati inventati
              </h2>
              <p className="callout-text">
                La versione dimostrativa non accetta documenti reali. Caricamento, elaborazione automatica, pagamento e secondo parere sono spenti anche sul server, non solo nascosti nelle pagine.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section id="principi" title="I principi che seguiamo.">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
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

      <Section id="prima" tone="mist" eyebrow="Ancora da fare" title="Prima di accettare referti veri." lead="Quattro verifiche, tutte ancora aperte. Finché non sono concluse, sul sito restano solo documenti inventati.">
        <ol className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 sm:gap-5">
          {BEFORE.map((b) => (
            <li key={b.title} className="tile-card">
              <span aria-hidden className="tile-ico tile-ico-sm">
                <CircleDashed />
              </span>
              <div>
                <h3 className="tile-card-title">{b.title}</h3>
                <p className="tile-card-text">{b.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <section aria-labelledby="certificazioni-titolo" className="section">
        <div className="container-rc">
          <h2 id="certificazioni-titolo" className="display-md max-w-3xl">
            Non dichiariamo certificazioni che non abbiamo.
          </h2>
          <p className="lead mt-4 max-w-[44rem]">Quando una verifica sarà conclusa, lo scriveremo in questa pagina.</p>
          <p className="mt-6 flex flex-col gap-x-8 gap-y-1 sm:flex-row">
            <Link href="/privacy-policy" className="link inline-flex min-h-11 items-center text-lg font-semibold">
              Informativa privacy (bozza)
            </Link>
            <Link href="/stato-del-progetto" className="link inline-flex min-h-11 items-center text-lg font-semibold">
              Stato del progetto
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

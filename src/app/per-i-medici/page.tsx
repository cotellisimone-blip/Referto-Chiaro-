import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileLock2, KeyRound, PenLine, ScrollText, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Method } from "@/components/offerta/method";

export const metadata: Metadata = {
  title: "Per i medici",
  description: "Come lavora un medico con Cura Privata: casi assegnati solo dopo il pagamento, documenti scelti dal paziente, accesso con 2FA, pareri firmati e non modificabili.",
};

const HOW = [
  { icon: Stethoscope, title: "Solo casi della tua specialità", text: "Ricevi una richiesta solo quando il paziente ha pagato e il caso è assegnato a te." },
  { icon: FileLock2, title: "Solo i documenti scelti", text: "Vedi soltanto i documenti che il paziente ha deciso di condividere, finché il caso è aperto. Ogni accesso è registrato." },
  { icon: KeyRound, title: "Accesso protetto", text: "Portale riservato con verifica in due passaggi e sessioni brevi." },
  { icon: PenLine, title: "Parere firmato", text: "Il parere o il riepilogo porta il tuo nome e un'impronta digitale: dopo la firma non si modifica." },
  { icon: ScrollText, title: "Testi informativi separati", text: "Le spiegazioni automatiche non diagnosticano e lo dicono. La valutazione clinica resta tua." },
  { icon: BadgeCheck, title: "Iscrizione verificata", text: "Prima di attivarti controlliamo l'iscrizione all'Albo. Il tuo profilo pubblico mostra solo dati verificati." },
];

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Per i medici" title="Una piattaforma seria, pensata anche per chi visita." lead="Il paziente arriva con i documenti ordinati e una domanda chiara. Tu scrivi il parere o fai il colloquio: noi ci occupiamo del resto." />
      <section aria-labelledby="come-titolo" className="container-rc py-12 sm:py-16">
        <h2 id="come-titolo" className="display-lg max-w-2xl text-[2rem] sm:text-[2.5rem]">
          Come lavori con Cura Privata
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {HOW.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card p-6">
              <Icon aria-hidden className="h-8 w-8 text-teal" strokeWidth={1.7} />
              <h3 className="mt-4 text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2 text-lg text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="metodo-titolo" className="bg-strong py-16 text-on-strong sm:py-20">
        <div className="container-rc">
          <Method />
        </div>
      </section>
      <section aria-labelledby="collabora-titolo" className="container-rc py-12 sm:py-16">
        <div className="card grid gap-6 p-8 sm:p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <h2 id="collabora-titolo" className="text-[1.75rem] font-bold leading-tight text-ink sm:text-[2.25rem]">
              Vuoi collaborare?
            </h2>
            <p className="mt-3 text-lg text-ink-soft">Stiamo preparando la rete di medici per il servizio reale. Accordo, compenso per prestazione e coperture saranno definiti per iscritto prima di qualsiasi caso. Oggi il portale è una versione dimostrativa con un medico di prova.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/contatti" className="btn btn-primary btn-lg">
              Scrivici <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
            <Link href="/medico" className="btn btn-secondary btn-lg">
              Prova il portale demo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileLock2, Home, KeyRound, PenLine, ScrollText, Stethoscope, Video } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Method } from "@/components/offerta/method";
import { DoctorCaseVisual } from "@/components/offerta/service-visuals";

export const metadata: Metadata = {
  title: "Per i medici",
  description: "Come lavora un medico con Cura Privata: casi assegnati solo dopo il pagamento, documenti scelti dal paziente, accesso con 2FA, pareri firmati e non modificabili.",
  alternates: { canonical: "/per-i-medici" },
};

const HOW = [
  { icon: Stethoscope, title: "Solo casi della tua specialità", text: "Ricevi una richiesta solo quando il paziente ha pagato e il caso è assegnato a te." },
  { icon: FileLock2, title: "Solo i documenti scelti", text: "Vedi soltanto i documenti che il paziente ha deciso di condividere, finché il caso è aperto. Ogni accesso è registrato." },
  { icon: KeyRound, title: "Accesso protetto", text: "Portale riservato con verifica in due passaggi e sessioni brevi." },
  { icon: PenLine, title: "Parere firmato", text: "Il parere o il riepilogo porta il tuo nome e un'impronta digitale: dopo la firma non si modifica." },
  { icon: ScrollText, title: "Testi informativi separati", text: "Le spiegazioni automatiche non diagnosticano e lo dicono. La valutazione clinica resta tua." },
  { icon: BadgeCheck, title: "Iscrizione verificata", text: "Prima di attivarti controlliamo l'iscrizione all'Albo. Il tuo profilo pubblico mostra solo dati verificati." },
];

/** Le tre prestazioni viste dal medico: che cosa gli si chiede, in una riga. Nessun compenso promesso. */
const WORK = [
  { icon: Home, tone: "medico", title: "Visita a domicilio", text: "Circa 45 minuti a casa del paziente, nell'area coperta. Accetti la fascia richiesta o ne proponi un'altra." },
  { icon: Video, tone: "medico", title: "Videoconsulto", text: "20–25 minuti in video, con i documenti scelti dal paziente già letti. Poi un breve riepilogo scritto." },
  { icon: PenLine, tone: "parere", title: "Secondo parere", text: "Un quesito circoscritto: lo accetti, chiedi altri documenti o lo rifiuti. Poi il video e la sintesi scritta." },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Per i medici"
        title="Una piattaforma seria, pensata anche per chi visita."
        lead="Il paziente arriva con i documenti in ordine e una domanda chiara. Tu visiti, parli o scrivi il parere: al resto pensiamo noi."
        visual={<DoctorCaseVisual />}
      >
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link href="/prova/medico" className="btn btn-primary btn-lg sm:shrink-0">
            Guarda il portale del medico <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
          <span className="text-[1.0625rem] text-muted">Versione dimostrativa, con un medico di prova.</span>
        </div>
      </PageHeader>

      <section aria-labelledby="come-titolo" className="section">
        <div className="container-rc">
          <h2 id="come-titolo" className="display-lg max-w-3xl">
            Come lavori con Cura Privata.
          </h2>
          <ul className="mt-7 grid grid-cols-[minmax(0,1fr)] gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {HOW.map(({ icon: Icon, title, text }) => (
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
        </div>
      </section>

      <section aria-labelledby="lavoro-titolo" className="panel-section grain section bg-mist">
        <div className="container-rc">
          <div className="max-w-3xl">
            <p className="eyebrow">Le prestazioni</p>
            <h2 id="lavoro-titolo" className="display-lg mt-3">
              Che cosa ti chiediamo, in concreto.
            </h2>
            <p className="lead mt-4">Decidi tu quali casi accettare. Se rifiuti una richiesta, il paziente non paga nulla.</p>
          </div>
          <ul className="mt-7 grid grid-cols-[minmax(0,1fr)] gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-3">
            {WORK.map(({ icon: Icon, tone, title, text }) => (
              <li key={title} className={`tile-card tone-${tone}`}>
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

      <section aria-labelledby="metodo-titolo" className="panel-section scope-strong section bg-petrol">
        <div className="container-rc">
          <Method />
        </div>
      </section>

      <section aria-labelledby="collabora-titolo" className="section">
        <div className="container-rc">
          <div className="cta-card">
            <div>
              <h2 id="collabora-titolo" className="display-md">
                Vuoi collaborare?
              </h2>
              <p className="lead mt-3 max-w-[38rem]">Stiamo preparando la rete di medici per il servizio reale. Accordo, compenso per prestazione e coperture saranno definiti per iscritto prima di qualsiasi caso.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/prova/medico/candidatura" className="btn btn-primary btn-lg">
                Candidati come medico (prova) <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/contatti" className="btn btn-secondary btn-lg">
                Scrivici
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

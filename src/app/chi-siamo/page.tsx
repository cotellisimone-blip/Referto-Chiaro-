import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Il progetto", description: "Chi siamo e perché Cura Privata esiste: rendere chiari i referti e portarti da un medico vero quando serve. Che cosa facciamo e che cosa non facciamo." };

export default function Page() {
  return (
    <>
      <PageHeader compact eyebrow="Chi siamo" title="Il progetto" lead="Uno spazio semplice e riservato per capire i propri esami, chiedere un secondo parere e parlare con un medico." />
      <div className="container-rc py-12 sm:py-16">
        <blockquote className="card grain relative overflow-hidden p-8 sm:p-12">
          <p className="display-lg max-w-3xl">
            Un referto non dovrebbe fare paura solo perché è scritto in un&apos;altra lingua.
          </p>
          <p className="mt-6 max-w-2xl text-xl text-ink-soft">
            Prima ti aiutiamo a capire. Se serve, un medico abilitato legge i tuoi documenti e ti risponde per iscritto o in video. Le decisioni restano tue e del tuo medico.
          </p>
        </blockquote>
        <div className="mt-12">
          <Prose>
            <p>Cura Privata è un progetto italiano in fase di sviluppo, nato come «Referto Chiaro». Oggi è una versione dimostrativa dei tre servizi: «Capisci il tuo referto», «Chiedi un secondo parere» e «Parla con un medico». Usa solo documenti inventati e un medico dimostrativo. È pensato prima di tutto per chi ha più di sessant&apos;anni e per chi aiuta un genitore: testo grande, poche parole, un passo per volta.</p>
            <h2>Che cosa crediamo</h2>
            <ul>
              <li>Capire un referto è un diritto, ma non sostituisce il medico.</li>
              <li>La fiducia nasce da ciò che si può verificare: per questo ogni numero mostra la sua fonte.</li>
              <li>Meglio dire «non lo so» che indovinare.</li>
            </ul>
            <h2>Che cosa non troverai qui</h2>
            <p>Testimonianze, numeri di utenti, medici o partnership che non esistono. Quando ci saranno, saranno verificabili.</p>
            <p>Ogni servizio parte davvero solo dopo le verifiche che un servizio sanitario richiede. Le trovi tutte nello <Link href="/stato-del-progetto" className="link">stato del progetto</Link>.</p>
          </Prose>
        </div>
      </div>
    </>
  );
}

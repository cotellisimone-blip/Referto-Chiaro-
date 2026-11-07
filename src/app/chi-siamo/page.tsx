import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Il progetto" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Chi siamo" title="Il progetto" lead="Referto Chiaro nasce da un'idea semplice: arrivare dal medico avendo capito che cosa c'è scritto nei propri esami." />
      <div className="container-rc py-12 sm:py-16">
        
        <div className="mt-10">
          <Prose>
            <p>Referto Chiaro è un progetto italiano in fase di sviluppo. Oggi è una versione dimostrativa: mostra come funzionerà il servizio usando solo referti inventati.</p>
            <h2>Che cosa crediamo</h2>
            <ul>
              <li>Capire un referto è un diritto, ma non sostituisce il medico.</li>
              <li>La fiducia nasce da ciò che si può verificare: per questo ogni numero mostra la sua fonte.</li>
              <li>Meglio dire «non lo so» che indovinare.</li>
            </ul>
            <h2>Che cosa non troverai qui</h2>
            <p>Testimonianze, numeri di utenti, medici o partnership che non esistono. Quando ci saranno, saranno verificabili.</p>
            <p><Link href="/esempio" className="link">Prova il referto di esempio</Link></p>
          </Prose>
        </div>
      </div>
    </>
  );
}

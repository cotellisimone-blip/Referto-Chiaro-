import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Il progetto" };

export default function Page() {
  return (
    <>
      <PageHeader art="translate" eyebrow="Chi siamo" title="Il progetto" lead="Cura Privata vuole essere uno spazio semplice e riservato per prendersi cura della propria salute. Comincia da una cosa sola: capire che cosa c'è scritto nei propri esami." />
      <div className="container-rc py-12 sm:py-16">
        
        <blockquote className="card grain relative overflow-hidden p-8 sm:p-12">
          <p className="display-lg max-w-3xl">
            Un referto non dovrebbe fare paura solo perché è scritto in un&apos;altra lingua.
          </p>
          <p className="mt-6 max-w-2xl text-xl text-ink-soft">
            Il primo servizio di Cura Privata traduce quella lingua. Non interpreta, non giudica, non decide. Ti porta dal medico con le idee più chiare e le domande già pronte.
          </p>
        </blockquote>
        <div className="mt-12">
          <Prose>
            <p>Cura Privata è un progetto italiano in fase di sviluppo, nato come «Referto Chiaro». Oggi è una versione dimostrativa: mostra come funzionerà il primo servizio, «Comprendi i tuoi referti», usando solo referti inventati. È pensato prima di tutto per chi ha più di sessant&apos;anni e per chi aiuta un genitore: testo grande, poche parole, un passo per volta.</p>
            <h2>Dove vogliamo arrivare</h2>
            <p>Nel tempo Cura Privata potrà offrire anche un secondo parere da medici abilitati, un archivio dei documenti sanitari, visite e videoconsulti, promemoria per la prevenzione. Ognuno partirà solo quando sarà pronto davvero, con le verifiche che un servizio sanitario richiede. <Link href="/servizi" className="link">Lo stato di ogni servizio</Link> è sempre pubblico.</p>
            <h2>Che cosa crediamo</h2>
            <ul>
              <li>Capire un referto è un diritto, ma non sostituisce il medico.</li>
              <li>La fiducia nasce da ciò che si può verificare: per questo ogni numero mostra la sua fonte.</li>
              <li>Meglio dire «non lo so» che indovinare.</li>
            </ul>
            <h2>Che cosa non troverai qui</h2>
            <p>Testimonianze, numeri di utenti, medici o partnership che non esistono. Quando ci saranno, saranno verificabili.</p>
            <p><Link href="/referti/esempio" className="link">Prova il referto di esempio</Link></p>
          </Prose>
        </div>
      </div>
    </>
  );
}

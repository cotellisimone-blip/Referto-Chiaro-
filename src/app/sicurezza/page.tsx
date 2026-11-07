import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Sicurezza dei dati" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Sicurezza" title="Sicurezza dei dati" lead="Come proteggiamo, e proteggeremo, le informazioni." />
      <div className="container-rc py-12 sm:py-16">
        
        <div className="mt-10">
          <Prose>
            <h2>Oggi: solo dati inventati</h2>
            <p>La versione dimostrativa non accetta documenti reali. Le funzioni di caricamento, elaborazione automatica, pagamento e secondo parere sono disattivate anche lato server, non solo nascoste nell&apos;interfaccia.</p>
            <h2>Prima di accettare referti reali</h2>
            <ul>
              <li>Valutazione dell&apos;inquadramento come dispositivo medico (MDR) e degli obblighi sull&apos;intelligenza artificiale.</li>
              <li>Valutazione GDPR per i dati sanitari, valutazione d&apos;impatto e contratti con i fornitori.</li>
              <li>Revisione clinica dei testi e controlli di qualità indipendenti.</li>
              <li>Test di sicurezza su caricamento, conservazione cifrata e cancellazione.</li>
            </ul>
            <h2>Principi tecnici</h2>
            <ul>
              <li>Nessun contenuto dei referti in log, statistiche, URL o email.</li>
              <li>Controllo automatico che i numeri spiegati coincidano con quelli del documento.</li>
              <li>Le istruzioni eventualmente presenti in un documento sono trattate come semplice testo.</li>
            </ul>
            <p>Non dichiariamo certificazioni che non abbiamo.</p>
          </Prose>
        </div>
      </div>
    </>
  );
}

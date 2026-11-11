import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DraftNotice, Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Cookie" };

export default function Page() {
  return (
    <>
      <PageHeader compact eyebrow="Note legali" title="Cookie" lead="Quali cookie usa il sito, e quali no." />
      <div className="container-rc py-12 sm:py-16">
        <DraftNotice />
        <div className="mt-10">
          <Prose>
            <h2>Cookie tecnici</h2>
            <ul>
              <li>
                <strong>rc_session</strong>: identifica la tua sessione dopo l&apos;accesso all&apos;area personale. È necessario, non leggibile da script, inviato solo su connessione cifrata. Dura 14 giorni (12 ore per medici e amministratori) e sparisce quando esci.
              </li>
            </ul>
            <h2>Memoria del browser, senza cookie</h2>
            <ul>
              <li>
                <strong>rc-theme</strong> e <strong>rc-size</strong> (localStorage): tema chiaro o scuro e dimensione del testo. Restano sul tuo dispositivo e non vengono inviati al sito.
              </li>
              <li>
                <strong>Demo</strong> (sessionStorage): a che punto sei nell&apos;esempio. Contiene solo identificativi del referto inventato e si cancella alla chiusura della scheda.
              </li>
            </ul>
            <h2>Che cosa non c&apos;è</h2>
            <p>Nessun cookie di profilazione, di statistica o di terze parti. Nessun pixel pubblicitario. Contiamo soltanto, in forma anonima e aggregata per giorno, le visite alla home e i clic sui pulsanti dei servizi: non salviamo nulla sul tuo dispositivo né dati che ti identifichino. Per questo non compare un banner: non c&apos;è nulla da scegliere. Se in futuro verranno introdotti strumenti che richiedono il consenso, il sito chiederà una scelta reale prima di attivarli.</p>
          </Prose>
        </div>
      </div>
    </>
  );
}

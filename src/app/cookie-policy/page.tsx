import { DATI_SUL_DISPOSITIVO } from "@/lib/dati-sul-dispositivo";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DraftNotice, Prose } from "@/components/ui/draft-notice";
import { mediciEnabled } from "@/lib/medici";

export const metadata: Metadata = { title: "Cookie", alternates: { canonical: "/cookie-policy" }, description: "Quali cookie usa Cura Privata: solo quelli tecnici necessari al funzionamento, nessun cookie di profilazione o pubblicità." };

export default function Page() {
  return (
    <>
      <PageHeader compact eyebrow="Note legali" title="Cookie" lead="Quali cookie usa il sito, e quali no." />
      <div className="container-rc page-body">
        <DraftNotice />
        <div className="mt-8 sm:mt-10">
          <Prose>
            <h2>Cookie tecnici</h2>
            <ul>
              <li>
                <strong>rc_session</strong>: identifica la tua sessione dopo l&apos;accesso all&apos;area personale. È necessario, non leggibile da script, inviato solo su connessione cifrata. Dura 14 giorni ({mediciEnabled() ? "12 ore per medici e amministratori" : "12 ore per gli amministratori"}) e sparisce quando esci.
              </li>
            </ul>
            <h2>Memoria del browser, senza cookie</h2>
            <ul>
              {/* 27/11/2026 (fase 1): l'elenco completo viene da src/lib/dati-sul-dispositivo.ts, lo stesso delle Impostazioni. */}
              {DATI_SUL_DISPOSITIVO.map((d) => (
                <li key={d.key}>
                  <strong>{d.key}</strong> (localStorage): {d.cosa.charAt(0).toLowerCase() + d.cosa.slice(1)}. Resta su questo dispositivo e non viene inviato al sito.
                </li>
              ))}
              <li>Dall&apos;area personale, in Impostazioni, «Cancella da questo dispositivo» toglie tutto in un tocco.</li>
              <li>
                <strong>Demo</strong> (sessionStorage): a che punto sei nell&apos;esempio. Contiene solo identificativi del referto inventato e si cancella alla chiusura della scheda.
              </li>
            </ul>
            <h2>Che cosa non c&apos;è</h2>
            <p>Nessun cookie di profilazione, di statistica o di terze parti. Nessun pixel pubblicitario. Contiamo soltanto, in forma anonima e aggregata per giorno, le visite alla home e i clic sui pulsanti dei servizi: per contarle non salviamo nulla sul tuo dispositivo né dati che ti identifichino. Per questo non compare un banner: non c&apos;è nulla da scegliere. Se in futuro verranno introdotti strumenti che richiedono il consenso, il sito chiederà una scelta reale prima di attivarli.</p>
          </Prose>
        </div>
      </div>
    </>
  );
}

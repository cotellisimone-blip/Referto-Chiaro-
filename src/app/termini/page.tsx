import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DraftNotice, Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Termini del servizio", description: "Termini del servizio di Cura Privata: che cosa offre, che cosa non è, prezzi, pagamenti, rimborsi e limiti delle spiegazioni informative." };

export default function Page() {
  return (
    <>
      <PageHeader compact eyebrow="Note legali" title="Termini del servizio" lead="Le condizioni che regoleranno l'uso di Cura Privata." />
      <div className="container-rc py-12 sm:py-16">
        <DraftNotice />
        <div className="mt-10">
          <Prose>
            <h2>Natura del servizio</h2>
            <p>Cura Privata offre spiegazioni informative di documenti medici. Non fornisce diagnosi, terapie, triage o pareri medici, e non sostituisce il medico curante né il pronto soccorso. Il servizio di secondo parere, quando sarà attivo, sarà erogato da medici abilitati e identificati, con condizioni proprie.</p>

            <h2>Chi può usarlo</h2>
            <ul>
              <li>Persone maggiorenni che caricano referti che riguardano loro stesse.</li>
              <li>Non è adatto a emergenze, minori, gravidanza, referti istologici o genetici, immagini diagnostiche.</li>
              <li>Chi crea un account dichiara di essere l&apos;interessato dei dati che carica. Caricare referti di altre persone senza averne titolo non è consentito.</li>
            </ul>

            <h2>Versione dimostrativa</h2>
            <p>Oggi il sito mostra solo esempi con dati inventati. L&apos;area personale accetta soltanto referti di esempio, i pagamenti sono simulati o in modalità di prova senza addebiti, il secondo parere è una simulazione dichiarata. Nessun servizio è acquistabile. L&apos;account demo è condiviso: tutto ciò che vi si inserisce è visibile ad altre persone.</p>

            <h2>Secondo parere (condizioni previste)</h2>
            <ul>
              <li>Una domanda specifica su un referto, rivolta a un medico della specialità scelta, che risponde per iscritto.</li>
              <li>Il referto e la domanda vengono condivisi con il medico solo con un consenso specifico, dato al momento della richiesta.</li>
              <li>Il medico può rifiutare la richiesta, indicando il motivo, se non rientra nelle sue competenze o se mancano elementi.</li>
              <li>La risposta è un parere informativo scritto, firmato e non modificabile; non è una visita e non sostituisce il medico curante.</li>
              <li>Prezzo, tempi e condizioni di rimborso saranno indicati prima della richiesta.</li>
            </ul>

            <h2>Da definire prima dell&apos;apertura</h2>
            <ul>
              <li>Prezzi, IVA, modalità di pagamento e rimborsi.</li>
              <li>Diritto di recesso per contenuti digitali.</li>
              <li>Responsabilità e limiti del servizio informativo.</li>
              <li>Foro competente e legge applicabile.</li>
            </ul>
          </Prose>
        </div>
      </div>
    </>
  );
}

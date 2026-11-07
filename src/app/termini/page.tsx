import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DraftNotice, Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Termini del servizio" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Note legali" title="Termini del servizio" lead="Le condizioni che regoleranno l'uso di Referto Chiaro." />
      <div className="container-rc py-12 sm:py-16">
        <DraftNotice />
        <div className="mt-10">
          <Prose>
            <h2>Natura del servizio</h2>
            <p>Referto Chiaro offre spiegazioni informative di documenti di laboratorio. Non fornisce diagnosi, terapie, triage o pareri medici, salvo il servizio di secondo parere quando sarà erogato da medici abilitati.</p>
            <h2>Versione dimostrativa</h2>
            <p>Oggi il sito mostra solo un esempio con dati inventati. Nessun servizio è acquistabile.</p>
            <h2>Da definire prima dell&apos;apertura</h2>
            <ul>
              <li>Prezzi, IVA, modalità di pagamento e rimborsi.</li>
              <li>Diritto di recesso per contenuti digitali.</li>
              <li>Responsabilità e limiti del servizio informativo.</li>
              <li>Condizioni del secondo parere medico.</li>
            </ul>
          </Prose>
        </div>
      </div>
    </>
  );
}

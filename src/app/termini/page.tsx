import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DraftNotice, Prose } from "@/components/ui/draft-notice";
import { mediciEnabled } from "@/lib/medici";

/** 14/11/2026: senza medici (src/lib/medici.ts) restano solo le condizioni di ciò che si offre davvero. */
const MEDICI = mediciEnabled();

export const metadata: Metadata = { title: "Termini del servizio", description: "Termini del servizio di Cura Privata: che cosa offre, che cosa non è, prezzi, pagamenti, rimborsi e limiti delle spiegazioni informative." };

export default function Page() {
  return (
    <>
      <PageHeader compact eyebrow="Note legali" title="Termini del servizio" lead="Le condizioni che regoleranno l'uso di Cura Privata." />
      <div className="container-rc page-body">
        <DraftNotice />
        <div className="mt-8 sm:mt-10">
          <Prose>
            <h2>Natura del servizio</h2>
            <p>Cura Privata offre spiegazioni informative di documenti medici, preparate in automatico: non sono diagnosi, terapie, triage o pareri medici e non sostituiscono il medico curante né il pronto soccorso. Le prestazioni con un medico (videoconsulto, visita a domicilio, secondo parere), quando saranno attive, saranno erogate da medici abilitati e identificabili, con condizioni proprie.</p>

            <h2>Chi può usarlo</h2>
            <ul>
              <li>Persone maggiorenni che caricano referti che riguardano loro stesse.</li>
              <li>Non è adatto a emergenze, minori, gravidanza, referti istologici o genetici, immagini diagnostiche.</li>
              <li>Chi crea un account dichiara di essere l&apos;interessato dei dati che carica. Caricare referti di altre persone senza averne titolo non è consentito.</li>
            </ul>

            <h2>Versione dimostrativa</h2>
            <p>Oggi il sito mostra solo esempi con dati inventati. L&apos;area personale accetta soltanto referti di esempio, i pagamenti sono simulati o in modalità di prova senza addebiti{MEDICI ? ", le prestazioni con un medico sono simulazioni dichiarate: nessun medico reale risponde" : ""}. Nessun servizio è acquistabile. L&apos;account demo è condiviso: tutto ciò che vi si inserisce è visibile ad altre persone.</p>

            {MEDICI ? (
            <>
            <h2>Prestazioni con un medico (condizioni previste)</h2>
            <ul>
              <li>Videoconsulto: circa 20–25 minuti in video con un medico di medicina generale, che legge prima i documenti scelti da te. Dopo il colloquio ricevi un breve riepilogo scritto.</li>
              <li>Visita a domicilio: un medico di medicina generale a casa, per esigenze non urgenti, nelle zone coperte. Al termine ricevi un riepilogo scritto e, se il medico lo ritiene, una prescrizione su ricetta bianca.</li>
              <li>Secondo parere: un quesito circoscritto rivolto a uno specialista, che esamina la documentazione pertinente, ne parla con te in video e consegna una sintesi scritta, firmata e non modificabile.</li>
              <li>I documenti e il quesito vengono condivisi con il medico solo con un consenso specifico, dato al momento della richiesta.</li>
              <li>Il medico può chiedere altri documenti o non accettare la richiesta, indicando il motivo: in quel caso non c&apos;è addebito.</li>
              <li>Nessuna prestazione è adatta alle emergenze e nessuna sostituisce il medico curante.</li>
              <li>Prezzo, tempi e regole di annullamento e rimborso sono indicati prima del pagamento.</li>
            </ul>
            </>
            ) : null}

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

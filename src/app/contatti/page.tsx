import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Contatti" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Contatti" title="Contatti" lead="Il servizio non è ancora aperto al pubblico." />
      <div className="container-rc py-12 sm:py-16">
        
        <div className="mt-10">
          <Prose>
            <p>I canali di contatto e assistenza saranno pubblicati all&apos;apertura del servizio, insieme ai dati del titolare.</p>
            <p><strong>Non inviarci referti o informazioni sulla tua salute</strong>, in nessuna forma: in questa fase non possiamo trattarli.</p>
            <h2>Emergenze</h2>
            <p>Per qualsiasi urgenza sanitaria chiama il 112 o rivolgiti ai servizi di emergenza.</p>
          </Prose>
        </div>
      </div>
    </>
  );
}

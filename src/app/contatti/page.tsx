import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/draft-notice";
import { readTitolare } from "@/domain/titolare";

export const metadata: Metadata = { title: "Contatti" };

export default function Page() {
  const t = readTitolare();
  return (
    <>
      <PageHeader art="dialogue" eyebrow="Contatti" title="Contatti" lead="Il servizio non è ancora aperto al pubblico." />
      <div className="container-rc py-12 sm:py-16">
        
        <div className="mt-10">
          <Prose>
            {t ? (
              <>
                <h2>Chi c&apos;è dietro</h2>
                <p data-testid="titolare-contatti">
                  {t.name} · P.IVA {t.vat}
                  {t.address ? <><br />{t.address}</> : null}
                  {t.email ? <><br />Email: <a href={`mailto:${t.email}`}>{t.email}</a></> : null}
                  {t.pec ? <><br />PEC: {t.pec}</> : null}
                </p>
              </>
            ) : (
              <p>I canali di contatto e assistenza saranno pubblicati all&apos;apertura del servizio, insieme ai dati del titolare.</p>
            )}
            <p><strong>Non inviarci referti o informazioni sulla tua salute</strong>, in nessuna forma: in questa fase non possiamo trattarli.</p>
            <h2>Emergenze</h2>
            <p>Per qualsiasi urgenza sanitaria chiama il 112 o rivolgiti ai servizi di emergenza.</p>
          </Prose>
        </div>
      </div>
    </>
  );
}

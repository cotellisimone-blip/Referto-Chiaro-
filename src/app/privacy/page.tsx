import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DraftNotice, Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Informativa privacy" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Note legali" title="Informativa privacy" lead="Come saranno trattati i dati personali." />
      <div className="container-rc py-12 sm:py-16">
        <DraftNotice />
        <div className="mt-10">
          <Prose>
            <h2>Versione dimostrativa</h2>
            <p>In questa fase il sito non raccoglie dati sanitari, non richiede registrazione e non usa cookie di profilazione. Il referto di esempio è incluso nel sito e non contiene dati di persone reali.</p>
            <h2>Servizio futuro</h2>
            <p>Prima dell&apos;apertura verranno indicati: titolare del trattamento, finalità e basi giuridiche (inclusa la condizione per i dati relativi alla salute), fornitori coinvolti e loro localizzazione, tempi di conservazione e cancellazione, diritti dell&apos;interessato e modalità per esercitarli.</p>
          </Prose>
        </div>
      </div>
    </>
  );
}

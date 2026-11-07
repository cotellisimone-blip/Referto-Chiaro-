import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DraftNotice, Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Cookie" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Note legali" title="Cookie" lead="Quali cookie usa il sito." />
      <div className="container-rc py-12 sm:py-16">
        <DraftNotice />
        <div className="mt-10">
          <Prose>
            <p>La versione dimostrativa non installa cookie di profilazione o di terze parti. Per ricordare a che punto sei nella demo usiamo l&apos;archiviazione locale della scheda del browser (sessionStorage), che contiene solo identificativi del referto inventato e si cancella alla chiusura della scheda.</p>
            <p>Se in futuro verranno introdotti strumenti che richiedono il consenso, il sito chiederà una scelta reale prima di attivarli.</p>
          </Prose>
        </div>
      </div>
    </>
  );
}

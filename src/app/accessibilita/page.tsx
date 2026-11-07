import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DraftNotice, Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Accessibilità" };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Accessibilità" title="Accessibilità" lead="Vogliamo che il sito sia utilizzabile da tutti." />
      <div className="container-rc py-12 sm:py-16">
        <DraftNotice />
        <div className="mt-10">
          <Prose>
            <p>Il sito è progettato con l&apos;obiettivo di rispettare le linee guida WCAG 2.2 livello AA: navigazione da tastiera, contrasti adeguati, testi alternativi, rispetto della preferenza per animazioni ridotte.</p>
            <p>Effettuiamo controlli automatici di accessibilità ad ogni modifica. Una valutazione completa, anche manuale, sarà pubblicata prima dell&apos;apertura del servizio.</p>
            <p>Se incontri una difficoltà, potrai segnalarla tramite i canali che saranno indicati nella pagina <Link href="/contatti" className="link">Contatti</Link>.</p>
          </Prose>
        </div>
      </div>
    </>
  );
}

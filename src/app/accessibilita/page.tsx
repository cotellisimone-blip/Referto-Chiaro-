import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { DraftNotice, Prose } from "@/components/ui/draft-notice";

export const metadata: Metadata = { title: "Accessibilità", description: "Accessibilità di Cura Privata: testo grande, contrasto, navigazione da tastiera, tema scuro e come segnalarci un problema." };

export default function Page() {
  return (
    <>
      <PageHeader art="faq" eyebrow="Accessibilità" title="Accessibilità" lead="Vogliamo che il sito sia utilizzabile da tutti." />
      <div className="container-rc page-body">
        <DraftNotice />
        <div className="mt-8 sm:mt-10">
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

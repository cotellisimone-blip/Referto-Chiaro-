import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock3, FileText, ListChecks, Lock, Printer, Video } from "lucide-react";
import { VisitPrep } from "@/components/tools/visit-prep";
import { VisitListVisual } from "@/components/offerta/service-visuals";
import { LinkCards } from "@/components/ui/link-cards";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { absoluteUrl } from "@/lib/seo";
import { coreService } from "@/domain/offerta";
import { mediciEnabled } from "@/lib/medici";

export const metadata: Metadata = {
  title: "Preparati alla visita in 2 minuti",
  description: "Strumento gratuito: tre domande pratiche e ottieni la lista di cosa portare, cosa preparare e cosa chiedere al medico. Nessun dato personale, nessuna registrazione.",
  alternates: { canonical: absoluteUrl("/strumenti/preparati-alla-visita") },
};

/** Tre domande vere dello strumento, per l'anteprima nell'apertura. */
const PREVIEW = ["Che cosa devo fare da qui alla prossima visita?", "Quali esami o controlli servono, e perché?", "Quali segnali dovrebbero farmi richiamare subito?"];

export default function PreparatiAllaVisitaPage() {
  const capisci = coreService("capisci");
  const medico = coreService("parla-con-un-medico");
  return (
    <>
      <PageHeader
        eyebrow="Strumento gratuito"
        title={
          <>
            Preparati alla visita <span className="marker">in 2 minuti</span>.
          </>
        }
        lead="Tre domande pratiche e hai la tua lista: che cosa portare, che cosa preparare, che cosa chiedere. Così in visita non dimentichi niente."
        visual={<VisitListVisual items={PREVIEW} />}
      >
        <ul className="pdp-hero-facts mt-7">
          <li>
            <Clock3 aria-hidden /> Circa 2 minuti
          </li>
          <li>
            <Lock aria-hidden /> Nessun dato personale, nessuna registrazione
          </li>
          <li>
            <Printer aria-hidden /> Da stampare o tenere sul telefono
          </li>
        </ul>
      </PageHeader>
      <Suspense
        fallback={
          <div className="container-rc tool-body" aria-busy="true">
            <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-mist" />
          </div>
        }
      >
        <VisitPrep />
      </Suspense>
      <Section id="dopo" title="Vuoi arrivare ancora più preparato?" size="md" className="no-print">
        <LinkCards
          columns={2}
          items={[
            { href: capisci.href, icon: FileText, tone: "capisci", title: "Hai un referto? Capiscilo prima della visita.", text: "Valori e sigle in parole semplici, con le domande da fare.", go: capisci.name },
            // Senza medici (src/lib/medici.ts) il secondo passo è l'altro strumento gratuito.
            mediciEnabled()
              ? { href: medico.href, icon: Video, tone: "medico", title: "Preferisci parlarne prima con un medico?", text: "Un videoconsulto: il medico legge prima i documenti che scegli.", go: medico.name }
              : { href: "/strumenti/domande-per-il-medico", icon: ListChecks, tone: "partenza", title: "Hai fatto degli esami? Prepara le domande.", text: "Le domande utili per gli esami che hai fatto, da portare in visita.", go: "Domande per il medico" },
          ]}
        />
        <p className="mt-7 max-w-3xl text-[1.0625rem] text-muted">Le indicazioni di questa pagina sono pratiche e generali: non valutano la tua salute. Sono una bozza editoriale in attesa di revisione medica, come le nostre guide.</p>
      </Section>
    </>
  );
}

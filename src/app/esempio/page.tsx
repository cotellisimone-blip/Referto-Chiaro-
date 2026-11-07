import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DemoFlow } from "@/components/demo/demo-flow";

export const metadata: Metadata = {
  title: "Referto di esempio",
  description: "Prova il percorso completo su un referto di laboratorio inventato: controllo dei valori, spiegazione e PDF.",
};

export default function EsempioPage() {
  return (
    <>
      <PageHeader
        eyebrow="Demo con dati inventati"
        title="Esplora un referto di esempio."
        lead="Dal documento al riepilogo PDF in quattro passaggi. Nessuna registrazione, nessun dato personale: il referto e la persona sono inventati."
      />
      <div className="container-rc py-10 sm:py-14">
        <DemoFlow />
      </div>
    </>
  );
}

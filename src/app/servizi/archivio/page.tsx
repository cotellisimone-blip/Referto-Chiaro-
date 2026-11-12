import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Archivio salute — in preparazione",
  description: "L'archivio dei documenti sanitari di Cura Privata è in preparazione: come sarà e che cosa deve essere pronto prima di aprirlo.",
};

export default function ArchivioPage() {
  return (
    <ComingSoonPage
      eyebrow="Archivio salute"
      title="I tuoi documenti sanitari, in ordine."
      lead="Referti, lettere di dimissione, prescrizioni: tutto in un posto solo, ordinato per data, da mostrare al medico quando serve."
      art="dossier"
      interest="archivio"
      plan={[
        { title: "Carichi e ritrovi", text: "Ogni documento con data, tipo e struttura, cercabile in pochi secondi." },
        { title: "Decidi tu chi vede", text: "Accessi a tempo per un medico o un familiare, revocabili in qualsiasi momento." },
        { title: "Porti via tutto", text: "Esporti o cancelli l'intero archivio quando vuoi, senza chiedere a nessuno." },
      ]}
      prerequisites={[
        "Valutazione d'impatto sulla protezione dei dati (DPIA)",
        "Conservazione cifrata in Unione Europea, con contratti con i fornitori",
        "Regole di conservazione e cancellazione scritte",
        "Antivirus e controlli sui file caricati",
        "Gestione delle deleghe ai familiari, con revoca",
        "Procedura per incidenti e richieste sui dati",
      ]}
      notes={<p>Nell&apos;area personale dimostrativa c&apos;è già un archivio di prova con referti inventati: serve a mostrare l&apos;idea, non a conservare documenti veri.</p>}
    />
  );
}

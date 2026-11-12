import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Prevenzione — in preparazione",
  description: "Promemoria per i controlli indicati dal tuo medico: servizio di Cura Privata in preparazione.",
};

export default function PrevenzionePage() {
  return (
    <ComingSoonPage
      eyebrow="Prevenzione"
      title="Non dimenticare i controlli che contano."
      lead="Promemoria semplici per gli esami e le visite che il tuo medico ti ha indicato, con materiali informativi chiari."
      art="shield"
      interest="prevenzione"
      plan={[
        { title: "Scrivi tu le scadenze", text: "Le inserisci come te le ha date il medico: non le decidiamo noi." },
        { title: "Ricevi un promemoria", text: "Un avviso discreto, senza dettagli sanitari nel testo del messaggio." },
        { title: "Trovi le guide", text: "Che cosa misura un esame e come prepararti, con le fonti." },
      ]}
      prerequisites={[
        "Nessuna raccomandazione clinica automatica: le scadenze le indica il medico",
        "Valutazione del perimetro regolatorio (software come dispositivo medico)",
        "Promemoria senza dati sanitari nel testo di email e notifiche",
        "Consenso separato per le comunicazioni",
        "Revisione clinica dei materiali informativi",
      ]}
      notes={<p>Non proporremo programmi di prevenzione «personalizzati» generati da un algoritmo: decide il tuo medico.</p>}
    />
  );
}

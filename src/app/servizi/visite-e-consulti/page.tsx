import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Visite e videoconsulti — in preparazione",
  description: "Visite e videoconsulti con professionisti verificati: servizio di Cura Privata in preparazione, non ancora prenotabile.",
};

export default function VisitePage() {
  return (
    <ComingSoonPage
      eyebrow="Visite e videoconsulti"
      title="Parlare con un professionista, quando serve."
      lead="Un colloquio in presenza o a distanza con medici e strutture verificati, partendo dai documenti che hai già ordinato."
      art="dialogue"
      interest="visite"
      plan={[
        { title: "Scegli il professionista", text: "Nome, specialità e iscrizione all'albo visibili prima di prenotare." },
        { title: "Prepari la visita", text: "Porti con te i referti spiegati e le domande già scritte." },
        { title: "Ricevi un riepilogo", text: "Quello che il professionista ti scrive resta nel tuo spazio, non in una email." },
      ]}
      prerequisites={[
        "Professionisti e strutture contrattualizzati, con iscrizione all'albo verificata",
        "Copertura assicurativa e responsabilità professionale definite",
        "Piattaforma video conforme per uso sanitario e accordi sul trattamento dei dati",
        "Regole sulla telemedicina applicabili verificate da un consulente",
        "Prezzi, disdette e rimborsi pubblicati prima della prenotazione",
        "Disponibilità reali, non simulate",
      ]}
    />
  );
}

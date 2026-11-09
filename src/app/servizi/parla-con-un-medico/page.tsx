import type { Metadata } from "next";
import { CalendarClock, FileText, MonitorSmartphone, NotebookPen } from "lucide-react";
import { ServiceLanding } from "@/components/offerta/service-landing";

export const metadata: Metadata = {
  title: "Parla con un medico",
  description: "Un videoconsulto con un medico che ha già letto i documenti che hai scelto di condividere. Prezzo e tempi chiari, riepilogo scritto nella tua area personale.",
  alternates: { canonical: "/servizi/parla-con-un-medico" },
};

const DIFFERENCE = [
  { icon: FileText, title: "Il medico arriva preparato", text: "Legge prima i documenti che scegli: il tempo del colloquio è tutto per le tue domande." },
  { icon: CalendarClock, title: "Scegli tu quando", text: "Indichi due o tre momenti comodi; il medico conferma quello disponibile." },
  { icon: MonitorSmartphone, title: "Da computer o telefono", text: "Ricevi il collegamento nella tua area personale, non in una email." },
  { icon: NotebookPen, title: "Un riepilogo scritto", text: "Dopo il colloquio il medico lascia un breve riepilogo, che resta tuo." },
];

export default function ParlaConUnMedicoPage() {
  return (
    <ServiceLanding
      id="parla-con-un-medico"
      secondaryCta={{ href: "/strumenti/preparati-alla-visita", label: "Preparati alla visita, gratis" }}
      waitlist="visite"
      prerequisites={[
        "Medici con contratto e iscrizione all'Albo verificata",
        "Piattaforma video adatta all'uso sanitario e accordi sul trattamento dei dati",
        "Regole sulla telemedicina applicabili verificate da un consulente",
        "Disponibilità reali dei medici, prezzi, disdette e rimborsi pubblicati",
      ]}
    >
      <section aria-labelledby="differenza-titolo" className="py-16 sm:py-24">
        <div className="container-rc">
          <h2 id="differenza-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Che cosa cambia rispetto a una videochiamata qualsiasi
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {DIFFERENCE.map(({ icon: Icon, title, text }) => (
              <li key={title} className="card p-6 sm:p-7">
                <span className="tone-icon h-12 w-12">
                  <Icon aria-hidden className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-lg text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ServiceLanding>
  );
}

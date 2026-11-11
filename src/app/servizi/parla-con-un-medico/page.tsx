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
    >
      <section aria-labelledby="differenza-titolo" className="stage-warm py-14 sm:py-24">
        <div className="container-rc">
          <h2 id="differenza-titolo" className="display-lg max-w-3xl">
            Non una videochiamata qualsiasi.
          </h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {DIFFERENCE.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-5 rounded-[1.75rem] bg-paper/80 p-6 shadow-[var(--shadow-card)] sm:p-7">
                <span className="tone-icon h-14 w-14 shrink-0">
                  <Icon aria-hidden className="h-7 w-7" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-[1.375rem] font-bold leading-snug text-ink">{title}</h3>
                  <p className="mt-1.5 text-lg text-ink-soft">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ServiceLanding>
  );
}

import type { Metadata } from "next";
import { CalendarClock, FileText, MonitorSmartphone, NotebookPen } from "lucide-react";
import { ServiceLanding } from "@/components/offerta/service-landing";

export const metadata: Metadata = {
  title: "Videoconsulto con medico generalista",
  description: "Parla con un medico di medicina generale in video, su appuntamento, dopo che ha letto i documenti che scegli. Prezzo fisso, fasce davvero libere, riepilogo scritto nella tua area personale.",
  alternates: { canonical: "/servizi/parla-con-un-medico" },
};

const DIFFERENCE = [
  { icon: FileText, title: "Il medico arriva preparato", text: "Legge prima i documenti che scegli: il tempo del colloquio è tutto per le tue domande." },
  { icon: CalendarClock, title: "Scegli tu quando", text: "Vedi solo le fasce libere; il medico conferma la tua o ne propone un'altra." },
  { icon: MonitorSmartphone, title: "Da computer o telefono", text: "Entri nella sala d'attesa dalla tua area personale; se la connessione cade, ti ricolleghi o sposti l'appuntamento." },
  { icon: NotebookPen, title: "Un riepilogo scritto", text: "Dopo il colloquio il medico lascia un breve riepilogo, che resta tuo." },
];

export default function ParlaConUnMedicoPage() {
  return (
    <ServiceLanding
      id="parla-con-un-medico"
      secondaryCta={{ href: "/strumenti/preparati-alla-visita", label: "Preparati alla visita, gratis" }}
    >
      <section aria-labelledby="differenza-titolo" className="panel-section tone-medico section bg-tone-soft">
        <div className="container-rc">
          <p className="eyebrow tone-text">Che cosa cambia</p>
          <h2 id="differenza-titolo" className="display-lg mt-4 max-w-3xl">
            Non una videochiamata qualsiasi.
          </h2>
          <ul className="mt-7 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-5">
            {DIFFERENCE.map(({ icon: Icon, title, text }) => (
              <li key={title} className="tile-card">
                <span aria-hidden className="tile-ico tile-ico-tone">
                  <Icon />
                </span>
                <div>
                  <h3 className="tile-card-title">{title}</h3>
                  <p className="tile-card-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ServiceLanding>
  );
}

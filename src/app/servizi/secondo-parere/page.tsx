import type { Metadata } from "next";
import { Clock3, FileSearch, ShieldCheck, UserRoundCheck } from "lucide-react";
import { ServiceLanding } from "@/components/offerta/service-landing";

export const metadata: Metadata = {
  title: "Chiedi un secondo parere",
  description: "Un medico della specialità giusta valuta i tuoi documenti e risponde per iscritto a una domanda precisa. Parere firmato, mai scritto da un'intelligenza artificiale.",
  alternates: { canonical: "/servizi/secondo-parere" },
};

const TRANSPARENCY = [
  { icon: UserRoundCheck, title: "Non è una risposta dell'intelligenza artificiale", text: "Il parere è scritto e firmato da un medico abilitato, identificabile, sotto la sua responsabilità." },
  { icon: FileSearch, title: "Il medico valuta i documenti", text: "Lavora sui documenti che scegli di condividere e può chiederti integrazioni prima di rispondere." },
  { icon: Clock3, title: "Prezzo e tempi prima di pagare", text: "Sai quanto costa e in quanto tempo, prima di qualsiasi addebito." },
  { icon: ShieldCheck, title: "Il medico può non accettare", text: "Se la documentazione non basta o serve una visita in presenza, te lo dice e il pagamento ti viene restituito." },
];

export default function SecondoParerePage() {
  return (
    <ServiceLanding
      id="secondo-parere"
      secondaryCta={{ href: "/inizia", label: "Non sei sicuro? Ti aiutiamo" }}
      waitlist="secondo-parere"
      prerequisites={[
        "Medici con contratto e iscrizione all'Albo verificata",
        "Copertura assicurativa e responsabilità professionale definite",
        "Regole su rimborsi e annullamenti approvate da un legale",
        "Inquadramento fiscale e sanitario verificato da un consulente",
      ]}
    >
      <section aria-labelledby="garanzie-titolo" className="py-16 sm:py-24">
        <div className="container-rc">
          <h2 id="garanzie-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Trasparenza, prima di tutto.
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {TRANSPARENCY.map(({ icon: Icon, title, text }) => (
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

import type { Metadata } from "next";
import { Clock3, FileSearch, ShieldCheck, UserRoundCheck } from "lucide-react";
import { ServiceLanding } from "@/components/offerta/service-landing";

export const metadata: Metadata = {
  title: "Secondo parere specialistico",
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
    >
      <section aria-labelledby="garanzie-titolo" className="panel-section scope-strong tone-parere section bg-petrol">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow">Chi risponde, e come</p>
            <h2 id="garanzie-titolo" className="display-lg mt-4 text-ink">
              Trasparenza, prima di tutto.
            </h2>
          </div>
          <ul className="fact-grid">
            {TRANSPARENCY.map(({ icon: Icon, title, text }) => (
              <li key={title} className="fact">
                <h3 className="fact-title">
                  <Icon aria-hidden strokeWidth={1.8} />
                  {title}
                </h3>
                <p className="fact-text">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ServiceLanding>
  );
}

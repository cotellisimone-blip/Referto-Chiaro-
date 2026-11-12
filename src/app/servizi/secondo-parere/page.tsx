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
    >
      <section aria-labelledby="garanzie-titolo" className="scope-strong tone-parere stage-blue py-10 sm:py-24">
        <div className="container-rc">
          <p className="eyebrow !text-[var(--tone-accent)]">Chi risponde, e come</p>
          <h2 id="garanzie-titolo" className="display-lg mt-4">
            Trasparenza, prima di tutto.
          </h2>
          <ul className="mt-6 grid gap-x-12 sm:mt-10 sm:grid-cols-2">
            {TRANSPARENCY.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 border-t border-line py-5 sm:gap-5 sm:py-7">
                <Icon aria-hidden className="mt-1 h-8 w-8 shrink-0 text-[var(--tone-accent)]" strokeWidth={1.6} />
                <div>
                  <h3 className="text-[1.375rem] font-bold leading-snug text-ink">{title}</h3>
                  <p className="mt-2 text-lg text-ink-soft">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ServiceLanding>
  );
}

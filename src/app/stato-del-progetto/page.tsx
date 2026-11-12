import type { Metadata } from "next";
import { CircleDashed } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EcosystemCards } from "@/components/ui/ecosystem-cards";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { CORE_SERVICES } from "@/domain/offerta";
import { PREREQUISITES, PREREQUISITES_DOMICILIO, WAITLIST_INTEREST } from "@/content/stato-progetto";
import { PRESTAZIONI } from "@/domain/prestazioni/listino";

export const metadata: Metadata = {
  title: "Stato del progetto",
  description: "Che cosa manca prima che ogni servizio di Cura Privata diventi reale, detto chiaramente.",
  alternates: { canonical: "/stato-del-progetto" },
};

const DOMICILIO = { id: "domicilio" as const, name: PRESTAZIONI.domicilio.title, tone: "medico" as const };

export default function StatoDelProgettoPage() {
  return (
    <>
      <PageHeader compact eyebrow="Trasparenza" title="Stato del progetto" lead="Oggi Cura Privata è una versione dimostrativa. Ecco che cosa deve succedere prima che ogni servizio diventi reale." />
      <div className="container-rc py-12 sm:py-16">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[CORE_SERVICES[0], DOMICILIO, ...CORE_SERVICES.slice(1)].map((s) => {
            const interest = s.id === "domicilio" ? ("domicilio" as const) : WAITLIST_INTEREST[s.id];
            const prerequisites = s.id === "domicilio" ? PREREQUISITES_DOMICILIO : PREREQUISITES[s.id];
            return (
              <li key={s.id} className={`tone-${s.tone}`}>
                <section aria-labelledby={`stato-${s.id}`} className="service-card tone-band p-6 sm:p-7">
                  <h2 id={`stato-${s.id}`} className="text-[1.5rem] font-bold leading-tight text-ink">
                    {s.name}
                  </h2>
                  <p className="tone-text mt-1 font-semibold">Versione dimostrativa</p>
                  <ul className="mt-5 space-y-3 text-lg text-ink-soft">
                    {prerequisites.map((p) => (
                      <li key={p} className="flex gap-3">
                        <CircleDashed aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  {interest ? (
                    <div className="mt-6 border-t border-line pt-5">
                      <h3 className="text-xl font-bold text-ink">Avvisami quando parte</h3>
                      <p className="mt-1 text-[1.0625rem] text-ink-soft">{s.id === "domicilio" ? "Email e CAP: nessun dato sanitario." : "Solo la tua email: nessun dato sanitario."}</p>
                      <div className="mt-4">
                        <WaitlistForm interest={interest} />
                      </div>
                    </div>
                  ) : null}
                </section>
              </li>
            );
          })}
        </ul>
        <h2 className="display-lg mt-16 text-[2rem] sm:text-[2.5rem]">Più avanti</h2>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">Idee per dopo i servizi di oggi. Partiranno solo quando saranno pronte davvero.</p>
        <div className="mt-8">
          <EcosystemCards only={["in-preparation"]} />
        </div>
      </div>
    </>
  );
}

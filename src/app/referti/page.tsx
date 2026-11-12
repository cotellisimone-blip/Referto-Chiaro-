import type { Metadata } from "next";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";
import { ServiceLanding } from "@/components/offerta/service-landing";
import { BeforeAfter } from "@/components/offerta/before-after";

export const metadata: Metadata = {
  title: "Capisci il tuo referto",
  description:
    "Il tuo referto di laboratorio spiegato in parole semplici: valori controllati riga per riga, sigle tradotte e domande da portare al medico. Informativo, non una diagnosi.",
  alternates: { canonical: "/referti" },
};

export default function RefertiPage() {
  return (
    <ServiceLanding
      id="capisci"
      secondaryCta={{ href: "/referti/esempio", label: "Guarda un report di esempio" }}
    >
      <section aria-labelledby="differenza-titolo" className="bg-mist py-10 sm:py-20">
        <div className="container-rc">
          <h2 id="differenza-titolo" className="display-lg text-center text-[2rem] sm:text-[2.5rem]">
            Lo stesso referto, prima e dopo.
          </h2>
          <p className="mt-3 text-center text-xl text-ink-soft">Sposta il cursore.</p>
          <div className="mt-8">
            <BeforeAfter />
          </div>
        </div>
      </section>
      <section id="domande" aria-labelledby="domande-titolo" className="py-12 sm:py-20">
        <div className="container-rc grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 id="domande-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Prima di cominciare
          </h2>
          <FaqList items={FAQ.filter((f) => f.topic === "servizio" || f.topic === "dati").slice(0, 3)} />
        </div>
      </section>
    </ServiceLanding>
  );
}

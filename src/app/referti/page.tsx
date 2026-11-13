import type { Metadata } from "next";
import Link from "next/link";
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
      <section aria-labelledby="differenza-titolo" className="panel-section grain section bg-mist">
        <div className="container-rc">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Prima e dopo</p>
            <h2 id="differenza-titolo" className="display-lg mt-4">
              Lo stesso referto, prima e dopo.
            </h2>
            <p className="lead mt-3">Sposta il cursore e guarda che cosa cambia.</p>
          </div>
          <div className="mt-8 sm:mt-12">
            <BeforeAfter />
          </div>
        </div>
      </section>
      <section id="domande" aria-labelledby="domande-titolo" className="section">
        <div className="container-rc grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 id="domande-titolo" className="display-lg">
              Prima di cominciare
            </h2>
            <p className="mt-4 hidden lg:block">
              <Link href="/domande-frequenti" className="link text-lg font-semibold">
                Tutte le domande frequenti
              </Link>
            </p>
          </div>
          <FaqList items={FAQ.filter((f) => f.topic === "servizio" || f.topic === "dati").slice(0, 3)} />
        </div>
      </section>
    </ServiceLanding>
  );
}

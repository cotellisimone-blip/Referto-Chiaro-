import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReportAnatomy } from "@/components/ui/report-anatomy";
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
      <section aria-labelledby="differenza-titolo" className="bg-mist py-14 sm:py-20">
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
      <section id="cosa-ricevi" aria-labelledby="cosa-ricevi-titolo" className="grain overflow-hidden bg-[var(--tone-bg)] py-16 sm:py-24">
        <div className="container-rc grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Che cosa ricevi</p>
            <h2 id="cosa-ricevi-titolo" className="display-lg mt-4">
              Un foglio chiaro, da portare in visita.
            </h2>
            <p className="mt-5 text-xl text-ink-soft">
              Per ogni esame: che cosa misura, il tuo valore con la riga da cui viene, l&apos;intervallo del laboratorio e le domande da fare. Lo stampi o lo mostri dal telefono.
            </p>
            <Link href="/referti/esempio" className="btn btn-primary btn-lg mt-9">
              Vedi il report di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
            <p className="mt-6 text-lg text-ink-soft">
              Dopo, se vuoi parlarne con qualcuno, puoi passare a{" "}
              <Link href="/servizi/parla-con-un-medico" className="link">
                un videoconsulto
              </Link>{" "}
              con lo stesso referto già pronto: non lo ricarichi.
            </p>
          </div>
          <ReportAnatomy />
        </div>
      </section>
      <section id="domande" aria-labelledby="domande-titolo" className="py-12 sm:py-20">
        <div className="container-rc grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 id="domande-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Prima di cominciare
          </h2>
          <FaqList items={FAQ.filter((f) => f.topic === "servizio" || f.topic === "dati").slice(0, 4)} />
        </div>
      </section>
    </ServiceLanding>
  );
}

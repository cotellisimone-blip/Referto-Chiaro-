import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Image as ImageIcon } from "lucide-react";
import { ReportAnatomy } from "@/components/ui/report-anatomy";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";
import { ServiceLanding } from "@/components/offerta/service-landing";

export const metadata: Metadata = {
  title: "Capisci il tuo referto",
  description:
    "Il tuo referto di laboratorio spiegato in parole semplici: valori controllati riga per riga, sigle tradotte e domande da portare al medico. Informativo, non una diagnosi.",
  alternates: { canonical: "/referti" },
};

const ACCEPTED = [
  { icon: FileText, title: "Referti di laboratorio in PDF", text: "Analisi del sangue e delle urine, come le scarichi dal sito del laboratorio." },
  { icon: ImageIcon, title: "Foto o scansioni leggibili", text: "Una foto dritta e nitida del foglio stampato. Ti chiederemo di controllare ogni valore." },
];

export default function RefertiPage() {
  return (
    <ServiceLanding
      id="capisci"
      secondaryCta={{ href: "/referti/esempio", label: "Guarda un esempio" }}
      prerequisites={[
        "Revisione dei testi delle guide e delle spiegazioni da parte di un medico",
        "Valutazione d'impatto sulla protezione dei dati e contratti con i fornitori",
        "Inquadramento normativo del servizio verificato da un consulente",
        "Caricamento di documenti veri attivato solo dopo questi passaggi",
      ]}
    >
      <section id="documenti" aria-labelledby="documenti-titolo" className="py-16 sm:py-24">
        <div className="container-rc">
          <h2 id="documenti-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Quali documenti puoi caricare
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {ACCEPTED.map(({ icon: Icon, title, text }) => (
              <li key={title} className="card p-6 sm:p-7">
                <span className="tone-icon h-14 w-14">
                  <Icon aria-hidden className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">{title}</h3>
                <p className="mt-2 text-lg text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
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
      <section id="domande" aria-labelledby="domande-titolo" className="py-16 sm:py-24">
        <div className="container-rc grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 id="domande-titolo" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Prima di cominciare
          </h2>
          <FaqList items={FAQ.filter((f) => f.topic === "servizio" || f.topic === "dati").slice(0, 6)} />
        </div>
      </section>
    </ServiceLanding>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Files, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Inizia" };

const CHOICES = [
  {
    icon: FileText,
    title: "Comprendere un referto",
    text: "Un esame di laboratorio spiegato in parole semplici, con i valori controllati da te.",
    status: "Disponibile come esempio",
    href: "/esempio",
    cta: "Esplora con un esempio",
    active: true,
  },
  {
    icon: Files,
    title: "Preparare una visita con più referti",
    text: "Un dossier ordinato da portare al medico, con cronologia e domande.",
    status: "Disponibile come esempio",
    href: "/accedi?next=/area/dossier",
    cta: "Prova nell'area personale",
    active: true,
  },
  {
    icon: Stethoscope,
    title: "Richiedere un medico",
    text: "Un secondo parere da un professionista abilitato, su un quesito specifico.",
    status: "Servizio in preparazione",
    href: "/secondo-parere",
    cta: "Scopri come funzionerà",
    active: false,
  },
];

export default function IniziaPage() {
  return (
    <>
      <PageHeader art="dossier" eyebrow="Inizia" title="Che cosa ti serve oggi?" lead="Per ora puoi provare il percorso completo con un referto inventato. Gli altri servizi apriranno dopo le verifiche necessarie." />
      <div className="container-rc py-14 sm:py-20">
        <ul className="grid gap-5 lg:grid-cols-3">
          {CHOICES.map(({ icon: Icon, ...c }) => (
            <li key={c.title} className={`card flex flex-col p-6 sm:p-7 ${c.active ? "border-teal/50 shadow-[var(--shadow-lift)]" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist">
                  <Icon aria-hidden className="h-6 w-6 text-teal" />
                </span>
                <span className={`chip ${c.active ? "bg-mist text-teal-deep" : "bg-cream text-ink"}`}>{c.status}</span>
              </div>
              <h2 className="mt-6 font-serif text-2xl">{c.title}</h2>
              <p className="mt-2 text-muted">{c.text}</p>
              <Link href={c.href} className={`btn mt-auto ${c.active ? "btn-primary" : "btn-secondary"} mt-8 w-full`}>
                {c.cta} <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

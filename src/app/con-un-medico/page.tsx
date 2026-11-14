import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { PRESTO_SERVIZI } from "@/components/site/presto-medico";

export const metadata: Metadata = {
  title: "Presto anche con un medico",
  description: "Visita a domicilio, videoconsulto e secondo parere arriveranno quando avremo scelto i medici con cui lavorare. Lasciaci l'email: ti scriviamo quando partono.",
};

/** Con i medici spenti (src/lib/medici.ts) tutte le pagine dei servizi con un medico portano qui. */
export default function ConUnMedico() {
  return (
    <>
      <PageHeader
        eyebrow="In preparazione"
        title="Presto anche con un medico."
        lead="Stiamo scegliendo i medici con cui lavorare. Finché i contratti non sono firmati non vendiamo visite né consulti: quando partono, ti scriviamo una volta."
      />
      <section className="section-tight">
        <div className="container-rc grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div className="min-w-0">
            <h2 className="display-md">Che cosa arriverà</h2>
            <ul className="mt-6 grid gap-3">
              {PRESTO_SERVIZI.map(({ icon: Icon, t, d }) => (
                <li key={t} className="presto-row tone-medico">
                  <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone shrink-0">
                    <Icon />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="presto-row-name">{t}</span>
                    <span className="presto-row-line">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-soft">
              Intanto puoi già far spiegare un referto, tenere in ordine i numeri di tutta la famiglia e preparare le domande per il tuo medico.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/referti" className="btn btn-primary">
                Capisci il tuo referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/strumenti/domande-per-il-medico" className="btn btn-secondary">
                Domande per il tuo medico
              </Link>
            </div>
          </div>
          <div id="avvisami" className="min-w-0">
            <WaitlistForm interest="visite" />
          </div>
        </div>
      </section>
    </>
  );
}

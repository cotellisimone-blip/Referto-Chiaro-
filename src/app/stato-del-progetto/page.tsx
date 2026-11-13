import type { Metadata } from "next";
import Link from "next/link";
import { CircleDashed, FolderHeart, Sprout } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { LinkCards } from "@/components/ui/link-cards";
import { OFFER_ICON } from "@/components/offerta/service-triad";
import { StatusNotify } from "@/components/site/status-notify";
import { PREREQUISITES, PREREQUISITES_DOMICILIO } from "@/content/stato-progetto";
import { ECOSYSTEM } from "@/domain/ecosystem";
import { offerItems, type OfferKey } from "@/domain/prestazioni/offerta-completa";

export const metadata: Metadata = {
  title: "Stato del progetto",
  description: "Che cosa manca prima che ogni servizio di Cura Privata diventi reale, detto chiaramente.",
  alternates: { canonical: "/stato-del-progetto" },
};

const MISSING: Record<OfferKey, string[]> = {
  capisci: PREREQUISITES.capisci,
  domicilio: PREREQUISITES_DOMICILIO,
  video: PREREQUISITES["parla-con-un-medico"],
  parere: PREREQUISITES["secondo-parere"],
};

/** Nome breve del servizio e interesse registrato nella lista d'attesa. */
const NOTIFY = [
  { interest: "completo", label: "Capisci il referto" },
  { interest: "domicilio", label: "Visita a domicilio" },
  { interest: "visite", label: "Videoconsulto" },
  { interest: "secondo-parere", label: "Secondo parere" },
] as const;

const LATER_ICON = { archivio: FolderHeart, prevenzione: Sprout } as const;

/** Stato del progetto, grafica «Luce»: una scheda per servizio con ciò che manca, poi un solo modulo «Avvisami». */
export default function StatoDelProgettoPage() {
  const later = ECOSYSTEM.filter((s) => s.status === "in-preparation").map((s) => ({
    href: s.href,
    icon: LATER_ICON[s.id as keyof typeof LATER_ICON] ?? Sprout,
    title: s.name,
    text: s.short,
    go: "Come sarà",
  }));
  return (
    <>
      <PageHeader eyebrow="Stato del progetto" title="Che cosa manca, detto chiaramente." lead="Oggi Cura Privata è una versione dimostrativa. Ecco che cosa deve succedere prima che ogni servizio diventi reale.">
        <p className="mt-7">
          <a href="#avvisami" className="btn btn-primary btn-lg">
            Avvisami quando parte
          </a>
        </p>
      </PageHeader>

      <section aria-labelledby="servizi-stato-titolo" className="section">
        <div className="container-rc">
          <h2 id="servizi-stato-titolo" className="display-lg max-w-3xl">
            Servizio per servizio.
          </h2>
          <ul className="status-grid mt-7 sm:mt-10">
            {offerItems().map((s) => {
              const Icon = OFFER_ICON[s.icon];
              return (
                <li key={s.key} className={`tone-${s.tone}`}>
                  <section aria-labelledby={`stato-${s.key}`} className="status-card">
                    <div className="flex items-center gap-4">
                      <span aria-hidden className="tile-ico tile-ico-tone">
                        <Icon />
                      </span>
                      <div className="min-w-0">
                        <h3 id={`stato-${s.key}`} className="svc-card-title">
                          <Link href={s.href} className="hover:underline">
                            {s.name}
                          </Link>
                        </h3>
                        <p className="tone-text mt-0.5 text-[1.0625rem] font-bold">Versione dimostrativa</p>
                      </div>
                    </div>
                    <ul className="status-list">
                      {MISSING[s.key].map((p) => (
                        <li key={p}>
                          <CircleDashed aria-hidden />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </section>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Section id="avvisami" tone="mist" eyebrow="Lista d'attesa" title="Avvisami quando parte." lead="Solo la tua email, e il CAP dove serve a capire la zona. Nessun dato sanitario.">
        <div className="max-w-2xl">
          <StatusNotify options={[...NOTIFY]} />
        </div>
      </Section>

      <Section id="piu-avanti" title="Più avanti." lead="Idee per dopo i servizi di oggi. Partiranno solo quando saranno pronte davvero." size="md">
        <LinkCards items={later} columns={2} />
      </Section>
    </>
  );
}

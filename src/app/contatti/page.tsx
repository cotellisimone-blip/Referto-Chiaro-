import type { Metadata } from "next";
import { Building2, FileX2, Mail, MessageCircleQuestionMark, Siren, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { LinkCards } from "@/components/ui/link-cards";
import { readTitolare } from "@/domain/titolare";
import { withoutDoctors } from "@/lib/medici";

export const metadata: Metadata = {
  title: "Contatti",
  description: "Come contattare Cura Privata. Per le emergenze chiama il 112: questo sito non è adatto alle urgenze.",
  alternates: { canonical: "/contatti" },
};

/** Senza medici (src/lib/medici.ts) la scheda «Sei un medico?» non compare: la pagina a cui porta è spenta. */
const ELSEWHERE = withoutDoctors([
  { icon: MessageCircleQuestionMark, title: "Hai una domanda sul servizio?", href: "/domande-frequenti", text: "Prezzi, tempi, dati: le risposte dirette.", go: "Leggi" },
  { icon: Stethoscope, title: "Sei un medico?", href: "/per-i-medici", text: "Come si lavora con Cura Privata.", go: "Scopri" },
  { icon: Building2, title: "Rappresenti una struttura?", href: "/per-le-strutture", text: "Laboratori, poliambulatori, farmacie.", go: "Scopri" },
]);

export default function Page() {
  const t = readTitolare();
  return (
    <>
      <PageHeader art="dialogue" eyebrow="Contatti" title="Come contattarci." lead="Il servizio non è ancora aperto al pubblico. Qui trovi che cosa puoi fare già oggi, e che cosa no." />

      <section aria-labelledby="contatti-titolo" className="section">
        <div className="container-rc">
          <h2 id="contatti-titolo" className="sr-only">
            Canali di contatto
          </h2>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:gap-5 lg:grid-cols-3">
            <div className="callout">
              <span aria-hidden className="callout-ico">
                <Mail />
              </span>
              <div className="min-w-0">
                <h3 className="callout-title">{t ? "Chi c'è dietro" : "Assistenza"}</h3>
                {t ? (
                  <p className="callout-text break-words" data-testid="titolare-contatti">
                    {t.name} · P.IVA {t.vat}
                    {t.address ? (
                      <>
                        <br />
                        {t.address}
                      </>
                    ) : null}
                    {t.email ? (
                      <>
                        <br />
                        Email:{" "}
                        <a href={`mailto:${t.email}`} className="link font-semibold">
                          {t.email}
                        </a>
                      </>
                    ) : null}
                    {t.pec ? (
                      <>
                        <br />
                        PEC: {t.pec}
                      </>
                    ) : null}
                  </p>
                ) : (
                  <p className="callout-text">I canali di contatto e assistenza saranno pubblicati all&apos;apertura del servizio, insieme ai dati del titolare.</p>
                )}
              </div>
            </div>
            <div className="callout callout-warn">
              <span aria-hidden className="callout-ico">
                <FileX2 />
              </span>
              <div>
                <h3 className="callout-title">Niente referti, per ora</h3>
                <p className="callout-text">Non inviarci referti o informazioni sulla tua salute, in nessuna forma: in questa fase non possiamo trattarli.</p>
              </div>
            </div>
            <div className="callout callout-danger">
              <span aria-hidden className="callout-ico">
                <Siren />
              </span>
              <div>
                <h3 className="callout-title">Emergenze</h3>
                <p className="callout-text">Per qualsiasi urgenza sanitaria chiama il 112 o rivolgiti ai servizi di emergenza. Questo sito non è adatto alle urgenze.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section id="altrove" title="Forse cerchi questo." size="md">
        <LinkCards items={ELSEWHERE} />
      </Section>
    </>
  );
}

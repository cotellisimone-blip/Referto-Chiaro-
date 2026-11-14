import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, ClipboardList, Compass, ListChecks, Search, X } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Wave } from "@/components/ui/wave";
import { LinkCards } from "@/components/ui/link-cards";
import { CapisciFeature, DoctorServices } from "@/components/offerta/service-triad";
import { StepsVisual } from "@/components/offerta/service-visuals";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { mediciEnabled } from "@/lib/medici";
import { PrestoMedico } from "@/components/site/presto-medico";

/** 14/11/2026: senza medici (src/lib/medici.ts) la pagina presenta il referto e gli strumenti gratuiti. */
const MEDICI = mediciEnabled();

export const metadata: Metadata = {
  title: "I servizi",
  description: MEDICI
    ? "Capisci il tuo referto, visita a domicilio, videoconsulto con un medico, secondo parere specialistico: i servizi di Cura Privata e gli strumenti gratuiti."
    : "Capisci il tuo referto, i numeri di tutta la famiglia nel tempo e gli strumenti gratuiti per arrivare preparato alla visita: che cosa offre Cura Privata.",
  alternates: { canonical: "/servizi" },
};

const NOT_DONE = [
  "Diagnosi automatiche",
  "Prescrizioni o terapie senza una visita del medico",
  "Triage d'urgenza",
  "Lettura diagnostica di immagini TAC, RM o ecografie",
  "Pareri medici senza un professionista realmente coinvolto",
  "Vendita o uso pubblicitario dei tuoi dati",
];

const FREE = [
  { icon: ClipboardList, title: "Preparati alla visita", href: "/strumenti/preparati-alla-visita", text: "In 2 minuti, la lista di cosa portare e cosa chiedere." },
  { icon: ListChecks, title: "Domande per il medico", href: "/strumenti/domande-per-il-medico", text: "Le domande utili per gli esami che hai fatto." },
  { icon: BookOpenText, title: "Guide agli esami", href: "/guide", text: "Che cosa misura un esame e come si legge, con le fonti." },
  { icon: Search, title: "Glossario", href: "/glossario", text: "Le sigle del referto, spiegate in una riga." },
];

/**
 * Servizi, grafica «Luce»: prima il referto (automatico, in grande), poi i servizi con un medico, ognuno con
 * disponibilità e richiesta diretta. In fondo gli strumenti gratuiti e che cosa non facciamo.
 */
export default function ServiziPage() {
  const pdp = puntoDiPartenzaEnabled();
  const free = pdp ? [{ icon: Compass, title: "Punto di Partenza", href: "/punto-di-partenza", text: "Non hai ancora esami? Capisci da dove cominciare." }, ...FREE.slice(0, 3)] : FREE;
  return (
    <>
      <section aria-labelledby="servizi-titolo" className="page-hero page-hero-wave">
        <div className="container-rc page-hero-inner page-hero-overlap page-hero-split">
          <div>
            <p className="eyebrow">I servizi</p>
            <h1 id="servizi-titolo" className="page-title mt-4 max-w-[17ch]">
              {MEDICI ? "Dal referto al medico, un passo alla volta." : "Dal referto alla visita, un passo alla volta."}
            </h1>
            <p className="lead mt-5 max-w-[38rem]">{MEDICI ? "Parti dal tuo referto, spiegato in parole semplici. Quando serve una persona c'è un medico: a casa, in video o per un secondo parere." : "Parti dal tuo referto, spiegato in parole semplici. Poi lo ritrovi nel tuo spazio, in fila con gli altri, e arrivi dal tuo medico con le domande pronte."}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link href="/inizia" className="btn btn-primary btn-lg">
                Ti aiutiamo a scegliere <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/prezzi" className="link inline-flex min-h-11 items-center text-lg font-semibold">
                Confronta prezzi e tempi
              </Link>
            </div>
          </div>
          <StepsVisual />
        </div>
        <Wave className="text-canvas" />
      </section>

      {/* IL REFERTO: da qui si parte */}
      <div className="container-rc">
        <CapisciFeature className="svc-feature-overlap" />
      </div>

      {/* CON UN MEDICO: solo con l'interruttore acceso; spento resta il blocco discreto «Presto anche con un medico». */}
      {MEDICI ? (
      <section id="con-un-medico" aria-labelledby="medico-titolo" className="section scroll-mt-24">
        <div className="container-rc">
          <div className="max-w-3xl">
            <p className="eyebrow">Con un medico</p>
            <h2 id="medico-titolo" className="display-lg mt-3">
              Quando serve una persona.
            </h2>
            <p className="lead mt-4">Il prezzo è fisso e paghi solo dopo che il medico ha confermato: prima vedi nome, orario e importo.</p>
          </div>
          <div className="mt-7 sm:mt-10">
            <DoctorServices />
          </div>
          <p className="mt-5 text-[1.0625rem] text-muted">
            Versione dimostrativa: medici, fasce e pagamenti sono simulati.{" "}
            <Link href="/stato-del-progetto" className="link font-semibold">
              Stato del progetto
            </Link>
          </p>
        </div>
      </section>
      ) : (
        <section aria-label="Presto anche con un medico" className="section">
          <div className="container-rc">
            <PrestoMedico />
          </div>
        </section>
      )}

      <Section id="gratis" tone="mist" eyebrow="Gratis, per tutti" title="Strumenti e guide, senza registrarti.">
        <LinkCards items={free} />
      </Section>

      <Section id="non-facciamo" eyebrow="Per chiarezza" title="Che cosa non facciamo." size="md">
        <ul className="excl-grid">
          {NOT_DONE.map((x) => (
            <li key={x}>
              <span aria-hidden className="cross-dot">
                <X />
              </span>
              {x}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="faq-servizi" eyebrow="Domande" title="Prima di scegliere." size="md">
        <FaqList items={FAQ.filter((f) => f.topic === "pagamenti" || f.topic === "servizio").slice(0, 5)} />
      </Section>
    </>
  );
}

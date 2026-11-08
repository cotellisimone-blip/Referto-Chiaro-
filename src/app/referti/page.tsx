import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CircleDashed, FileText, Image as ImageIcon, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { ReportAnatomy } from "@/components/ui/report-anatomy";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";

export const metadata: Metadata = {
  title: "Comprendi i tuoi referti",
  description:
    "Il primo servizio di Cura Privata: le sigle e i valori dei referti di laboratorio spiegati in linguaggio chiaro, con le domande da portare al medico. Informativo, non una diagnosi.",
};

const ACCEPTED = [
  { icon: FileText, title: "Referti di laboratorio in PDF", text: "Analisi del sangue e delle urine, come le scarichi dal sito del laboratorio." },
  { icon: ImageIcon, title: "Foto o scansioni leggibili", text: "Una foto dritta e nitida del foglio stampato. Ti chiederemo di controllare ogni valore." },
];

const NOT_FOR = [
  "Referti istologici o genetici",
  "Immagini diagnostiche (TAC, risonanza, ecografie)",
  "Minori e gravidanza",
  "Emergenze o sintomi in corso: chiama il 112",
];

const GOOD = [
  "Ogni valore è riportato esattamente come nel documento, con pagina e riga",
  "Confermi tu i valori prima di qualsiasi spiegazione",
  "Le sigle sono spiegate con parole di tutti i giorni",
  "Ricevi le domande da portare al medico, in un foglio stampabile",
];
const LIMITS = [
  "Non dice se un risultato è un problema o se stai bene",
  "Non suggerisce farmaci, terapie, diete o altri esami",
  "Non sostituisce la visita né il medico che ti conosce",
];

export default function RefertiPage() {
  return (
    <>
      <PageHeader
        art="translate"
        eyebrow="Comprendi i tuoi referti"
        title="Il linguaggio dei referti, spiegato con parole semplici."
        lead="Sigle, unità di misura, intervalli di riferimento: li traduciamo in parole di tutti i giorni e ti prepariamo le domande per il tuo medico."
      >
        <p className="mt-7 inline-flex items-start gap-2.5 rounded-xl border border-line bg-paper px-4 py-3 text-[1.0625rem] text-ink">
          <CircleDashed aria-hidden className="mt-1 h-5 w-5 shrink-0 text-teal" />
          <span>
            <strong className="font-bold">Versione dimostrativa.</strong> Oggi puoi provarlo solo su referti inventati: i caricamenti di documenti veri restano spenti finché le verifiche non sono concluse.
          </span>
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/referti/esempio" className="btn btn-primary btn-lg">
            Prova la demo <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
          <Link href="/come-funziona" className="btn btn-secondary btn-lg">
            Come funziona
          </Link>
        </div>
      </PageHeader>

      <Section id="documenti" eyebrow="Quali documenti" title="Pensato per gli esami di laboratorio.">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <ul className="grid gap-5 sm:grid-cols-2">
            {ACCEPTED.map(({ icon: Icon, title, text }) => (
              <li key={title} className="card p-6 sm:p-7">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-marker-soft),var(--color-mist))]">
                  <Icon aria-hidden className="h-7 w-7 text-teal" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">{title}</h3>
                <p className="mt-2 text-lg text-ink-soft">{text}</p>
              </li>
            ))}
          </ul>
          <div className="rounded-[var(--radius-lg)] border border-line bg-paper p-6 sm:p-7">
            <h3 className="text-xl font-bold text-ink">Non adatto a</h3>
            <ul className="mt-4 space-y-3">
              {NOT_FOR.map((t) => (
                <li key={t} className="flex gap-3 text-lg text-ink-soft">
                  <X aria-hidden className="mt-1 h-5 w-5 shrink-0 text-danger" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <section id="cosa-ricevi" aria-labelledby="cosa-ricevi-titolo" className="grain overflow-hidden bg-mist py-16 sm:py-24">
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
          </div>
          <ReportAnatomy />
        </div>
      </section>

      <Section id="vantaggi-limiti" eyebrow="Vantaggi e limiti" title="Che cosa fa, e che cosa no.">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-7 sm:p-8">
            <h3 className="text-[1.375rem] font-bold text-ink">Che cosa fa</h3>
            <ul className="mt-5 space-y-3">
              {GOOD.map((t) => (
                <li key={t} className="flex gap-3 text-lg text-ink-soft">
                  <Check aria-hidden className="mt-1 h-5 w-5 shrink-0 text-teal" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-7 sm:p-8">
            <h3 className="text-[1.375rem] font-bold text-ink">Che cosa non fa</h3>
            <ul className="mt-5 space-y-3">
              {LIMITS.map((t) => (
                <li key={t} className="flex gap-3 text-lg text-ink-soft">
                  <X aria-hidden className="mt-1 h-5 w-5 shrink-0 text-danger" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-mist px-4 py-3 text-[1.0625rem] text-ink">Le spiegazioni informative non sostituiscono una valutazione medica.</p>
          </div>
        </div>
      </Section>

      <Section id="quando" tone="paper" eyebrow="Con i tuoi referti veri" title="Quando potrai usarlo davvero.">
        <div className="max-w-3xl space-y-4 text-lg text-ink-soft">
          <p>
            Il servizio è già costruito: lettura del documento, controllo dei valori, spiegazione e foglio PDF. Resta spento per i documenti veri finché non sono chiuse le verifiche che
            un servizio sanitario richiede: protezione dei dati, contratti con i fornitori, inquadramento normativo e revisione dei testi da parte di un medico.
          </p>
          <p>
            Lo diciamo così perché è la verità: non attiveremo i caricamenti per una data di calendario, ma solo quando saranno pronti. Nel frattempo puoi{" "}
            <Link href="/sicurezza-e-privacy" className="link">
              leggere come proteggeremo i tuoi dati
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section id="domande" eyebrow="Domande" title="Prima di provare.">
        <FaqList items={FAQ.filter((f) => f.topic === "servizio" || f.topic === "dati").slice(0, 6)} />
      </Section>
    </>
  );
}

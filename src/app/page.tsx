import Link from "next/link";
import { ArrowRight, BookOpenText, Check, FileCheck2, ListChecks, Lock, MessageSquareText, ScanSearch, ShieldOff, Stethoscope, UserRound, X } from "lucide-react";
import { HeroDocument } from "@/components/demo/hero-document";
import { IllustrationDialogue, IllustrationMagnify, IllustrationTranslate } from "@/components/brand/illustrations";
import { Reveal } from "@/components/ui/reveal";
import { EcosystemCards } from "@/components/ui/ecosystem-cards";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";
import { ReportAnatomy } from "@/components/ui/report-anatomy";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";

/*
 * Home di Cura Privata, marchio ombrello. In 5 secondi deve dire che cosa fa OGGI (capire i referti)
 * senza vendere come disponibili i servizi futuri, che compaiono con l'etichetta «In preparazione».
 * Testo grande, frasi brevi, una sola azione per volta: pensata anche per chi legge dallo smartphone.
 * Firma visiva: la traccia di menta e la curva del simbolo.
 */

const STEPS = [
  { n: "01", Art: IllustrationMagnify, icon: ScanSearch, title: "Mostri il referto", text: "Leggiamo i numeri così come sono scritti. Non ne cambiamo nessuno, mai." },
  { n: "02", Art: IllustrationTranslate, icon: BookOpenText, title: "Lo leggi in parole semplici", text: "Ogni sigla spiegata con parole di tutti i giorni. Senza giudizi sulla tua salute." },
  { n: "03", Art: IllustrationDialogue, icon: Stethoscope, title: "Vai dal medico preparato", text: "Un foglio con i valori, le spiegazioni e le domande da fare. Da stampare o mostrare." },
];

const PROMISES = [
  { icon: FileCheck2, title: "I numeri restano quelli", text: "Ogni valore mostra la riga del referto da cui viene. Puoi controllare tutto, sempre." },
  { icon: ListChecks, title: "Controlli tu, prima", text: "Confermi i valori uno per uno. Spieghiamo solo quelli che hai confermato." },
  { icon: ShieldOff, title: "Nessuna diagnosi", text: "Spieghiamo le parole. Le conclusioni restano al tuo medico, che ti conosce." },
  { icon: Lock, title: "I tuoi dati sono tuoi", text: "Niente vendita di dati, niente pubblicità. Cancelli tutto quando vuoi." },
];

const FEATURED_GUIDES = [
  { slug: "emocromo", label: "Emocromo" },
  { slug: "tsh", label: "TSH" },
  { slug: "glicemia", label: "Glicemia" },
  { slug: "colesterolo-ldl", label: "Colesterolo LDL" },
  { slug: "ferritina", label: "Ferritina" },
  { slug: "creatinina", label: "Creatinina" },
  { slug: "vitamina-d", label: "Vitamina D" },
  { slug: "risonanza-magnetica", label: "Risonanza magnetica" },
];

export default function Home() {
  const faqs = FAQ.slice(0, 5);
  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-titolo" className="grain relative overflow-hidden">
        <div aria-hidden className="dots dots-fade absolute inset-x-0 top-0 -z-10 h-[760px] opacity-60" />
        <div aria-hidden className="glow-teal absolute -right-32 top-0 -z-10 h-[680px] w-[680px] rounded-full" />
        <div className="container-rc grid items-center gap-14 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-24 lg:pt-20">
          <div className="max-w-2xl">
            <p className="eyebrow rise-in">Il tuo spazio personale per la salute</p>
            <h1 id="hero-titolo" className="display-xl rise-in mt-5 text-ink">
              La tua salute, <span className="marker marker-animate">più chiara</span> e accessibile.
            </h1>
            <p className="rise-in-2 mt-7 max-w-xl text-xl text-ink-soft sm:text-[1.375rem] sm:leading-snug">
              Comprendi meglio il linguaggio dei tuoi referti e prepara le domande per il tuo medico, in uno spazio semplice e riservato.
            </p>
            <div className="rise-in-3 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/referti/esempio" className="btn btn-primary btn-lg sm:whitespace-nowrap">
                Prova la demo <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/come-funziona" className="btn btn-secondary btn-lg sm:whitespace-nowrap">
                Come funziona
              </Link>
            </div>
            <ul className="rise-in-3 mt-9 grid max-w-xl gap-x-6 gap-y-3 text-[1.0625rem] text-ink-soft sm:grid-cols-2">
              {["Su referti inventati, senza registrarti", "Nessun dato personale richiesto", "I numeri restano quelli del documento", "Le conclusioni restano al medico"].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-marker-soft">
                    <Check className="h-3.5 w-3.5 text-teal-deep" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <svg aria-hidden viewBox="0 0 64 64" className="float-slower pointer-events-none absolute -right-16 -top-12 -z-10 hidden h-[560px] w-[560px] opacity-60 lg:block">
              <path d="M49.09 16.61A23 23 0 1 0 49.09 47.39" fill="none" stroke="var(--color-marker)" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M31 20C39.5 20 44 26 44 32C44 38 39.5 44 31 44" fill="none" stroke="var(--color-marker-soft)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <div className="tilt-in">
              <HeroDocument />
            </div>
          </div>
        </div>
      </section>

      {/* CONFINE CHIARO, SUBITO */}
      <section aria-label="Che cosa fa oggi Cura Privata" className="border-y border-line/70 bg-paper">
        <div className="container-rc flex flex-col gap-3 py-5 text-[1.0625rem] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink">
            <strong className="font-bold">Oggi Cura Privata fa una cosa:</strong> ti aiuta a capire i referti di laboratorio. Gli altri servizi sono in preparazione.
          </p>
          <p className="flex items-center gap-2 text-muted">
            <MessageSquareText aria-hidden className="h-5 w-5 shrink-0 text-teal" />
            Le spiegazioni informative non sostituiscono una valutazione medica.
          </p>
        </div>
      </section>

      {/* SERVIZI */}
      <section id="servizi" aria-labelledby="servizi-titolo" className="py-20 sm:py-28">
        <div className="container-rc">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">I servizi di Cura Privata</p>
              <h2 id="servizi-titolo" className="display-lg mt-4">
                Si comincia dai referti. <span className="serif-italic">Il resto arriverà.</span>
              </h2>
            </div>
            <p className="max-w-md text-lg text-muted">Ogni servizio dice il suo stato reale. Quelli in preparazione non raccolgono dati sanitari: puoi solo chiedere di essere avvisato.</p>
          </div>
          <div className="mt-12">
            <EcosystemCards />
          </div>
        </div>
      </section>

      {/* DAL REFERTO ALLE DOMANDE GIUSTE */}
      <section id="prima-dopo" aria-labelledby="prima-dopo-titolo" className="grain relative overflow-hidden bg-mist py-20 sm:py-28">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Dal referto alle domande giuste</p>
            <h2 id="prima-dopo-titolo" className="display-lg mt-4">
              Lo stesso dato, <span className="marker">finalmente leggibile</span>.
            </h2>
          </div>
          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr_auto_0.9fr]">
            <Reveal className="sheet doc-paper flex flex-col p-6 sm:p-8">
              <p className="flex items-center justify-between gap-3 text-[1.0625rem] font-semibold text-ink">
                Nel referto <span className="chip bg-cream text-ink">Esempio inventato</span>
              </p>
              <p className="tabular mt-8 font-mono text-lg leading-9 text-ink">
                <span className="marker marker-thick">Emoglobina glicata (HbA1c) &nbsp; 5,1 % &nbsp; [4,0 - 5,6]</span>
              </p>
              <p className="tabular mt-2 font-mono text-lg leading-9 text-muted">Colesterolo LDL &nbsp; 134 mg/dL &nbsp; [&lt; 115]</p>
              <p className="mt-auto pt-6 text-[1.0625rem] text-muted">Pagina 1, riga 5</p>
            </Reveal>
            <div aria-hidden className="flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-strong text-on-strong shadow-[var(--shadow-lift)]">
                <ArrowRight className="h-6 w-6 rotate-90 lg:rotate-0" />
              </span>
            </div>
            <Reveal delay={140} className="card flex flex-col p-6 sm:p-8">
              <p className="eyebrow">In parole semplici</p>
              <p className="mt-5 text-[1.375rem] font-semibold leading-snug text-ink">
                L&apos;emoglobina glicata racconta l&apos;andamento medio dello zucchero nel sangue nelle ultime settimane, non solo il giorno del prelievo.
              </p>
              <p className="mt-5 text-[1.0625rem] text-ink-soft">
                Il valore è <strong className="tabular text-ink">5,1 %</strong>, dentro l&apos;intervallo stampato dal laboratorio. Che cosa significa per te lo dice il medico.
              </p>
            </Reveal>
            <div aria-hidden className="flex items-center justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-strong text-on-strong shadow-[var(--shadow-lift)]">
                <ArrowRight className="h-6 w-6 rotate-90 lg:rotate-0" />
              </span>
            </div>
            <Reveal delay={280} className="card flex flex-col border-teal/30 bg-[linear-gradient(180deg,var(--color-marker-soft),var(--color-paper))] p-6 sm:p-8">
              <p className="eyebrow">Da chiedere al medico</p>
              <ul className="mt-5 space-y-4 text-[1.125rem] font-medium text-ink">
                <li className="flex gap-3">
                  <span aria-hidden className="mt-0.5 font-bold text-teal">?</span>Con la mia storia, ogni quanto conviene ripetere questo esame?
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="mt-0.5 font-bold text-teal">?</span>Il colesterolo LDL sopra il riferimento richiede attenzione nel mio caso?
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TRE PASSI */}
      <section id="metodo" aria-labelledby="metodo-titolo" className="py-20 sm:py-28">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Come funziona</p>
            <h2 id="metodo-titolo" className="display-lg mt-4">
              Tre passi. <span className="serif-italic">Nessuna</span> sorpresa.
            </h2>
          </div>
          <ol className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {STEPS.map(({ n, Art, icon: Icon, title, text }, i) => (
              <Reveal as="li" key={n} delay={i * 140} className="card card-lift relative flex flex-col overflow-hidden p-7 sm:p-8">
                <div className="flex items-start justify-between">
                  <span aria-hidden className="num text-[4rem] text-sage">{n}</span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist">
                    <Icon aria-hidden className="h-7 w-7 text-teal" />
                  </span>
                </div>
                <h3 className="mt-5 text-[1.625rem] font-bold leading-tight tracking-[-0.015em] text-ink">
                  <span className="sr-only">Passo {i + 1}: </span>
                  {title}
                </h3>
                <p className="mt-3 text-lg text-ink-soft">{text}</p>
                <div aria-hidden className="reveal-art mt-8 w-full max-w-[260px] self-center">
                  <Art />
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link href="/referti/esempio" className="btn btn-primary btn-lg">
              Prova con un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* COSA RICEVI */}
      <section id="cosa-ricevi" aria-labelledby="cosa-ricevi-titolo" className="overflow-hidden bg-paper py-20 sm:py-28">
        <div className="container-rc grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Che cosa ricevi</p>
            <h2 id="cosa-ricevi-titolo" className="display-lg mt-4">
              Un foglio da portare in visita.
            </h2>
            <p className="mt-5 text-xl text-ink-soft">Tutto quello che serve per capire e per chiedere, in un documento ordinato. Lo stampi o lo mostri dal telefono.</p>
            <ul className="mt-8 space-y-5">
              {[
                ["In breve", "Che cosa misura ogni esame, senza giudizi."],
                ["Valori con la fonte", "Ogni numero con pagina e riga del tuo referto."],
                ["Domande per il medico", "Pronte da fare, così non dimentichi niente."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="num mt-0.5 w-10 shrink-0 text-[1.75rem] text-sage">0{i + 1}</span>
                  <span>
                    <span className="block text-xl font-bold text-ink">{t}</span>
                    <span className="block text-lg text-ink-soft">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/referti/esempio" className="btn btn-secondary btn-lg mt-10">
              Vedi il foglio di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
          <Reveal className="relative">
            <div aria-hidden className="glow-teal absolute -inset-10 -z-10 rounded-full" />
            <ReportAnatomy />
          </Reveal>
        </div>
      </section>

      {/* SPIEGAZIONE INFORMATIVA ≠ MEDICO */}
      <section id="ai-e-medico" aria-labelledby="ai-medico-titolo" className="py-20 sm:py-28">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Un confine netto</p>
            <h2 id="ai-medico-titolo" className="display-lg mt-4">
              Una spiegazione aiuta a capire. <span className="serif-italic">Solo un medico valuta.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Reveal className="card p-7 sm:p-8">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mist">
                  <BookOpenText aria-hidden className="h-7 w-7 text-teal" />
                </span>
                <h3 className="text-[1.5rem] font-bold leading-tight text-ink">La spiegazione informativa</h3>
              </div>
              <ul className="mt-6 space-y-3 text-lg">
                {["Spiega che cosa misura un esame e che cosa vogliono dire le sigle", "Riporta i valori esattamente come nel documento, con la riga di origine", "Ti aiuta a preparare le domande per la visita"].map((t) => (
                  <li key={t} className="flex gap-3 text-ink-soft">
                    <Check aria-hidden className="mt-1 h-5 w-5 shrink-0 text-teal" />
                    {t}
                  </li>
                ))}
                {["Non dice se stai bene o male", "Non suggerisce terapie, farmaci o esami"].map((t) => (
                  <li key={t} className="flex gap-3 text-ink-soft">
                    <X aria-hidden className="mt-1 h-5 w-5 shrink-0 text-danger" />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={140} className="card p-7 sm:p-8">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-strong">
                  <UserRound aria-hidden className="h-7 w-7 text-on-strong" />
                </span>
                <h3 className="text-[1.5rem] font-bold leading-tight text-ink">Il tuo medico</h3>
              </div>
              <ul className="mt-6 space-y-3 text-lg">
                {["Conosce la tua storia, i farmaci, gli esami precedenti", "Valuta i risultati e decide se servono altri controlli", "È l'unico che può fare una diagnosi o indicare una cura"].map((t) => (
                  <li key={t} className="flex gap-3 text-ink-soft">
                    <Check aria-hidden className="mt-1 h-5 w-5 shrink-0 text-teal" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-xl bg-mist px-4 py-3 text-[1.0625rem] text-ink">
                Il <Link href="/servizi/secondo-parere" className="link">secondo parere</Link> di Cura Privata, quando partirà, sarà scritto da un medico abilitato e identificato. Mai da un&apos;intelligenza artificiale.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROMESSE */}
      <section aria-labelledby="promesse-titolo" className="bg-paper py-20 sm:py-28">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Le nostre regole</p>
            <h2 id="promesse-titolo" className="display-lg mt-4">
              Quattro cose che puoi dare per certe.
            </h2>
          </div>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2">
            {PROMISES.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 90} className="card card-lift flex gap-5 p-6 sm:p-7">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-mist">
                  <Icon aria-hidden className="h-7 w-7 text-teal" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-lg text-ink-soft">{text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <p className="mt-8 flex items-start gap-3 text-[1.0625rem] text-ink-soft">
            <MessageSquareText aria-hidden className="mt-1 h-5 w-5 shrink-0 text-teal" />
            <span>
              Non adatto a emergenze, minori, gravidanza, referti istologici o genetici e immagini diagnostiche. In caso di emergenza chiama il <strong className="text-ink">112</strong>.
            </span>
          </p>
        </div>
      </section>

      {/* GUIDE */}
      <section id="guide" aria-labelledby="guide-titolo" className="py-20 sm:py-28">
        <div className="container-rc grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Gratis, per tutti</p>
            <h2 id="guide-titolo" className="display-lg mt-4">
              Hai solo una sigla in testa? Cercala.
            </h2>
            <p className="mt-5 text-xl text-ink-soft">
              {GUIDES.length} guide agli esami e {GLOSSARY.length} termini spiegati, con le fonti. Senza registrarti.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/guide" className="btn btn-primary">
                Tutte le guide <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/glossario" className="btn btn-secondary">
                Apri il glossario
              </Link>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {FEATURED_GUIDES.map(({ slug, label }, i) => (
              <Reveal as="li" key={slug} delay={i * 50}>
                <Link href={`/guide/${slug}`} className="card card-lift group flex min-h-16 items-center justify-between gap-3 px-5 py-4 text-lg font-semibold text-ink">
                  {label}
                  <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-teal transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="domande" aria-labelledby="faq-titolo" className="border-t border-line/70 bg-paper py-20 sm:py-28">
        <div className="container-rc grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Domande frequenti</p>
            <h2 id="faq-titolo" className="display-lg mt-4">
              Le risposte, prima di cominciare.
            </h2>
            <Link href="/domande-frequenti" className="btn btn-secondary mt-8">
              Tutte le domande <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>

      {/* CTA FINALE */}
      <section aria-labelledby="cta-titolo" className="py-20 sm:py-28">
        <div className="container-rc">
          <div className="grain relative overflow-hidden rounded-[var(--radius-xl)] bg-strong px-6 py-16 text-on-strong sm:px-14 sm:py-24">
            <svg aria-hidden viewBox="0 0 64 64" className="pointer-events-none absolute -right-24 -top-16 h-[520px] w-[520px] opacity-25">
              <path d="M49.09 16.61A23 23 0 1 0 49.09 47.39" fill="none" stroke="#7be0d2" strokeWidth="3" strokeLinecap="round" />
              <path d="M31 20C39.5 20 44 26 44 32C44 38 39.5 44 31 44" fill="none" stroke="#7be0d2" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <div className="relative max-w-3xl">
              <p className="eyebrow text-on-strong-soft">Comincia da qui</p>
              <h2 id="cta-titolo" className="display-xl mt-5 text-on-strong">
                Capire è il primo passo per prenderti cura di te.
              </h2>
              <p className="mt-6 max-w-xl text-xl text-on-strong-soft">Prova su un referto di esempio: capirai subito come funziona. Senza registrarti e senza dati personali.</p>
              <Link href="/referti/esempio" className="btn btn-on-strong btn-lg mt-10">
                Prova la demo <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <p className="mt-10 text-[1.0625rem] text-on-strong-soft">
                Sei una struttura sanitaria?{" "}
                <Link href="/per-le-strutture" className="font-semibold text-on-strong underline underline-offset-4">
                  Programma pilota
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

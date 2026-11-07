import Link from "next/link";
import { ArrowRight, BookOpenText, FileCheck2, ListChecks, Lock, MessageSquareText, ScanSearch, ShieldOff, Stethoscope } from "lucide-react";
import { HeroDocument } from "@/components/demo/hero-document";
import { DocumentLinesPattern, IllustrationDialogue, IllustrationMagnify, IllustrationTranslate } from "@/components/brand/illustrations";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCards } from "@/components/ui/service-cards";

/*
 * Home «da ricordare»: poche sezioni, frasi brevi, testo grande, una sola azione per volta.
 * Pensata per chi non ha dimestichezza con i referti e legge dallo smartphone.
 */

const STEPS = [
  { n: 1, Art: IllustrationMagnify, icon: ScanSearch, title: "Mostri il referto", text: "Leggiamo i numeri così come sono scritti. Non ne cambiamo nessuno." },
  { n: 2, Art: IllustrationTranslate, icon: BookOpenText, title: "Lo leggi in parole semplici", text: "Ogni esame spiegato con parole comuni. Senza giudizi sulla tua salute." },
  { n: 3, Art: IllustrationDialogue, icon: Stethoscope, title: "Vai dal medico preparato", text: "Un foglio con i valori, le spiegazioni e le domande da fare." },
];

const PROMISES = [
  { icon: FileCheck2, title: "I numeri restano quelli", text: "Ogni valore mostra la riga del referto da cui viene." },
  { icon: ListChecks, title: "Controlli tu, prima", text: "Confermi i valori. Solo quelli confermati vengono spiegati." },
  { icon: ShieldOff, title: "Nessuna diagnosi", text: "Spieghiamo le parole. Le conclusioni restano al tuo medico." },
  { icon: Lock, title: "I tuoi dati sono tuoi", text: "Niente vendita di dati. Puoi cancellare tutto quando vuoi." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-titolo" className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[680px] bg-[linear-gradient(180deg,var(--color-mist)_0%,var(--color-canvas)_100%)]" />
        <div className="container-rc grid items-center gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div>
            <p className="eyebrow">Per chi ha un referto in mano</p>
            <h1 id="hero-titolo" className="display mt-4 text-[2.75rem] sm:text-[3.75rem] lg:text-[4.5rem]">
              Il tuo referto, <em className="font-serif not-italic text-teal">finalmente</em> chiaro.
            </h1>
            <p className="mt-6 max-w-xl text-xl text-ink-soft sm:text-2xl">Le parole difficili spiegate in modo semplice. Le domande giuste per il tuo medico.</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/esempio" className="btn btn-primary btn-lg">
                Esplora un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/come-funziona" className="btn btn-secondary btn-lg">
                Come funziona
              </Link>
            </div>
            <p className="mt-8 max-w-lg border-l-4 border-sage pl-4 text-[1.0625rem] text-ink-soft">
              <strong className="font-semibold text-ink">Non facciamo diagnosi: facciamo chiarezza.</strong> Le conclusioni restano al tuo medico.
            </p>
          </div>
          <div>
            <HeroDocument />
          </div>
        </div>
      </section>

      {/* TRE PASSI */}
      <section id="metodo" aria-labelledby="metodo-titolo" className="bg-paper py-16 sm:py-24">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Come funziona</p>
            <h2 id="metodo-titolo" className="display mt-3 text-[2.25rem] sm:text-[3rem]">
              Tre passi. Nessuna sorpresa.
            </h2>
          </div>
          <ol className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {STEPS.map(({ n, Art, icon: Icon, title, text }, i) => (
              <Reveal as="li" key={n} delay={i * 140} className="relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-line bg-canvas p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <span aria-hidden className="step-number text-[4rem] text-sage">{n}</span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist">
                    <Icon aria-hidden className="h-7 w-7 text-teal" />
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-[1.75rem] leading-tight text-ink">
                  <span className="sr-only">Passo {n}: </span>
                  {title}
                </h3>
                <p className="mt-3 text-lg text-ink-soft">{text}</p>
                <div aria-hidden className="reveal-art mt-6 w-full max-w-[260px] self-center">
                  <Art />
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link href="/esempio" className="btn btn-primary btn-lg">
              Prova con un esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
            <p className="mt-4 text-[1.0625rem] text-muted">Due minuti. Nessuna registrazione. Nessun dato personale.</p>
          </div>
        </div>
      </section>

      {/* PRIMA / DOPO */}
      <section id="prima-dopo" aria-labelledby="prima-dopo-titolo" className="py-16 sm:py-24">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Prima e dopo</p>
            <h2 id="prima-dopo-titolo" className="display mt-3 text-[2.25rem] sm:text-[3rem]">
              Lo stesso dato, finalmente leggibile.
            </h2>
          </div>
          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
            <Reveal className="card doc-paper flex flex-col p-6 sm:p-8">
              <p className="flex items-center justify-between gap-3 text-[1.0625rem] font-semibold text-ink">
                Nel referto <span className="chip bg-cream text-ink">Esempio inventato</span>
              </p>
              <p className="tabular mt-8 font-mono text-lg leading-9 text-ink sm:text-xl">Emoglobina glicata (HbA1c) &nbsp; 5,1 % &nbsp; [4,0 - 5,6]</p>
              <p className="mt-auto pt-6 text-[1.0625rem] text-muted">Pagina 1, riga 5</p>
            </Reveal>
            <div aria-hidden className="flex items-center justify-center lg:px-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-strong text-on-strong">
                <ArrowRight className="h-7 w-7 rotate-90 lg:rotate-0" />
              </span>
            </div>
            <Reveal delay={160} className="card flex flex-col bg-mist/50 p-6 sm:p-8">
              <p className="text-[1.0625rem] font-semibold text-ink">In parole semplici</p>
              <p className="mt-6 text-xl leading-relaxed text-ink">
                L&apos;emoglobina glicata racconta l&apos;andamento medio dello zucchero nel sangue nelle ultime settimane, non solo il giorno del prelievo.
              </p>
              <p className="mt-4 text-[1.0625rem] text-ink-soft">
                Il valore è <strong className="tabular text-ink">5,1 %</strong>, dentro l&apos;intervallo stampato dal laboratorio. Che cosa significa per te lo dice il medico.
              </p>
              <span aria-hidden className="reveal-bar mt-6 h-1.5 w-24 origin-left rounded-full bg-[linear-gradient(90deg,var(--color-teal),var(--color-sage))]" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* PROMESSE */}
      <section aria-labelledby="promesse-titolo" className="bg-mist py-16 sm:py-24">
        <div className="container-rc">
          <h2 id="promesse-titolo" className="display max-w-2xl text-[2.25rem] sm:text-[3rem]">
            Quattro cose che puoi dare per certe.
          </h2>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {PROMISES.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 90} className="card flex gap-5 p-6 sm:p-7">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mist">
                  <Icon aria-hidden className="h-7 w-7 text-teal" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-ink">{title}</h3>
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

      {/* SERVIZI */}
      <section id="servizi" aria-labelledby="servizi-titolo" className="py-16 sm:py-24">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Servizi</p>
            <h2 id="servizi-titolo" className="display mt-3 text-[2.25rem] sm:text-[3rem]">
              Scegli quanta chiarezza ti serve.
            </h2>
            <p className="mt-4 text-lg text-muted">Prezzi indicativi, in fase di validazione. Oggi puoi provare solo l&apos;esempio.</p>
          </div>
          <div className="mt-12">
            <ServiceCards />
          </div>
          <div className="mt-8 text-center">
            <Link href="/servizi-prezzi" className="btn btn-ghost">
              Confronta i servizi nel dettaglio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section aria-labelledby="cta-titolo" className="pb-20">
        <div className="container-rc">
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-strong px-6 py-14 text-on-strong sm:px-14 sm:py-20">
            <DocumentLinesPattern className="text-on-strong opacity-[0.07] [mask-image:linear-gradient(90deg,transparent_35%,black)]" />
            <div className="relative max-w-2xl">
              <h2 id="cta-titolo" className="display text-[2.25rem] sm:text-[3rem]">
                Comincia da un esempio.
              </h2>
              <p className="mt-4 text-xl text-on-strong-soft">Capirai subito come funziona. Senza registrarti.</p>
              <Link href="/esempio" className="btn btn-on-strong btn-lg mt-8">
                Esplora un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <p className="mt-8 text-[1.0625rem] text-on-strong-soft">
                Hai domande?{" "}
                <Link href="/faq" className="font-semibold underline underline-offset-4">
                  Leggi le risposte
                </Link>{" "}
                · Sei una struttura?{" "}
                <Link href="/per-le-strutture" className="font-semibold underline underline-offset-4">
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

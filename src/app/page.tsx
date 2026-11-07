import Link from "next/link";
import { ArrowRight, BookOpenText, FileCheck2, ListChecks, Lock, MessageSquareText, ScanSearch, ShieldOff, Stethoscope } from "lucide-react";
import { HeroDocument } from "@/components/demo/hero-document";
import { DocumentLinesPattern, IllustrationDialogue, IllustrationMagnify, IllustrationTranslate } from "@/components/brand/illustrations";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCards } from "@/components/ui/service-cards";
import { ReportAnatomy } from "@/components/ui/report-anatomy";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";

/*
 * Home «da ricordare»: poche sezioni, frasi brevi, testo grande, una sola azione per volta.
 * Pensata per chi non ha dimestichezza con i referti e legge dallo smartphone.
 * Firma visiva del giro 3: l'evidenziatore. Il prodotto evidenzia una riga e la spiega; il sito fa lo stesso.
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
  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-titolo" className="grain relative overflow-hidden">
        <div aria-hidden className="dots dots-fade absolute inset-x-0 top-0 -z-10 h-[760px] opacity-70" />
        <div aria-hidden className="glow-cream absolute -left-40 top-24 -z-10 h-[520px] w-[520px] rounded-full" />
        <div aria-hidden className="glow-teal absolute -right-32 top-10 -z-10 h-[620px] w-[620px] rounded-full" />
        <div className="container-rc grid items-center gap-14 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-28 lg:pt-24">
          <div className="max-w-2xl">
            <p className="eyebrow rise-in">Per chi ha un referto in mano</p>
            <h1 id="hero-titolo" className="display-xl rise-in mt-5 text-ink">
              Il tuo referto,
              <br />
              finalmente <span className="marker marker-animate">chiaro</span>.
            </h1>
            <p className="rise-in-2 mt-7 max-w-xl text-xl text-ink-soft sm:text-2xl sm:leading-snug">
              Sigle, numeri, asterischi. Li spieghiamo con parole di tutti i giorni e ti prepariamo le domande per il tuo medico.
            </p>
            <div className="rise-in-3 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/esempio" className="btn btn-primary btn-lg sm:whitespace-nowrap">
                Esplora un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/come-funziona" className="btn btn-secondary btn-lg sm:whitespace-nowrap">
                Come funziona
              </Link>
            </div>
            <p className="rise-in-3 mt-8 flex max-w-lg items-start gap-3 text-[1.0625rem] text-ink-soft">
              <span aria-hidden className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sage" />
              <span>
                <strong className="font-semibold text-ink">Non facciamo diagnosi: facciamo chiarezza.</strong> Due minuti, nessuna registrazione, nessun dato personale.
              </span>
            </p>
          </div>
          <div className="tilt-in">
            <HeroDocument />
          </div>
        </div>
      </section>

      {/* FATTI, NON PROMESSE */}
      <section aria-label="In sintesi" className="border-y border-line/70 bg-paper">
        <div className="container-rc">
          <ul className="grid divide-y divide-line/70 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
            {[
              [`${GUIDES.length}`, "guide agli esami", "scritte in parole semplici, con le fonti", "/guide"],
              [`${GLOSSARY.length}`, "termini nel glossario", "le sigle del referto, una per una", "/glossario"],
              ["0", "numeri cambiati", "ogni valore resta identico al documento", "/come-funziona"],
              ["1", "regola fissa", "le conclusioni restano al tuo medico", "/come-funziona#limiti"],
            ].map(([n, label, text, href], i) => (
              <li key={label} className={i % 2 ? "sm:border-l sm:border-line/70" : i ? "lg:border-l lg:border-line/70" : ""}>
                <Link href={href} className="group flex h-full items-baseline gap-4 px-2 py-6 sm:px-6 lg:py-8">
                  <span className="stat-num text-[3rem] text-teal sm:text-[3.5rem]">{n}</span>
                  <span className="min-w-0">
                    <span className="block text-lg font-semibold text-ink group-hover:text-teal">{label}</span>
                    <span className="block text-[0.9375rem] text-muted">{text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TRE PASSI */}
      <section id="metodo" aria-labelledby="metodo-titolo" className="py-20 sm:py-28">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Come funziona</p>
            <h2 id="metodo-titolo" className="display-lg mt-4">
              Tre passi. <span className="serif-italic text-teal">Nessuna</span> sorpresa.
            </h2>
          </div>
          <ol className="mt-14 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {STEPS.map(({ n, Art, icon: Icon, title, text }, i) => (
              <Reveal as="li" key={n} delay={i * 140} className="card card-lift relative flex flex-col overflow-hidden p-7 sm:p-8">
                <div className="flex items-start justify-between">
                  <span aria-hidden className="num text-[4.5rem] text-sage">{n}</span>
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist">
                    <Icon aria-hidden className="h-7 w-7 text-teal" />
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-[1.75rem] leading-tight text-ink">
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
            <Link href="/esempio" className="btn btn-primary btn-lg">
              Prova con un esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* PRIMA / DOPO */}
      <section id="prima-dopo" aria-labelledby="prima-dopo-titolo" className="grain relative overflow-hidden bg-mist py-20 sm:py-28">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Prima e dopo</p>
            <h2 id="prima-dopo-titolo" className="display-lg mt-4">
              Lo stesso dato, <span className="marker">finalmente leggibile</span>.
            </h2>
          </div>
          <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]">
            <Reveal className="sheet doc-paper flex flex-col p-6 sm:p-8">
              <p className="flex items-center justify-between gap-3 text-[1.0625rem] font-semibold text-ink">
                Nel referto <span className="chip bg-cream text-ink">Esempio inventato</span>
              </p>
              <p className="tabular mt-8 font-mono text-lg leading-9 text-ink sm:text-xl">
                <span className="marker marker-thick">Emoglobina glicata (HbA1c) &nbsp; 5,1 % &nbsp; [4,0 - 5,6]</span>
              </p>
              <p className="tabular mt-2 font-mono text-lg leading-9 text-muted/60 sm:text-xl">Colesterolo LDL &nbsp; 134 mg/dL &nbsp; [&lt; 115]</p>
              <p className="mt-auto pt-6 text-[1.0625rem] text-muted">Pagina 1, riga 5</p>
            </Reveal>
            <div aria-hidden className="flex items-center justify-center lg:px-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-strong text-on-strong shadow-[var(--shadow-lift)]">
                <ArrowRight className="h-7 w-7 rotate-90 lg:rotate-0" />
              </span>
            </div>
            <Reveal delay={160} className="card flex flex-col p-6 sm:p-8">
              <p className="eyebrow">In parole semplici</p>
              <p className="mt-5 font-serif text-2xl leading-snug text-ink sm:text-[1.75rem]">
                L&apos;emoglobina glicata racconta l&apos;andamento medio dello zucchero nel sangue nelle ultime settimane, non solo il giorno del prelievo.
              </p>
              <p className="mt-5 text-[1.0625rem] text-ink-soft">
                Il valore è <strong className="tabular text-ink">5,1 %</strong>, dentro l&apos;intervallo stampato dal laboratorio. Che cosa significa per te lo dice il medico.
              </p>
              <span aria-hidden className="reveal-bar mt-6 h-1.5 w-24 origin-left rounded-full bg-[linear-gradient(90deg,var(--color-teal),var(--color-sage))]" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* COSA RICEVI */}
      <section id="cosa-ricevi" aria-labelledby="cosa-ricevi-titolo" className="overflow-hidden py-20 sm:py-28">
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
                    <span className="block text-xl font-semibold text-ink">{t}</span>
                    <span className="block text-lg text-ink-soft">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/esempio" className="btn btn-secondary btn-lg mt-10">
              Vedi il foglio di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
          <Reveal className="relative">
            <div aria-hidden className="glow-teal absolute -inset-10 -z-10 rounded-full" />
            <ReportAnatomy />
          </Reveal>
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
      <section id="servizi" aria-labelledby="servizi-titolo" className="py-20 sm:py-28">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Servizi</p>
            <h2 id="servizi-titolo" className="display-lg mt-4">
              Scegli quanta chiarezza ti serve.
            </h2>
            <p className="mt-4 text-lg text-muted">Prezzi indicativi, in fase di validazione. Oggi puoi provare solo l&apos;esempio.</p>
          </div>
          <div className="mt-14">
            <ServiceCards />
          </div>
          <div className="mt-8 text-center">
            <Link href="/servizi-prezzi" className="btn btn-ghost">
              Confronta i servizi nel dettaglio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* GUIDE */}
      <section id="guide" aria-labelledby="guide-titolo" className="border-y border-line/70 bg-paper py-20 sm:py-28">
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

      {/* MANIFESTO + CTA FINALE */}
      <section aria-labelledby="cta-titolo" className="py-20 sm:py-28">
        <div className="container-rc">
          <div className="grain relative overflow-hidden rounded-[var(--radius-xl)] bg-strong px-6 py-16 text-on-strong sm:px-14 sm:py-24">
            <DocumentLinesPattern className="text-on-strong opacity-[0.07] [mask-image:linear-gradient(90deg,transparent_35%,black)]" />
            <div aria-hidden className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.12),transparent)]" />
            <div className="relative max-w-3xl">
              <p className="eyebrow text-on-strong-soft">La nostra promessa</p>
              <h2 id="cta-titolo" className="display-xl mt-5 text-on-strong">
                Non facciamo diagnosi.
                <br />
                Facciamo <span className="serif-italic">chiarezza</span>.
              </h2>
              <p className="mt-6 max-w-xl text-xl text-on-strong-soft">Comincia da un esempio: capirai subito come funziona. Senza registrarti.</p>
              <Link href="/esempio" className="btn btn-on-strong btn-lg mt-10">
                Esplora un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <p className="mt-10 text-[1.0625rem] text-on-strong-soft">
                Hai domande?{" "}
                <Link href="/faq" className="font-semibold text-on-strong underline underline-offset-4">
                  Leggi le risposte
                </Link>{" "}
                · Sei una struttura?{" "}
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

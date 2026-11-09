import Link from "next/link";
import { ArrowRight, ClipboardList, FileCheck2, FileText, Lock, MessageSquareText, ShieldOff, Stethoscope, UserRound, Video } from "lucide-react";
import { SearchTrigger } from "@/components/search/site-search";
import { CurveDivider } from "@/components/ui/curve-divider";
import { Reveal } from "@/components/ui/reveal";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { ServiceTriad } from "@/components/offerta/service-triad";
import { Journey } from "@/components/offerta/journey";
import { NeedPicker } from "@/components/offerta/need-picker";
import { HeroSpace } from "@/components/offerta/hero-space";
import { Professionals } from "@/components/offerta/professionals";
import { VideoSlot } from "@/components/offerta/video-slot";
import { CORE_SERVICES, DESCRIPTOR, PRICE_NOTE, pickerServices, publicPricesEnabled } from "@/domain/offerta";

/*
 * Home di Cura Privata (pacchetto «Memorabile», 9/11/2026).
 * In 5 secondi: che cosa offre (capire, secondo parere, parlare con un medico), per chi, quanto costa, chi se ne occupa.
 * Il payoff è il titolo. I tre servizi sono le tre porte. La linea del Journey è il segno ricorrente.
 * Niente foto generate, niente medici o numeri di esempio: le informazioni sono HTML vero.
 */

const PROMISES = [
  { icon: FileCheck2, title: "I numeri restano quelli", text: "Ogni valore mostra la riga del referto da cui viene. Puoi controllare tutto." },
  { icon: UserRound, title: "Un medico vero, identificabile", text: "Pareri e videoconsulti li fa un medico abilitato. Mai un'intelligenza artificiale." },
  { icon: ShieldOff, title: "Nessuna diagnosi automatica", text: "Le spiegazioni aiutano a capire; le valutazioni le fa solo un medico." },
  { icon: Lock, title: "I tuoi dati sono tuoi", text: "Niente vendita di dati, niente pubblicità. Cancelli tutto quando vuoi." },
];

const FEATURED_GUIDES = [
  { slug: "emocromo", label: "Emocromo" },
  { slug: "tsh", label: "TSH" },
  { slug: "glicemia", label: "Glicemia" },
  { slug: "colesterolo-ldl", label: "Colesterolo LDL" },
  { slug: "ferritina", label: "Ferritina" },
  { slug: "vitamina-d", label: "Vitamina D" },
];

const MOBILE_ICON = { file: FileText, stethoscope: Stethoscope, video: Video } as const;

export default function Home() {
  const faqs = FAQ.slice(0, 5);
  const prices = publicPricesEnabled();
  return (
    <>
      {/* HERO: il payoff è il titolo */}
      <section aria-labelledby="hero-titolo" className="grain bg-ivory-wash relative overflow-hidden">
        <div aria-hidden className="glow-teal absolute -right-40 -top-20 -z-10 h-[720px] w-[720px] rounded-full" />
        <div className="container-rc grid items-center gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10 xl:grid-cols-[1.25fr_0.75fr] lg:pb-24 lg:pt-20">
          <div className="max-w-3xl">
            <h1 id="hero-titolo" className="display-xl hero-payoff rise-in text-ink">
              <span className="block">Capisci.</span>
              <span className="block">Chiedi un secondo parere.</span>
              <span className="block">
                <span className="marker marker-animate">Parla con un medico.</span>
              </span>
            </h1>
            <p className="rise-in-2 mt-7 max-w-xl text-xl text-ink-soft sm:text-[1.375rem] sm:leading-snug">{DESCRIPTOR} In un unico spazio, riservato e semplice.</p>
            <div className="rise-in-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="#scegli" className="btn btn-primary btn-lg sm:whitespace-nowrap">
                Scegli il servizio per te <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/come-funziona" className="btn btn-secondary btn-lg sm:whitespace-nowrap">
                Come funziona
              </Link>
            </div>
            {/* Mobile: le tre porte subito sotto le CTA, grandi e riconoscibili */}
            <ul className="rise-in-3 mt-8 grid grid-cols-3 gap-2.5 lg:hidden" aria-label="Vai a un servizio">
              {CORE_SERVICES.map((s) => {
                const Icon = MOBILE_ICON[s.icon];
                return (
                  <li key={s.id} className={`tone-${s.tone}`}>
                    <Link href={s.href} className="service-card min-h-[7.5rem] items-center justify-center gap-2 px-2 py-4 text-center">
                      <span className="tone-icon h-11 w-11">
                        <Icon aria-hidden className="h-6 w-6" />
                      </span>
                      <span className="text-[0.9375rem] font-bold leading-tight text-ink">{s.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="rise-in-3 mt-8 grid max-w-xl gap-x-6 gap-y-3 text-[1.0625rem] text-ink-soft sm:grid-cols-3">
              {[
                [UserRound, "Medici abilitati e identificabili"],
                [Lock, "Dati protetti, cancelli quando vuoi"],
                [FileCheck2, "Prezzo chiaro prima di pagare"],
              ].map(([Icon, t]) => {
                const I = Icon as typeof Lock;
                return (
                  <li key={t as string} className="flex items-start gap-2.5">
                    <I aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
                    {t as string}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative hidden lg:block">
            <div className="tilt-in">
              <HeroSpace />
            </div>
          </div>
        </div>
      </section>

      {/* I TRE SERVIZI */}
      <section id="servizi" aria-labelledby="servizi-titolo" className="pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div className="container-rc">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Tre servizi, un solo spazio</p>
              <h2 id="servizi-titolo" className="display-lg mt-4">
                Dal dubbio alla risposta, <span className="serif-italic">con un medico vero.</span>
              </h2>
            </div>
            <p className="max-w-md text-lg text-muted">Ogni servizio ha un percorso solo, tempi dichiarati e un prezzo che vedi prima di pagare.</p>
          </div>
          <div className="mt-12">
            <ServiceTriad />
          </div>
          {prices ? (
            <p className="mt-6 flex flex-col gap-1 text-[1.0625rem] text-muted sm:flex-row sm:items-center sm:justify-between">
              <span>{PRICE_NOTE}</span>
              <Link href="/prezzi" className="link font-semibold">
                Confronta i servizi e i prezzi
              </Link>
            </p>
          ) : null}
        </div>
      </section>

      {/* JOURNEY */}
      <CurveDivider from="canvas" to="mist" />
      <section aria-labelledby="journey-titolo" className="bg-mist pb-20 pt-8 sm:pb-24 sm:pt-12">
        <div className="container-rc">
          <p className="eyebrow">Cura Privata Journey</p>
          <div className="mt-4">
            <Journey />
          </div>
          <p className="mt-10 max-w-3xl text-lg text-ink-soft">
            Carichi i documenti una volta sola. Se dopo aver capito il referto vuoi parlarne con un medico, li ritrovi già pronti: non ricominci da capo.
          </p>
        </div>
      </section>

      {/* TI AIUTIAMO A SCEGLIERE */}
      <section id="scegli" aria-labelledby="scegli-titolo" className="scroll-mt-24 py-20 sm:py-28">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Ti aiutiamo a scegliere</p>
            <h2 id="scegli-titolo" className="display-lg mt-4">
              Non sai da dove cominciare? <span className="serif-italic">Partiamo da ciò che ti serve.</span>
            </h2>
          </div>
          <div className="mt-10">
            <NeedPicker services={pickerServices()} headingId="scegli-titolo" />
          </div>
        </div>
      </section>

      {/* CHI SI OCCUPA DEL TUO CASO */}
      <section aria-labelledby="professionisti-titolo" className="bg-paper py-20 sm:py-28">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Chi si occupa del tuo caso</p>
            <h2 id="professionisti-titolo" className="display-lg mt-4">
              Una spiegazione aiuta a capire. <span className="serif-italic">Solo un medico valuta.</span>
            </h2>
          </div>
          <div className="mt-10">
            <Professionals />
          </div>
        </div>
      </section>

      {/* VIDEO + PREPARATI ALLA VISITA */}
      <section aria-labelledby="video-titolo" className="py-20 sm:py-28">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <p className="eyebrow">In 90 secondi</p>
            <h2 id="video-titolo" className="display-lg mt-4 text-[2rem] sm:text-[2.5rem]">
              Come funziona, dall&apos;inizio alla fine.
            </h2>
            <div className="mt-8">
              <VideoSlot id="principale" />
            </div>
          </div>
          <Reveal className="service-card tone-capisci p-7 sm:p-9">
            <p className="eyebrow">Gratis, senza registrarti</p>
            <h2 className="mt-4 text-[2rem] font-bold leading-tight tracking-[-0.02em] text-ink sm:text-[2.5rem]">
              Preparati alla visita <span className="marker">in 2 minuti</span>.
            </h2>
            <p className="mt-4 text-xl text-ink-soft">Rispondi a poche domande pratiche: ottieni la lista di cosa portare e cosa chiedere al medico. Da stampare o tenere sul telefono.</p>
            <ul className="mt-6 space-y-3 text-lg text-ink">
              {["Cosa portare con te", "Le domande da non dimenticare", "Gli appunti da preparare prima"].map((t) => (
                <li key={t} className="flex gap-3">
                  <ClipboardList aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/strumenti/preparati-alla-visita" className="btn btn-primary btn-lg mt-8">
              Inizia, è gratis <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* GUIDE */}
      <section id="guide" aria-labelledby="guide-titolo" className="border-t border-line/70 bg-paper py-20 sm:py-24">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="eyebrow">Guide gratuite</p>
            <h2 id="guide-titolo" className="display-lg mt-4">
              Hai solo una sigla in testa? Cercala.
            </h2>
            <p className="mt-5 text-xl text-ink-soft">
              {GUIDES.length} guide agli esami e {GLOSSARY.length} termini spiegati, con le fonti. Senza registrarti.
            </p>
            <div className="mt-7">
              <SearchTrigger variant="field" placeholder="Cerca: emocromo, TSH, ferritina…" />
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/guide" className="btn btn-secondary">
                Tutte le guide <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              <Link href="/glossario" className="btn btn-ghost">
                Apri il glossario
              </Link>
            </div>
          </div>
          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {FEATURED_GUIDES.map(({ slug, label }) => (
              <li key={slug}>
                <Link href={`/guide/${slug}`} className="card card-lift group flex min-h-16 items-center justify-between gap-3 px-5 py-4 text-lg font-semibold text-ink">
                  {label}
                  <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-teal transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROMESSE */}
      <section aria-labelledby="promesse-titolo" className="py-20 sm:py-28">
        <div className="container-rc">
          <div className="max-w-2xl">
            <p className="eyebrow">Le nostre regole</p>
            <h2 id="promesse-titolo" className="display-lg mt-4">
              Quattro cose che puoi dare per certe.
            </h2>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROMISES.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 80} className="card flex flex-col gap-4 p-6">
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
              Non adatto alle emergenze. In caso di emergenza chiama il <strong className="text-ink">112</strong>.{" "}
              <Link href="/sicurezza-e-privacy" className="link">
                Come proteggiamo i tuoi dati
              </Link>
            </span>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="domande" aria-labelledby="faq-titolo" className="border-t border-line/70 bg-paper py-20 sm:py-28">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
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
            <svg aria-hidden viewBox="0 0 600 120" fill="none" className="pointer-events-none absolute -bottom-6 left-0 h-40 w-full opacity-40">
              <path d="M-10 90 C 90 20, 160 120, 260 70 S 420 10, 520 60 S 600 90, 640 40" stroke="#7be0d2" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="relative max-w-3xl">
              <p className="eyebrow text-on-strong-soft">Cura Privata</p>
              <h2 id="cta-titolo" className="display-xl mt-5 text-on-strong">
                Hai un referto o un dubbio sulla tua salute?
              </h2>
              <p className="mt-6 max-w-xl text-xl text-on-strong-soft">Capisci. Chiedi un secondo parere. Parla con un medico. Scegli da dove cominciare: ti guidiamo noi.</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="#scegli" className="btn btn-on-strong btn-lg">
                  Scegli il servizio per te <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                <Link href="/referti/esempio" className="btn btn-lg border border-white/40 text-on-strong hover:bg-white/10">
                  Guarda un esempio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, FileText, Phone, Stethoscope, Video } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { ServiceTriad } from "@/components/offerta/service-triad";
import { BeforeAfter } from "@/components/offerta/before-after";
import { Method } from "@/components/offerta/method";
import { MobileHelpBar } from "@/components/site/mobile-help-bar";
import { DESCRIPTOR, PRICE_NOTE, publicPricesEnabled } from "@/domain/offerta";

/*
 * Home di Cura Privata, versione «leggibile» (10/11/2026). Sei blocchi, una idea per blocco:
 * 1 hero con foto e una domanda sola · 2 i tre servizi · 3 come funziona, con il referto prima e dopo ·
 * 4 il metodo (autorevolezza) · 5 gli strumenti gratuiti · 6 chiusura con aiuto ed emergenze.
 * Testo grande, righe corte, nessun dato inventato. La foto è illustrativa (una paziente, mai un medico).
 */

const ENTRY = [
  { icon: FileText, label: "Un referto da capire", href: "/referti", tone: "capisci" },
  { icon: Stethoscope, label: "Una diagnosi da confermare", href: "/servizi/secondo-parere", tone: "parere" },
  { icon: Video, label: "Voglio parlare con un medico", href: "/servizi/parla-con-un-medico", tone: "medico" },
];

const STEPS = [
  { n: 1, title: "Carichi il documento", text: "Un PDF o una foto. Lo vedi solo tu." },
  { n: 2, title: "Lo capisci", text: "Ogni valore in parole semplici." },
  { n: 3, title: "Se serve, un medico", text: "Un parere scritto o un videoconsulto." },
];

export default function Home() {
  const prices = publicPricesEnabled();
  const photo = ILLUSTRATIVE_PHOTOS.hero;
  return (
    <>
      {/* 1 · HERO: foto in cima, titolo e una sola domanda */}
      <section aria-labelledby="hero-titolo" className="home-hero relative overflow-hidden bg-ivory">
        {SHOW_ILLUSTRATIVE_PHOTOS ? (
          <figure className="home-hero-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} fetchPriority="high" className="photo-drift h-full w-full object-cover" />
            <figcaption className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-0.5 text-xs text-white">Immagine illustrativa</figcaption>
          </figure>
        ) : null}
        <div className="container-rc relative">
          <div className="home-hero-text max-w-[40rem] pb-10 pt-6 lg:py-20">
            <h1 id="hero-titolo" className="display-xl hero-payoff text-ink">
              <span className="block">Capisci.</span>
              <span className="block">Chiedi un secondo parere.</span>
              <span className="block">
                <span className="marker marker-animate">Parla con un medico.</span>
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-xl text-ink-soft sm:text-[1.375rem] sm:leading-snug">{DESCRIPTOR}</p>
            <h2 id="ingresso-titolo" className="mt-8 text-[1.375rem] font-bold text-ink">
              Che cosa hai in mano?
            </h2>
            <ul aria-labelledby="ingresso-titolo" className="mt-3 grid gap-3">
              {ENTRY.map(({ icon: Icon, label, href, tone }) => (
                <li key={href} className={`tone-${tone}`}>
                  <Link href={href} className="entry-btn group">
                    <span className="tone-icon h-11 w-11 shrink-0 rounded-xl">
                      <Icon aria-hidden className="h-6 w-6" />
                    </span>
                    <span className="flex-1">{label}</span>
                    <ArrowRight aria-hidden className="h-6 w-6 text-teal transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-lg text-ink-soft">
              Non sai ancora? <Link href="/referti/esempio" className="link font-semibold">Guarda un referto di esempio</Link>, senza registrarti.
            </p>
          </div>
        </div>
      </section>

      {/* 2 · I TRE SERVIZI */}
      <section id="servizi" aria-labelledby="servizi-titolo" className="py-12 sm:py-24">
        <div className="container-rc">
          <h2 id="servizi-titolo" className="display-lg max-w-2xl">
            Tre servizi. Un prezzo chiaro, prima di pagare.
          </h2>
          <div className="mt-10">
            <ServiceTriad compact />
          </div>
          {prices ? (
            <p className="mt-6 flex flex-col gap-2 text-lg text-muted sm:flex-row sm:items-center sm:justify-between">
              <span>{PRICE_NOTE}</span>
              <Link href="/prezzi" className="link font-semibold">
                Confronta i servizi
              </Link>
            </p>
          ) : null}
        </div>
      </section>

      {/* 3 · COME FUNZIONA, con il prodotto davanti */}
      <section aria-labelledby="come-titolo" className="bg-mist py-12 sm:py-24">
        <div className="container-rc">
          <h2 id="come-titolo" className="display-lg max-w-2xl">
            Come funziona, in tre passi.
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-4 md:flex-col">
                <span aria-hidden className="bubble-ic bubble-active shrink-0 text-2xl font-extrabold">
                  {s.n}
                </span>
                <span>
                  <span className="block text-[1.375rem] font-bold text-ink">
                    <span className="sr-only">Passo {s.n}: </span>
                    {s.title}
                  </span>
                  <span className="mt-1 block text-lg text-ink-soft">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <h3 className="mt-12 text-center text-[1.625rem] font-bold text-ink">Guarda la differenza: sposta il cursore.</h3>
          <Reveal className="mt-6">
            <BeforeAfter />
          </Reveal>
        </div>
      </section>

      {/* 4 · IL METODO: autorevolezza per pazienti e medici */}
      <section aria-labelledby="metodo-titolo" className="bg-strong py-16 text-on-strong sm:py-24">
        <div className="container-rc">
          <Method />
        </div>
      </section>

      {/* 5 · GRATIS, SENZA REGISTRARTI */}
      <section aria-labelledby="gratis-titolo" className="py-12 sm:py-24">
        <div className="container-rc">
          <h2 id="gratis-titolo" className="display-lg max-w-2xl">
            Gratis, senza registrarti.
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            <li className="tone-capisci">
              <Link href="/strumenti/preparati-alla-visita" className="service-card group p-7 sm:p-8">
                <span className="tone-icon h-14 w-14">
                  <ClipboardList aria-hidden className="h-7 w-7" />
                </span>
                <span className="mt-5 block text-[1.625rem] font-bold leading-tight text-ink">Preparati alla visita in 2 minuti</span>
                <span className="mt-2 block text-lg text-ink-soft">Cosa portare e cosa chiedere al medico.</span>
                <span className="tone-text mt-auto inline-flex items-center gap-2 pt-6 text-lg font-bold">
                  Inizia <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
            <li className="tone-parere">
              <Link href="/guide" className="service-card group p-7 sm:p-8">
                <span className="tone-icon h-14 w-14">
                  <BookOpen aria-hidden className="h-7 w-7" />
                </span>
                <span className="mt-5 block text-[1.625rem] font-bold leading-tight text-ink">
                  {GUIDES.length} guide agli esami, {GLOSSARY.length} termini
                </span>
                <span className="mt-2 block text-lg text-ink-soft">Emocromo, TSH, colesterolo e altri, con le fonti.</span>
                <span className="tone-text mt-auto inline-flex items-center gap-2 pt-6 text-lg font-bold">
                  Apri le guide <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* 6 · CHIUSURA: un'azione, l'aiuto, le emergenze */}
      <section aria-labelledby="chiusura-titolo" className="pb-28 lg:pb-24">
        <div className="container-rc">
          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 rounded-[2rem] bg-[linear-gradient(120deg,var(--color-ivory),var(--color-tint-capisci))] p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 id="chiusura-titolo" className="display-lg text-[2.25rem] sm:text-[3rem]">
                Hai un referto o un dubbio? Partiamo da lì.
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/inizia" className="btn btn-primary btn-lg">
                  Scegli il servizio per te <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
                <Link href="/domande-frequenti" className="btn btn-secondary btn-lg">
                  Domande frequenti
                </Link>
              </div>
            </div>
            <p className="flex items-start gap-4 rounded-2xl border border-danger/25 bg-paper p-5 text-lg text-ink">
              <Phone aria-hidden className="mt-1 h-6 w-6 shrink-0 text-danger" />
              <span>
                <strong>Non per le emergenze.</strong> Se stai male adesso chiama il <strong>112</strong>.
              </span>
            </p>
          </div>
        </div>
      </section>

      <MobileHelpBar />
    </>
  );
}

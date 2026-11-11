import Link from "next/link";
import { ArrowRight, Check, ClipboardList } from "lucide-react";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";

const QUESTIONS = ["Che cosa significa il mio referto?", "Servono altri esami?", "Quali sono i prossimi passi?"];

/**
 * «Preparati alla visita in 2 minuti. Gratis.» (immagine 04 del pacchetto come direzione artistica):
 * fotografia illustrativa di una paziente e, in primo piano, un telefono con la lista che si spunta.
 * Titolo, testo, domande e pulsante sono HTML veri. Composizione 45/55 su desktop, una colonna su telefono.
 */
export function PrepBanner() {
  const photo = ILLUSTRATIVE_PHOTOS.preparatiPortrait;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <div className="order-2 lg:order-1">
        <div className="relative mx-auto max-w-[30rem] pb-10 pr-[18%] lg:mx-0">
          <span aria-hidden className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,var(--color-marker),transparent)] opacity-60" />
          {SHOW_ILLUSTRATIVE_PHOTOS ? (
            <figure className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] shadow-[var(--shadow-float)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
              <figcaption className="caption-illus left-3 top-3">Immagine illustrativa</figcaption>
            </figure>
          ) : (
            <div className="aspect-[4/5] rounded-[2.25rem] bg-[linear-gradient(160deg,var(--color-tint-capisci),var(--color-paper))]" />
          )}
          <div aria-hidden className="phone-mock absolute bottom-0 right-0 w-[58%] rotate-[4deg] p-3 pt-5">
            <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-marker-soft text-teal-deep">
              <ClipboardList className="h-6 w-6" />
            </span>
            <ul className="check-seq space-y-2">
              {QUESTIONS.map((q) => (
                <li key={q} className="flex items-center gap-2.5 rounded-xl border border-line bg-paper px-2.5 py-2 text-[0.9375rem] font-semibold leading-tight text-ink">
                  <span className="check-box">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <p className="eyebrow">Strumento gratuito</p>
        <h2 id="preparati-titolo" className="display-lg mt-4">
          Preparati alla visita <span className="marker">in 2 minuti</span>. Gratis.
        </h2>
        <p className="mt-5 max-w-xl text-xl text-ink-soft">Tre domande pratiche, nessun dato sanitario. Ottieni la lista di cosa portare e cosa chiedere.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/strumenti/preparati-alla-visita" className="btn btn-primary btn-lg">
            Prepara la mia lista <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
          <Link href="/guide" className="btn btn-ghost btn-lg">
            Guide agli esami
          </Link>
        </div>
      </div>
    </div>
  );
}

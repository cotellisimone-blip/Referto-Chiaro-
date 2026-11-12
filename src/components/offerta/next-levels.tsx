import Link from "next/link";
import { ArrowRight, FileCheck2, PenLine, Video } from "lucide-react";
import { coreService, publicPricesEnabled } from "@/domain/offerta";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { PriceTag } from "./price-tag";

/** Il videoconsulto come lo vede chi lo prenota: nessun volto di medico, solo i fatti del servizio. */
export function CallCard({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`rounded-[1.5rem] border border-line bg-paper p-4 shadow-[var(--shadow-float)] ${className}`}>
      <p className="flex items-center gap-3 text-[1.0625rem] font-extrabold text-ink">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--tone-bg)] text-[var(--tone-accent)]">
          <Video className="h-5 w-5" />
        </span>
        Videoconsulto
      </p>
      <p className="mt-3 flex items-center gap-2.5 rounded-xl bg-canvas px-3 py-2.5 text-[0.9375rem] font-semibold leading-tight text-ink">
        <FileCheck2 className="h-5 w-5 shrink-0 text-[var(--tone-accent)]" />
        Documenti già letti dal medico
      </p>
    </div>
  );
}

/** Il parere scritto: un foglio firmato. Nessun nome, nessun timbro inventato. */
export function OpinionSheet({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`scope-light sheet p-6 ${className}`}>
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#24618a]">Parere scritto</p>
      <p className="mt-3 text-lg font-bold leading-snug text-ink">La tua domanda, e la risposta dello specialista.</p>
      <div className="mt-4 space-y-2.5">
        {[100, 94, 62].map((w, i) => (
          <span key={i} className="block h-2.5 rounded-full bg-[#dfe8ee]" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
        <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-ink-soft">
          <PenLine className="h-4 w-4 text-[#24618a]" /> Firmato dal medico
        </span>
        <svg viewBox="0 0 120 40" className="h-9 w-28" fill="none">
          <path d="M4 30 C 14 6, 22 6, 24 22 S 34 36, 42 18 S 54 8, 58 24 S 72 30, 80 14 S 96 20, 116 12" stroke="#24618a" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/**
 * «Se una spiegazione non basta.»: i due livelli umani, volutamente diversi tra loro.
 * Parla con un medico è caldo e umano (fotografia di una paziente, tinta calda); il secondo parere è autorevole
 * (fondo blu profondo, il foglio firmato). Si distinguono dal bisogno, scritto in grande, prima che dal prezzo.
 */
export function NextLevels() {
  const medico = coreService("parla-con-un-medico");
  const parere = coreService("secondo-parere");
  const prices = publicPricesEnabled();
  const photo = ILLUSTRATIVE_PHOTOS.scrivaniaPortrait;
  const tall = ILLUSTRATIVE_PHOTOS.scrivania;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[1.28fr_0.92fr] lg:gap-6">
      {/* Livello 2 · caldo, umano */}
      <article className="tone-medico stage-warm relative grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[2.5rem] border border-[color-mix(in_srgb,var(--tone-accent)_22%,transparent)] sm:grid-cols-[1.12fr_0.88fr]">
        <div className="flex flex-col p-7 sm:p-10">
          <p className="eyebrow !text-[var(--tone-accent)]">
            Livello {medico.level.n} · {medico.level.verb}
          </p>
          <h3 className="mt-4 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[2.375rem]">{medico.name}</h3>
          <p className="mt-4 text-[1.375rem] font-bold leading-snug text-ink">«{medico.need}»</p>
          <p className="mt-3 text-lg text-ink-soft">Un medico di medicina generale o internista legge prima i tuoi documenti e ti orienta, in video.</p>
          <div className="mt-auto flex flex-col gap-5 pt-7">
            {prices ? <PriceTag id={medico.id} size="lg" /> : null}
            <Link href={medico.href} data-track="cta-medico" className="btn btn-primary btn-lg self-start">
              Parla con un medico <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="relative px-7 pb-7 sm:p-0">
          {SHOW_ILLUSTRATIVE_PHOTOS ? (
            <figure className="relative hidden aspect-[4/3] overflow-hidden rounded-[2rem] sm:block sm:absolute sm:inset-0 sm:aspect-auto sm:rounded-none sm:rounded-tl-[5rem]">
              <picture className="contents">
                <source media="(min-width: 640px)" srcSet={tall.src} width={tall.width} height={tall.height} />
                <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
              </picture>
              <figcaption className="caption-illus right-3 top-3">Immagine illustrativa</figcaption>
            </figure>
          ) : null}
          {/* Ciclo 2, fase 3: su telefono la scheda illustrativa ripete il testo sopra; resta da 640 px. */}
          <CallCard className="relative hidden sm:block sm:absolute sm:bottom-6 sm:left-[-2.5rem] sm:right-6" />
        </div>
      </article>

      {/* Livello 3 · autorevole */}
      <article className="scope-strong tone-parere stage-blue relative flex flex-col overflow-hidden rounded-[2.5rem] p-7 sm:p-10">
        <p className="eyebrow !text-[var(--tone-accent)]">
          Livello {parere.level.n} · {parere.level.verb}
        </p>
        <h3 className="mt-4 text-[2rem] font-extrabold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[2.375rem]">Secondo parere</h3>
        <p className="mt-4 text-[1.375rem] font-bold leading-snug text-ink">«{parere.need}»</p>
        <p className="mt-3 text-lg text-ink-soft">Uno specialista valuta i tuoi documenti e risponde per iscritto, con la sua firma.</p>
        <div className="mt-7 flex flex-col gap-5">
          {prices ? <PriceTag id={parere.id} size="lg" /> : null}
          <Link href={parere.href} data-track="cta-parere" className="btn btn-mint btn-lg self-start">
            Chiedi un secondo parere <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
        </div>
      </article>
    </div>
  );
}

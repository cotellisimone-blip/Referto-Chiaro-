import { Check, FileText, Stethoscope, Video } from "lucide-react";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { HeroSpace } from "./hero-space";
import { JourneyThread } from "./journey";

const CHIPS = [
  { icon: FileText, text: "Capisci i tuoi valori", tone: "tone-capisci", pos: "left-[-8%] top-[14%]" },
  { icon: Stethoscope, text: "Parere scritto e firmato", tone: "tone-parere", pos: "right-[-6%] top-[44%]" },
  { icon: Video, text: "Videoconsulto da casa", tone: "tone-medico", pos: "left-[2%] bottom-[10%]" },
];

/**
 * Visual della hero: foto illustrativa di una paziente (mai un medico) in una forma morbida, con tre «chip»
 * che fluttuano e la linea del Journey. Decorativo: il contenuto vero è nel testo accanto.
 */
export function HeroVisual() {
  if (!SHOW_ILLUSTRATIVE_PHOTOS) return <HeroSpace />;
  const p = ILLUSTRATIVE_PHOTOS.hero;
  return (
    <div className="relative mx-auto w-full max-w-[600px]">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-full bg-[radial-gradient(closest-side,var(--color-marker-soft),transparent)]" />
      <figure className="photo-blob aspect-[704/560]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.src} width={p.width} height={p.height} alt={p.alt} className="photo-drift" fetchPriority="high" />
        <figcaption className="absolute bottom-3 right-5 rounded-full bg-black/45 px-2.5 py-0.5 text-xs text-white">Immagine illustrativa</figcaption>
      </figure>
      <JourneyThread className="pointer-events-none absolute -bottom-10 -left-12 h-28 w-[118%]" />
      <ul aria-hidden className="pointer-events-none">
        {CHIPS.map(({ icon: Icon, text, tone, pos }) => (
          <li key={text} className={`float-chip ${tone} absolute ${pos} flex items-center gap-2.5 rounded-2xl border border-line bg-paper/95 py-2.5 pl-2.5 pr-4 text-[0.9375rem] font-bold text-ink shadow-[var(--shadow-lift)] backdrop-blur`}>
            <span className="tone-icon h-9 w-9 rounded-xl">
              <Icon className="h-5 w-5" />
            </span>
            {text}
            <Check className="h-4 w-4 text-teal" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Versione mobile: foto più bassa, a tutta larghezza, con una sola chip. */
export function HeroVisualMobile() {
  if (!SHOW_ILLUSTRATIVE_PHOTOS) return null;
  const p = ILLUSTRATIVE_PHOTOS.hero;
  return (
    <figure className="relative mt-8 overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)] lg:hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={p.src} width={p.width} height={p.height} alt={p.alt} className="aspect-[4/3] w-full object-cover object-[60%_30%]" />
      <figcaption className="absolute bottom-2 right-3 rounded-full bg-black/45 px-2 py-0.5 text-xs text-white">Immagine illustrativa</figcaption>
    </figure>
  );
}

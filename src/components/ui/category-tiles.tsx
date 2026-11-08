import Link from "next/link";
import { Activity, ArrowRight, BookOpenText, Droplets, FlaskConical, HeartPulse, Microscope, Pill, ScanLine, Shield, Sparkles, Stethoscope, Waves } from "lucide-react";
import { GUIDE_CATEGORIES, guidesByCategory } from "@/content/guides";
import type { GuideCategory } from "@/content/guides";

const ICONS: Record<GuideCategory, typeof Activity> = {
  "come-leggere": BookOpenText,
  emocromo: Droplets,
  metabolismo: FlaskConical,
  lipidi: Waves,
  fegato: Microscope,
  reni: Droplets,
  tiroide: Activity,
  ferro: Pill,
  infiammazione: Shield,
  ormoni: Sparkles,
  immagini: ScanLine,
  "cuore-e-funzionali": HeartPulse,
  endoscopie: Stethoscope,
};

/** Tessere delle categorie di guide, con il conteggio reale: l'ingresso "per argomento" al sapere gratuito. */
export function CategoryTiles({ limit }: { limit?: number }) {
  const cats = (Object.keys(GUIDE_CATEGORIES) as GuideCategory[]).slice(0, limit);
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cats.map((c) => {
        const Icon = ICONS[c];
        const n = guidesByCategory(c).length;
        return (
          <li key={c}>
            <Link href={`/guide#${c}`} className="card card-lift card-glow group flex h-full items-center gap-4 p-4 sm:p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-marker-soft),var(--color-mist))]">
                <Icon aria-hidden className="h-6 w-6 text-teal" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold leading-tight text-ink">{GUIDE_CATEGORIES[c].title}</span>
                <span className="block text-sm text-muted">
                  {n} {n === 1 ? "guida" : "guide"}
                </span>
              </span>
              <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-teal transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

import Link from "next/link";
import { ArrowRight, BookOpenText, FileText, FolderHeart, Sprout, Stethoscope, Video } from "lucide-react";
import { clsx } from "clsx";
import { ECOSYSTEM, STATUS_LABEL, type EcosystemService } from "@/domain/ecosystem";

const ICONS: Record<EcosystemService["icon"], typeof FileText> = {
  file: FileText,
  book: BookOpenText,
  stethoscope: Stethoscope,
  folder: FolderHeart,
  video: Video,
  sprout: Sprout,
};

/** Card dei servizi Cura Privata: lo stato reale sta sopra il titolo, in parole, mai solo a colori. */
export function EcosystemCards({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ECOSYSTEM.map((s) => {
        const Icon = ICONS[s.icon];
        const live = s.status !== "in-preparation";
        return (
          <li key={s.id}>
            <Link
              href={s.href}
              className={clsx(
                "card card-lift group relative flex h-full flex-col overflow-hidden p-6 sm:p-7",
                s.id === "referti" && "card-featured",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  className={clsx(
                    "flex h-14 w-14 items-center justify-center rounded-2xl",
                    live ? "bg-[linear-gradient(135deg,var(--color-marker-soft),var(--color-mist))]" : "bg-mist",
                  )}
                >
                  <Icon aria-hidden className={clsx("h-7 w-7", live ? "text-teal" : "text-muted")} />
                </span>
                <span className={clsx("chip text-sm", live ? "bg-marker-soft text-teal-deep" : "border border-line bg-canvas text-muted")}>
                  {STATUS_LABEL[s.status]}
                </span>
              </div>
              <H className="mt-6 text-[1.375rem] font-bold leading-tight tracking-[-0.01em] text-ink">{s.name}</H>
              <p className="mt-2 flex-1 text-[1.0625rem] text-ink-soft">{s.short}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-teal">
                {live ? "Scopri e prova" : "Come sarà"}
                <ArrowRight aria-hidden className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

import { Clapperboard, Play } from "lucide-react";
import { VIDEOS, type SiteVideo } from "@/content/media";
import { JourneyThread } from "./journey";

/**
 * Spazio video pronto a ricevere i filmati dello storyboard. Con `src` impostato mostra un player nativo
 * (niente autoplay, sottotitoli obbligatori); senza, una copertina «in arrivo» che non finge di essere un video.
 */
export function VideoSlot({ id, compact = false }: { id: keyof typeof VIDEOS; compact?: boolean }) {
  const v: SiteVideo = VIDEOS[id];
  if (v.src) {
    return (
      <figure>
        <video controls preload="none" playsInline poster={v.poster ?? undefined} className="aspect-video w-full rounded-[var(--radius-lg)] bg-strong">
          <source src={v.src} />
          {v.captions ? <track kind="captions" srcLang="it" label="Italiano" src={v.captions} default /> : null}
        </video>
        <figcaption className="mt-3 text-[1.0625rem] text-ink-soft">
          <strong className="text-ink">{v.title}</strong> · {v.durationLabel}
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="video-frame text-on-strong" aria-label={`${v.title}: video in preparazione`}>
      <JourneyThread className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-60" />
      <div className={`relative flex h-full flex-col justify-between ${compact ? "p-5" : "p-6 sm:p-8"}`}>
        <span className="chip w-fit bg-paper/90 text-ink">
          <Clapperboard aria-hidden className="h-4 w-4" /> Video in preparazione
        </span>
        <div className="flex items-end gap-4">
          <span aria-hidden className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper/20 ring-1 ring-white/40">
            <Play className="h-6 w-6 translate-x-0.5" />
          </span>
          <figcaption>
            <span className={`block font-bold leading-tight ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}>{v.title}</span>
            {!compact ? <span className="mt-1 block text-[1.0625rem] text-on-strong-soft">{v.description}</span> : null}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

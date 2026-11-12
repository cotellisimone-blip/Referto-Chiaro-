"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, Plus, Video } from "lucide-react";
import { clsx } from "clsx";

export type Hotspot = { id: string; x: number; y: number; label: string; title: string; text: string; href: string; cta: string; price: string | null; tone: string; icon: "file" | "video" | "list" };
const ICON = { file: FileText, video: Video, list: ClipboardList } as const;

/**
 * Foto con punti interattivi: ogni oggetto della scena (il referto, il telefono, il quaderno) apre il servizio
 * che serve in quel momento. I punti sono pulsanti veri, e la stessa scelta c'è nell'elenco accanto (tastiera,
 * lettori di schermo, mobile). La foto è illustrativa: una paziente, mai un medico.
 */
export function PhotoHotspots({ photo, spots }: { photo: { src: string; width: number; height: number; alt: string }; spots: Hotspot[] }) {
  const [active, setActive] = useState(0);
  const a = spots[active];
  const Icon = ICON[a.icon];
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
      <figure className="relative mx-auto w-full max-w-[460px]">
        <div aria-hidden className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,var(--color-marker-soft),transparent)]" />
        <div className="relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-float)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} className="block h-auto w-full" />
          <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-0.5 text-xs text-white">Immagine illustrativa</span>
          {spots.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={i === active}
              aria-controls="hotspot-panel"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              className={clsx(
                "hotspot-ring absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-[0_6px_18px_rgba(12,51,64,0.35)] transition-transform hover:scale-110",
                i === active ? "bg-teal text-white" : "bg-strong/80 text-white",
              )}
            >
              <Plus aria-hidden className={clsx("h-5 w-5 transition-transform", i === active && "rotate-45")} />
              <span className="sr-only">{s.label}</span>
            </button>
          ))}
          {/* etichetta che segue il punto attivo */}
          <span aria-hidden style={{ left: `${a.x}%`, top: `${a.y}%` }} className="pointer-events-none absolute z-10 ml-7 -translate-y-1/2 whitespace-nowrap rounded-full bg-paper px-3 py-1 text-sm font-bold text-ink shadow-[var(--shadow-lift)] max-sm:hidden">
            {a.label}
          </span>
        </div>
      </figure>
      <div>
        <ol className="flex flex-wrap gap-2" aria-label="Scegli un punto della foto">
          {spots.map((s, i) => (
            <li key={s.id}>
              <button type="button" aria-pressed={i === active} aria-controls="hotspot-panel" onClick={() => setActive(i)} className={clsx("inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[1.0625rem] font-semibold transition-colors", i === active ? "border-strong bg-strong text-on-strong" : "border-line bg-paper text-ink hover:border-teal/60")}>
                <span aria-hidden className={clsx("flex h-6 w-6 items-center justify-center rounded-full text-sm font-extrabold", i === active ? "bg-marker text-strong" : "bg-mist text-teal-deep")}>
                  {i + 1}
                </span>
                {s.label}
              </button>
            </li>
          ))}
        </ol>
        <div id="hotspot-panel" aria-live="polite" className={`tone-${a.tone} service-card mt-6 p-7 shadow-[var(--shadow-lift)] sm:p-8`}>
          <div key={a.id} className="scene-pop">
            <div className="flex items-center justify-between gap-4">
              <span className="tone-icon h-14 w-14">
                <Icon aria-hidden className="h-7 w-7" />
              </span>
              {a.price ? (
                <p className="text-right leading-none">
                  <span className="block text-[0.9375rem] text-muted">a partire da</span>
                  <span className="stat-num text-[1.75rem] text-ink">{a.price}</span>
                </p>
              ) : (
                <span className="chip bg-marker-soft text-teal-deep">Gratis</span>
              )}
            </div>
            <h3 className="mt-5 text-[1.75rem] font-bold leading-tight text-ink">{a.title}</h3>
            <p className="mt-3 text-lg text-ink-soft">{a.text}</p>
            <Link href={a.href} className="btn btn-primary btn-lg mt-6">
              {a.cta} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

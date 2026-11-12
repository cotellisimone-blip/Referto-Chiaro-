"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, FileText, Stethoscope, Video } from "lucide-react";
import { clsx } from "clsx";
import { SCENE } from "./scenes";

export type ShowcaseService = { id: "capisci" | "secondo-parere" | "parla-con-un-medico"; name: string; tone: string; href: string; price: string | null; timing: string; oneLiner: string };
const ICON = { capisci: FileText, "secondo-parere": Stethoscope, "parla-con-un-medico": Video } as const;
const SHORT = { capisci: "Capisci", "secondo-parere": "Secondo parere", "parla-con-un-medico": "Parla con un medico" } as const;

/**
 * Hero interattiva: la foto (illustrativa, una paziente) arriva fino al bordo dello schermo e sopra ci sono
 * i tre servizi come schede selezionabili. Si alternano da sole ogni 5 secondi finché la persona non tocca
 * nulla (mai con prefers-reduced-motion); il contenuto vero (nome, prezzo, tempi, link) è HTML.
 */
export function HeroShowcase({ services, photo }: { services: ShowcaseService[]; photo: { src: string; width: number; height: number; alt: string } }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % services.length), 5000);
    return () => window.clearInterval(t);
  }, [auto, services.length]);
  const s = services[active];
  const Scene = SCENE[s.id];
  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (i + d + services.length) % services.length;
    pick(n);
    tabs.current[n]?.focus();
  };
  return (
    <div className="absolute inset-y-0 right-0 hidden w-[47%] lg:block" onMouseEnter={() => setAuto(false)}>
      {/* foto a tutta altezza, sfumata verso il testo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} fetchPriority="high" className="photo-drift h-full w-full object-cover object-[35%_8%]" />
        <div aria-hidden className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(90deg,var(--color-ivory),transparent)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,color-mix(in_srgb,var(--color-strong)_55%,transparent),transparent)]" />
        <span className="absolute right-4 top-4 rounded-full bg-black/45 px-2.5 py-0.5 text-xs text-white">Immagine illustrativa</span>
      </div>
      {/* schede servizi sopra la foto */}
      <div className="absolute inset-x-8 bottom-8 xl:inset-x-12">
        <div role="tablist" aria-label="I tre servizi" className="flex flex-wrap gap-2">
          {services.map((x, i) => {
            const Icon = ICON[x.id];
            return (
              <button
                key={x.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`hero-tab-${x.id}`}
                aria-selected={i === active}
                aria-controls="hero-tab-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => pick(i)}
                onKeyDown={(e) => onKey(e, i)}
                className={clsx(
                  `tone-${x.tone} inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[0.9375rem] font-bold shadow-[var(--shadow-lift)] backdrop-blur transition-colors`,
                  i === active ? "border-transparent bg-paper text-ink" : "border-white/40 bg-white/20 text-white hover:bg-white/30",
                )}
              >
                <Icon aria-hidden className="h-4 w-4" />
                {SHORT[x.id]}
                {i === active && auto ? <span aria-hidden className="hero-tab-timer" /> : null}
              </button>
            );
          })}
        </div>
        <div id="hero-tab-panel" role="tabpanel" aria-labelledby={`hero-tab-${s.id}`} className={`tone-${s.tone} service-card mt-3 grid grid-cols-[0.9fr_1.1fr] items-stretch shadow-[var(--shadow-float)]`}>
          <div key={s.id} className="scene-pop overflow-hidden border-r border-line/60">
            <Scene uid="-hero-show" className="h-full object-cover" />
          </div>
          <div className="flex flex-col p-5">
            <p className="text-xl font-bold leading-tight text-ink">{s.name}</p>
            <p className="mt-1.5 text-[0.9375rem] leading-snug text-ink-soft">{s.oneLiner}</p>
            <p className="mt-2 flex items-start gap-1.5 text-[0.9375rem] text-ink">
              <Clock3 aria-hidden className="tone-text mt-0.5 h-4 w-4 shrink-0" />
              {s.timing}
            </p>
            <div className="mt-auto flex items-end justify-between gap-3 pt-3">
              {s.price ? (
                <p className="leading-none">
                  <span className="block text-sm text-muted">a partire da</span>
                  <span className="stat-num text-2xl text-ink">{s.price}</span>
                </p>
              ) : (
                <span />
              )}
              <Link href={s.href} className="tone-text inline-flex min-h-11 items-center gap-1.5 font-bold">
                Scopri <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

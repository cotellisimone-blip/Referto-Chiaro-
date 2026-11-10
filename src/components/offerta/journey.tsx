"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { SCENE } from "./scenes";
import { FileText, FolderHeart, ScanSearch, Stethoscope, Video } from "lucide-react";

const NODES = [
  { icon: FileText, title: "Il referto", text: "Lo carichi una volta sola.", detail: "Carichi il PDF o una foto del referto. Lo leggiamo e ti mostriamo ogni valore con la riga da cui viene: lo controlli tu prima di andare avanti.", scene: "capisci", href: "/referti/esempio", cta: "Guarda un referto di esempio" },
  { icon: ScanSearch, title: "Lo capisci", text: "Valori e sigle in parole semplici.", detail: "Ricevi una spiegazione chiara di sigle e valori, con le domande da portare al medico. Nessuna diagnosi automatica: serve a capire.", scene: "capisci", href: "/referti", cta: "Capisci il tuo referto" },
  { icon: Stethoscope, title: "Secondo parere", text: "Se serve, un medico lo valuta.", detail: "Hai una diagnosi o una proposta di cura? Un medico della specialità giusta legge i documenti che scegli e risponde per iscritto, con la sua firma.", scene: "secondo-parere", href: "/servizi/secondo-parere", cta: "Chiedi un secondo parere" },
  { icon: Video, title: "Parli con un medico", text: "Con i documenti già davanti.", detail: "Scegli due o tre momenti comodi: il medico conferma, legge prima i documenti e ti incontra in video. Dopo, un riepilogo scritto.", scene: "parla-con-un-medico", href: "/servizi/parla-con-un-medico", cta: "Parla con un medico" },
  { icon: FolderHeart, title: "Resta tutto tuo", text: "Nella tua area personale.", detail: "Documenti, spiegazioni, pareri e riepiloghi restano nella tua area. Li condividi solo se vuoi, e puoi cancellare tutto quando vuoi.", scene: null, href: "/sicurezza-e-privacy", cta: "Come proteggiamo i tuoi dati" },
];

/**
 * «Cura Privata Journey»: il motivo grafico ricorrente. Una linea fluida unisce i passi.
 * Desktop/tablet: orizzontale. Mobile: verticale, come uno stepper. È una lista ordinata vera (lettori di schermo).
 */
export function Journey({ title = "Un percorso solo, dal referto al medico." }: { title?: string }) {
  const [active, setActive] = useState(0);
  const node = NODES[active];
  const Scene = node.scene ? SCENE[node.scene as keyof typeof SCENE] : null;
  const NodeIcon = node.icon;
  return (
    <div>
      <h2 id="journey-titolo" className="display-lg max-w-3xl">
        {title}
      </h2>
      <div className="relative mt-14">
        {/* Linea orizzontale (md+) con un punto che la percorre */}
        <svg aria-hidden viewBox="0 0 1000 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[8%] top-3 hidden h-16 w-[84%] md:block">
          <path d={PATH} fill="none" stroke="var(--color-marker-soft)" strokeWidth="10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path className="journey-draw" pathLength={1} d={PATH} fill="none" stroke="var(--color-marker)" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <ellipse className="journey-dot" rx="7" ry="9" fill="var(--color-teal)">
            <animateMotion dur="7s" repeatCount="indefinite" path={PATH} />
          </ellipse>
        </svg>
        {/* Linea verticale (mobile) */}
        <span aria-hidden className="absolute bottom-10 left-10 top-10 w-1 rounded-full bg-[linear-gradient(180deg,var(--color-marker),var(--color-marker-soft))] md:hidden" />
        <ol className="relative grid gap-7 md:grid-cols-5 md:gap-4" aria-labelledby="journey-titolo">
          {NODES.map(({ icon: Icon, title: t, text }, i) => (
            <li key={t} className="bubble-node">
              <button type="button" aria-pressed={i === active} aria-controls="journey-panel" onClick={() => setActive(i)} className="group flex w-full items-center gap-5 rounded-3xl p-1 text-left md:flex-col md:items-center md:text-center">
                <span className={clsx("bubble-ic relative z-10 shrink-0", i === active && "bubble-active")}>
                  <Icon aria-hidden className="h-9 w-9" strokeWidth={1.7} />
                  <span aria-hidden className="absolute -right-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-strong text-sm font-extrabold text-on-strong">
                    {i + 1}
                  </span>
                </span>
                <span className="md:pt-2">
                  <span className={clsx("block text-xl font-bold", i === active ? "text-teal-deep underline decoration-marker decoration-4 underline-offset-4" : "text-ink")}>
                    <span className="sr-only">Passo {i + 1}: </span>
                    {t}
                  </span>
                  <span className="block text-[1.0625rem] text-ink-soft">{text}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div id="journey-panel" aria-live="polite" className="mt-10 overflow-hidden rounded-[2rem] border border-line bg-paper shadow-[var(--shadow-lift)]">
        <div key={active} className="scene-pop grid grid-cols-[minmax(0,1fr)] md:grid-cols-[0.8fr_1.2fr]">
          <div aria-hidden className={clsx("flex items-center justify-center border-b border-line/60 md:border-b-0 md:border-r", node.scene === "secondo-parere" ? "tone-parere" : node.scene === "parla-con-un-medico" ? "tone-medico" : "tone-capisci")}>
            {Scene ? (
              <Scene uid="-journey" />
            ) : (
              <span className="flex h-full min-h-40 w-full items-center justify-center bg-[linear-gradient(160deg,var(--color-tint-capisci),var(--color-paper))]">
                <span className="bubble-ic bubble-active">
                  <NodeIcon className="h-9 w-9" />
                </span>
              </span>
            )}
          </div>
          <div className="p-7 sm:p-9">
            <p className="eyebrow">Passo {active + 1} di {NODES.length}</p>
            <h3 className="mt-3 text-[1.75rem] font-bold leading-tight text-ink">{node.title}</h3>
            <p className="mt-3 text-lg text-ink-soft">{node.detail}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href={node.href} className="btn btn-primary">
                {node.cta} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
              {active < NODES.length - 1 ? (
                <button type="button" className="btn btn-ghost" onClick={() => setActive(active + 1)}>
                  Passo successivo
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PATH = "M0 40 C 120 0, 180 80, 250 40 S 380 0, 500 40 S 630 80, 750 40 S 880 0, 1000 40";

/** La linea del Journey come semplice filo decorativo (separatori, hero, banner). */
export function JourneyThread({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 600 120" fill="none" className={className}>
      <path className="journey-draw" pathLength={1} d="M-10 90 C 90 20, 160 120, 260 70 S 420 10, 520 60 S 600 90, 640 40" stroke="var(--color-marker)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="260" cy="70" r="7" fill="var(--color-teal)" />
      <circle cx="520" cy="60" r="7" fill="var(--color-teal)" />
    </svg>
  );
}

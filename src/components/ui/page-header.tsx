import type { ReactNode } from "react";
import { clsx } from "clsx";
import {
  IllustrationDialogue,
  IllustrationDossier,
  IllustrationFaq,
  IllustrationMagnify,
  IllustrationShield,
  IllustrationTranslate,
} from "@/components/brand/illustrations";

export type HeaderArt = "translate" | "magnify" | "dossier" | "dialogue" | "shield" | "faq" | "none";

const ART = {
  translate: IllustrationTranslate,
  magnify: IllustrationMagnify,
  dossier: IllustrationDossier,
  dialogue: IllustrationDialogue,
  shield: IllustrationShield,
  faq: IllustrationFaq,
};

/**
 * Intestazione di pagina. Con `art` mostra un'illustrazione originale a destra su desktop
 * (così la metà destra non resta vuota); con `compact` è una fascia breve per le pagine di servizio.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
  art = "none",
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
  art?: HeaderArt;
  compact?: boolean;
}) {
  const Art = art === "none" ? null : ART[art];
  return (
    <div className="relative overflow-hidden border-b border-line/70 bg-[linear-gradient(180deg,var(--color-mist),var(--color-canvas))]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-sage),transparent)] opacity-60"
      />
      <div className={clsx("container-rc", compact ? "py-10 sm:py-14" : "py-14 sm:py-20", Art && "grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]")}>
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className={clsx("display mt-3", compact ? "text-[2rem] sm:text-[2.75rem]" : "text-[2.25rem] sm:text-[3.25rem]")}>{title}</h1>
          {lead ? <div className="mt-5 text-xl text-ink-soft sm:text-2xl">{lead}</div> : null}
          {children}
        </div>
        {Art ? (
          <div className="rise-in-2 float-soft mx-auto hidden w-full max-w-[380px] lg:block">
            <Art />
          </div>
        ) : null}
      </div>
    </div>
  );
}

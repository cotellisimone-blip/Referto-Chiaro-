import type { ReactNode } from "react";
import { clsx } from "clsx";
import {
  IllustrationDialogue,
  IllustrationDossier,
  IllustrationFaq,
  IllustrationMagnify,
  IllustrationQuestions,
  IllustrationSearch,
  IllustrationShield,
  IllustrationTranslate,
} from "@/components/brand/illustrations";

export type HeaderArt = "translate" | "magnify" | "dossier" | "dialogue" | "shield" | "faq" | "search" | "questions" | "none";

const ART = {
  translate: IllustrationTranslate,
  magnify: IllustrationMagnify,
  dossier: IllustrationDossier,
  dialogue: IllustrationDialogue,
  shield: IllustrationShield,
  faq: IllustrationFaq,
  search: IllustrationSearch,
  questions: IllustrationQuestions,
};

/**
 * Intestazione di pagina. Con `art` mostra un'illustrazione originale a destra su desktop,
 * sospesa su un alone di luce; con `compact` è una fascia breve per le pagine di servizio.
 * Griglia di punti e grana di carta: la stessa "carta" della home.
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
    <div className="grain relative overflow-hidden border-b border-line/70 bg-[linear-gradient(180deg,var(--color-mist),var(--color-canvas))]">
      <div aria-hidden className="dots dots-fade absolute inset-0 opacity-60" />
      <div aria-hidden className="glow-cream absolute -left-32 -top-20 h-[420px] w-[420px] rounded-full" />
      <div className={clsx("container-rc relative", compact ? "py-10 sm:py-14" : "py-14 sm:py-20 lg:py-24", Art && "grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]")}>
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow rise-in">{eyebrow}</p> : null}
          <h1 className={clsx("rise-in mt-4", compact ? "display text-[2rem] sm:text-[2.75rem]" : "display-lg text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem]")}>{title}</h1>
          {lead ? <div className="rise-in-2 mt-5 max-w-2xl text-xl text-ink-soft sm:text-2xl sm:leading-snug">{lead}</div> : null}
          {children}
        </div>
        {Art ? (
          <div className="relative mx-auto hidden w-full max-w-[400px] lg:block">
            <div aria-hidden className="glow-teal absolute -inset-12 rounded-full" />
            <div className="rise-in-2 float-soft relative">
              <Art />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

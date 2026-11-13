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
import { Wave } from "./wave";

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
 * Apertura di una pagina interna, grafica «Luce»: luce morbida, titolo grande, testo guida e l'onda in fondo,
 * come nelle pagine dei servizi. Con `art` mostra un'illustrazione originale a destra sugli schermi larghi;
 * con `compact` il titolo è un po' più piccolo (pagine legali e di servizio).
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
    <div className="page-hero page-hero-wave">
      <div className={clsx("container-rc page-hero-inner", Art && "page-hero-split")}>
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className={clsx("page-title", compact && "page-title-sm", eyebrow && "mt-4")}>{title}</h1>
          {lead ? <div className="lead mt-5 max-w-[40rem]">{lead}</div> : null}
          {children}
        </div>
        {Art ? (
          <div className="page-hero-art">
            <div aria-hidden className="glow-teal absolute -inset-10 rounded-full" />
            <div className="float-soft relative">
              <Art />
            </div>
          </div>
        ) : null}
      </div>
      <Wave className="text-canvas" />
    </div>
  );
}

import type { ReactNode } from "react";
import { clsx } from "clsx";
import {
  ALargeSmall,
  BookOpenText,
  Building2,
  Check,
  FileText,
  FolderLock,
  KeyRound,
  Languages,
  LifeBuoy,
  ListChecks,
  LockKeyhole,
  Mail,
  MessageCircleQuestionMark,
  MessagesSquare,
  Search,
  Share2,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { Wave } from "./wave";

export type HeaderArt = "translate" | "magnify" | "dossier" | "dialogue" | "shield" | "faq" | "search" | "questions" | "structures" | "none";

/** Per ogni argomento tre icone: la tessera grande dice di che cosa parla la pagina, le due piccole la accompagnano. */
const ART: Record<Exclude<HeaderArt, "none">, [LucideIcon, LucideIcon, LucideIcon]> = {
  translate: [Languages, FileText, MessageCircleQuestionMark],
  magnify: [BookOpenText, Search, FileText],
  dossier: [FolderLock, FileText, Share2],
  dialogue: [MessagesSquare, Mail, LifeBuoy],
  shield: [ShieldCheck, LockKeyhole, KeyRound],
  faq: [MessageCircleQuestionMark, Search, Check],
  search: [Search, BookOpenText, ALargeSmall],
  questions: [ListChecks, MessageCircleQuestionMark, Stethoscope],
  structures: [Building2, FileText, Share2],
};

/** Tre tessere di vetro sul filo tratteggiato: il disegno delle aperture, solo decorativo e solo su schermi larghi. */
export function HeroTiles({ icons: [Main, Second, Third] }: { icons: [LucideIcon, LucideIcon, LucideIcon] }) {
  return (
    <div aria-hidden className="hero-tiles">
      <div className="glow-teal absolute -inset-8 rounded-full" />
      <svg viewBox="0 0 312 240" fill="none">
        <path d="M44 40C140 20 190 60 236 112S150 220 80 212" />
      </svg>
      <span className="tile-ico tile-ico-xl">
        <Main />
      </span>
      <span className="tile-ico tile-ico-lg">
        <Second />
      </span>
      <span className="tile-ico">
        <Third />
      </span>
    </div>
  );
}

/**
 * Apertura di una pagina interna, grafica «Luce»: luce morbida, titolo grande, testo guida e l'onda in fondo,
 * come nelle pagine dei servizi. Con `art` mostra tre tessere di vetro a destra sugli schermi larghi;
 * con `compact` il titolo è un po' più piccolo (pagine legali e di servizio).
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
  art = "none",
  visual,
  compact = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  art?: HeaderArt;
  /** Un «pezzo di prodotto» disegnato in HTML al posto dell'illustrazione: si vede solo sugli schermi larghi. */
  visual?: ReactNode;
  compact?: boolean;
}) {
  const icons = art === "none" ? null : ART[art];
  return (
    <div className="page-hero page-hero-wave">
      <div className={clsx("container-rc page-hero-inner", (icons || visual) && "page-hero-split")}>
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className={clsx("page-title", compact && "page-title-sm", eyebrow && "mt-4")}>{title}</h1>
          {lead ? <div className="lead mt-5 max-w-[40rem]">{lead}</div> : null}
          {children}
        </div>
        {visual ? (
          <div>{visual}</div>
        ) : icons ? (
          <HeroTiles icons={icons} />
        ) : null}
      </div>
      <Wave className="text-canvas" />
    </div>
  );
}

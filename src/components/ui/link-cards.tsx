import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

export interface LinkCardItem {
  href: string;
  icon: LucideIcon;
  title: string;
  text?: string;
  /** Riga breve sotto il titolo (un prezzo, «Gratis», un tempo). */
  meta?: React.ReactNode;
  /** Tinta del servizio, quando la scheda porta a un servizio. */
  tone?: "capisci" | "medico" | "parere" | "partenza";
  go?: string;
}

/**
 * Schede-collegamento «Luce»: righe compatte su telefono (tessera, titolo, freccia), schede da tablet in su.
 * Ogni scheda è un link intero, alto almeno 44 px.
 */
export function LinkCards({ items, columns, showText = true, go = "Apri" }: { items: LinkCardItem[]; columns?: number; showText?: boolean; go?: string }) {
  return (
    <ul className="other-grid" style={{ "--others": columns ?? items.length } as React.CSSProperties}>
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <li key={it.href + it.title} className={it.tone ? `tone-${it.tone}` : undefined}>
            <Link href={it.href} className={showText ? "other-card other-card-text" : "other-card"}>
              <span aria-hidden className={it.tone ? "tile-ico tile-ico-sm tile-ico-tone" : "tile-ico tile-ico-sm"}>
                <Icon />
              </span>
              <span className="min-w-0">
                <span className="other-name">{it.title}</span>
                {it.text ? <span className="other-line">{it.text}</span> : null}
                {it.meta ? <span className="other-price">{it.meta}</span> : null}
              </span>
              <span className="other-go">
                <span>{it.go ?? go}</span>
                <ArrowRight aria-hidden className="h-5 w-5" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

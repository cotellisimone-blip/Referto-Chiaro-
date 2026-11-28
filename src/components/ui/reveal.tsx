"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

/**
 * Rivela un blocco quando entra nello schermo, con una sola traslazione (il testo non cambia mai opacità).
 * Sul server e senza JavaScript il blocco è visibile e fermo; con prefers-reduced-motion non si muove.
 * `delay` sfalsa gli elementi di una stessa griglia.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "li" | "section" | "article" }) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "prep" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    // Già visibile al caricamento: nessuna animazione (la pagina appare completa subito).
    if (rect.top < window.innerHeight * 0.92) return;
    let timer = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          timer = window.setTimeout(() => setState("in"), delay);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    setState("prep");
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [delay]);

  const Comp = Tag as "div";
  return (
    <Comp ref={ref as React.RefObject<HTMLDivElement>} className={clsx(className, state === "prep" && "reveal-prep", state === "in" && "reveal-in")}>
      {children}
    </Comp>
  );
}

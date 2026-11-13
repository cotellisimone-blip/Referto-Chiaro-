"use client";

import { useEffect, useState } from "react";
import { Printer } from "lucide-react";

/** Barra sottile in alto che mostra quanto dell'articolo è stato letto. Solo decorativa. */
export function ReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <div aria-hidden className="reading-bar no-print" style={{ transform: `scaleX(${p})` }} />;
}

/** Indice «In questa pagina»: evidenzia la sezione visibile. Gli id sono quelli dei titoli h2. */
export function TableOfContents({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 1] },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav aria-label="In questa pagina" className="no-print">
      <p className="text-base font-bold text-ink">In questa pagina</p>
      <ul className="mt-3">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className="toc-link" aria-current={active === i.id ? "true" : undefined}>
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function PrintButton({ label = "Stampa" }: { label?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-secondary btn-sm no-print">
      <Printer aria-hidden className="h-4 w-4" /> {label}
    </button>
  );
}

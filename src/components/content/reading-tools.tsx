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
    // Quarto giro, punto 10: prima un IntersectionObserver accendeva solo i titoli che passavano nella fascia alta dello
    // schermo. Tornando in cima restava acceso l'ultimo, e l'ultimo capitolo (corto) in fondo non si accendeva mai.
    // Ora: il capitolo acceso è l'ultimo il cui titolo è salito sopra il 30% dello schermo; in cima il primo, in fondo l'ultimo.
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (atBottom) return setActive(els[els.length - 1].id);
        const line = window.innerHeight * 0.3;
        let current = els[0].id;
        for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
        setActive(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
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
  // 18/11/2026 (secondo giro, punto 14): sulla carta le domande frequenti devono avere la risposta. Le fisarmoniche
  // chiuse non si stampano: si aprono un attimo prima della stampa (anche da Ctrl+P) e tornano com'erano dopo.
  useEffect(() => {
    const opened: HTMLDetailsElement[] = [];
    const before = () => {
      document.querySelectorAll<HTMLDetailsElement>(".article-body .faq-list details:not([open])").forEach((d) => {
        d.open = true;
        opened.push(d);
      });
    };
    const after = () => {
      for (const d of opened.splice(0)) d.open = false;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);
  return (
    <button type="button" onClick={() => window.print()} className="btn btn-secondary btn-sm no-print">
      <Printer aria-hidden className="h-4 w-4" /> {label}
    </button>
  );
}

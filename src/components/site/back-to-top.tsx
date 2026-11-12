"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** «Torna su»: compare dopo uno schermo e mezzo di scorrimento; rispetta prefers-reduced-motion. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setShow(window.scrollY > window.innerHeight * 1.5));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  // Finché non serve non è nel documento: così non copre nulla (nemmeno per i controlli automatici di contrasto).
  if (!show) return null;
  return (
    <button
      type="button"
      className="back-to-top no-print"
      data-show="true"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
    >
      <ArrowUp aria-hidden className="h-5 w-5" />
      <span className="sr-only">Torna all&apos;inizio della pagina</span>
    </button>
  );
}

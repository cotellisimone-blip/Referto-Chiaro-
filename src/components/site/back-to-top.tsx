"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { formNeedsRoom } from "@/lib/form-in-view";

/** «Torna su»: compare dopo uno schermo e mezzo di scorrimento; rispetta prefers-reduced-motion. Su telefono si fa da parte davanti a un modulo. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setShow(window.scrollY > window.innerHeight * 1.5 && !formNeedsRoom()));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    // Anche quando si entra o si esce da un campo: mentre si scrive il pulsante non deve coprire il modulo.
    document.addEventListener("focusin", onScroll);
    document.addEventListener("focusout", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onScroll);
      document.removeEventListener("focusout", onScroll);
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

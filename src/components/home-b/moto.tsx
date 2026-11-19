"use client";

import { useEffect } from "react";

/**
 * Movimento della home «chiara e scura». A riposo tutto è visibile: niente resta nascosto in attesa dello scorrimento.
 * - `hb-anim` su <html>: il movimento è permesso (la persona non ha chiesto «meno movimento»).
 * - `hb-primo` su <html> per 1,8 s: il primo sguardo (le tappe del percorso salgono, il sole sorge).
 * - una tessera prende `hb-in` solo nell'attimo in cui sta per entrare dal basso, e allora «entra».
 * Al primo caricamento le due classi le mette già lo script delle preferenze (src/lib/prefs-init.ts), prima della prima
 * pittura (niente lampo); arrivando alla home da un'altra pagina le mette questo componente.
 */

const REVEAL = ".hb-g-path .hb-cell,.hb-doc-p,.hb-sec-h,.hb-g-mondi .hb-tile,.hb-g-sempre .hb-tile,.hb-trust div,.hb-foot-note";

export function HomeMoto() {
  useEffect(() => {
    const root = document.documentElement;
    const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (calm) return;
    let primo: number | undefined;
    if (!root.classList.contains("hb-anim")) {
      root.classList.add("hb-anim", "hb-primo");
      primo = window.setTimeout(() => root.classList.remove("hb-primo"), 1800);
    }
    const home = document.querySelector(".hb-home");
    let io: IntersectionObserver | undefined;
    if (home && "IntersectionObserver" in window) {
      const els = Array.from(home.querySelectorAll<HTMLElement>(REVEAL));
      const wide = window.matchMedia("(min-width: 900px)").matches;
      for (const el of els) {
        const siblings = Array.from(el.parentElement?.children ?? []).filter((x) => els.includes(x as HTMLElement));
        const i = siblings.indexOf(el);
        const cols = wide ? 4 : 2;
        let rd = 0;
        if (el.classList.contains("hb-cell")) rd = el.classList.contains("hb-c3") ? (wide ? 180 : 90) : el.classList.contains("hb-c2") && wide ? 90 : 0;
        else if (el.classList.contains("hb-tile") || el.parentElement?.classList.contains("hb-trust")) rd = (i % cols) * 90;
        if (rd) el.style.setProperty("--rd", `${rd}ms`);
        el.classList.add("hb-rv");
      }
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            io?.unobserve(e.target);
            // Entra solo se è ancora sotto il bordo dello schermo (o appena affacciata): se è già in vista resta com'è.
            if (e.boundingClientRect.top > window.innerHeight - 48) e.target.classList.add("hb-in");
          }
        },
        { rootMargin: "0px 0px 70px 0px", threshold: 0 },
      );
      els.forEach((el) => io!.observe(el));
    }
    return () => {
      io?.disconnect();
      if (primo) window.clearTimeout(primo);
      root.classList.remove("hb-anim", "hb-primo");
    };
  }, []);
  return null;
}

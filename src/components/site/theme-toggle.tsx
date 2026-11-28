"use client";

import { useSyncExternalStore, type MouseEvent } from "react";

import { THEME_COLOR, THEME_KEY as KEY, THEME_SEEN_KEY } from "@/lib/prefs-init";

/**
 * Pulsante della luce (19/11/2026, home «chiara e scura» approvata da Simone): il sito nasce chiaro per tutti e diventa
 * scuro con un tocco. Due posizioni sole, chiaro e scuro: non segue più l'impostazione del telefono.
 * Mostra dove porta: la luna quando la pagina è chiara, il sole quando è scura (lo decide il CSS su `data-theme`, così
 * l'icona giusta c'è già nella prima pittura). Il cambio si vede: il buio, o la luce, si allarga a cerchio dal pulsante.
 * Dove il browser non sa farlo, o con «meno movimento», il cambio è immediato. La scelta resta sul dispositivo.
 */
type Theme = "light" | "dark";

const EVENT = "rc-theme-change";

export function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", t);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[t]);
}

function readTheme(): Theme {
  try {
    return localStorage.getItem(KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };

/** Cambia la luce. `from` è il punto da cui parte il cerchio (di solito il centro del pulsante toccato). */
export function switchTheme(next: Theme, from?: { x: number; y: number }) {
  const root = document.documentElement;
  const save = () => {
    applyTheme(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  };
  const doc = document as ViewTransitionDoc;
  const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (calm || typeof doc.startViewTransition !== "function" || !from) {
    save();
    return;
  }
  const r = Math.hypot(Math.max(from.x, window.innerWidth - from.x), Math.max(from.y, window.innerHeight - from.y));
  let t: { ready: Promise<void> };
  try {
    t = doc.startViewTransition(() => {
      save();
      // L'astro della home (il sole o la luna) sorge di nuovo: la classe dura quanto la sua animazione.
      root.classList.add("luce-cambio");
    });
  } catch {
    save();
    return;
  }
  window.setTimeout(() => root.classList.remove("luce-cambio"), 1700);
  t.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${from.x}px ${from.y}px)`, `circle(${r}px at ${from.x}px ${from.y}px)`] },
        { duration: 780, easing: "cubic-bezier(.45,0,.2,1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
}

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);
  const dark = theme === "dark";

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    const b = e.currentTarget.getBoundingClientRect();
    // Il richiamo (un alone che pulsa alle prime visite) si spegne per sempre al primo tocco.
    document.documentElement.setAttribute("data-luce-vista", "1");
    try {
      localStorage.setItem(THEME_SEEN_KEY, "1");
    } catch {}
    switchTheme(readTheme() === "dark" ? "light" : "dark", { x: b.left + b.width / 2, y: b.top + b.height / 2 });
  }

  const label = dark ? "Passa alla visione chiara" : "Passa alla visione scura";
  return (
    <button type="button" onClick={toggle} className={`luce-btn${className ? ` ${className}` : ""}`} aria-pressed={dark} aria-label={label} title={label} data-testid="luce">
      <svg viewBox="0 0 24 24" aria-hidden className="luce-ic luce-sole">
        <circle cx="12" cy="12" r="4.2" fill="currentColor" fillOpacity=".28" />
        <path d="M12 2.6v2.3M12 19.1v2.3M2.6 12h2.3M19.1 12h2.3M5.35 5.35l1.65 1.65M17 17l1.65 1.65M5.35 18.65L7 17M17 7l1.65-1.65" />
      </svg>
      <svg viewBox="0 0 24 24" aria-hidden className="luce-ic luce-luna">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" fill="currentColor" fillOpacity=".28" />
      </svg>
    </button>
  );
}

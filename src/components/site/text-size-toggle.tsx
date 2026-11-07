"use client";

import { useSyncExternalStore } from "react";

import { SIZE_KEY as KEY } from "@/lib/prefs-init";
const EVENT = "rc-size-change";

function readLarge(): boolean {
  try {
    return localStorage.getItem(KEY) === "large";
  } catch {
    return false;
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

/** Pulsante «Aa»: testo normale o più grande, ricordato nel browser. */
export function TextSizeToggle({ className }: { className?: string }) {
  const large = useSyncExternalStore(subscribe, readLarge, () => false);
  function toggle() {
    const next = !large;
    const root = document.documentElement;
    if (next) root.setAttribute("data-size", "large");
    else root.removeAttribute("data-size");
    try {
      if (next) localStorage.setItem(KEY, "large");
      else localStorage.removeItem(KEY);
    } catch {}
    window.dispatchEvent(new Event(EVENT));
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={large}
      className={className ?? "inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line bg-paper px-2 font-serif text-ink transition-colors hover:bg-mist"}
      title={large ? "Testo più grande attivo" : "Testo più grande"}
    >
      <span aria-hidden className="leading-none">
        <span className="text-[0.75rem]">A</span>
        <span className="text-[1.125rem]">A</span>
      </span>
      <span className="sr-only">Testo più grande</span>
    </button>
  );
}

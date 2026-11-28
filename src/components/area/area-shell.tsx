"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

/**
 * Pagine «di lettura» dell'area personale: il referto aperto (valori accanto al documento) e il dossier.
 * Qui su computer la colonna di navigazione lascia spazio al contenuto; si torna indietro con il collegamento in alto.
 */
const FOCUS = [/^\/area-personale\/documenti\/[^/]+/, /^\/area-personale\/dossier\/(?!nuovo(?:\/|$))[^/]+/];

export function isFocusPath(pathname: string) {
  return FOCUS.some((r) => r.test(pathname));
}

/** Griglia dell'area personale: navigazione a sinistra e contenuto, oppure solo contenuto nelle pagine di lettura. */
export function AreaShell({ nav, children }: { nav: ReactNode; children: ReactNode }) {
  const focus = isFocusPath(usePathname());
  return (
    <div data-bottom-nav className={clsx("container-rc grid grid-cols-[minmax(0,1fr)] gap-6 pb-12 pt-6 sm:pt-10 lg:gap-10 lg:pb-16", !focus && "lg:grid-cols-[300px_minmax(0,1fr)]")}>
      {nav}
      {children}
    </div>
  );
}

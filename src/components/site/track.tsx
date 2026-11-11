"use client";

import { useEffect } from "react";
import { detectSource, type Source } from "@/domain/metrics/funnel";

/**
 * Contatori anonimi del funnel (vedi src/domain/metrics/funnel.ts). Nessun cookie, nessun identificativo:
 * si invia solo il nome dell'evento. Un elemento con data-track="cta-capisci" conta un clic.
 */
/**
 * Ciclo 2, fase 2: sorgente della visita, calcolata una volta sola sulla pagina d'arrivo e tenuta in memoria finché la
 * scheda resta aperta (la navigazione interna non ricarica la pagina). Nessun cookie, nessuno storage.
 */
let landingSource: Source | null = null;
export function currentSource(): Source {
  if (landingSource) return landingSource;
  try {
    landingSource = detectSource({ search: window.location.search, referrer: document.referrer, ownHost: window.location.hostname });
  } catch {
    landingSource = "altro";
  }
  return landingSource;
}

export function track(event: string) {
  try {
    const body = new Blob([JSON.stringify({ event, source: currentSource() })], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/v1/public/evento", body)) void fetch("/api/v1/public/evento", { method: "POST", body, keepalive: true });
  } catch {
    /* le metriche non devono mai disturbare la pagina */
  }
}

export function TrackClicks() {
  // La sorgente si fissa al primo caricamento, prima di qualsiasi navigazione interna.
  useEffect(() => void currentSource(), []);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-track]");
      const ev = el?.getAttribute("data-track");
      if (ev) track(ev);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}

export function TrackView({ event }: { event: string }) {
  // Nessun dato salvato sul dispositivo (niente cookie né storage): si conta una visita per caricamento.
  useEffect(() => track(event), [event]);
  return null;
}

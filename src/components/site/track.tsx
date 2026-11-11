"use client";

import { useEffect } from "react";

/**
 * Contatori anonimi del funnel (vedi src/domain/metrics/funnel.ts). Nessun cookie, nessun identificativo:
 * si invia solo il nome dell'evento. Un elemento con data-track="cta-capisci" conta un clic.
 */
function send(event: string) {
  try {
    const body = new Blob([JSON.stringify({ event })], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/v1/public/evento", body)) void fetch("/api/v1/public/evento", { method: "POST", body, keepalive: true });
  } catch {
    /* le metriche non devono mai disturbare la pagina */
  }
}

export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-track]");
      const ev = el?.getAttribute("data-track");
      if (ev) send(ev);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}

export function TrackView({ event }: { event: string }) {
  // Nessun dato salvato sul dispositivo (niente cookie né storage): si conta una visita per caricamento.
  useEffect(() => send(event), [event]);
  return null;
}

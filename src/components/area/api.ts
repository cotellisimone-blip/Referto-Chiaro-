"use client";

/** Chiamate alle API dell'area personale: sempre JSON, mai cache, errori con messaggio leggibile. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function api<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(path, {
    method: init?.method ?? "GET",
    headers: init?.body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
    credentials: "same-origin",
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string } & T;
  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      // Sessione scaduta: si torna alla pagina di accesso (navigazione completa, lo stato locale non è più valido).
      const target = `/accedi?next=${encodeURIComponent(window.location.pathname)}`;
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- navigazione completa voluta: la sessione non è più valida
      window.location.href = target;
    }
    throw new ApiError(res.status, data.error ?? "error", data.message ?? "Si è verificato un errore. Riprova.");
  }
  return data;
}

export const STATUS_LABEL: Record<string, { label: string; tone: "muted" | "teal" | "sage" | "warn" | "danger" }> = {
  queued: { label: "In coda", tone: "muted" },
  extracting: { label: "Lettura in corso", tone: "teal" },
  processing: { label: "In elaborazione", tone: "teal" },
  "needs-verification": { label: "Da verificare", tone: "warn" },
  verified: { label: "Verificato", tone: "teal" },
  ready: { label: "Pronto", tone: "sage" },
  error: { label: "Errore", tone: "danger" },
};

export function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

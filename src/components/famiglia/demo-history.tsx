"use client";

import { useState } from "react";
import { History, Loader2 } from "lucide-react";
import { api } from "@/components/area/api";

/** Solo versione dimostrativa: carica una famiglia inventata (referti di anni precedenti, «Lucia», due promemoria). */
export function DemoHistoryButton({
  onDone,
  className = "btn btn-secondary",
}: {
  onDone: () => void;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function load() {
    setBusy(true);
    setError(null);
    try {
      await api("/api/v1/area/storico-esempio", { method: "POST", body: {} });
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={load}
        disabled={busy}
        data-testid="carica-storico"
      >
        {busy ? (
          <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
        ) : (
          <History aria-hidden className="h-5 w-5" />
        )}
        Carica lo storico di esempio
      </button>
      {error ? (
        <p role="alert" className="field-error w-full">
          {error}
        </p>
      ) : null}
    </>
  );
}

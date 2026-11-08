"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { ArrowRight, FileText, Loader2, Lock, Upload } from "lucide-react";
import type { SyntheticSample } from "@/fixtures/synthetic";
import { Stepper } from "@/components/report/stepper";
import { api, formatDate } from "./api";
import { UploadBox } from "./upload-box";

export const WORKFLOW_STEPS = ["Documento", "Valori", "Servizio", "Elaborazione", "Report"] as const;

/**
 * Passo 1 del percorso guidato. In demo il caricamento di un file reale è disattivato dal gate
 * lato server: qui si sceglie un referto di esempio. La zona di caricamento resta visibile, ma spenta e spiegata.
 */
export function NewDocument({ samples, uploadsEnabled }: { samples: SyntheticSample[]; uploadsEnabled: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string>(samples[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string }>("/api/v1/area/documents", { method: "POST", body: { sampleId: selected } });
      router.push(`/area-personale/documenti/${r.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto.");
      setBusy(false);
    }
  }

  return (
    <div>
      <Stepper steps={WORKFLOW_STEPS} step={0} label="Avanzamento del nuovo referto" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.8fr] [&>*]:min-w-0">
        <section aria-labelledby="scegli-titolo">
          <h1 id="scegli-titolo" className="display text-[1.75rem] sm:text-[2.25rem]">
            Scegli un referto di esempio.
          </h1>
          <p className="mt-3 text-lg text-muted">Sono tutti inventati: nessuna persona reale, nessun laboratorio reale. Servono a provare il percorso completo.</p>
          <ul className="mt-6 space-y-3" aria-label="Referti di esempio">
            {samples.map((s) => {
              const active = s.id === selected;
              return (
                <li key={s.id}>
                  <label className={clsx("flex cursor-pointer gap-4 rounded-2xl border bg-paper p-4 transition-colors sm:p-5", active ? "border-teal/60 shadow-[var(--shadow-card)]" : "border-line hover:border-teal/40")}>
                    <input type="radio" name="sample" value={s.id} checked={active} onChange={() => setSelected(s.id)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-teal)]" />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="font-semibold text-ink">{s.title}</span>
                        <span className="tabular text-sm text-muted">{formatDate(s.reportDate)}</span>
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {s.description} {s.observationCount} voci{s.hasUnreadable ? ", una non leggibile" : ""}.
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          {error ? (
            <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">
              {error}
            </p>
          ) : null}
          <button type="button" className="btn btn-primary mt-6" onClick={create} disabled={busy || !selected}>
            {busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <FileText aria-hidden className="h-4 w-4" />}
            Aggiungi e leggi il documento <ArrowRight aria-hidden className="h-4 w-4" />
          </button>
        </section>

        <aside aria-labelledby="upload-titolo">
          {uploadsEnabled ? (
            <UploadBox />
          ) : (
            <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-line bg-canvas p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-mist">
                  <Lock aria-hidden className="h-5 w-5 text-muted" />
                </span>
                <h2 id="upload-titolo" className="font-serif text-xl">
                  Carica un tuo referto
                </h2>
              </div>
              <p className="mt-4 text-[0.9375rem] text-muted">
                Non ancora attivo. Il caricamento di documenti reali si accende solo dopo le verifiche cliniche, legali e di sicurezza: fino ad allora il server rifiuta qualsiasi file, anche se qualcuno provasse ad aggirare questa pagina.
              </p>
              <button type="button" className="btn btn-secondary mt-5 w-full" disabled aria-disabled="true">
                <Upload aria-hidden className="h-4 w-4" /> Carica un file
              </button>
              <p className="mt-3 text-center text-xs text-muted">Stato del servizio: in preparazione.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

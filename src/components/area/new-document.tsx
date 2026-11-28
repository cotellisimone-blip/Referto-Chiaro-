"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { ArrowRight, FileText, Loader2, Lock, Upload } from "lucide-react";
import type { SyntheticSample } from "@/fixtures/synthetic";
import { Stepper } from "@/components/report/stepper";
import { api, formatDate } from "./api";
import { UploadBox } from "./upload-box";
import { PersonaAvatar, usePersone } from "@/components/famiglia/shared";
import { SELF_ID } from "@/domain/famiglia/persone";

export const WORKFLOW_STEPS = [
  "Documento",
  "Valori",
  "Servizio",
  "Elaborazione",
  "Report",
] as const;

/**
 * Passo 1 del percorso guidato. In demo il caricamento di un file reale è disattivato dal gate
 * lato server: qui si sceglie un referto di esempio. La zona di caricamento resta visibile, ma spenta e spiegata.
 */
export function NewDocument({
  samples,
  uploadsEnabled,
}: {
  samples: SyntheticSample[];
  uploadsEnabled: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const { persone } = usePersone();
  const [persona, setPersona] = useState(params.get("persona") ?? SELF_ID);
  const profileId = persona === SELF_ID ? null : persona;
  const [selected, setSelected] = useState<string>(samples[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string }>("/api/v1/area/documents", {
        method: "POST",
        body: { sampleId: selected, profileId },
      });
      router.push(`/area-personale/documenti/${r.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto.");
      setBusy(false);
    }
  }

  return (
    <div>
      <Stepper
        steps={WORKFLOW_STEPS}
        step={0}
        label="Avanzamento del nuovo referto"
      />
      <div className="mt-8 grid gap-8 sm:mt-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] xl:gap-10 [&>*]:min-w-0">
        <section aria-labelledby="scegli-titolo">
          <h1 id="scegli-titolo" className="area-title">
            Scegli un referto di esempio.
          </h1>
          <p className="area-lead">
            Sono tutti inventati: nessuna persona reale, nessun laboratorio
            reale. Servono a provare il percorso completo.
          </p>
          {/* Famiglia: di chi è il referto. Compare solo se segui almeno un familiare. */}
          {persone && persone.length > 1 ? (
            <fieldset className="mt-6" data-testid="di-chi">
              <legend className="field-label">Di chi è questo referto?</legend>
              <div className="choice-pills mt-3">
                {persone.map((p, i) => (
                  <label key={p.id} className="choice-pill">
                    <input
                      type="radio"
                      name="persona"
                      value={p.id}
                      checked={persona === p.id}
                      onChange={() => setPersona(p.id)}
                    />
                    <PersonaAvatar persona={p} index={i - 1} size="sm" />
                    {p.relation === "io" ? "Mio" : p.name}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          <ul className="mt-6 space-y-3" aria-label="Referti di esempio">
            {samples.map((s) => {
              const active = s.id === selected;
              return (
                <li key={s.id}>
                  <label
                    className={clsx(
                      "flex cursor-pointer gap-4 rounded-[1.25rem] border-[1.5px] bg-paper p-4 transition-colors sm:p-5",
                      active
                        ? "border-teal bg-[color-mix(in_srgb,var(--color-marker-soft)_45%,var(--color-paper))] shadow-[var(--shadow-card)]"
                        : "border-line hover:border-teal/50",
                    )}
                  >
                    <input
                      type="radio"
                      name="sample"
                      value={s.id}
                      checked={active}
                      onChange={() => setSelected(s.id)}
                      className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--color-teal)]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <span className="text-lg font-bold leading-snug text-ink">
                          {s.title}
                        </span>
                        <span className="tabular text-base text-muted">
                          {formatDate(s.reportDate)}
                        </span>
                      </span>
                      <span className="mt-1 block text-base text-ink-soft">
                        {s.description} {s.observationCount} voci
                        {s.hasUnreadable ? ", una non leggibile" : ""}.
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          {error ? (
            <p role="alert" className="field-error mt-4">
              {error}
            </p>
          ) : null}
          <div className="step-bar mt-6">
            <button
              type="button"
              className="btn btn-primary btn-lg w-full max-sm:px-4 lg:w-auto"
              onClick={create}
              disabled={busy || !selected}
            >
              {busy ? (
                <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
              ) : (
                <FileText aria-hidden className="h-5 w-5" />
              )}
              Aggiungi e leggi il documento{" "}
              <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </button>
          </div>
        </section>

        <aside aria-labelledby="upload-titolo">
          {uploadsEnabled ? (
            <UploadBox profileId={profileId} />
          ) : (
            <div className="rounded-[var(--radius-lg)] border-2 border-dashed border-line bg-canvas p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span aria-hidden className="tile-ico tile-ico-sm">
                  <Lock />
                </span>
                <h2 id="upload-titolo" className="side-card-title text-xl">
                  Carica un tuo referto
                </h2>
              </div>
              <p className="mt-4 text-base text-ink-soft">
                Non ancora attivo. Il caricamento di documenti reali si accende
                solo dopo le verifiche cliniche, legali e di sicurezza: fino ad
                allora il server rifiuta qualsiasi file, anche se qualcuno
                provasse ad aggirare questa pagina.
              </p>
              <button
                type="button"
                className="btn btn-secondary mt-5 w-full"
                disabled
                aria-disabled="true"
              >
                <Upload aria-hidden className="h-5 w-5" /> Carica un file
              </button>
              <p className="mt-3 text-center text-[0.9375rem] text-muted">
                Stato del servizio: in preparazione.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

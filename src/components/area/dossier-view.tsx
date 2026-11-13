"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import type { DossierContent } from "@/domain/dossier/build-dossier";
import { api, formatDate } from "./api";
import { StatusChip } from "./status-chip";

interface Dossier {
  id: string;
  title: string;
  status: string;
  content: DossierContent | null;
  errorMessage: string | null;
}

export function DossierView({ dossierId }: { dossierId: string }) {
  const router = useRouter();
  const [d, setD] = useState<Dossier | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      try {
        const r = await api<{ dossier: Dossier }>(`/api/v1/area/dossiers/${dossierId}`);
        if (!alive) return;
        setD(r.dossier);
        if (r.dossier.status === "queued" || r.dossier.status === "processing") timer = setTimeout(load, 1000);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Errore");
      }
    };
    void load();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [dossierId]);

  async function remove() {
    if (!window.confirm("Eliminare questo dossier? I referti restano.")) return;
    await api(`/api/v1/area/dossiers/${dossierId}`, { method: "DELETE" });
    router.push("/area-personale/dossier");
    router.refresh();
  }

  if (error) return <p role="alert" className="text-danger">{error}</p>;
  if (!d) return <div className="h-48 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/area-personale/dossier" className="back-link">
          <ArrowLeft aria-hidden /> Tutti i dossier
        </Link>
        <div className="flex items-center gap-3">
          <StatusChip status={d.status} />
          <button type="button" onClick={remove} className="danger-link">
            <Trash2 aria-hidden className="h-[1.125rem] w-[1.125rem]" /> Elimina
          </button>
        </div>
      </div>
      <h1 className="area-title">{d.title}</h1>

      {d.status === "queued" || d.status === "processing" ? (
        <p className="mt-4 flex items-start gap-2.5 text-lg text-ink-soft" role="status">
          <Loader2 aria-hidden className="mt-1 h-5 w-5 shrink-0 animate-spin text-teal" /> Ordiniamo i referti e cerchiamo gli esami confrontabili…
        </p>
      ) : null}
      {d.status === "error" ? (
        <p role="alert" className="field-error mt-4">
          {d.errorMessage}
        </p>
      ) : null}

      {d.content ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-10 [&>*]:min-w-0">
          <div className="space-y-10">
            <section aria-labelledby="cron-titolo">
              <h2 id="cron-titolo" className="area-h2">
                Cronologia dei referti
              </h2>
              <ol className="mt-5 space-y-5 border-l-2 border-line pl-6">
                {d.content.entries.map((e) => (
                  <li key={e.documentId} className="relative">
                    <span aria-hidden className="absolute -left-[2.0625rem] top-1.5 h-3.5 w-3.5 rounded-full bg-teal shadow-[0_0_0_4px_var(--color-marker-soft)]" />
                    <p className="text-[1.0625rem] font-bold text-ink">
                      {formatDate(e.reportDate)} · {e.title.replace(" — esempio sintetico", "")}
                    </p>
                    <p className="meta">{e.laboratoryName}</p>
                    <p className="mt-1.5 text-[1.0625rem] text-ink-soft">{e.explanation.summary}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="conf-titolo">
              <h2 id="conf-titolo" className="area-h2">
                Esami confrontabili
              </h2>
              {d.content.comparisons.length === 0 ? (
                <p className="mt-3 text-[1.0625rem] text-muted">Nessun esame compare in più referti con lo stesso nome e la stessa unità.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {d.content.comparisons.map((c) => (
                    <li key={c.nameExact} className="card p-5 sm:p-6">
                      <p className="area-h3">{c.nameExact}</p>
                      <table className="tabular mt-3 w-full text-base">
                        <thead className="text-[0.9375rem] text-muted">
                          <tr>
                            <th scope="col" className="py-1.5 pr-3 text-left font-semibold">Data</th>
                            <th scope="col" className="py-1.5 pr-3 text-left font-semibold">Valore</th>
                            <th scope="col" className="py-1.5 text-left font-semibold">Intervallo stampato</th>
                          </tr>
                        </thead>
                        <tbody>
                          {c.points.map((p) => (
                            <tr key={p.documentId} className="border-t border-line">
                              <td className="py-2 pr-3 text-ink-soft">{formatDate(p.reportDate)}</td>
                              <td className="whitespace-nowrap py-2 pr-3 font-bold text-ink">
                                {p.valueExact} <span className="font-normal text-muted">{c.unitExact}</span>
                              </td>
                              <td className="py-2 text-ink-soft">{p.referenceExact ?? "non riportato"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="mt-3 text-[1.0625rem] font-semibold text-teal-deep">{c.deltaText}</p>
                    </li>
                  ))}
                </ul>
              )}
              {d.content.notComparable.length ? (
                <div className="mt-4 rounded-[var(--radius-lg)] border border-dashed border-muted/40 p-5 sm:p-6">
                  <p className="area-h3">Non confrontati</p>
                  <ul className="mt-2 space-y-1 text-[1.0625rem] text-muted">
                    {d.content.notComparable.map((n) => (
                      <li key={n.nameExact}>
                        <span className="text-ink">{n.nameExact}</span>: {n.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          </div>
          <aside className="space-y-5">
            <div className="rounded-[var(--radius-lg)] bg-cream/60 p-5 text-[1.0625rem] text-ink sm:p-6">
              <p className="area-h3">Limiti di questo dossier</p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                {d.content.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="side-card">
              <p className="side-card-title">Domande per la visita</p>
              <ol className="num-list num-list-mist mt-4 text-[1.0625rem] leading-snug text-ink">
                {[...new Set(d.content.entries.flatMap((e) => e.explanation.questionsForDoctor))].slice(0, 6).map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

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
    router.push("/area/dossier");
    router.refresh();
  }

  if (error) return <p role="alert" className="text-danger">{error}</p>;
  if (!d) return <div className="h-48 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/area/dossier" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-teal hover:underline">
          <ArrowLeft aria-hidden className="h-4 w-4" /> Tutti i dossier
        </Link>
        <div className="flex items-center gap-3">
          <StatusChip status={d.status} />
          <button type="button" onClick={remove} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-danger hover:bg-danger/10">
            <Trash2 aria-hidden className="h-4 w-4" /> Elimina
          </button>
        </div>
      </div>
      <h1 className="display text-[2rem] sm:text-[2.5rem]">{d.title}</h1>

      {d.status === "queued" || d.status === "processing" ? (
        <p className="mt-4 flex items-center gap-2 text-lg text-muted" role="status">
          <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> Ordiniamo i referti e cerchiamo gli esami confrontabili…
        </p>
      ) : null}
      {d.status === "error" ? (
        <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-paper px-4 py-3 text-danger">
          {d.errorMessage}
        </p>
      ) : null}

      {d.content ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] [&>*]:min-w-0">
          <div className="space-y-6">
            <section aria-labelledby="cron-titolo">
              <h2 id="cron-titolo" className="font-serif text-2xl">
                Cronologia dei referti
              </h2>
              <ol className="mt-4 space-y-3 border-l-2 border-line pl-6">
                {d.content.entries.map((e) => (
                  <li key={e.documentId} className="relative">
                    <span aria-hidden className="absolute -left-[1.95rem] top-1.5 h-3 w-3 rounded-full bg-teal" />
                    <p className="font-semibold text-ink">
                      {formatDate(e.reportDate)} · {e.title.replace(" — esempio sintetico", "")}
                    </p>
                    <p className="text-sm text-muted">{e.laboratoryName}</p>
                    <p className="mt-1 text-[0.9375rem] text-ink">{e.explanation.summary}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="conf-titolo">
              <h2 id="conf-titolo" className="font-serif text-2xl">
                Esami confrontabili
              </h2>
              {d.content.comparisons.length === 0 ? (
                <p className="mt-3 text-muted">Nessun esame compare in più referti con lo stesso nome e la stessa unità.</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {d.content.comparisons.map((c) => (
                    <li key={c.nameExact} className="card p-5">
                      <p className="font-semibold text-ink">{c.nameExact}</p>
                      <table className="tabular mt-3 w-full text-sm">
                        <thead className="text-muted">
                          <tr>
                            <th scope="col" className="py-1 text-left font-medium">Data</th>
                            <th scope="col" className="py-1 text-left font-medium">Valore</th>
                            <th scope="col" className="py-1 text-left font-medium">Intervallo stampato</th>
                          </tr>
                        </thead>
                        <tbody>
                          {c.points.map((p) => (
                            <tr key={p.documentId} className="border-t border-line">
                              <td className="py-1.5">{formatDate(p.reportDate)}</td>
                              <td className="py-1.5 font-mono">
                                {p.valueExact} {c.unitExact}
                              </td>
                              <td className="py-1.5 font-mono text-muted">{p.referenceExact ?? "non riportato"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="mt-3 text-[0.9375rem] text-teal-deep">{c.deltaText}</p>
                    </li>
                  ))}
                </ul>
              )}
              {d.content.notComparable.length ? (
                <div className="mt-4 rounded-2xl border border-dashed border-muted/40 p-5">
                  <p className="font-semibold text-ink">Non confrontati</p>
                  <ul className="mt-2 space-y-1 text-[0.9375rem] text-muted">
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
            <div className="rounded-2xl bg-cream/60 p-5 text-[0.9375rem] text-ink">
              <p className="font-semibold">Limiti di questo dossier</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {d.content.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <p className="font-semibold text-ink">Domande per la visita</p>
              <ul className="mt-3 space-y-2 text-[0.9375rem]">
                {[...new Set(d.content.entries.flatMap((e) => e.explanation.questionsForDoctor))].slice(0, 6).map((q) => (
                  <li key={q} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

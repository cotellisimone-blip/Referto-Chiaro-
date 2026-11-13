"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, Loader2 } from "lucide-react";
import { api, formatDateTime } from "./api";

interface Doc {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}
interface Rep {
  documentId: string;
  status: string;
}

export function DossierNew() {
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("Dossier per la visita");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ documents: Doc[]; reports: Rep[] }>("/api/v1/area/documents")
      .then((d) => setDocs(d.documents.filter((x) => x.status === "ready" && d.reports.some((r) => r.documentId === x.id && r.status === "ready"))))
      .catch((e) => setError(e instanceof Error ? e.message : "Errore"));
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string }>("/api/v1/area/dossiers", { method: "POST", body: { title, documentIds: selected } });
      router.push(`/area-personale/dossier/${r.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto.");
      setBusy(false);
    }
  }

  if (!docs) return <div className="h-48 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;

  return (
    <form onSubmit={create} className="max-w-3xl">
      <h1 className="area-title">Nuovo dossier</h1>
      <p className="area-lead">Scegli almeno due referti con report pronto. Li ordiniamo per data e confrontiamo solo gli esami con lo stesso nome e la stessa unità.</p>
      <div className="mt-6">
        <label htmlFor="titolo" className="field-label">
          Titolo
        </label>
        <input id="titolo" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required className="field-input" />
      </div>
      <fieldset className="mt-6">
        <legend className="field-label">Referti con report pronto</legend>
        {docs.length < 2 ? (
          <p className="mt-3 rounded-[var(--radius-lg)] border border-dashed border-muted/40 bg-paper p-5 text-[1.0625rem] text-ink-soft">
            Servono almeno due referti con report pronto.{" "}
            <Link href="/area-personale/nuovo" className="link">
              Aggiungi un referto
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {docs.map((d) => {
              const on = selected.includes(d.id);
              return (
                <li key={d.id}>
                  <label className={clsx("flex cursor-pointer items-start gap-4 rounded-[1.25rem] border-[1.5px] bg-paper p-4 transition-colors sm:p-5", on ? "border-teal bg-[color-mix(in_srgb,var(--color-marker-soft)_45%,var(--color-paper))]" : "border-line hover:border-teal/50")}>
                    <input type="checkbox" checked={on} onChange={() => setSelected((s) => (on ? s.filter((x) => x !== d.id) : [...s, d.id]))} className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--color-teal)]" />
                    <span>
                      <span className="block text-lg font-bold leading-snug text-ink">{d.title}</span>
                      <span className="block text-base text-muted">aggiunto il {formatDateTime(d.createdAt)}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </fieldset>
      {error ? (
        <p role="alert" className="field-error mt-4">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary btn-lg mt-8 w-full sm:w-auto" disabled={busy || selected.length < 2}>
        {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null}
        Crea il dossier <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
      </button>
    </form>
  );
}

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
      router.push(`/area/dossier/${r.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto.");
      setBusy(false);
    }
  }

  if (!docs) return <div className="h-48 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;

  return (
    <form onSubmit={create} className="max-w-3xl">
      <h1 className="display text-[2rem] sm:text-[2.5rem]">Nuovo dossier</h1>
      <p className="mt-3 text-lg text-muted">Scegli almeno due referti con report pronto. Li ordiniamo per data e confrontiamo solo gli esami con lo stesso nome e la stessa unità.</p>
      <div className="mt-6">
        <label htmlFor="titolo" className="block text-sm font-semibold text-ink">
          Titolo
        </label>
        <input id="titolo" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required className="mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-ink focus:border-teal" />
      </div>
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink">Referti con report pronto</legend>
        {docs.length < 2 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-muted/40 p-5 text-muted">
            Servono almeno due referti con report pronto.{" "}
            <Link href="/area/nuovo" className="link">
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
                  <label className={clsx("flex cursor-pointer items-start gap-3 rounded-2xl border bg-paper p-4", on ? "border-teal/60" : "border-line")}>
                    <input type="checkbox" checked={on} onChange={() => setSelected((s) => (on ? s.filter((x) => x !== d.id) : [...s, d.id]))} className="mt-0.5 h-5 w-5 accent-[var(--color-teal)]" />
                    <span>
                      <span className="block font-semibold text-ink">{d.title}</span>
                      <span className="block text-sm text-muted">aggiunto il {formatDateTime(d.createdAt)}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </fieldset>
      {error ? (
        <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary mt-8" disabled={busy || selected.length < 2}>
        {busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null}
        Crea il dossier <ArrowRight aria-hidden className="h-4 w-4" />
      </button>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderPlus } from "lucide-react";
import { api, formatDateTime } from "./api";
import { StatusChip } from "./status-chip";

interface Dossier {
  id: string;
  title: string;
  documentIds: string[];
  status: string;
  createdAt: string;
  errorMessage: string | null;
}

export function DossierList() {
  const [list, setList] = useState<Dossier[] | null>(null);
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      const d = await api<{ dossiers: Dossier[] }>("/api/v1/area/dossiers").catch(() => ({ dossiers: [] }));
      if (!alive) return;
      setList(d.dossiers);
      if (d.dossiers.some((x) => x.status === "queued" || x.status === "processing")) timer = setTimeout(load, 1500);
    };
    void load();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, []);
  if (!list) return <div className="h-48 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[2rem] sm:text-[2.5rem]">I tuoi dossier</h1>
          <p className="mt-2 max-w-2xl text-muted">Più referti di date diverse in un solo documento ordinato, con i confronti solo tra esami davvero confrontabili.</p>
        </div>
        <Link href="/area-personale/dossier/nuovo" className="btn btn-primary">
          <FolderPlus aria-hidden className="h-4 w-4" /> Nuovo dossier
        </Link>
      </div>
      {list.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-muted/40 p-6 text-muted">Nessun dossier. Servono almeno due referti con report pronto.</p>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Elenco dei dossier">
          {list.map((d) => (
            <li key={d.id} className="card flex flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-xl leading-tight">{d.title}</h2>
                <StatusChip status={d.status} />
              </div>
              <p className="mt-2 text-sm text-muted">
                {d.documentIds.length} referti · creato il {formatDateTime(d.createdAt)}
              </p>
              {d.errorMessage ? <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{d.errorMessage}</p> : null}
              <div className="mt-auto pt-5">
                <Link href={`/area-personale/dossier/${d.id}`} className="btn btn-secondary w-full sm:w-auto">
                  Apri il dossier <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

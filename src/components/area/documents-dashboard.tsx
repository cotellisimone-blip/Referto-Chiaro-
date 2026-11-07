"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FilePlus2 } from "lucide-react";
import { IllustrationDossier } from "@/components/brand/illustrations";
import { api, formatDateTime } from "./api";
import { StatusChip } from "./status-chip";

interface Doc {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  observationCount: number | null;
  errorMessage: string | null;
}
interface Rep {
  id: string;
  documentId: string;
  service: string;
  status: string;
  createdAt: string;
}

const ACTIVE = new Set(["queued", "extracting", "processing"]);

/** Archivio dei referti: aggiorna da solo finché c'è qualcosa in coda. */
export function DocumentsDashboard() {
  const [data, setData] = useState<{ documents: Doc[]; reports: Rep[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      try {
        const d = await api<{ documents: Doc[]; reports: Rep[] }>("/api/v1/area/documents");
        if (!alive) return;
        setData(d);
        if (d.documents.some((x) => ACTIVE.has(x.status)) || d.reports.some((r) => ACTIVE.has(r.status))) timer = setTimeout(load, 1500);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Errore");
      }
    };
    void load();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (error) return <p role="alert" className="text-danger">{error}</p>;
  if (!data) return <div className="h-48 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;

  if (data.documents.length === 0) {
    return (
      <div className="card grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_0.7fr] lg:items-center">
        <div>
          <h1 className="display text-[2rem] sm:text-[2.5rem]">Nessun referto, per ora.</h1>
          <p className="mt-4 text-lg text-muted">Aggiungi un referto di esempio e segui il percorso completo: lettura, controllo dei valori, spiegazione e PDF.</p>
          <Link href="/area/nuovo" className="btn btn-primary mt-6">
            <FilePlus2 aria-hidden className="h-4 w-4" /> Aggiungi un referto
          </Link>
        </div>
        <div className="mx-auto w-full max-w-[300px]">
          <IllustrationDossier />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display text-[2rem] sm:text-[2.5rem]">I tuoi referti</h1>
          <p className="mt-2 text-muted">Ogni documento mostra il suo stato. Apri un referto per continuare da dove eri rimasto.</p>
        </div>
      </div>
      <ul className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Elenco dei referti">
        {data.documents.map((d) => {
          const reps = data.reports.filter((r) => r.documentId === d.id);
          const ready = reps.find((r) => r.status === "ready");
          const active = reps.find((r) => ACTIVE.has(r.status));
          const status = active ? active.status : d.status;
          return (
            <li key={d.id} className="card flex flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-xl leading-tight">{d.title}</h2>
                <StatusChip status={status} />
              </div>
              <p className="mt-2 text-sm text-muted">
                Aggiunto il {formatDateTime(d.createdAt)}
                {d.observationCount ? ` · ${d.observationCount} voci lette` : ""}
                {ready ? " · report pronto" : ""}
              </p>
              {d.errorMessage ? <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{d.errorMessage}</p> : null}
              <div className="mt-auto pt-5">
                <Link href={`/area/documenti/${d.id}`} className="btn btn-secondary w-full sm:w-auto">
                  {d.status === "needs-verification" ? "Controlla i valori" : d.status === "verified" && !active && !ready ? "Scegli il servizio" : ready ? "Apri il report" : "Apri"}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

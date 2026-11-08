"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, FilePlus2, FileText, FolderOpen, ListChecks, Sparkles } from "lucide-react";
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
interface Dossier {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

const ACTIVE = new Set(["queued", "extracting", "processing"]);
const STEPS = ["Letto", "Controllato", "Servizio scelto", "Report pronto"] as const;

/** Avanzamento di un referto in 4 tacche, dallo stato salvato: quante sono piene e quale sta lavorando. */
function progress(d: Doc, reps: Rep[]) {
  const ready = reps.some((r) => r.status === "ready");
  const working = reps.some((r) => ACTIVE.has(r.status));
  const read = !ACTIVE.has(d.status) && d.status !== "error";
  const checked = d.status === "verified" || reps.length > 0;
  const chosen = reps.length > 0;
  const on = [read, checked, chosen, ready];
  const live = ACTIVE.has(d.status) ? 0 : working ? 3 : -1;
  return { on, live, count: on.filter(Boolean).length, ready, working };
}

/**
 * Cruscotto dell'area personale: riepilogo in tessere, il prossimo passo suggerito, i referti con
 * l'avanzamento a tacche e i dossier. Si aggiorna da solo finché c'è un lavoro in coda.
 */
export function DocumentsDashboard() {
  const [data, setData] = useState<{ documents: Doc[]; reports: Rep[] } | null>(null);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      try {
        const [d, ds] = await Promise.all([
          api<{ documents: Doc[]; reports: Rep[] }>("/api/v1/area/documents"),
          api<{ dossiers: Dossier[] }>("/api/v1/area/dossiers").catch(() => ({ dossiers: [] as Dossier[] })),
        ]);
        if (!alive) return;
        setData(d);
        setDossiers(ds.dossiers);
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

  const summary = useMemo(() => {
    if (!data) return null;
    const docs = data.documents;
    const readyCount = docs.filter((d) => data.reports.some((r) => r.documentId === d.id && r.status === "ready")).length;
    const toCheck = docs.filter((d) => d.status === "needs-verification");
    const toChoose = docs.filter((d) => d.status === "verified" && !data.reports.some((r) => r.documentId === d.id));
    const working = docs.filter((d) => ACTIVE.has(d.status) || data.reports.some((r) => r.documentId === d.id && ACTIVE.has(r.status)));
    const readyDocs = docs.filter((d) => data.reports.some((r) => r.documentId === d.id && r.status === "ready"));
    let next: { title: string; text: string; href: string; cta: string };
    if (toCheck[0]) next = { title: "Controlla i valori letti", text: `«${toCheck[0].title}» aspetta la tua conferma, valore per valore. Spieghiamo solo quelli che confermi.`, href: `/area-personale/documenti/${toCheck[0].id}`, cta: "Controlla i valori" };
    else if (toChoose[0]) next = { title: "Scegli il servizio", text: `I valori di «${toChoose[0].title}» sono confermati. Scegli che cosa vuoi ricevere.`, href: `/area-personale/documenti/${toChoose[0].id}`, cta: "Scegli il servizio" };
    else if (working[0]) next = { title: "Stiamo lavorando", text: `«${working[0].title}» è in elaborazione. Questa pagina si aggiorna da sola.`, href: `/area-personale/documenti/${working[0].id}`, cta: "Segui l'avanzamento" };
    else if (readyDocs.length >= 2 && dossiers.length === 0) next = { title: "Crea il primo dossier", text: "Hai almeno due report pronti: mettili insieme per vedere gli stessi esami nel tempo.", href: "/area-personale/dossier/nuovo", cta: "Crea un dossier" };
    else if (readyDocs[0]) next = { title: "Il report è pronto", text: `Apri «${readyDocs[0].title}»: spiegazioni, valori con la riga di origine e domande per la visita. Puoi scaricare il PDF.`, href: `/area-personale/documenti/${readyDocs[0].id}`, cta: "Apri il report" };
    else next = { title: "Aggiungi un referto", text: "Parti da un referto di esempio e segui il percorso completo.", href: "/area-personale/nuovo", cta: "Aggiungi un referto" };
    const recent = [...docs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);
    return { readyCount, toCheck: toCheck.length, next, recent };
  }, [data, dossiers]);

  if (error) return <p role="alert" className="text-danger">{error}</p>;
  if (!data || !summary) return <div className="h-48 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;

  if (data.documents.length === 0) {
    return (
      <div className="card grain grid gap-8 overflow-hidden p-6 sm:p-10 lg:grid-cols-[1fr_0.7fr] lg:items-center">
        <div>
          <p className="eyebrow">Il tuo archivio</p>
          <h1 className="display-lg mt-3">Nessun referto, per ora.</h1>
          <p className="mt-4 text-lg text-muted">Aggiungi un referto di esempio e segui il percorso completo: lettura, controllo dei valori, spiegazione e PDF.</p>
          <Link href="/area-personale/nuovo" className="btn btn-primary mt-6">
            <FilePlus2 aria-hidden className="h-4 w-4" /> Aggiungi un referto
          </Link>
        </div>
        <div className="mx-auto w-full max-w-[300px]">
          <IllustrationDossier />
        </div>
      </div>
    );
  }

  const tiles = [
    { label: "Referti", value: data.documents.length, icon: FileText, href: "#referti" },
    { label: "Report pronti", value: summary.readyCount, icon: Sparkles, href: "#referti" },
    { label: "Da controllare", value: summary.toCheck, icon: ListChecks, href: "#referti", warn: summary.toCheck > 0 },
    { label: "Dossier", value: dossiers.length, icon: FolderOpen, href: "/area-personale/dossier" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Il tuo spazio</p>
          <h1 className="display-lg mt-3">I tuoi referti</h1>
          <p className="mt-3 text-lg text-muted">Ogni documento mostra a che punto è. Apri un referto per continuare da dove eri rimasto.</p>
        </div>
        <Link href="/area-personale/nuovo" className="btn btn-primary">
          <FilePlus2 aria-hidden className="h-4 w-4" /> Nuovo referto
        </Link>
      </div>

      {/* Tessere di riepilogo */}
      <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Riepilogo">
        {tiles.map(({ label, value, icon: Icon, href, warn }) => (
          <li key={label}>
            <Link href={href} className="stat-tile card-glow block transition-shadow hover:shadow-[var(--shadow-lift)]">
              <span className="flex items-center justify-between text-sm font-semibold text-muted">
                {label}
                <Icon aria-hidden className={clsx("h-4.5 w-4.5", warn ? "text-warn" : "text-teal")} />
              </span>
              <span className={clsx("stat-num", warn ? "text-warn" : "text-ink")}>{value}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Prossimo passo */}
      <section aria-labelledby="prossimo-titolo" className="card mt-6 grid gap-5 overflow-hidden border-teal/30 bg-[linear-gradient(135deg,var(--color-marker-soft),var(--color-paper)_60%)] p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-7">
        <div className="min-w-0">
          <p className="eyebrow">Prossimo passo</p>
          <h2 id="prossimo-titolo" className="mt-2 text-[1.5rem] font-bold leading-tight text-ink">{summary.next.title}</h2>
          <p className="mt-2 text-lg text-ink-soft">{summary.next.text}</p>
        </div>
        <Link href={summary.next.href} className="btn btn-primary sm:whitespace-nowrap">
          {summary.next.cta} <ArrowRight aria-hidden className="btn-arrow h-4 w-4" />
        </Link>
      </section>

      {/* Elenco referti */}
      <h2 id="referti" className="mt-12 scroll-mt-28 text-[1.375rem] font-bold text-ink">Tutti i referti</h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-2" aria-label="Elenco dei referti">
        {data.documents.map((d) => {
          const reps = data.reports.filter((r) => r.documentId === d.id);
          const ready = reps.find((r) => r.status === "ready");
          const active = reps.find((r) => ACTIVE.has(r.status));
          const status = active ? active.status : d.status;
          const p = progress(d, reps);
          return (
            <li key={d.id} className="card card-lift card-glow relative flex flex-col p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-[1.375rem] leading-tight">{d.title}</h3>
                <StatusChip status={status} />
              </div>
              <p className="mt-2 text-sm text-muted">
                Aggiunto il {formatDateTime(d.createdAt)}
                {d.observationCount ? ` · ${d.observationCount} voci lette` : ""}
              </p>
              <div className="mt-4" aria-label={`Avanzamento: ${p.count} passaggi su ${STEPS.length} completati`} role="img">
                <div className="ticks">
                  {STEPS.map((s, i) => (
                    <span key={s} data-on={p.on[i]} data-live={p.live === i} />
                  ))}
                </div>
                <p aria-hidden className="mt-1.5 flex justify-between text-[0.75rem] text-muted">
                  <span>{STEPS[Math.max(0, Math.min(p.count, STEPS.length) - 1)]}</span>
                  <span className="tabular">
                    {p.count}/{STEPS.length}
                  </span>
                </p>
              </div>
              {d.errorMessage ? <p className="mt-3 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{d.errorMessage}</p> : null}
              <div className="mt-auto pt-5">
                <Link href={`/area-personale/documenti/${d.id}`} className={clsx("btn w-full sm:w-auto", d.status === "needs-verification" ? "btn-primary" : "btn-secondary")}>
                  {d.status === "needs-verification" ? "Controlla i valori" : d.status === "verified" && !active && !ready ? "Scegli il servizio" : ready ? "Apri il report" : "Apri"}
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Dossier */}
      <section aria-labelledby="dossier-titolo" className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="dossier-titolo" className="text-[1.375rem] font-bold text-ink">I tuoi dossier</h2>
          <Link href="/area-personale/dossier" className="link text-[1.0625rem] font-semibold">
            Tutti i dossier
          </Link>
        </div>
        {dossiers.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dossiers.slice(0, 3).map((x) => (
              <li key={x.id}>
                <Link href={`/area-personale/dossier/${x.id}`} className="card card-lift flex items-center gap-4 p-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-mist">
                    <FolderOpen aria-hidden className="h-6 w-6 text-teal" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink">{x.title}</span>
                    <span className="block text-sm text-muted">{formatDateTime(x.createdAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-2xl border border-dashed border-line bg-paper px-5 py-4 text-ink-soft">
            Un dossier mette insieme due o più report pronti e mostra gli stessi esami uno accanto all&apos;altro.{" "}
            {summary.readyCount >= 2 ? (
              <Link href="/area-personale/dossier/nuovo" className="link font-semibold">
                Crea il primo dossier
              </Link>
            ) : (
              "Servono almeno due report pronti."
            )}
          </p>
        )}
      </section>
    </div>
  );
}

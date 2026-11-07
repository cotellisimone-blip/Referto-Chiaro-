"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Loader2, Trash2 } from "lucide-react";
import { api, formatDateTime } from "./api";

interface Consent {
  kind: string;
  version: string;
  granted: boolean;
  recorded_at: string;
}

const KIND_LABEL: Record<string, string> = { terms: "Termini del servizio", privacy: "Informativa privacy", "health-data": "Trattamento dei dati sanitari", marketing: "Novità via email (facoltativo)" };

export function Settings({ email, isDemoAccount }: { email: string; isDemoAccount: boolean }) {
  const router = useRouter();
  const [consents, setConsents] = useState<Consent[] | null>(null);
  const [marketing, setMarketing] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState<"" | "delete" | "marketing">("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    api<{ consents: Consent[] }>("/api/v1/area/consents").then((r) => {
      setConsents(r.consents);
      const m = r.consents.find((c) => c.kind === "marketing");
      setMarketing(Boolean(m?.granted));
    });
  }, []);

  async function toggleMarketing(v: boolean) {
    setBusy("marketing");
    await api("/api/v1/area/consents", { method: "POST", body: { kind: "marketing", granted: v } });
    setMarketing(v);
    setBusy("");
    setMsg(v ? "Consenso registrato." : "Consenso revocato.");
  }

  async function deleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setBusy("delete");
    try {
      await api("/api/v1/area/delete-account", { method: "POST", body: { confirm } });
      router.push("/?account=eliminato");
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Errore");
      setBusy("");
    }
  }

  const latest = new Map<string, Consent>();
  for (const c of consents ?? []) if (!latest.has(c.kind)) latest.set(c.kind, c);

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="display text-[2rem] sm:text-[2.5rem]">Impostazioni</h1>
        <p className="mt-2 text-muted">Account: {email}</p>
      </div>

      <section className="card p-6" aria-labelledby="consensi-titolo">
        <h2 id="consensi-titolo" className="font-serif text-2xl">
          Consensi
        </h2>
        <p className="mt-2 text-sm text-muted">Le versioni indicate sono bozze in revisione legale. I consensi necessari si revocano eliminando l&apos;account.</p>
        {!consents ? (
          <div className="mt-4 h-24 animate-pulse rounded-xl bg-mist" />
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {["terms", "privacy", "health-data"].map((k) => {
              const c = latest.get(k);
              return (
                <li key={k} className="flex flex-wrap items-center justify-between gap-2 py-3 text-[0.9375rem]">
                  <span className="text-ink">{KIND_LABEL[k]}</span>
                  <span className="text-sm text-muted">{c ? `accettato il ${formatDateTime(c.recorded_at)} · versione ${c.version}` : "non registrato"}</span>
                </li>
              );
            })}
            <li className="flex flex-wrap items-center justify-between gap-2 py-3 text-[0.9375rem]">
              <label htmlFor="marketing" className="text-ink">
                {KIND_LABEL.marketing}
              </label>
              <span className="flex items-center gap-2">
                {busy === "marketing" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin text-muted" /> : null}
                <input id="marketing" type="checkbox" checked={marketing} disabled={busy === "marketing"} onChange={(e) => toggleMarketing(e.target.checked)} className="h-5 w-5 accent-[var(--color-teal)]" />
              </span>
            </li>
          </ul>
        )}
      </section>

      <section className="card p-6" aria-labelledby="export-titolo">
        <h2 id="export-titolo" className="font-serif text-2xl">
          I tuoi dati
        </h2>
        <p className="mt-2 text-muted">Scarica tutto quello che conserviamo su di te in un file JSON leggibile: account, consensi, referti, report e dossier.</p>
        <a href="/api/v1/area/export" className="btn btn-secondary mt-4" download>
          <Download aria-hidden className="h-4 w-4" /> Esporta i miei dati
        </a>
      </section>

      <section className="rounded-[var(--radius-lg)] border border-danger/30 bg-paper p-6" aria-labelledby="elimina-titolo">
        <h2 id="elimina-titolo" className="font-serif text-2xl text-danger">
          Elimina l&apos;account
        </h2>
        {isDemoAccount ? (
          <p className="mt-2 text-muted">L&apos;account demo è condiviso e non si può eliminare. Crea un account con la tua email per provare anche questa funzione.</p>
        ) : (
          <form onSubmit={deleteAccount} className="mt-2">
            <p className="text-muted">Cancella referti, report, dossier e sessioni. L&apos;operazione non si può annullare. Scrivi ELIMINA per confermare.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input aria-label="Conferma scrivendo ELIMINA" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="min-h-12 flex-1 rounded-xl border border-line bg-paper px-4 text-ink focus:border-danger" placeholder="ELIMINA" />
              <button type="submit" className="btn border border-danger/40 text-danger hover:bg-danger/10" disabled={confirm !== "ELIMINA" || busy === "delete"}>
                {busy === "delete" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Trash2 aria-hidden className="h-4 w-4" />}
                Elimina definitivamente
              </button>
            </div>
          </form>
        )}
      </section>
      {msg ? (
        <p role="status" className="text-sm text-muted">
          {msg}
        </p>
      ) : null}
    </div>
  );
}

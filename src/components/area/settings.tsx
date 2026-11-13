"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, Loader2, ShieldOff, Trash2 } from "lucide-react";
import { api, formatDateTime } from "./api";

interface Consent {
  kind: string;
  version: string;
  granted: boolean;
  recorded_at: string;
}

const KIND_LABEL: Record<string, string> = { terms: "Termini del servizio", privacy: "Informativa privacy", "health-data": "Trattamento dei dati sanitari", "subject-declaration": "Dichiarazione: maggiorenne, referti propri", marketing: "Novità via email (facoltativo)" };

export function Settings({ email, isDemoAccount }: { email: string; isDemoAccount: boolean }) {
  const router = useRouter();
  const [consents, setConsents] = useState<Consent[] | null>(null);
  const [marketing, setMarketing] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState<"" | "delete" | "marketing" | "health">("");
  const [healthConfirm, setHealthConfirm] = useState(false);
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

  async function withdrawHealth() {
    setBusy("health");
    try {
      await api("/api/v1/area/consents", { method: "POST", body: { kind: "health-data", granted: false } });
      const r = await api<{ consents: Consent[] }>("/api/v1/area/consents");
      setConsents(r.consents);
      setHealthConfirm(false);
      setMsg("Consenso revocato: referti, report, dossier e richieste sono stati cancellati.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Errore");
    }
    setBusy("");
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
        <h1 className="area-title">Impostazioni</h1>
        <p className="area-lead">Account: <span className="font-semibold text-ink">{email}</span></p>
      </div>

      <section className="form-card" aria-labelledby="consensi-titolo">
        <h2 id="consensi-titolo" className="form-card-title">
          Consensi
        </h2>
        <p className="form-card-text">Le versioni indicate sono bozze in revisione legale. Termini e privacy si revocano eliminando l&apos;account; il consenso ai dati sanitari si può revocare qui sotto.</p>
        {!consents ? (
          <div className="mt-4 h-24 animate-pulse rounded-xl bg-mist" />
        ) : (
          <ul className="mt-4 divide-y divide-line">
            {["terms", "privacy", "health-data", "subject-declaration"].map((k) => {
              const c = latest.get(k);
              return (
                <li key={k} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3.5 text-[1.0625rem]">
                  <span className="font-semibold text-ink">{KIND_LABEL[k]}</span>
                  <span className="text-base text-muted">{!c ? "non registrato" : c.granted ? `accettato il ${formatDateTime(c.recorded_at)} · versione ${c.version}` : `revocato il ${formatDateTime(c.recorded_at)}`}</span>
                </li>
              );
            })}
            <li className="flex items-center justify-between gap-4 py-2 text-[1.0625rem]">
              <label htmlFor="marketing" className="flex min-h-11 flex-1 cursor-pointer items-center font-semibold text-ink">
                {KIND_LABEL.marketing}
              </label>
              <span className="flex items-center gap-2">
                {busy === "marketing" ? <Loader2 aria-hidden className="h-5 w-5 animate-spin text-muted" /> : null}
                <input id="marketing" type="checkbox" checked={marketing} disabled={busy === "marketing"} onChange={(e) => toggleMarketing(e.target.checked)} className="h-6 w-6 cursor-pointer accent-[var(--color-teal)]" />
              </span>
            </li>
          </ul>
        )}
      </section>

      {!isDemoAccount && latest.get("health-data")?.granted ? (
        <section className="form-card" aria-labelledby="revoca-titolo">
          <h2 id="revoca-titolo" className="form-card-title">
            Revoca il consenso ai dati sanitari
          </h2>
          <p className="form-card-text">Puoi ritirare il consenso in ogni momento. Referti, report, dossier e richieste di secondo parere vengono cancellati subito; l&apos;account resta e potrai dare un nuovo consenso in futuro.</p>
          {healthConfirm ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="btn border border-danger/40 text-danger hover:bg-danger/10" onClick={withdrawHealth} disabled={busy === "health"}>
                {busy === "health" ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <ShieldOff aria-hidden className="h-5 w-5" />} Confermo: revoca e cancella
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setHealthConfirm(false)}>
                Annulla
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-secondary mt-4" onClick={() => setHealthConfirm(true)}>
              <ShieldOff aria-hidden className="h-5 w-5" /> Revoca il consenso
            </button>
          )}
        </section>
      ) : null}

      <section className="form-card" aria-labelledby="export-titolo">
        <h2 id="export-titolo" className="form-card-title">
          I tuoi dati
        </h2>
        <p className="form-card-text">Scarica tutto quello che conserviamo su di te in un file JSON leggibile: account, consensi, referti, report, dossier, ordini, richieste e registro delle attività.</p>
        <a href="/api/v1/area/export" className="btn btn-secondary mt-5 max-sm:w-full" download>
          <Download aria-hidden className="h-5 w-5" /> Esporta i miei dati
        </a>
      </section>

      <section className="form-card border-danger/30" aria-labelledby="elimina-titolo">
        <h2 id="elimina-titolo" className="form-card-title text-danger">
          Elimina l&apos;account
        </h2>
        {isDemoAccount ? (
          <p className="form-card-text">L&apos;account demo è condiviso e non si può eliminare. Crea un account con la tua email per provare anche questa funzione.</p>
        ) : (
          <form onSubmit={deleteAccount}>
            <p className="form-card-text">Cancella referti, report, dossier, richieste, consensi e sessioni; l&apos;email viene anonimizzata. Restano solo gli ordini, senza contenuti, per gli obblighi contabili. L&apos;operazione non si può annullare. Scrivi ELIMINA per confermare.</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input aria-label="Conferma scrivendo ELIMINA" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="field-input mt-0 flex-1" placeholder="ELIMINA" />
              <button type="submit" className="btn border border-danger/40 text-danger hover:bg-danger/10" disabled={confirm !== "ELIMINA" || busy === "delete"}>
                {busy === "delete" ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <Trash2 aria-hidden className="h-5 w-5" />}
                Elimina definitivamente
              </button>
            </div>
          </form>
        )}
      </section>
      {msg ? (
        <p role="status" className="field-ok">
          {msg}
        </p>
      ) : null}
    </div>
  );
}

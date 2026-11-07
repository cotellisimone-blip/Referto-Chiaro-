"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/components/area/api";

type Me = { email: string; displayName: string | null; isDemo: boolean; role: "user" | "physician" | "admin"; mfaEnabled: boolean; mfaVerified: boolean };

const ROLE_LABEL = { physician: "medico", admin: "amministratore" } as const;

/**
 * Accesso ai portali riservati (medico, admin): sessione + ruolo + seconda verifica (TOTP).
 * Il controllo vero è nelle API (`requireRole`); qui si guida la persona nei passi giusti.
 */
export function RoleGate({ role, title, children }: { role: "physician" | "admin"; title: string; children: React.ReactNode }) {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const refresh = useCallback(() => {
    api<{ user: Me | null }>("/api/v1/auth/me").then((r) => setMe(r.user)).catch(() => setMe(null));
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (me === undefined) return <div className="container-rc py-10"><div className="h-48 animate-pulse rounded-2xl bg-mist" aria-busy="true" /></div>;
  if (!me) return <PortalLogin role={role} title={title} onDone={refresh} />;
  if (me.role !== role) {
    return (
      <div className="container-rc py-10">
        <div role="alert" className="card max-w-xl p-6">
          <h1 className="display text-2xl">Accesso non consentito</h1>
          <p className="mt-2 text-muted">L&apos;account {me.email} non ha il ruolo di {ROLE_LABEL[role]}.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/area" className="btn btn-secondary">Vai all&apos;area personale</Link>
            <LogoutButton onDone={refresh} />
          </div>
        </div>
      </div>
    );
  }
  if (!me.mfaVerified) return <MfaStep me={me} title={title} onDone={refresh} />;
  return (
    <div className="container-rc py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 text-sm text-muted">
        <span className="inline-flex items-center gap-2"><ShieldCheck aria-hidden className="h-4 w-4 text-sage-deep" /> Sessione verificata con 2FA · {me.displayName ?? me.email}{me.isDemo ? <span className="chip bg-cream text-ink">demo</span> : null}</span>
        <LogoutButton onDone={refresh} />
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function LogoutButton({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-semibold text-teal hover:bg-mist"
      onClick={async () => {
        await api("/api/v1/auth/logout", { method: "POST", body: {} });
        router.push("/");
        onDone();
      }}
    >
      <LogOut aria-hidden className="h-4 w-4" /> Esci
    </button>
  );
}

function PortalLogin({ role, title, onDone }: { role: "physician" | "admin"; title: string; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function demo() {
    setBusy(true);
    setError(null);
    try {
      await api("/api/v1/auth/demo-ruolo", { method: "POST", body: { role } });
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
      setBusy(false);
    }
  }
  return (
    <div className="container-rc py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="eyebrow">{title}</p>
        <h1 className="display mt-2 text-[2rem] sm:text-[2.5rem]">Accesso riservato.</h1>
        <p className="mt-3 text-muted">Serve un account con ruolo di {ROLE_LABEL[role]} e la seconda verifica con un&apos;app di autenticazione.</p>
        <div className="card mt-8 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink">Account dimostrativo</h2>
          <p className="mt-2 text-muted">
            {role === "physician"
              ? "Un «medico dimostrativo» che non è un medico reale: serve solo a mostrare come funziona il portale, su referti inventati."
              : "Un amministratore dimostrativo, per vedere il pannello con dati inventati."}
          </p>
          {error ? <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">{error}</p> : null}
          <button type="button" onClick={demo} disabled={busy} className="btn btn-primary mt-5">
            {busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <KeyRound aria-hidden className="h-4 w-4" />} Entra come {ROLE_LABEL[role]} dimostrativo
          </button>
          <p className="mt-4 text-sm text-muted">
            Hai un account vero? <Link href={`/accedi?next=${role === "physician" ? "/medico" : "/admin"}`} className="link">Accedi con il link via email</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function MfaStep({ me, title, onDone }: { me: Me; title: string; onDone: () => void }) {
  const [setup, setSetup] = useState<{ secret: string; uri: string; demoCode?: string } | null>(null);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const needsSetup = !me.mfaEnabled;

  useEffect(() => {
    if (needsSetup) api<{ secret: string; uri: string; demoCode?: string }>("/api/v1/auth/mfa/setup", { method: "POST", body: {} }).then(setSetup).catch((e) => setError(e instanceof Error ? e.message : "Errore"));
    else if (me.isDemo) api<{ demoCode: string }>("/api/v1/auth/mfa/verifica").then((r) => setDemoCode(r.demoCode)).catch(() => {});
  }, [needsSetup, me.isDemo]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api(needsSetup ? "/api/v1/auth/mfa/conferma" : "/api/v1/auth/mfa/verifica", { method: "POST", body: { code } });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
      setBusy(false);
    }
  }

  const shownCode = setup?.demoCode ?? demoCode;
  return (
    <div className="container-rc py-10 sm:py-14">
      <div className="max-w-xl">
        <p className="eyebrow">{title}</p>
        <h1 className="display mt-2 text-[2rem] sm:text-[2.5rem]">{needsSetup ? "Attiva la seconda verifica." : "Seconda verifica."}</h1>
        <p className="mt-3 text-muted">
          {needsSetup
            ? "Aggiungi questo account alla tua app di autenticazione (per esempio Aegis, FreeOTP, Google Authenticator) e inserisci il primo codice."
            : "Inserisci il codice a 6 cifre dell'app di autenticazione."}
        </p>
        {needsSetup && setup ? (
          <div className="card mt-6 p-5">
            <p className="text-sm font-semibold text-ink">Chiave da inserire nell&apos;app</p>
            <p className="tabular mt-1 break-all font-mono text-lg text-ink">{setup.secret}</p>
            <p className="mt-3 text-xs text-muted">Oppure apri il collegamento: <a className="link break-all" href={setup.uri}>{setup.uri}</a></p>
          </div>
        ) : null}
        {shownCode ? (
          <div className="mt-6 rounded-2xl border border-dashed border-warn/60 bg-cream p-5" role="note">
            <p className="text-sm font-semibold text-ink">Solo per l&apos;account dimostrativo</p>
            <p className="mt-1 text-sm text-ink-soft">Per provare senza un&apos;app, il codice valido adesso è <strong className="tabular font-mono text-lg">{shownCode}</strong> (cambia ogni 30 secondi).</p>
          </div>
        ) : null}
        <form onSubmit={submit} className="card mt-6 p-6">
          <label htmlFor="codice-2fa" className="text-sm font-semibold text-ink">Codice a 6 cifre</label>
          <input
            id="codice-2fa"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="tabular mt-2 min-h-12 w-full rounded-xl border border-line bg-paper px-4 font-mono text-xl tracking-[0.3em] text-ink focus:border-teal"
          />
          {error ? <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">{error}</p> : null}
          <button type="submit" disabled={busy || (needsSetup && !setup)} className="btn btn-primary mt-5 w-full sm:w-auto">
            {busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <ShieldCheck aria-hidden className="h-4 w-4" />} {needsSetup ? "Attiva e continua" : "Verifica"}
          </button>
        </form>
        <p className="mt-4 text-sm text-muted">Account: {me.email} · <LogoutButton onDone={onDone} /></p>
      </div>
    </div>
  );
}

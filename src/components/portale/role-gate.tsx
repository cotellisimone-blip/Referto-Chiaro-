"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FlaskConical, KeyRound, Loader2, Lock, LogOut, ShieldCheck } from "lucide-react";
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

  if (me === undefined) return <div className="container-rc py-10"><div className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-mist" aria-busy="true" /></div>;
  if (!me) return <PortalLogin role={role} title={title} onDone={refresh} />;
  if (me.role !== role) {
    return (
      <div className="container-rc py-10 sm:py-14">
        <div role="alert" className="form-card max-w-[40rem]">
          <div className="form-card-head">
            <span aria-hidden className="tile-ico tile-ico-sm">
              <Lock />
            </span>
            <h1 className="form-card-title">Accesso non consentito</h1>
          </div>
          <p className="form-card-body">
            L&apos;account {me.email} non ha il ruolo di {ROLE_LABEL[role]}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/area-personale" className="btn btn-secondary">
              Vai all&apos;area personale
            </Link>
            <LogoutButton onDone={refresh} />
          </div>
        </div>
      </div>
    );
  }
  if (!me.mfaVerified) return <MfaStep me={me} title={title} onDone={refresh} />;
  return (
    <div className="container-rc pb-20 pt-6 sm:pt-8">
      {/* Su telefono: stato della sessione e uscita in una riga, chi è entrato nella riga sotto. */}
      <div className="flex flex-wrap items-center gap-x-2.5 rounded-full border border-line bg-paper py-1 pl-5 pr-2 text-base text-ink-soft shadow-[var(--shadow-card)] max-sm:rounded-[1.25rem] max-sm:pb-2.5 max-sm:pl-4">
        <span className="inline-flex min-w-0 items-center gap-2 max-sm:flex-1">
          <ShieldCheck aria-hidden className="h-5 w-5 shrink-0 text-sage-deep" /> Sessione verificata con 2FA
        </span>
        <span className="inline-flex min-w-0 items-center gap-2 max-sm:order-3 max-sm:w-full sm:flex-1">
          <span aria-hidden className="max-sm:hidden">
            ·
          </span>
          <strong className="min-w-0 font-bold text-ink">{me.displayName ?? me.email}</strong>
          {me.isDemo ? <span className="chip shrink-0 bg-cream text-ink">demo</span> : null}
        </span>
        <LogoutButton onDone={refresh} />
      </div>
      <div className="mt-8 sm:mt-10">{children}</div>
    </div>
  );
}

function LogoutButton({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="action-link rounded-full px-3 hover:bg-mist hover:no-underline"
      onClick={async () => {
        await api("/api/v1/auth/logout", { method: "POST", body: {} });
        router.push("/");
        onDone();
      }}
    >
      <LogOut aria-hidden /> Esci
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
    <div className="container-rc py-10 sm:py-16">
      <div className="mx-auto max-w-[40rem]">
        <p className="eyebrow">{title}</p>
        <h1 className="area-title mt-3">Accesso riservato.</h1>
        <p className="area-lead">Serve un account con ruolo di {ROLE_LABEL[role]} e la seconda verifica con un&apos;app di autenticazione.</p>
        <div className="form-card form-card-accent mt-8">
          <div className="form-card-head">
            <span aria-hidden className="tile-ico tile-ico-sm">
              <KeyRound />
            </span>
            <h2 className="form-card-title">Account dimostrativo</h2>
          </div>
          <p className="form-card-body">
            {role === "physician"
              ? "Un «medico dimostrativo» che non è un medico reale: serve solo a mostrare come funziona il portale, su referti inventati."
              : "Un amministratore dimostrativo, per vedere il pannello con dati inventati."}
          </p>
          {error ? (
            <p role="alert" className="field-error mt-5">
              {error}
            </p>
          ) : null}
          <button type="button" onClick={demo} disabled={busy} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
            {busy ? <Loader2 aria-hidden className="h-5 w-5 shrink-0 animate-spin" /> : <KeyRound aria-hidden className="h-5 w-5 shrink-0" />} Entra come {ROLE_LABEL[role]} dimostrativo
          </button>
          <p className="mt-5 border-t border-line pt-4 text-base text-ink-soft">
            Hai un account vero?{" "}
            <Link href={`/accedi?next=${role === "physician" ? "/medico" : "/admin"}`} className="link font-bold">
              Accedi con il link via email
            </Link>
            .
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
    <div className="container-rc py-10 sm:py-16">
      <div className="mx-auto max-w-[36rem]">
        <p className="eyebrow">{title}</p>
        <h1 className="area-title mt-3">{needsSetup ? "Attiva la seconda verifica." : "Seconda verifica."}</h1>
        <p className="area-lead">
          {needsSetup
            ? "Aggiungi questo account alla tua app di autenticazione (per esempio Aegis, FreeOTP, Google Authenticator) e inserisci il primo codice."
            : "Inserisci il codice a 6 cifre dell'app di autenticazione."}
        </p>
        {needsSetup && setup ? (
          <div className="side-card mt-6">
            <p className="side-card-title">Chiave da inserire nell&apos;app</p>
            <p className="tabular mt-2 select-all break-all rounded-xl bg-canvas px-4 py-3 font-mono text-lg tracking-wide text-ink">{setup.secret}</p>
            <p className="mt-3 text-base text-ink-soft">
              Sei sul telefono dove hai l&apos;app?{" "}
              <a className="link font-bold" href={setup.uri}>
                Aprila con questa chiave
              </a>
              .
            </p>
          </div>
        ) : null}
        {shownCode ? (
          <div className="callout callout-warn mt-5" role="note">
            <span aria-hidden className="callout-ico">
              <FlaskConical />
            </span>
            <div>
              <p className="callout-title">Solo per l&apos;account dimostrativo</p>
              <p className="callout-text">
                Per provare senza un&apos;app, il codice valido adesso è <strong className="tabular whitespace-nowrap font-mono text-xl text-ink">{shownCode}</strong> (cambia ogni 30 secondi).
              </p>
            </div>
          </div>
        ) : null}
        <form onSubmit={submit} className="form-card mt-5">
          <label htmlFor="codice-2fa" className="field-label">
            Codice a 6 cifre
          </label>
          <input
            id="codice-2fa"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="field-input tabular font-mono text-2xl tracking-[0.3em]"
          />
          {error ? (
            <p role="alert" className="field-error mt-5">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={busy || (needsSetup && !setup)} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
            {busy ? <Loader2 aria-hidden className="h-5 w-5 shrink-0 animate-spin" /> : <ShieldCheck aria-hidden className="h-5 w-5 shrink-0" />} {needsSetup ? "Attiva e continua" : "Verifica"}
          </button>
        </form>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 text-base text-ink-soft">
          <p className="min-w-0 break-words">Account: {me.email}</p>
          <LogoutButton onDone={onDone} />
        </div>
      </div>
    </div>
  );
}

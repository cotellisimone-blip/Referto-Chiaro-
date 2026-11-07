"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FlaskConical, Loader2, MailCheck } from "lucide-react";
import { api } from "./api";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; link?: string; isNew: boolean } | { kind: "error"; message: string };

/**
 * Accesso con link sicuro. In demo non c'è un servizio email: il link viene mostrato qui,
 * e lo diciamo chiaramente. L'account demo permette di provare tutto senza registrarsi.
 */
export function LoginForm({ demoMode }: { demoMode: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next")?.startsWith("/area") ? params.get("next")! : "/area";
  const linkError = params.get("errore") === "link";
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [demoBusy, setDemoBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState({ kind: "sending" });
    try {
      const r = await api<{ ok: true; isNew: boolean; link?: string }>("/api/v1/auth/magic-link", {
        method: "POST",
        body: { email, consents: consent ? ["terms", "privacy", "health-data"] : [] },
      });
      setState({ kind: "sent", link: r.link, isNew: r.isNew });
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Errore imprevisto." });
    }
  }

  async function enterDemo() {
    setDemoBusy(true);
    try {
      await api("/api/v1/auth/demo", { method: "POST", body: {} });
      router.push(next);
      router.refresh();
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Errore imprevisto." });
      setDemoBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {demoMode ? (
        <section className="card order-first p-6 sm:p-8 lg:order-last" aria-labelledby="demo-titolo">
          <p className="eyebrow">Senza registrazione</p>
          <h2 id="demo-titolo" className="mt-2 font-serif text-2xl">
            Entra con l&apos;account demo
          </h2>
          <p className="mt-3 text-muted">Un account condiviso, con referti inventati già caricati, per provare l&apos;area personale dall&apos;inizio alla fine.</p>
          <button type="button" className="btn btn-primary mt-6 w-full" onClick={enterDemo} disabled={demoBusy}>
            {demoBusy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <FlaskConical aria-hidden className="h-4 w-4" />}
            Entra con l&apos;account demo
          </button>
          <p className="mt-3 text-center text-sm text-muted">Quello che carichi qui lo vedono anche le altre persone che provano la demo. Non inserire dati reali.</p>
        </section>
      ) : null}

      <section className="card p-6 sm:p-8" aria-labelledby="accesso-titolo">
        <p className="eyebrow">Con la tua email</p>
        <h2 id="accesso-titolo" className="mt-2 font-serif text-2xl">
          Ricevi un link di accesso
        </h2>
        <p className="mt-3 text-muted">Nessuna password da ricordare: ti inviamo un link valido 15 minuti. Se è la prima volta, creiamo l&apos;account.</p>

        {linkError && state.kind === "idle" ? (
          <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">
            Il link non è più valido: è scaduto o è già stato usato. Richiedine uno nuovo.
          </p>
        ) : null}

        {state.kind === "sent" ? (
          <div role="status" className="mt-6 rounded-2xl bg-mist p-5">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <MailCheck aria-hidden className="h-5 w-5 text-sage-deep" /> {state.isNew ? "Account creato." : "Link pronto."}
            </p>
            {state.link ? (
              <>
                <p className="mt-2 text-sm text-muted">In questa versione dimostrativa non inviamo email: ecco il tuo link, valido 15 minuti e utilizzabile una sola volta.</p>
                <Link href={state.link} className="btn btn-primary mt-4 w-full">
                  Apri il link di accesso <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">Controlla la posta: il link è valido 15 minuti.</p>
            )}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink">
                Indirizzo email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-ink placeholder:text-muted/70 focus:border-teal"
                placeholder="nome@esempio.it"
              />
            </div>
            <label className="flex items-start gap-3 text-sm text-ink">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[var(--color-teal)]" />
              <span>
                Se mi registro, accetto i{" "}
                <Link href="/termini" className="link">
                  termini
                </Link>
                , l&apos;
                <Link href="/privacy" className="link">
                  informativa privacy
                </Link>{" "}
                e il trattamento dei miei dati sanitari per il servizio (bozze in revisione).
              </span>
            </label>
            {state.kind === "error" ? (
              <p role="alert" className="rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">
                {state.message}
              </p>
            ) : null}
            <button type="submit" className="btn btn-secondary w-full" disabled={state.kind === "sending"}>
              {state.kind === "sending" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null}
              Inviami il link
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

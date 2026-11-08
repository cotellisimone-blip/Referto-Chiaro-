"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, FlaskConical, Loader2, MailCheck } from "lucide-react";
import { api } from "./api";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; link?: string; delivery: "on-screen" | "email" | "unavailable" | "email-failed" } | { kind: "error"; message: string };

const CONSENT_KINDS = ["terms", "privacy", "health-data", "subject-declaration"] as const;
type ConsentKind = (typeof CONSENT_KINDS)[number];

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
  const [consents, setConsents] = useState<Record<ConsentKind, boolean>>({ terms: false, privacy: false, "health-data": false, "subject-declaration": false });
  const toggle = (k: ConsentKind) => (e: React.ChangeEvent<HTMLInputElement>) => setConsents((c) => ({ ...c, [k]: e.target.checked }));
  const [state, setState] = useState<State>({ kind: "idle" });
  const [demoBusy, setDemoBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState({ kind: "sending" });
    try {
      const r = await api<{ ok: true; delivery: "on-screen" | "email" | "unavailable" | "email-failed"; link?: string }>("/api/v1/auth/magic-link", {
        method: "POST",
        body: { email, consents: CONSENT_KINDS.filter((k) => consents[k]) },
      });
      setState({ kind: "sent", link: r.link, delivery: r.delivery });
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
              <MailCheck aria-hidden className="h-5 w-5 text-sage-deep" /> {state.delivery === "unavailable" ? "Link non mostrabile." : state.delivery === "email-failed" ? "Email non inviata." : state.delivery === "email" ? "Controlla la posta." : "Link pronto."}
            </p>
            {state.delivery === "on-screen" && state.link ? (
              <>
                <p className="mt-2 text-sm text-muted">In questa versione dimostrativa non inviamo email: ecco il tuo link, valido 15 minuti e utilizzabile una sola volta.</p>
                <Link href={state.link} className="btn btn-primary mt-4 w-full">
                  Apri il link di accesso <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </>
            ) : state.delivery === "unavailable" ? (
              <p className="mt-2 text-sm text-muted">
                In demo il link si mostra a schermo solo per gli account appena creati o per indirizzi di prova (per esempio <span className="font-mono">nome@esempio.test</span>): così nessuno può entrare nell&apos;account di un&apos;altra persona. Usa un indirizzo di prova oppure l&apos;account demo.
              </p>
            ) : state.delivery === "email-failed" ? (
              <p className="mt-2 text-sm text-muted">Non siamo riusciti a inviare l&apos;email in questo momento. Riprova tra qualche minuto.</p>
            ) : (
              <p className="mt-2 text-sm text-muted">Se l&apos;indirizzo è registrato, riceverai il link per posta: è valido 15 minuti.</p>
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
            <fieldset className="space-y-3">
              <legend className="text-sm font-semibold text-ink">Se è la prima volta (bozze in revisione legale)</legend>
              <label className="flex items-start gap-3 text-sm text-ink">
                <input type="checkbox" checked={consents.terms} onChange={toggle("terms")} className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[var(--color-teal)]" />
                <span>
                  Accetto i{" "}
                  <Link href="/termini" className="link">
                    termini del servizio
                  </Link>
                  .
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-ink">
                <input type="checkbox" checked={consents.privacy} onChange={toggle("privacy")} className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[var(--color-teal)]" />
                <span>
                  Ho letto l&apos;
                  <Link href="/privacy" className="link">
                    informativa privacy
                  </Link>
                  .
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm text-ink">
                <input type="checkbox" checked={consents["health-data"]} onChange={toggle("health-data")} className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[var(--color-teal)]" />
                <span>Acconsento in modo esplicito al trattamento dei miei dati relativi alla salute, solo per spiegarmi i referti che caricherò. Posso revocarlo quando voglio dalle impostazioni.</span>
              </label>
              <label className="flex items-start gap-3 text-sm text-ink">
                <input type="checkbox" checked={consents["subject-declaration"]} onChange={toggle("subject-declaration")} className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[var(--color-teal)]" />
                <span>Dichiaro di essere maggiorenne e di caricare solo referti che riguardano me.</span>
              </label>
            </fieldset>
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

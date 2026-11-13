"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { safeAreaNext } from "@/lib/auth/next-path";
import { ArrowRight, FlaskConical, Info, Loader2, MailCheck } from "lucide-react";
import { api } from "./api";
import { WaitlistForm } from "@/components/site/waitlist-form";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; link?: string; delivery: "on-screen" | "email" | "unavailable" | "email-failed" } | { kind: "error"; message: string };

const CONSENT_KINDS = ["terms", "privacy", "health-data", "subject-declaration"] as const;
type ConsentKind = (typeof CONSENT_KINDS)[number];

/**
 * Accesso con link sicuro. In demo non c'è un servizio email: il link viene mostrato qui,
 * e lo diciamo chiaramente. L'account demo permette di provare tutto senza registrarsi.
 */
export function LoginForm({ demoMode, vetrina = false }: { demoMode: boolean; vetrina?: boolean }) {
  const params = useSearchParams();
  const next = safeAreaNext(params.get("next"));
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
        body: { email, consents: CONSENT_KINDS.filter((k) => consents[k]), ...(next !== "/area-personale" ? { next } : {}) },
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
      // Navigazione completa: la cache del router potrebbe ricordare il rinvio all'accesso di prima del login
      // e riportare qui invece che alla pagina richiesta (ciclo 3, fase 2).
      window.location.assign(next);
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Errore imprevisto." });
      setDemoBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2 lg:items-start lg:gap-6">
      {demoMode ? (
        <section className="form-card form-card-accent order-first lg:order-last" aria-labelledby="demo-titolo">
          <p className="eyebrow">Senza registrazione</p>
          <h2 id="demo-titolo" className="form-card-title mt-3">
            Entra con l&apos;account demo
          </h2>
          <p className="form-card-text">Un account condiviso, con un referto inventato già caricato: provi l&apos;area personale dall&apos;inizio alla fine.</p>
          <button type="button" className="btn btn-primary btn-lg mt-6 w-full max-sm:px-4" onClick={enterDemo} disabled={demoBusy}>
            {demoBusy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <FlaskConical aria-hidden className="h-5 w-5" />}
            Entra con l&apos;account demo
          </button>
          <p className="mt-4 flex gap-2.5 text-base text-muted">
            <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0" />
            Quello che carichi qui lo vedono anche le altre persone che provano la demo. Non inserire dati reali.
          </p>
        </section>
      ) : null}

      {vetrina ? (
        // Ciclo 2, fase 1: in vetrina nessun account personale. Al posto del modulo email, la lista d'attesa.
        <section className="form-card" aria-labelledby="accesso-titolo" data-testid="vetrina-accesso">
          <p className="eyebrow">Con la tua email</p>
          <h2 id="accesso-titolo" className="form-card-title mt-3">
            Gli account personali non sono ancora aperti
          </h2>
          <p className="form-card-text">Oggi puoi provare tutto con l&apos;account demo. Se vuoi, lasciaci la tua email e ti avvisiamo quando il servizio parte.</p>
          <div className="mt-6">
            <WaitlistForm interest="completo" />
          </div>
        </section>
      ) : (
      <section className="form-card" aria-labelledby="accesso-titolo">
        <p className="eyebrow">Con la tua email</p>
        <h2 id="accesso-titolo" className="form-card-title mt-3">
          Ricevi un link di accesso
        </h2>
        <p className="form-card-text">Nessuna password da ricordare: ti inviamo un link valido 15 minuti. Se è la prima volta, creiamo l&apos;account.</p>

        {linkError && state.kind === "idle" ? (
          <p role="alert" className="field-error mt-5">
            Il link non è più valido: è scaduto o è già stato usato. Richiedine uno nuovo.
          </p>
        ) : null}

        {state.kind === "sent" ? (
          <div role="status" className="field-ok mt-6">
            <p className="field-ok-title">
              <MailCheck aria-hidden className="h-5 w-5 shrink-0 text-sage-deep" /> {state.delivery === "unavailable" ? "Link non mostrabile." : state.delivery === "email-failed" ? "Email non inviata." : state.delivery === "email" ? "Controlla la posta." : "Link pronto."}
            </p>
            {state.delivery === "on-screen" && state.link ? (
              <>
                <p className="mt-2">In questa versione dimostrativa non inviamo email: ecco il tuo link, valido 15 minuti e utilizzabile una sola volta.</p>
                <Link href={state.link} className="btn btn-primary btn-lg mt-4 w-full">
                  Apri il link di accesso <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </Link>
              </>
            ) : state.delivery === "unavailable" ? (
              <p className="mt-2">
                In demo il link si mostra a schermo solo per gli account appena creati o per indirizzi di prova (per esempio <span className="font-mono">nome@esempio.test</span>): così nessuno può entrare nell&apos;account di un&apos;altra persona. Usa un indirizzo di prova oppure l&apos;account demo.
              </p>
            ) : state.delivery === "email-failed" ? (
              <p className="mt-2">Non siamo riusciti a inviare l&apos;email in questo momento. Riprova tra qualche minuto.</p>
            ) : (
              <p className="mt-2">Se l&apos;indirizzo è registrato, riceverai il link per posta: è valido 15 minuti.</p>
            )}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="field-label">
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
                className="field-input"
                placeholder="nome@esempio.it"
              />
            </div>
            <fieldset className="space-y-2">
              <legend className="field-label mb-2">Se è la prima volta (bozze in revisione legale)</legend>
              <label className="field-check">
                <input type="checkbox" checked={consents.terms} onChange={toggle("terms")} />
                <span>
                  Accetto i{" "}
                  <Link href="/termini" className="link">
                    termini del servizio
                  </Link>
                  .
                </span>
              </label>
              <label className="field-check">
                <input type="checkbox" checked={consents.privacy} onChange={toggle("privacy")} />
                <span>
                  Ho letto l&apos;
                  <Link href="/privacy-policy" className="link">
                    informativa privacy
                  </Link>
                  .
                </span>
              </label>
              <label className="field-check">
                <input type="checkbox" checked={consents["health-data"]} onChange={toggle("health-data")} />
                <span>Acconsento in modo esplicito al trattamento dei miei dati relativi alla salute, solo per spiegarmi i referti che caricherò. Posso revocarlo quando voglio dalle impostazioni.</span>
              </label>
              <label className="field-check">
                <input type="checkbox" checked={consents["subject-declaration"]} onChange={toggle("subject-declaration")} />
                <span>Dichiaro di essere maggiorenne e di caricare solo referti che riguardano me.</span>
              </label>
            </fieldset>
            {state.kind === "error" ? (
              <p role="alert" className="field-error">
                {state.message}
              </p>
            ) : null}
            <button type="submit" className="btn btn-secondary btn-lg w-full" disabled={state.kind === "sending"}>
              {state.kind === "sending" ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null}
              Inviami il link
            </button>
          </form>
        )}
      </section>
      )}
    </div>
  );
}

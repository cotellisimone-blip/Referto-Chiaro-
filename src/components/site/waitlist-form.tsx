"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { CircleCheck, Loader2 } from "lucide-react";
import { api } from "@/components/area/api";
import { currentSource, track } from "@/components/site/track";

type Interest = "completo" | "secondo-parere" | "strutture" | "archivio" | "visite" | "prevenzione";
type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; already: boolean } | { kind: "error"; message: string };

const AVVISAMI_EVENT: Partial<Record<Interest, string>> = { completo: "avvisami-capisci", visite: "avvisami-medico", "secondo-parere": "avvisami-parere" };

const INPUT = "mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-ink placeholder:text-muted/70 focus:border-teal";

/**
 * Lista d'attesa. In questa versione dimostrativa non viene inviata alcuna email:
 * lo diciamo prima e dopo l'invio. L'iscrizione è un interesse non vincolante.
 */
export function WaitlistForm({ interest, afterTrial = false, compact = false }: { interest: Interest; afterTrial?: boolean; compact?: boolean }) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setState({ kind: "error", message: "Per iscriverti devi accettare l'informativa privacy (bozza)." });
      return;
    }
    setState({ kind: "sending" });
    try {
      const r = await api<{ ok: true; already?: boolean }>("/api/v1/waitlist", {
        method: "POST",
        body: {
          email,
          interest,
          ...(interest === "strutture" && organization.trim() ? { organization: organization.trim() } : {}),
          ...(note.trim() ? { note: note.trim() } : {}),
          consent: true,
          source: currentSource(),
        },
      });
      // Ciclo 2: conteggio anonimo dell'iscrizione per servizio (solo il nome dell'evento e la sorgente).
      const ev = AVVISAMI_EVENT[interest];
      if (ev && !r.already) track(ev);
      // Ciclo 3, fase 1: iscrizione arrivata subito dopo una prova (esempio o account demo).
      if (afterTrial && !r.already) track("avvisami-da-prova");
      setState({ kind: "done", already: Boolean(r.already) });
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "Errore imprevisto." });
    }
  }

  if (state.kind === "done") {
    return (
      <div role="status" className={compact ? "" : "card p-6 sm:p-8"}>
        <p className="flex items-center gap-2 font-semibold text-ink">
          <CircleCheck aria-hidden className="h-5 w-5 text-sage-deep" /> {state.already ? "Eri già in lista." : "Interesse registrato."}
        </p>
        <p className="mt-3 text-muted">
          In questa versione dimostrativa non inviamo alcuna email: la tua iscrizione è solo un&apos;espressione di interesse non vincolante. Non ti scriveremo finché il servizio non sarà attivo e non ci sarà alcun obbligo per te.
        </p>
        {AVVISAMI_EVENT[interest] ? (
          <div className="mt-5 border-t border-line pt-5" data-testid="waitlist-next">
            <p className="text-sm font-semibold text-ink">Intanto, gratis e senza registrarti:</p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/punto-di-partenza" className="link inline-flex min-h-11 items-center">
                  Crea il tuo Punto di Partenza
                </Link>
              </li>
              <li>
                <Link href="/strumenti/preparati-alla-visita" className="link inline-flex min-h-11 items-center">
                  Preparati alla prossima visita
                </Link>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={compact ? "space-y-4" : "card space-y-4 p-6 sm:p-8"} aria-label="Lista d'attesa">
      <p className="text-muted">
        {compact
          ? "Solo la tua email: nessuna email in questa versione dimostrativa, nessun impegno. Non inserire dati sanitari."
          : "Lascia la tua email per manifestare interesse. In questa versione dimostrativa non inviamo email e l'iscrizione non è vincolante. Non inserire dati sanitari."}
      </p>
      <div>
        <label htmlFor={`${uid}-email`} className="block text-sm font-semibold text-ink">
          Indirizzo email
        </label>
        <input id={`${uid}-email`} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} placeholder="nome@esempio.it" maxLength={254} />
      </div>
      {interest === "strutture" ? (
        <div>
          <label htmlFor={`${uid}-org`} className="block text-sm font-semibold text-ink">
            Nome della struttura (facoltativo)
          </label>
          <input id={`${uid}-org`} type="text" autoComplete="organization" value={organization} onChange={(e) => setOrganization(e.target.value)} className={INPUT} maxLength={120} />
        </div>
      ) : null}
      {/* La nota libera c'è solo per le strutture: per i servizi sanitari un campo aperto inviterebbe a scrivere dati di salute. */}
      {interest === "strutture" ? (
        <div>
          <label htmlFor={`${uid}-note`} className="block text-sm font-semibold text-ink">
            Nota (facoltativa)
          </label>
          <textarea id={`${uid}-note`} rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={`${INPUT} min-h-24 py-3`} maxLength={500} />
        </div>
      ) : null}
      <label className="flex min-h-11 items-start gap-3 text-sm text-ink">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[var(--color-teal)]" />
        <span>
          Ho letto l&apos;
          <Link href="/privacy-policy" className="link">
            informativa privacy
          </Link>{" "}
          (bozza in revisione) e acconsento al trattamento della mia email per la lista d&apos;attesa.
        </span>
      </label>
      {state.kind === "error" ? (
        <p role="alert" className="rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary min-h-11" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null}
        Iscrivimi alla lista d&apos;attesa
      </button>
    </form>
  );
}

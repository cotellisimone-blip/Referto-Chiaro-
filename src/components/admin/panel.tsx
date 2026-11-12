"use client";

import { FUNNEL_LABELS, SOURCE_LABELS, toSource } from "@/domain/metrics/funnel";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Download } from "lucide-react";
import { api, formatDateTime, ORDER_STATUS_LABEL } from "@/components/area/api";
import { CaseChip } from "@/components/area/cases";

const NAV = [
  ["/admin", "Panoramica"],
  ["/admin/lista-attesa", "Lista d'attesa"],
  ["/admin/medici", "Medici"],
  ["/admin/casi", "Casi"],
  ["/admin/ordini", "Ordini"],
  ["/admin/registro", "Registro"],
  ["/admin/configurazione", "Configurazione"],
] as const;

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Amministrazione" className="mb-8">
      <ul className="flex flex-wrap gap-1">
        {NAV.map(([href, label]) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined} className={clsx("inline-flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] font-medium", active ? "bg-mist text-ink" : "text-ink-soft hover:bg-mist/70 hover:text-ink")}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function useLoad<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reload = useCallback(() => api<T>(path).then(setData).catch((e) => setError(e.message)), [path]);
  useEffect(() => {
    reload();
  }, [reload]);
  return { data, error, reload };
}

function Frame({ title, lead, error, children }: { title: string; lead?: string; error: string | null; children: React.ReactNode }) {
  return (
    <div>
      <AdminNav />
      <h1 className="display text-[2rem] sm:text-[2.5rem]">{title}</h1>
      {lead ? <p className="mt-2 text-muted">{lead}</p> : null}
      {error ? <p role="alert" className="mt-4 text-danger">{error}</p> : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Table({ head, rows, label }: { head: string[]; rows: React.ReactNode[][]; label: string }) {
  if (rows.length === 0) return <p className="text-muted">Nessun elemento.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-line" tabIndex={0} role="region" aria-label={label}>
      <table className="w-full min-w-[640px] text-sm">
        <caption className="sr-only">{label}</caption>
        <thead className="bg-mist/60 text-left text-muted">
          <tr>{head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line">{r.map((c, j) => <td key={j} className="px-4 py-3 align-top text-ink">{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const euro = (c: number) => (c / 100).toLocaleString("it-IT", { style: "currency", currency: "EUR" });

type VetrinaRow = { visits: number; ctas: number; examples: number; signups: number };
type VetrinaData = {
  days: number;
  weeks: (VetrinaRow & { week: string })[];
  bySource: (VetrinaRow & { source: string })[];
  byService: { service: string; visits: number; ctas: number; signups: number }[];
  afterTrial?: { examples: number; usefulYes: number; usefulNo: number; signupsAfterTrial: number };
};

const SERVICE_NAMES: Record<string, string> = { capisci: "Capisci il tuo referto", "parla-con-un-medico": "Parla con un medico", "secondo-parere": "Secondo parere" };

/** Percentuale leggibile: «—» quando il denominatore è zero, mai una divisione per zero. */
function pct(n: number, d: number): string {
  if (!d) return "—";
  return `${((n / d) * 100).toLocaleString("it-IT", { maximumFractionDigits: 1 })}%`;
}

const weekLabel = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `dal ${d}/${m}/${y}`;
};

/** Ciclo 2, fase 2: la vetrina in tre tabelle. Le soglie di decisione sono ipotesi scritte in PRODUCT_ROADMAP.md. */
function VetrinaSection({ v }: { v: VetrinaData }) {
  return (
    <section aria-labelledby="vetrina-titolo" className="mt-10" data-testid="admin-vetrina">
      <h2 id="vetrina-titolo" className="font-serif text-2xl text-ink">Vetrina: chi arriva e chi chiede di essere avvisato</h2>
      <p className="mt-1 text-sm text-muted">
        Contatori anonimi (nessun cookie, nessun IP) e iscrizioni alla lista d&apos;attesa dei tre servizi. «Iscrizioni su visite» è il numero da guardare ogni settimana; le soglie
        per decidere sono in PRODUCT_ROADMAP.md. Dal 12/11/2026 una visita conta una volta per scheda: ricariche, robot, anteprime dei link e browser
        automatici sono esclusi.
      </p>
      <h3 className="mt-6 text-lg font-semibold text-ink">Per settimana</h3>
      <Table
        label="Vetrina per settimana"
        head={["Settimana", "Visite", "Clic sui servizi", "Esempio completato", "Iscrizioni", "Iscrizioni su visite"]}
        rows={v.weeks.map((w) => [weekLabel(w.week), String(w.visits), String(w.ctas), String(w.examples), String(w.signups), pct(w.signups, w.visits)])}
      />
      <h3 className="mt-6 text-lg font-semibold text-ink">Per sorgente, ultimi {v.days} giorni</h3>
      <Table
        label="Vetrina per sorgente"
        head={["Da dove arrivano", "Visite", "Clic sui servizi", "Esempio completato", "Iscrizioni", "Iscrizioni su visite"]}
        rows={v.bySource.map((r) => [SOURCE_LABELS[toSource(r.source)], String(r.visits), String(r.ctas), String(r.examples), String(r.signups), pct(r.signups, r.visits)])}
      />
      <h3 className="mt-6 text-lg font-semibold text-ink">Per servizio, ultimi {v.days} giorni</h3>
      <Table
        label="Vetrina per servizio"
        head={["Servizio", "Visite alla pagina", "Clic sull'azione", "Iscrizioni", "Iscrizioni su visite"]}
        rows={v.byService.map((r) => [SERVICE_NAMES[r.service] ?? r.service, String(r.visits), String(r.ctas), String(r.signups), pct(r.signups, r.visits)])}
      />
      {v.afterTrial ? (
        <>
          <h3 className="mt-6 text-lg font-semibold text-ink">Dopo la prova, ultimi {v.days} giorni</h3>
          <Table
            label="Vetrina dopo la prova"
            head={["Esempio completato", "«Utile»: sì", "«Utile»: non molto", "Iscrizioni subito dopo una prova", "Iscrizioni su esempi completati"]}
            rows={[[String(v.afterTrial.examples), String(v.afterTrial.usefulYes), String(v.afterTrial.usefulNo), String(v.afterTrial.signupsAfterTrial), pct(v.afterTrial.signupsAfterTrial, v.afterTrial.examples)]]}
          />
        </>
      ) : null}
    </section>
  );
}

export function AdminOverview() {
  const { data, error } = useLoad<{ overview: Record<string, number>; funnel?: { days: number; steps: Record<string, number> }; vetrina?: VetrinaData; aiCosts?: { days: number; runs: number; documents: number; inputTokens: number; outputTokens: number; usd: number; usdPerDocument: number } }>("/api/v1/admin/panoramica");
  const o = data?.overview;
  const items: [string, string][] = o
    ? [
        ["Utenti", `${o.users} (${o.demoUsers} demo)`],
        ["Documenti", String(o.documents)],
        ["Report pronti", String(o.reportsReady)],
        ["Dossier", String(o.dossiers)],
        ["Ordini pagati", `${o.ordersPaid} · ${euro(o.revenueCents)}`],
        ["Ordini in attesa", String(o.ordersPending)],
        ["Lista d'attesa", String(o.waitlist)],
        ["Casi aperti", String(o.casesOpen)],
        ["Medici verificati", String(o.physiciansVerified)],
        ["Job falliti", String(o.jobsFailed)],
      ]
    : [];
  return (
    <Frame title="Panoramica" lead="Numeri dell'istanza. In demo sono dati inventati e account dimostrativi." error={error}>
      <p className="mb-6 rounded-xl bg-mist px-4 py-3 text-ink">
        Apertura dei servizi, candidature dei medici, fasce e assegnazioni di domicilio, videoconsulto e secondo parere:{" "}
        <Link href="/prova/amministrazione" className="link font-semibold">prestazioni con un medico (prova)</Link>.
      </p>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([k, v]) => (
          <div key={k} className="card p-5">
            <dt className="text-sm text-muted">{k}</dt>
            <dd className="tabular mt-1 text-2xl font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      {data?.funnel ? (
        <section aria-labelledby="funnel-titolo" className="mt-10">
          <h2 id="funnel-titolo" className="font-serif text-2xl text-ink">Funnel, ultimi {data.funnel.days} giorni</h2>
          <p className="mt-1 text-sm text-muted">Visite e clic sono contatori anonimi per giorno; gli altri passi vengono dai dati del sito. Account demo esclusi.</p>
          <Table label="Funnel" head={["Passo", "Numero"]} rows={Object.entries(data.funnel.steps).map(([k, v]) => [FUNNEL_LABELS[k] ?? k, String(v)])} />
        </section>
      ) : null}
      {data?.vetrina ? <VetrinaSection v={data.vetrina} /> : null}
      {data?.aiCosts ? (
        <section aria-labelledby="costi-ai-titolo" className="mt-10" data-testid="admin-costi-ai">
          <h2 id="costi-ai-titolo" className="font-serif text-2xl text-ink">Costo AI, ultimi {data.aiCosts.days} giorni</h2>
          <p className="mt-1 text-sm text-muted">Calcolato dai token registrati per ogni passo e dalle tariffe pubblicate. Account demo esclusi.</p>
          <Table
            label="Costo AI"
            head={["Voce", "Valore"]}
            rows={[
              ["Documenti elaborati", String(data.aiCosts.documents)],
              ["Chiamate al modello", String(data.aiCosts.runs)],
              ["Token in ingresso / in uscita", `${data.aiCosts.inputTokens} / ${data.aiCosts.outputTokens}`],
              ["Costo totale", `$${data.aiCosts.usd.toFixed(2)}`],
              ["Costo medio per documento", `$${data.aiCosts.usdPerDocument.toFixed(3)}`],
            ]}
          />
        </section>
      ) : null}
    </Frame>
  );
}

export function AdminWaitlist() {
  const { data, error } = useLoad<{ waitlist: { id: string; email: string; interest: string; organization: string | null; note: string | null; created_at: string }[] }>("/api/v1/admin/lista-attesa");
  return (
    <Frame title="Lista d'attesa" lead="Manifestazioni di interesse non vincolanti. Nessuna email viene inviata automaticamente." error={error}>
      <a href="/api/v1/admin/lista-attesa?formato=csv" className="btn btn-secondary mb-4 min-h-11 text-sm"><Download aria-hidden className="h-4 w-4" /> Scarica CSV</a>
      <Table label="Lista d'attesa" head={["Email", "Interesse", "Organizzazione", "Nota", "Data"]} rows={(data?.waitlist ?? []).map((w) => [w.email, w.interest, w.organization ?? "—", w.note ?? "—", formatDateTime(w.created_at)])} />
    </Frame>
  );
}

export function AdminPhysicians() {
  const { data, error, reload } = useLoad<{ physicians: { id: string; fullName: string; specialty: string; email: string; registrationRef: string | null; status: string; openCases: number }[] }>("/api/v1/admin/medici");
  const set = async (id: string, status: string) => {
    await api(`/api/v1/admin/medici/${id}`, { method: "POST", body: { status } });
    reload();
  };
  const STATUS: Record<string, string> = { pending: "Da verificare", verified: "Verificato", suspended: "Sospeso" };
  return (
    <Frame title="Medici" lead="La verifica dell'abilitazione è un atto manuale dell'amministrazione, registrato nel registro." error={error}>
      <Table
        label="Medici"
        head={["Nome", "Specialità", "Email", "Iscrizione", "Stato", "Casi aperti", "Azioni"]}
        rows={(data?.physicians ?? []).map((p) => [
          p.fullName,
          p.specialty,
          p.email,
          p.registrationRef ?? "—",
          STATUS[p.status] ?? p.status,
          String(p.openCases),
          <span key="a" className="flex flex-wrap gap-2">
            {p.status !== "verified" ? <button type="button" className="btn btn-secondary min-h-9 px-3 text-xs" onClick={() => set(p.id, "verified")}>Verifica</button> : null}
            {p.status !== "suspended" ? <button type="button" className="btn btn-secondary min-h-9 px-3 text-xs" onClick={() => set(p.id, "suspended")}>Sospendi</button> : null}
          </span>,
        ])}
      />
    </Frame>
  );
}

export function AdminCases() {
  const { data, error, reload } = useLoad<{ cases: { id: string; specialty: string; status: string; patientEmail: string; physicianName: string | null; createdAt: string; isSimulated: boolean }[] }>("/api/v1/admin/casi");
  const phys = useLoad<{ physicians: { id: string; fullName: string; status: string }[] }>("/api/v1/admin/medici");
  const assign = async (caseId: string, physicianId: string) => {
    if (!physicianId) return;
    await api(`/api/v1/admin/casi/${caseId}`, { method: "POST", body: { physicianId } });
    reload();
  };
  const verified = (phys.data?.physicians ?? []).filter((p) => p.status === "verified");
  return (
    <Frame title="Casi di secondo parere" lead="Il contenuto della domanda e del parere non è mostrato qui: resta fra la persona e il medico." error={error}>
      <Table
        label="Casi"
        head={["Data", "Specialità", "Persona", "Medico", "Stato", "Assegna"]}
        rows={(data?.cases ?? []).map((c) => [
          formatDateTime(c.createdAt),
          `${c.specialty}${c.isSimulated ? " (simulazione)" : ""}`,
          c.patientEmail,
          c.physicianName ?? "—",
          <CaseChip key="s" status={c.status} />,
          c.status === "submitted" ? (
            <label key="a" className="block">
              <span className="sr-only">Assegna il caso a un medico</span>
              <select defaultValue="" onChange={(e) => assign(c.id, e.target.value)} className="min-h-9 rounded-lg border border-line bg-paper px-2 text-sm">
                <option value="">Scegli…</option>
                {verified.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
            </label>
          ) : "—",
        ])}
      />
    </Frame>
  );
}

export function AdminOrders() {
  const { data, error } = useLoad<{ orders: { id: string; service: string; amountCents: number; status: string; provider: string; email: string; createdAt: string }[] }>("/api/v1/admin/ordini");
  return (
    <Frame title="Ordini" lead="Pagamenti simulati o in modalità test: nessun importo reale." error={error}>
      <Table label="Ordini" head={["Data", "Servizio", "Importo", "Stato", "Canale", "Utente"]} rows={(data?.orders ?? []).map((o) => [formatDateTime(o.createdAt), o.service, euro(o.amountCents), ORDER_STATUS_LABEL[o.status]?.label ?? o.status, o.provider, o.email])} />
    </Frame>
  );
}

export function AdminAudit() {
  const { data, error } = useLoad<{ entries: { id: string; actor: string; action: string; target: string | null; userId: string | null; createdAt: string }[] }>("/api/v1/admin/registro");
  return (
    <Frame title="Registro" lead="Ultime 200 voci del registro append-only: azione, attore e riferimento. Mai dati sanitari." error={error}>
      <Table label="Registro" head={["Data", "Attore", "Azione", "Riferimento", "Utente"]} rows={(data?.entries ?? []).map((e) => [formatDateTime(e.createdAt), e.actor, e.action, e.target ? <span key="t" className="tabular font-mono text-xs">{e.target.slice(0, 8)}…</span> : "—", e.userId ? <span key="u" className="tabular font-mono text-xs">{e.userId.slice(0, 8)}…</span> : "—"])} />
    </Frame>
  );
}

export function AdminConfig() {
  const { data, error } = useLoad<{ flags: Record<string, boolean>; payments: string; database: string; public: { mode: string } }>("/api/v1/admin/configurazione");
  return (
    <Frame title="Configurazione" lead="Solo lettura: i gate si cambiano con le variabili d'ambiente, mai da qui." error={error}>
      {data ? (
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="card p-5"><dt className="text-sm text-muted">Modalità</dt><dd className="mt-1 font-semibold text-ink">{data.public.mode}</dd></div>
          <div className="card p-5"><dt className="text-sm text-muted">Pagamenti</dt><dd className="mt-1 font-semibold text-ink">{data.payments}</dd></div>
          <div className="card p-5"><dt className="text-sm text-muted">Database</dt><dd className="mt-1 font-semibold text-ink">{data.database}</dd></div>
          {Object.entries(data.flags).map(([k, v]) => (
            <div key={k} className="card p-5"><dt className="text-sm text-muted">{k}</dt><dd className={clsx("mt-1 font-semibold", v ? "text-sage-deep" : "text-ink")}>{v ? "attivo" : "spento"}</dd></div>
          ))}
        </dl>
      ) : null}
    </Frame>
  );
}

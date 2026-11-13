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
    <nav aria-label="Amministrazione" className="mb-8 sm:mb-10">
      <ul className="tab-pills">
        {NAV.map(([href, label]) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? "page" : undefined} className="tab-pill tab-pill-sm">
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
      <h1 className="area-title">{title}</h1>
      {lead ? <p className="area-lead">{lead}</p> : null}
      {error ? (
        <p role="alert" className="field-error mt-5">
          {error}
        </p>
      ) : null}
      <div className="mt-7">{children}</div>
    </div>
  );
}

/** Celle fatte solo di cifre (conteggi, percentuali, importi): cifre allineate in colonna. */
const NUMERIC = /^[\d.,\s/%€$]+$/;

function Table({ head, rows, label }: { head: string[]; rows: React.ReactNode[][]; label: string }) {
  if (rows.length === 0) return <p className="empty-note">Nessun elemento, per ora.</p>;
  return (
    <div className="data-table-wrap" tabIndex={0} role="region" aria-label={label}>
      <table className="data-table">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={typeof c === "string" && NUMERIC.test(c) ? "tabular" : undefined}>
                  {c}
                </td>
              ))}
            </tr>
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
  byCap?: { cap: string; signups: number; covered: boolean }[];
  afterTrial?: { examples: number; usefulYes: number; usefulNo: number; signupsAfterTrial: number };
};

const SERVICE_NAMES: Record<string, string> = { capisci: "Capisci il tuo referto", domicilio: "Visita a domicilio", "parla-con-un-medico": "Videoconsulto", "secondo-parere": "Secondo parere" };

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
    <section aria-labelledby="vetrina-titolo" className="mt-12" data-testid="admin-vetrina">
      <h2 id="vetrina-titolo" className="area-h2">Vetrina: chi arriva e chi chiede di essere avvisato</h2>
      <p className="meta mt-2 max-w-[60rem]">
        Contatori anonimi (nessun cookie, nessun IP) e iscrizioni alla lista d&apos;attesa dei servizi. «Iscrizioni su visite» è il numero da guardare ogni settimana; le soglie
        per decidere sono in PRODUCT_ROADMAP.md. Dal 12/11/2026 una visita conta una volta per scheda: ricariche, robot, anteprime dei link e browser
        automatici sono esclusi.
      </p>
      <h3 className="area-h3 mb-3 mt-8">Per settimana</h3>
      <Table
        label="Vetrina per settimana"
        head={["Settimana", "Visite", "Clic sui servizi", "Esempio completato", "Iscrizioni", "Iscrizioni su visite"]}
        rows={v.weeks.map((w) => [weekLabel(w.week), String(w.visits), String(w.ctas), String(w.examples), String(w.signups), pct(w.signups, w.visits)])}
      />
      <h3 className="area-h3 mb-3 mt-8">Per sorgente, ultimi {v.days} giorni</h3>
      <Table
        label="Vetrina per sorgente"
        head={["Da dove arrivano", "Visite", "Clic sui servizi", "Esempio completato", "Iscrizioni", "Iscrizioni su visite"]}
        rows={v.bySource.map((r) => [SOURCE_LABELS[toSource(r.source)], String(r.visits), String(r.ctas), String(r.examples), String(r.signups), pct(r.signups, r.visits)])}
      />
      <h3 className="area-h3 mb-3 mt-8">Per servizio, ultimi {v.days} giorni</h3>
      <Table
        label="Vetrina per servizio"
        head={["Servizio", "Visite alla pagina", "Clic sull'azione", "Iscrizioni", "Iscrizioni su visite"]}
        rows={v.byService.map((r) => [SERVICE_NAMES[r.service] ?? r.service, String(r.visits), String(r.ctas), String(r.signups), pct(r.signups, r.visits)])}
      />
      {v.byCap ? (
        <>
          <h3 className="area-h3 mb-3 mt-8">Visita a domicilio: richieste per CAP, ultimi {v.days} giorni</h3>
          {v.byCap.length ? (
            <Table label="Visita a domicilio per CAP" head={["CAP", "Iscrizioni", "Zona"]} rows={v.byCap.map((r) => [r.cap, String(r.signups), r.covered ? "già coperta (area pilota)" : "non coperta"])} />
          ) : (
            <p className="empty-note" data-testid="admin-cap-vuoto">
              Nessuna iscrizione con CAP per ora. Compaiono qui quando qualcuno chiede di essere avvisato per la sua zona.
            </p>
          )}
        </>
      ) : null}
      {v.afterTrial ? (
        <>
          <h3 className="area-h3 mb-3 mt-8">Dopo la prova, ultimi {v.days} giorni</h3>
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
      <dl className="stat-grid">
        {items.map(([k, v]) => (
          <div key={k} className="stat-card">
            <dt>{k}</dt>
            <dd className="tabular">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="empty-note mt-5">
        Apertura dei servizi, candidature dei medici, fasce e assegnazioni di domicilio, videoconsulto e secondo parere si gestiscono nelle{" "}
        <Link href="/prova/amministrazione" className="link font-bold">
          prestazioni con un medico (prova)
        </Link>
        .
      </p>
      {data?.funnel ? (
        <section aria-labelledby="funnel-titolo" className="mt-12">
          <h2 id="funnel-titolo" className="area-h2">Percorso delle persone, ultimi {data.funnel.days} giorni</h2>
          <p className="meta mb-4 mt-2 max-w-[60rem]">Visite e clic sono contatori anonimi per giorno; gli altri passi vengono dai dati del sito. Account demo esclusi.</p>
          <Table label="Funnel" head={["Passo", "Numero"]} rows={Object.entries(data.funnel.steps).map(([k, v]) => [FUNNEL_LABELS[k] ?? k, String(v)])} />
        </section>
      ) : null}
      {data?.vetrina ? <VetrinaSection v={data.vetrina} /> : null}
      {data?.aiCosts ? (
        <section aria-labelledby="costi-ai-titolo" className="mt-12" data-testid="admin-costi-ai">
          <h2 id="costi-ai-titolo" className="area-h2">Costo AI, ultimi {data.aiCosts.days} giorni</h2>
          <p className="meta mb-4 mt-2 max-w-[60rem]">Calcolato dai token registrati per ogni passo e dalle tariffe pubblicate. Account demo esclusi.</p>
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
      <a href="/api/v1/admin/lista-attesa?formato=csv" className="btn btn-secondary btn-sm mb-5">
        <Download aria-hidden className="h-4 w-4" /> Scarica l&apos;elenco (CSV)
      </a>
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
          <span key="s" className={clsx("chip", p.status === "verified" ? "bg-marker-soft text-teal-deep" : p.status === "suspended" ? "bg-mist text-muted" : "bg-cream text-warn")}>
            {STATUS[p.status] ?? p.status}
          </span>,
          String(p.openCases),
          <span key="a" className="flex flex-wrap gap-2">
            {p.status !== "verified" ? (
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => set(p.id, "verified")}>
                Verifica
              </button>
            ) : null}
            {p.status !== "suspended" ? (
              <button type="button" className="danger-link" onClick={() => set(p.id, "suspended")}>
                Sospendi
              </button>
            ) : null}
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
              <select defaultValue="" onChange={(e) => assign(c.id, e.target.value)} className="field-input mt-0 min-h-11 min-w-[11rem] text-base">
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
      <Table label="Registro" head={["Data", "Attore", "Azione", "Riferimento", "Utente"]} rows={(data?.entries ?? []).map((e) => [formatDateTime(e.createdAt), e.actor, e.action, e.target ? <span key="t" className="tabular font-mono text-[0.9375rem]">{e.target.slice(0, 8)}…</span> : "—", e.userId ? <span key="u" className="tabular font-mono text-[0.9375rem]">{e.userId.slice(0, 8)}…</span> : "—"])} />
    </Frame>
  );
}

export function AdminConfig() {
  const { data, error } = useLoad<{ flags: Record<string, boolean>; payments: string; database: string; public: { mode: string } }>("/api/v1/admin/configurazione");
  return (
    <Frame title="Configurazione" lead="Solo lettura: i gate si cambiano con le variabili d'ambiente, mai da qui." error={error}>
      {data ? (
        <>
          <dl className="stat-grid stat-grid-3">
            <div className="stat-card">
              <dt>Modalità</dt>
              <dd>{data.public.mode}</dd>
            </div>
            <div className="stat-card">
              <dt>Pagamenti</dt>
              <dd>{data.payments}</dd>
            </div>
            <div className="stat-card">
              <dt>Database</dt>
              <dd>{data.database}</dd>
            </div>
          </dl>
          <h2 className="area-h2 mt-10">Interruttori dei servizi</h2>
          <p className="meta mt-2">Lo stato di ogni interruttore, così come lo legge il sito in questo momento.</p>
          <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(data.flags).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3 rounded-[1.125rem] border border-line bg-paper px-4 py-3">
                <dt className="min-w-0 font-mono text-[0.9375rem] text-ink-soft [overflow-wrap:anywhere]">{k}</dt>
                <dd className={clsx("chip shrink-0", v ? "bg-marker-soft text-teal-deep" : "bg-mist text-muted")}>{v ? "attivo" : "spento"}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}
    </Frame>
  );
}

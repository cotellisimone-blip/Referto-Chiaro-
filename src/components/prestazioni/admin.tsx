"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { BadgeCheck, CircleSlash, ExternalLink, PauseCircle, PlayCircle, Zap } from "lucide-react";
import {
  adminView,
  assignRequest,
  availability,
  eligibleDoctors,
  expireProposals,
  getDoctor,
  occupyProposedSlot,
  presetSoloParere,
  presetTuttoAperto,
  setCoverageEnabled,
  setDoctorEnabled,
  setFailNextPayment,
  setServiceOpen,
  setSlotOpen,
  setSpecialtyOpen,
  specialtyName,
  suspendDoctor,
  sweepExpired,
  verifyDoctor,
  ACTIVE_STATUSES,
  type PrestazioniState,
} from "@/domain/prestazioni/engine";
import { PRESTAZIONI, PRESTAZIONI_ORDER } from "@/domain/prestazioni/listino";
import { act, resetDemo, update, usePrestazioni } from "./store";
import { ConfirmButton, DemoNotice, Loading, Price, StatusBadge, formatDay, formatSlot, formatTime } from "./ui";

const TABS = [
  { id: "servizi", label: "Servizi" },
  { id: "medici", label: "Medici" },
  { id: "richieste", label: "Richieste" },
  { id: "prove", label: "Strumenti di prova" },
] as const;

type Tab = (typeof TABS)[number]["id"];

const AV_LABEL = { aperto: "Aperta", sospeso: "Sospesa", esaurito: "Fasce esaurite", fuori_zona: "Fuori zona", nessun_medico: "Nessun medico abilitato" } as const;

export function AdminPrestazioni() {
  const s = usePrestazioni();
  const [tab, setTab] = useState<Tab>("servizi");
  if (!s) return <Loading />;
  const now = new Date();
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Amministrazione · prova</p>
        <h1 className="display mt-3 text-[2rem] sm:text-[2.5rem]">Prestazioni con un medico</h1>
        <p className="mt-2 text-[1.0625rem] text-ink-soft">Apertura dei servizi, candidature, disponibilità e assegnazioni. L&apos;amministrazione vede la logistica, non quesiti clinici, documenti o sintesi.</p>
      </div>
      <DemoNotice />
      <div role="tablist" aria-label="Sezioni" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.id} role="tab" type="button" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={clsx("btn btn-sm min-h-11 shrink-0", tab === t.id ? "btn-primary" : "btn-secondary")}>
            {t.label}
            {t.id === "medici" && s.doctors.some((d) => d.status === "candidato") ? <span className="chip ml-1 bg-cream text-warn">{s.doctors.filter((d) => d.status === "candidato").length}</span> : null}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={TABS.find((t) => t.id === tab)!.label}>
        {tab === "servizi" ? <Services s={s} now={now} /> : null}
        {tab === "medici" ? <Doctors s={s} now={now} /> : null}
        {tab === "richieste" ? <Requests s={s} now={now} /> : null}
        {tab === "prove" ? <Tools s={s} /> : null}
      </div>
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={clsx("btn btn-sm min-h-11 shrink-0", on ? "btn-primary" : "btn-secondary")}>
      {on ? <PlayCircle aria-hidden className="h-4 w-4" /> : <PauseCircle aria-hidden className="h-4 w-4" />} {on ? "Aperta" : "Sospesa"}
    </button>
  );
}

function Services({ s, now }: { s: PrestazioniState; now: Date }) {
  return (
    <div className="space-y-6">
      <ul className="grid gap-3">
        {PRESTAZIONI_ORDER.map((k) => {
          const av = availability(s, k, now);
          return (
            <li key={k} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between" data-servizio={k}>
              <div>
                <p className="text-lg font-bold text-ink">{PRESTAZIONI[k].title} · <Price kind={k} /></p>
                <p className="text-[0.9375rem] text-ink-soft">Stato per i pazienti: <strong>{AV_LABEL[av.state]}</strong>{av.next ? ` · prima fascia ${formatSlot(av.next, now)}` : ""}</p>
              </div>
              <Toggle on={s.services[k]} label={`Nuove richieste: ${PRESTAZIONI[k].short}`} onChange={(v) => update((st) => setServiceOpen(st, k, v))} />
            </li>
          );
        })}
      </ul>
      <section className="card p-5" aria-labelledby="spec-titolo">
        <h2 id="spec-titolo" className="text-lg font-bold text-ink">Specialità del secondo parere</h2>
        <ul className="mt-3 space-y-2">
          {s.specialties.map((x) => (
            <li key={x.id} className="flex items-center justify-between gap-3">
              <span className="text-[1.0625rem] text-ink">{x.name} · {eligibleDoctors(s, "parere", { specialtyId: x.id }).length} specialisti disponibili</span>
              <Toggle on={x.open} label={`Specialità ${x.name}`} onChange={(v) => update((st) => setSpecialtyOpen(st, x.id, v))} />
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-muted">Nella demo c&apos;è una sola specialità di esempio.</p>
      </section>
      <section className="card p-5" aria-labelledby="zona-titolo">
        <h2 id="zona-titolo" className="text-lg font-bold text-ink">Zona domiciliare</h2>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[1.0625rem] text-ink">{s.coverage.label} · CAP {s.coverage.caps[0]}–{s.coverage.caps[s.coverage.caps.length - 1]}</span>
          <Toggle on={s.coverage.enabled} label="Zona pilota" onChange={(v) => update((st) => setCoverageEnabled(st, v))} />
        </div>
      </section>
      <section className="card p-5" aria-labelledby="scenari-titolo">
        <h2 id="scenari-titolo" className="text-lg font-bold text-ink">Scenari di lancio</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <button type="button" className="btn btn-secondary h-auto whitespace-normal py-3" onClick={() => update((st) => presetSoloParere(st))}>Avvio con un solo servizio (secondo parere, una specialità)</button>
          <button type="button" className="btn btn-secondary" onClick={() => update((st) => presetTuttoAperto(st))}>Tutto aperto</button>
        </div>
        <p className="mt-2 text-sm text-muted">Sospendere un servizio blocca solo le nuove richieste: gli appuntamenti confermati restano visibili e gestibili.</p>
      </section>
    </div>
  );
}

function Doctors({ s, now }: { s: PrestazioniState; now: Date }) {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      {msg ? <p role="status" className="rounded-xl bg-mist px-4 py-3 text-ink">{msg}</p> : null}
      {s.doctors.map((d) => {
        const slots = s.slots.filter((x) => x.doctorId === d.id && new Date(x.start).getTime() > now.getTime());
        return (
          <article key={d.id} className="card p-5" data-medico={d.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-ink">{d.name}</p>
                <p className="text-[0.9375rem] text-ink-soft">{d.ordine} · {d.role === "specialista" ? specialtyName(s, d.specialtyId) : "Medicina generale"} · {d.email}</p>
                <p className="mt-1 text-[0.9375rem] text-ink-soft">Offre: {d.offered.map((k) => PRESTAZIONI[k].short.toLowerCase()).join(", ")}{d.zones.length ? ` · zona: ${s.coverage.label}` : ""}</p>
              </div>
              <span className={clsx("chip", d.status === "verificato" ? "bg-marker-soft text-teal-deep" : d.status === "candidato" ? "bg-cream text-warn" : "bg-mist text-muted")}>
                {d.status === "verificato" ? "Verificato" : d.status === "candidato" ? "Da verificare" : "Sospeso"}
              </span>
            </div>
            {d.status === "candidato" ? (
              <div className="mt-4 space-y-2">
                <p className="text-[0.9375rem] text-ink-soft">
                  Prima dell&apos;apertura reale: controllo nell&apos;
                  <a href="https://albounico.fnomceo.it/" target="_blank" rel="noopener noreferrer" className="link">Albo FNOMCeO <ExternalLink aria-hidden className="inline h-3.5 w-3.5" /></a>, specialità, identità, assicurazione. In questa prova la verifica è fittizia.
                </p>
                <button type="button" className="btn btn-primary" onClick={() => { update((st) => verifyDoctor(st, d.id)); setMsg(`${d.name}: verificato. Ora abilitalo alle prestazioni che offre.`); }}>
                  <BadgeCheck aria-hidden className="h-4 w-4" /> Segna come verificato (prova)
                </button>
              </div>
            ) : null}
            {d.status === "verificato" ? (
              <div className="mt-4">
                <p className="text-[0.9375rem] font-semibold text-ink">Abilitato a ricevere richieste per:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {d.offered.map((k) => {
                    const on = d.enabled.includes(k);
                    return (
                      <button key={k} type="button" role="switch" aria-checked={on} onClick={() => update((st) => setDoctorEnabled(st, d.id, k, !on).state)} className={clsx("btn btn-sm min-h-11", on ? "btn-primary" : "btn-secondary")}>
                        {PRESTAZIONI[k].short}: {on ? "sì" : "no"}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {d.status === "verificato" ? (
                <button type="button" className="btn btn-ghost btn-sm min-h-11" onClick={() => update((st) => suspendDoctor(st, d.id))}>
                  <CircleSlash aria-hidden className="h-4 w-4" /> Sospendi
                </button>
              ) : d.status === "sospeso" ? (
                <button type="button" className="btn btn-ghost btn-sm min-h-11" onClick={() => update((st) => verifyDoctor(st, d.id))}>Riattiva</button>
              ) : null}
            </div>
            <details className="mt-3">
              <summary className="min-h-11 cursor-pointer font-semibold text-ink">Fasce ({slots.filter((x) => x.open).length} aperte)</summary>
              <SlotGrid s={s} slots={slots} now={now} />
            </details>
          </article>
        );
      })}
    </div>
  );
}

function SlotGrid({ s, slots, now }: { s: PrestazioniState; slots: PrestazioniState["slots"]; now: Date }) {
  const days = new Map<string, typeof slots>();
  for (const x of slots) days.set(new Date(x.start).toDateString(), [...(days.get(new Date(x.start).toDateString()) ?? []), x]);
  void s;
  return (
    <div className="mt-2 space-y-3">
      {[...days.values()].map((list) => (
        <div key={list[0].id}>
          <p className="text-sm font-semibold text-ink-soft">{formatDay(list[0].start, now)}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {list.map((x) => (
              <button key={x.id} type="button" aria-pressed={x.open} onClick={() => update((st) => setSlotOpen(st, x.id, !x.open))} className={clsx("slot-pill", x.open ? "slot-pill-on" : "opacity-60 line-through")} title={x.kinds.map((k) => PRESTAZIONI[k].short).join(" e ")}>
                {formatTime(x.start)}
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="text-sm text-muted">Tocca un orario per chiuderlo o riaprirlo. Le fasce sono condivise tra domicilio e video: un domicilio occupa anche il tragitto.</p>
    </div>
  );
}

function Requests({ s, now }: { s: PrestazioniState; now: Date }) {
  const [msg, setMsg] = useState<string | null>(null);
  const rows = s.requests.map(adminView);
  if (!rows.length) return <p className="text-[1.0625rem] text-muted">Nessuna richiesta.</p>;
  return (
    <div className="space-y-3">
      {msg ? <p role="status" className="rounded-xl bg-mist px-4 py-3 text-ink">{msg}</p> : null}
      <ul className="grid gap-3 md:grid-cols-2">
        {rows.map((r) => {
          const doc = getDoctor(s, r.doctorId);
          const canAssign = ["ricevuta", "documenti_richiesti", "indisponibile"].includes(r.status);
          const full = s.requests.find((x) => x.id === r.id)!;
          const options = canAssign ? eligibleDoctors(s, r.kind, { cap: full.address?.cap, specialtyId: r.specialtyId }).filter((d) => d.id !== r.doctorId) : [];
          return (
            <li key={r.id} className="card p-5" data-richiesta={r.id}>
              <p className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-ink">{r.code} · {PRESTAZIONI[r.kind].short}{r.specialtyId ? ` · ${specialtyName(s, r.specialtyId)}` : ""}</span>
                <StatusBadge status={r.status} />
              </p>
              <dl className="mt-2 grid gap-1 text-[0.9375rem] text-ink-soft">
                {r.zone ? <div><dt className="inline">Zona: </dt><dd className="inline">{r.zone}</dd></div> : null}
                {r.start ? <div><dt className="inline">Orario: </dt><dd className="inline">{formatSlot(r.start, now)}</dd></div> : null}
                <div><dt className="inline">Medico: </dt><dd className="inline">{doc ? doc.name : "da assegnare"}</dd></div>
                <div><dt className="inline">Pagamento (simulato): </dt><dd className="inline">{r.payment}{r.priceCents != null ? ` · ` : ""}{r.priceCents != null ? <Price kind={r.kind} cents={r.priceCents} /> : null}</dd></div>
              </dl>
              {canAssign && options.length ? (
                <label className="mt-3 block text-[0.9375rem] font-semibold text-ink">
                  {r.doctorId ? "Riassegna a" : "Assegna a"}
                  <select
                    className="mt-1 min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-ink"
                    value=""
                    onChange={(e) => {
                      const res = act((st, n) => assignRequest(st, r.id, e.target.value, n));
                      setMsg(res.ok ? `${r.code}: assegnata.` : res.error === "fascia-occupata" ? `${r.code}: quel medico non ha la fascia libera.` : `${r.code}: assegnazione non possibile.`);
                    }}
                  >
                    <option value="" disabled>Scegli un medico idoneo…</option>
                    {options.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </label>
              ) : null}
              {r.status === "proposta" ? (
                <button type="button" className="btn btn-ghost btn-sm mt-3 min-h-11" onClick={() => { update((st) => occupyProposedSlot(st, r.id)); setMsg(`${r.code}: la fascia proposta ora è occupata da un'altra prenotazione simulata. Prova a confermare come paziente.`); }}>
                  <Zap aria-hidden className="h-4 w-4" /> Simula: fascia occupata nel frattempo
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-muted">Attive: {s.requests.filter((r) => ACTIVE_STATUSES.includes(r.status)).length}. Quesiti, documenti, indirizzi e telefoni non compaiono qui.</p>
    </div>
  );
}

function Tools({ s }: { s: PrestazioniState }) {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      {msg ? <p role="status" className="rounded-xl bg-mist px-4 py-3 text-ink">{msg}</p> : null}
      <label className="check-row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink">
        <input type="checkbox" checked={s.demo.failNextPayment} onChange={(e) => update((st) => setFailNextPayment(st, e.target.checked))} className="h-5 w-5" />
        Fai fallire il prossimo pagamento simulato
      </label>
      <button type="button" className="btn btn-secondary" onClick={() => { update((st, n) => sweepExpired(expireProposals(st, n), n)); setMsg("Le proposte aperte sono scadute: i pazienti vedono le alternative."); }}>
        Fai scadere le proposte aperte
      </button>
      <p className="text-[0.9375rem] text-muted">«Fascia occupata nel frattempo» si prova dalla scheda di una richiesta in stato «Proposta da confermare», nella sezione Richieste.</p>
      <ConfirmButton className="btn btn-ghost" question="Tutto torna allo stato iniziale." yes="Sì, ripristina" onConfirm={() => { resetDemo(); setMsg("Prova ripristinata."); }}>
        Ripristina la prova
      </ConfirmButton>
    </div>
  );
}

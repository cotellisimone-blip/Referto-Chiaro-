"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, Clock3, Lock, UserPlus } from "lucide-react";
import {
  applyAsDoctor,
  doctorAct,
  doctorFreeSlots,
  doctorRequest,
  doctorRequests,
  getDoctor,
  getRequest,
  setAcceptsNewOpinions,
  specialtyName,
  BRESCIA_CAPS,
  type DoctorAction,
  type DoctorRequestView,
  type PrestazioniState,
} from "@/domain/prestazioni/engine";
import { PRESTAZIONI, PRESTAZIONI_ORDER, type PrestazioneKind } from "@/domain/prestazioni/listino";
import { act, setDoctor, update, useDemoDoctor, usePrestazioni } from "./store";
import { DemoNotice, ErrorBox, Loading, Price, SlotPicker, StatusBadge, areaCls, formatSlot, inputCls } from "./ui";

const DOCTOR_ERRORS: Record<string, string> = {
  "non-assegnata": "Questa richiesta non è assegnata a te.",
  "stato-non-valido": "La richiesta è cambiata nel frattempo: ricarica la pagina.",
  "fascia-occupata": "Quell'orario non è più libero nella tua agenda (anche il tragitto di un domicilio conta).",
  "medico-non-abilitato": "Non sei abilitato a questa prestazione.",
  "dati-mancanti": "Completa i campi richiesti.",
};

function WhoAmI({ s, current }: { s: PrestazioniState; current: string | null }) {
  return (
    <section aria-labelledby="chi-titolo" className="card p-5 sm:p-6">
      <h2 id="chi-titolo" className="text-xl font-bold text-ink">Entra come medico di prova</h2>
      <p className="mt-1 text-[0.9375rem] text-muted">Profili dimostrativi, nessun medico reale. Nel sito vero l&apos;accesso al portale richiede l&apos;autenticazione a due fattori.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {s.doctors.map((d) => (
          <button key={d.id} type="button" onClick={() => setDoctor(d.id)} aria-pressed={current === d.id} className={current === d.id ? "btn btn-primary h-auto justify-start whitespace-normal py-3 text-left" : "btn btn-secondary h-auto justify-start whitespace-normal py-3 text-left"}>
            <span>
              <span className="block font-semibold">{d.name}</span>
              <span className="block text-sm opacity-85">
                {d.role === "specialista" ? specialtyName(s, d.specialtyId) : "Medicina generale"} · {d.status === "verificato" ? `abilitato a: ${d.enabled.map((k) => PRESTAZIONI[k].short.toLowerCase()).join(", ") || "nessuna prestazione"}` : d.status === "candidato" ? "candidatura in verifica" : "sospeso"}
              </span>
            </span>
          </button>
        ))}
      </div>
      <Link href="/prova/medico/candidatura" className="btn btn-ghost mt-3">
        <UserPlus aria-hidden className="h-4 w-4" /> Candidati come medico
      </Link>
    </section>
  );
}

export function DoctorPortal() {
  const s = usePrestazioni();
  const me = useDemoDoctor();
  if (!s) return <Loading />;
  const now = new Date();
  const d = getDoctor(s, me);
  const list = d ? doctorRequests(s, d.id) : [];
  const todo = list.filter((r) => ["ricevuta", "confermata", "in_corso", "sintesi"].includes(r.status));
  const rest = list.filter((r) => !todo.includes(r));
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Portale medico · prova</p>
        <h1 className="display mt-3 text-[2rem] sm:text-[2.5rem]">{d ? d.name.replace(/ \(.*\)$/, "") : "Portale medico"}</h1>
        {d ? <p className="mt-2 text-[1.0625rem] text-ink-soft">{d.ordine} · {d.role === "specialista" ? specialtyName(s, d.specialtyId) : "Medicina generale"} · profilo dimostrativo</p> : null}
      </div>
      <DemoNotice>Il medico vede solo le richieste assegnate a lui; recapito e via li vede a prestazione confermata.</DemoNotice>
      {d && d.status !== "verificato" ? (
        <div className="card border-warn/50 p-6" role="status">
          <p className="flex items-center gap-2 text-xl font-bold text-ink"><Clock3 aria-hidden className="h-5 w-5 text-warn" /> {d.status === "candidato" ? "Candidatura in verifica" : "Profilo sospeso"}</p>
          <p className="mt-2 text-[1.0625rem] text-ink-soft">
            {d.status === "candidato" ? "Puoi ricevere richieste solo dopo che l'amministrazione ha verificato l'iscrizione all'Albo e ti ha abilitato alle prestazioni." : "L'amministrazione ha sospeso il profilo: non ricevi nuove richieste."}
          </p>
          <Link href="/prova/amministrazione" className="link mt-3 inline-flex min-h-11 items-center font-semibold">Prova come amministrazione</Link>
        </div>
      ) : null}
      {d && d.status === "verificato" ? (
        <>
          {d.role === "specialista" ? (
            <label className="check-row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink">
              <input type="checkbox" checked={d.acceptsNewOpinions} onChange={(e) => update((st) => setAcceptsNewOpinions(st, d.id, e.target.checked))} className="h-5 w-5" />
              Valuto nuove richieste di secondo parere e propongo un appuntamento
            </label>
          ) : null}
          <section aria-labelledby="dagestire-titolo">
            <h2 id="dagestire-titolo" className="text-2xl font-bold text-ink">Da gestire</h2>
            {todo.length ? <DoctorList items={todo} s={s} now={now} /> : <p className="mt-3 text-[1.0625rem] text-muted">Nessuna richiesta da gestire. Inviane una dal ruolo Paziente.</p>}
          </section>
          {rest.length ? (
            <section aria-labelledby="altre-titolo">
              <h2 id="altre-titolo" className="text-2xl font-bold text-ink">In attesa del paziente o chiuse</h2>
              <DoctorList items={rest} s={s} now={now} />
            </section>
          ) : null}
        </>
      ) : null}
      <WhoAmI s={s} current={me} />
    </div>
  );
}

function DoctorList({ items, s, now }: { items: DoctorRequestView[]; s: PrestazioniState; now: Date }) {
  return (
    <ul className="mt-4 grid gap-3 md:grid-cols-2">
      {items.map((r) => {
        const when = r.scheduledStart ?? r.proposal?.start ?? r.requestedStart;
        return (
          <li key={r.id}>
            <Link href={`/prova/medico/richieste/${r.id}`} className="card card-lift flex h-full flex-col gap-2 p-5">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-ink">{PRESTAZIONI[r.kind].short}{r.kind === "parere" ? ` · ${specialtyName(s, r.specialtyId)}` : ""}</span>
                <StatusBadge status={r.status} />
              </span>
              <span className="text-[0.9375rem] text-ink-soft">
                {r.code}{when ? ` · ${formatSlot(when, now)}` : ""}{r.address ? ` · ${r.address.comune} ${r.address.cap}` : ""}
              </span>
              {r.video.state === "attesa" ? <span className="chip w-fit bg-marker-soft text-teal-deep">Il paziente è in sala d&apos;attesa</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function DoctorRequestPage({ id }: { id: string }) {
  const s = usePrestazioni();
  const me = useDemoDoctor();
  const [msg, setMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<"altro" | "rifiuta" | "documenti" | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [days, setDays] = useState(5);
  const [text, setText] = useState("");
  const [inPerson, setInPerson] = useState("");
  if (!s) return <Loading />;
  const now = new Date();
  const r = me ? doctorRequest(s, me, id) : null;
  const back = (
    <Link href="/prova/medico" className="link inline-flex min-h-11 items-center gap-1 font-semibold">
      <ArrowLeft aria-hidden className="h-4 w-4" /> Portale medico
    </Link>
  );
  const doctorId = me ?? "";
  if (!r) {
    // Accesso negato: la richiesta non è di questo medico (o il medico non è verificato). Nella prova si può cambiare profilo.
    const assigned = getDoctor(s, getRequest(s, id)?.doctorId ?? null);
    return (
      <div className="space-y-6">
        {back}
        <div className="card p-6" role="status" data-accesso-negato>
          <p className="flex items-center gap-2 text-xl font-bold text-ink"><Lock aria-hidden className="h-5 w-5" /> Non puoi vedere questa richiesta</p>
          <p className="mt-2 text-[1.0625rem] text-ink-soft">I dati di una richiesta sono visibili solo al medico assegnato{getRequest(s, id) && !assigned ? ". Questa richiesta in questo momento non è assegnata" : ""}.</p>
          {assigned ? (
            <button type="button" className="btn btn-primary mt-4" onClick={() => setDoctor(assigned.id)}>
              Entra come il medico assegnato (prova)
            </button>
          ) : null}
        </div>
      </div>
    );
  }
  const run = (a: DoctorAction, ok: string) => {
    const res = act((st, n) => doctorAct(st, doctorId, r.id, a, n));
    if (res.ok) {
      setMsg(ok);
      setMode(null);
      setText("");
      setSlot(null);
    } else setMsg(DOCTOR_ERRORS[res.error] ?? "Operazione non riuscita.");
    return res.ok;
  };
  const free = doctorFreeSlots(s, doctorId, r.kind, now, r.id);

  return (
    <div className="space-y-6" data-richiesta={r.id} data-stato={r.status}>
      {back}
      <div>
        <h1 className="display text-[1.75rem] sm:text-[2.25rem]">{PRESTAZIONI[r.kind].title}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-[1.0625rem] text-ink-soft">
          <StatusBadge status={r.status} /> <span>{r.code}</span> <span>· <Price kind={r.kind} cents={r.priceCents} /></span>
        </p>
        <p className="mt-1 text-[0.9375rem] text-muted">Assegnata a te: {getDoctor(s, doctorId)?.name}</p>
      </div>
      {msg ? <p role="status" className="rounded-xl border border-line bg-mist px-4 py-3 text-[1.0625rem] text-ink">{msg}</p> : null}

      <section className="card p-5 sm:p-7" aria-label="Dati della richiesta">
        <dl className="grid gap-3 text-[1.0625rem]">
          <Row label="Per" value={r.forWhom.self ? "Il paziente stesso (profilo di prova)" : `${r.forWhom.name}${r.forWhom.relation ? `, ${r.forWhom.relation} del richiedente` : ""}`} />
          {r.kind === "parere" ? <Row label="Specialità" value={specialtyName(s, r.specialtyId)} /> : null}
          <Row label={r.kind === "parere" ? "Quesito clinico" : "Motivo"} value={r.reason} />
          {r.requestedStart && r.status === "ricevuta" ? <Row label="Fascia richiesta" value={formatSlot(r.requestedStart, now)} /> : null}
          {r.proposal ? <Row label="Hai proposto" value={`${formatSlot(r.proposal.start, now)}${r.proposal.deliveryDays ? ` · sintesi entro ${r.proposal.deliveryDays} giorni lavorativi` : ""}`} /> : null}
          {r.scheduledStart ? <Row label="Appuntamento" value={formatSlot(r.scheduledStart, now)} /> : null}
          {r.address ? <Row label="Dove" value={r.address.street ? `${r.address.street}, ${r.address.cap} ${r.address.comune}${r.address.notes ? ` (${r.address.notes})` : ""}` : `${r.address.comune} ${r.address.cap} · via visibile dopo la conferma`} /> : null}
          <Row label="Telefono" value={r.contact ? r.contact.phone : "visibile dopo la conferma"} />
          {r.documents.length ? <Row label="Documenti condivisi" value={<ul className="space-y-1">{r.documents.map((d) => <li key={d.id}>{d.title}</li>)}</ul>} /> : null}
          {r.notice ? <Row label="Ultima nota" value={r.notice} /> : null}
        </dl>
      </section>

      {r.status === "ricevuta" && r.kind !== "parere" ? (
        <Actions>
          {mode === null ? (
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" className="btn btn-ghost" onClick={() => setMode("rifiuta")}>Non posso</button>
              <button type="button" className="btn btn-secondary" onClick={() => setMode("altro")}>Proponi un altro orario</button>
              <button type="button" className="btn btn-primary" onClick={() => run({ type: "accetta" }, "Fascia accettata. Il paziente vede la proposta e la conferma.")}>Accetta {formatSlot(r.requestedStart!, now)}</button>
            </div>
          ) : null}
          {mode === "altro" ? (
            <div className="space-y-4">
              <SlotPicker legend="Le tue fasce libere" slots={free.slice(0, 10)} value={slot} onChange={setSlot} now={now} />
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button type="button" className="btn btn-ghost" onClick={() => setMode(null)}>Indietro</button>
                <button type="button" className="btn btn-primary" disabled={!slot} onClick={() => run({ type: "accetta", start: slot! }, "Orario proposto al paziente.")}>Proponi questo orario</button>
              </div>
            </div>
          ) : null}
          {mode === "rifiuta" ? (
            <Reason label="Motivo, per il paziente" value={text} onChange={setText} onBack={() => setMode(null)} cta="Comunica l'indisponibilità" onGo={() => run({ type: "rifiuta", reason: text }, "Il paziente vede le fasce alternative.")} />
          ) : null}
        </Actions>
      ) : null}

      {r.status === "ricevuta" && r.kind === "parere" ? (
        <Actions>
          {mode === null ? (
            <div className="space-y-5">
              <p className="text-[1.0625rem] text-ink-soft">Valuta se il quesito è adatto al percorso a distanza. Se lo accetti, proponi orario del videoconsulto e tempi della sintesi.</p>
              <SlotPicker legend="Orario del videoconsulto" slots={free.slice(0, 10)} value={slot} onChange={setSlot} now={now} />
              <label className="block text-[1.0625rem] font-semibold text-ink">
                Consegna della sintesi scritta
                <select value={days} onChange={(e) => setDays(Number(e.target.value))} className={inputCls}>
                  {[3, 5, 7, 10].map((n) => <option key={n} value={n}>entro {n} giorni lavorativi dal video</option>)}
                </select>
              </label>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" className="btn btn-ghost" onClick={() => setMode("rifiuta")}>Non adatto a distanza</button>
                <button type="button" className="btn btn-secondary" onClick={() => setMode("documenti")}>Chiedi documenti</button>
                <button type="button" className="btn btn-primary" disabled={!slot} onClick={() => run({ type: "accetta", start: slot!, deliveryDays: days }, "Caso accettato. Il paziente vede orario, prezzo e tempi e conferma.")}>Accetta il caso</button>
              </div>
            </div>
          ) : null}
          {mode === "documenti" ? (
            <Reason label="Quali documenti ti servono" value={text} onChange={setText} onBack={() => setMode(null)} cta="Chiedi i documenti" onGo={() => run({ type: "chiedi-documenti", message: text }, "Richiesta inviata. Quando il paziente li integra, riprendi questa stessa richiesta.")} placeholder="Esempio: l'Holter ECG delle 24 ore." />
          ) : null}
          {mode === "rifiuta" ? (
            <div className="space-y-4">
              <Reason label="Esito per il paziente" value={text} onChange={setText} onBack={() => setMode(null)} cta="Chiudi senza addebito" onGo={() => run({ type: "rifiuta", reason: text, inPerson }, "Caso chiuso senza addebito.")} placeholder="Esempio: il quesito richiede una visita in presenza.">
                <label className="block text-[1.0625rem] font-semibold text-ink">
                  Percorso in presenza suggerito (facoltativo)
                  <input value={inPerson} onChange={(e) => setInPerson(e.target.value)} className={inputCls} placeholder="Visita cardiologica con ecocardiogramma" />
                </label>
              </Reason>
            </div>
          ) : null}
        </Actions>
      ) : null}

      {r.status === "proposta" ? (
        <Actions>
          <p className="text-[1.0625rem] text-ink-soft">In attesa della conferma del paziente, entro {formatSlot(r.proposal!.expiresAt, now)}.</p>
        </Actions>
      ) : null}

      {r.status === "confermata" ? (
        <Actions>
          {r.kind !== "domicilio" ? <p className="mb-3 text-[1.0625rem] text-ink-soft">{r.video.state === "attesa" ? "Il paziente è in sala d'attesa." : "Il paziente non è ancora in sala d'attesa."}</p> : null}
          <button type="button" className="btn btn-primary" onClick={() => run({ type: "avvia" }, r.kind === "domicilio" ? "Visita iniziata." : "Videoconsulto avviato (simulato).")}>
            {r.kind === "domicilio" ? "Inizia la visita" : "Avvia il videoconsulto"}
          </button>
        </Actions>
      ) : null}

      {r.status === "in_corso" ? (
        <Actions>
          {r.video.state === "problema" ? <p className="mb-3 text-warn">Il paziente ha perso la connessione (simulazione): può ricollegarsi o riprogrammare.</p> : null}
          {r.kind !== "parere" ? (
            <label className="block text-[1.0625rem] font-semibold text-ink">
              {r.kind === "video" ? "Breve riepilogo per il paziente" : "Esito della visita, per il paziente (facoltativo)"}
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className={areaCls} placeholder="RIEPILOGO DIMOSTRATIVO. Testo di prova, senza valore clinico." />
            </label>
          ) : null}
          <button type="button" className="btn btn-primary mt-4" onClick={() => run({ type: "concludi", note: text || (r.kind === "video" ? "RIEPILOGO DIMOSTRATIVO. Testo di prova, senza valore clinico." : "") }, r.kind === "parere" ? "Videoconsulto concluso. Ora consegna la sintesi." : "Prestazione conclusa.")}>
            {r.kind === "parere" ? "Concludi il videoconsulto" : "Concludi la prestazione"}
          </button>
        </Actions>
      ) : null}

      {r.status === "sintesi" ? (
        <Actions>
          <label className="block text-[1.0625rem] font-semibold text-ink">
            Sintesi scritta
            <textarea
              value={text || SAMPLE_SINTESI}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className={areaCls}
            />
          </label>
          <button type="button" className="btn btn-primary mt-4" onClick={() => run({ type: "consegna-sintesi", text: text || SAMPLE_SINTESI }, "Sintesi consegnata: il paziente la trova nella sua area.")}>
            Consegna la sintesi
          </button>
        </Actions>
      ) : null}
    </div>
  );
}

const SAMPLE_SINTESI =
  "DOCUMENTO DIMOSTRATIVO — testo fittizio, senza valore clinico.\n\nQuesito: valutazione di una proposta terapeutica.\nDocumentazione esaminata: referti di esempio condivisi dal paziente.\nSintesi: in questa prova lo specialista riassume ciò che è emerso dal colloquio e dai documenti, e indica eventuali approfondimenti da discutere con il medico curante.";

function Actions({ children }: { children: React.ReactNode }) {
  return (
    <section className="card p-5 sm:p-7" aria-label="Azioni del medico">
      {children}
    </section>
  );
}

function Reason({ label, value, onChange, onBack, onGo, cta, placeholder, children }: { label: string; value: string; onChange: (v: string) => void; onBack: () => void; onGo: () => void; cta: string; placeholder?: string; children?: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <label className="block text-[1.0625rem] font-semibold text-ink">
        {label}
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={areaCls} placeholder={placeholder} />
      </label>
      {children}
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        <button type="button" className="btn btn-ghost" onClick={onBack}>Indietro</button>
        <button type="button" className="btn btn-primary" disabled={!value.trim()} onClick={onGo}>{cta}</button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 border-b border-line pb-2 sm:grid-cols-[12rem_1fr]">
      <dt className="text-muted">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

// ---------- Candidatura ----------

export function DoctorApply() {
  const s = usePrestazioni();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ordine, setOrdine] = useState("");
  const [offered, setOffered] = useState<PrestazioneKind[]>(["domicilio", "video"]);
  const [specialtyId, setSpecialtyId] = useState<string>("cardiologia");
  const [zones, setZones] = useState(true);
  const [windows, setWindows] = useState<("mattina" | "pomeriggio")[]>(["pomeriggio"]);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  if (!s) return <Loading />;
  const toggle = <T,>(list: T[], x: T, on: boolean) => (on ? [...new Set([...list, x])] : list.filter((y) => y !== x));
  if (done) {
    return (
      <div className="card space-y-3 p-6" role="status">
        <p className="flex items-center gap-2 text-xl font-bold text-ink"><BadgeCheck aria-hidden className="h-5 w-5 text-teal" /> Candidatura inviata (prova)</p>
        <p className="text-[1.0625rem] text-ink-soft">Ora l&apos;amministrazione verifica l&apos;iscrizione all&apos;Albo e ti abilita alle prestazioni. Fino ad allora non ricevi richieste.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/prova/amministrazione" className="btn btn-primary">Verifica come amministrazione <ArrowRight aria-hidden className="h-4 w-4" /></Link>
          <Link href="/prova/medico" className="btn btn-secondary">Vai al portale medico</Link>
        </div>
      </div>
    );
  }
  return (
    <form
      className="card space-y-5 p-5 sm:p-7"
      onSubmit={(e) => {
        e.preventDefault();
        const r = act((st, n) => applyAsDoctor(st, { name: `${name.trim()} (candidatura dimostrativa)`, email, phone, ordine, specialtyId: offered.includes("parere") ? specialtyId : null, offered, zones: zones && offered.includes("domicilio") ? BRESCIA_CAPS : [], windows }, n));
        if (r.ok) {
          setDoctor(r.id);
          setDone(r.id);
        } else setError("Completa nome, email professionale, estremi di iscrizione, almeno una prestazione e una fascia.");
      }}
    >
      <DemoNotice>Usa dati inventati: la verifica in questa prova è fittizia.</DemoNotice>
      {error ? <ErrorBox>{error}</ErrorBox> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-[1.0625rem] font-semibold text-ink">Nome e cognome<input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder="Dott.ssa Prova" /></label>
        <label className="block text-[1.0625rem] font-semibold text-ink">Email professionale<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder="nome@esempio.invalid" /></label>
        <label className="block text-[1.0625rem] font-semibold text-ink">Telefono professionale<input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} /></label>
        <label className="block text-[1.0625rem] font-semibold text-ink">Iscrizione all&apos;Ordine (provincia e numero)<input value={ordine} onChange={(e) => setOrdine(e.target.value)} required className={inputCls} placeholder="OMCeO Brescia n. DEMO-0000" /></label>
      </div>
      <fieldset>
        <legend className="text-lg font-semibold text-ink">Prestazioni che offri</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {PRESTAZIONI_ORDER.map((k) => (
            <label key={k} className="check-row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink">
              <input type="checkbox" checked={offered.includes(k)} onChange={(e) => setOffered(toggle(offered, k, e.target.checked))} className="h-5 w-5" /> {PRESTAZIONI[k].short}
            </label>
          ))}
        </div>
      </fieldset>
      {offered.includes("parere") ? (
        <label className="block text-[1.0625rem] font-semibold text-ink">
          Specialità per il secondo parere
          <select value={specialtyId} onChange={(e) => setSpecialtyId(e.target.value)} className={inputCls}>
            {s.specialties.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </label>
      ) : null}
      {offered.includes("domicilio") ? (
        <label className="check-row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink">
          <input type="checkbox" checked={zones} onChange={(e) => setZones(e.target.checked)} className="h-5 w-5" /> Zona domiciliare: {s.coverage.label}
        </label>
      ) : null}
      <fieldset>
        <legend className="text-lg font-semibold text-ink">Fasce in cui sei disponibile (prossimi giorni)</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {(["mattina", "pomeriggio"] as const).map((w) => (
            <label key={w} className="check-row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink">
              <input type="checkbox" checked={windows.includes(w)} onChange={(e) => setWindows(toggle(windows, w, e.target.checked))} className="h-5 w-5" /> {w === "mattina" ? "Mattina (9–12)" : "Pomeriggio (15–18)"}
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="btn btn-primary">Invia la candidatura</button>
    </form>
  );
}

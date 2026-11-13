"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, BadgeCheck, Clock3, FileText, Home, Lock, type LucideIcon, UserPlus, Video } from "lucide-react";
import {
  applyAsDoctor,
  doctorAct,
  doctorFreeSlots,
  doctorRequest,
  doctorRequests,
  getDoctor,
  getRequest,
  setAcceptsNewOpinions,
  NEXT_STEPS,
  SAMPLE_RIEPILOGO,
  type NextStepId,
  specialtyName,
  BRESCIA_CAPS,
  type DoctorAction,
  type DoctorRequestView,
  type PrestazioniState,
} from "@/domain/prestazioni/engine";
import { PRESTAZIONI, PRESTAZIONI_ORDER, type PrestazioneKind } from "@/domain/prestazioni/listino";
import { act, setDoctor, update, useDemoDoctor, usePrestazioni } from "./store";
import { DemoNotice, ErrorBox, Loading, OkBox, Price, Row, SlotPicker, StatusBadge, formatSlot } from "./ui";

const ICON: Record<PrestazioneKind, LucideIcon> = { domicilio: Home, video: Video, parere: FileText };
const TONE: Record<PrestazioneKind, string> = { domicilio: "tone-medico", video: "tone-medico", parere: "tone-parere" };

const DOCTOR_ERRORS: Record<string, string> = {
  "non-assegnata": "Questa richiesta non è assegnata a te.",
  "stato-non-valido": "La richiesta è cambiata nel frattempo: ricarica la pagina.",
  "fascia-occupata": "Quell'orario non è più libero nella tua agenda (anche il tragitto di un domicilio conta).",
  "medico-non-abilitato": "Non sei abilitato a questa prestazione.",
  "dati-mancanti": "Completa i campi richiesti.",
};

function WhoAmI({ s, current }: { s: PrestazioniState; current: string | null }) {
  return (
    <section aria-labelledby="chi-titolo" className="form-card">
      <h2 id="chi-titolo" className="area-h2">
        Entra come medico di prova
      </h2>
      <p className="form-card-text">Profili dimostrativi, nessun medico reale. Nel sito vero l&apos;accesso al portale richiede l&apos;autenticazione a due fattori.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {s.doctors.map((d) => (
          <button key={d.id} type="button" onClick={() => setDoctor(d.id)} aria-pressed={current === d.id} className={clsx("profile-pick", current === d.id && "profile-pick-on")}>
            <span aria-hidden className="profile-pick-initials">
              {d.name
                .replace(/^Dott\.(ssa)? /, "")
                .replace(/ \(.*\)$/, "")
                .split(" ")
                .map((x) => x[0])
                .join("")
                .slice(0, 2)}
            </span>
            <span className="min-w-0">
              <span className="block text-[1.0625rem] font-bold leading-snug text-ink">{d.name}</span>
              <span className="mt-0.5 block text-base leading-snug text-ink-soft">
                {d.role === "specialista" ? specialtyName(s, d.specialtyId) : "Medicina generale"} · {d.status === "verificato" ? `abilitato a: ${d.enabled.map((k) => PRESTAZIONI[k].short.toLowerCase()).join(", ") || "nessuna prestazione"}` : d.status === "candidato" ? "candidatura in verifica" : "sospeso"}
              </span>
            </span>
          </button>
        ))}
      </div>
      <Link href="/prova/medico/candidatura" className="btn btn-ghost mt-4">
        <UserPlus aria-hidden className="h-5 w-5" /> Candidati come medico
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
    <div className="space-y-10 sm:space-y-12">
      <header>
        <p className="eyebrow">Portale medico · prova</p>
        <h1 className="area-title mt-3">{d ? d.name.replace(/ \(.*\)$/, "") : "Portale medico"}</h1>
        {d ? (
          <p className="area-lead">
            {d.ordine} · {d.role === "specialista" ? specialtyName(s, d.specialtyId) : "Medicina generale"} · profilo dimostrativo
          </p>
        ) : (
          <p className="area-lead">Scegli qui sotto un profilo di prova per vedere le richieste come le vede un medico.</p>
        )}
      </header>
      {d && d.status !== "verificato" ? (
        <div className="callout callout-warn" role="status">
          <span aria-hidden className="callout-ico">
            <Clock3 />
          </span>
          <div>
            <p className="callout-title">{d.status === "candidato" ? "Candidatura in verifica" : "Profilo sospeso"}</p>
            <p className="callout-text">
              {d.status === "candidato" ? "Puoi ricevere richieste solo dopo che l'amministrazione ha verificato l'iscrizione all'Albo e ti ha abilitato alle prestazioni." : "L'amministrazione ha sospeso il profilo: non ricevi nuove richieste."}
            </p>
            <Link href="/prova/amministrazione" className="action-link mt-1">
              Prova come amministrazione <ArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      ) : null}
      {d && d.status === "verificato" ? (
        <>
          {d.role === "specialista" ? (
            <label className="option-row">
              <input type="checkbox" checked={d.acceptsNewOpinions} onChange={(e) => update((st) => setAcceptsNewOpinions(st, d.id, e.target.checked))} />
              Valuto nuove richieste di secondo parere e propongo un appuntamento
            </label>
          ) : null}
          <section aria-labelledby="dagestire-titolo">
            <h2 id="dagestire-titolo" className="area-h2">
              Da gestire
            </h2>
            {todo.length ? <DoctorList items={todo} s={s} now={now} /> : <p className="empty-note mt-4">Nessuna richiesta da gestire. Inviane una dal ruolo Paziente.</p>}
          </section>
          {rest.length ? (
            <section aria-labelledby="altre-titolo">
              <h2 id="altre-titolo" className="area-h2">
                In attesa del paziente o chiuse
              </h2>
              <DoctorList items={rest} s={s} now={now} />
            </section>
          ) : null}
        </>
      ) : null}
      <WhoAmI s={s} current={me} />
      <DemoNotice>Il medico vede solo le richieste assegnate a lui; recapito e via li vede a prestazione confermata.</DemoNotice>
    </div>
  );
}

function DoctorList({ items, s, now }: { items: DoctorRequestView[]; s: PrestazioniState; now: Date }) {
  return (
    <ul className="mt-5 grid gap-4 md:grid-cols-2">
      {items.map((r) => {
        const when = r.scheduledStart ?? r.proposal?.start ?? r.requestedStart;
        const Icon = ICON[r.kind];
        return (
          <li key={r.id} className={TONE[r.kind]}>
            <Link href={`/prova/medico/richieste/${r.id}`} className="card card-lift flex h-full gap-4 p-5 sm:p-6">
              <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone">
                <Icon />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                  <span className="text-lg font-bold leading-snug text-ink">{PRESTAZIONI[r.kind].short}{r.kind === "parere" ? ` · ${specialtyName(s, r.specialtyId)}` : ""}</span>
                  <StatusBadge status={r.status} />
                </span>
                <span className="meta">
                  {r.code}{when ? ` · ${formatSlot(when, now)}` : ""}{r.address ? ` · ${r.address.comune} ${r.address.cap}` : ""}
                </span>
                {r.video.state === "attesa" ? (
                  <span className="chip mt-1 w-fit bg-marker-soft text-teal-deep">
                    <span aria-hidden className="live-dot" /> Il paziente è in sala d&apos;attesa
                  </span>
                ) : null}
              </span>
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
  const [nextStep, setNextStep] = useState<NextStepId>("medico-di-famiglia");
  const [prescription, setPrescription] = useState(false);
  const [inPerson, setInPerson] = useState("");
  if (!s) return <Loading />;
  const now = new Date();
  const r = me ? doctorRequest(s, me, id) : null;
  const back = (
    <Link href="/prova/medico" className="back-link">
      <ArrowLeft aria-hidden /> Portale medico
    </Link>
  );
  const doctorId = me ?? "";
  if (!r) {
    // Accesso negato: la richiesta non è di questo medico (o il medico non è verificato). Nella prova si può cambiare profilo.
    const assigned = getDoctor(s, getRequest(s, id)?.doctorId ?? null);
    return (
      <div className="max-w-[46rem] space-y-4">
        {back}
        <div className="form-card" role="status" data-accesso-negato>
          <div className="form-card-head">
            <span aria-hidden className="tile-ico tile-ico-sm">
              <Lock />
            </span>
            <p className="form-card-title">Non puoi vedere questa richiesta</p>
          </div>
          <p className="form-card-body">I dati di una richiesta sono visibili solo al medico assegnato{getRequest(s, id) && !assigned ? ". Questa richiesta in questo momento non è assegnata" : ""}.</p>
          {assigned ? (
            <button type="button" className="btn btn-primary btn-wrap mt-6 max-sm:w-full" onClick={() => setDoctor(assigned.id)}>
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

  const actions = doctorActions();

  function doctorActions(): React.ReactNode {
    if (!r) return null;
    if (r.status === "ricevuta" && r.kind !== "parere") {
      return (
        <>
          {mode === null ? (
            <div className="flex flex-col gap-3">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => run({ type: "accetta" }, "Fascia accettata. Il paziente vede la proposta e la conferma.")}>
                Accetta {formatSlot(r.requestedStart!, now)}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setMode("altro")}>
                Proponi un altro orario
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setMode("rifiuta")}>
                Non posso
              </button>
            </div>
          ) : null}
          {mode === "altro" ? (
            <div className="space-y-5">
              <SlotPicker legend="Le tue fasce libere" slots={free.slice(0, 10)} value={slot} onChange={setSlot} now={now} />
              <div className="flex flex-col-reverse gap-3 sm:flex-row lg:flex-col-reverse">
                <button type="button" className="btn btn-ghost" onClick={() => setMode(null)}>
                  Indietro
                </button>
                <button type="button" className="btn btn-primary" disabled={!slot} onClick={() => run({ type: "accetta", start: slot! }, "Orario proposto al paziente.")}>
                  Proponi questo orario
                </button>
              </div>
            </div>
          ) : null}
          {mode === "rifiuta" ? <Reason label="Motivo, per il paziente" value={text} onChange={setText} onBack={() => setMode(null)} cta="Comunica l'indisponibilità" onGo={() => run({ type: "rifiuta", reason: text }, "Il paziente vede le fasce alternative.")} /> : null}
        </>
      );
    }
    if (r.status === "ricevuta" && r.kind === "parere") {
      return (
        <>
          {mode === null ? (
            <div className="space-y-5">
              <p className="text-[1.0625rem] text-ink-soft">Valuta se il quesito è adatto al percorso a distanza. Se lo accetti, proponi orario del videoconsulto e tempi della sintesi.</p>
              <SlotPicker legend="Orario del videoconsulto" slots={free.slice(0, 10)} value={slot} onChange={setSlot} now={now} />
              <label className="field-label">
                Consegna della sintesi scritta, dal videoconsulto
                <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="field-input">
                  {[3, 5, 7, 10].map((n) => (
                    <option key={n} value={n}>
                      entro {n} giorni lavorativi
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col gap-3">
                <button type="button" className="btn btn-primary btn-lg" disabled={!slot} onClick={() => run({ type: "accetta", start: slot!, deliveryDays: days }, "Caso accettato. Il paziente vede orario, prezzo e tempi e conferma.")}>
                  Accetta il caso
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setMode("documenti")}>
                  Chiedi documenti
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setMode("rifiuta")}>
                  Non adatto a distanza
                </button>
              </div>
            </div>
          ) : null}
          {mode === "documenti" ? (
            <Reason label="Quali documenti ti servono" value={text} onChange={setText} onBack={() => setMode(null)} cta="Chiedi i documenti" onGo={() => run({ type: "chiedi-documenti", message: text }, "Richiesta inviata. Quando il paziente li integra, riprendi questa stessa richiesta.")} placeholder="Esempio: l'Holter ECG delle 24 ore." />
          ) : null}
          {mode === "rifiuta" ? (
            <Reason label="Esito per il paziente" value={text} onChange={setText} onBack={() => setMode(null)} cta="Chiudi senza addebito" onGo={() => run({ type: "rifiuta", reason: text, inPerson }, "Caso chiuso senza addebito.")} placeholder="Esempio: il quesito richiede una visita in presenza.">
              <label className="field-label">
                Percorso in presenza suggerito (facoltativo)
                <input value={inPerson} onChange={(e) => setInPerson(e.target.value)} className="field-input" placeholder="Visita cardiologica con ecocardiogramma" />
              </label>
            </Reason>
          ) : null}
        </>
      );
    }
    if (r.status === "proposta") return <p className="text-[1.0625rem] text-ink-soft">In attesa della conferma del paziente, entro {formatSlot(r.proposal!.expiresAt, now)}.</p>;
    if (r.status === "confermata") {
      return (
        <>
          {r.kind !== "domicilio" ? (
            <p className="mb-4 flex items-center gap-2.5 text-[1.0625rem] text-ink-soft">
              {r.video.state === "attesa" ? <span aria-hidden className="live-dot" /> : null}
              {r.video.state === "attesa" ? "Il paziente è in sala d'attesa." : "Il paziente non è ancora in sala d'attesa."}
            </p>
          ) : null}
          <button type="button" className="btn btn-primary btn-lg w-full" onClick={() => run({ type: "avvia" }, r.kind === "domicilio" ? "Visita iniziata." : "Videoconsulto avviato (simulato).")}>
            {r.kind === "domicilio" ? "Inizia la visita" : "Avvia il videoconsulto"}
          </button>
        </>
      );
    }
    if (r.status === "in_corso") {
      return (
        <>
          {r.video.state === "problema" ? <p className="mb-4 text-base font-semibold text-warn">Il paziente ha perso la connessione (simulazione): può ricollegarsi o riprogrammare.</p> : null}
          {r.kind !== "parere" ? (
            <>
              <label className="field-label">
                Riepilogo per il paziente
                <textarea value={text || SAMPLE_RIEPILOGO[r.kind]} onChange={(e) => setText(e.target.value)} rows={7} className="field-input" />
              </label>
              <NextStepSelect value={nextStep} onChange={setNextStep} />
              {r.kind === "domicilio" ? (
                <label className="option-row mt-4">
                  <input type="checkbox" checked={prescription} onChange={(e) => setPrescription(e.target.checked)} />
                  Ho lasciato una prescrizione su ricetta bianca
                </label>
              ) : null}
            </>
          ) : null}
          <button type="button" className={clsx("btn btn-primary btn-lg w-full", r.kind !== "parere" && "mt-5")} onClick={() => run({ type: "concludi", note: r.kind === "parere" ? "" : text || SAMPLE_RIEPILOGO[r.kind], nextStep, prescription }, r.kind === "parere" ? "Videoconsulto concluso. Ora consegna la sintesi." : "Prestazione conclusa: il paziente trova il riepilogo nella sua richiesta.")}>
            {r.kind === "parere" ? "Concludi il videoconsulto" : "Concludi la prestazione"}
          </button>
        </>
      );
    }
    if (r.status === "sintesi") {
      return (
        <>
          <label className="field-label">
            Sintesi scritta
            <textarea value={text || SAMPLE_SINTESI} onChange={(e) => setText(e.target.value)} rows={8} className="field-input" />
          </label>
          <NextStepSelect value={nextStep} onChange={setNextStep} />
          <button type="button" className="btn btn-primary btn-lg mt-5 w-full" onClick={() => run({ type: "consegna-sintesi", text: text || SAMPLE_SINTESI, nextStep }, "Sintesi consegnata: il paziente la trova nella sua area.")}>
            Consegna la sintesi
          </button>
        </>
      );
    }
    return null;
  }

  return (
    <div className="space-y-6 sm:space-y-8" data-richiesta={r.id} data-stato={r.status}>
      <header>
        {back}
        <h1 className="area-title mt-1">{PRESTAZIONI[r.kind].title}</h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[1.0625rem] text-ink-soft">
          <StatusBadge status={r.status} /> <span>{r.code}</span>{" "}
          <span>
            · <Price kind={r.kind} cents={r.priceCents} />
          </span>
        </p>
        <p className="meta mt-2">Assegnata a te: {getDoctor(s, doctorId)?.name}</p>
      </header>
      {msg ? <OkBox>{msg}</OkBox> : null}

      <div className={clsx("grid gap-6 lg:items-start lg:gap-10", actions ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]" : "max-w-[52rem]")}>
        <section className="form-card" aria-label="Dati della richiesta">
          <h2 className="area-h2">Dati della richiesta</h2>
          <dl className="kv-rows mt-5">
            <Row label="Per" value={r.forWhom.self ? "Il paziente stesso (profilo di prova)" : `${r.forWhom.name}${r.forWhom.relation ? `, ${r.forWhom.relation} del richiedente` : ""}`} />
            {r.kind === "parere" ? <Row label="Specialità" value={specialtyName(s, r.specialtyId)} /> : null}
            <Row label={r.kind === "parere" ? "Quesito clinico" : "Motivo"} value={r.reason} />
            {r.requestedStart && r.status === "ricevuta" ? <Row label="Fascia richiesta" value={formatSlot(r.requestedStart, now)} /> : null}
            {r.proposal ? <Row label="Hai proposto" value={`${formatSlot(r.proposal.start, now)}${r.proposal.deliveryDays ? ` · sintesi entro ${r.proposal.deliveryDays} giorni lavorativi` : ""}`} /> : null}
            {r.scheduledStart ? <Row label="Appuntamento" value={formatSlot(r.scheduledStart, now)} /> : null}
            {r.address ? <Row label="Dove" value={r.address.street ? `${r.address.street}, ${r.address.cap} ${r.address.comune}${r.address.notes ? ` (${r.address.notes})` : ""}` : `${r.address.comune} ${r.address.cap} · via visibile dopo la conferma`} /> : null}
            <Row label="Telefono" value={r.contact ? r.contact.phone : "visibile dopo la conferma"} />
            {r.documents.length ? (
              <Row
                label="Documenti condivisi"
                value={
                  <ul className="space-y-1">
                    {r.documents.map((d) => (
                      <li key={d.id}>{d.title}</li>
                    ))}
                  </ul>
                }
              />
            ) : null}
            {r.notice ? <Row label="Ultima nota" value={r.notice} /> : null}
          </dl>
        </section>

        {actions ? (
          <section className="form-card form-card-accent lg:sticky lg:top-28" aria-label="Azioni del medico">
            <h2 className="area-h2 mb-5">Che cosa fai ora</h2>
            {actions}
          </section>
        ) : null}
      </div>
    </div>
  );
}

const SAMPLE_SINTESI =
  "DOCUMENTO DIMOSTRATIVO — testo fittizio, senza valore clinico.\n\nQuesito: valutazione di una proposta terapeutica.\nDocumentazione esaminata: referti di esempio condivisi dal paziente.\nSintesi: in questa prova lo specialista riassume ciò che è emerso dal colloquio e dai documenti, e indica eventuali approfondimenti da discutere con il medico curante.";

function NextStepSelect({ value, onChange }: { value: NextStepId; onChange: (v: NextStepId) => void }) {
  return (
    <label className="field-label mt-5">
      Prossimo passo per il paziente
      <select value={value} onChange={(e) => onChange(e.target.value as NextStepId)} className="field-input">
        {(Object.keys(NEXT_STEPS) as NextStepId[]).map((k) => (
          <option key={k} value={k}>
            {NEXT_STEPS[k]}
          </option>
        ))}
      </select>
    </label>
  );
}

function Reason({ label, value, onChange, onBack, onGo, cta, placeholder, children }: { label: string; value: string; onChange: (v: string) => void; onBack: () => void; onGo: () => void; cta: string; placeholder?: string; children?: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <label className="field-label">
        {label}
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="field-input" placeholder={placeholder} />
      </label>
      {children}
      <div className="flex flex-col-reverse gap-3 sm:flex-row lg:flex-col-reverse">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          Indietro
        </button>
        <button type="button" className="btn btn-primary btn-wrap" disabled={!value.trim()} onClick={onGo}>
          {cta}
        </button>
      </div>
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
      <div className="form-card form-card-accent max-w-[46rem]" role="status">
        <div className="form-card-head">
          <span aria-hidden className="tile-ico tile-ico-sm">
            <BadgeCheck />
          </span>
          <p className="form-card-title">Candidatura inviata (prova)</p>
        </div>
        <p className="form-card-body">Ora l&apos;amministrazione verifica l&apos;iscrizione all&apos;Albo e ti abilita alle prestazioni. Fino ad allora non ricevi richieste.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/prova/amministrazione" className="btn btn-primary btn-wrap">
            Verifica come amministrazione <ArrowRight aria-hidden className="btn-arrow h-5 w-5 shrink-0" />
          </Link>
          <Link href="/prova/medico" className="btn btn-secondary">
            Vai al portale medico
          </Link>
        </div>
      </div>
    );
  }
  return (
    <form
      className="form-card max-w-[52rem] space-y-6"
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
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field-label">
          Nome e cognome
          <input value={name} onChange={(e) => setName(e.target.value)} required className="field-input" placeholder="Dott.ssa Prova" />
        </label>
        <label className="field-label">
          Email professionale
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="field-input" placeholder="nome@esempio.invalid" />
        </label>
        <label className="field-label">
          Telefono professionale
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="field-input" />
        </label>
        <label className="field-label">
          Iscrizione all&apos;Ordine (provincia e numero)
          <input value={ordine} onChange={(e) => setOrdine(e.target.value)} required className="field-input" placeholder="OMCeO Brescia n. DEMO-0000" />
        </label>
      </div>
      <fieldset>
        <legend className="area-h3">Prestazioni che offri</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {PRESTAZIONI_ORDER.map((k) => (
            <label key={k} className="option-row">
              <input type="checkbox" checked={offered.includes(k)} onChange={(e) => setOffered(toggle(offered, k, e.target.checked))} /> {PRESTAZIONI[k].short}
            </label>
          ))}
        </div>
      </fieldset>
      {offered.includes("parere") ? (
        <label className="field-label">
          Specialità per il secondo parere
          <select value={specialtyId} onChange={(e) => setSpecialtyId(e.target.value)} className="field-input">
            {s.specialties.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {offered.includes("domicilio") ? (
        <label className="option-row">
          <input type="checkbox" checked={zones} onChange={(e) => setZones(e.target.checked)} /> Zona domiciliare: {s.coverage.label}
        </label>
      ) : null}
      <fieldset>
        <legend className="area-h3">Fasce in cui sei disponibile (prossimi giorni)</legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {(["mattina", "pomeriggio"] as const).map((w) => (
            <label key={w} className="option-row">
              <input type="checkbox" checked={windows.includes(w)} onChange={(e) => setWindows(toggle(windows, w, e.target.checked))} /> {w === "mattina" ? "Mattina (9–12)" : "Pomeriggio (15–18)"}
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="btn btn-primary btn-lg max-sm:w-full">
        Invia la candidatura
      </button>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarCheck2, CheckCircle2, FileText, Home, MapPin, Video, WifiOff } from "lucide-react";
import {
  DEMO_DOCUMENTS,
  DEMO_PATIENT,
  STATUS_LABEL,
  ACTIVE_STATUSES,
  addDocuments,
  availability,
  cancelRequest,
  checkCoverage,
  chooseAlternative,
  confirmRequest,
  connectionProblem,
  createRequest,
  doctorFreeSlots,
  enterWaitingRoom,
  freeSlots,
  getDoctor,
  getRequest,
  patientRequests,
  reconnect,
  rejectProposal,
  reschedule,
  specialtyName,
  type BookingRequest,
  type PrestazioniState,
} from "@/domain/prestazioni/engine";
import { PRESTAZIONI, PRESTAZIONI_ORDER, type PrestazioneKind } from "@/domain/prestazioni/listino";
import { act, usePrestazioni } from "./store";
import { ConfirmButton, DemoNotice, EmergencyNumbers, ErrorBox, Loading, Price, SlotPicker, StatusBadge, areaCls, formatSlot, inputCls } from "./ui";

const ICON: Record<PrestazioneKind, typeof Home> = { domicilio: Home, video: Video, parere: FileText };

/** Scheda di una prestazione: tipo di visita, costo, disponibilità e azione successiva, a colpo d'occhio. */
export function PrestazioneCard({ s, kind, now, startHref }: { s: PrestazioniState; kind: PrestazioneKind; now: Date; startHref?: string }) {
  const info = PRESTAZIONI[kind];
  const av = availability(s, kind, now);
  const Icon = ICON[kind];
  const open = av.state === "aperto";
  return (
    <article className="card flex h-full flex-col p-5 sm:p-6" data-prestazione={kind} data-disponibilita={av.state}>
      <div className="flex items-start gap-3">
        <span className="tone-icon h-12 w-12 shrink-0">
          <Icon aria-hidden className="h-6 w-6" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-bold leading-snug text-ink">{info.title}</h3>
          <p className="mt-0.5 text-[0.9375rem] text-muted">{info.mode}</p>
        </div>
      </div>
      <p className="mt-4 text-[2rem] font-bold leading-none text-ink">
        <Price kind={kind} />
      </p>
      <p className="mt-1 text-[0.9375rem] text-muted">{info.durationLabel}, prezzo fisso</p>
      <p className="mt-4 flex flex-wrap items-center gap-2 text-[1.0625rem] text-ink">
        <span className={open ? "chip bg-marker-soft text-teal-deep" : "chip bg-cream text-warn"}>{open ? (av.today ? "Disponibile oggi" : "Disponibile") : av.state === "sospeso" ? "Sospesa" : av.state === "esaurito" ? "Fasce esaurite" : "Non disponibile"}</span>
        {av.next ? <span className="text-ink-soft">prima fascia {formatSlot(av.next, now)}</span> : null}
      </p>
      {!open ? <p className="mt-2 text-[0.9375rem] text-ink-soft">{av.message}</p> : null}
      <div className="mt-auto pt-5">
        <Link href={open ? (startHref ?? info.startHref) : av.action.href} className={open ? "btn btn-primary w-full" : "btn btn-secondary w-full"}>
          {open ? (kind === "domicilio" ? "Richiedi la visita" : kind === "video" ? "Prenota il videoconsulto" : "Richiedi il secondo parere") : av.action.label} <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export function PatientHome() {
  const s = usePrestazioni();
  if (!s) return <Loading />;
  const now = new Date();
  const mine = patientRequests(s, DEMO_PATIENT.id);
  const active = mine.filter((r) => ACTIVE_STATUSES.includes(r.status) || r.status === "indisponibile");
  const past = mine.filter((r) => !active.includes(r));
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Area personale · {DEMO_PATIENT.name} (paziente di prova)</p>
        <h1 className="display mt-3 text-[2rem] sm:text-[2.5rem]">Le tue prestazioni con un medico</h1>
      </div>
      <DemoNotice />
      {active.length ? (
        <section aria-labelledby="attive-titolo">
          <h2 id="attive-titolo" className="text-2xl font-bold text-ink">In corso</h2>
          <RequestList items={active} s={s} now={now} />
        </section>
      ) : null}
      <section aria-labelledby="nuova-titolo">
        <h2 id="nuova-titolo" className="text-2xl font-bold text-ink">Nuova richiesta</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {PRESTAZIONI_ORDER.map((k) => (
            <PrestazioneCard key={k} s={s} kind={k} now={now} />
          ))}
        </div>
      </section>
      {past.length ? (
        <section aria-labelledby="passate-titolo">
          <h2 id="passate-titolo" className="text-2xl font-bold text-ink">Concluse e annullate</h2>
          <RequestList items={past} s={s} now={now} />
        </section>
      ) : null}
    </div>
  );
}

function RequestList({ items, s, now }: { items: BookingRequest[]; s: PrestazioniState; now: Date }) {
  return (
    <ul className="mt-4 grid gap-3 md:grid-cols-2">
      {items.map((r) => {
        const when = r.scheduledStart ?? r.proposal?.start ?? r.requestedStart;
        return (
          <li key={r.id}>
            <Link href={`/prova/paziente/richieste/${r.id}`} className="card card-lift flex h-full flex-col gap-2 p-5">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-ink">{PRESTAZIONI[r.kind].short}{r.kind === "parere" ? ` · ${specialtyName(s, r.specialtyId)}` : ""}</span>
                <StatusBadge status={r.status} />
              </span>
              <span className="text-[0.9375rem] text-ink-soft">
                {r.code}
                {when ? ` · ${formatSlot(when, now)}` : ""}
                {!r.forWhom.self ? ` · per ${r.forWhom.name}` : ""}
              </span>
              <span className="mt-1 inline-flex items-center gap-1 font-semibold text-teal-deep">
                Apri <ArrowRight aria-hidden className="h-4 w-4" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// ---------- Nuova richiesta ----------

const ERRORS: Record<string, string> = {
  "servizio-sospeso": "Le nuove richieste per questa prestazione sono sospese in questo momento.",
  "fuori-zona": "L'indirizzo non è nell'area coperta.",
  "fascia-occupata": "Nel frattempo questa fascia è stata occupata. Scegline un'altra: non ti è stato addebitato nulla.",
  "specialita-chiusa": "Questa specialità non accetta nuove richieste in questo momento.",
  "dati-mancanti": "Mancano alcune informazioni: controlla i campi evidenziati.",
};

type Step = "zona" | "fascia" | "dati" | "riepilogo";

export function PatientStart({ kind }: { kind: PrestazioneKind }) {
  const s = usePrestazioni();
  const router = useRouter();
  const [step, setStep] = useState<Step>(kind === "domicilio" ? "zona" : kind === "video" ? "fascia" : "dati");
  const [comune, setComune] = useState(DEMO_PATIENT.address.comune);
  const [cap, setCap] = useState(DEMO_PATIENT.address.cap);
  const [coverage, setCoverage] = useState<string | null>(null);
  const [start, setStart] = useState<string | null>(null);
  const [self, setSelf] = useState(true);
  const [otherName, setOtherName] = useState("");
  const [relation, setRelation] = useState("");
  const [street, setStreet] = useState(DEMO_PATIENT.address.street);
  const [notes, setNotes] = useState(DEMO_PATIENT.address.notes);
  const [phone, setPhone] = useState(DEMO_PATIENT.phone);
  const [reason, setReason] = useState("");
  const [specialtyId, setSpecialtyId] = useState<string | null>(null);
  const [docs, setDocs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Al cambio di passo (o a un nuovo errore) riporta in vista l'inizio del passo: su telefono la pagina resterebbe
  // scorsa in basso, con titolo e messaggio fuori schermo.
  const topRef = useRef<HTMLParagraphElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 96) el.scrollIntoView({ block: "start" });
  }, [step, error]);
  if (!s) return <Loading />;
  const now = new Date();
  const info = PRESTAZIONI[kind];
  const av = availability(s, kind, now);
  const openSpecialties = s.specialties.filter((x) => availability(s, "parere", now, { specialtyId: x.id }).state === "aperto");
  const chosenSpecialty = specialtyId ?? (openSpecialties.length === 1 ? openSpecialties[0].id : null);

  const header = (
    <div>
      <Link href="/prova/paziente" className="link inline-flex min-h-11 items-center gap-1 font-semibold">
        <ArrowLeft aria-hidden className="h-4 w-4" /> Le tue prestazioni
      </Link>
      <h1 className="display mt-2 text-[2rem] sm:text-[2.5rem]">{info.title}</h1>
      <p className="mt-2 text-xl text-ink-soft">
        <strong className="text-ink">
          <Price kind={kind} />
        </strong>{" "}
        · {info.durationLabel}. {kind === "parere" ? "Paghi solo se lo specialista accetta il caso." : "Paghi solo quando il medico conferma l'orario."}
      </p>
    </div>
  );

  // Prestazione sospesa o senza medici: niente modulo, solo la prossima azione possibile.
  if (av.state !== "aperto") {
    return (
      <div className="space-y-6">
        {header}
        <div className="card p-6" data-disponibilita={av.state}>
          <p className="text-xl font-bold text-ink">{av.state === "sospeso" ? "Nuove richieste sospese" : av.state === "esaurito" ? "Fasce esaurite" : "Non disponibile ora"}</p>
          <p className="mt-2 text-[1.0625rem] text-ink-soft">{av.message}</p>
          <Link href={av.action.href} className="btn btn-primary mt-5">
            {av.action.label} <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
        {kind === "domicilio" ? <EmergencyNumbers /> : null}
      </div>
    );
  }

  function submit() {
    setError(null);
    const r = act((st, n) =>
      createRequest(
        st,
        {
          kind,
          patientId: DEMO_PATIENT.id,
          forWhom: { self, name: self ? "" : otherName, relation: self ? null : relation || null },
          phone,
          address: kind === "domicilio" ? { comune, cap, street, notes } : undefined,
          reason,
          specialtyId: kind === "parere" ? chosenSpecialty : null,
          documents: DEMO_DOCUMENTS.filter((d) => docs.includes(d.id)),
          start,
        },
        n,
      ),
    );
    if (r.ok) {
      router.push(`/prova/paziente/richieste/${r.id}`);
      return;
    }
    setError(ERRORS[r.error] ?? "Non è stato possibile inviare la richiesta.");
    if (r.error === "fascia-occupata") {
      setStart(null);
      setStep("fascia");
    }
  }

  const steps: Step[] = kind === "domicilio" ? ["zona", "fascia", "dati", "riepilogo"] : kind === "video" ? ["fascia", "dati", "riepilogo"] : ["dati", "riepilogo"];
  const n = steps.indexOf(step) + 1;
  const slots = freeSlots(s, kind, now, { cap: coverage ?? undefined }).map((x) => x.start);

  return (
    <div className="space-y-6">
      {header}
      <p ref={topRef} className="scroll-mt-28 text-[0.9375rem] font-semibold text-muted" aria-live="polite">
        Passo {n} di {steps.length}
      </p>
      {error ? <ErrorBox>{error}</ErrorBox> : null}

      {step === "zona" ? (
        <form
          className="card space-y-5 p-5 sm:p-7"
          onSubmit={(e) => {
            e.preventDefault();
            const c = checkCoverage(s, comune, cap);
            if (c.ok) {
              setCoverage(c.cap);
              setError(null);
              setStep("fascia");
            } else {
              setCoverage(null);
              setError(c.reason === "cap-non-valido" ? "Il CAP deve avere 5 cifre." : c.reason === "zona-sospesa" ? "La zona pilota è momentaneamente sospesa." : `Per ora andiamo a domicilio solo a ${s.coverage.label}.`);
            }
          }}
        >
          <h2 className="text-xl font-bold text-ink">Dove si svolge la visita?</h2>
          <p className="text-[1.0625rem] text-ink-soft">
            Zona coperta: <strong>{s.coverage.label}</strong>. In questa prova trovi già un indirizzo fittizio: puoi provare anche un CAP fuori zona, per esempio 20121.
          </p>
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <label className="block text-[1.0625rem] font-semibold text-ink">
              Comune
              <input value={comune} onChange={(e) => setComune(e.target.value)} required autoComplete="address-level2" className={inputCls} />
            </label>
            <label className="block text-[1.0625rem] font-semibold text-ink">
              CAP
              <input value={cap} onChange={(e) => setCap(e.target.value)} required inputMode="numeric" autoComplete="postal-code" maxLength={6} className={inputCls} />
            </label>
          </div>
          {error && !coverage ? (
            <p className="text-[1.0625rem] text-ink-soft">
              Intanto puoi parlare con un medico in video:{" "}
              <Link href={PRESTAZIONI.video.startHref} className="link font-semibold">
                prenota un videoconsulto
              </Link>
              .
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary w-full sm:w-auto">
            <MapPin aria-hidden className="h-4 w-4" /> Verifica la copertura
          </button>
          <EmergencyNumbers compact />
        </form>
      ) : null}

      {step === "fascia" ? (
        <div className="card space-y-5 p-5 sm:p-7">
          {slots.length ? (
            <SlotPicker legend={kind === "domicilio" ? "Scegli quando vuoi il medico a casa" : "Scegli quando vuoi parlare con il medico"} slots={slots} value={start} onChange={setStart} now={now} />
          ) : (
            <p className="text-[1.0625rem] text-ink-soft">Fasce esaurite nei prossimi giorni. {av.action.label}: <Link href={av.action.href} className="link">vai</Link>.</p>
          )}
          <p className="text-[0.9375rem] text-muted">La fascia che scegli è una richiesta: il medico la conferma o ne propone un&apos;altra. Vedi solo orari liberi davvero.</p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {kind === "domicilio" ? (
              <button type="button" className="btn btn-ghost" onClick={() => setStep("zona")}>
                Indietro
              </button>
            ) : null}
            <button type="button" className="btn btn-primary" disabled={!start} onClick={() => { setError(null); setStep("dati"); }}>
              Continua <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {step === "dati" ? (
        <form
          className="card space-y-5 p-5 sm:p-7"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            setStep("riepilogo");
          }}
        >
          {kind === "parere" ? (
            <fieldset>
              <legend className="text-lg font-semibold text-ink">Specialità</legend>
              <div className="mt-2 grid gap-2">
                {s.specialties.map((x) => {
                  const ok = openSpecialties.some((o) => o.id === x.id);
                  return (
                    <label key={x.id} className="check-row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink">
                      <input type="radio" name="specialita" value={x.id} disabled={!ok} required checked={chosenSpecialty === x.id} onChange={() => setSpecialtyId(x.id)} className="h-5 w-5" />
                      {x.name} {ok ? null : <span className="chip bg-cream text-warn">sospesa</span>}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ) : null}
          {kind !== "parere" ? (
            <fieldset>
              <legend className="text-lg font-semibold text-ink">Per chi è la {kind === "domicilio" ? "visita" : "richiesta"}?</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <label className="check-row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink">
                  <input type="radio" name="perchi" checked={self} onChange={() => setSelf(true)} className="h-5 w-5" /> Per me
                </label>
                <label className="check-row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink">
                  <input type="radio" name="perchi" checked={!self} onChange={() => setSelf(false)} className="h-5 w-5" /> Per un familiare
                </label>
              </div>
              {!self ? (
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <label className="block text-[1.0625rem] font-semibold text-ink">
                    Nome e cognome (di prova)
                    <input value={otherName} onChange={(e) => setOtherName(e.target.value)} required className={inputCls} placeholder="Anna Demo" />
                  </label>
                  <label className="block text-[1.0625rem] font-semibold text-ink">
                    Chi è per te
                    <input value={relation} onChange={(e) => setRelation(e.target.value)} className={inputCls} placeholder="madre, padre, coniuge…" />
                  </label>
                </div>
              ) : null}
            </fieldset>
          ) : null}
          {kind === "domicilio" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-[1.0625rem] font-semibold text-ink">
                Indirizzo ({comune} {coverage})
                <input value={street} onChange={(e) => setStreet(e.target.value)} required autoComplete="street-address" className={inputCls} />
              </label>
              <label className="block text-[1.0625rem] font-semibold text-ink">
                Indicazioni per arrivare
                <input value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} placeholder="citofono, piano, ascensore" />
              </label>
            </div>
          ) : null}
          <label className="block text-[1.0625rem] font-semibold text-ink">
            {kind === "parere" ? "Il tuo quesito, in una o due frasi" : "Di che cosa si tratta, in poche parole"}
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} required minLength={8} maxLength={400} rows={3} className={areaCls} placeholder={kind === "parere" ? "Esempio fittizio: mi è stata proposta una procedura, vorrei sapere se è indicata nel mio caso." : "Esempio fittizio: febbre da tre giorni, vorrei essere visitato a casa."} />
            <span className="mt-1 block text-sm font-normal text-muted">Solo ciò che serve al medico per organizzarsi. È una prova: non scrivere dati reali.</span>
          </label>
          {kind !== "domicilio" ? (
            <fieldset>
              <legend className="text-lg font-semibold text-ink">Documenti da condividere {kind === "video" ? "(facoltativo)" : ""}</legend>
              <p className="text-[0.9375rem] text-muted">Referti di esempio, fittizi. Li vede solo il medico assegnato.</p>
              <div className="mt-2 grid gap-2">
                {DEMO_DOCUMENTS.slice(0, 4).map((d) => (
                  <label key={d.id} className="check-row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink">
                    <input type="checkbox" checked={docs.includes(d.id)} onChange={(e) => setDocs(e.target.checked ? [...docs, d.id] : docs.filter((x) => x !== d.id))} className="h-5 w-5" />
                    {d.title}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          <label className="block text-[1.0625rem] font-semibold text-ink">
            Telefono per il medico
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" className={inputCls} />
            <span className="mt-1 block text-sm font-normal text-muted">Il medico lo vede solo a prestazione confermata.</span>
          </label>
          {kind === "domicilio" ? <EmergencyNumbers compact /> : null}
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {kind !== "parere" ? (
              <button type="button" className="btn btn-ghost" onClick={() => setStep("fascia")}>
                Indietro
              </button>
            ) : null}
            <button type="submit" className="btn btn-primary">
              Rivedi la richiesta <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </form>
      ) : null}

      {step === "riepilogo" ? (
        <div className="card space-y-5 p-5 sm:p-7">
          <h2 className="text-xl font-bold text-ink">Controlla e invia</h2>
          <dl className="grid gap-3 text-[1.0625rem]">
            <Row label="Prestazione" value={info.title} />
            {kind === "parere" ? <Row label="Specialità" value={specialtyName(s, chosenSpecialty)} /> : null}
            {start ? <Row label="Fascia richiesta" value={formatSlot(start, now)} /> : null}
            {kind === "domicilio" ? <Row label="Indirizzo" value={`${street}, ${cap} ${comune}`} /> : null}
            <Row label="Per" value={self ? `${DEMO_PATIENT.name} (tu)` : `${otherName}${relation ? `, ${relation}` : ""}`} />
            {docs.length ? <Row label="Documenti" value={DEMO_DOCUMENTS.filter((d) => docs.includes(d.id)).map((d) => d.title).join("; ")} /> : null}
            <Row label="Prezzo totale" value={<Price kind={kind} />} strong />
          </dl>
          <ul className="space-y-1 text-[1.0625rem] text-ink-soft">
            {info.includes.map((x) => (
              <li key={x} className="flex gap-2">
                <CheckCircle2 aria-hidden className="mt-1 h-4 w-4 shrink-0 text-teal" /> {x}
              </li>
            ))}
          </ul>
          <p className="rounded-xl bg-mist px-4 py-3 text-[1.0625rem] text-ink">
            {kind === "parere" ? "Lo specialista valuta se il caso è adatto. Se lo accetta vedi nome, orario, prezzo e tempi della sintesi prima di confermare; se no, nessun addebito." : "Ora non paghi nulla. Quando il medico risponde vedi nome, orario e prezzo, e confermi tu."}
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" className="btn btn-ghost" onClick={() => setStep("dati")}>
              Modifica
            </button>
            <button type="button" className="btn btn-primary" onClick={submit}>
              Invia la richiesta <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Row({ label, value, strong = false }: { label: string; value: React.ReactNode; strong?: boolean }) {
  return (
    <div className="grid gap-0.5 border-b border-line pb-2 sm:grid-cols-[12rem_1fr]">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "text-xl font-bold text-ink" : "text-ink"}>{value}</dd>
    </div>
  );
}

// ---------- Dettaglio della richiesta ----------

const CONFIRM_ERRORS: Record<string, string> = {
  "pagamento-fallito": "Il pagamento simulato non è riuscito. Nessun appuntamento creato e nessun addebito: puoi riprovare.",
  "fascia-occupata": "Nel frattempo la fascia è stata occupata. Nessun addebito: scegli una delle alternative qui sotto.",
  "proposta-scaduta": "La proposta è scaduta prima della conferma. Nessun addebito: scegli un'altra fascia.",
  "servizio-sospeso": "Il servizio è stato sospeso prima della conferma. Nessun addebito.",
  "medico-non-abilitato": "Il medico non è più disponibile. Nessun addebito: scegli un'alternativa.",
};

export function PatientRequest({ id }: { id: string }) {
  const s = usePrestazioni();
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [alt, setAlt] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);
  const [extra, setExtra] = useState<string[]>([]);
  const [note, setNote] = useState("");
  if (!s) return <Loading />;
  const now = new Date();
  const r = getRequest(s, id);
  if (!r || r.patientId !== DEMO_PATIENT.id) {
    return (
      <div className="card p-6">
        <p className="text-xl font-bold text-ink">Richiesta non trovata</p>
        <p className="mt-2 text-ink-soft">Forse la prova è stata ripristinata. Le richieste restano solo in questo browser.</p>
        <Link href="/prova/paziente" className="btn btn-primary mt-4">Le tue prestazioni</Link>
      </div>
    );
  }
  const info = PRESTAZIONI[r.kind];
  const doctor = getDoctor(s, r.doctorId);
  const doctorLabel = doctor ? `${doctor.name}${doctor.specialtyId ? `, ${specialtyName(s, doctor.specialtyId)}` : ", medicina generale"}` : null;

  const run = (fn: (st: PrestazioniState, n: Date) => { ok: boolean; error?: string; state: PrestazioniState }, ok?: string) => {
    const res = act(fn);
    setMessage(res.ok ? (ok ? { tone: "ok", text: ok } : null) : { tone: "error", text: CONFIRM_ERRORS[res.error ?? ""] ?? ERRORS[res.error ?? ""] ?? "Operazione non riuscita." });
    return res.ok;
  };

  const alternatives = r.status === "indisponibile" ? freeSlots(s, r.kind, now, { cap: r.address?.cap, exceptRequestId: r.id }).map((x) => x.start) : [];
  const ownSlots = r.doctorId && (r.status === "confermata" || r.status === "in_corso") ? doctorFreeSlots(s, r.doctorId, r.kind, now, r.id) : [];

  return (
    <div className="space-y-6" data-richiesta={r.id} data-stato={r.status}>
      <div>
        <Link href="/prova/paziente" className="link inline-flex min-h-11 items-center gap-1 font-semibold">
          <ArrowLeft aria-hidden className="h-4 w-4" /> Le tue prestazioni
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="display text-[1.75rem] sm:text-[2.25rem]">{info.title}</h1>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-[1.0625rem] text-ink-soft">
          <StatusBadge status={r.status} /> <span>Richiesta {r.code}</span>
          {r.kind === "parere" ? <span>· {specialtyName(s, r.specialtyId)}</span> : null}
          {!r.forWhom.self ? <span>· per {r.forWhom.name}{r.forWhom.relation ? ` (${r.forWhom.relation})` : ""}</span> : null}
        </p>
      </div>

      {message ? message.tone === "error" ? <ErrorBox>{message.text}</ErrorBox> : <p role="status" className="rounded-xl border border-teal/30 bg-marker-soft px-4 py-3 text-[1.0625rem] text-ink">{message.text}</p> : null}

      {r.status === "ricevuta" ? (
        <Panel title={r.kind === "parere" ? "Lo specialista sta valutando il tuo caso" : "In attesa della risposta del medico"}>
          <p>{r.kind === "parere" ? "Valuta se il quesito è adatto al percorso a distanza. Può accettarlo, chiederti altri documenti o indicarti un percorso in presenza." : `Hai chiesto ${formatSlot(r.requestedStart!, now)}. Il medico conferma la fascia o ne propone un'altra.`}</p>
          {r.notice ? <p className="mt-2 text-ink-soft">{r.notice}</p> : null}
          <TryAs role="medico" id={r.id} text="Per andare avanti nella prova, rispondi come medico." />
        </Panel>
      ) : null}

      {r.status === "documenti_richiesti" ? (
        <Panel title="Lo specialista chiede altri documenti" tone="warn">
          <p className="rounded-xl bg-paper px-4 py-3 text-ink">«{r.notice}»</p>
          <fieldset className="mt-4">
            <legend className="text-lg font-semibold text-ink">Aggiungi documenti di esempio</legend>
            <div className="mt-2 grid gap-2">
              {DEMO_DOCUMENTS.filter((d) => !r.documents.some((x) => x.id === d.id)).map((d) => (
                <label key={d.id} className="check-row flex min-h-12 items-center gap-3 rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink">
                  <input type="checkbox" checked={extra.includes(d.id)} onChange={(e) => setExtra(e.target.checked ? [...extra, d.id] : extra.filter((x) => x !== d.id))} className="h-5 w-5" />
                  {d.title}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="mt-4 block text-[1.0625rem] font-semibold text-ink">
            Una nota per lo specialista (facoltativa)
            <input value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} />
          </label>
          <button type="button" className="btn btn-primary mt-4" disabled={!extra.length} onClick={() => run((st, n) => addDocuments(st, r.id, DEMO_DOCUMENTS.filter((d) => extra.includes(d.id)), note, n), "Documenti inviati. Lo specialista riprende la stessa richiesta.") && setExtra([])}>
            Invia i documenti
          </button>
        </Panel>
      ) : null}

      {r.status === "proposta" && r.proposal ? (
        <Panel title={r.kind === "parere" ? "Lo specialista ha accettato il caso" : "Il medico ha risposto"} tone="warn">
          <dl className="grid gap-3 text-[1.0625rem]">
            <Row label={r.kind === "parere" ? "Specialista" : "Medico"} value={doctorLabel} />
            <Row label={r.kind === "domicilio" ? "Orario della visita" : "Orario del videoconsulto"} value={formatSlot(r.proposal.start, now)} />
            {r.address ? <Row label="Indirizzo" value={`${r.address.street}, ${r.address.cap} ${r.address.comune}`} /> : null}
            {r.kind === "parere" ? <Row label="Comprende" value="Esame della documentazione, videoconsulto, sintesi scritta" /> : null}
            {r.kind === "parere" && r.proposal.deliveryDays ? <Row label="Sintesi scritta" value={`entro ${r.proposal.deliveryDays} giorni lavorativi dal videoconsulto, come concordato con lo specialista`} /> : null}
            <Row label="Prezzo totale" value={<Price kind={r.kind} />} strong />
          </dl>
          <p className="mt-3 text-[0.9375rem] text-muted">Proposta valida fino a {formatSlot(r.proposal.expiresAt, now)}. Il pagamento è simulato: nessun addebito reale.</p>
          {r.payment.status === "fallito" ? <p className="mt-2 text-[0.9375rem] text-warn">Tentativo precedente non riuscito. Puoi riprovare: non si crea un secondo appuntamento.</p> : null}
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" className="btn btn-ghost" onClick={() => run((st, n) => rejectProposal(st, r.id, n))}>
              {r.kind === "parere" ? "Chiedi un altro orario" : "Non va bene, scegli un'altra fascia"}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => run((st, n) => confirmRequest(st, r.id, n), "Confermato. Trovi l'appuntamento qui e nell'elenco delle tue prestazioni.")}>
              <CalendarCheck2 aria-hidden className="h-4 w-4" /> Conferma e paga <Price kind={r.kind} />
            </button>
          </div>
        </Panel>
      ) : null}

      {r.status === "indisponibile" ? (
        <Panel title="Questa fascia non è più disponibile" tone="warn">
          {r.notice ? <p>{r.notice}</p> : null}
          {alternatives.length ? (
            <div className="mt-4 space-y-4">
              <SlotPicker legend="Alternative libere" slots={alternatives.slice(0, 8)} value={alt} onChange={setAlt} now={now} />
              <button type="button" className="btn btn-primary" disabled={!alt} onClick={() => run((st, n) => chooseAlternative(st, r.id, alt!, n), "Nuova fascia richiesta. Il medico la conferma o ne propone un'altra.") && setAlt(null)}>
                Richiedi questa fascia
              </button>
            </div>
          ) : (
            <p className="mt-3">
              Nessuna alternativa libera nei prossimi giorni.{" "}
              <Link href={availability(s, r.kind, now).action.href} className="link font-semibold">{availability(s, r.kind, now).action.label}</Link>
            </p>
          )}
        </Panel>
      ) : null}

      {r.status === "confermata" ? (
        <Panel title={r.kind === "domicilio" ? "Visita confermata" : "Appuntamento confermato"} tone="ok">
          <dl className="grid gap-3 text-[1.0625rem]">
            <Row label={r.kind === "parere" ? "Specialista" : "Medico"} value={doctorLabel} />
            <Row label="Quando" value={formatSlot(r.scheduledStart!, now)} />
            {r.address ? <Row label="Indirizzo" value={`${r.address.street}, ${r.address.cap} ${r.address.comune}`} /> : null}
            {r.kind === "parere" && r.deliveryDays ? <Row label="Sintesi scritta" value={`entro ${r.deliveryDays} giorni lavorativi dal videoconsulto`} /> : null}
            <Row label="Pagato (simulazione)" value={<Price kind={r.kind} cents={r.priceCents} />} />
          </dl>
          {r.kind !== "domicilio" ? (
            r.video.state === "attesa" ? (
              <div className="mt-5 rounded-2xl bg-strong p-5 text-on-strong" role="status">
                <p className="text-lg font-semibold">Sala d&apos;attesa (simulata)</p>
                <p className="mt-1 opacity-90">Il medico ti fa entrare all&apos;orario dell&apos;appuntamento. Nella prova, avvia il video dal ruolo Medico.</p>
                <TryAs role="medico" id={r.id} text="" dark />
              </div>
            ) : (
              <button type="button" className="btn btn-primary mt-5" onClick={() => run((st, n) => enterWaitingRoom(st, r.id, n))}>
                <Video aria-hidden className="h-4 w-4" /> Entra nella sala d&apos;attesa
              </button>
            )
          ) : (
            <p className="mt-4 text-ink-soft">Il medico ti chiama al numero indicato se serve. Puoi annullare fino all&apos;arrivo: rimborso simulato dell&apos;importo.</p>
          )}
          <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-4">
            {r.kind !== "domicilio" ? (
              <button type="button" className="btn btn-secondary" onClick={() => setMoving(!moving)} aria-expanded={moving}>
                Riprogramma
              </button>
            ) : null}
            <ConfirmButton className="btn btn-ghost" question="La fascia torna libera e l'importo viene rimborsato (simulazione)." yes="Sì, annulla" onConfirm={() => run((st, n) => cancelRequest(st, r.id, n), "Annullata. Rimborso simulato registrato.")}>
              Annulla
            </ConfirmButton>
          </div>
          {moving ? <Reschedule slots={ownSlots} now={now} onPick={(st) => run((x, n) => reschedule(x, r.id, st, n), "Appuntamento riprogrammato, senza nuovo addebito.") && setMoving(false)} /> : null}
        </Panel>
      ) : null}

      {r.status === "in_corso" ? (
        r.kind === "domicilio" ? (
          <Panel title="Il medico è da te" tone="ok">
            <p>La visita è in corso. Al termine il medico la segna come conclusa.</p>
          </Panel>
        ) : r.video.state === "problema" ? (
          <Panel title="Connessione interrotta" tone="warn">
            <p className="flex items-center gap-2"><WifiOff aria-hidden className="h-5 w-5" /> Succede: puoi ricollegarti o spostare l&apos;appuntamento senza costi.</p>
            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" className="btn btn-ghost" onClick={() => setMoving(!moving)}>Riprogramma</button>
              <button type="button" className="btn btn-primary" onClick={() => run((st, n) => reconnect(st, r.id, n))}>Riprova a collegarti</button>
            </div>
            {moving ? <Reschedule slots={ownSlots} now={now} onPick={(st) => run((x, n) => reschedule(x, r.id, st, n), "Appuntamento riprogrammato, senza nuovo addebito.") && setMoving(false)} /> : null}
          </Panel>
        ) : (
          <div className="rounded-[1.75rem] bg-strong p-6 text-on-strong" role="region" aria-label="Videoconsulto simulato">
            <p className="text-sm uppercase tracking-wide opacity-80">Video simulato · nessuna chiamata reale</p>
            <p className="mt-2 text-2xl font-bold">In collegamento con {doctor?.name}</p>
            <p className="mt-2 opacity-90">Il medico conclude il colloquio dal suo portale.</p>
            <button type="button" className="btn btn-on-strong mt-5" onClick={() => run((st, n) => connectionProblem(st, r.id, n))}>
              <WifiOff aria-hidden className="h-4 w-4" /> Simula un problema di connessione
            </button>
          </div>
        )
      ) : null}

      {r.status === "sintesi" ? (
        <Panel title="Videoconsulto concluso">
          <p>La sintesi scritta arriva qui {r.deliveryDays ? `entro ${r.deliveryDays} giorni lavorativi` : "nei tempi concordati"}.</p>
          <TryAs role="medico" id={r.id} text="Nella prova, consegna la sintesi dal ruolo Medico." />
        </Panel>
      ) : null}

      {r.status === "conclusa" ? (
        <Panel title="Prestazione conclusa" tone="ok">
          {r.summary ? (
            <article className="rounded-2xl border border-line bg-paper p-5" aria-label={r.kind === "parere" ? "Sintesi scritta dello specialista" : "Riepilogo del medico"}>
              <p className="chip bg-cream text-warn">Documento dimostrativo · non ha valore clinico</p>
              <h2 className="mt-3 text-xl font-bold text-ink">{r.kind === "parere" ? "Sintesi scritta dello specialista" : "Riepilogo del medico"}</h2>
              <p className="mt-1 text-[0.9375rem] text-muted">{doctorLabel} · {formatSlot(r.summary.at, now)}</p>
              <p className="mt-3 whitespace-pre-line text-[1.0625rem] text-ink">{r.summary.text}</p>
            </article>
          ) : (
            <p>Il medico ha segnato la prestazione come conclusa.</p>
          )}
          <p className="mt-3 text-[0.9375rem] text-muted">Pagato (simulazione): <Price kind={r.kind} cents={r.priceCents} />.</p>
        </Panel>
      ) : null}

      {r.status === "non_accettata" ? (
        <Panel title="Lo specialista non ha accettato il caso">
          <p>{r.notice}</p>
          <p className="mt-3 font-semibold text-ink">Nessun addebito.</p>
        </Panel>
      ) : null}

      {r.status === "annullata" ? (
        <Panel title="Richiesta annullata">
          <p>{r.payment.status === "rimborsato" ? "L'importo pagato è stato rimborsato (simulazione)." : "Nessun addebito."}</p>
        </Panel>
      ) : null}

      {["ricevuta", "documenti_richiesti", "proposta", "indisponibile"].includes(r.status) ? (
        <div>
          <ConfirmButton className="btn btn-ghost" question="Annullare la richiesta? Nessun addebito." yes="Sì, annulla" onConfirm={() => run((st, n) => cancelRequest(st, r.id, n), "Richiesta annullata. Nessun addebito.")}>
            Annulla la richiesta
          </ConfirmButton>
        </div>
      ) : null}

      {r.kind === "domicilio" ? <EmergencyNumbers compact /> : null}

      <details className="card p-5">
        <summary className="min-h-11 cursor-pointer text-lg font-semibold text-ink">Cronologia e comunicazioni (simulate)</summary>
        <ol className="mt-3 space-y-2 text-[0.9375rem] text-ink-soft">
          {r.history.map((h, i) => (
            <li key={i}>
              <span className="font-semibold text-ink">{formatSlot(h.at, now)}</span> · {h.actor}: {h.text}
            </li>
          ))}
        </ol>
        {r.documents.length ? <p className="mt-3 text-[0.9375rem] text-ink-soft">Documenti condivisi: {r.documents.map((d) => d.title).join("; ")}.</p> : null}
      </details>
    </div>
  );
}

function Reschedule({ slots, now, onPick }: { slots: string[]; now: Date; onPick: (start: string) => void }) {
  const [v, setV] = useState<string | null>(null);
  if (!slots.length) return <p className="mt-4 text-ink-soft">Nessun altro orario libero con lo stesso medico nei prossimi giorni.</p>;
  return (
    <div className="mt-4 space-y-3">
      <SlotPicker legend="Nuovo orario con lo stesso medico" slots={slots.slice(0, 8)} value={v} onChange={setV} now={now} />
      <button type="button" className="btn btn-primary" disabled={!v} onClick={() => v && onPick(v)}>
        Sposta l&apos;appuntamento
      </button>
    </div>
  );
}

function Panel({ title, tone, children }: { title: string; tone?: "ok" | "warn"; children: React.ReactNode }) {
  return (
    <section className={tone === "ok" ? "card border-teal/40 p-5 sm:p-7" : tone === "warn" ? "card border-warn/50 p-5 sm:p-7" : "card p-5 sm:p-7"} aria-label={title}>
      <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      <div className="mt-3 text-[1.0625rem] text-ink-soft">{children}</div>
    </section>
  );
}

/** Scorciatoia della prova verso l'altro ruolo, per seguire la stessa richiesta. */
export function TryAs({ role, id, text, dark = false }: { role: "medico" | "paziente"; id: string; text: string; dark?: boolean }) {
  return (
    <p className={dark ? "mt-3" : "mt-4 border-t border-dashed border-line pt-3 text-[0.9375rem] text-muted"}>
      {text}{" "}
      <Link href={`/prova/${role}/richieste/${id}`} className={dark ? "btn btn-on-strong btn-sm mt-2 min-h-11" : "link font-semibold"}>
        Apri come {role}
      </Link>
    </p>
  );
}

export { STATUS_LABEL };

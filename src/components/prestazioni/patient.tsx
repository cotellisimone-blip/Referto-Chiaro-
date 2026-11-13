"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarCheck2, CalendarX2, Check, CircleSlash, CircleX, Clock3, FilePlus2, FileText, FlaskConical, Home, type LucideIcon, MapPin, Printer, ShieldCheck, Stethoscope, Video, WifiOff } from "lucide-react";
import {
  DEMO_DOCUMENTS,
  DEMO_PATIENT,
  STATUS_LABEL,
  NEXT_STEPS,
  cancelTerms,
  demoDoctorStep,
  refundableNow,
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
import { usePatientPaths } from "./paths";
import { formatEuro } from "@/domain/offerta";
import { Stepper } from "@/components/report/stepper";
import { ConfirmButton, DemoNotice, EmergencyNumbers, ErrorBox, Loading, OkBox, Price, Row, SlotPicker, StatusBadge, ZoneWaitlist, formatSlot } from "./ui";

const ICON: Record<PrestazioneKind, LucideIcon> = { domicilio: Home, video: Video, parere: FileText };
/** Il colore del servizio, lo stesso delle pagine pubbliche: visita e video «con un medico», parere a parte. */
const TONE: Record<PrestazioneKind, string> = { domicilio: "tone-medico", video: "tone-medico", parere: "tone-parere" };

/** Scheda di una prestazione: tipo di visita, costo, disponibilità e azione successiva, a colpo d'occhio. */
export function PrestazioneCard({ s, kind, now, startHref }: { s: PrestazioniState; kind: PrestazioneKind; now: Date; startHref?: string }) {
  const info = PRESTAZIONI[kind];
  const av = availability(s, kind, now);
  const Icon = ICON[kind];
  const open = av.state === "aperto";
  return (
    <article className={clsx(TONE[kind], "card flex h-full flex-col p-6 sm:p-7")} data-prestazione={kind} data-disponibilita={av.state}>
      <div className="flex items-start gap-4">
        <span aria-hidden className="tile-ico tile-ico-tone">
          <Icon />
        </span>
        <div className="min-w-0">
          <h3 className="text-xl font-extrabold leading-snug tracking-tight text-ink">{info.title}</h3>
          <p className="meta mt-1">{info.mode}</p>
        </div>
      </div>
      <p className="mt-6 text-[2.25rem] font-extrabold leading-none tracking-tight text-ink">
        <Price kind={kind} />
      </p>
      <p className="meta mt-2">{info.durationLabel}, prezzo fisso</p>
      <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[1.0625rem] text-ink-soft">
        <span className={open ? "chip bg-marker-soft text-teal-deep" : "chip bg-cream text-warn"}>
          {open && av.today ? <span aria-hidden className="live-dot" /> : null}
          {open ? (av.today ? "Disponibile oggi" : "Disponibile") : av.state === "sospeso" ? "Sospesa" : av.state === "esaurito" ? "Fasce esaurite" : "Non disponibile"}
        </span>
        {av.next ? <span>prima fascia {formatSlot(av.next, now)}</span> : null}
      </p>
      {!open ? <p className="mt-3 text-base text-ink-soft">{av.message}</p> : null}
      <div className="mt-auto pt-6">
        <Link href={open ? (startHref ?? info.startHref) : av.action.href} className={clsx("btn btn-wrap w-full max-sm:px-4", open ? "btn-primary" : "btn-secondary")}>
          {open ? (kind === "domicilio" ? "Richiedi la visita" : kind === "video" ? "Prenota il videoconsulto" : "Richiedi il secondo parere") : av.action.label} <ArrowRight aria-hidden className="btn-arrow h-5 w-5 shrink-0" />
        </Link>
      </div>
    </article>
  );
}

export function PatientHome() {
  const s = usePrestazioni();
  const paths = usePatientPaths();
  if (!s) return <Loading />;
  const now = new Date();
  const mine = patientRequests(s, DEMO_PATIENT.id);
  const active = mine.filter((r) => ACTIVE_STATUSES.includes(r.status) || r.status === "indisponibile");
  const past = mine.filter((r) => !active.includes(r));
  return (
    <div className="space-y-10 sm:space-y-12">
      <header>
        <p className="eyebrow">{DEMO_PATIENT.name} · paziente di prova</p>
        <h1 className="area-title mt-3">Le tue richieste</h1>
        <p className="area-lead">Qui chiedi una visita a domicilio, un videoconsulto o un secondo parere e segui ogni richiesta, dalla risposta del medico al riepilogo scritto.</p>
      </header>
      {paths.roles ? <DemoNotice /> : null}
      {active.length ? (
        <section aria-labelledby="attive-titolo">
          <h2 id="attive-titolo" className="area-h2">In corso</h2>
          <RequestList items={active} s={s} now={now} />
        </section>
      ) : null}
      <section aria-labelledby="nuova-titolo">
        <h2 id="nuova-titolo" className="area-h2">Nuova richiesta</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {PRESTAZIONI_ORDER.map((k) => (
            <PrestazioneCard key={k} s={s} kind={k} now={now} startHref={paths.start(k)} />
          ))}
        </div>
      </section>
      {past.length ? (
        <section aria-labelledby="passate-titolo">
          <h2 id="passate-titolo" className="area-h2">Concluse e annullate</h2>
          <RequestList items={past} s={s} now={now} />
        </section>
      ) : null}
    </div>
  );
}

function RequestList({ items, s, now }: { items: BookingRequest[]; s: PrestazioniState; now: Date }) {
  const paths = usePatientPaths();
  return (
    <ul className="mt-5 grid gap-4 md:grid-cols-2">
      {items.map((r) => {
        const when = r.scheduledStart ?? r.proposal?.start ?? r.requestedStart;
        const Icon = ICON[r.kind];
        return (
          <li key={r.id} className={TONE[r.kind]}>
            <Link href={paths.request(r.id)} className="card card-lift flex h-full gap-4 p-5 sm:p-6">
              <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone">
                <Icon />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
                  <span className="text-lg font-bold leading-snug text-ink">{PRESTAZIONI[r.kind].short}{r.kind === "parere" ? ` · ${specialtyName(s, r.specialtyId)}` : ""}</span>
                  <StatusBadge status={r.status} />
                </span>
                <span className="meta">
                  {r.code}
                  {when ? ` · ${formatSlot(when, now)}` : ""}
                  {!r.forWhom.self ? ` · per ${r.forWhom.name}` : ""}
                </span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-base font-bold text-teal-deep">
                  Apri <ArrowRight aria-hidden className="h-4 w-4" />
                </span>
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
  const paths = usePatientPaths();
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
  const [outCap, setOutCap] = useState<string | null>(null);
  // Al cambio di passo (o a un nuovo errore) riporta in vista l'inizio del passo: su telefono la pagina resterebbe
  // scorsa in basso, con titolo e messaggio fuori schermo.
  const topRef = useRef<HTMLDivElement>(null);
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

  const Icon = ICON[kind];
  const payNote = kind === "parere" ? "Paghi solo se lo specialista accetta il caso." : "Paghi solo quando il medico conferma l'orario.";
  const header = (
    <header>
      <Link href={paths.roles ? paths.home : info.href} className="back-link">
        <ArrowLeft aria-hidden /> {paths.roles ? "Le tue richieste" : info.short}
      </Link>
      <h1 className="area-title mt-1">{info.title}</h1>
      <p className="area-lead">
        <strong className="text-ink">
          <Price kind={kind} />
        </strong>{" "}
        · {info.durationLabel}. {payNote}
      </p>
    </header>
  );

  // Prestazione sospesa o senza medici: niente modulo, solo la prossima azione possibile.
  if (av.state !== "aperto") {
    return (
      <div className="max-w-[46rem] space-y-6">
        {header}
        <div className="form-card" data-disponibilita={av.state}>
          <div className="form-card-head">
            <span aria-hidden className="tile-ico tile-ico-sm">
              <CalendarX2 />
            </span>
            <p className="form-card-title">{av.state === "sospeso" ? "Nuove richieste sospese" : av.state === "esaurito" ? "Fasce esaurite" : "Non disponibile ora"}</p>
          </div>
          <p className="form-card-body">{av.message}</p>
          <Link href={av.action.href} className="btn btn-primary btn-wrap mt-6 max-sm:w-full">
            {av.action.label} <ArrowRight aria-hidden className="btn-arrow h-5 w-5 shrink-0" />
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
      router.push(paths.request(r.id));
      return;
    }
    setError(ERRORS[r.error] ?? "Non è stato possibile inviare la richiesta.");
    if (r.error === "fascia-occupata") {
      setStart(null);
      setStep("fascia");
    }
  }

  const steps: Step[] = kind === "domicilio" ? ["zona", "fascia", "dati", "riepilogo"] : kind === "video" ? ["fascia", "dati", "riepilogo"] : ["dati", "riepilogo"];
  const stepNames: Record<Step, string> = { zona: "Zona", fascia: "Orario", dati: kind === "parere" ? "Quesito" : "Dati", riepilogo: "Riepilogo" };
  const n = steps.indexOf(step) + 1;
  const slots = freeSlots(s, kind, now, { cap: coverage ?? undefined }).map((x) => x.start);

  return (
    <div className="space-y-6 sm:space-y-8">
      {header}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:items-start lg:gap-10">
        <div className="min-w-0 space-y-5">
          <div ref={topRef} className="scroll-mt-28">
            <Stepper steps={steps.map((x) => stepNames[x])} step={n - 1} label="Passi della richiesta" />
            <p className="sr-only" aria-live="polite">
              Passo {n} di {steps.length}: {stepNames[step]}
            </p>
          </div>
          {error ? <ErrorBox>{error}</ErrorBox> : null}

          {step === "zona" ? (
            <form
              className="form-card space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                const c = checkCoverage(s, comune, cap);
                if (c.ok) {
                  setCoverage(c.cap);
                  setError(null);
                  setOutCap(null);
                  setStep("fascia");
                } else {
                  setCoverage(null);
                  setOutCap(c.reason === "fuori-zona" && /^\d{5}$/.test(cap.trim()) ? cap.trim() : null);
                  setError(c.reason === "cap-non-valido" ? "Il CAP deve avere 5 cifre." : c.reason === "zona-sospesa" ? "La zona pilota è momentaneamente sospesa." : `Per ora andiamo a domicilio solo a ${s.coverage.label}.`);
                }
              }}
            >
              <div>
                <h2 className="form-card-title">Dove si svolge la visita?</h2>
                <p className="form-card-text">
                  Per ora arriviamo a <strong className="text-ink">{s.coverage.label}</strong>.
                </p>
              </div>
              <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-3 sm:gap-4">
                <label className="field-label">
                  Comune
                  <input value={comune} onChange={(e) => setComune(e.target.value)} required autoComplete="address-level2" className="field-input" />
                </label>
                <label className="field-label">
                  CAP
                  <input value={cap} onChange={(e) => setCap(e.target.value)} required inputMode="numeric" autoComplete="postal-code" maxLength={6} className="field-input" />
                </label>
              </div>
              {error && !coverage ? (
                <p className="text-[1.0625rem] text-ink-soft">
                  Intanto puoi parlare con un medico in video:{" "}
                  <Link href={paths.start("video")} className="link font-bold">
                    prenota un videoconsulto
                  </Link>
                  .
                </p>
              ) : null}
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                <MapPin aria-hidden className="h-5 w-5" /> Verifica la copertura
              </button>
              <EmergencyNumbers compact />
            </form>
          ) : null}
          {step === "zona" && outCap ? (
            <div className="form-card">
              <ZoneWaitlist cap={outCap} />
            </div>
          ) : null}

          {step === "fascia" ? (
            <div className="form-card space-y-6">
              {slots.length ? (
                <SlotPicker big legend={kind === "domicilio" ? "Scegli quando vuoi il medico a casa" : "Scegli quando vuoi parlare con il medico"} slots={slots} value={start} onChange={setStart} now={now} />
              ) : (
                <p className="text-[1.0625rem] text-ink-soft">
                  Fasce esaurite nei prossimi giorni. {av.action.label}:{" "}
                  <Link href={av.action.href} className="link font-bold">
                    vai
                  </Link>
                  .
                </p>
              )}
              <p className="field-hint">La fascia che scegli è una richiesta: il medico la conferma o ne propone un&apos;altra. Vedi solo orari liberi davvero.</p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                {kind === "domicilio" ? (
                  <button type="button" className="btn btn-ghost" onClick={() => setStep("zona")}>
                    Indietro
                  </button>
                ) : null}
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!start}
                  onClick={() => {
                    setError(null);
                    setStep("dati");
                  }}
                >
                  Continua <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </button>
              </div>
            </div>
          ) : null}

          {step === "dati" ? (
            <form
              className="form-card space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);
                setStep("riepilogo");
              }}
            >
              <h2 className="form-card-title">{kind === "parere" ? "Il tuo quesito e i documenti" : kind === "domicilio" ? "Chi visitiamo e perché" : "Per chi è e di che cosa si tratta"}</h2>
              {kind === "parere" ? (
                <fieldset>
                  <legend className="area-h3">Specialità</legend>
                  <div className="mt-3 grid gap-2.5">
                    {s.specialties.map((x) => {
                      const ok = openSpecialties.some((o) => o.id === x.id);
                      return (
                        <label key={x.id} className="option-row">
                          <input type="radio" name="specialita" value={x.id} disabled={!ok} required checked={chosenSpecialty === x.id} onChange={() => setSpecialtyId(x.id)} />
                          {x.name} {ok ? null : <span className="chip bg-cream text-warn">sospesa</span>}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ) : null}
              {kind !== "parere" ? (
                <fieldset>
                  <legend className="area-h3">Per chi è la {kind === "domicilio" ? "visita" : "richiesta"}?</legend>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    <label className="option-row">
                      <input type="radio" name="perchi" checked={self} onChange={() => setSelf(true)} /> Per me
                    </label>
                    <label className="option-row">
                      <input type="radio" name="perchi" checked={!self} onChange={() => setSelf(false)} /> Per un familiare
                    </label>
                  </div>
                  {!self ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <label className="field-label">
                        Nome e cognome (di prova)
                        <input value={otherName} onChange={(e) => setOtherName(e.target.value)} required className="field-input" placeholder="Anna Demo" />
                      </label>
                      <label className="field-label">
                        Chi è per te
                        <input value={relation} onChange={(e) => setRelation(e.target.value)} className="field-input" placeholder="madre, padre, coniuge…" />
                      </label>
                    </div>
                  ) : null}
                </fieldset>
              ) : null}
              {kind === "domicilio" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="field-label">
                    Indirizzo ({comune} {coverage})
                    <input value={street} onChange={(e) => setStreet(e.target.value)} required autoComplete="street-address" className="field-input" />
                  </label>
                  <label className="field-label">
                    Indicazioni per arrivare
                    <input value={notes} onChange={(e) => setNotes(e.target.value)} className="field-input" placeholder="citofono, piano, ascensore" />
                  </label>
                </div>
              ) : null}
              <label className="field-label">
                {kind === "parere" ? "Il tuo quesito, in una o due frasi" : "Di che cosa si tratta, in poche parole"}
                <textarea value={reason} onChange={(e) => setReason(e.target.value)} required minLength={8} maxLength={400} rows={3} className="field-input" placeholder={kind === "parere" ? "Esempio fittizio: mi è stata proposta una procedura, vorrei sapere se è indicata nel mio caso." : "Esempio fittizio: febbre da tre giorni, vorrei essere visitato a casa."} />
                <span className="field-hint block font-normal">Solo ciò che serve al medico per organizzarsi. È una prova: non scrivere dati reali.</span>
              </label>
              {kind !== "domicilio" ? (
                <fieldset>
                  <legend className="area-h3">Documenti da condividere {kind === "video" ? "(facoltativo)" : ""}</legend>
                  <p className="field-hint">Referti di esempio, fittizi. Li vede solo il medico assegnato.</p>
                  <div className="mt-3 grid gap-2.5">
                    {DEMO_DOCUMENTS.slice(0, 4).map((d) => (
                      <label key={d.id} className="option-row">
                        <input type="checkbox" checked={docs.includes(d.id)} onChange={(e) => setDocs(e.target.checked ? [...docs, d.id] : docs.filter((x) => x !== d.id))} />
                        {d.title}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}
              <label className="field-label">
                Telefono per il medico
                <input value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" className="field-input" />
                <span className="field-hint block font-normal">Il medico lo vede solo a prestazione confermata.</span>
              </label>
              {kind === "domicilio" ? <EmergencyNumbers compact /> : null}
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                {kind !== "parere" ? (
                  <button type="button" className="btn btn-ghost" onClick={() => setStep("fascia")}>
                    Indietro
                  </button>
                ) : null}
                <button type="submit" className="btn btn-primary">
                  Rivedi la richiesta <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </button>
              </div>
            </form>
          ) : null}

          {step === "riepilogo" ? (
            <div className="form-card space-y-6">
              <h2 className="form-card-title">Controlla e invia</h2>
              <dl className="kv-rows">
                <Row label="Prestazione" value={info.title} />
                {kind === "parere" ? <Row label="Specialità" value={specialtyName(s, chosenSpecialty)} /> : null}
                {start ? <Row label="Fascia richiesta" value={formatSlot(start, now)} /> : null}
                {kind === "domicilio" ? <Row label="Indirizzo" value={`${street}, ${cap} ${comune}`} /> : null}
                <Row label="Per" value={self ? `${DEMO_PATIENT.name} (tu)` : `${otherName}${relation ? `, ${relation}` : ""}`} />
                {docs.length ? <Row label="Documenti" value={DEMO_DOCUMENTS.filter((d) => docs.includes(d.id)).map((d) => d.title).join("; ")} /> : null}
                <Row label="Prezzo totale" value={<Price kind={kind} />} strong />
              </dl>
              <ul className={clsx(TONE[kind], "check-list mt-0 text-[1.0625rem] lg:hidden")}>
                {info.includes.map((x) => (
                  <li key={x}>
                    <span aria-hidden className="check-dot">
                      <Check />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <p className="field-ok text-ink">
                {kind === "parere" ? "Lo specialista valuta se il caso è adatto. Se lo accetta vedi nome, orario, prezzo e tempi della sintesi prima di confermare; se no, nessun addebito." : "Ora non paghi nulla. Quando il medico risponde vedi nome, orario e prezzo, e confermi tu."}
              </p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button type="button" className="btn btn-ghost" onClick={() => setStep("dati")}>
                  Modifica
                </button>
                <button type="button" className="btn btn-primary" onClick={submit}>
                  Invia la richiesta <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* La prestazione in breve: accanto al modulo su computer, sotto su telefono (nel riepilogo è già dentro la scheda). */}
        <aside className={clsx(TONE[kind], "side-card lg:sticky lg:top-28", step === "riepilogo" && "max-lg:hidden")} aria-label="La prestazione in breve">
          <div className="flex items-center gap-3.5">
            <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone">
              <Icon />
            </span>
            <div className="min-w-0">
              <p className="side-card-title">{info.short}</p>
              <p className="meta">
                <Price kind={kind} /> · prezzo fisso
              </p>
            </div>
          </div>
          <p className="area-h3 mt-5">Che cosa comprende</p>
          <ul className="check-list mt-3 text-[1.0625rem] sm:text-[1.0625rem]">
            {info.includes.map((x) => (
              <li key={x}>
                <span aria-hidden className="check-dot">
                  <Check />
                </span>
                {x}
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-start gap-2.5 border-t border-line pt-4 text-base text-ink-soft">
            <ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-teal" /> {payNote}
          </p>
        </aside>
      </div>
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
  const paths = usePatientPaths();
  if (!s) return <Loading />;
  const now = new Date();
  const r = getRequest(s, id);
  if (!r || r.patientId !== DEMO_PATIENT.id) {
    return (
      <div className="form-card max-w-[46rem]">
        <p className="form-card-title">Richiesta non trovata</p>
        <p className="form-card-text">Forse la prova è stata ripristinata. Le richieste restano solo in questo browser.</p>
        <Link href={paths.home} className="btn btn-primary mt-6">
          Le tue richieste
        </Link>
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

  const moveIt = <Reschedule slots={ownSlots} now={now} onPick={(st) => run((x, n) => reschedule(x, r.id, st, n), "Appuntamento riprogrammato, senza nuovo addebito.") && setMoving(false)} />;

  return (
    <div className="space-y-6 sm:space-y-8" data-richiesta={r.id} data-stato={r.status}>
      <header>
        <Link href={paths.home} className="back-link">
          <ArrowLeft aria-hidden /> Le tue richieste
        </Link>
        <h1 className="area-title mt-1">{info.title}</h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[1.0625rem] text-ink-soft">
          <StatusBadge status={r.status} /> <span>Richiesta {r.code}</span>
          {r.kind === "parere" ? <span>· {specialtyName(s, r.specialtyId)}</span> : null}
          {!r.forWhom.self ? <span>· per {r.forWhom.name}{r.forWhom.relation ? ` (${r.forWhom.relation})` : ""}</span> : null}
        </p>
      </header>

      <Progress r={r} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:items-start lg:gap-10">
        <div className="min-w-0 space-y-6">
          {message ? message.tone === "error" ? <ErrorBox>{message.text}</ErrorBox> : <OkBox>{message.text}</OkBox> : null}

          {r.status === "ricevuta" ? (
            <Panel icon={Clock3} title={r.kind === "parere" ? "Lo specialista sta valutando il tuo caso" : "In attesa della risposta del medico"}>
              <p>{r.kind === "parere" ? "Valuta se il quesito è adatto al percorso a distanza. Può accettarlo, chiederti altri documenti o indicarti un percorso in presenza." : `Hai chiesto ${formatSlot(r.requestedStart!, now)}. Il medico conferma la fascia o ne propone un'altra.`}</p>
              {r.notice ? <p className="mt-2">{r.notice}</p> : null}
              <DemoDoctor id={r.id} label={r.kind === "parere" ? "Fai rispondere lo specialista" : "Fai rispondere il medico"} run={run} />
            </Panel>
          ) : null}

          {r.status === "documenti_richiesti" ? (
            <Panel icon={FilePlus2} title="Lo specialista chiede altri documenti" tone="warn">
              <p className="rounded-2xl bg-paper px-4 py-3 font-semibold text-ink">«{r.notice}»</p>
              <fieldset className="mt-5">
                <legend className="area-h3">Aggiungi documenti di esempio</legend>
                <div className="mt-3 grid gap-2.5">
                  {DEMO_DOCUMENTS.filter((d) => !r.documents.some((x) => x.id === d.id)).map((d) => (
                    <label key={d.id} className="option-row">
                      <input type="checkbox" checked={extra.includes(d.id)} onChange={(e) => setExtra(e.target.checked ? [...extra, d.id] : extra.filter((x) => x !== d.id))} />
                      {d.title}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="field-label mt-5">
                Una nota per lo specialista (facoltativa)
                <input value={note} onChange={(e) => setNote(e.target.value)} className="field-input" />
              </label>
              <button type="button" className="btn btn-primary mt-5 max-sm:w-full" disabled={!extra.length} onClick={() => run((st, n) => addDocuments(st, r.id, DEMO_DOCUMENTS.filter((d) => extra.includes(d.id)), note, n), "Documenti inviati. Lo specialista riprende la stessa richiesta.") && setExtra([])}>
                Invia i documenti
              </button>
            </Panel>
          ) : null}

          {r.status === "proposta" && r.proposal ? (
            <Panel icon={CalendarCheck2} title={r.kind === "parere" ? "Lo specialista ha accettato il caso" : "Il medico ha risposto"} tone="warn">
              <dl className="kv-rows">
                <Row label={r.kind === "parere" ? "Specialista" : "Medico"} value={doctorLabel} />
                <Row label={r.kind === "domicilio" ? "Orario della visita" : "Orario del videoconsulto"} value={formatSlot(r.proposal.start, now)} />
                {r.address ? <Row label="Indirizzo" value={`${r.address.street}, ${r.address.cap} ${r.address.comune}`} /> : null}
                {r.kind === "parere" ? <Row label="Comprende" value="Esame della documentazione, videoconsulto, sintesi scritta" /> : null}
                {r.kind === "parere" && r.proposal.deliveryDays ? <Row label="Sintesi scritta" value={`entro ${r.proposal.deliveryDays} giorni lavorativi dal videoconsulto, come concordato con lo specialista`} /> : null}
                <Row label="Prezzo totale" value={<Price kind={r.kind} />} strong />
              </dl>
              <p className="meta mt-5">Proposta valida fino a {formatSlot(r.proposal.expiresAt, now)}. Il pagamento è simulato: nessun addebito reale.</p>
              <p className="mt-2 text-base" data-annullamento>
                {cancelTerms(r.kind)}
              </p>
              {r.payment.status === "fallito" ? <p className="mt-2 text-base font-semibold text-warn">Tentativo precedente non riuscito. Puoi riprovare: non si crea un secondo appuntamento.</p> : null}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" className="btn btn-ghost btn-wrap" onClick={() => run((st, n) => rejectProposal(st, r.id, n))}>
                  {r.kind === "parere" ? "Chiedi un altro orario" : "Non va bene, scegli un'altra fascia"}
                </button>
                <button type="button" className="btn btn-primary btn-lg" onClick={() => run((st, n) => confirmRequest(st, r.id, n), "Confermato. Trovi l'appuntamento qui e nell'elenco delle tue prestazioni.")}>
                  <CalendarCheck2 aria-hidden className="h-5 w-5 shrink-0" />
                  <span>
                    Conferma e paga <Price kind={r.kind} />
                  </span>
                </button>
              </div>
            </Panel>
          ) : null}

          {r.status === "indisponibile" ? (
            <Panel icon={CalendarX2} title="Questa fascia non è più disponibile" tone="warn">
              {r.notice ? <p>{r.notice}</p> : null}
              {alternatives.length ? (
                <div className="mt-5 space-y-5">
                  <SlotPicker legend="Alternative libere" slots={alternatives.slice(0, 8)} value={alt} onChange={setAlt} now={now} />
                  <button type="button" className="btn btn-primary max-sm:w-full" disabled={!alt} onClick={() => run((st, n) => chooseAlternative(st, r.id, alt!, n), "Nuova fascia richiesta. Il medico la conferma o ne propone un'altra.") && setAlt(null)}>
                    Richiedi questa fascia
                  </button>
                </div>
              ) : (
                <p className="mt-3">
                  Nessuna alternativa libera nei prossimi giorni.{" "}
                  <Link href={availability(s, r.kind, now).action.href} className="link font-bold">
                    {availability(s, r.kind, now).action.label}
                  </Link>
                </p>
              )}
            </Panel>
          ) : null}

          {r.status === "confermata" ? (
            <Panel icon={BadgeCheck} title={r.kind === "domicilio" ? "Visita confermata" : "Appuntamento confermato"} tone="ok">
              <dl className="kv-rows">
                <Row label={r.kind === "parere" ? "Specialista" : "Medico"} value={doctorLabel} />
                <Row label="Quando" value={formatSlot(r.scheduledStart!, now)} />
                {r.address ? <Row label="Indirizzo" value={`${r.address.street}, ${r.address.cap} ${r.address.comune}`} /> : null}
                {r.kind === "parere" && r.deliveryDays ? <Row label="Sintesi scritta" value={`entro ${r.deliveryDays} giorni lavorativi dal videoconsulto`} /> : null}
                <Row label="Pagato (simulazione)" value={<Price kind={r.kind} cents={r.priceCents} />} />
              </dl>
              {r.kind !== "domicilio" ? (
                r.video.state === "attesa" ? (
                  <div className="video-room mt-6" role="status">
                    <p className="video-room-kicker">
                      <span aria-hidden className="live-dot" /> Sei in attesa
                    </p>
                    <p className="video-room-title">Sala d&apos;attesa (simulata)</p>
                    <p className="video-room-text">Il medico ti fa entrare all&apos;orario dell&apos;appuntamento.</p>
                    <DemoDoctor id={r.id} label="Fai entrare il medico" run={run} dark />
                  </div>
                ) : (
                  <button type="button" className="btn btn-primary btn-lg mt-6 max-sm:w-full" onClick={() => run((st, n) => enterWaitingRoom(st, r.id, n))}>
                    <Video aria-hidden className="h-5 w-5 shrink-0" /> Entra nella sala d&apos;attesa
                  </button>
                )
              ) : (
                <>
                  <p className="mt-5">Il medico ti chiama al numero indicato se serve.</p>
                  <DemoDoctor id={r.id} label="Fai arrivare il medico" run={run} />
                </>
              )}
              <p className="mt-5 text-base" data-annullamento>
                {cancelTerms(r.kind)}
              </p>
              <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-5">
                {r.kind !== "domicilio" ? (
                  <button type="button" className="btn btn-secondary" onClick={() => setMoving(!moving)} aria-expanded={moving}>
                    Riprogramma
                  </button>
                ) : null}
                <ConfirmButton
                  className="btn btn-ghost"
                  question={refundableNow(r, now) ? "La fascia torna libera e l'importo viene rimborsato per intero (simulazione)." : "Sei oltre il termine: la fascia torna libera ma l'importo non viene rimborsato."}
                  yes="Sì, annulla"
                  onConfirm={() => {
                    const refund = refundableNow(r, now);
                    run((st, n) => cancelRequest(st, r.id, n), refund ? "Annullata. Rimborso simulato registrato." : "Annullata oltre il termine: importo non rimborsato.");
                  }}
                >
                  Annulla
                </ConfirmButton>
              </div>
              {moving ? moveIt : null}
            </Panel>
          ) : null}

          {r.status === "in_corso" ? (
            r.kind === "domicilio" ? (
              <Panel icon={Stethoscope} title="Il medico è da te" tone="ok">
                <p>La visita è in corso. Al termine il medico ti lascia qui un riepilogo scritto.</p>
                <DemoDoctor id={r.id} label="Concludi la visita" run={run} />
              </Panel>
            ) : r.video.state === "problema" ? (
              <Panel icon={WifiOff} title="Connessione interrotta" tone="warn">
                <p>Succede: puoi ricollegarti o spostare l&apos;appuntamento senza costi.</p>
                <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row">
                  <button type="button" className="btn btn-ghost" onClick={() => setMoving(!moving)}>
                    Riprogramma
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => run((st, n) => reconnect(st, r.id, n))}>
                    Riprova a collegarti
                  </button>
                </div>
                {moving ? moveIt : null}
              </Panel>
            ) : (
              <div className="video-room" role="region" aria-label="Videoconsulto simulato">
                <p className="video-room-kicker">
                  <span aria-hidden className="live-dot" /> Video simulato · nessuna chiamata reale
                </p>
                <p className="video-room-title">In collegamento con {doctor?.name}</p>
                <p className="video-room-text">Al termine il medico ti lascia qui {r.kind === "parere" ? "la sintesi scritta, nei tempi concordati" : "un riepilogo scritto"}.</p>
                <button type="button" className="btn btn-on-strong btn-wrap mt-6 max-sm:w-full max-sm:px-4" onClick={() => run((st, n) => connectionProblem(st, r.id, n))}>
                  <WifiOff aria-hidden className="h-5 w-5 shrink-0" /> Simula un problema di connessione
                </button>
                <DemoDoctor id={r.id} label="Concludi il videoconsulto" run={run} dark />
              </div>
            )
          ) : null}

          {r.status === "sintesi" ? (
            <Panel icon={FileText} title="Videoconsulto concluso">
              <p>La sintesi scritta arriva qui {r.deliveryDays ? `entro ${r.deliveryDays} giorni lavorativi` : "nei tempi concordati"}.</p>
              <DemoDoctor id={r.id} label="Fai consegnare la sintesi" run={run} />
            </Panel>
          ) : null}

          {r.status === "conclusa" ? <Outcome r={r} doctorLabel={doctorLabel} now={now} /> : null}

          {r.status === "non_accettata" ? (
            <Panel icon={CircleSlash} title="Lo specialista non ha accettato il caso">
              <p>{r.notice}</p>
              <p className="mt-3 font-bold text-ink">Nessun addebito.</p>
            </Panel>
          ) : null}

          {r.status === "annullata" ? (
            <Panel icon={CircleX} title="Richiesta annullata">
              <p>{r.payment.status === "rimborsato" ? "L'importo pagato è stato rimborsato per intero (simulazione)." : r.payment.status === "pagato" ? "Annullata oltre il termine: l'importo non è stato rimborsato (simulazione)." : "Nessun addebito."}</p>
              <Link href={paths.start(r.kind)} className="btn btn-secondary mt-5 max-sm:w-full">
                Fai una nuova richiesta <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
            </Panel>
          ) : null}

          {["ricevuta", "documenti_richiesti", "proposta", "indisponibile"].includes(r.status) ? (
            <div>
              <ConfirmButton className="btn btn-ghost" question="Annullare la richiesta? Nessun addebito." yes="Sì, annulla" onConfirm={() => run((st, n) => cancelRequest(st, r.id, n), "Richiesta annullata. Nessun addebito.")}>
                Annulla la richiesta
              </ConfirmButton>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 print:hidden">
          <section className="side-card" aria-labelledby="cronologia-titolo">
            <h2 id="cronologia-titolo" className="side-card-title">
              Cronologia e comunicazioni (simulate)
            </h2>
            <ol className="timeline mt-4">
              {r.history.map((h, i) => (
                <li key={i}>
                  <span className="timeline-when">{formatSlot(h.at, now)}</span>
                  {h.actor}: {h.text}
                </li>
              ))}
            </ol>
            {r.documents.length ? <p className="mt-4 border-t border-line pt-4 text-base text-ink-soft">Documenti condivisi: {r.documents.map((d) => d.title).join("; ")}.</p> : null}
          </section>
          {r.kind === "domicilio" ? <EmergencyNumbers compact /> : null}
        </aside>
      </div>
    </div>
  );
}

function Reschedule({ slots, now, onPick }: { slots: string[]; now: Date; onPick: (start: string) => void }) {
  const [v, setV] = useState<string | null>(null);
  if (!slots.length) return <p className="mt-5">Nessun altro orario libero con lo stesso medico nei prossimi giorni.</p>;
  return (
    <div className="mt-5 space-y-4">
      <SlotPicker legend="Nuovo orario con lo stesso medico" slots={slots.slice(0, 8)} value={v} onChange={setV} now={now} />
      <button type="button" className="btn btn-primary max-sm:w-full" disabled={!v} onClick={() => v && onPick(v)}>
        Sposta l&apos;appuntamento
      </button>
    </div>
  );
}

/** Lo stato della richiesta: una scheda sola, con il tono di ciò che chiede (aspettare, decidere, è confermato). */
function Panel({ title, tone, icon: Icon, children }: { title: string; tone?: "ok" | "warn"; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <section className={clsx("form-card", tone === "ok" && "form-card-accent", tone === "warn" && "form-card-warn")} aria-label={title}>
      <div className="form-card-head">
        <span aria-hidden className="tile-ico tile-ico-sm">
          <Icon />
        </span>
        <h2 className="form-card-title">{title}</h2>
      </div>
      <div className="form-card-body">{children}</div>
    </section>
  );
}

/** Scorciatoia della prova a tre ruoli verso l'altro ruolo, per seguire la stessa richiesta. */
export function TryAs({ role, id, text, dark = false }: { role: "medico" | "paziente"; id: string; text: string; dark?: boolean }) {
  return (
    <p className={dark ? "mt-5" : "mt-5 border-t border-dashed border-line pt-4 text-base text-ink-soft"}>
      {text}{" "}
      <Link href={`/prova/${role}/richieste/${id}`} className={dark ? "btn btn-on-strong btn-sm" : "link font-bold"}>
        Apri come {role}
      </Link>
    </p>
  );
}

type Run = (fn: (st: PrestazioniState, n: Date) => { ok: boolean; error?: string; state: PrestazioniState }, ok?: string) => boolean;

/**
 * Nella prova non c'è un medico vero. Nel percorso del paziente un solo comando, dichiarato come simulazione,
 * fa compiere al medico il passo successivo; nella prova a tre ruoli resta la scorciatoia verso il ruolo Medico.
 */
function DemoDoctor({ id, label, run, dark = false }: { id: string; label: string; run: Run; dark?: boolean }) {
  const paths = usePatientPaths();
  if (paths.roles) return <TryAs role="medico" id={id} text={dark ? "" : "Per andare avanti nella prova, agisci come medico."} dark={dark} />;
  return (
    <div className={clsx("sim-box", dark && "sim-box-dark")} data-simulazione>
      <p className="sim-box-note">
        <FlaskConical aria-hidden /> Prova dimostrativa: qui non c&apos;è un medico vero.
      </p>
      <button type="button" className={clsx("btn btn-sm btn-wrap mt-3 max-sm:w-full", dark ? "btn-on-strong" : "btn-secondary")} onClick={() => run((st, n) => demoDoctorStep(st, id, n))}>
        {label} (simulazione)
      </button>
    </div>
  );
}

const PROGRESS: Record<"visita" | "parere", string[]> = {
  visita: ["Richiesta inviata", "Il medico risponde", "Confermi e paghi", "Visita", "Riepilogo scritto"],
  parere: ["Richiesta inviata", "Lo specialista valuta", "Confermi e paghi", "Videoconsulto", "Sintesi scritta"],
};

/** «Che cosa succede ora»: gli stessi pallini del modulo di richiesta, con il passo in cui sei. */
function Progress({ r }: { r: BookingRequest }) {
  const steps = PROGRESS[r.kind === "parere" ? "parere" : "visita"].map((x, i) => (i === 3 && r.kind === "video" ? "Videoconsulto" : x));
  const at: Partial<Record<BookingRequest["status"], number>> = { ricevuta: 1, documenti_richiesti: 1, proposta: 2, indisponibile: 2, confermata: 3, in_corso: 3, sintesi: 4, conclusa: 5 };
  const i = at[r.status];
  if (i === undefined) return null;
  return (
    <div data-percorso={i}>
      <Stepper steps={steps} step={i} label="Che cosa succede ora" />
    </div>
  );
}

/** Che cosa resta al paziente: riepilogo o sintesi, prossimo passo con un'azione concreta, ricevuta dimostrativa. */
function Outcome({ r, doctorLabel, now }: { r: BookingRequest; doctorLabel: string | null; now: Date }) {
  const paths = usePatientPaths();
  const title = r.kind === "parere" ? "Sintesi scritta dello specialista" : "Riepilogo del medico";
  const step = r.summary?.nextStep ?? null;
  const action: { href: string; label: string } | null =
    step === "esami" ? { href: "/referti", label: "Quando hai il referto, rendilo chiaro" } : step === "controllo" ? { href: paths.start(r.kind === "parere" ? "video" : r.kind), label: r.kind === "domicilio" ? "Richiedi un'altra visita" : "Prenota un videoconsulto di controllo" } : step === "specialista" || step === "medico-di-famiglia" ? { href: "/strumenti/preparati-alla-visita", label: "Preparati alla visita in 2 minuti" } : null;
  return (
    <>
      <section className="form-card form-card-accent" aria-label="Prestazione conclusa">
        <div className="form-card-head">
          <span aria-hidden className="tile-ico tile-ico-sm">
            <BadgeCheck />
          </span>
          <h2 className="form-card-title">Prestazione conclusa</h2>
        </div>
        {r.summary ? (
          <article className="mt-6 rounded-[1.5rem] border border-line bg-paper p-5 sm:p-7" aria-label={title}>
            <p className="chip bg-cream text-warn">Documento dimostrativo · non ha valore clinico</p>
            <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">{title}</h3>
            <p className="meta mt-1">
              {doctorLabel} · {formatSlot(r.summary.at, now)}
            </p>
            <p className="mt-4 whitespace-pre-line text-[1.0625rem] leading-relaxed text-ink">{r.summary.text}</p>
            {r.summary.prescription ? <p className="mt-4 rounded-2xl bg-mist px-4 py-3 text-[1.0625rem] text-ink">Il medico ti ha lasciato una prescrizione su ricetta bianca (in questa prova non esiste un documento reale).</p> : null}
          </article>
        ) : null}
        {step ? (
          <div className="mt-5 rounded-[1.5rem] bg-marker-soft p-5 sm:p-6" data-prossimo-passo={step}>
            <p className="text-base font-bold uppercase tracking-wide text-teal-deep">Prossimo passo</p>
            <p className="mt-1 text-xl font-extrabold text-ink">{NEXT_STEPS[step]}</p>
            {action ? (
              <Link href={action.href} className="btn btn-primary btn-wrap mt-4 w-full sm:w-auto">
                {action.label} <ArrowRight aria-hidden className="btn-arrow h-5 w-5 shrink-0" />
              </Link>
            ) : null}
          </div>
        ) : null}
        <button type="button" className="btn btn-ghost mt-4 print:hidden" onClick={() => window.print()}>
          <Printer aria-hidden className="h-5 w-5" /> Stampa o salva in PDF
        </button>
      </section>
      <section className="form-card" aria-label="Ricevuta dimostrativa">
        <h2 className="area-h2">Ricevuta dimostrativa</h2>
        <dl className="kv-rows mt-5">
          <Row label="Prestazione" value={PRESTAZIONI[r.kind].title} />
          <Row label="Data" value={r.scheduledStart ? formatSlot(r.scheduledStart, now) : "—"} />
          <Row label="Importo" value={r.priceCents != null ? formatEuro(r.priceCents) : "—"} strong />
          <Row label="Pagamento" value={`simulato${r.payment.ref ? ` · rif. ${r.payment.ref}` : ""}`} />
        </dl>
        <p className="meta mt-5">Non è una fattura: nel servizio reale la emette chi eroga la prestazione.</p>
      </section>
    </>
  );
}

export { STATUS_LABEL };

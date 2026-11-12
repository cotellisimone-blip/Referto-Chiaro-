import { PRESTAZIONI, prestazioneCents, type PrestazioneKind } from "./listino";

/**
 * Motore delle prestazioni con un medico (domicilio, videoconsulto, secondo parere) per la DEMO.
 *
 * Funzioni pure: ricevono lo stato e restituiscono il nuovo stato, senza effetti collaterali. Lo stesso record
 * di richiesta è letto da paziente, medico e amministrazione, ognuno con la sua vista ridotta (vedi «Viste»).
 * In demo lo stato vive nel browser (src/components/prestazioni/store.ts); in produzione questo modulo andrà
 * dietro alle API con persistenza e RLS, senza cambiare le regole.
 *
 * Regole principali (prompt «Medico a domicilio», 12/11/2026):
 * - una richiesta si avvia solo se c'è un medico verificato e abilitato alla prestazione con una fascia libera
 *   (per il secondo parere: uno specialista della specialità aperta che accetta nuove richieste);
 * - lo stesso generalista fa domicilio e video su fasce condivise: il domicilio occupa anche il tragitto;
 * - la conferma riverifica tutto (servizio aperto, medico abilitato, fascia libera, proposta non scaduta);
 *   una seconda conferma restituisce l'esito già registrato; un pagamento fallito non crea nulla;
 * - l'amministrazione vede la logistica, non il quesito clinico, i documenti o la sintesi.
 */

export const DEMO_STORAGE_VERSION = 1;

export const MINUTE = 60_000;
export const VISIT_MINUTES: Record<PrestazioneKind, number> = { domicilio: 45, video: 30, parere: 30 };
/** Tempo di spostamento prima e dopo una visita a domicilio. */
export const TRAVEL_MINUTES = 30;
/** Preavviso minimo: una fascia di oggi si mostra solo se c'è il tempo di organizzarla. */
export const LEAD_MINUTES: Record<PrestazioneKind, number> = { domicilio: 120, video: 60, parere: 60 };
/** Validità di una proposta del medico prima che scada. */
export const PROPOSAL_TTL_MINUTES = 120;

export type DoctorStatus = "candidato" | "verificato" | "sospeso";

export interface Doctor {
  id: string;
  name: string;
  role: "generalista" | "specialista";
  specialtyId: string | null;
  /** Estremi di iscrizione all'Ordine (fittizi in demo). */
  ordine: string;
  email: string;
  phone: string;
  status: DoctorStatus;
  /** Prestazioni abilitate dall'amministrazione (solo dopo la verifica). */
  enabled: PrestazioneKind[];
  /** Prestazioni che il medico ha dichiarato di offrire nella candidatura. */
  offered: PrestazioneKind[];
  /** CAP serviti a domicilio. */
  zones: string[];
  /** Solo specialisti: disponibilità esplicita a valutare nuove richieste di secondo parere. */
  acceptsNewOpinions: boolean;
  demo: true;
}

export interface Slot {
  id: string;
  doctorId: string;
  /** Inizio, ISO. */
  start: string;
  kinds: PrestazioneKind[];
  open: boolean;
}

export type RequestStatus =
  | "ricevuta"
  | "documenti_richiesti"
  | "proposta"
  | "confermata"
  | "in_corso"
  | "sintesi"
  | "conclusa"
  | "indisponibile"
  | "non_accettata"
  | "annullata";

export const STATUS_LABEL: Record<RequestStatus, string> = {
  ricevuta: "Richiesta ricevuta",
  documenti_richiesti: "Servono altri documenti",
  proposta: "Proposta da confermare",
  confermata: "Appuntamento confermato",
  in_corso: "In corso",
  sintesi: "Sintesi in preparazione",
  conclusa: "Conclusa",
  indisponibile: "Fascia non disponibile",
  non_accettata: "Non accettata, nessun addebito",
  annullata: "Annullata",
};

export const ACTIVE_STATUSES: RequestStatus[] = ["ricevuta", "documenti_richiesti", "proposta", "confermata", "in_corso", "sintesi"];
const HOLDING: RequestStatus[] = ["ricevuta", "proposta", "confermata", "in_corso"];

export interface HistoryEntry {
  at: string;
  actor: "paziente" | "medico" | "amministrazione" | "sistema";
  text: string;
}

export interface DemoDocument {
  id: string;
  title: string;
}

export interface BookingRequest {
  id: string;
  code: string;
  kind: PrestazioneKind;
  status: RequestStatus;
  createdAt: string;
  patientId: string;
  /** Per chi è la prestazione: il paziente stesso o un familiare. */
  forWhom: { self: boolean; name: string; relation: string | null };
  contact: { phone: string };
  address: { comune: string; cap: string; street: string; notes: string } | null;
  /** Motivo (domicilio, video) o quesito clinico (parere): dato clinico, mai all'amministrazione. */
  reason: string;
  specialtyId: string | null;
  documents: DemoDocument[];
  /** Fascia chiesta dal paziente (domicilio, video). */
  requestedStart: string | null;
  doctorId: string | null;
  proposal: { start: string; expiresAt: string; deliveryDays: number | null } | null;
  scheduledStart: string | null;
  deliveryDays: number | null;
  /** Prezzo registrato alla conferma: non cambia se poi cambia il listino. */
  priceCents: number | null;
  payment: { status: "nessuno" | "fallito" | "pagato" | "rimborsato"; attempts: number; ref: string | null };
  /** Messaggio del medico (documenti richiesti, esito, motivo di indisponibilità). */
  notice: string | null;
  video: { state: "chiusa" | "attesa" | "in_corso" | "problema" | "conclusa" } ;
  summary: { text: string; at: string } | null;
  history: HistoryEntry[];
}

export interface Specialty {
  id: string;
  name: string;
  open: boolean;
}

export interface Block {
  doctorId: string;
  start: string;
  kind: PrestazioneKind;
  label: string;
}

export interface PrestazioniState {
  version: number;
  seededAt: string;
  services: Record<PrestazioneKind, boolean>;
  specialties: Specialty[];
  coverage: { label: string; comune: string; caps: string[]; enabled: boolean };
  doctors: Doctor[];
  slots: Slot[];
  requests: BookingRequest[];
  /** Occupazioni esterne simulate (es. un'altra prenotazione arrivata nel frattempo). */
  blocks: Block[];
  demo: { failNextPayment: boolean };
  seq: number;
}

// ---------- Utilità ----------

const t = (iso: string) => new Date(iso).getTime();
const isoAt = (ms: number) => new Date(ms).toISOString();

export function normalizeCap(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 5);
}

export function normalizeComune(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ");
}

function log(r: BookingRequest, now: Date, actor: HistoryEntry["actor"], text: string): BookingRequest {
  return { ...r, history: [...r.history, { at: now.toISOString(), actor, text }] };
}

function replaceRequest(s: PrestazioniState, r: BookingRequest): PrestazioniState {
  return { ...s, requests: s.requests.map((x) => (x.id === r.id ? r : x)) };
}

export function getRequest(s: PrestazioniState, id: string): BookingRequest | null {
  return s.requests.find((r) => r.id === id) ?? null;
}

export function getDoctor(s: PrestazioniState, id: string | null): Doctor | null {
  return id ? (s.doctors.find((d) => d.id === id) ?? null) : null;
}

export function specialtyName(s: PrestazioniState, id: string | null): string {
  return s.specialties.find((x) => x.id === id)?.name ?? "";
}

// ---------- Occupazione e disponibilità ----------

/** Intervallo occupato da una prestazione: il domicilio include il tragitto prima e dopo. */
export function occupation(kind: PrestazioneKind, startIso: string): [number, number] {
  const start = t(startIso);
  const travel = kind === "domicilio" ? TRAVEL_MINUTES * MINUTE : 0;
  return [start - travel, start + VISIT_MINUTES[kind] * MINUTE + travel];
}

function startOf(r: BookingRequest): string | null {
  if (r.status === "ricevuta") return r.requestedStart;
  if (r.status === "proposta") return r.proposal?.start ?? null;
  if (r.status === "confermata" || r.status === "in_corso") return r.scheduledStart;
  return null;
}

/** Tutte le occupazioni di un medico (richieste attive e blocchi esterni), esclusa eventualmente una richiesta. */
function busy(s: PrestazioniState, doctorId: string, exceptRequestId: string | null): [number, number][] {
  const out: [number, number][] = [];
  for (const r of s.requests) {
    if (r.id === exceptRequestId || r.doctorId !== doctorId || !HOLDING.includes(r.status)) continue;
    const st = startOf(r);
    if (st) out.push(occupation(r.kind, st));
  }
  for (const b of s.blocks) if (b.doctorId === doctorId) out.push(occupation(b.kind, b.start));
  return out;
}

export function isFree(s: PrestazioniState, doctorId: string, kind: PrestazioneKind, startIso: string, exceptRequestId: string | null = null): boolean {
  const [a, b] = occupation(kind, startIso);
  return busy(s, doctorId, exceptRequestId).every(([x, y]) => b <= x || a >= y);
}

/** Medico che può ricevere una prestazione: verificato e abilitato dall'amministrazione. */
export function isEligible(s: PrestazioniState, d: Doctor, kind: PrestazioneKind, opts: { cap?: string; specialtyId?: string | null } = {}): boolean {
  if (d.status !== "verificato" || !d.enabled.includes(kind)) return false;
  if (kind === "domicilio" && opts.cap && !d.zones.includes(opts.cap)) return false;
  if (kind === "parere") {
    if (d.role !== "specialista" || !d.acceptsNewOpinions) return false;
    if (opts.specialtyId && d.specialtyId !== opts.specialtyId) return false;
  }
  return true;
}

export function eligibleDoctors(s: PrestazioniState, kind: PrestazioneKind, opts: { cap?: string; specialtyId?: string | null } = {}): Doctor[] {
  return s.doctors.filter((d) => isEligible(s, d, kind, opts));
}

export interface FreeSlot {
  start: string;
  doctorIds: string[];
}

/** Fasce libere per una prestazione, raggruppate per orario (il paziente sceglie un orario, non un medico). */
export function freeSlots(s: PrestazioniState, kind: PrestazioneKind, now: Date, opts: { cap?: string; specialtyId?: string | null; exceptRequestId?: string | null } = {}): FreeSlot[] {
  const doctors = new Set(eligibleDoctors(s, kind, opts).map((d) => d.id));
  const minStart = now.getTime() + LEAD_MINUTES[kind] * MINUTE;
  const byStart = new Map<string, string[]>();
  for (const sl of s.slots) {
    if (!sl.open || !doctors.has(sl.doctorId) || !sl.kinds.includes(kind) || t(sl.start) < minStart) continue;
    if (!isFree(s, sl.doctorId, kind, sl.start, opts.exceptRequestId ?? null)) continue;
    byStart.set(sl.start, [...(byStart.get(sl.start) ?? []), sl.doctorId]);
  }
  return [...byStart.entries()].sort((a, b) => t(a[0]) - t(b[0])).map(([start, doctorIds]) => ({ start, doctorIds }));
}

/** Fasce libere di un singolo medico (per proporre un orario). */
export function doctorFreeSlots(s: PrestazioniState, doctorId: string, kind: PrestazioneKind, now: Date, exceptRequestId: string | null = null): string[] {
  const minStart = now.getTime() + LEAD_MINUTES[kind] * MINUTE;
  return s.slots
    .filter((sl) => sl.doctorId === doctorId && sl.open && sl.kinds.includes(kind) && t(sl.start) >= minStart && isFree(s, doctorId, kind, sl.start, exceptRequestId))
    .map((sl) => sl.start)
    .sort((a, b) => t(a) - t(b));
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export type CoverageResult = { ok: true; cap: string } | { ok: false; reason: "cap-non-valido" | "fuori-zona" | "zona-sospesa" };

/** Verifica comune e CAP per il domicilio. */
export function checkCoverage(s: PrestazioniState, comune: string, capRaw: string): CoverageResult {
  const cap = normalizeCap(capRaw);
  if (cap.length !== 5) return { ok: false, reason: "cap-non-valido" };
  if (normalizeComune(comune) !== normalizeComune(s.coverage.comune) || !s.coverage.caps.includes(cap)) return { ok: false, reason: "fuori-zona" };
  if (!s.coverage.enabled) return { ok: false, reason: "zona-sospesa" };
  return { ok: true, cap };
}

export type AvailabilityState = "aperto" | "sospeso" | "esaurito" | "fuori_zona" | "nessun_medico";

export interface Availability {
  kind: PrestazioneKind;
  state: AvailabilityState;
  /** Prima fascia libera (domicilio, video). */
  next: string | null;
  /** C'è una fascia libera oggi (solo per zone e orari coperti). */
  today: boolean;
  message: string;
  action: { label: string; href: string };
}

/** Stato di una prestazione per schede e pagine, con la prossima azione concretamente disponibile. */
export function availability(s: PrestazioniState, kind: PrestazioneKind, now: Date, opts: { cap?: string; specialtyId?: string | null } = {}): Availability {
  const info = PRESTAZIONI[kind];
  const fallback = () => {
    const other = (["video", "parere", "domicilio"] as PrestazioneKind[]).find((k) => k !== kind && s.services[k] && hasCapacity(s, k, now));
    return other ? { label: `Vedi ${PRESTAZIONI[other].short.toLowerCase()}`, href: PRESTAZIONI[other].href } : { label: "Usa gli strumenti gratuiti", href: "/punto-di-partenza" };
  };
  if (!s.services[kind]) {
    return { kind, state: "sospeso", next: null, today: false, message: "Nuove richieste sospese per ora. Gli appuntamenti già confermati restano validi.", action: fallback() };
  }
  if (kind === "domicilio" && opts.cap !== undefined && !s.coverage.caps.includes(opts.cap)) {
    return { kind, state: "fuori_zona", next: null, today: false, message: `Il tuo CAP non è ancora coperto. Per ora andiamo a domicilio solo a ${s.coverage.label}.`, action: s.services.video && hasCapacity(s, "video", now) ? { label: "Prenota un videoconsulto", href: PRESTAZIONI.video.href } : fallback() };
  }
  if (kind === "domicilio" && !s.coverage.enabled) {
    return { kind, state: "sospeso", next: null, today: false, message: "La zona pilota è momentaneamente sospesa.", action: fallback() };
  }
  if (kind === "parere") {
    const specs = opts.specialtyId ? s.specialties.filter((x) => x.id === opts.specialtyId) : s.specialties;
    const open = specs.filter((x) => x.open && eligibleDoctors(s, "parere", { specialtyId: x.id }).length > 0);
    if (!open.length) return { kind, state: "nessun_medico", next: null, today: false, message: "Nessuna specialità aperta in questo momento.", action: fallback() };
    return { kind, state: "aperto", next: null, today: false, message: `Specialità disponibili: ${open.map((x) => x.name).join(", ")}.`, action: { label: "Richiedi il secondo parere", href: info.startHref } };
  }
  if (!eligibleDoctors(s, kind, { cap: opts.cap }).length) {
    return { kind, state: "nessun_medico", next: null, today: false, message: "Nessun medico abilitato in questo momento.", action: fallback() };
  }
  const slots = freeSlots(s, kind, now, { cap: opts.cap });
  if (!slots.length) {
    return { kind, state: "esaurito", next: null, today: false, message: "Fasce esaurite nei prossimi giorni.", action: kind === "domicilio" && s.services.video && hasCapacity(s, "video", now) ? { label: "Prenota un videoconsulto", href: PRESTAZIONI.video.href } : fallback() };
  }
  const today = slots.some((x) => isSameDay(new Date(x.start), now));
  return { kind, state: "aperto", next: slots[0].start, today, message: today ? "Fasce libere già oggi." : "Prima fascia libera nei prossimi giorni.", action: { label: kind === "domicilio" ? "Richiedi la visita" : "Prenota il videoconsulto", href: info.startHref } };
}

function hasCapacity(s: PrestazioniState, kind: PrestazioneKind, now: Date): boolean {
  if (!s.services[kind]) return false;
  if (kind === "parere") return s.specialties.some((x) => x.open && eligibleDoctors(s, "parere", { specialtyId: x.id }).length > 0);
  if (kind === "domicilio" && !s.coverage.enabled) return false;
  return freeSlots(s, kind, now).length > 0;
}

/** Prestazione da mettere in evidenza in home: il domicilio se ha copertura, poi le altre aperte, altrimenti nessuna. */
export function featuredKind(s: PrestazioniState, now: Date): PrestazioneKind | null {
  return (["domicilio", "video", "parere"] as PrestazioneKind[]).find((k) => hasCapacity(s, k, now)) ?? null;
}

// ---------- Paziente ----------

export type Fail<E extends string> = { ok: false; error: E; state: PrestazioniState };
export type Done = { ok: true; state: PrestazioniState; id: string };

export interface NewRequestInput {
  kind: PrestazioneKind;
  patientId: string;
  forWhom: { self: boolean; name: string; relation: string | null };
  phone: string;
  address?: { comune: string; cap: string; street: string; notes: string };
  reason: string;
  specialtyId?: string | null;
  documents?: DemoDocument[];
  start?: string | null;
}

function pickDoctor(s: PrestazioniState, kind: PrestazioneKind, start: string, opts: { cap?: string }, exceptRequestId: string | null): string | null {
  const load = (id: string) => s.requests.filter((r) => r.doctorId === id && ACTIVE_STATUSES.includes(r.status)).length;
  const ok = eligibleDoctors(s, kind, opts).filter((d) => s.slots.some((sl) => sl.doctorId === d.id && sl.open && sl.start === start && sl.kinds.includes(kind)) && isFree(s, d.id, kind, start, exceptRequestId));
  ok.sort((a, b) => load(a.id) - load(b.id) || a.id.localeCompare(b.id));
  return ok[0]?.id ?? null;
}

export function createRequest(
  s: PrestazioniState,
  input: NewRequestInput,
  now: Date,
): Done | Fail<"servizio-sospeso" | "fuori-zona" | "fascia-occupata" | "specialita-chiusa" | "dati-mancanti"> {
  const fail = <E extends string>(error: E) => ({ ok: false as const, error, state: s });
  if (!s.services[input.kind]) return fail("servizio-sospeso");
  if (!input.reason.trim() || !input.phone.trim() || (!input.forWhom.self && !input.forWhom.name.trim())) return fail("dati-mancanti");
  let doctorId: string | null = null;
  let cap: string | undefined;
  if (input.kind === "domicilio") {
    if (!input.address || !input.address.street.trim()) return fail("dati-mancanti");
    const cov = checkCoverage(s, input.address.comune, input.address.cap);
    if (!cov.ok) return fail("fuori-zona");
    cap = cov.ok ? cov.cap : undefined;
  }
  if (input.kind === "parere") {
    const sp = s.specialties.find((x) => x.id === input.specialtyId);
    if (!sp || !sp.open) return fail("specialita-chiusa");
    const ds = eligibleDoctors(s, "parere", { specialtyId: sp.id });
    if (!ds.length) return fail("specialita-chiusa");
    const load = (id: string) => s.requests.filter((r) => r.doctorId === id && ACTIVE_STATUSES.includes(r.status)).length;
    doctorId = [...ds].sort((a, b) => load(a.id) - load(b.id))[0].id;
  } else {
    if (!input.start) return fail("dati-mancanti");
    doctorId = pickDoctor(s, input.kind, input.start, { cap }, null);
    if (!doctorId) return fail("fascia-occupata");
  }
  const seq = s.seq + 1;
  const id = `rq-${seq}-${now.getTime().toString(36)}`;
  let r: BookingRequest = {
    id,
    code: `CP-${String(seq).padStart(4, "0")}`,
    kind: input.kind,
    status: "ricevuta",
    createdAt: now.toISOString(),
    patientId: input.patientId,
    forWhom: { self: input.forWhom.self, name: input.forWhom.name.trim(), relation: input.forWhom.relation },
    contact: { phone: input.phone.trim() },
    address: input.kind === "domicilio" && input.address ? { ...input.address, cap: normalizeCap(input.address.cap) } : null,
    reason: input.reason.trim(),
    specialtyId: input.kind === "parere" ? (input.specialtyId ?? null) : null,
    documents: input.documents ?? [],
    requestedStart: input.kind === "parere" ? null : (input.start ?? null),
    doctorId,
    proposal: null,
    scheduledStart: null,
    deliveryDays: null,
    priceCents: null,
    payment: { status: "nessuno", attempts: 0, ref: null },
    notice: null,
    video: { state: "chiusa" },
    summary: null,
    history: [],
  };
  r = log(r, now, "paziente", input.kind === "parere" ? "Richiesta inviata allo specialista." : "Richiesta inviata per la fascia scelta.");
  return { ok: true, id, state: { ...s, seq, requests: [r, ...s.requests] } };
}

export type ConfirmError = "non-trovata" | "stato-non-valido" | "proposta-scaduta" | "fascia-occupata" | "servizio-sospeso" | "medico-non-abilitato" | "pagamento-fallito";

/**
 * Conferma + pagamento simulato. Riverifica tutto. Idempotente: se la richiesta è già confermata (o oltre),
 * restituisce l'esito registrato senza un secondo addebito. Se il pagamento fallisce non cambia lo stato.
 */
export function confirmRequest(s: PrestazioniState, id: string, now: Date): ({ ok: true; state: PrestazioniState; already: boolean }) | Fail<ConfirmError> {
  const r = getRequest(s, id);
  if (!r) return { ok: false, error: "non-trovata", state: s };
  if (["confermata", "in_corso", "sintesi", "conclusa"].includes(r.status)) return { ok: true, state: s, already: true };
  if (r.status !== "proposta" || !r.proposal || !r.doctorId) return { ok: false, error: "stato-non-valido", state: s };
  const unavailable = (error: ConfirmError, notice: string): Fail<ConfirmError> => {
    let x: BookingRequest = { ...r, status: "indisponibile", notice, proposal: null, doctorId: null };
    x = log(x, now, "sistema", notice);
    return { ok: false, error, state: replaceRequest(s, x) };
  };
  if (t(r.proposal.expiresAt) <= now.getTime()) return unavailable("proposta-scaduta", "La proposta è scaduta prima della conferma. Nessun addebito: scegli un'altra fascia.");
  if (!s.services[r.kind]) return unavailable("servizio-sospeso", "Il servizio è stato sospeso prima della conferma. Nessun addebito.");
  const d = getDoctor(s, r.doctorId);
  // Riverifica dell'abilitazione (non della disponibilità a NUOVI casi: questo caso lo specialista l'ha già accettato).
  if (!d || d.status !== "verificato" || !d.enabled.includes(r.kind) || (r.kind === "domicilio" && r.address && !d.zones.includes(r.address.cap))) {
    return unavailable("medico-non-abilitato", "Il medico non è più disponibile per questa prestazione. Nessun addebito.");
  }
  if (!isFree(s, r.doctorId, r.kind, r.proposal.start, r.id)) return unavailable("fascia-occupata", "Nel frattempo la fascia è stata occupata. Nessun addebito: scegli un'alternativa.");
  if (s.demo.failNextPayment) {
    let x: BookingRequest = { ...r, payment: { ...r.payment, status: "fallito", attempts: r.payment.attempts + 1 } };
    x = log(x, now, "sistema", "Pagamento simulato non riuscito. Nessun appuntamento creato: puoi riprovare.");
    return { ok: false, error: "pagamento-fallito", state: { ...replaceRequest(s, x), demo: { ...s.demo, failNextPayment: false } } };
  }
  let x: BookingRequest = {
    ...r,
    status: "confermata",
    scheduledStart: r.proposal.start,
    deliveryDays: r.proposal.deliveryDays,
    priceCents: prestazioneCents(r.kind),
    payment: { status: "pagato", attempts: r.payment.attempts + 1, ref: `SIM-${r.code}` },
    proposal: null,
    notice: null,
  };
  x = log(x, now, "paziente", `Confermato e pagato (simulazione): ${formatCentsPlain(x.priceCents!)}.`);
  return { ok: true, already: false, state: replaceRequest(s, x) };
}

function formatCentsPlain(c: number): string {
  return `${(c / 100).toFixed(c % 100 ? 2 : 0).replace(".", ",")} €`;
}

/** Il paziente rifiuta la proposta: la richiesta resta aperta e può scegliere un'altra fascia. */
export function rejectProposal(s: PrestazioniState, id: string, now: Date): Done | Fail<"stato-non-valido"> {
  const r = getRequest(s, id);
  if (!r || r.status !== "proposta") return { ok: false, error: "stato-non-valido", state: s };
  let x: BookingRequest = { ...r, status: "indisponibile", proposal: null, doctorId: r.kind === "parere" ? r.doctorId : null, notice: "Hai rifiutato l'orario proposto. Scegli un'altra fascia." };
  if (r.kind === "parere") x = { ...x, status: "ricevuta", notice: "Hai chiesto un altro orario allo specialista." };
  x = log(x, now, "paziente", "Proposta rifiutata.");
  return { ok: true, id, state: replaceRequest(s, x) };
}

/** Dopo un'indisponibilità il paziente sceglie un'alternativa: stessa richiesta, nuova fascia. */
export function chooseAlternative(s: PrestazioniState, id: string, start: string, now: Date): Done | Fail<"stato-non-valido" | "fascia-occupata" | "servizio-sospeso"> {
  const r = getRequest(s, id);
  if (!r || r.status !== "indisponibile" || r.kind === "parere") return { ok: false, error: "stato-non-valido", state: s };
  if (!s.services[r.kind]) return { ok: false, error: "servizio-sospeso", state: s };
  const doctorId = pickDoctor(s, r.kind, start, { cap: r.address?.cap }, r.id);
  if (!doctorId) return { ok: false, error: "fascia-occupata", state: s };
  let x: BookingRequest = { ...r, status: "ricevuta", requestedStart: start, doctorId, notice: null };
  x = log(x, now, "paziente", "Scelta una nuova fascia.");
  return { ok: true, id, state: replaceRequest(s, x) };
}

export function cancelRequest(s: PrestazioniState, id: string, now: Date, actor: HistoryEntry["actor"] = "paziente"): Done | Fail<"stato-non-valido"> {
  const r = getRequest(s, id);
  if (!r || !["ricevuta", "documenti_richiesti", "proposta", "confermata", "indisponibile"].includes(r.status)) return { ok: false, error: "stato-non-valido", state: s };
  const paid = r.payment.status === "pagato";
  let x: BookingRequest = { ...r, status: "annullata", proposal: null, payment: paid ? { ...r.payment, status: "rimborsato" } : r.payment };
  x = log(x, now, actor, paid ? "Annullata. Rimborso simulato dell'importo pagato; la fascia torna libera." : "Annullata. Nessun addebito; la fascia torna libera.");
  return { ok: true, id, state: replaceRequest(s, x) };
}

/** Il paziente integra i documenti chiesti dallo specialista: si riprende la stessa richiesta. */
export function addDocuments(s: PrestazioniState, id: string, docs: DemoDocument[], note: string, now: Date): Done | Fail<"stato-non-valido"> {
  const r = getRequest(s, id);
  if (!r || r.status !== "documenti_richiesti" || !docs.length) return { ok: false, error: "stato-non-valido", state: s };
  const merged = [...r.documents, ...docs.filter((d) => !r.documents.some((x) => x.id === d.id))];
  let x: BookingRequest = { ...r, status: "ricevuta", documents: merged, notice: null };
  x = log(x, now, "paziente", `Documenti integrati (${docs.length})${note.trim() ? `: ${note.trim()}` : ""}.`);
  return { ok: true, id, state: replaceRequest(s, x) };
}

export function enterWaitingRoom(s: PrestazioniState, id: string, now: Date): Done | Fail<"stato-non-valido"> {
  const r = getRequest(s, id);
  if (!r || r.kind === "domicilio" || !["confermata", "in_corso"].includes(r.status)) return { ok: false, error: "stato-non-valido", state: s };
  if (r.video.state === "in_corso") return { ok: true, id, state: s };
  let x: BookingRequest = { ...r, video: { state: "attesa" } };
  x = log(x, now, "paziente", "Entrato nella sala d'attesa (simulata).");
  return { ok: true, id, state: replaceRequest(s, x) };
}

/** Problema di connessione simulato durante il video. */
export function connectionProblem(s: PrestazioniState, id: string, now: Date): Done | Fail<"stato-non-valido"> {
  const r = getRequest(s, id);
  if (!r || r.status !== "in_corso") return { ok: false, error: "stato-non-valido", state: s };
  let x: BookingRequest = { ...r, video: { state: "problema" } };
  x = log(x, now, "sistema", "Connessione interrotta (simulazione).");
  return { ok: true, id, state: replaceRequest(s, x) };
}

export function reconnect(s: PrestazioniState, id: string, now: Date): Done | Fail<"stato-non-valido"> {
  const r = getRequest(s, id);
  if (!r || r.status !== "in_corso" || r.video.state !== "problema") return { ok: false, error: "stato-non-valido", state: s };
  let x: BookingRequest = { ...r, video: { state: "in_corso" } };
  x = log(x, now, "paziente", "Ricollegato.");
  return { ok: true, id, state: replaceRequest(s, x) };
}

/** Riprogramma un appuntamento confermato (o interrotto) su un'altra fascia dello stesso medico, senza nuovo addebito. */
export function reschedule(s: PrestazioniState, id: string, start: string, now: Date, actor: HistoryEntry["actor"] = "paziente"): Done | Fail<"stato-non-valido" | "fascia-occupata"> {
  const r = getRequest(s, id);
  if (!r || !r.doctorId || !(r.status === "confermata" || (r.status === "in_corso" && r.video.state === "problema"))) return { ok: false, error: "stato-non-valido", state: s };
  const own = s.slots.some((sl) => sl.doctorId === r.doctorId && sl.open && sl.start === start && sl.kinds.includes(r.kind));
  if (!own || !isFree(s, r.doctorId, r.kind, start, r.id)) return { ok: false, error: "fascia-occupata", state: s };
  let x: BookingRequest = { ...r, status: "confermata", scheduledStart: start, video: { state: "chiusa" } };
  x = log(x, now, actor, "Appuntamento riprogrammato, senza nuovo addebito.");
  return { ok: true, id, state: replaceRequest(s, x) };
}

// ---------- Medico ----------

export type DoctorAction =
  | { type: "accetta"; start?: string; deliveryDays?: number }
  | { type: "rifiuta"; reason: string; inPerson?: string }
  | { type: "chiedi-documenti"; message: string }
  | { type: "avvia" }
  | { type: "concludi"; note: string }
  | { type: "consegna-sintesi"; text: string };

export type DoctorError = "non-assegnata" | "stato-non-valido" | "fascia-occupata" | "medico-non-abilitato" | "dati-mancanti";

export function doctorAct(s: PrestazioniState, doctorId: string, id: string, action: DoctorAction, now: Date): Done | Fail<DoctorError> {
  const r = getRequest(s, id);
  const fail = (error: DoctorError) => ({ ok: false as const, error, state: s });
  if (!r || r.doctorId !== doctorId) return fail("non-assegnata");
  const d = getDoctor(s, doctorId);
  if (!d || d.status !== "verificato" || !d.enabled.includes(r.kind)) return fail("medico-non-abilitato");
  let x: BookingRequest;
  switch (action.type) {
    case "accetta": {
      if (r.status !== "ricevuta") return fail("stato-non-valido");
      const start = action.start ?? r.requestedStart;
      if (!start) return fail("dati-mancanti");
      if (r.kind === "parere" && !(action.deliveryDays && action.deliveryDays > 0 && action.deliveryDays <= 30)) return fail("dati-mancanti");
      if (!isFree(s, doctorId, r.kind, start, r.id)) return fail("fascia-occupata");
      x = {
        ...r,
        status: "proposta",
        proposal: { start, expiresAt: isoAt(now.getTime() + PROPOSAL_TTL_MINUTES * MINUTE), deliveryDays: r.kind === "parere" ? action.deliveryDays! : null },
        notice: null,
      };
      x = log(x, now, "medico", r.kind === "parere" ? "Caso accettato: proposta di videoconsulto e tempi della sintesi." : start === r.requestedStart ? "Fascia accettata: in attesa della conferma." : "Proposto un altro orario.");
      break;
    }
    case "rifiuta": {
      if (!["ricevuta", "proposta"].includes(r.status)) return fail("stato-non-valido");
      if (!action.reason.trim()) return fail("dati-mancanti");
      if (r.kind === "parere") {
        x = { ...r, status: "non_accettata", proposal: null, notice: `${action.reason.trim()}${action.inPerson?.trim() ? ` Percorso suggerito: ${action.inPerson.trim()}` : ""}` };
        x = log(x, now, "medico", "Caso non adatto al percorso a distanza. Chiuso senza addebito.");
      } else {
        x = { ...r, status: "indisponibile", proposal: null, doctorId: null, notice: action.reason.trim() };
        x = log(x, now, "medico", "Il medico non può in quella fascia.");
      }
      break;
    }
    case "chiedi-documenti": {
      if (r.kind !== "parere" || r.status !== "ricevuta") return fail("stato-non-valido");
      if (!action.message.trim()) return fail("dati-mancanti");
      x = { ...r, status: "documenti_richiesti", notice: action.message.trim() };
      x = log(x, now, "medico", "Richiesti documenti integrativi.");
      break;
    }
    case "avvia": {
      if (r.status !== "confermata") return fail("stato-non-valido");
      x = { ...r, status: "in_corso", video: { state: r.kind === "domicilio" ? "chiusa" : "in_corso" } };
      x = log(x, now, "medico", r.kind === "domicilio" ? "Visita a domicilio iniziata." : "Videoconsulto avviato.");
      break;
    }
    case "concludi": {
      if (!["confermata", "in_corso"].includes(r.status)) return fail("stato-non-valido");
      if (r.kind === "parere") {
        x = { ...r, status: "sintesi", video: { state: "conclusa" } };
        x = log(x, now, "medico", "Videoconsulto concluso. Sintesi in preparazione.");
      } else {
        x = { ...r, status: "conclusa", video: { state: r.kind === "video" ? "conclusa" : "chiusa" }, summary: action.note.trim() ? { text: action.note.trim(), at: now.toISOString() } : null };
        x = log(x, now, "medico", "Prestazione conclusa.");
      }
      break;
    }
    case "consegna-sintesi": {
      if (r.kind !== "parere" || r.status !== "sintesi") return fail("stato-non-valido");
      if (!action.text.trim()) return fail("dati-mancanti");
      x = { ...r, status: "conclusa", summary: { text: action.text.trim(), at: now.toISOString() } };
      x = log(x, now, "medico", "Sintesi scritta consegnata.");
      break;
    }
  }
  return { ok: true, id, state: replaceRequest(s, x) };
}

export function setAcceptsNewOpinions(s: PrestazioniState, doctorId: string, on: boolean): PrestazioniState {
  return { ...s, doctors: s.doctors.map((d) => (d.id === doctorId ? { ...d, acceptsNewOpinions: on } : d)) };
}

// ---------- Amministrazione ----------

export interface CandidateInput {
  name: string;
  email: string;
  phone: string;
  ordine: string;
  specialtyId: string | null;
  offered: PrestazioneKind[];
  zones: string[];
  windows: ("mattina" | "pomeriggio")[];
}

export function applyAsDoctor(s: PrestazioniState, input: CandidateInput, now: Date): Done | Fail<"dati-mancanti"> {
  if (!input.name.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email.trim()) || !input.ordine.trim() || !input.offered.length || !input.windows.length) {
    return { ok: false, error: "dati-mancanti", state: s };
  }
  if (input.offered.includes("parere") && !input.specialtyId) return { ok: false, error: "dati-mancanti", state: s };
  const seq = s.seq + 1;
  const id = `md-${seq}`;
  const role = input.offered.includes("parere") ? "specialista" : "generalista";
  const doctor: Doctor = {
    id,
    name: input.name.trim(),
    role,
    specialtyId: role === "specialista" ? input.specialtyId : null,
    ordine: input.ordine.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    status: "candidato",
    enabled: [],
    offered: input.offered,
    zones: input.zones.map(normalizeCap).filter((c) => c.length === 5),
    acceptsNewOpinions: role === "specialista",
    demo: true,
  };
  const hours = [...(input.windows.includes("mattina") ? [9, 10, 11] : []), ...(input.windows.includes("pomeriggio") ? [15, 16, 17] : [])];
  const slots = makeSlots(id, now, hours, [0, 1, 2, 3, 4], input.offered);
  return { ok: true, id, state: { ...s, seq, doctors: [...s.doctors, doctor], slots: [...s.slots, ...slots] } };
}

/** Verifica amministrativa (Albo, identità, assicurazione: fittizia in demo). Da sola non abilita alle prestazioni. */
export function verifyDoctor(s: PrestazioniState, doctorId: string): PrestazioniState {
  return { ...s, doctors: s.doctors.map((d) => (d.id === doctorId && d.status !== "verificato" ? { ...d, status: "verificato" } : d)) };
}

export function suspendDoctor(s: PrestazioniState, doctorId: string): PrestazioniState {
  return { ...s, doctors: s.doctors.map((d) => (d.id === doctorId ? { ...d, status: "sospeso" } : d)) };
}

/** Abilita o toglie una prestazione: possibile solo per un medico verificato e solo tra quelle che offre. */
export function setDoctorEnabled(s: PrestazioniState, doctorId: string, kind: PrestazioneKind, on: boolean): { ok: boolean; state: PrestazioniState } {
  const d = getDoctor(s, doctorId);
  if (!d) return { ok: false, state: s };
  if (on && (d.status !== "verificato" || !d.offered.includes(kind))) return { ok: false, state: s };
  const enabled = on ? [...new Set([...d.enabled, kind])] : d.enabled.filter((k) => k !== kind);
  return { ok: true, state: { ...s, doctors: s.doctors.map((x) => (x.id === doctorId ? { ...x, enabled } : x)) } };
}

export function setServiceOpen(s: PrestazioniState, kind: PrestazioneKind, open: boolean): PrestazioniState {
  return { ...s, services: { ...s.services, [kind]: open } };
}

export function setSpecialtyOpen(s: PrestazioniState, id: string, open: boolean): PrestazioniState {
  return { ...s, specialties: s.specialties.map((x) => (x.id === id ? { ...x, open } : x)) };
}

export function setCoverageEnabled(s: PrestazioniState, enabled: boolean): PrestazioniState {
  return { ...s, coverage: { ...s.coverage, enabled } };
}

export function setSlotOpen(s: PrestazioniState, slotId: string, open: boolean): PrestazioniState {
  return { ...s, slots: s.slots.map((x) => (x.id === slotId ? { ...x, open } : x)) };
}

/** Assegna o riassegna una richiesta a un altro medico idoneo e libero (logistica: nessun dato clinico richiesto). */
export function assignRequest(s: PrestazioniState, id: string, doctorId: string, now: Date): Done | Fail<"stato-non-valido" | "medico-non-idoneo" | "fascia-occupata"> {
  const r = getRequest(s, id);
  if (!r || !["ricevuta", "documenti_richiesti", "indisponibile"].includes(r.status)) return { ok: false, error: "stato-non-valido", state: s };
  const d = getDoctor(s, doctorId);
  if (!d || !isEligible(s, d, r.kind, { cap: r.address?.cap, specialtyId: r.specialtyId })) return { ok: false, error: "medico-non-idoneo", state: s };
  if (r.kind !== "parere") {
    const start = r.requestedStart;
    if (!start || !s.slots.some((sl) => sl.doctorId === doctorId && sl.open && sl.start === start && sl.kinds.includes(r.kind)) || !isFree(s, doctorId, r.kind, start, r.id)) {
      return { ok: false, error: "fascia-occupata", state: s };
    }
  }
  const before = r.doctorId;
  let x: BookingRequest = { ...r, doctorId, status: r.status === "indisponibile" ? "ricevuta" : r.status, notice: r.status === "indisponibile" ? null : r.notice };
  x = log(x, now, "amministrazione", before ? "Richiesta riassegnata a un altro medico." : "Richiesta assegnata.");
  return { ok: true, id, state: replaceRequest(s, x) };
}

/** Strumento di prova: un'altra prenotazione occupa la fascia proposta (per provare il conflitto alla conferma). */
export function occupyProposedSlot(s: PrestazioniState, id: string): PrestazioniState {
  const r = getRequest(s, id);
  if (!r || r.status !== "proposta" || !r.proposal || !r.doctorId) return s;
  return { ...s, blocks: [...s.blocks, { doctorId: r.doctorId, start: r.proposal.start, kind: r.kind, label: "Prenotazione arrivata nel frattempo (simulata)" }] };
}

/** Strumento di prova: fa scadere subito le proposte aperte. */
export function expireProposals(s: PrestazioniState, now: Date): PrestazioniState {
  return {
    ...s,
    requests: s.requests.map((r) => (r.status === "proposta" && r.proposal ? { ...r, proposal: { ...r.proposal, expiresAt: isoAt(now.getTime() - MINUTE) } } : r)),
  };
}

/** Le proposte scadute diventano «fascia non disponibile», con alternative (chiamata a ogni lettura). */
export function sweepExpired(s: PrestazioniState, now: Date): PrestazioniState {
  let changed = false;
  const requests = s.requests.map((r) => {
    if (r.status !== "proposta" || !r.proposal || t(r.proposal.expiresAt) > now.getTime()) return r;
    changed = true;
    const x: BookingRequest =
      r.kind === "parere"
        ? { ...r, status: "ricevuta", proposal: null, notice: "La proposta è scaduta: lo specialista proporrà un nuovo orario." }
        : { ...r, status: "indisponibile", proposal: null, doctorId: null, notice: "La proposta è scaduta senza conferma. Nessun addebito: scegli un'altra fascia." };
    return log(x, now, "sistema", "Proposta scaduta.");
  });
  return changed ? { ...s, requests } : s;
}

export function setFailNextPayment(s: PrestazioniState, on: boolean): PrestazioniState {
  return { ...s, demo: { ...s.demo, failNextPayment: on } };
}

/** Scenario «avvio con un solo servizio»: domicilio e video sospesi, solo il secondo parere in una specialità. */
export function presetSoloParere(s: PrestazioniState): PrestazioniState {
  return { ...s, services: { domicilio: false, video: false, parere: true }, specialties: s.specialties.map((x, i) => ({ ...x, open: i === 0 })) };
}

export function presetTuttoAperto(s: PrestazioniState): PrestazioniState {
  return { ...s, services: { domicilio: true, video: true, parere: true }, specialties: s.specialties.map((x) => ({ ...x, open: true })), coverage: { ...s.coverage, enabled: true } };
}

// ---------- Viste per ruolo ----------

export interface AdminRequestView {
  id: string;
  code: string;
  kind: PrestazioneKind;
  status: RequestStatus;
  createdAt: string;
  zone: string | null;
  start: string | null;
  doctorId: string | null;
  specialtyId: string | null;
  payment: BookingRequest["payment"]["status"];
  priceCents: number | null;
}

/** Vista dell'amministrazione: solo logistica. Niente motivo, quesito, documenti, sintesi, indirizzo o telefono. */
export function adminView(r: BookingRequest): AdminRequestView {
  return {
    id: r.id,
    code: r.code,
    kind: r.kind,
    status: r.status,
    createdAt: r.createdAt,
    zone: r.address ? `${r.address.comune} ${r.address.cap}` : null,
    start: startOf(r) ?? r.scheduledStart,
    doctorId: r.doctorId,
    specialtyId: r.specialtyId,
    payment: r.payment.status,
    priceCents: r.priceCents,
  };
}

export interface DoctorRequestView extends Omit<BookingRequest, "contact" | "address" | "history"> {
  contact: { phone: string } | null;
  address: { comune: string; cap: string; street: string | null; notes: string | null } | null;
}

/**
 * Vista del medico: solo le richieste assegnate a lui. Il recapito e la via servono solo a prestazione confermata;
 * prima vede comune e CAP. Un medico non verificato non vede nulla.
 */
export function doctorRequests(s: PrestazioniState, doctorId: string): DoctorRequestView[] {
  const d = getDoctor(s, doctorId);
  if (!d || d.status !== "verificato") return [];
  return s.requests.filter((r) => r.doctorId === doctorId).map((r) => doctorView(r));
}

function doctorView(r: BookingRequest): DoctorRequestView {
  const confirmed = ["confermata", "in_corso", "sintesi", "conclusa"].includes(r.status);
  const { history: _h, contact, address, ...rest } = r;
  void _h;
  return {
    ...rest,
    contact: confirmed ? contact : null,
    address: address ? { comune: address.comune, cap: address.cap, street: confirmed ? address.street : null, notes: confirmed ? address.notes : null } : null,
  };
}

export function doctorRequest(s: PrestazioniState, doctorId: string, id: string): DoctorRequestView | null {
  return doctorRequests(s, doctorId).find((r) => r.id === id) ?? null;
}

export function patientRequests(s: PrestazioniState, patientId: string): BookingRequest[] {
  return s.requests.filter((r) => r.patientId === patientId);
}

// ---------- Dati di prova ----------

let slotSeq = 0;
function makeSlots(doctorId: string, now: Date, hours: number[], days: number[], kinds: PrestazioneKind[]): Slot[] {
  const out: Slot[] = [];
  for (const d of days) {
    for (const h of hours) {
      const x = new Date(now);
      x.setDate(x.getDate() + d);
      x.setHours(h, 0, 0, 0);
      out.push({ id: `sl-${doctorId}-${d}-${h}-${slotSeq++}`, doctorId, start: x.toISOString(), kinds, open: true });
    }
  }
  return out;
}

export const BRESCIA_CAPS = ["25121", "25122", "25123", "25124", "25125", "25126", "25127", "25128", "25129", "25131", "25132", "25133", "25134", "25135", "25136"];

export const DEMO_DOCUMENTS: DemoDocument[] = [
  { id: "doc-eco", title: "Ecocardiogramma (esempio fittizio)" },
  { id: "doc-ecg", title: "Elettrocardiogramma (esempio fittizio)" },
  { id: "doc-lettera", title: "Lettera del cardiologo curante (esempio fittizio)" },
  { id: "doc-sangue", title: "Esami del sangue (esempio fittizio)" },
  { id: "doc-holter", title: "Holter ECG 24 ore (esempio fittizio)" },
];

export const DEMO_PATIENT = { id: "paz-demo", name: "Mario Demo", phone: "+39 030 000 0000 (fittizio)", address: { comune: "Brescia", cap: "25122", street: "Via di Prova 1 (indirizzo fittizio)", notes: "Citofono «Demo», secondo piano" } };

/** Stato iniziale della demo, con orari relativi a «adesso». Tutto è fittizio e riconoscibile come tale. */
export function seedState(now: Date): PrestazioniState {
  slotSeq = 0;
  const doctors: Doctor[] = [
    { id: "md-bianchi", name: "Dott.ssa Laura Bianchi (profilo dimostrativo)", role: "generalista", specialtyId: null, ordine: "OMCeO Brescia n. DEMO-0001", email: "l.bianchi@esempio.invalid", phone: "+39 000 000 0001", status: "verificato", enabled: ["domicilio", "video"], offered: ["domicilio", "video"], zones: BRESCIA_CAPS, acceptsNewOpinions: false, demo: true },
    { id: "md-ferri", name: "Dott. Paolo Ferri (profilo dimostrativo)", role: "generalista", specialtyId: null, ordine: "OMCeO Brescia n. DEMO-0002", email: "p.ferri@esempio.invalid", phone: "+39 000 000 0002", status: "verificato", enabled: ["video"], offered: ["video"], zones: [], acceptsNewOpinions: false, demo: true },
    { id: "md-conti", name: "Dott.ssa Giulia Conti (profilo dimostrativo)", role: "specialista", specialtyId: "cardiologia", ordine: "OMCeO Milano n. DEMO-0003", email: "g.conti@esempio.invalid", phone: "+39 000 000 0003", status: "verificato", enabled: ["parere"], offered: ["parere"], zones: [], acceptsNewOpinions: true, demo: true },
    { id: "md-rinaldi", name: "Dott. Marco Rinaldi (candidatura dimostrativa)", role: "generalista", specialtyId: null, ordine: "OMCeO Brescia n. DEMO-0004", email: "m.rinaldi@esempio.invalid", phone: "+39 000 000 0004", status: "candidato", enabled: [], offered: ["domicilio", "video"], zones: BRESCIA_CAPS, acceptsNewOpinions: false, demo: true },
  ];
  const slots = [
    ...makeSlots("md-bianchi", now, [9, 10, 11, 14, 15, 16, 17, 18], [0, 1, 2, 3], ["domicilio", "video"]),
    ...makeSlots("md-ferri", now, [12, 13, 19], [0, 1, 2], ["video"]),
    ...makeSlots("md-conti", now, [15, 16, 17], [2, 3, 4, 5], ["parere"]),
    ...makeSlots("md-rinaldi", now, [9, 10, 11], [1, 2, 3], ["domicilio", "video"]),
  ];
  // Un appuntamento già confermato di un altro paziente fittizio: occupa una fascia e mostra che l'importo resta registrato.
  const tomorrow10 = new Date(now);
  tomorrow10.setDate(tomorrow10.getDate() + 1);
  tomorrow10.setHours(10, 0, 0, 0);
  const existing: BookingRequest = {
    id: "rq-0-seed",
    code: "CP-0000",
    kind: "domicilio",
    status: "confermata",
    createdAt: now.toISOString(),
    patientId: "paz-altro",
    forWhom: { self: true, name: "", relation: null },
    contact: { phone: "+39 000 000 0099 (fittizio)" },
    address: { comune: "Brescia", cap: "25128", street: "Via Esempio 9 (fittizio)", notes: "" },
    reason: "Controllo dopo una febbre (esempio fittizio)",
    specialtyId: null,
    documents: [],
    requestedStart: tomorrow10.toISOString(),
    doctorId: "md-bianchi",
    proposal: null,
    scheduledStart: tomorrow10.toISOString(),
    deliveryDays: null,
    priceCents: 14900,
    payment: { status: "pagato", attempts: 1, ref: "SIM-CP-0000" },
    notice: null,
    video: { state: "chiusa" },
    summary: null,
    history: [{ at: now.toISOString(), actor: "sistema", text: "Appuntamento dimostrativo di un altro paziente." }],
  };
  return {
    version: DEMO_STORAGE_VERSION,
    seededAt: now.toISOString(),
    services: { domicilio: true, video: true, parere: true },
    specialties: [{ id: "cardiologia", name: "Cardiologia", open: true }],
    coverage: { label: "Brescia città (area pilota)", comune: "Brescia", caps: BRESCIA_CAPS, enabled: true },
    doctors,
    slots,
    requests: [existing],
    blocks: [],
    demo: { failNextPayment: false },
    seq: 0,
  };
}

import { describe, expect, it } from "vitest";
import {
  DEMO_DOCUMENTS,
  DEMO_PATIENT,
  addDocuments,
  adminView,
  applyAsDoctor,
  assignRequest,
  availability,
  cancelRequest,
  cancelTerms,
  demoDoctorStep,
  refundableNow,
  checkCoverage,
  chooseAlternative,
  confirmRequest,
  connectionProblem,
  createRequest,
  doctorAct,
  doctorRequest,
  doctorRequests,
  eligibleDoctors,
  enterWaitingRoom,
  expireProposals,
  featuredKind,
  freeSlots,
  getRequest,
  occupyProposedSlot,
  presetSoloParere,
  reconnect,
  rejectProposal,
  reschedule,
  seedState,
  setDoctorEnabled,
  setFailNextPayment,
  setServiceOpen,
  sweepExpired,
  verifyDoctor,
  type NewRequestInput,
  type PrestazioniState,
} from "@/domain/prestazioni/engine";
import { PRESTAZIONI, prestazioneCents, prestazionePrice } from "@/domain/prestazioni/listino";

// Un martedì alle 8:00: le fasce di oggi partono dalle 9 (domicilio con 2 ore di preavviso → dalle 10).
const NOW = new Date(2026, 10, 10, 8, 0, 0);
const later = (min: number) => new Date(NOW.getTime() + min * 60_000);
const at = (dayOffset: number, h: number) => {
  const d = new Date(NOW);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, 0, 0, 0);
  return d.toISOString();
};

function ok<T extends { ok: boolean }>(r: T): Extract<T, { ok: true }> {
  if (!r.ok) throw new Error(`atteso ok, ottenuto ${JSON.stringify((r as unknown as { error: string }).error)}`);
  return r as Extract<T, { ok: true }>;
}

const domicilio = (start: string, extra: Partial<NewRequestInput> = {}): NewRequestInput => ({
  kind: "domicilio",
  patientId: DEMO_PATIENT.id,
  forWhom: { self: true, name: "", relation: null },
  phone: DEMO_PATIENT.phone,
  address: { ...DEMO_PATIENT.address },
  reason: "Febbre da tre giorni, non urgente",
  start,
  ...extra,
});

const video = (start: string): NewRequestInput => ({ kind: "video", patientId: DEMO_PATIENT.id, forWhom: { self: true, name: "", relation: null }, phone: DEMO_PATIENT.phone, reason: "Dubbi sugli esami", start });

const parere = (): NewRequestInput => ({
  kind: "parere",
  patientId: DEMO_PATIENT.id,
  forWhom: { self: true, name: "", relation: null },
  phone: DEMO_PATIENT.phone,
  reason: "Mi è stata proposta una procedura: è indicata nel mio caso?",
  specialtyId: "cardiologia",
  documents: [DEMO_DOCUMENTS[0]],
});

/** Porta una richiesta domicilio/video fino a «confermata». */
function book(s: PrestazioniState, input: NewRequestInput) {
  const c = ok(createRequest(s, input, NOW));
  const r = getRequest(c.state, c.id)!;
  const a = ok(doctorAct(c.state, r.doctorId!, c.id, { type: "accetta" }, NOW));
  const f = ok(confirmRequest(a.state, c.id, NOW));
  return { state: f.state, id: c.id, doctorId: r.doctorId! };
}

describe("listino delle prestazioni con un medico", () => {
  it("149 € domicilio, 69 € video, 149 € secondo parere, da un'unica fonte", () => {
    expect(prestazioneCents("domicilio", {})).toBe(14900);
    expect(prestazioneCents("video", {})).toBe(6900);
    expect(prestazioneCents("parere", {})).toBe(14900);
    const sp = (x: string) => x.replace(/\s/g, " ");
    expect(sp(prestazionePrice("video", {}))).toBe("69 €");
    expect(prestazioneCents("domicilio", { PRICE_DOMICILIO_CENTS: "abc" })).toBe(14900);
  });

  it("i due servizi a 149 € si distinguono dal titolo e da cosa comprendono", () => {
    expect(PRESTAZIONI.domicilio.title).not.toBe(PRESTAZIONI.parere.title);
    expect(PRESTAZIONI.domicilio.title).toMatch(/domicilio/i);
    expect(PRESTAZIONI.parere.title).toMatch(/secondo parere/i);
    expect(PRESTAZIONI.parere.includes.join(" ")).toMatch(/videoconsulto/i);
    expect(PRESTAZIONI.parere.includes.join(" ")).toMatch(/sintesi scritta/i);
  });
});

describe("copertura e disponibilità", () => {
  it("comune e CAP: Brescia città coperta, altri CAP no, CAP non valido segnalato", () => {
    const s = seedState(NOW);
    expect(checkCoverage(s, "Brescia", "25122")).toEqual({ ok: true, cap: "25122" });
    expect(checkCoverage(s, "brescia ", "25 122")).toEqual({ ok: true, cap: "25122" });
    expect(checkCoverage(s, "Milano", "20121")).toMatchObject({ ok: false, reason: "fuori-zona" });
    expect(checkCoverage(s, "Brescia", "251")).toMatchObject({ ok: false, reason: "cap-non-valido" });
  });

  it("distingue fuori zona, fascia esaurita e prestazione sospesa, ognuna con un'azione possibile", () => {
    let s = seedState(NOW);
    expect(availability(s, "domicilio", NOW, { cap: "20121" })).toMatchObject({ state: "fuori_zona", action: { href: PRESTAZIONI.video.href } });
    expect(availability(s, "domicilio", NOW).state).toBe("aperto");
    s = { ...s, slots: s.slots.map((x) => (x.kinds.includes("domicilio") ? { ...x, open: false } : x)) };
    expect(availability(s, "domicilio", NOW)).toMatchObject({ state: "esaurito", action: { href: PRESTAZIONI.video.href } });
    s = setServiceOpen(seedState(NOW), "domicilio", false);
    const sosp = availability(s, "domicilio", NOW);
    expect(sosp.state).toBe("sospeso");
    expect(sosp.action.href).not.toBe(PRESTAZIONI.domicilio.startHref);
  });

  it("«oggi» solo per orari davvero coperti: alle 21 non ci sono più fasce di oggi", () => {
    const s = seedState(NOW);
    expect(availability(s, "domicilio", NOW).today).toBe(true);
    // Il domicilio chiede 2 ore di preavviso: la prima fascia di oggi alle 8:00 è alle 10.
    expect(freeSlots(s, "domicilio", NOW)[0].start).toBe(at(0, 10));
    const sera = new Date(NOW);
    sera.setHours(21);
    expect(availability(s, "domicilio", sera).today).toBe(false);
  });

  it("in home: il domicilio quando ha copertura, altrimenti una prestazione aperta, altrimenti nessuna", () => {
    let s = seedState(NOW);
    expect(featuredKind(s, NOW)).toBe("domicilio");
    s = setServiceOpen(s, "domicilio", false);
    expect(featuredKind(s, NOW)).toBe("video");
    s = presetSoloParere(s);
    expect(featuredKind(s, NOW)).toBe("parere");
    s = setServiceOpen(s, "parere", false);
    expect(featuredKind(s, NOW)).toBeNull();
  });
});

describe("avvio con un solo servizio", () => {
  it("una sola specialità aperta, domicilio sospeso: le altre prestazioni mostrano lo stato giusto e non si avviano", () => {
    const s = presetSoloParere(seedState(NOW));
    expect(availability(s, "domicilio", NOW).state).toBe("sospeso");
    expect(availability(s, "video", NOW).state).toBe("sospeso");
    expect(availability(s, "parere", NOW).state).toBe("aperto");
    expect(createRequest(s, domicilio(at(1, 15)), NOW)).toMatchObject({ ok: false, error: "servizio-sospeso" });
    expect(createRequest(s, parere(), NOW).ok).toBe(true);
  });

  it("sospendere un servizio lascia validi e gestibili gli appuntamenti già confermati", () => {
    const b = book(seedState(NOW), domicilio(at(1, 15)));
    const s = setServiceOpen(b.state, "domicilio", false);
    expect(getRequest(s, b.id)!.status).toBe("confermata");
    expect(ok(cancelRequest(s, b.id, NOW)).state.requests.find((r) => r.id === b.id)!.status).toBe("annullata");
    expect(ok(doctorAct(s, b.doctorId, b.id, { type: "concludi", note: "Riepilogo di prova." }, NOW)).state.requests.find((r) => r.id === b.id)!.status).toBe("conclusa");
  });
});

describe("candidatura e assegnazione", () => {
  it("il medico diventa assegnabile solo dopo verifica E abilitazione alla prestazione", () => {
    let s = seedState(NOW);
    const c = ok(applyAsDoctor(s, { name: "Dott.ssa Prova Nuova", email: "prova@esempio.invalid", phone: "", ordine: "OMCeO Brescia n. DEMO-0100", specialtyId: null, offered: ["video"], zones: [], windows: ["pomeriggio"] }, NOW));
    s = c.state;
    const isAssignable = () => eligibleDoctors(s, "video").some((d) => d.id === c.id);
    expect(isAssignable()).toBe(false);
    expect(setDoctorEnabled(s, c.id, "video", true).ok).toBe(false); // non ancora verificato
    s = verifyDoctor(s, c.id);
    expect(isAssignable()).toBe(false); // verificato ma non abilitato
    expect(setDoctorEnabled(s, c.id, "domicilio", true).ok).toBe(false); // non l'ha offerta
    s = setDoctorEnabled(s, c.id, "video", true).state;
    expect(isAssignable()).toBe(true);
  });

  it("un candidato non verificato non vede richieste e non può essere assegnato", () => {
    let s = seedState(NOW);
    const r = ok(createRequest(s, video(at(1, 9)), NOW));
    s = r.state;
    expect(doctorRequests(s, "md-rinaldi")).toEqual([]);
    expect(assignRequest(s, r.id, "md-rinaldi", NOW)).toMatchObject({ ok: false, error: "medico-non-idoneo" });
  });

  it("l'amministrazione riassegna: il medico precedente perde l'accesso alla richiesta", () => {
    let s = seedState(NOW);
    const r = ok(createRequest(s, video(at(0, 12)), NOW));
    s = r.state;
    const first = getRequest(s, r.id)!.doctorId!;
    const other = first === "md-ferri" ? "md-bianchi" : "md-ferri";
    s = { ...s, slots: [...s.slots, { id: "extra", doctorId: other, start: at(0, 12), kinds: ["video"], open: true }] };
    s = ok(assignRequest(s, r.id, other, NOW)).state;
    expect(doctorRequest(s, first, r.id)).toBeNull();
    expect(doctorRequest(s, other, r.id)).not.toBeNull();
  });
});

describe("visita a domicilio", () => {
  it("richiesta → proposta con nome, orario, indirizzo e 149 € → conferma visibile a medico e paziente", () => {
    let s = seedState(NOW);
    const c = ok(createRequest(s, domicilio(at(1, 15), { forWhom: { self: false, name: "Anna Demo", relation: "madre" } }), NOW));
    s = c.state;
    const r = getRequest(s, c.id)!;
    expect(r.status).toBe("ricevuta");
    expect(r.doctorId).toBe("md-bianchi");
    // Prima della conferma il medico vede comune e CAP, non via e telefono.
    const dv = doctorRequest(s, "md-bianchi", c.id)!;
    expect(dv.address).toMatchObject({ comune: "Brescia", cap: "25122", street: null });
    expect(dv.contact).toBeNull();
    s = ok(doctorAct(s, "md-bianchi", c.id, { type: "accetta" }, NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "proposta", proposal: { start: at(1, 15) } });
    const f = ok(confirmRequest(s, c.id, NOW));
    expect(f.already).toBe(false);
    s = f.state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "confermata", scheduledStart: at(1, 15), priceCents: 14900, payment: { status: "pagato" } });
    expect(doctorRequest(s, "md-bianchi", c.id)!.address!.street).toContain("Via di Prova");
    expect(adminView(getRequest(s, c.id)!)).toMatchObject({ status: "confermata", zone: "Brescia 25122" });
  });

  it("fuori zona non si avvia", () => {
    const s = seedState(NOW);
    expect(createRequest(s, domicilio(at(1, 15), { address: { comune: "Milano", cap: "20121", street: "Via X", notes: "" } }), NOW)).toMatchObject({ ok: false, error: "fuori-zona" });
  });

  it("il medico rifiuta → fascia non disponibile → il paziente sceglie un'alternativa sulla stessa richiesta", () => {
    let s = seedState(NOW);
    const c = ok(createRequest(s, domicilio(at(1, 15)), NOW));
    s = ok(doctorAct(c.state, "md-bianchi", c.id, { type: "rifiuta", reason: "In quella fascia sono fuori zona." }, NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "indisponibile", doctorId: null });
    const alt = freeSlots(s, "domicilio", NOW, { cap: "25122", exceptRequestId: c.id });
    expect(alt.length).toBeGreaterThan(0);
    s = ok(chooseAlternative(s, c.id, alt[0].start, NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "ricevuta", requestedStart: alt[0].start });
    expect(s.requests.filter((r) => r.patientId === DEMO_PATIENT.id)).toHaveLength(1);
  });

  it("il paziente rifiuta l'orario proposto: sceglie un'alternativa, stessa richiesta", () => {
    let s = seedState(NOW);
    const c = ok(createRequest(s, domicilio(at(1, 15)), NOW));
    s = ok(doctorAct(c.state, "md-bianchi", c.id, { type: "accetta", start: at(1, 17) }, NOW)).state;
    s = ok(rejectProposal(s, c.id, NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "indisponibile", payment: { status: "nessuno" } });
    s = ok(chooseAlternative(s, c.id, at(2, 9), NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "ricevuta", requestedStart: at(2, 9) });
  });

  it("la proposta scade → fascia non disponibile, nessun addebito", () => {
    let s = seedState(NOW);
    const c = ok(createRequest(s, domicilio(at(1, 15)), NOW));
    s = ok(doctorAct(c.state, "md-bianchi", c.id, { type: "accetta" }, NOW)).state;
    s = sweepExpired(expireProposals(s, NOW), NOW);
    expect(getRequest(s, c.id)).toMatchObject({ status: "indisponibile", payment: { status: "nessuno" } });
  });

  it("annullamento: la fascia torna libera; se era pagata, rimborso simulato", () => {
    const b = book(seedState(NOW), domicilio(at(1, 15)));
    expect(freeSlots(b.state, "domicilio", NOW).some((x) => x.start === at(1, 15))).toBe(false);
    const s = ok(cancelRequest(b.state, b.id, NOW)).state;
    expect(getRequest(s, b.id)!.payment.status).toBe("rimborsato");
    expect(freeSlots(s, "domicilio", NOW).some((x) => x.start === at(1, 15))).toBe(true);
  });

  it("il tragitto conta: un domicilio alle 15 occupa anche le fasce video vicine dello stesso medico", () => {
    const b = book(seedState(NOW), domicilio(at(1, 15)));
    const bianchiVideo = freeSlots(b.state, "video", NOW).filter((x) => x.doctorIds.includes("md-bianchi")).map((x) => x.start);
    expect(bianchiVideo).not.toContain(at(1, 15));
    expect(bianchiVideo).not.toContain(at(1, 16)); // 15:00 + 45' + 30' di rientro = 16:15
    expect(bianchiVideo).toContain(at(1, 14)); // 14:00–14:30 finisce quando inizia il tragitto di andata
    expect(bianchiVideo).toContain(at(1, 17));
  });
});

describe("videoconsulto con medico generalista", () => {
  it("prenotazione a 69 €, sala d'attesa, problema di connessione, riconnessione e conclusione", () => {
    let s = seedState(NOW);
    const b = book(s, video(at(1, 9)));
    s = b.state;
    expect(getRequest(s, b.id)).toMatchObject({ status: "confermata", priceCents: 6900 });
    s = ok(enterWaitingRoom(s, b.id, NOW)).state;
    expect(getRequest(s, b.id)!.video.state).toBe("attesa");
    s = ok(doctorAct(s, b.doctorId, b.id, { type: "avvia" }, NOW)).state;
    s = ok(connectionProblem(s, b.id, NOW)).state;
    expect(getRequest(s, b.id)!.video.state).toBe("problema");
    s = ok(reconnect(s, b.id, NOW)).state;
    s = ok(doctorAct(s, b.doctorId, b.id, { type: "concludi", note: "Riepilogo dimostrativo." }, NOW)).state;
    expect(getRequest(s, b.id)).toMatchObject({ status: "conclusa", summary: { text: "Riepilogo dimostrativo." } });
  });

  it("riprogrammare dopo un problema di connessione non crea un secondo addebito", () => {
    let s = seedState(NOW);
    const b = book(s, video(at(1, 9)));
    s = ok(doctorAct(b.state, b.doctorId, b.id, { type: "avvia" }, NOW)).state;
    s = ok(connectionProblem(s, b.id, NOW)).state;
    s = ok(reschedule(s, b.id, at(2, 9), NOW)).state;
    expect(getRequest(s, b.id)).toMatchObject({ status: "confermata", scheduledStart: at(2, 9), payment: { attempts: 1, status: "pagato" } });
  });

  it("un video non si sovrappone a una fascia domiciliare già occupata dello stesso medico", () => {
    const b = book(seedState(NOW), domicilio(at(1, 15)));
    // Il paziente chiede un video alle 16: la dott.ssa Bianchi è occupata (tragitto), nessun altro generalista alle 16.
    expect(createRequest(b.state, video(at(1, 16)), NOW)).toMatchObject({ ok: false, error: "fascia-occupata" });
    // E il medico non può proporre quell'orario a un'altra richiesta.
    const v = ok(createRequest(b.state, video(at(1, 17)), NOW));
    expect(doctorAct(v.state, "md-bianchi", v.id, { type: "accetta", start: at(1, 16) }, NOW)).toMatchObject({ ok: false, error: "fascia-occupata" });
  });
});

describe("secondo parere specialistico", () => {
  it("lo specialista chiede un'integrazione e riprende la stessa richiesta; il caso accettato arriva a video e sintesi", () => {
    let s = seedState(NOW);
    const c = ok(createRequest(s, parere(), NOW));
    s = c.state;
    expect(getRequest(s, c.id)!.doctorId).toBe("md-conti");
    s = ok(doctorAct(s, "md-conti", c.id, { type: "chiedi-documenti", message: "Mi serve anche l'Holter." }, NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "documenti_richiesti", notice: "Mi serve anche l'Holter." });
    s = ok(addDocuments(s, c.id, [DEMO_DOCUMENTS[4]], "", NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "ricevuta" });
    expect(getRequest(s, c.id)!.documents.map((d) => d.id)).toEqual(["doc-eco", "doc-holter"]);
    expect(s.requests.filter((r) => r.kind === "parere")).toHaveLength(1);
    // Accettazione: orario, prezzo e tempi della sintesi visibili prima della conferma.
    expect(doctorAct(s, "md-conti", c.id, { type: "accetta", start: at(2, 15) }, NOW)).toMatchObject({ ok: false, error: "dati-mancanti" });
    s = ok(doctorAct(s, "md-conti", c.id, { type: "accetta", start: at(2, 15), deliveryDays: 5 }, NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "proposta", proposal: { start: at(2, 15), deliveryDays: 5 }, payment: { status: "nessuno" } });
    s = ok(confirmRequest(s, c.id, NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "confermata", priceCents: 14900, deliveryDays: 5 });
    s = ok(doctorAct(s, "md-conti", c.id, { type: "avvia" }, NOW)).state;
    s = ok(doctorAct(s, "md-conti", c.id, { type: "concludi", note: "" }, NOW)).state;
    expect(getRequest(s, c.id)!.status).toBe("sintesi");
    s = ok(doctorAct(s, "md-conti", c.id, { type: "consegna-sintesi", text: "DOCUMENTO DIMOSTRATIVO. Sintesi." }, NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "conclusa", summary: { text: "DOCUMENTO DIMOSTRATIVO. Sintesi." } });
  });

  it("il caso non accettato si chiude senza addebito, con l'eventuale percorso in presenza", () => {
    let s = seedState(NOW);
    const c = ok(createRequest(s, parere(), NOW));
    s = ok(doctorAct(c.state, "md-conti", c.id, { type: "rifiuta", reason: "Serve una visita in presenza.", inPerson: "Visita cardiologica con ecocardiogramma." }, NOW)).state;
    expect(getRequest(s, c.id)).toMatchObject({ status: "non_accettata", payment: { status: "nessuno" }, priceCents: null });
    expect(getRequest(s, c.id)!.notice).toContain("Visita cardiologica");
    expect(confirmRequest(s, c.id, NOW)).toMatchObject({ ok: false, error: "stato-non-valido" });
  });

  it("senza uno specialista che accetta nuovi casi la specialità non si avvia", () => {
    const s = { ...seedState(NOW), doctors: seedState(NOW).doctors.map((d) => (d.id === "md-conti" ? { ...d, acceptsNewOpinions: false } : d)) };
    expect(availability(s, "parere", NOW).state).toBe("nessun_medico");
    expect(createRequest(s, parere(), NOW)).toMatchObject({ ok: false, error: "specialita-chiusa" });
  });
});

describe("conflitti, pagamento e accessi", () => {
  function proposed(s0 = seedState(NOW)) {
    const c = ok(createRequest(s0, video(at(1, 9)), NOW));
    const r = getRequest(c.state, c.id)!;
    return { state: ok(doctorAct(c.state, r.doctorId!, c.id, { type: "accetta" }, NOW)).state, id: c.id };
  }

  it("doppia conferma: la seconda restituisce l'esito già registrato, senza un secondo addebito", () => {
    const p = proposed();
    const first = ok(confirmRequest(p.state, p.id, NOW));
    const second = ok(confirmRequest(first.state, p.id, later(1)));
    expect(second.already).toBe(true);
    expect(second.state).toBe(first.state);
    expect(getRequest(second.state, p.id)!.payment.attempts).toBe(1);
  });

  it("fascia occupata nel frattempo: niente addebito e alternative proposte", () => {
    const p = proposed();
    const s = occupyProposedSlot(p.state, p.id);
    const r = confirmRequest(s, p.id, NOW);
    expect(r).toMatchObject({ ok: false, error: "fascia-occupata" });
    const after = getRequest(r.state, p.id)!;
    expect(after).toMatchObject({ status: "indisponibile", payment: { status: "nessuno" }, priceCents: null });
    expect(freeSlots(r.state, "video", NOW, { exceptRequestId: p.id }).length).toBeGreaterThan(0);
  });

  it("pagamento simulato fallito: errore, nessun appuntamento; il nuovo tentativo non duplica", () => {
    const p = proposed();
    let s = setFailNextPayment(p.state, true);
    const failed = confirmRequest(s, p.id, NOW);
    expect(failed).toMatchObject({ ok: false, error: "pagamento-fallito" });
    s = failed.state;
    expect(getRequest(s, p.id)).toMatchObject({ status: "proposta", payment: { status: "fallito", attempts: 1 } });
    s = ok(confirmRequest(s, p.id, NOW)).state;
    expect(getRequest(s, p.id)).toMatchObject({ status: "confermata", payment: { status: "pagato", attempts: 2 } });
    expect(s.requests.filter((r) => r.patientId === DEMO_PATIENT.id)).toHaveLength(1);
  });

  it("la conferma riverifica: servizio sospeso o medico non più abilitato → nessun addebito", () => {
    const p = proposed();
    const sosp = confirmRequest(setServiceOpen(p.state, "video", false), p.id, NOW);
    expect(sosp).toMatchObject({ ok: false, error: "servizio-sospeso" });
    const doc = getRequest(p.state, p.id)!.doctorId!;
    const noAbil = confirmRequest(setDoctorEnabled(p.state, doc, "video", false).state, p.id, NOW);
    expect(noAbil).toMatchObject({ ok: false, error: "medico-non-abilitato" });
  });

  it("documenti visibili solo al medico assegnato; l'amministrazione vede solo la logistica", () => {
    let s = seedState(NOW);
    const c = ok(createRequest(s, parere(), NOW));
    s = c.state;
    expect(doctorRequest(s, "md-conti", c.id)!.documents).toHaveLength(1);
    expect(doctorRequest(s, "md-bianchi", c.id)).toBeNull();
    expect(doctorAct(s, "md-bianchi", c.id, { type: "chiedi-documenti", message: "x" }, NOW)).toMatchObject({ ok: false, error: "non-assegnata" });
    const a = adminView(getRequest(s, c.id)!) as unknown as Record<string, unknown>;
    for (const k of ["reason", "documents", "summary", "contact", "address", "notice", "history"]) expect(a).not.toHaveProperty(k);
    expect(JSON.stringify(a)).not.toContain("procedura");
  });
});

describe("ciclo 4: che cosa resta dopo la visita e annullamento", () => {
  it("domicilio e video si chiudono solo con un riepilogo scritto, che porta prossimo passo ed eventuale prescrizione", () => {
    const b = book(seedState(NOW), domicilio(at(1, 15)));
    expect(doctorAct(b.state, b.doctorId, b.id, { type: "concludi", note: "  " }, NOW)).toMatchObject({ ok: false, error: "dati-mancanti" });
    const done = ok(doctorAct(b.state, b.doctorId, b.id, { type: "concludi", note: "Riepilogo di prova.", nextStep: "esami", prescription: true }, NOW));
    const r = getRequest(done.state, b.id)!;
    expect(r.status).toBe("conclusa");
    expect(r.summary).toMatchObject({ text: "Riepilogo di prova.", nextStep: "esami", prescription: true });
    // L'amministrazione continua a non vedere il riepilogo.
    expect(JSON.stringify(adminView(r))).not.toContain("Riepilogo di prova.");
  });

  it("annullare entro il termine rimborsa per intero; oltre il termine no; il medico rimborsa sempre", () => {
    const b = book(seedState(NOW), domicilio(at(1, 15)));
    const start = new Date(getRequest(b.state, b.id)!.scheduledStart!);
    const early = new Date(start.getTime() - 3 * 60 * 60_000);
    const late = new Date(start.getTime() - 30 * 60_000);
    expect(refundableNow(getRequest(b.state, b.id)!, early)).toBe(true);
    expect(refundableNow(getRequest(b.state, b.id)!, late)).toBe(false);
    expect(getRequest(ok(cancelRequest(b.state, b.id, early)).state, b.id)!.payment.status).toBe("rimborsato");
    const kept = getRequest(ok(cancelRequest(b.state, b.id, late)).state, b.id)!;
    expect(kept.status).toBe("annullata");
    expect(kept.payment.status).toBe("pagato");
    expect(getRequest(ok(cancelRequest(b.state, b.id, late, "medico")).state, b.id)!.payment.status).toBe("rimborsato");
    // In ogni caso la fascia torna libera.
    expect(freeSlots(ok(cancelRequest(b.state, b.id, late)).state, "domicilio", NOW, { cap: "25122" }).some((x) => x.start === start.toISOString())).toBe(true);
    expect(cancelTerms("domicilio")).toContain("2 ore prima");
    expect(cancelTerms("video")).toContain("1 ora prima");
  });

  it("la risposta simulata del medico porta la richiesta fino al riepilogo con le stesse regole", () => {
    let s = seedState(NOW);
    const c = ok(createRequest(s, domicilio(at(1, 15)), NOW));
    s = ok(demoDoctorStep(c.state, c.id, NOW)).state;
    expect(getRequest(s, c.id)!.status).toBe("proposta");
    expect(demoDoctorStep(s, c.id, NOW).ok).toBe(false); // tocca al paziente confermare
    s = ok(confirmRequest(s, c.id, NOW)).state;
    s = ok(demoDoctorStep(s, c.id, NOW)).state;
    expect(getRequest(s, c.id)!.status).toBe("in_corso");
    s = ok(demoDoctorStep(s, c.id, NOW)).state;
    const r = getRequest(s, c.id)!;
    expect(r.status).toBe("conclusa");
    expect(r.summary?.text).toContain("RIEPILOGO DIMOSTRATIVO");
    expect(r.summary?.nextStep).toBe("medico-di-famiglia");
  });
});

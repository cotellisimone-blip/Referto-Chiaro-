import { beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { resetDatabaseForTests, withSystem, withUser } from "@/db/client";
import { createCase, getPhysicianCase, listPhysicianCases, physicianAct } from "@/domain/cases/repository";
import { cancelAppointment, createAppointment, getPhysicianAppointment, listAppointments, listPhysicianAppointments, physicianAppointmentAct } from "@/domain/appointments/repository";
import { createServiceOrder, getOrderForRef, markOrderPaid } from "@/domain/orders/repository";

/** Percorsi B e C a livello di dati: il medico vede caso e appuntamento SOLO dopo il pagamento. */
describe("secondo parere e videoconsulto: pagamento prima del medico", () => {
  const alice = randomUUID();
  const bob = randomUUID();
  const doctorUser = randomUUID();
  const physician = randomUUID();
  let doc = "";
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

  beforeAll(async () => {
    await resetDatabaseForTests();
    await withSystem(async (tx) => {
      await tx.query("INSERT INTO users(id, email) VALUES ($1, $2), ($3, $4), ($5, $6)", [alice, "alice@test.invalid", bob, "bob@test.invalid", doctorUser, "doc@test.invalid"]);
      await tx.query("UPDATE users SET role = 'physician' WHERE id = $1", [doctorUser]);
      await tx.query("INSERT INTO physicians(id, user_id, full_name, specialty, status, verified_at) VALUES ($1, $2, 'Medico di prova', 'Medicina interna', 'verified', now())", [physician, doctorUser]);
    });
    doc = await withUser(alice, async (tx) => (await tx.query<{ id: string }>("INSERT INTO documents(id, user_id, title, source_kind, source_ref, status) VALUES (gen_random_uuid(), $1, 'Doc', 'synthetic', 'demo-referto-lab-001', 'verified') RETURNING id", [alice])).rows[0].id);
  });

  it("B: il caso non pagato è invisibile al medico; dopo il pagamento sì; il rifiuto rimborsa", async () => {
    const c = await createCase(alice, { documentId: doc, specialty: "Medicina interna", question: "Vorrei un parere sui valori fuori intervallo del referto.", isSimulated: true });
    if ("error" in c) throw new Error(c.error);
    expect(await listPhysicianCases(doctorUser, physician)).toHaveLength(0);
    expect(await getPhysicianCase(doctorUser, physician, c.id)).toBeNull();
    expect(await physicianAct(doctorUser, physician, c.id, { kind: "accept" })).toEqual({ ok: false, error: "not-found" });

    const o = await createServiceOrder(alice, { service: "secondo-parere", refId: c.id, documentIds: [doc], provider: "simulated" });
    expect(o.amountCents).toBe(14900);
    expect(o.refId).toBe(c.id);
    expect(await markOrderPaid(o.id)).toBe(true);
    expect(await listPhysicianCases(doctorUser, physician)).toHaveLength(1);

    expect((await physicianAct(doctorUser, physician, c.id, { kind: "decline", reason: "Serve una visita in presenza per valutare." })).ok).toBe(true);
    expect((await getOrderForRef(alice, c.id))?.status).toBe("refunded");
  });

  it("C: videoconsulto pagato → conferma → riepilogo firmato; un altro utente non lo vede", async () => {
    const a = await createAppointment(alice, { specialty: "Medicina interna", reason: "Parlare dei valori del referto.", slots: [{ day: tomorrow, window: "mattina" }], documentIds: [doc], isSimulated: true });
    if ("error" in a) throw new Error(a.error);
    expect(await listPhysicianAppointments(doctorUser, physician)).toHaveLength(0);
    expect(await getPhysicianAppointment(doctorUser, physician, a.id)).toBeNull();

    const o = await createServiceOrder(alice, { service: "videoconsulto", refId: a.id, documentIds: [doc], provider: "simulated" });
    expect(o.amountCents).toBe(8900);
    await markOrderPaid(o.id);
    const seen = await getPhysicianAppointment(doctorUser, physician, a.id);
    expect(seen?.documents.map((d) => d.id)).toEqual([doc]);

    const when = new Date(Date.now() + 2 * 86_400_000).toISOString();
    expect((await physicianAppointmentAct(doctorUser, physician, a.id, { kind: "complete", summary: "x".repeat(50) })).ok).toBe(false);
    expect((await physicianAppointmentAct(doctorUser, physician, a.id, { kind: "confirm", scheduledAt: when, videoUrl: "https://meet.esempio.it/a" })).ok).toBe(true);
    const done = await physicianAppointmentAct(doctorUser, physician, a.id, { kind: "complete", summary: "Abbiamo parlato dei valori e delle domande per il medico curante." });
    expect(done.ok && done.appointment.status).toBe("completed");
    expect(done.ok && done.appointment.summaryHash).toMatch(/^[0-9a-f]{64}$/);

    expect(await listAppointments(bob)).toHaveLength(0);
    // Concluso: il medico non legge più i documenti.
    expect((await getPhysicianAppointment(doctorUser, physician, a.id))?.documents).toEqual([]);
  });

  it("C: annullato dopo il pagamento e prima della conferma → rimborso; dopo la conferma non si annulla", async () => {
    const a = await createAppointment(alice, { specialty: "Medicina interna", reason: "Un dubbio da chiarire a voce.", slots: [{ day: tomorrow, window: "sera" }], documentIds: [], isSimulated: true });
    if ("error" in a) throw new Error(a.error);
    const o = await createServiceOrder(alice, { service: "videoconsulto", refId: a.id, documentIds: [], provider: "simulated" });
    await markOrderPaid(o.id);
    expect(await cancelAppointment(alice, a.id)).toBe(true);
    expect((await getOrderForRef(alice, a.id))?.status).toBe("refunded");
    expect(await cancelAppointment(alice, a.id)).toBe(false);
  });

  it("upgrade: con UPGRADE_CREDIT il videoconsulto dopo «Capisci» costa solo la differenza", async () => {
    const prev = process.env.UPGRADE_CREDIT;
    process.env.UPGRADE_CREDIT = "true";
    try {
      await withSystem((tx) => tx.query("INSERT INTO orders(id, user_id, service, document_id, amount_cents, currency, status, provider, paid_at) VALUES (gen_random_uuid(), $1, 'essenziale', $2, 4900, 'eur', 'paid', 'simulated', now())", [alice, doc]));
      const a = await createAppointment(alice, { specialty: "Medicina interna", reason: "Continuare con un medico.", slots: [{ day: tomorrow, window: "pomeriggio" }], documentIds: [doc], isSimulated: true });
      if ("error" in a) throw new Error(a.error);
      const o = await createServiceOrder(alice, { service: "videoconsulto", refId: a.id, documentIds: [doc], provider: "simulated" });
      expect(o.amountCents).toBe(4000);
    } finally {
      if (prev === undefined) delete process.env.UPGRADE_CREDIT;
      else process.env.UPGRADE_CREDIT = prev;
    }
  });
});

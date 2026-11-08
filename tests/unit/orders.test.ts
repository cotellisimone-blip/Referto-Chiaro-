import { beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import Stripe from "stripe";
import { resetDatabaseForTests, withSystem, withUser } from "@/db/client";
import { createOrder, getOrder, listOrders, markOrderCancelled, markOrderFailed, markOrderPaid, recordPaymentEvent } from "@/domain/orders/repository";
import { POST as webhook } from "@/app/api/v1/payments/webhook/route";

describe("ordini e pagamenti", () => {
  const alice = randomUUID();
  const bob = randomUUID();
  let doc = "";

  async function newDoc() {
    return withUser(alice, async (tx) => {
      const r = await tx.query<{ id: string }>(
        "INSERT INTO documents(id, user_id, title, source_kind, source_ref, status) VALUES (gen_random_uuid(), $1, 'Doc', 'synthetic', 'demo-referto-lab-001', 'verified') RETURNING id",
        [alice],
      );
      return r.rows[0].id;
    });
  }
  const reports = () => withUser(alice, (tx) => tx.query("SELECT id FROM reports"));

  beforeAll(async () => {
    await resetDatabaseForTests();
    await withSystem((tx) => tx.query("INSERT INTO users(id, email) VALUES ($1, $2), ($3, $4)", [alice, "alice@test.invalid", bob, "bob@test.invalid"]));
    doc = await newDoc();
  });

  it("l'ordine nasce in attesa, con il prezzo del catalogo in centesimi", async () => {
    const o = await createOrder(alice, { service: "completo", documentId: doc, provider: "simulated" });
    expect(o).toMatchObject({ status: "pending", amountCents: 2490, currency: "eur", provider: "simulated" });
    expect((await createOrder(alice, { service: "essenziale", documentId: doc, provider: "simulated" })).amountCents).toBe(990);
  });

  it("pending → paid una sola volta e il report parte solo dopo il pagamento", async () => {
    const d = await newDoc();
    const o = await createOrder(alice, { service: "essenziale", documentId: d, provider: "simulated" });
    expect((await reports()).rows.length).toBe(0);
    expect(await markOrderPaid(o.id, "sim_x")).toBe(true);
    expect(await markOrderPaid(o.id)).toBe(false);
    const after = await getOrder(alice, o.id);
    expect(after?.status).toBe("paid");
    expect(after?.paidAt).not.toBeNull();
    const rows = await withUser(alice, (tx) => tx.query("SELECT id FROM reports WHERE document_id = $1", [d]));
    expect(rows.rows.length).toBe(1); // nessun report doppio
  });

  it("macchina a stati: solo da pending; paid non torna indietro", async () => {
    const a = await createOrder(alice, { service: "essenziale", documentId: doc, provider: "simulated" });
    expect(await markOrderFailed(a.id)).toBe(true);
    expect(await markOrderPaid(a.id)).toBe(false);
    expect(await markOrderCancelled(a.id)).toBe(false);
    expect((await getOrder(alice, a.id))?.status).toBe("failed");
    const b = await createOrder(alice, { service: "essenziale", documentId: doc, provider: "simulated" });
    expect(await markOrderPaid(b.id)).toBe(true);
    expect(await markOrderFailed(b.id)).toBe(false);
    expect(await markOrderCancelled(b.id)).toBe(false);
    const c = await createOrder(alice, { service: "essenziale", documentId: doc, provider: "simulated" });
    expect(await markOrderCancelled(c.id)).toBe(true);
    expect((await getOrder(alice, c.id))?.status).toBe("cancelled");
  });

  it("isolamento: un altro utente non vede gli ordini", async () => {
    const o = await createOrder(alice, { service: "essenziale", documentId: doc, provider: "simulated" });
    expect(await getOrder(bob, o.id)).toBeNull();
    expect(await listOrders(bob)).toEqual([]);
  });

  it("gli eventi del fornitore sono idempotenti per id", async () => {
    const id = `evt_${randomUUID()}`;
    expect(await recordPaymentEvent({ provider: "stripe", eventId: id, kind: "x", orderId: null, payload: {} })).toBe(true);
    expect(await recordPaymentEvent({ provider: "stripe", eventId: id, kind: "x", orderId: null, payload: {} })).toBe(false);
  });

  describe("webhook firmato", () => {
    const secret = "whsec_test_secret";
    function req(payload: string, sig?: string) {
      return new Request("http://localhost/api/v1/payments/webhook", { method: "POST", body: payload, headers: sig ? { "stripe-signature": sig } : {} });
    }
    function signed(payload: string) {
      return Stripe.webhooks.generateTestHeaderString({ payload, secret });
    }
    const event = (id: string, type: string, orderId: string, extra: object = {}) =>
      JSON.stringify({ id, object: "event", type, livemode: false, data: { object: { id: "cs_test_1", metadata: { orderId }, client_reference_id: orderId, ...extra } } });

    it("senza segreto, senza firma o con firma errata: 400", async () => {
      const p = event("evt_a", "checkout.session.completed", randomUUID());
      delete process.env.STRIPE_WEBHOOK_SECRET;
      expect((await webhook(req(p, signed(p)))).status).toBe(400);
      process.env.STRIPE_WEBHOOK_SECRET = secret;
      expect((await webhook(req(p))).status).toBe(400);
      expect((await webhook(req(p, "t=1,v1=00"))).status).toBe(400);
    });

    it("completed paga l'ordine una volta; il reinvio è un duplicato", async () => {
      process.env.STRIPE_WEBHOOK_SECRET = secret;
      const d = await newDoc();
      const o = await createOrder(alice, { service: "essenziale", documentId: d, provider: "stripe-test" });
      const p = event(`evt_${randomUUID()}`, "checkout.session.completed", o.id, { payment_status: "paid" });
      const r1 = await webhook(req(p, signed(p)));
      expect(r1.status).toBe(200);
      expect((await getOrder(alice, o.id))?.status).toBe("paid");
      const r2 = await webhook(req(p, signed(p)));
      expect(r2.status).toBe(200);
      expect((await r2.json()).duplicate).toBe(true);
      const rows = await withUser(alice, (tx) => tx.query("SELECT id FROM reports WHERE document_id = $1", [d]));
      expect(rows.rows.length).toBe(1);
    });

    it("un evento live non vale con la chiave di test (e viceversa)", async () => {
      process.env.STRIPE_WEBHOOK_SECRET = secret;
      const o = await createOrder(alice, { service: "essenziale", documentId: doc, provider: "stripe-test" });
      const live = JSON.stringify({ id: `evt_${randomUUID()}`, object: "event", type: "checkout.session.completed", livemode: true, data: { object: { id: "cs_live_1", metadata: { orderId: o.id }, payment_status: "paid" } } });
      expect((await webhook(req(live, signed(live)))).status).toBe(400);
      expect((await getOrder(alice, o.id))?.status).toBe("pending");
    });

    it("expired annulla; completed non pagato non paga", async () => {
      process.env.STRIPE_WEBHOOK_SECRET = secret;
      const o = await createOrder(alice, { service: "essenziale", documentId: doc, provider: "stripe-test" });
      const unpaid = event(`evt_${randomUUID()}`, "checkout.session.completed", o.id, { payment_status: "unpaid" });
      expect((await webhook(req(unpaid, signed(unpaid)))).status).toBe(200);
      expect((await getOrder(alice, o.id))?.status).toBe("pending");
      const exp = event(`evt_${randomUUID()}`, "checkout.session.expired", o.id);
      expect((await webhook(req(exp, signed(exp)))).status).toBe(200);
      expect((await getOrder(alice, o.id))?.status).toBe("cancelled");
    });
  });
});

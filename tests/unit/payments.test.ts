import { describe, expect, it } from "vitest";
import { getPaymentProvider, PaymentsMisconfiguredError } from "@/lib/payments";
import { simulatedProvider } from "@/lib/payments/simulated";
import { readFlags, CapabilityDisabledError } from "@/lib/feature-flags";

describe("scelta del fornitore di pagamento", () => {
  it("profilo vetrina: sempre simulato, anche con una chiave di test o live", () => {
    expect(getPaymentProvider({ SITE_PROFILE: "vetrina", STRIPE_SECRET_KEY: "sk_test_abc" }).kind).toBe("simulated");
    expect(getPaymentProvider({ SITE_PROFILE: "vetrina", STRIPE_SECRET_KEY: "sk_live_abc" }).kind).toBe("simulated");
  });

  it("senza chiave: simulato", () => {
    expect(getPaymentProvider({}).kind).toBe("simulated");
    expect(getPaymentProvider({ STRIPE_SECRET_KEY: "  " }).kind).toBe("simulated");
  });

  it("chiave di test: stripe-test, anche in demo", () => {
    expect(getPaymentProvider({ STRIPE_SECRET_KEY: "sk_test_abc" }).kind).toBe("stripe-test");
  });

  it("chiave live in demo: sempre rifiutata, mai ripiego sul simulato", () => {
    const env = { STRIPE_SECRET_KEY: "sk_live_abc", ENABLE_LIVE_PAYMENTS: "true", PRODUCTION_COMPLIANCE_APPROVED: "true" };
    expect(() => getPaymentProvider(env)).toThrow(CapabilityDisabledError);
  });

  it("chiave live senza flag o senza approvazione: rifiutata", () => {
    expect(() => getPaymentProvider({ STRIPE_SECRET_KEY: "sk_live_abc", DEMO_MODE: "false" })).toThrow(CapabilityDisabledError);
    expect(() => getPaymentProvider({ STRIPE_SECRET_KEY: "sk_live_abc", DEMO_MODE: "false", ENABLE_LIVE_PAYMENTS: "true" })).toThrow(/compliance-not-approved/);
  });

  it("chiave live con flag, approvazione e fuori demo: stripe-live", () => {
    const env = { STRIPE_SECRET_KEY: "sk_live_abc", DEMO_MODE: "false", ENABLE_LIVE_PAYMENTS: "true", PRODUCTION_COMPLIANCE_APPROVED: "true" };
    expect(getPaymentProvider(env, readFlags(env)).kind).toBe("stripe-live");
  });

  it("formato di chiave sconosciuto: errore", () => {
    expect(() => getPaymentProvider({ STRIPE_SECRET_KEY: "rk_test_abc" })).toThrow(PaymentsMisconfiguredError);
    expect(() => getPaymentProvider({ STRIPE_SECRET_KEY: "qualcosa" })).toThrow(PaymentsMisconfiguredError);
  });

  it("il checkout simulato è una pagina interna", async () => {
    const r = await simulatedProvider.createCheckout({ id: "abc", service: "essenziale", amountCents: 990, currency: "eur" }, { successUrl: "x", cancelUrl: "y" });
    expect(r).toEqual({ checkoutUrl: "/area-personale/ordini/abc", providerRef: "sim_abc" });
  });
});

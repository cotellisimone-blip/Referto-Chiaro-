import { describe, expect, it } from "vitest";
import { readFlags, requireCapability, publicConfig, CapabilityDisabledError } from "@/lib/feature-flags";

describe("feature gate fail-closed", () => {
  it("di default tutto ciò che è sensibile è spento", () => {
    const f = readFlags({});
    expect(f.demoMode).toBe(true);
    for (const k of ["realUploads", "aiProcessing", "livePayments", "medicalSecondOpinion", "medicalVideoConsult"] as const) {
      expect(() => requireCapability(k, f)).toThrow(CapabilityDisabledError);
    }
    expect(publicConfig(f).capabilities).toEqual({
      realUploads: false,
      aiProcessing: false,
      livePayments: false,
      medicalSecondOpinion: false,
      medicalVideoConsult: false,
      publicSignup: false,
    });
  });

  it("valori ambigui non accendono nulla", () => {
    const f = readFlags({ ENABLE_REAL_UPLOADS: "TRUE", ENABLE_AI_PROCESSING: "1", ENABLE_LIVE_PAYMENTS: "yes" });
    expect(f.realUploads || f.aiProcessing || f.livePayments).toBe(false);
  });

  it("il flag da solo non basta senza approvazione compliance", () => {
    const f = readFlags({ DEMO_MODE: "false", ENABLE_REAL_UPLOADS: "true" });
    expect(() => requireCapability("realUploads", f)).toThrow(/compliance-not-approved/);
  });

  it("in demo i servizi sensibili restano bloccati anche con approvazione", () => {
    const f = readFlags({ ENABLE_LIVE_PAYMENTS: "true", PRODUCTION_COMPLIANCE_APPROVED: "true" });
    expect(() => requireCapability("livePayments", f)).toThrow(/demo-mode/);
  });

  it("si attiva solo con flag + approvazione + fuori demo", () => {
    const f = readFlags({ DEMO_MODE: "false", PRODUCTION_COMPLIANCE_APPROVED: "true", ENABLE_AI_PROCESSING: "true" });
    expect(() => requireCapability("aiProcessing", f)).not.toThrow();
  });
});

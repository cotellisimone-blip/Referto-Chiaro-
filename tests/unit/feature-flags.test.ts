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

describe("profilo vetrina (ciclo 1)", () => {
  it("spegne tutto ciò che tocca dati reali, soldi o medici, anche con gli interruttori accesi per errore", () => {
    const f = readFlags({
      SITE_PROFILE: "vetrina",
      DEMO_MODE: "false",
      PRODUCTION_COMPLIANCE_APPROVED: "true",
      ENABLE_REAL_UPLOADS: "true",
      ENABLE_AI_PROCESSING: "true",
      ENABLE_LIVE_PAYMENTS: "true",
      ENABLE_MEDICAL_SECOND_OPINION: "true",
      ENABLE_MEDICAL_VIDEO_CONSULT: "true",
      ENABLE_PUBLIC_SIGNUP: "true",
      ENABLE_PUNTO_DI_PARTENZA_SAVE: "true",
    });
    expect(f.vetrina).toBe(true);
    expect(f.demoMode).toBe(true);
    expect(f.productionComplianceApproved).toBe(false);
    for (const k of ["realUploads", "aiProcessing", "livePayments", "medicalSecondOpinion", "medicalVideoConsult", "publicSignup", "puntoDiPartenzaSave"] as const) {
      expect(f[k]).toBe(false);
      expect(() => requireCapability(k, f)).toThrow(CapabilityDisabledError);
    }
    expect(f.puntoDiPartenza).toBe(true);
    expect(publicConfig(f).profile).toBe("vetrina");
  });
  it("si attiva solo con il valore «vetrina»", () => {
    expect(readFlags({}).vetrina).toBe(false);
    expect(readFlags({ SITE_PROFILE: "standard" }).vetrina).toBe(false);
    expect(readFlags({ SITE_PROFILE: " Vetrina " }).vetrina).toBe(true);
  });
});

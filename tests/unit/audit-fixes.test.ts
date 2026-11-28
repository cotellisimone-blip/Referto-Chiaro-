import { describe, expect, it } from "vitest";
import { readFlags } from "@/lib/feature-flags";
import { base32Encode, totpMatchStep, verifyTotp } from "@/lib/auth/totp";
import { openSecret, sealSecret, secretsAtRestEncrypted } from "@/lib/auth/secret-box";
import { parseReferenceRange } from "@/domain/extraction/reference";
import { clientKey } from "@/lib/rate-limit";
import { PRIVILEGED_SESSION_TTL_MS, SESSION_TTL_MS, sessionTtlMs } from "@/lib/auth/tokens";

describe("correzioni dell'audit", () => {
  it("DEMO_MODE assente: demo accesa fuori produzione, spenta in produzione", () => {
    expect(readFlags({ NODE_ENV: "development" }).demoMode).toBe(true);
    expect(readFlags({ NODE_ENV: "production" }).demoMode).toBe(false);
    expect(readFlags({ NODE_ENV: "production", DEMO_MODE: "true" }).demoMode).toBe(true);
  });

  it("TOTP: il passo del codice accettato permette di rifiutare il riuso", () => {
    const secret = base32Encode(Buffer.from("12345678901234567890"));
    const step = totpMatchStep(secret, "287082", 59_000);
    expect(step).toBe(1);
    expect(totpMatchStep(secret, "000000", 59_000)).toBeNull();
    expect(verifyTotp(secret, "287082", 59_000)).toBe(true);
  });

  it("segreti TOTP cifrati a riposo quando c'è la chiave, in chiaro altrimenti", () => {
    const env = { MFA_SECRET_KEY: "ab".repeat(32) };
    const sealed = sealSecret("JBSWY3DPEHPK3PXP", env);
    expect(sealed.startsWith("enc:v1:")).toBe(true);
    expect(openSecret(sealed, env)).toBe("JBSWY3DPEHPK3PXP");
    expect(sealSecret("X", {})).toBe("X");
    expect(secretsAtRestEncrypted({})).toBe(false);
    expect(() => sealSecret("X", { MFA_SECRET_KEY: "corta" })).toThrow();
    expect(() => openSecret(sealed, {})).toThrow();
  });

  it("«inferiore a» e «superiore a» sono limiti stretti", () => {
    expect(parseReferenceRange("inferiore a 200")).toMatchObject({ kind: "below", inclusive: false });
    expect(parseReferenceRange("<= 200")).toMatchObject({ kind: "below", inclusive: true });
    expect(parseReferenceRange("superiore a 40")).toMatchObject({ kind: "above", inclusive: false });
  });

  it("X-Forwarded-For contato solo dietro proxy fidato", () => {
    const req = new Request("http://x", { headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" } });
    expect(clientKey(req, {})).toBe("local");
    expect(clientKey(req, { TRUST_PROXY: "true" })).toBe("1.2.3.4");
  });

  it("sessioni brevi per medici e admin", () => {
    expect(sessionTtlMs("user")).toBe(SESSION_TTL_MS);
    expect(sessionTtlMs("physician")).toBe(PRIVILEGED_SESSION_TTL_MS);
    expect(PRIVILEGED_SESSION_TTL_MS).toBeLessThan(SESSION_TTL_MS);
  });
});

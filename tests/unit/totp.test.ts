import { describe, expect, it } from "vitest";
import { base32Decode, base32Encode, totpCode, verifyTotp } from "@/lib/auth/totp";

describe("TOTP", () => {
  it("vettore RFC 6238 (SHA1, 6 cifre)", () => {
    // Segreto "12345678901234567890" in base32; T=59s → 287082 (RFC 6238, troncato a 6 cifre)
    const secret = base32Encode(Buffer.from("12345678901234567890"));
    expect(totpCode(secret, 59_000)).toBe("287082");
    expect(totpCode(secret, 1_111_111_109_000)).toBe("081804");
  });
  it("base32 andata e ritorno", () => {
    const buf = Uint8Array.from([1, 2, 3, 250, 251, 252, 0]);
    expect(base32Decode(base32Encode(buf))).toEqual(buf);
  });
  it("verifica con finestra ±1 e rifiuta codici malformati", () => {
    const secret = base32Encode(Buffer.from("12345678901234567890"));
    expect(verifyTotp(secret, "287082", 59_000)).toBe(true);
    expect(verifyTotp(secret, "287082", 59_000 + 30_000)).toBe(true);
    expect(verifyTotp(secret, "287082", 59_000 + 61_000)).toBe(false);
    expect(verifyTotp(secret, "28708", 59_000)).toBe(false);
    expect(verifyTotp(secret, "abcdef", 59_000)).toBe(false);
  });
});

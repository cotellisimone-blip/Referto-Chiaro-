import { describe, expect, it } from "vitest";
import { readTitolare } from "@/domain/titolare";

describe("titolare pubblico", () => {
  it("senza nome e P.IVA non mostra nulla (mai segnaposto)", () => {
    expect(readTitolare({})).toBeNull();
    expect(readTitolare({ PUBLIC_OWNER_NAME: "Mario Rossi" })).toBeNull();
    expect(readTitolare({ PUBLIC_OWNER_VAT: "01234567890" })).toBeNull();
    expect(readTitolare({ PUBLIC_OWNER_NAME: "  ", PUBLIC_OWNER_VAT: "01234567890" })).toBeNull();
  });
  it("con nome e P.IVA restituisce i dati, pulendo gli spazi", () => {
    expect(readTitolare({ PUBLIC_OWNER_NAME: " Esempio S.r.l. ", PUBLIC_OWNER_VAT: "01234567890", PUBLIC_OWNER_EMAIL: "" })).toEqual({
      name: "Esempio S.r.l.",
      vat: "01234567890",
      address: undefined,
      email: undefined,
      pec: undefined,
    });
  });
});

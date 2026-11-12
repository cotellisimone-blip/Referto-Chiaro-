import { describe, expect, it } from "vitest";
import { safeAreaNext } from "@/lib/auth/next-path";

describe("safeAreaNext", () => {
  it("accetta le pagine dell'area personale", () => {
    expect(safeAreaNext("/area-personale/appuntamenti")).toBe("/area-personale/appuntamenti");
    expect(safeAreaNext("/area-personale/secondo-parere/")).toBe("/area-personale/secondo-parere");
    expect(safeAreaNext("/area-personale")).toBe("/area-personale");
  });
  it("rifiuta tutto il resto", () => {
    for (const bad of [null, undefined, "", "/", "//evil.com", "https://evil.com/area-personale", "/area-personale.evil", "/area-personale/../admin", "/area-personale/x?y=1", "/admin", "/area-personale//evil.com", "/area-personale/%2F%2Fevil"]) {
      expect(safeAreaNext(bad)).toBe("/area-personale");
    }
  });
});

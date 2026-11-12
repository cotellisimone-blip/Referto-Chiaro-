import { describe, expect, it } from "vitest";
import { PUBLIC_EVENTS, SOURCES, detectSource, isPublicEvent, toSource } from "@/domain/metrics/funnel";

const own = "curaprivata.it";

describe("sorgente della visita (ciclo 2, fase 2)", () => {
  it("utm_source riconosciuto vince sul sito di provenienza", () => {
    expect(detectSource({ search: "?utm_source=facebook", referrer: "https://www.google.com/", ownHost: own })).toBe("facebook");
    expect(detectSource({ search: "?utm_source=IG", referrer: "", ownHost: own })).toBe("instagram");
    expect(detectSource({ search: "?utm_source=medico", referrer: "", ownHost: own })).toBe("medico");
  });
  it("utm_source sconosciuto diventa «altro», mai testo libero", () => {
    expect(detectSource({ search: "?utm_source=mario.rossi@gmail.com", referrer: "", ownHost: own })).toBe("altro");
  });
  it("provenienza dai siti noti", () => {
    expect(detectSource({ search: "", referrer: "https://www.google.it/", ownHost: own })).toBe("google");
    expect(detectSource({ search: "", referrer: "https://l.facebook.com/l.php?u=x", ownHost: own })).toBe("facebook");
    expect(detectSource({ search: "", referrer: "https://wa.me/", ownHost: own })).toBe("whatsapp");
    expect(detectSource({ search: "", referrer: "https://blog.qualcosa.it/post", ownHost: own })).toBe("altro");
  });
  it("nessuna provenienza o stessa origine = diretto", () => {
    expect(detectSource({ search: "", referrer: "", ownHost: own })).toBe("diretto");
    expect(detectSource({ search: "", referrer: `https://${own}/prezzi`, ownHost: own })).toBe("diretto");
  });
  it("toSource accetta solo l'elenco chiuso", () => {
    for (const s of SOURCES) expect(toSource(s)).toBe(s);
    expect(toSource("'; DROP TABLE x; --")).toBe("altro");
    expect(toSource(42)).toBe("altro");
  });
  it("i nuovi eventi della vetrina sono pubblici e accettati", () => {
    for (const e of ["visita-capisci", "esempio-completato", "esempio-pdf", "avvisami-capisci", "avvisami-medico", "avvisami-parere"]) {
      expect(PUBLIC_EVENTS).toContain(e);
      expect(isPublicEvent(e)).toBe(true);
    }
    expect(isPublicEvent("email-di-qualcuno")).toBe(false);
  });
});

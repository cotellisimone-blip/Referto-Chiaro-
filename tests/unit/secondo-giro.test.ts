import { describe, expect, test } from "vitest";
import { buildSearchIndex, searchSite } from "@/lib/search-index";
import { editDistance, stripQualifiers } from "@/lib/search-core";

/** Secondo giro di 20 interventi (18/11/2026). Un blocco per punto, con il numero dell'elenco approvato. */
describe("punto 1: la ricerca capisce come si scrive davvero", () => {
  const index = buildSearchIndex();
  const first = (q: string) => searchSite(index, q, 6).items[0]?.href;
  const all = (q: string) => searchSite(index, q, 6).items.map((i) => i.href);

  test.each([
    ["glicemia alta", "/guide/glicemia"],
    ["ferro basso", "/guide/sideremia"],
    ["globuli bianchi alti", "/guide/globuli-bianchi-e-formula-leucocitaria"],
    ["colesterolo alto", "/guide/colesterolo-totale"],
    ["valori della tiroide", "/guide/tsh"],
    ["che cosa significa tsh alto", "/guide/tsh"],
    ["emocrmo", "/guide/emocromo"],
    ["colestrolo", "/guide/colesterolo-totale"],
    ["creatinna", "/guide/creatinina"],
    ["transaminsi", "/guide/transaminasi-alt-ast"],
    ["feritina", "/guide/ferritina"],
    ["glicmia", "/guide/glicemia"],
    ["diabete", "/guide/glicemia"],
    ["prezzo", "/prezzi"],
    ["quanto costa", "/prezzi"],
    ["cancellare account", "/sicurezza-e-privacy"],
    ["accedi", "/accedi"],
    ["pdf", "/referti/esempio"],
    ["strumenti", "/strumenti"],
    ["glossario", "/glossario"],
    ["anemia", "/guide/emocromo"],
    ["tiroide", "/guide/tsh"],
    ["vitamina d", "/guide/vitamina-d"],
    ["tsh", "/guide/tsh"],
    ["psa", "/guide/psa"],
    ["ves", "/guide/ves"],
    ["holter", "/guide/holter-ecg"],
    ["medico a casa", "/medici"],
    ["privacy", "/privacy-policy"],
    ["esami del sangue", "/guide/emocromo"],
  ])("«%s» trova %s", (q, href) => {
    expect(all(q), q).toContain(href);
  });

  test("la ricerca esatta non cambia: chi scrive la sigla trova prima la sua guida", () => {
    expect(first("tsh")).toBe("/guide/tsh");
    expect(first("emocromo")).toBe("/guide/emocromo");
    expect(searchSite(index, "tsh").mode).toBe("esatta");
  });

  test("dice quale strada ha preso", () => {
    expect(searchSite(index, "glicemia alta")).toMatchObject({ mode: "senza-aggettivi", used: "glicemia" });
    expect(searchSite(index, "emocrmo")).toMatchObject({ mode: "simile", used: "emocromo" });
  });

  test("le sigle corte non si «correggono»: una sigla sbagliata non porta a un altro esame", () => {
    expect(searchSite(index, "tsx").items).toEqual([]);
    expect(searchSite(index, "xyzqwk").items).toEqual([]);
  });

  test("distanza di modifica e parole di contorno", () => {
    expect(editDistance("emocrmo", "emocromo")).toBe(1);
    expect(editDistance("emocormo", "emocromo")).toBe(1);
    expect(editDistance("glicemia", "creatinina")).toBeGreaterThan(2);
    expect(stripQualifiers("Che cosa significa la Glicemia alta?")).toBe("glicemia");
    expect(stripQualifiers("alto")).toBe("");
  });
});

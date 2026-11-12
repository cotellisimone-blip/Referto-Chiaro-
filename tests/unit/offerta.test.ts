import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { CORE_SERVICES, PRICES, PUBLIC_PROFESSIONALS, capisciPriceCents, entryPriceLabel, firstPromoEnabled, firstRefertoCents, formatEuro, orderAmountCents, priceCents, priceLabel, upgradeCostCents, upgradeEnabled } from "@/domain/offerta";
import { buildVisitPlan, parseVisitParams } from "@/content/preparati-visita";
import { ctaForCategory } from "@/components/offerta/contextual-cta";
import { isSafeVideoUrl } from "@/domain/appointments/repository";

function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.tsx?$/.test(f)) out.push(p);
  }
  return out;
}

describe("offerta: tre servizi, prezzi da un'unica fonte", () => {
  it("i tre servizi protagonisti, nell'ordine dei livelli e dei prezzi (ciclo 1)", () => {
    expect(CORE_SERVICES.map((s) => s.name)).toEqual(["Capisci il tuo referto", "Videoconsulto con medico generalista", "Secondo parere specialistico"]);
    expect(CORE_SERVICES.map((s) => s.level.n)).toEqual([1, 2, 3]);
  });

  it("listino 12/11: primo referto 2,90 €, poi 7,90 € · videoconsulto 69 € · secondo parere 149 € fisso", () => {
    expect(PRICES).toEqual({ CAPISCI_STANDARD: 790, CAPISCI_FIRST: 290, MEDICO_GENERALISTA: 6900, SECONDO_PARERE_BASE: 14900 });
    expect(priceCents("capisci", {})).toBe(790);
    expect(priceCents("secondo-parere", {})).toBe(14900);
    expect(priceCents("parla-con-un-medico", {})).toBe(6900);
    expect(capisciPriceCents(true, {})).toBe(290);
    expect(capisciPriceCents(false, {})).toBe(790);
    const sp = (x: string) => x.replace(/\s/g, " ");
    expect(sp(priceLabel("capisci", {}))).toBe("Primo referto 2,90 €, poi 7,90 € per referto");
    expect(sp(priceLabel("parla-con-un-medico", {}))).toBe("69 €");
    expect(sp(priceLabel("secondo-parere", {}))).toBe("149 €");
    expect(sp(entryPriceLabel({}))).toBe("2,90 €");
    expect(sp(formatEuro(990))).toBe("9,90 €");
  });

  it("la promozione del primo referto si spegne da configurazione e non supera mai il prezzo standard", () => {
    expect(capisciPriceCents(true, { FIRST_REFERTO_PROMO: "false" })).toBe(790);
    expect(priceLabel("capisci", { FIRST_REFERTO_PROMO: "false" }).replace(/\s/g, " ")).toBe("7,90 € per referto");
    expect(firstRefertoCents({ PRICE_CAPISCI_FIRST_CENTS: "5000" })).toBe(790);
    expect(firstRefertoCents({ PRICE_CAPISCI_FIRST_CENTS: "190" })).toBe(190);
    expect(firstPromoEnabled({})).toBe(true);
  });

  it("Capisci è automatico: nessun medico, nessuna revisione umana promessa", () => {
    const c = CORE_SERVICES.find((s) => s.id === "capisci")!;
    const txt = [c.oneLiner, c.who, c.timing, ...c.includes, ...c.steps.map((x) => x.text)].join(" ").toLowerCase();
    expect(c.who).toMatch(/nessun medico/i);
    expect(txt).not.toMatch(/un medico (ti )?(aiuta|rivede|controlla)|revisione (umana|medica)|entro 24 ore/);
  });

  it("Parla con un medico: generalista/internista, senza scegliere la specialità", () => {
    const m = CORE_SERVICES.find((s) => s.id === "parla-con-un-medico")!;
    expect(m.who).toMatch(/medicina generale o internista/);
    expect(m.steps.map((s) => s.text).join(" ")).not.toMatch(/Indichi la specialità/);
  });

  it("si cambiano da variabile d'ambiente; valori non validi tornano al riferimento", () => {
    expect(priceCents("capisci", { PRICE_CAPISCI_CENTS: "990" })).toBe(990);
    expect(priceCents("capisci", { PRICE_CAPISCI_CENTS: "-1" })).toBe(790);
    expect(priceCents("capisci", { PRICE_CAPISCI_CENTS: "7,90€" })).toBe(790);
    expect(priceCents("capisci", { PRICE_CAPISCI_CENTS: "9999999" })).toBe(790);
    expect(orderAmountCents("videoconsulto", { PRICE_VIDEOCONSULTO_CENTS: "9900" })).toBe(9900);
  });

  it("upgrade Capisci → medico: si paga la differenza, ed è spento salvo UPGRADE_CREDIT=true", () => {
    expect(upgradeCostCents("capisci", "parla-con-un-medico", {})).toBe(6110);
    expect(upgradeEnabled({})).toBe(false);
    expect(upgradeEnabled({ UPGRADE_CREDIT: "true" })).toBe(true);
  });

  it("nessun prezzo scritto a mano nei componenti: passano tutti da offerta.ts", () => {
    const files = walk("src/components").concat(walk("src/app")).filter((f) => !f.includes(`${path.sep}api${path.sep}`));
    const hits = files.filter((f) => /(?:da |€ ?)(?:2,90|7,90|49|69|79|89|149)\b|\b(?:2,90|7,90|49|69|79|89|149) ?€/.test(readFileSync(f, "utf8")));
    expect(hits).toEqual([]);
  });

  it("nessun professionista di esempio pubblicato", () => {
    expect(PUBLIC_PROFESSIONALS).toEqual([]);
    const src = walk("src").map((f) => readFileSync(f, "utf8")).join("\n");
    expect(src).not.toMatch(/Marco Bianchi|Marco Ferri|12345/);
  });
});

describe("Preparati alla visita", () => {
  it("compone la lista da identificatori fissi, sempre con le voci di base", () => {
    const p = buildVisitPlan({ type: "specialistica", have: ["farmaci"], topics: ["farmaci"] });
    expect(p.bring).toContain("Tessera sanitaria e documento d'identità");
    expect(p.bring.some((x) => x.includes("impegnativa"))).toBe(true);
    expect(p.bring.some((x) => x.includes("farmaci"))).toBe(true);
    expect(p.ask.some((x) => x.includes("farmaco"))).toBe(true);
    expect(new Set(p.ask).size).toBe(p.ask.length);
  });

  it("l'URL accetta solo valori noti (niente testo libero)", () => {
    const sp = new URLSearchParams("tipo=<script>&ho=referti,xxx&temi=capire,%20drop");
    expect(parseVisitParams(sp)).toEqual({ type: null, have: ["referti"], topics: ["capire"] });
  });

  it("nessun linguaggio diagnostico nelle domande suggerite", () => {
    const p = buildVisitPlan({ type: "nuovo", have: [], topics: ["capire", "disturbo", "farmaci", "esami", "abitudini", "lavoro"] });
    const all = [...p.bring, ...p.prepare, ...p.ask].join(" ").toLowerCase();
    for (const b of ["sei malato", "è normale", "nella norma", "diagnosi:"]) expect(all).not.toContain(b);
  });
});

describe("CTA contestuali e videoconsulto", () => {
  it("laboratorio → Capisci; immagini ed endoscopie → Secondo parere", () => {
    expect(ctaForCategory("tiroide")).toBe("capisci");
    expect(ctaForCategory("immagini")).toBe("secondo-parere");
    expect(ctaForCategory("endoscopie")).toBe("secondo-parere");
    expect(ctaForCategory(undefined)).toBe("capisci");
  });

  it("il collegamento video accetta solo https senza credenziali", () => {
    expect(isSafeVideoUrl("https://meet.esempio.it/stanza-1")).toBe(true);
    expect(isSafeVideoUrl("http://meet.esempio.it/x")).toBe(false);
    expect(isSafeVideoUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeVideoUrl("https://utente:pw@meet.esempio.it")).toBe(false);
    expect(isSafeVideoUrl("https://localhost/x")).toBe(false);
  });
});

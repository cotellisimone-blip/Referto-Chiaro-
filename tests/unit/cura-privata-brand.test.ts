import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { ECOSYSTEM, publicPricesEnabled } from "@/domain/ecosystem";

/** Controlli del rebrand Cura Privata (kit 8/11/2026). */
function walk(dir: string, out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|css|sql|svg)$/.test(f)) out.push(p);
  }
  return out;
}
const SOURCES = [...walk("src"), ...walk("public")];
const norm = (f: string) => f.split(path.sep).join("/");

describe("rebrand Cura Privata", () => {
  it("il vecchio nome compare solo nella nota storica di Chi siamo", () => {
    const hits = SOURCES.filter((f) => /referto ?chiaro|referto-chiaro/i.test(readFileSync(f, "utf8"))).map(norm);
    expect(hits).toEqual(["src/app/chi-siamo/page.tsx"]);
  });

  it("nessun prezzo scritto a mano nelle pagine pubbliche (il listino passa dal flag)", () => {
    const pages = SOURCES.map(norm).filter((f) => f.startsWith("src/app/") && !f.includes("/area-personale/") && !f.includes("/api/"));
    const withPrice = pages.filter((f) => /\d+,\d{2}\s?€|da \d+\s?€/.test(readFileSync(f, "utf8")));
    expect(withPrice).toEqual([]);
    expect(readFileSync("src/content/faq.ts", "utf8")).not.toMatch(/\d+,\d{2}\s?€/);
  });

  it('il listino di riferimento è pubblico e si spegne solo con ENABLE_PUBLIC_PRICES="false"', () => {
    expect(publicPricesEnabled({})).toBe(true);
    expect(publicPricesEnabled({ ENABLE_PUBLIC_PRICES: "false" })).toBe(false);
  });

  it("i tre servizi protagonisti sono provabili (demo); archivio e prevenzione restano in preparazione", () => {
    const usable = ECOSYSTEM.filter((s) => s.status !== "in-preparation").map((s) => s.id);
    expect(usable.sort()).toEqual(["guide", "referti", "secondo-parere", "visite"]);
    for (const s of ECOSYSTEM.filter((x) => x.status === "in-preparation")) {
      expect(s.href.startsWith("/servizi/")).toBe(true);
    }
  });

  it("nessuna frase vietata dal kit nel sito", () => {
    const banned = [/conform[ei] al GDPR/i, /GDPR compliant/i, /sicuro al 100/i, /in totale sicurezza/i, /medici qualificati/i, /professionisti qualificati/i, /approvato da medici/i, /tutto nella norma/i, /in pochi minuti/i, /iscrizione albo: \d/i, /\d(,\d)? ?stelle/i, /\d+\.?\d* pazienti soddisfatti/i];
    const offenders = SOURCES.filter((f) => f.endsWith(".tsx")).flatMap((f) => {
      const t = readFileSync(f, "utf8");
      return banned.filter((b) => b.test(t)).map((b) => `${norm(f)}: ${b}`);
    });
    expect(offenders).toEqual([]);
  });
});

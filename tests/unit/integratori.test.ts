import { describe, expect, it } from "vitest";
import { GUIDES } from "@/content/guides";
import { FORBIDDEN_PHRASES } from "@/content/guides/schema";
import { INTEGRATORI, INTEGRATORI_PRIMA_DI_TUTTO, INTEGRATORI_SOURCE_DOMAINS, IntegratoreSchema, type Integratore } from "@/content/integratori";

/** Parole in più vietate per gli integratori: niente inviti a comprare, niente dosi, niente promesse. */
const EXTRA = ["prendine", "assumine", "compra", "acquista", "consigliat", "raccomandiamo", "dose", "mg ", " ui ", "rinforza", "potenzia", "brucia", "dimagr", "miracol", "naturale quindi"];

function text(i: Integratore): string {
  return [i.name, i.oneLine, i.summary, ...i.whatItIs, ...i.whereFound, ...i.whyTalked, i.onReport.text, ...i.careful, ...i.questions].join("\n").toLowerCase();
}

describe("guide agli integratori", () => {
  it("rispettano lo schema e hanno slug unici", () => {
    for (const i of INTEGRATORI) {
      const r = IntegratoreSchema.safeParse(i);
      expect(r.success, `${i.slug}: ${r.success ? "" : JSON.stringify(r.error.issues)}`).toBe(true);
    }
    expect(new Set(INTEGRATORI.map((i) => i.slug)).size).toBe(INTEGRATORI.length);
  });

  it("non usano linguaggio diagnostico, prescrittivo o commerciale", () => {
    for (const i of INTEGRATORI) {
      const t = text(i);
      const bad = [...FORBIDDEN_PHRASES, ...EXTRA].filter((p) => t.includes(p));
      expect(bad, i.slug).toEqual([]);
    }
    const intro = INTEGRATORI_PRIMA_DI_TUTTO.join(" ").toLowerCase();
    expect(FORBIDDEN_PHRASES.filter((p) => intro.includes(p))).toEqual([]);
  });

  it("collegano solo guide esistenti e fonti ammesse", () => {
    const slugs = new Set(GUIDES.map((g) => g.slug));
    for (const i of INTEGRATORI) {
      if (i.onReport.guide) expect(slugs.has(i.onReport.guide), `${i.slug} → ${i.onReport.guide}`).toBe(true);
      for (const s of i.sources) {
        const h = new URL(s.url).hostname;
        expect(INTEGRATORI_SOURCE_DOMAINS.some((d) => h === d || h.endsWith(`.${d}`)), s.url).toBe(true);
      }
    }
  });
});

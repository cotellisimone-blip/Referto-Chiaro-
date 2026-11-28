import { describe, expect, it } from "vitest";
import { MALATTIE, contaParole, malattiePerGuida, testoMalattia } from "@/content/malattie";
import { MALATTIE_EXTRA_FORBIDDEN, MALATTIE_SOURCE_DOMAINS, MalattiaSchema } from "@/content/malattie/schema";
import { FORBIDDEN_PHRASES } from "@/content/guides/schema";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { TITLE_MAX, TITLE_SUFFIX, malattiaIndexable } from "@/lib/seo";
import { DIARI } from "@/domain/diari/catalogo";

const guide = new Set(GUIDES.map((g) => g.slug));
const glossario = new Set(GLOSSARY.map((e) => e.slug));

describe("pagine per malattia (22/11/2026)", () => {
  it("sono dieci, con slug unici, e rispettano lo schema", () => {
    expect(MALATTIE).toHaveLength(10);
    expect(new Set(MALATTIE.map((m) => m.slug)).size).toBe(10);
    for (const m of MALATTIE) {
      const r = MalattiaSchema.safeParse(m);
      expect(r.success, `${m.slug}: ${r.success ? "" : JSON.stringify(r.error.issues)}`).toBe(true);
    }
  });

  it("nessuna frase diagnostica, prescrittiva o promessa", () => {
    for (const m of MALATTIE) {
      const t = testoMalattia(m);
      expect(FORBIDDEN_PHRASES.filter((p) => t.toLowerCase().includes(p)), m.slug).toEqual([]);
      for (const { regola, re } of MALATTIE_EXTRA_FORBIDDEN) expect(re.test(t), `${m.slug}: ${regola} → ${t.match(re)?.[0]}`).toBe(false);
    }
  });

  it("almeno 600 parole proprie per pagina: niente pagine sottili", () => {
    for (const m of MALATTIE) expect(contaParole(testoMalattia(m)), m.slug).toBeGreaterThanOrEqual(600);
  });

  it("guide, glossario, diari e pagine collegate esistono", () => {
    const diari = new Set(DIARI.map((d) => d.slug));
    for (const m of MALATTIE) {
      for (const e of m.esami) expect(guide.has(e.guida), `${m.slug} → guida ${e.guida}`).toBe(true);
      for (const g of m.glossario) expect(glossario.has(g), `${m.slug} → glossario ${g}`).toBe(true);
      if (m.diario) expect(diari.has(m.diario.slug)).toBe(true);
      expect(m.correlate).not.toContain(m.slug);
      expect(m.esami.length > 0 || Boolean(m.esamiNota), m.slug).toBe(true);
    }
  });

  it("ogni pagina riceve almeno un collegamento da un'altra pagina di malattia (nessuna orfana)", () => {
    for (const m of MALATTIE) expect(MALATTIE.some((x) => x.correlate.includes(m.slug)), m.slug).toBe(true);
  });

  it("fonti solo da istituzioni e società scientifiche", () => {
    for (const m of MALATTIE)
      for (const f of m.fonti) {
        const host = new URL(f.url).hostname.replace(/^www\./, "");
        expect(MALATTIE_SOURCE_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`)), `${m.slug}: ${f.url}`).toBe(true);
      }
  });

  it("titoli per Google entro 65 caratteri con il nome del sito, descrizioni entro 160", () => {
    for (const m of MALATTIE) {
      expect((m.seoTitle + TITLE_SUFFIX).length, m.seoTitle).toBeLessThanOrEqual(TITLE_MAX);
      expect(m.metaDescription.length).toBeLessThanOrEqual(160);
    }
    expect(new Set(MALATTIE.map((m) => m.seoTitle.toLowerCase())).size).toBe(10);
  });

  it("una ricerca, una pagina: nessuna frase cercata è assegnata a due malattie", () => {
    const viste = new Map<string, string>();
    for (const m of MALATTIE)
      for (const r of m.ricerche) {
        const k = r.toLowerCase();
        expect(viste.get(k), `«${r}» in ${m.slug} e ${viste.get(k)}`).toBeUndefined();
        viste.set(k, m.slug);
      }
  });

  it("restano bozze fuori da Google finché un medico non le rivede, anche con l'indicizzazione accesa", () => {
    for (const m of MALATTIE) {
      expect(m.revisione.stato).toBe("bozza");
      expect(malattiaIndexable(m, { ENABLE_INDEXING: "true" })).toBe(false);
    }
    expect(malattiaIndexable({ revisione: { stato: "rivista" } }, { ENABLE_INDEXING: "true" })).toBe(true);
    expect(malattiaIndexable({ revisione: { stato: "rivista" } }, {})).toBe(false);
  });

  it("ogni guida citata sa a quali malattie riportare", () => {
    expect(malattiePerGuida("tsh").map((m) => m.slug)).toContain("tiroide");
    expect(malattiePerGuida("ferritina").map((m) => m.slug)).toEqual(["anemia"]);
  });
});

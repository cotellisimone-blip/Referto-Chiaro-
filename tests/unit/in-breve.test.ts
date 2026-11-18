import { describe, expect, it } from "vitest";
import { GUIDES } from "@/content/guides";
import { IN_BREVE } from "@/content/guides/in-breve";
import { firstSentence } from "@/components/guide/guide-article";

describe("riquadro «In breve» delle guide", () => {
  it("ogni riga scritta a mano appartiene a una guida esistente", () => {
    const slugs = new Set(GUIDES.map((g) => g.slug));
    for (const slug of Object.keys(IN_BREVE)) expect(slugs.has(slug), slug).toBe(true);
  });
  it("nessuna riga è troncata e nessuna supera le 135 battute", () => {
    for (const g of GUIDES) {
      const what = IN_BREVE[g.slug]?.what ?? firstSentence(g.sections.whatItMeasures[0]);
      const when = IN_BREVE[g.slug]?.when ?? firstSentence(g.sections.whyRequested[0]);
      for (const line of [what, when]) {
        expect(line.endsWith("…"), `${g.slug}: ${line}`).toBe(false);
        expect(/[.!?]$/.test(line), `${g.slug}: ${line}`).toBe(true);
        expect(line.length, `${g.slug}: ${line}`).toBeLessThanOrEqual(135);
        expect(line.length, `${g.slug}: ${line}`).toBeGreaterThanOrEqual(40);
      }
    }
  });
});

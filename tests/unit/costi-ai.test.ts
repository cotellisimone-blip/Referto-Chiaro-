import { describe, expect, it } from "vitest";
import { aiCostUsd, marginPerReport, stripeFeeCents, summarizeAiRuns, USAGE_SCENARIOS } from "@/domain/costi-ai";
import { PRICES } from "@/domain/offerta";

describe("costi AI", () => {
  it("calcola il costo con le tariffe per milione di token", () => {
    expect(aiCostUsd("claude-opus-5-5", { inputTokens: 1_000_000, outputTokens: 1_000_000 })).toBe(24);
    expect(aiCostUsd("claude-sonnet-5-5", { inputTokens: 1_000_000, outputTokens: 0 })).toBe(2);
    expect(aiCostUsd("claude-haiku-5-5", { inputTokens: 0, outputTokens: 1_000_000 })).toBe(0.5);
  });

  it("un modello sconosciuto usa la tariffa più alta (mai sottostimare)", () => {
    const u = { inputTokens: 10_000, outputTokens: 10_000 };
    expect(aiCostUsd("modello-futuro", u)).toBe(aiCostUsd("claude-opus-5-5", u));
  });

  it("commissione Stripe carte SEE: 1,5% + 0,25 €", () => {
    expect(stripeFeeCents(290)).toBe(29);
    expect(stripeFeeCents(790)).toBe(37);
  });

  it("i referti a 2,90 e 7,90 € restano in margine anche nello scenario pesante con il modello più caro", () => {
    for (const price of [PRICES.CAPISCI_FIRST, PRICES.CAPISCI_STANDARD]) {
      const m = marginPerReport(price, "claude-opus-5-5", USAGE_SCENARIOS.pesante.usage);
      expect(m.marginCents).toBeGreaterThan(0);
      expect(m.netOfVatCents - m.stripeCents - m.aiCents).toBe(m.marginCents);
    }
  });

  it("riassume ai_runs per documento", () => {
    const s = summarizeAiRuns([
      { model: "claude-opus-5-5", target_id: "a", input_tokens: 1000, output_tokens: 2000 },
      { model: "claude-opus-5-5", target_id: "a", input_tokens: 1000, output_tokens: null },
      { model: "claude-haiku-5-5", target_id: "b", input_tokens: 0, output_tokens: 0 },
    ]);
    expect(s.documents).toBe(2);
    expect(s.runs).toBe(3);
    expect(s.usd).toBeCloseTo(0.048, 6);
    expect(s.usdPerDocument).toBeCloseTo(0.024, 6);
  });
});

/**
 * Costi del motore AI e margine per referto. Unica fonte dei numeri usati in admin e in docs/COSTI_OPERATIVI.md.
 *
 * Le tariffe dei modelli sono quelle pubblicate da Anthropic (USD per milione di token, novembre 2026).
 * Le commissioni Stripe sono quelle della pagina prezzi italiana (carte standard SEE, verificata l'11/11/2026).
 * Cambio USD→EUR e IVA sono ipotesi da confermare: stanno qui come costanti, non nascoste nei calcoli.
 */

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

/** USD per milione di token: [input, output]. */
export const MODEL_PRICES_USD: Record<string, readonly [number, number]> = {
  "claude-opus-5-5": [4, 20],
  "claude-sonnet-5-5": [2, 10],
  "claude-haiku-5-5": [0.1, 0.5],
};

/** Modello sconosciuto: si usa la tariffa più alta, così il costo non viene mai sottostimato. */
const FALLBACK_PRICE: readonly [number, number] = [4, 20];

export const USD_TO_EUR = 0.9; // ipotesi, da aggiornare
export const VAT_RATE = 0.22; // ipotesi: servizio digitale non sanitario; da confermare con il commercialista
export const STRIPE_EEA_CARD = { percent: 0.015, fixedCents: 25 } as const;

export function aiCostUsd(model: string, u: TokenUsage): number {
  const [pin, pout] = MODEL_PRICES_USD[model] ?? FALLBACK_PRICE;
  return (u.inputTokens * pin + u.outputTokens * pout) / 1_000_000;
}

export function stripeFeeCents(grossCents: number): number {
  return Math.round(grossCents * STRIPE_EEA_CARD.percent) + STRIPE_EEA_CARD.fixedCents;
}

/**
 * Scenari di consumo per un referto (somma dei tre passi: trascrizione, struttura, spiegazione).
 * Sono STIME ricavate dalla lunghezza dei prompt e dei referti sintetici, non misure: la valutazione dal vivo
 * (`EVAL_LIVE=1 npm run eval:ai`) le sostituirà con numeri reali.
 */
export const USAGE_SCENARIOS: Record<"pdf-testo" | "tipico" | "pesante", { label: string; usage: TokenUsage }> = {
  "pdf-testo": { label: "PDF con testo, 1 pagina, ~25 esami (senza trascrizione)", usage: { inputTokens: 3_600, outputTokens: 9_000 } },
  tipico: { label: "Foto di 1 pagina, ~25 esami", usage: { inputTokens: 5_600, outputTokens: 11_500 } },
  pesante: { label: "Foto di 3 pagine, ~60 esami, un nuovo tentativo", usage: { inputTokens: 15_000, outputTokens: 35_000 } },
};

export interface MarginRow {
  priceCents: number;
  netOfVatCents: number;
  stripeCents: number;
  aiCents: number;
  marginCents: number;
}

/** Margine lordo per referto venduto: prezzo al netto IVA − commissione Stripe − costo AI. */
export function marginPerReport(priceCents: number, model: string, usage: TokenUsage): MarginRow {
  const netOfVatCents = Math.round(priceCents / (1 + VAT_RATE));
  const stripeCents = stripeFeeCents(priceCents);
  const aiCents = Math.round(aiCostUsd(model, usage) * USD_TO_EUR * 100);
  return { priceCents, netOfVatCents, stripeCents, aiCents, marginCents: netOfVatCents - stripeCents - aiCents };
}

/** Riepilogo dei passi registrati in `ai_runs`: totale e costo medio per documento elaborato. */
export function summarizeAiRuns(rows: { model: string; target_id: string; input_tokens: number | null; output_tokens: number | null }[]) {
  let usd = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  const targets = new Set<string>();
  for (const r of rows) {
    const u = { inputTokens: r.input_tokens ?? 0, outputTokens: r.output_tokens ?? 0 };
    usd += aiCostUsd(r.model, u);
    inputTokens += u.inputTokens;
    outputTokens += u.outputTokens;
    targets.add(r.target_id);
  }
  return { runs: rows.length, documents: targets.size, inputTokens, outputTokens, usd, usdPerDocument: targets.size ? usd / targets.size : 0 };
}

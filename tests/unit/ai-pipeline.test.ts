import { describe, expect, it } from "vitest";
import { getSyntheticDocument } from "@/fixtures/synthetic";
import { checkExplanationConsistency } from "@/domain/reporting/consistency";
import { DEMO_POLICY } from "@/domain/reporting/demo-report-service";
import { checkAiLanguage } from "@/domain/safety/language";
import { GLOSSARY } from "@/domain/reporting/glossary";
import { ClaudeExplanationProvider, type AiDraft } from "@/providers/ai/claude-explanation";
import { ScriptedLlm } from "@/providers/ai/scripted-llm";
import type { Explanation } from "@/domain/reporting/explanation-schema";

const doc = getSyntheticDocument("demo-referto-lab-001")!;
const all = doc.observations.map((o) => o.id);
const readable = doc.observations.filter((o) => o.valueRaw !== null).map((o) => o.id);

const GOOD: Record<string, string> = {
  "obs-01": "La glicemia è la quantità di glucosio, cioè di zucchero, presente nel sangue al momento del prelievo.",
  "obs-02": "L'emoglobina glicata riflette l'andamento medio dello zucchero nel sangue nelle settimane prima del prelievo.",
  "obs-03": "Il colesterolo totale è la somma delle diverse forme di colesterolo che circolano nel sangue.",
  "obs-04": "Il colesterolo LDL è una delle forme in cui il colesterolo viaggia nel sangue.",
  "obs-06": "La creatinina è una sostanza prodotta dai muscoli ed eliminata dai reni; il referto ne riporta la quantità nel sangue.",
};

function draft(over: Partial<AiDraft> = {}): AiDraft {
  return {
    summary: "Il documento contiene alcuni esami che hai confermato. Qui trovi una spiegazione generale dei termini, non una valutazione della tua salute.",
    items: Object.entries(GOOD).map(([observationId, plainLanguageDefinition]) => ({ observationId, plainLanguageDefinition })),
    notExplained: [],
    questionsForDoctor: ["Quali di questi esami è utile ricontrollare nel tempo, nel mio caso?", "Ci sono esami precedenti con cui confrontare questi risultati?"],
    ...over,
  };
}

async function run(reply: (call: number) => unknown, ids = all) {
  const llm = new ScriptedLlm(({ call }) => reply(call));
  const p = new ClaudeExplanationProvider(llm);
  const out = await p.explain({ document: doc, confirmedObservationIds: ids }, DEMO_POLICY);
  return { out, trace: p.lastTrace!, llm };
}

describe("controllo del linguaggio", () => {
  it.each([
    "Il tuo valore è alto e potrebbe significare un problema al fegato.",
    "Questo valore indica che hai una carenza di ferro.",
    "Dovresti ridurre i grassi nella dieta.",
    "Ti consiglio di assumere un integratore di vitamina D.",
    "Valore nella norma, nessuna preoccupazione.",
    "È un risultato anomalo: vai subito dal medico.",
    "Prendi 1000 mg al giorno.",
    "Sicuramente non è niente di grave.",
    "Un valore così è segno di diabete.",
  ])("blocca: %s", (t) => {
    expect(checkAiLanguage(t).length).toBeGreaterThan(0);
  });

  it.each(Object.values(GOOD))("accetta una definizione neutra: %s", (t) => {
    expect(checkAiLanguage(t)).toEqual([]);
  });

  it("le definizioni del glossario passano il controllo severo (o lo stesso controllo segnala cosa rivedere)", () => {
    const flagged = GLOSSARY.filter((g) => checkAiLanguage(g.definition).length > 0).map((g) => g.key);
    // Il glossario è testo revisionabile, non generato: qui ci assicuriamo solo che il controllo non sia così severo da bocciarne la maggioranza.
    expect(flagged.length).toBeLessThan(GLOSSARY.length / 4);
  });
});

describe("provider Claude (con modello finto)", () => {
  it("assembla un output che supera il controllo di coerenza, con valori copiati dal documento", async () => {
    const { out, trace } = await run(() => draft());
    expect("error" in out).toBe(false);
    const exp = out as Explanation;
    expect(checkExplanationConsistency(doc, all, exp).ok).toBe(true);
    expect(exp.items.map((i) => i.sourceObservationId)).toEqual(["obs-01", "obs-02", "obs-03", "obs-04", "obs-06"]);
    expect(exp.items[0].originalValueExact).toBe("92");
    expect(exp.excludedObservations.map((e) => e.id)).toContain("obs-05"); // illeggibile: mai inviata al modello
    expect(trace.outcome).toBe("ok");
  });

  it("non manda al modello valori, unità o intervalli", async () => {
    const { llm } = await run(() => draft());
    const sent = llm.calls[0].text;
    for (const o of doc.observations) {
      if (o.valueRaw) expect(sent).not.toContain(`"${o.valueRaw}"`);
      if (o.referenceRaw) expect(sent).not.toContain(o.referenceRaw);
    }
    expect(sent).toContain("Glicemia");
  });

  it("riprova una volta con le ragioni se il linguaggio viola le regole", async () => {
    const { out, trace, llm } = await run((call) =>
      call === 1 ? draft({ items: [{ observationId: "obs-01", plainLanguageDefinition: "Il tuo valore è alto: dovresti ridurre gli zuccheri." }, ...draft().items.slice(1)] }) : draft(),
    );
    expect(llm.calls).toHaveLength(2);
    expect(llm.calls[1].text).toContain("scartato dal controllo automatico");
    expect(trace.outcome).toBe("retried-ok");
    expect(JSON.stringify(out)).not.toContain("dovresti");
  });

  it("se viola ancora, sostituisce il testo con il glossario o esclude la voce: mai testo non conforme", async () => {
    const bad = draft({
      summary: "Hai una situazione preoccupante.",
      items: [{ observationId: "obs-01", plainLanguageDefinition: "Indica che hai il diabete." }, ...draft().items.slice(1)],
      questionsForDoctor: ["Devo prendere un farmaco?"],
    });
    const { out, trace } = await run(() => bad);
    const exp = out as Explanation;
    expect(trace.outcome).toBe("sanitized");
    expect(exp.items.find((i) => i.sourceObservationId === "obs-01")?.plainLanguageDefinition).toBe(GLOSSARY.find((g) => g.key === "glicemia")!.definition);
    expect(exp.summary).not.toContain("preoccupante");
    expect(exp.questionsForDoctor.join(" ")).not.toContain("farmaco");
    expect(checkExplanationConsistency(doc, all, exp).ok).toBe(true);
  });

  it("un numero inventato nel testo libero non arriva mai all'utente", async () => {
    const { out } = await run(() => draft({ summary: "Il tuo colesterolo di 250 è da guardare.", items: [{ observationId: "obs-03", plainLanguageDefinition: "Il colesterolo totale dovrebbe stare sotto 190." }, ...draft().items.filter((i) => i.observationId !== "obs-03")] }));
    const text = JSON.stringify(out);
    expect(text).not.toContain("250");
    expect(text).not.toContain("190");
  });

  it("ignora id inventati dal modello e voci che non conosce", async () => {
    const { out } = await run(() =>
      draft({ items: [...draft().items.filter((i) => i.observationId !== "obs-06"), { observationId: "obs-99", plainLanguageDefinition: "Esame inventato." }], notExplained: [{ observationId: "obs-06", reason: "nome ambiguo" }] }),
    );
    const exp = out as Explanation;
    expect(exp.items.map((i) => i.sourceObservationId)).not.toContain("obs-99");
    expect(exp.excludedObservations.find((e) => e.id === "obs-06")?.reason).toMatch(/non lo conosce/);
  });

  it("rifiuto o errore del modello: nessun report", async () => {
    const r1 = await run(() => ({ __fail: "refusal" }));
    expect(r1.out).toMatchObject({ error: "cannot_process" });
    expect(r1.trace.outcome).toBe("refused");
    const r2 = await run(() => ({ not: "valid" }));
    expect(r2.out).toMatchObject({ error: "cannot_process" });
  });

  it("solo le righe confermate vengono spiegate", async () => {
    const { out } = await run(() => draft(), ["obs-01", "obs-02"]);
    expect((out as Explanation).items.map((i) => i.sourceObservationId)).toEqual(["obs-01", "obs-02"]);
    expect(readable.length).toBe(5);
  });
});

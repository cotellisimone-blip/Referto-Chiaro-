import { beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import {
  buildTimeline,
  chartGeometry,
  NEL_TEMPO_LIMITI,
  type TimelineInput,
} from "@/domain/famiglia/nel-tempo";
import {
  buildIcs,
  daysBetween,
  isPlausibleDue,
  needsEmail,
  sortPromemoria,
  whenLabel,
} from "@/domain/famiglia/promemoria";
import {
  PersonaInputSchema,
  initials,
  profileIdForDb,
  BASI,
  DICHIARAZIONE,
} from "@/domain/famiglia/persone";
import {
  famigliaIncludes,
  famigliaPrice,
  SPAZIO_GRATUITO,
} from "@/domain/famiglia/piano";
import {
  DEMO_HISTORY,
  getSyntheticDocument,
  listSyntheticSamples,
} from "@/fixtures/synthetic";
import {
  checkAiLanguage,
  findForbiddenPhrases,
} from "@/domain/safety/language";
import { resetDatabaseForTests, withSystem } from "@/db/client";
import {
  createPersona,
  deletePersona,
  listPersone,
  loadDemoHistory,
  timelineFor,
  listPromemoria,
  createPromemoria,
} from "@/domain/famiglia/repository";
import {
  createSyntheticDocument,
  listDocuments,
} from "@/domain/pipeline/repository";

/** Salute nel tempo e famiglia (13/11/2026): calcoli, testi senza giudizi clinici, promemoria, isolamento. */

const all = (id: string, title = id): TimelineInput => {
  const d = getSyntheticDocument(id)!;
  return {
    documentId: id,
    title,
    extracted: d,
    confirmedObservationIds: d.observations.map((o) => o.id),
  };
};
const lucia = DEMO_HISTORY.filter((h) => h.owner === "lucia").map((h) =>
  all(h.sampleId, h.title),
);
const io = [
  ...DEMO_HISTORY.filter((h) => h.owner === "io").map((h) => all(h.sampleId)),
  all("demo-referto-lab-001"),
  all("demo-referto-lipidico-004"),
];

describe("storico di esempio", () => {
  it("sette referti inventati, fuori dal catalogo dei referti da scegliere", () => {
    expect(DEMO_HISTORY).toHaveLength(7);
    expect(DEMO_HISTORY.filter((h) => h.owner === "lucia")).toHaveLength(4);
    const catalog = new Set(listSyntheticSamples().map((s) => s.id));
    for (const h of DEMO_HISTORY) {
      expect(catalog.has(h.sampleId)).toBe(false);
      const d = getSyntheticDocument(h.sampleId)!;
      expect(d.isSynthetic).toBe(true);
      expect(d.laboratoryName).toMatch(/inesistente/);
      for (const o of d.observations)
        expect(d.sourceLines.some((l) => l.text === o.sourceTextExact)).toBe(
          true,
        );
    }
  });
});

describe("nel tempo", () => {
  const t = buildTimeline(lucia);

  it("mette in fila gli stessi esami, in ordine di data", () => {
    expect(t.documentCount).toBe(4);
    expect(t.span).toEqual({ from: "2025-03-14", to: "2026-09-15" });
    const crea = t.series.find((s) => s.name === "Creatinina")!;
    expect(crea.points.map((p) => p.valueRaw)).toEqual([
      "0,84",
      "0,88",
      "0,93",
      "0,97",
    ]);
    expect(crea.band).toEqual({ low: 0.5, high: 0.9, raw: "0,50 - 0,90" });
    expect(crea.changeText).toBe(
      "Dal 14/03/2025 al 15/09/2026: da 0,84 a 0,97 mg/dL (+0,13).",
    );
    expect(crea.lastStepText).toBe("Rispetto al 12/03/2026: +0,04 mg/dL.");
  });

  it("prima gli esami con l'ultimo numero fuori dall'intervallo stampato, ognuno con la sua domanda", () => {
    const first = t.series
      .slice(0, 3)
      .map((s) => s.name)
      .sort();
    expect(first).toEqual(["Creatinina", "Emoglobina", "Glicemia"]);
    expect(
      t.series.find((s) => s.name === "Emoglobina")!.lastPositionText,
    ).toBe("Ultimo numero sotto l'intervallo stampato");
    expect(t.questions).toHaveLength(3);
    expect(t.questions.find((q) => q.startsWith("Glicemia"))).toContain(
      "da 97 a 104 mg/dL",
    );
  });

  it("solo i valori confermati e leggibili entrano nel grafico", () => {
    const self = buildTimeline(io);
    const trig = self.series.find((s) => s.name === "Trigliceridi")!;
    // Il referto del 04/11/2026 ha i trigliceridi illeggibili: restano fuori.
    expect(trig.points.map((p) => p.date)).toEqual([
      "2023-11-10",
      "2024-11-08",
      "2025-11-06",
      "2026-05-20",
    ]);
    const ldl = self.series.find((s) => s.name === "Colesterolo LDL")!;
    expect(ldl.points).toHaveLength(5);
    // Valore non confermato: fuori.
    const partial = buildTimeline(
      io.map((x) => ({
        ...x,
        confirmedObservationIds: x.confirmedObservationIds.filter(
          (id) => id !== "obs-01",
        ),
      })),
    );
    expect(partial.series.find((s) => s.name === "Glicemia")).toBeUndefined();
  });

  it("unità diverse: righe separate e una nota", () => {
    const a = all("demo-storico-lucia-2025-03");
    const b = all("demo-storico-lucia-2025-09");
    const changed = {
      ...b,
      extracted: {
        ...b.extracted,
        observations: b.extracted.observations.map((o) =>
          o.nameRaw === "Glicemia"
            ? { ...o, unitRaw: "mmol/L", valueRaw: "5,6" }
            : o,
        ),
      },
    };
    const tl = buildTimeline([a, changed]);
    expect(tl.series.find((s) => s.name === "Glicemia")).toBeUndefined();
    expect(tl.single.filter((s) => s.name === "Glicemia")).toHaveLength(2);
    expect(tl.notes.join(" ")).toMatch(/unità di misura diverse/);
  });

  it("i testi non contengono giudizi clinici né frasi vietate", () => {
    const texts = [
      ...buildTimeline(lucia).series,
      ...buildTimeline(io).series,
    ].flatMap((s) => [
      s.changeText ?? "",
      s.lastStepText ?? "",
      s.lastPositionText,
      s.question ?? "",
    ]);
    texts.push(
      ...NEL_TEMPO_LIMITI,
      ...Object.values(BASI),
      DICHIARAZIONE,
      ...SPAZIO_GRATUITO,
      ...famigliaIncludes(),
    );
    for (const x of texts.filter(Boolean)) {
      expect(findForbiddenPhrases(x), x).toEqual([]);
      // Il controllo severo per l'AI, tranne il riferimento al 112 nelle limitazioni.
      expect(
        checkAiLanguage(x).filter(
          (v) => !(v.rule === "triage" && x.includes("112")),
        ),
        x,
      ).toEqual([]);
    }
  });

  it("il disegno resta dentro il riquadro", () => {
    for (const s of buildTimeline(io).series) {
      const g = chartGeometry(s);
      for (const p of g.points) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(100);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe("promemoria", () => {
  it("dice quando, in parole", () => {
    expect(whenLabel("2026-11-13", "2026-11-13")).toBe("Oggi");
    expect(whenLabel("2026-11-14", "2026-11-13")).toBe("Domani");
    expect(whenLabel("2026-11-19", "2026-11-13")).toBe("Tra 6 giorni");
    expect(whenLabel("2026-12-11", "2026-11-13")).toBe("Tra 4 settimane");
    expect(whenLabel("2027-03-12", "2026-11-13")).toBe("Il 12/03/2027");
    expect(whenLabel("2026-11-10", "2026-11-13")).toBe("3 giorni fa");
    expect(daysBetween("2026-11-13", "2027-11-13")).toBe(365);
  });

  it("accetta solo date vere e vicine", () => {
    expect(isPlausibleDue("2026-11-20", "2026-11-13")).toBe(true);
    expect(isPlausibleDue("2026-02-30", "2026-11-13")).toBe(false);
    expect(isPlausibleDue("2040-01-01", "2026-11-13")).toBe(false);
    expect(isPlausibleDue("2024-01-01", "2026-11-13")).toBe(false);
  });

  it("l'email parte una volta, entro tre giorni", () => {
    expect(
      needsEmail(
        { dueDate: "2026-11-16", doneAt: null, emailSentAt: null },
        "2026-11-13",
      ),
    ).toBe(true);
    expect(
      needsEmail(
        { dueDate: "2026-11-17", doneAt: null, emailSentAt: null },
        "2026-11-13",
      ),
    ).toBe(false);
    expect(
      needsEmail(
        { dueDate: "2026-11-16", doneAt: null, emailSentAt: "x" },
        "2026-11-13",
      ),
    ).toBe(false);
    expect(
      needsEmail(
        { dueDate: "2026-11-16", doneAt: "x", emailSentAt: null },
        "2026-11-13",
      ),
    ).toBe(false);
  });

  it("prima quelli da fare, dal più vicino", () => {
    const s = sortPromemoria([
      { dueDate: "2026-12-01", doneAt: null },
      { dueDate: "2026-11-20", doneAt: "2026-11-10T00:00:00Z" },
      { dueDate: "2026-11-15", doneAt: null },
    ]);
    expect(s.map((x) => x.dueDate)).toEqual([
      "2026-11-15",
      "2026-12-01",
      "2026-11-20",
    ]);
  });

  it("file di calendario valido, con avviso il giorno prima", () => {
    const ics = buildIcs(
      {
        id: "abc",
        title: "Visita, con la mamma; porta gli esami",
        dueDate: "2026-11-19",
        kind: "visita",
      },
      "Lucia",
      new Date("2026-11-13T10:00:00Z"),
    );
    expect(ics).toContain("DTSTART;VALUE=DATE:20261119\r\n");
    expect(ics).toContain("DTEND;VALUE=DATE:20261120\r\n");
    expect(ics).toContain(
      "SUMMARY:Visita\\, con la mamma\\; porta gli esami (Lucia)",
    );
    expect(ics).toContain("TRIGGER:-P1D");
    for (const line of ics.split("\r\n"))
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  });
});

describe("persone e piano", () => {
  it("serve la dichiarazione", () => {
    expect(
      PersonaInputSchema.safeParse({
        name: "Mamma",
        relation: "genitore",
        basis: "consenso",
        declaration: true,
      }).success,
    ).toBe(true);
    expect(
      PersonaInputSchema.safeParse({
        name: "Mamma",
        relation: "genitore",
        basis: "consenso",
        declaration: false,
      }).success,
    ).toBe(false);
    expect(
      PersonaInputSchema.safeParse({
        name: "",
        relation: "genitore",
        basis: "consenso",
        declaration: true,
      }).success,
    ).toBe(false);
    expect(initials("Lucia (esempio)")).toBe("L");
    expect(initials("Papà")).toBe("P");
    expect(initials("(?)")).toBe("?");
    expect(initials("Lucia Rossi")).toBe("LR");
    expect(profileIdForDb("io")).toBeNull();
  });

  it("il piano Famiglia è una proposta, con prezzo da variabile d'ambiente", () => {
    const p = famigliaPrice({});
    expect(p.proposal).toBe(true);
    expect(p.amount).toMatch(/^39\s?€$/);
    expect(p.breakEven).toBe(5);
    expect(famigliaPrice({ PRICE_FAMIGLIA_YEAR_CENTS: "4900" }).amount).toMatch(
      /^49\s?€$/,
    );
    expect(famigliaPrice({ PRICE_FAMIGLIA_YEAR_CENTS: "abc" }).amount).toMatch(
      /^39\s?€$/,
    );
  });
});

describe("famiglia nel database (RLS)", () => {
  const alice = randomUUID();
  const bob = randomUUID();
  beforeAll(async () => {
    await resetDatabaseForTests();
    await withSystem((tx) =>
      tx.query("INSERT INTO users(id, email) VALUES ($1, $2), ($3, $4)", [
        alice,
        "alice-fam@test.invalid",
        bob,
        "bob-fam@test.invalid",
      ]),
    );
  });

  it("lo storico di esempio crea Lucia, sette referti confermati e due promemoria, una volta sola", async () => {
    const r = await loadDemoHistory(alice, "2026-11-13");
    expect(r.added).toBe(7);
    expect((await loadDemoHistory(alice, "2026-11-13")).added).toBe(0);
    const persone = await listPersone(alice);
    expect(persone.map((p) => p.name)).toEqual(["Lucia (esempio)"]);
    const docs = await listDocuments(alice);
    expect(docs.filter((d) => d.profileId === r.luciaId)).toHaveLength(4);
    const reminders = await listPromemoria(alice);
    expect(reminders).toHaveLength(2);
    expect(reminders[0].kind).toBe("visita");
    expect(reminders[0].questions.length).toBe(3);
    const t = await timelineFor(alice, r.luciaId);
    expect(t!.timeline.series.length).toBe(6);
    // Il titolare vede solo i suoi referti nella sua linea.
    const self = await timelineFor(alice, "io");
    expect(self!.timeline.documentCount).toBe(3);
  });

  it("un altro utente non vede i familiari, non ci aggiunge referti né promemoria", async () => {
    const luciaId = (await listPersone(alice))[0].id;
    expect(await listPersone(bob)).toEqual([]);
    expect(await timelineFor(bob, luciaId)).toBeNull();
    await expect(
      createSyntheticDocument(bob, "demo-referto-lab-001", "x", luciaId),
    ).rejects.toThrow(/profile-not-found/);
    expect(
      await createPromemoria(bob, {
        kind: "visita",
        title: "x",
        dueDate: "2026-11-20",
        profileId: luciaId,
      }),
    ).toBeNull();
    expect(await deletePersona(bob, luciaId)).toBe(false);
  });

  it("eliminare un familiare elimina i suoi referti e promemoria", async () => {
    const out = await createPersona(bob, {
      name: "Nonno",
      relation: "nonno",
      basis: "consenso",
      declaration: true,
    });
    expect(out.ok).toBe(true);
    const id = out.ok ? out.id : "";
    await createSyntheticDocument(
      bob,
      "demo-referto-lab-001",
      "Referto del nonno",
      id,
    );
    await createPromemoria(bob, {
      kind: "controllo",
      title: "Esami",
      dueDate: "2026-12-01",
      profileId: id,
    });
    expect(await deletePersona(bob, id)).toBe(true);
    expect(
      (await listDocuments(bob)).filter((d) => d.profileId === id),
    ).toEqual([]);
    expect(await listPromemoria(bob)).toEqual([]);
  });

  it("al massimo cinque familiari", async () => {
    const u = randomUUID();
    await withSystem((tx) =>
      tx.query("INSERT INTO users(id, email) VALUES ($1, $2)", [
        u,
        "cinque@test.invalid",
      ]),
    );
    for (let i = 0; i < 5; i++)
      expect(
        (
          await createPersona(u, {
            name: `P${i}`,
            relation: "altro",
            basis: "consenso",
            declaration: true,
          })
        ).ok,
      ).toBe(true);
    expect(
      await createPersona(u, {
        name: "P6",
        relation: "altro",
        basis: "consenso",
        declaration: true,
      }),
    ).toEqual({ ok: false, error: "limit-reached" });
  });
});

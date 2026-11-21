import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { DIARI, DIARI_BOZZA, DIARI_LIMITI, getDiario } from "@/domain/diari/catalogo";
import {
  VoceInputSchema,
  buildDiarioIcs,
  fascia,
  isPlausibleAt,
  normalizza,
  riepilogoCefalea,
  riepilogoGlicemia,
  riepilogoPressione,
  rigaVoce,
  type VoceDiario,
} from "@/domain/diari/voci";
import { vociEsempio } from "@/domain/diari/esempio";
import { renderDiarioVuoto, renderFoglioMedico } from "@/domain/diari/pdf";
import { findForbiddenPhrases } from "@/domain/safety/language";

const OGGI = "2026-11-21";
const conId = (xs: ReturnType<typeof vociEsempio>): VoceDiario[] => xs.map((v, i) => ({ ...v, id: `v${i}`, createdAt: "2026-11-21T00:00:00.000Z" }) as VoceDiario);
const P = (at: string, sys: number, dia: number, bpm: number | null = null): VoceDiario => ({ id: at, profileId: null, diario: "pressione", at, dati: { sys, dia, bpm }, note: null, createdAt: at });

/** Parole che i diari non usano mai: giudizi sui numeri, consigli sulla cura, certezze. */
const VIETATE = [
  /\b(a)?normal[ei]\b/i,
  /\bnella norma\b/i,
  /\banomal/i,
  /\bpatolog/i,
  /\b(alt[oa]|bass[oa]|elevat[oa])\b.{0,20}\b(pressione|glicemia|valore)/i,
  /\b(dovresti|ti consigli|consigliamo)\b/i,
  /\b(aumenta|riduci|sospendi|modifica|cambia)\b.{0,20}\b(dose|terapia|cura|farmac)/i,
  /\bsicuramente|garantit|certificat/i,
];

describe("diari: catalogo", () => {
  it("tre diari, ognuno con cinque passi, fonti e promemoria", () => {
    expect(DIARI.map((d) => d.slug)).toEqual(["pressione", "glicemia", "cefalea"]);
    for (const d of DIARI) {
      expect(d.passi).toHaveLength(5);
      expect(d.fonti.length).toBeGreaterThanOrEqual(2);
      for (const f of d.fonti) expect(f.url).toMatch(/^https:\/\//);
      expect(d.promemoria.orari.length).toBeGreaterThan(0);
      expect(getDiario(d.slug)).toBe(d);
    }
    expect(getDiario("colesterolo")).toBeNull();
  });

  it("i testi non giudicano i numeri e non dicono di cambiare la cura", () => {
    const testi = [
      ...DIARI.flatMap((d) => [d.titolo, d.em, d.lead, d.perChi, d.quando, ...d.passi.flatMap((p) => [p.titolo, p.testo]), ...d.colonne, ...d.calcoli, ...d.faq.flatMap((f) => [f.d, f.r]), d.promemoria.testo]),
      ...DIARI_LIMITI,
      DIARI_BOZZA,
    ];
    for (const t of testi) {
      expect(findForbiddenPhrases(t), t).toEqual([]);
      for (const re of VIETATE) expect(re.test(t), `${t} ~ ${re}`).toBe(false);
    }
  });

  it("anche i sorgenti dell'interfaccia rispettano le stesse regole", () => {
    const dir = "src/components/diari";
    for (const f of readdirSync(dir).filter((x) => x.endsWith(".tsx"))) {
      const s = readFileSync(path.join(dir, f), "utf8");
      for (const re of VIETATE) expect(re.test(s), `${f} ~ ${re}`).toBe(false);
      expect(findForbiddenPhrases(s), f).toEqual([]);
    }
  });
});

describe("diari: voci", () => {
  it("accetta una misura vera e scarta gli errori di battitura", () => {
    expect(VoceInputSchema.safeParse({ diario: "pressione", at: "2026-11-21T07:30", dati: { sys: 128, dia: 82 } }).success).toBe(true);
    expect(VoceInputSchema.safeParse({ diario: "pressione", at: "2026-11-21T07:30", dati: { sys: 1280, dia: 82 } }).success).toBe(false);
    const inv = VoceInputSchema.safeParse({ diario: "pressione", at: "2026-11-21T07:30", dati: { sys: 80, dia: 120 } });
    expect(inv.success).toBe(false);
    expect(inv.error?.issues[0].message).toMatch(/invertite/);
    expect(VoceInputSchema.safeParse({ diario: "glicemia", at: "2026-11-21T07:30", dati: { mgdl: 104, momento: "digiuno" } }).success).toBe(true);
    expect(VoceInputSchema.safeParse({ diario: "glicemia", at: "2026-11-21T07:30", dati: { mgdl: 104 } }).success).toBe(false);
    expect(VoceInputSchema.safeParse({ diario: "cefalea", at: "2026-11-21T07:30", dati: { tipo: "episodio" } }).success).toBe(false);
    expect(VoceInputSchema.safeParse({ diario: "cefalea", at: "2026-11-21T21:00", dati: { tipo: "nessuno" } }).success).toBe(true);
    expect(VoceInputSchema.safeParse({ diario: "cefalea", at: "2026-11-21T21:00", dati: { tipo: "nessuno" }, extra: 1 }).success).toBe(false);
  });

  it("la spunta «niente» non porta con sé campi di un episodio", () => {
    const p = VoceInputSchema.parse({ diario: "cefalea", at: "2026-11-21T21:00", dati: { tipo: "nessuno", intensita: "forte", farmaco: "x" } });
    expect(normalizza(p)).toMatchObject({ dati: { tipo: "nessuno", intensita: null, farmaco: null, sintomi: [] } });
  });

  it("data e ora: vere, non nel futuro, non troppo vecchie", () => {
    const now = new Date("2026-11-21T10:00:00");
    expect(isPlausibleAt("2026-11-21T07:30", now)).toBe(true);
    expect(isPlausibleAt("2026-11-22T07:30", now)).toBe(false);
    expect(isPlausibleAt("2026-02-30T07:30", now)).toBe(false);
    expect(isPlausibleAt("2023-11-21T07:30", now)).toBe(false);
  });

  it("mattina fino alle 12, sera dalle 17", () => {
    expect(fascia("2026-11-21T07:30")).toBe("mattina");
    expect(fascia("2026-11-21T14:00")).toBe("giorno");
    expect(fascia("2026-11-21T20:05")).toBe("sera");
  });
});

describe("diari: riepiloghi", () => {
  it("pressione: con almeno 4 giorni le medie escludono il primo, come le linee guida", () => {
    const xs = [P("2026-11-17T07:30", 160, 100), P("2026-11-18T07:30", 130, 80, 70), P("2026-11-18T20:00", 120, 76, 72), P("2026-11-19T07:30", 130, 80), P("2026-11-20T20:00", 120, 76)];
    const r = riepilogoPressione(xs, 7, OGGI);
    expect(r.giorni).toBe(4);
    expect(r.senzaPrimoGiorno).toBe(true);
    expect(r.totale).toEqual({ sys: 125, dia: 78, n: 4 });
    expect(r.mattina).toEqual({ sys: 130, dia: 80, n: 2 });
    expect(r.sera).toEqual({ sys: 120, dia: 76, n: 2 });
    expect(r.bpm).toBe(71);
    const tre = riepilogoPressione(xs.slice(0, 3), 7, OGGI);
    expect(tre.senzaPrimoGiorno).toBe(false);
    expect(tre.totale?.n).toBe(3);
  });

  it("le voci fuori dal periodo non contano", () => {
    expect(riepilogoPressione([P("2026-10-01T07:30", 150, 90)], 7, OGGI).misure).toBe(0);
  });

  it("glicemia: media, minimo e massimo per momento", () => {
    const r = riepilogoGlicemia(conId(vociEsempio(OGGI)), 14, OGGI);
    const dig = r.perMomento.find((s) => s.momento === "digiuno")!;
    expect(dig.n).toBe(7);
    expect(dig.min).toBeLessThanOrEqual(dig.media);
    expect(dig.max).toBeGreaterThanOrEqual(dig.media);
  });

  it("mal di testa: giorni con dolore, giorni compilati e giorni con qualcosa per il dolore", () => {
    const r = riepilogoCefalea(conId(vociEsempio(OGGI)), 30, OGGI);
    expect(r.episodi).toBe(5);
    expect(r.giorniConDolore).toBe(5);
    expect(r.giorniConFarmaco).toBe(4);
    expect(r.perIntensita).toEqual({ lieve: 1, media: 2, forte: 2 });
    expect(r.calendario).toHaveLength(30);
    expect(r.giorniSegnati).toBeGreaterThan(20);
    expect(r.giorniSegnati).toBeLessThan(30);
  });

  it("ogni voce si legge in una riga, senza giudizi", () => {
    for (const v of conId(vociEsempio(OGGI))) {
      const t = rigaVoce(v);
      expect(t.length).toBeGreaterThan(3);
      for (const re of VIETATE) expect(re.test(t)).toBe(false);
    }
  });
});

describe("diari: promemoria e PDF", () => {
  it("il promemoria si ripete ogni giorno agli orari scelti, senza numeri né diagnosi nel titolo", () => {
    const ics = buildDiarioIcs(getDiario("pressione")!, ["07:30", "20:00"], 7, OGGI, new Date("2026-11-21T10:00:00Z"));
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics).toContain("RRULE:FREQ=DAILY;COUNT=7");
    expect(ics).toContain("DTSTART:20261121T073000");
    expect(ics).toContain("DTSTART:20261121T200000");
    expect(ics).not.toMatch(/ipertens|diabet|emicrania/i);
    for (const line of ics.split("\r\n")) expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  });

  it("il diario da stampare e il foglio per il medico stanno in una pagina", async () => {
    const voci = conId(vociEsempio(OGGI));
    for (const d of DIARI) {
      const vuoto = await PDFDocument.load(await renderDiarioVuoto(d));
      expect(vuoto.getPageCount()).toBe(1);
      const foglio = await PDFDocument.load(await renderFoglioMedico(d, voci, { persona: "Tu", giorni: 90, oggi: OGGI }));
      expect(foglio.getPageCount()).toBe(1);
    }
  });
});

describe("diari nel database (RLS)", () => {
  const alice = "6f1d2c55-1111-4d1a-9a1a-aaaaaaaaaaaa";
  const bob = "6f1d2c55-2222-4d1a-9a1a-bbbbbbbbbbbb";
  it("ognuno vede solo le sue voci, e quelle dei suoi familiari", async () => {
    const { resetDatabaseForTests, withSystem } = await import("@/db/client");
    const { createVoce, deleteVoce, listVoci, loadVociEsempio } = await import("@/domain/diari/repository");
    const { createPersona } = await import("@/domain/famiglia/repository");
    await resetDatabaseForTests();
    await withSystem((tx) => tx.query("INSERT INTO users(id, email) VALUES ($1, $2), ($3, $4)", [alice, "alice-diari@test.invalid", bob, "bob-diari@test.invalid"]));
    const n = await loadVociEsempio(alice, OGGI);
    expect(n).toBeGreaterThan(40);
    expect(await loadVociEsempio(alice, OGGI)).toBe(0);
    expect((await listVoci(alice, "io", "pressione")).length).toBe(24);
    expect(await listVoci(bob, "io", null)).toEqual([]);
    const nonna = await createPersona(alice, { name: "Nonna", relation: "nonno", basis: "consenso", declaration: true });
    const nid = nonna.ok ? nonna.id : "";
    const id = await createVoce(alice, normalizza(VoceInputSchema.parse({ diario: "pressione", profileId: nid, at: "2026-11-20T07:30", dati: { sys: 140, dia: 85 } })));
    expect(id).toBeTruthy();
    expect((await listVoci(alice, nid, "pressione")).map((v) => v.id)).toEqual([id]);
    // Bob non scrive nel diario della nonna di Alice e non cancella le sue voci.
    expect(await createVoce(bob, normalizza(VoceInputSchema.parse({ diario: "pressione", profileId: nid, at: "2026-11-20T07:30", dati: { sys: 140, dia: 85 } })))).toBeNull();
    expect(await deleteVoce(bob, id!)).toBe(false);
    expect(await deleteVoce(alice, id!)).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { AUTOVALUTAZIONI, SONNO_PAGINE, SONNO_PROBLEMI, getSonnoPagina, testoAutovalutazione, testoSonno } from "@/content/sonno";
import { AutovalutazioneSchema, SONNO_EXTRA_FORBIDDEN, SONNO_SOURCE_DOMAINS_EXTRA, SonnoPaginaSchema } from "@/content/sonno/schema";
import { MALATTIE_EXTRA_FORBIDDEN, MALATTIE_SOURCE_DOMAINS } from "@/content/malattie/schema";
import { FORBIDDEN_PHRASES } from "@/content/guides/schema";
import { GUIDES } from "@/content/guides";
import { contaParole } from "@/content/malattie";
import { TITLE_MAX, TITLE_SUFFIX, malattiaIndexable } from "@/lib/seo";
import { calcolaEsito, rigaPerIlMedico } from "@/domain/sonno/autovalutazione";
import { VoceInputSchema, efficienzaNotte, normalizza, riepilogoSonno, sonnoStimato, type VoceDiario } from "@/domain/diari/voci";
import { vociEsempio } from "@/domain/diari/esempio";
import { buildSearchIndex, searchSite as cerca } from "@/lib/search-index";
const INDICE = buildSearchIndex();
const searchSite = (q: string) => cerca(INDICE, q).items;

const DOMINI = [...MALATTIE_SOURCE_DOMAINS, ...SONNO_SOURCE_DOMAINS_EXTRA];
const ok = (url: string) => {
  const host = new URL(url).hostname.replace(/^www\./, "");
  return DOMINI.some((d) => host === d || host.endsWith(`.${d}`));
};
const REGOLE = [...MALATTIE_EXTRA_FORBIDDEN, ...SONNO_EXTRA_FORBIDDEN];

describe("sezione sonno: le pagine (22/11/2026)", () => {
  it("dodici pagine e quattro autovalutazioni, slug unici, rispettano gli schemi", () => {
    expect(SONNO_PAGINE).toHaveLength(12);
    expect(SONNO_PROBLEMI.map((p) => p.porta)).toEqual(["Non mi addormento", "Mi sveglio di notte", "Russo e sono stanco", "Lavoro a turni", "Gambe senza riposo"]);
    for (const p of SONNO_PAGINE) {
      const r = SonnoPaginaSchema.safeParse(p);
      expect(r.success, `${p.slug}: ${r.success ? "" : JSON.stringify(r.error.issues)}`).toBe(true);
    }
    expect(AUTOVALUTAZIONI).toHaveLength(4);
    for (const a of AUTOVALUTAZIONI) {
      const r = AutovalutazioneSchema.safeParse(a);
      expect(r.success, `${a.slug}: ${r.success ? "" : JSON.stringify(r.error.issues)}`).toBe(true);
    }
  });

  it("nessuna frase diagnostica o prescrittiva, nessun farmaco consigliato, nessun orario su misura", () => {
    const testi = [...SONNO_PAGINE.map((p) => [p.slug, testoSonno(p)]), ...AUTOVALUTAZIONI.map((a) => [a.slug, testoAutovalutazione(a)])];
    for (const [slug, t] of testi) {
      expect(FORBIDDEN_PHRASES.filter((f) => t.toLowerCase().includes(f)), slug).toEqual([]);
      for (const { regola, re } of REGOLE) expect(re.test(t), `${slug}: ${regola} → ${t.match(re)?.[0]}`).toBe(false);
    }
  });

  it("le regole bloccano davvero gli orari su misura e i consigli di farmaci", () => {
    const re = (s: string) => SONNO_EXTRA_FORBIDDEN.some((r) => r.re.test(s));
    expect(re("La tua finestra di sonno è dalle 0:30 alle 6")).toBe(true);
    expect(re("Prendi la melatonina un'ora prima")).toBe(true);
    expect(re("Hai le apnee notturne")).toBe(true);
    expect(re("La melatonina è un segnale della notte")).toBe(false);
  });

  it("almeno 500 parole proprie per pagina", () => {
    for (const p of SONNO_PAGINE) expect(contaParole(testoSonno(p)), p.slug).toBeGreaterThanOrEqual(500);
  });

  it("i collegamenti interni portano a pagine che esistono", () => {
    const guide = new Set(GUIDES.map((g) => g.slug));
    const esiste = (href: string) => {
      const path = href.split(/[?#]/)[0];
      if (path.startsWith("/prenditi-cura-di-te/sonno/")) {
        const s = path.slice("/prenditi-cura-di-te/sonno/".length);
        return Boolean(getSonnoPagina(s)) || AUTOVALUTAZIONI.some((a) => a.slug === s);
      }
      if (path.startsWith("/guide/")) return guide.has(path.slice(7));
      return ["/lettura-referti", "/integratori", "/area-personale/diari/sonno", "/diari/sonno", "/strumenti/preparati-alla-visita"].includes(path);
    };
    for (const p of SONNO_PAGINE) {
      for (const s of p.sezioni) for (const b of s.blocchi) if ("vai" in b) expect(esiste(b.vai.href), `${p.slug} → ${b.vai.href}`).toBe(true);
      for (const c of p.correlate) expect(getSonnoPagina(c), `${p.slug} → ${c}`).not.toBeNull();
      expect(p.correlate).not.toContain(p.slug);
    }
    for (const a of AUTOVALUTAZIONI) for (const x of a.poi) expect(esiste(x.href), `${a.slug} → ${x.href}`).toBe(true);
  });

  it("fonti solo da istituzioni, società scientifiche e riviste", () => {
    for (const p of [...SONNO_PAGINE, ...AUTOVALUTAZIONI]) for (const f of p.fonti) expect(ok(f.url), `${p.slug}: ${f.url}`).toBe(true);
  });

  it("titoli entro 65 caratteri con il nome del sito, tutti diversi", () => {
    const tutti = [...SONNO_PAGINE, ...AUTOVALUTAZIONI];
    for (const p of tutti) expect((p.seoTitle + TITLE_SUFFIX).length, p.seoTitle).toBeLessThanOrEqual(TITLE_MAX);
    expect(new Set(tutti.map((p) => p.seoTitle.toLowerCase())).size).toBe(tutti.length);
  });

  it("restano bozze fuori da Google finché un medico non le firma", () => {
    for (const p of [...SONNO_PAGINE, ...AUTOVALUTAZIONI]) {
      expect(p.revisione.stato).toBe("bozza");
      expect(malattiaIndexable(p, { ENABLE_INDEXING: "true" })).toBe(false);
    }
  });

  it("le autovalutazioni dichiarano il questionario a cui si ispirano e citano la fonte", () => {
    for (const a of AUTOVALUTAZIONI) {
      expect(a.ispirazione.nota.toLowerCase()).toMatch(/nostre|nostr/);
      expect(a.ispirazione.nota.toLowerCase()).toMatch(/non (sono state )?validat|non danno|non fanno diagnosi|la fa il medico/);
      expect(a.fonti.some((f) => f.url.includes("pubmed.ncbi.nlm.nih.gov"))).toBe(true);
    }
  });

  it("le autovalutazioni non ricopiano le frasi dei questionari protetti", () => {
    const tutte = AUTOVALUTAZIONI.map(testoAutovalutazione).join("\n").toLowerCase();
    // Frasi caratteristiche di ISI, Epworth e STOP-Bang (non le riportiamo intere): non devono comparire.
    for (const f of ["sitting and reading", "as a passenger in a car", "do you snore loudly", "chance of dozing", "how satisfied/dissatisfied", "neck circumference", "tiredness, fatigue, or sleepiness"]) expect(tutte).not.toContain(f);
  });

  it("le fasce coprono tutti i punteggi possibili, senza buchi", () => {
    for (const a of AUTOVALUTAZIONI) {
      const max = a.domande.filter((d) => d.contaNelPunteggio !== false).reduce((s, d) => s + Math.max(...d.opzioni.map((o) => o.v)), 0);
      for (let n = 0; n <= max; n++) expect(a.fasce.filter((f) => n >= f.min && n <= f.max), `${a.slug} punteggio ${n}`).toHaveLength(1);
    }
  });

  it("calcolo dell'esito: fascia, avvisi, riga per il medico", () => {
    const a = AUTOVALUTAZIONI.find((x) => x.slug === "autovalutazione-sonnolenza")!;
    const r = { riunione: 2, attesa: 2, telefono: 1, film: 2, pranzo: 1, lavoro: 1, guida: 1 };
    const e = calcolaEsito(a, r);
    expect(e.completo).toBe(true);
    expect(e.punti).toBe(9);
    expect(e.massimo).toBe(12);
    expect(e.fascia.titolo).toBe("Molta sonnolenza di giorno");
    expect(e.avvisi.map((v) => v.tono)).toEqual(["attenzione"]);
    expect(rigaPerIlMedico({ slug: a.slug, porta: a.porta, fascia: e.fascia.titolo, punti: 9, massimo: 12, data: "2026-11-22", avvisi: ["Colpi di sonno"] })).toBe(
      "Sonnolenza di giorno (22/11/2026): molta sonnolenza di giorno, 9 su 12 con le domande di Cura Privata · Colpi di sonno",
    );
    expect(calcolaEsito(a, { riunione: 0 }).completo).toBe(false);
  });

  it("la ricerca trova le pagine del sonno con le parole di tutti i giorni", () => {
    expect(searchSite("russo")[0]?.href).toBe("/prenditi-cura-di-te/sonno/russo-e-sono-stanco");
    expect(searchSite("gambe senza riposo")[0]?.href).toBe("/prenditi-cura-di-te/sonno/gambe-senza-riposo");
    expect(searchSite("polisonnografia")[0]?.href).toBe("/prenditi-cura-di-te/sonno/esame-del-sonno");
    expect(searchSite("melatonina").some((r) => r.href === "/prenditi-cura-di-te/sonno/farmaci-e-melatonina")).toBe(true);
    expect(searchSite("insonnia")[0]?.href).toBe("/prenditi-cura-di-te/sonno");
  });
});

describe("diario del sonno: i conti della sezione sonno", () => {
  const notte = (at: string, aLetto: string, inPiedi: string, add: number | null, sv: number | null, sveglia: string | null = null): VoceDiario => ({
    id: at,
    profileId: null,
    diario: "sonno",
    at: `${at}T07:30`,
    note: null,
    createdAt: at,
    dati: { aLetto, inPiedi, addormentarsiMin: add, risvegli: 1, qualita: "cosi", svegliMin: sv, sveglia },
  });

  it("sonno stimato ed efficienza di una notte", () => {
    // 23:00 → 07:00 = 480 min; −30 addormentarsi −30 svegli −60 (sveglio dalle 6) = 360 → 75%
    expect(sonnoStimato({ aLetto: "23:00", inPiedi: "07:00", addormentarsiMin: 30, svegliMin: 30, sveglia: "06:00" })).toBe(360);
    expect(efficienzaNotte({ aLetto: "23:00", inPiedi: "07:00", addormentarsiMin: 30, risvegli: 1, qualita: "cosi", svegliMin: 30, sveglia: "06:00" })).toBe(75);
    expect(sonnoStimato({ aLetto: "23:00", inPiedi: "07:00", addormentarsiMin: 30, svegliMin: null })).toBeNull();
  });

  it("riepilogo: efficienza sul totale, regolarità, fine settimana, notti oltre 30 minuti", () => {
    // 2026-11-16 è lunedì; 21 e 22 sono sabato e domenica (mattini del fine settimana).
    const xs = [
      notte("2026-11-16", "23:00", "07:00", 20, 10),
      notte("2026-11-17", "23:30", "07:00", 40, 40),
      notte("2026-11-18", "23:00", "07:00", 20, 10),
      notte("2026-11-19", "22:30", "06:30", 15, 5),
      notte("2026-11-20", "23:00", "07:00", 20, 10),
      notte("2026-11-21", "00:30", "09:00", 20, 10),
      notte("2026-11-22", "00:30", "09:30", 20, 10),
    ];
    const r = riepilogoSonno(xs, 14, "2026-11-22");
    expect(r.notti).toBe(7);
    expect(r.nottiComplete).toBe(7);
    expect(r.efficienza).toBeGreaterThan(80);
    expect(r.efficienza).toBeLessThan(95);
    expect(r.nottiAddormentarsiOltre30).toBe(1);
    expect(r.nottiSvegliOltre30).toBe(1);
    expect(r.variabilitaLetto).toBeGreaterThan(30);
    // metà notte nel fine settimana circa 1 h 30 più tardi
    expect(r.scartoFineSettimana).toBeGreaterThan(70);
    expect(r.scartoFineSettimana).toBeLessThan(120);
  });

  it("le vecchie notti senza i campi nuovi restano valide e non entrano nell'efficienza", () => {
    const vecchia: VoceDiario = { id: "v", profileId: null, diario: "sonno", at: "2026-11-20T07:00", note: null, createdAt: "x", dati: { aLetto: "23:00", inPiedi: "07:00", addormentarsiMin: 20, risvegli: 1, qualita: "bene" } };
    const r = riepilogoSonno([vecchia], 14, "2026-11-22");
    expect(r.notti).toBe(1);
    expect(r.efficienza).toBeNull();
  });

  it("validazione: risveglio dentro la notte, minuti che non superano il tempo a letto", () => {
    const base = { diario: "sonno", at: "2026-11-22T07:30", dati: { aLetto: "23:00", inPiedi: "07:00", qualita: "bene" } };
    expect(VoceInputSchema.safeParse({ ...base, dati: { ...base.dati, sveglia: "06:10", svegliMin: 20, addormentarsiMin: 15 } }).success).toBe(true);
    expect(VoceInputSchema.safeParse({ ...base, dati: { ...base.dati, sveglia: "08:00" } }).success).toBe(false);
    expect(VoceInputSchema.safeParse({ ...base, dati: { ...base.dati, svegliMin: 400, addormentarsiMin: 100 } }).success).toBe(false);
    const n = normalizza(VoceInputSchema.parse({ ...base, dati: { ...base.dati } }));
    expect(n.diario === "sonno" && n.dati.svegliMin === null && n.dati.sveglia === null).toBe(true);
  });

  it("le notti di esempio hanno i numeri per l'efficienza", () => {
    const xs = vociEsempio("2026-11-22").filter((v) => v.diario === "sonno").map((v, i) => ({ ...v, id: String(i), createdAt: "x" })) as VoceDiario[];
    const r = riepilogoSonno(xs, 14, "2026-11-22");
    expect(r.nottiComplete).toBe(12);
    expect(r.efficienza).not.toBeNull();
  });
});

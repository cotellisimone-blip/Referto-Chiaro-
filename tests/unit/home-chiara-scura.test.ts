import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { secondoParereEnabled } from "@/lib/medici";
import { serviceStart } from "@/domain/offerta";
import { MEDICI, datiMancanti, inizialiMedico, nomeMedico, nomiMedici } from "@/content/medici";
import { buildGuidaPersonale, guidaEsempio } from "@/domain/reporting/guida-personale";
import { FORBIDDEN_PHRASES } from "@/content/guides/schema";
import { PREFS_INIT_SCRIPT, THEME_COLOR } from "@/lib/prefs-init";
import type { ExplanationItem } from "@/domain/reporting/explanation-schema";

/**
 * Home «chiara e scura» (19/11/2026, decisioni di Simone delle 16:53 e 16:57): medici veri accesi (Sara, Elena e
 * Riccardo, medici di medicina generale a Brescia), secondo parere «In arrivo», guida personale dentro il report,
 * sito che nasce chiaro con il pulsante della luce, le quattro frasi prudenti.
 */

describe("i medici di Cura Privata", () => {
  it("sono tre, con i nomi detti da Simone, tutti medici di medicina generale a Brescia", () => {
    expect(MEDICI.map((m) => m.nome)).toEqual(["Sara", "Elena", "Riccardo"]);
    for (const m of MEDICI) {
      expect(m.ruolo).toBe("Medico di medicina generale");
      expect(m.citta).toBe("Brescia");
      expect(m.servizi).toEqual(["domicilio", "video"]);
    }
    expect(nomiMedici()).toBe("Sara, Elena e Riccardo");
  });

  it("niente di indovinato: titolo, cognome, Ordine e zona restano da completare finché non li scrive Simone", () => {
    for (const m of MEDICI) {
      // Il titolo (Dott. o Dott.ssa) non si ricava dal nome.
      expect(m.titolo).toBeNull();
      expect(m.cognome).toBeNull();
      expect(m.ordine).toBeNull();
      expect(m.zona).toBeNull();
      // 22/11/2026: con la visita a domicilio spenta (valore di base) la zona non serve, mancano i giorni del videoconsulto.
      expect(datiMancanti(m)).toEqual(["titolo e cognome", "iscrizione all’Ordine", "giorni e orari del videoconsulto"]);
      expect(nomeMedico(m)).toBe(m.nome);
      expect(inizialiMedico(m)).toBe(m.nome[0]);
    }
  });

  it("nessuna fotografia di medici (scelta del titolare): la scheda ha solo dati scritti", () => {
    const src = readFileSync("src/content/medici.ts", "utf8");
    expect(src).not.toMatch(/\.(jpe?g|png|webp|avif)\b/i);
  });
});

describe("secondo parere «In arrivo»", () => {
  afterEach(() => vi.unstubAllEnvs());
  function env(vars: Record<string, string>) {
    for (const k of ["ENABLE_MEDICI", "NEXT_PUBLIC_ENABLE_MEDICI", "ENABLE_SECONDO_PARERE", "NEXT_PUBLIC_ENABLE_SECONDO_PARERE", "SITE_PROFILE"]) vi.stubEnv(k, vars[k] ?? "");
  }

  it("con i medici accesi il secondo parere resta spento finché non c'è lo specialista", () => {
    env({ ENABLE_MEDICI: "true" });
    expect(secondoParereEnabled()).toBe(false);
    const s = serviceStart("secondo-parere");
    expect(s.waitlist).toBe(true);
    expect(s.href).toMatch(/#avvisami$/);
    // Video e domicilio invece si prenotano.
    expect(serviceStart("parla-con-un-medico").waitlist ?? false).toBe(false);
  });

  it("si accende solo insieme ai medici e solo con il valore esatto \"true\"", () => {
    env({ ENABLE_SECONDO_PARERE: "true" });
    expect(secondoParereEnabled()).toBe(false);
    env({ ENABLE_MEDICI: "true", ENABLE_SECONDO_PARERE: "true" });
    expect(secondoParereEnabled()).toBe(true);
    env({ ENABLE_MEDICI: "true", ENABLE_SECONDO_PARERE: "1" });
    expect(secondoParereEnabled()).toBe(false);
  });
});

const voce = (id: string, nameExact: string, originalValueExact: string, originalUnitExact: string, originalReferenceExact: string): ExplanationItem => ({
  sourceObservationId: id,
  nameExact,
  originalValueExact,
  originalUnitExact,
  originalReferenceExact,
  plainLanguageDefinition: "x",
  printedRangeNote: "",
  sourceCitation: { page: 1, line: 1, excerpt: "" },
  interpretationType: "general-term-definition",
  limits: "",
});

describe("la guida personale del report", () => {
  it("nell'esempio della home: ferritina sotto porta alla scheda sul ferro, LDL sopra all'alimentazione", () => {
    const g = guidaEsempio();
    expect(g.gruppi.map((x) => x.tema)).toEqual(["integratori", "alimentazione", "intestino", "esami", "visita"]);
    const integ = g.gruppi.find((x) => x.tema === "integratori")!;
    expect(integ.righe).toHaveLength(1);
    expect(integ.righe[0]).toMatchObject({ titolo: "Ferro: prima di prenderlo", href: "/integratori/ferro", fuori: true });
    expect(integ.righe[0].motivo).toBe("Ferritina sotto l’intervallo del tuo laboratorio: che cosa chiedere al medico o al farmacista.");
    const cibo = g.gruppi.find((x) => x.tema === "alimentazione")!;
    expect(cibo.righe[0].titolo).toBe("Colesterolo LDL: che cosa dice la ricerca");
    const intestino = g.gruppi.find((x) => x.tema === "intestino")!;
    expect(intestino.righe[0].titolo).toBe("Equilibrio intestinale: fibre, fermentati, probiotici");
  });

  it("non collega un integratore a un esame che non lo riguarda (l'omega-3 non c'entra con l'LDL)", () => {
    const g = buildGuidaPersonale({ items: [voce("1", "Colesterolo LDL", "160", "mg/dL", "< 115")] });
    const tutte = g.gruppi.flatMap((x) => x.righe.map((r) => r.href));
    expect(tutte).not.toContain("/integratori/omega-3");
    expect(g.gruppi.find((x) => x.tema === "integratori")).toBeUndefined();
  });

  it("prima le righe dei valori fuori dall'intervallo, e le domande per il medico restano in fondo", () => {
    const g = buildGuidaPersonale({ items: [voce("1", "Glicemia", "92", "mg/dL", "70 - 99"), voce("2", "Creatinina", "1,4", "mg/dL", "0,70 - 1,20")] });
    const esami = g.gruppi.find((x) => x.tema === "esami")!;
    expect(esami.righe[0].fuori).toBe(true);
    expect(esami.righe[0].href).toBe("/guide/creatinina");
    expect(g.gruppi.at(-1)!.tema).toBe("visita");
    expect(g.gruppi.at(-1)!.righe.map((r) => r.href)).toEqual(["/strumenti/preparati-alla-visita", "#domande-medico"]);
  });

  it("senza esami che conosciamo non inventa niente: la guida è vuota", () => {
    expect(buildGuidaPersonale({ items: [voce("1", "Esame sconosciuto XYZ", "3", "U", "1 - 5")] }).gruppi).toEqual([]);
  });

  it("parla con prudenza: nessuna frase vietata, mai «devi» né dosi", () => {
    const g = guidaEsempio();
    const testo = g.gruppi.flatMap((x) => [x.titolo, ...x.righe.flatMap((r) => [r.titolo, r.motivo])]).join(" ").toLowerCase();
    expect(FORBIDDEN_PHRASES.filter((p) => testo.includes(p))).toEqual([]);
    // Le unità del referto (mg/dL) sì, le dosi no.
    expect(testo).not.toMatch(/\bdevi\b|compra|al giorno|\bdose\b|\bdosi\b/);
  });
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe("le pagine delle tessere della home", () => {
  const PAGINE = ["src/app/prevenzione/esami-di-base/page.tsx", "src/app/prevenzione/intestino-e-microbiota/page.tsx", "src/app/prevenzione/alimentazione/page.tsx", "src/app/prevenzione/screening/page.tsx", "src/app/vicino-a-te/page.tsx", "src/app/scaffale/page.tsx"];

  it("ci sono tutte, e i testi non usano frasi vietate", () => {
    for (const f of PAGINE) {
      const testo = readFileSync(f, "utf8").toLowerCase();
      expect(FORBIDDEN_PHRASES.filter((p) => testo.includes(p)), f).toEqual([]);
      expect(testo, f).not.toMatch(/pulizia intestinale|depura|detox|esami consigliati|piano personalizzato/);
    }
  });

  it("le quattro frasi prudenti approvate da Simone sono quelle sul sito", () => {
    const home = readFileSync("src/components/home-b/home-b.tsx", "utf8");
    // 22/11/2026: la tessera del passo 2 diventa «Gli esami per te» (piano della home in cinque passi, approvato da Simone).
    expect(home).toContain("Gli esami per te");
    expect(home).toContain("Senza ricetta*");
    expect(readFileSync(PAGINE[0], "utf8")).toContain("L’elenco degli");
    expect(home).toContain("Per preparare il tuo piano insieme al medico o al farmacista.");
    expect(home).toContain("Equilibrio intestinale: fibre, fermentati, probiotici");
    expect(readFileSync(PAGINE[1], "utf8")).toContain("Equilibrio intestinale:");
  });

  it("lo Scaffale non mostra prodotti né aziende: è «In arrivo» e pubblica i criteri", () => {
    const s = readFileSync("src/app/scaffale/page.tsx", "utf8");
    expect(s).toContain('stato="In arrivo"');
    expect(s).toContain("Criteri pubblici");
    expect(s).not.toMatch(/€|\bsconto\b|acquista/i);
  });

  it("nessuna pagina nuova scrive prezzi a mano", () => {
    const files = [...PAGINE, ...walk("src/components/temi"), ...walk("src/components/home-b")];
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(/\b(?:2,90|7,90|69|149) ?€/);
  });
});

describe("il sito nasce chiaro", () => {
  it("lo script della prima pittura passa allo scuro solo se la persona l'ha scelto", () => {
    expect(PREFS_INIT_SCRIPT).toContain('==="dark"?"dark":"light"');
    expect(PREFS_INIT_SCRIPT).not.toContain("prefers-color-scheme");
    expect(THEME_COLOR).toEqual({ light: "#FBFAF6", dark: "#061A22" });
  });

  it("la pagina nasce con data-theme=\"light\" già nell'HTML del server", () => {
    expect(readFileSync("src/app/layout.tsx", "utf8")).toMatch(/<html[^>]*data-theme="light"/);
  });
});

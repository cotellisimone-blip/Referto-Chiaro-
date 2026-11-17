import { test, expect, type APIRequestContext } from "@playwright/test";

/**
 * 17/11/2026 (20 interventi, punto 19): un controllo che percorre TUTTO il sito pubblico partendo dalla home e seguendo
 * ogni collegamento interno. Per ogni pagina: risponde, ha un solo titolo principale, titolo e descrizione della lunghezza
 * giusta per i motori di ricerca (src/lib/seo.ts), indirizzo canonico, nessuna frase che contraddice lo stato del sito.
 * Legge l'HTML senza aprire il browser: qualche centinaio di pagine in pochi secondi.
 */
const TITLE_MAX = 65;
const DESCRIPTION_MAX = 160;

/** Aree con accesso, API e file: non fanno parte del sito pubblico. */
const FUORI = /^\/(api|area-personale|medico|admin|accedi|prova|richiedi|richieste|_next)(\/|$)|\.[a-z0-9]{2,5}$/i;
/** Indirizzi uniti nelle tre sezioni (punto 1): devono rimandare, non esistere. */
export const RIMANDI: Record<string, string> = { "/referti": "/lettura-referti", "/servizi/prevenzione": "/prevenzione", "/con-un-medico": "/medici" };
/** Finché i medici sono «In arrivo» il sito ne parla al futuro (punto 3): queste frasi al presente non devono comparire. */
const PRESENTE_MEDICI = ["chi viene a casa?", "prima di pagare leggi il suo nome", "paghi solo dopo che il medico", "li vedi prima di pagare", "sai subito se arriviamo da te"];

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (html: string, re: RegExp) => { const m = html.match(re); return m ? decode(m[1]) : null; };
const testo = (html: string) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<template[\s\S]*?<\/template>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").toLowerCase();

type Pagina = { path: string; html: string };

async function percorri(request: APIRequestContext): Promise<{ pagine: Pagina[]; rotti: string[] }> {
  const visti = new Set<string>(["/"]);
  const coda = ["/"];
  const pagine: Pagina[] = [];
  const rotti: string[] = [];
  while (coda.length) {
    const lotto = coda.splice(0, 12);
    await Promise.all(
      lotto.map(async (path) => {
        const res = await request.get(path, { maxRedirects: 0 });
        if (res.status() !== 200) { rotti.push(`${path} → ${res.status()}`); return; }
        const html = await res.text();
        pagine.push({ path, html });
        for (const m of html.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)) {
          const href = m[1].replace(/\/$/, "") || "/";
          if (href.startsWith("//") || FUORI.test(href) || visti.has(href)) continue;
          visti.add(href);
          coda.push(href);
        }
      }),
    );
  }
  return { pagine, rotti };
}

export function provaSitoIntero({ medici }: { medici: boolean }) {
  test.describe("sito intero", () => {
    test.describe.configure({ mode: "default" });
    let pagine: Pagina[] = [];
    let rotti: string[] = [];

    test.beforeAll(async ({ request }) => {
      test.setTimeout(180_000);
      ({ pagine, rotti } = await percorri(request));
    });

    test("ogni collegamento interno porta a una pagina che risponde, senza rimandi", () => {
      expect(pagine.length, "pagine trovate").toBeGreaterThan(200);
      expect(rotti).toEqual([]);
    });

    test("ogni pagina ha un solo titolo principale", () => {
      const errori = pagine.filter((p) => (p.html.match(/<h1[\s>]/g) ?? []).length !== 1).map((p) => `${p.path}: ${(p.html.match(/<h1[\s>]/g) ?? []).length} h1`);
      expect(errori).toEqual([]);
    });

    test(`titoli fino a ${TITLE_MAX} caratteri e descrizioni fino a ${DESCRIPTION_MAX}, mai vuoti e mai ripetuti`, () => {
      const errori: string[] = [];
      const titoli = new Map<string, string>();
      for (const p of pagine) {
        const title = attr(p.html, /<title>([^<]*)<\/title>/);
        const desc = attr(p.html, /<meta name="description" content="([^"]*)"/);
        if (!title) errori.push(`${p.path}: senza titolo`);
        else if (title.length > TITLE_MAX) errori.push(`${p.path}: titolo di ${title.length} caratteri («${title}»)`);
        if (!desc) errori.push(`${p.path}: senza descrizione`);
        else if (desc.length > DESCRIPTION_MAX) errori.push(`${p.path}: descrizione di ${desc.length} caratteri`);
        if (title) {
          const altro = titoli.get(title);
          if (altro) errori.push(`${p.path}: stesso titolo di ${altro} («${title}»)`);
          else titoli.set(title, p.path);
        }
      }
      expect(errori).toEqual([]);
    });

    test("ogni pagina dichiara il proprio indirizzo canonico", () => {
      const errori: string[] = [];
      for (const p of pagine) {
        const canonical = attr(p.html, /<link rel="canonical" href="([^"]*)"/);
        if (!canonical) { errori.push(`${p.path}: senza canonical`); continue; }
        const got = new URL(canonical).pathname.replace(/\/$/, "") || "/";
        if (got !== p.path) errori.push(`${p.path}: canonical verso ${got}`);
      }
      expect(errori).toEqual([]);
    });

    test("nessuna frase contraddice lo stato del sito", () => {
      const errori: string[] = [];
      for (const p of pagine) {
        const t = testo(p.html);
        // La Prevenzione è una sezione aperta: non può risultare «in preparazione» da nessuna parte.
        if (/prevenzione[^.]{0,40}in preparazione/.test(t)) errori.push(`${p.path}: Prevenzione «in preparazione»`);
        if (!medici) for (const f of PRESENTE_MEDICI) if (t.includes(f)) errori.push(`${p.path}: «${f}» al presente con i medici in arrivo`);
      }
      expect(errori).toEqual([]);
    });

    test("i vecchi indirizzi rimandano alle tre sezioni", async ({ request }) => {
      for (const [da, a] of Object.entries(RIMANDI)) {
        const res = await request.get(da, { maxRedirects: 0 });
        expect(res.status(), da).toBe(308);
        expect(res.headers().location, da).toBe(a);
      }
    });
  });
}

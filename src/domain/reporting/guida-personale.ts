import type { Explanation } from "@/domain/reporting/explanation-schema";
import type { RangePosition } from "@/domain/extraction/reference";
import { itemGlance } from "@/domain/reporting/glance";
import { guideForExam } from "@/domain/reporting/enrich";
import { INTEGRATORI } from "@/content/integratori";

/**
 * «La tua guida personale» (19/11/2026, Simone: «dentro il report la guida personale»). È inclusa nel report a pagamento, senza costi in più.
 *
 * Deterministica: non scrive testo nuovo sulla persona e non chiede niente all'AI. A partire dagli esami confermati del
 * referto (il nome e la posizione rispetto all'intervallo stampato, calcolata dal codice in glance.ts) mette in fila le
 * letture del sito che li riguardano: le guide agli esami, le pagine su alimentazione e intestino, per ultime le schede
 * sugli integratori (solo per un valore basso della sostanza stessa), la preparazione alla visita.
 * Non dice che cosa fare né che cosa prendere: è fatta per preparare il piano con il medico o con il farmacista.
 * Si calcola sul server (le guide sono pesanti) e viaggia con gli altri arricchimenti del report.
 */

export type GuidaTema = "integratori" | "alimentazione" | "intestino" | "esami" | "visita";

export interface GuidaRiga {
  titolo: string;
  motivo: string;
  href: string;
  /** Il valore collegato è fuori dall'intervallo stampato: la riga va in cima al suo gruppo. */
  fuori: boolean;
}

export interface GuidaGruppo {
  tema: GuidaTema;
  titolo: string;
  righe: GuidaRiga[];
}

export interface GuidaPersonale {
  gruppi: GuidaGruppo[];
}

const DOVE: Record<RangePosition, string> = {
  "above-range": "sopra l’intervallo del tuo laboratorio",
  "below-range": "sotto l’intervallo del tuo laboratorio",
  inside: "dentro l’intervallo del tuo laboratorio",
  "not-comparable": "non confrontabile con l’intervallo stampato",
};

const isOut = (p: RangePosition) => p === "above-range" || p === "below-range";

/** Esami del referto su cui l'alimentazione pesa, per le indicazioni generali (non la lipoproteina(a), che non cambia con la dieta). */
const ALIMENTAZIONE = new Set(["colesterolo-totale", "colesterolo-hdl", "colesterolo-ldl", "colesterolo-non-hdl", "trigliceridi", "glicemia", "emoglobina-glicata", "acido-urico"]);
/** Esami dell'intestino: rimandano agli esami spiegati nella pagina dell'intestino. */
const INTESTINO = new Set(["calprotectina-fecale", "sangue-occulto-nelle-feci", "helicobacter-pylori", "esami-per-la-celiachia"]);

const TITOLI: Record<GuidaTema, string> = {
  integratori: "Integratori: solo dopo aver sentito il medico",
  alimentazione: "Alimentazione, peso e forma",
  intestino: "Intestino e microbiota",
  esami: "Le guide ai tuoi esami",
  visita: "Per preparare la visita",
};

/**
 * 27/11/2026 (fase 1, revisione dei due medici simulati): gli integratori vengono DOPO le guide agli esami,
 * l'alimentazione e l'intestino. Prima si capisce il valore e se ne parla con il medico; solo dopo, eventualmente,
 * si legge la scheda di un integratore.
 */
const ORDINE: GuidaTema[] = ["esami", "alimentazione", "intestino", "integratori", "visita"];

/**
 * 27/11/2026 (fase 1): una scheda integratore compare solo per un valore SOTTO l'intervallo e solo se l'esame misura
 * proprio quella sostanza (ferritina → ferro, vitamina D, B12, folati). Prima bastava che l'esame fosse «collegato»:
 * una ferritina alta portava a «Ferro: prima di prenderlo», un potassio al magnesio, i trigliceridi all'omega-3.
 */
const INTEGRATORE_DIRETTO: Record<string, string> = {
  ferritina: "ferro",
  "vitamina-d": "vitamina-d",
  "vitamina-b12": "vitamina-b12",
  folati: "acido-folico",
};

export function buildGuidaPersonale(explanation: Pick<Explanation, "items">): GuidaPersonale {
  const righe: Record<GuidaTema, GuidaRiga[]> = { integratori: [], alimentazione: [], intestino: [], esami: [], visita: [] };
  const viste = new Set<string>();
  let cibo = false;
  let intestino = false;

  for (const it of explanation.items) {
    const guida = guideForExam(it.nameExact);
    if (!guida) continue;
    const pos = itemGlance(it).position;
    const fuori = isOut(pos);
    const dove = DOVE[pos];
    const valore = [it.originalValueExact, it.originalUnitExact].filter(Boolean).join(" ");

    if (!viste.has(`g:${guida.slug}`)) {
      viste.add(`g:${guida.slug}`);
      righe.esami.push({ titolo: guida.examName, motivo: `Nel tuo referto: ${valore}, ${dove}.`, href: `/guide/${guida.slug}`, fuori });
    }

    const diretto = pos === "below-range" ? INTEGRATORI.find((i) => i.slug === INTEGRATORE_DIRETTO[guida.slug]) : undefined;
    if (diretto && !viste.has(`i:${diretto.slug}`)) {
      viste.add(`i:${diretto.slug}`);
      righe.integratori.push({
        titolo: `${diretto.name}: che cosa chiedere`,
        motivo: `${guida.examName} ${dove}: prima si cerca la causa con il medico. La scheda dice che cosa chiedere a lui o al farmacista.`,
        href: `/integratori/${diretto.slug}`,
        fuori,
      });
    }

    if (ALIMENTAZIONE.has(guida.slug)) {
      cibo = true;
      if (fuori && !viste.has(`a:${guida.slug}`)) {
        viste.add(`a:${guida.slug}`);
        righe.alimentazione.push({
          titolo: `${guida.examName}: che cosa dice la ricerca`,
          motivo: `Nel tuo referto è ${dove}. Alimentazione e movimento, in generale, da parlarne con il medico.`,
          href: "/prevenzione/alimentazione#con-i-tuoi-esami",
          fuori,
        });
      }
    }

    if (INTESTINO.has(guida.slug) && !intestino) {
      intestino = true;
      righe.intestino.push({ titolo: "Gli esami dell’intestino", motivo: `Nel tuo referto c’è ${guida.examName}: quando lo chiede il medico, e gli altri esami che gli stanno accanto.`, href: "/prevenzione/intestino-e-microbiota#esami", fuori });
    }
  }

  // Esami legati all'alimentazione tutti dentro l'intervallo: restano le basi, che valgono per tutti.
  if (cibo && !righe.alimentazione.length) {
    righe.alimentazione.push({ titolo: "Le basi di una sana alimentazione", motivo: "Nel tuo referto ci sono esami legati anche a quello che mangi: le indicazioni generali, per tutti.", href: "/prevenzione/alimentazione#basi", fuori: false });
  }
  if (cibo) {
    righe.intestino.push({ titolo: "Equilibrio intestinale: fibre, fermentati, probiotici", motivo: "Le fibre sono tra le basi di un’alimentazione varia: che cosa sono e dove si trovano.", href: "/prevenzione/intestino-e-microbiota#a-tavola", fuori: false });
  }

  const conGuide = righe.esami.length + righe.integratori.length + righe.alimentazione.length + righe.intestino.length > 0;
  if (!conGuide) return { gruppi: [] };

  righe.visita.push(
    { titolo: "Preparati alla visita", motivo: "In due minuti: che cosa portare, che cosa dire, che cosa chiedere.", href: "/strumenti/preparati-alla-visita", fuori: false },
    { titolo: "Le domande per il medico", motivo: "Più sotto, in questo report: sono legate ai tuoi esami.", href: "#domande-medico", fuori: false },
  );

  const gruppi = ORDINE.filter((t) => righe[t].length).map((tema) => ({
    tema,
    titolo: TITOLI[tema],
    // Prima le righe dei valori fuori dall'intervallo, poi le altre, ognuna nell'ordine del referto.
    righe: righe[tema].map((r, i) => ({ r, i })).sort((a, b) => Number(b.r.fuori) - Number(a.r.fuori) || a.i - b.i).map((x) => x.r),
  }));
  return { gruppi };
}

/**
 * L'esempio della pagina «Lettura referti»: tre valori INVENTATI (ferritina sotto, colesterolo LDL sopra, glicemia
 * dentro l'intervallo), gli stessi della tessera 4 della home. Passa dallo stesso calcolo del report vero.
 */
export function guidaEsempio(): GuidaPersonale {
  const voce = (id: string, nameExact: string, originalValueExact: string, originalUnitExact: string, originalReferenceExact: string) => ({
    sourceObservationId: id,
    nameExact,
    originalValueExact,
    originalUnitExact,
    originalReferenceExact,
    plainLanguageDefinition: "Esempio.",
    printedRangeNote: "",
    sourceCitation: { page: 1, line: 1, excerpt: "" },
    interpretationType: "general-term-definition" as const,
    limits: "",
  });
  return buildGuidaPersonale({
    items: [voce("es-1", "Ferritina", "14", "ng/mL", "30 - 400"), voce("es-2", "Colesterolo LDL", "134", "mg/dL", "< 115"), voce("es-3", "Glicemia", "92", "mg/dL", "70 - 99")],
  });
}

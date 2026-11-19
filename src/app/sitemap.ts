import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { AREAS } from "@/content/punto-di-partenza";
import { INTEGRATORI } from "@/content/integratori";
import { GLOSSARY_UPDATED, PAGES_UPDATED, absoluteUrl, glossaryIndexable, guideIndexable, indexingEnabled, integratoreIndexable } from "@/lib/seo";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { isDoctorPath, mediciEnabled } from "@/lib/medici";

const pdpReviewed = () => AREAS.every((a) => a.reviewStatus === "revisionato");

/**
 * 17/11/2026 (20 interventi, punti 1 e 13): le tre sezioni per prime; fuori le pagine confluite (/referti, /servizi
 * senza medici, /servizi/prevenzione, /con-un-medico); dentro Strumenti e l'elenco degli integratori.
 */
const PUBLIC = ["/", "/prevenzione", "/prevenzione/esami-di-base", "/prevenzione/intestino-e-microbiota", "/prevenzione/alimentazione", "/prevenzione/screening", "/vicino-a-te", "/scaffale", "/lettura-referti", "/medici", "/prezzi", "/guide", "/integratori", "/glossario", "/strumenti", "/strumenti/preparati-alla-visita", "/strumenti/domande-per-il-medico", "/punto-di-partenza", "/referti/esempio", "/famiglia", "/come-funziona", "/domande-frequenti", "/inizia", "/chi-siamo", "/contatti", "/sicurezza-e-privacy", "/accessibilita", "/stato-del-progetto", "/per-le-strutture", "/servizi", "/servizi/visita-a-domicilio", "/servizi/parla-con-un-medico", "/servizi/secondo-parere", "/per-i-medici"];

/**
 * Sitemap vuota finché l'indicizzazione è spenta: nessun URL viene proposto ai motori.
 * Ciclo 1: anche con l'indicizzazione accesa restano fuori i contenuti sanitari in bozza (guide cliniche, glossario,
 * Punto di Partenza finché le sue aree non sono revisionate). Vedi src/lib/seo.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled()) return [];
  const pages = new Date(PAGES_UPDATED);
  return [
    ...PUBLIC.filter((p) => p !== "/punto-di-partenza" || (puntoDiPartenzaEnabled() && pdpReviewed()))
      // Senza medici le loro pagine e l'elenco «I servizi» reindirizzano: non vanno proposti ai motori.
      .filter((p) => mediciEnabled() || (!isDoctorPath(p) && p !== "/servizi")).map((p) => ({ url: absoluteUrl(p), lastModified: pages, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...GUIDES.filter((g) => guideIndexable(g)).map((g) => ({ url: absoluteUrl(`/guide/${g.slug}`), lastModified: new Date(g.lastUpdated), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...INTEGRATORI.filter((i) => integratoreIndexable(i)).map((i) => ({ url: absoluteUrl(`/integratori/${i.slug}`), lastModified: new Date(i.lastUpdated), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...(glossaryIndexable() ? GLOSSARY : []).map((e) => ({ url: absoluteUrl(`/glossario/${e.slug}`), lastModified: new Date(GLOSSARY_UPDATED), changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}

import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { AREAS } from "@/content/punto-di-partenza";
import { absoluteUrl, glossaryIndexable, guideIndexable, indexingEnabled } from "@/lib/seo";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { isDoctorPath, mediciEnabled } from "@/lib/medici";

const pdpReviewed = () => AREAS.every((a) => a.reviewStatus === "revisionato");

const PUBLIC = ["/", "/referti", "/come-funziona", "/servizi", "/famiglia", "/servizi/parla-con-un-medico", "/servizi/visita-a-domicilio", "/prezzi", "/strumenti/preparati-alla-visita", "/servizi/prevenzione", "/servizi/secondo-parere", "/domande-frequenti", "/inizia", "/chi-siamo", "/per-i-medici", "/stato-del-progetto", "/contatti", "/sicurezza-e-privacy", "/accessibilita", "/per-le-strutture", "/referti/esempio", "/guide", "/glossario", "/strumenti/domande-per-il-medico", "/punto-di-partenza", "/con-un-medico"];

/**
 * Sitemap vuota finché l'indicizzazione è spenta: nessun URL viene proposto ai motori.
 * Ciclo 1: anche con l'indicizzazione accesa restano fuori i contenuti sanitari in bozza (guide cliniche, glossario,
 * Punto di Partenza finché le sue aree non sono revisionate). Vedi src/lib/seo.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled()) return [];
  const now = new Date();
  return [
    ...PUBLIC.filter((p) => p !== "/punto-di-partenza" || (puntoDiPartenzaEnabled() && pdpReviewed()))
      .filter((p) => (mediciEnabled() ? p !== "/con-un-medico" : !isDoctorPath(p))).map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...GUIDES.filter((g) => guideIndexable(g)).map((g) => ({ url: absoluteUrl(`/guide/${g.slug}`), lastModified: new Date(g.lastUpdated), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...(glossaryIndexable() ? GLOSSARY : []).map((e) => ({ url: absoluteUrl(`/glossario/${e.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}

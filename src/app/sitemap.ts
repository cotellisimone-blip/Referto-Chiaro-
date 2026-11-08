import type { MetadataRoute } from "next";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { absoluteUrl, indexingEnabled } from "@/lib/seo";

const PUBLIC = ["/", "/referti", "/come-funziona", "/servizi", "/servizi/archivio", "/servizi/visite-e-consulti", "/servizi/prevenzione", "/servizi/secondo-parere", "/domande-frequenti", "/inizia", "/chi-siamo", "/contatti", "/sicurezza-e-privacy", "/accessibilita", "/per-le-strutture", "/referti/esempio", "/guide", "/glossario"];

/** Sitemap vuota finché l'indicizzazione è spenta: nessun URL viene proposto ai motori. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexingEnabled()) return [];
  const now = new Date();
  return [
    ...PUBLIC.map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...GUIDES.map((g) => ({ url: absoluteUrl(`/guide/${g.slug}`), lastModified: new Date(g.lastUpdated), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...GLOSSARY.map((e) => ({ url: absoluteUrl(`/glossario/${e.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.4 })),
  ];
}

/**
 * Impostazioni SEO. L'indicizzazione è SPENTA finché i contenuti non hanno la revisione medica:
 * `ENABLE_INDEXING="true"` (valore esatto) accende robots index, sitemap e canonical.
 */
export const SITE_URL = (process.env.PUBLIC_BASE_URL ?? "https://cura-privata.invalid").replace(/\/$/, "");

export function indexingEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.ENABLE_INDEXING === "true";
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** JSON-LD serializzato in modo sicuro per l'inserimento in uno <script>. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/**
 * Indicizzazione per pagina (ciclo 1). Anche con ENABLE_INDEXING acceso, i contenuti sanitari ancora in bozza
 * (guide, glossario, Punto di Partenza) restano `noindex, follow` e fuori dalla sitemap finché un medico
 * identificato non li ha revisionati. Le guide puramente pratiche, senza contenuto clinico, possono essere indicizzate.
 */
export const NON_CLINICAL_GUIDES: ReadonlySet<string> = new Set(["fascicolo-sanitario-elettronico"]);

/** Il glossario non ha ancora una revisione medica registrata: resta fuori dagli indici. */
export const GLOSSARY_REVIEWED = false;

export const NOINDEX_DRAFT = { index: false, follow: true } as const;

export function guideIndexable(g: { slug: string; reviewStatus: string }, env: Record<string, string | undefined> = process.env): boolean {
  if (!indexingEnabled(env)) return false;
  return NON_CLINICAL_GUIDES.has(g.slug) || g.reviewStatus !== "draft-needs-clinical-review";
}

export function glossaryIndexable(env: Record<string, string | undefined> = process.env): boolean {
  return indexingEnabled(env) && GLOSSARY_REVIEWED;
}

/**
 * Dati strutturati dell'organizzazione: SOLO con i dati veri del titolare (nome + P.IVA in configurazione).
 * Senza, nessun JSON-LD: non si dichiara a Google un'entità che il sito non mostra.
 */
export function organizationLd(t: { name: string; vat: string; address?: string; email?: string } | null) {
  if (!t) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Cura Privata",
    legalName: t.name,
    vatID: t.vat,
    url: SITE_URL,
    logo: absoluteUrl("/brand/logo-mark.svg"),
    ...(t.address ? { address: t.address } : {}),
    ...(t.email ? { email: t.email } : {}),
  };
}

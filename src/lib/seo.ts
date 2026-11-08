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

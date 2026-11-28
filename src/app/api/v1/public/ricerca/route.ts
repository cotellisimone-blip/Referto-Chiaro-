import { buildSearchIndex } from "@/lib/search-index";

/** Indice di ricerca pubblico (guide, glossario, pagine): statico, nessun dato personale, cache lunga. */
export function GET() {
  return Response.json(
    { items: buildSearchIndex() },
    { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } },
  );
}

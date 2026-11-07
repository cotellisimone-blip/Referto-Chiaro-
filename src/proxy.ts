import { NextResponse, type NextRequest } from "next/server";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";

const GUIDE_SLUGS = new Set(GUIDES.map((g) => g.slug));
const GLOSSARY_SLUGS = new Set(GLOSSARY.map((e) => e.slug));

/**
 * Le pagine di guide e glossario sono prerenderizzate per gli slug noti. Per uno slug sconosciuto
 * il rendering parziale risponderebbe 200 con il contenuto «non trovato»: qui restituiamo un vero 404,
 * che conta per i motori di ricerca e per i link rotti.
 */
export function proxy(req: NextRequest) {
  const m = req.nextUrl.pathname.match(/^\/(guide|glossario)\/([^/]+)\/?$/);
  if (!m) return NextResponse.next();
  const slug = decodeURIComponent(m[2]);
  const known = m[1] === "guide" ? GUIDE_SLUGS.has(slug) : GLOSSARY_SLUGS.has(slug);
  if (known) return NextResponse.next();
  return NextResponse.rewrite(new URL("/pagina-non-trovata", req.url), { status: 404 });
}

export const config = { matcher: ["/guide/:slug", "/glossario/:slug"] };

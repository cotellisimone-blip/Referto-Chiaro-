import { NextResponse, type NextRequest } from "next/server";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { isDoctorApi, mediciEnabled } from "@/lib/medici";

const GUIDE_SLUGS = new Set(GUIDES.map((g) => g.slug));
const GLOSSARY_SLUGS = new Set(GLOSSARY.map((e) => e.slug));

/**
 * Le pagine di guide e glossario sono prerenderizzate per gli slug noti. Per uno slug sconosciuto
 * il rendering parziale risponderebbe 200 con il contenuto «non trovato»: qui restituiamo un vero 404,
 * che conta per i motori di ricerca e per i link rotti.
 */
export function proxy(req: NextRequest) {
  // 14/11/2026: senza medici (src/lib/medici.ts) i loro endpoint non esistono: 404, non un pulsante nascosto.
  if (req.nextUrl.pathname.startsWith("/api/")) {
    if (!mediciEnabled() && isDoctorApi(req.nextUrl.pathname)) {
      return NextResponse.json({ error: "non-disponibile", message: "I servizi con un medico non sono attivi." }, { status: 404 });
    }
    return NextResponse.next();
  }
  // Ciclo 3, fase 2: l'area personale riceve il percorso richiesto, così il login riporta lì e non alla pagina iniziale.
  if (req.nextUrl.pathname.startsWith("/area-personale")) {
    const headers = new Headers(req.headers);
    headers.set("x-cp-path", req.nextUrl.pathname);
    return NextResponse.next({ request: { headers } });
  }
  const m = req.nextUrl.pathname.match(/^\/(guide|glossario)\/([^/]+)\/?$/);
  if (!m) return NextResponse.next();
  const slug = decodeURIComponent(m[2]);
  const known = m[1] === "guide" ? GUIDE_SLUGS.has(slug) : GLOSSARY_SLUGS.has(slug);
  if (known) return NextResponse.next();
  return NextResponse.rewrite(new URL("/pagina-non-trovata", req.url), { status: 404 });
}

export const config = {
  matcher: [
    "/guide/:slug",
    "/glossario/:slug",
    "/area-personale",
    "/area-personale/:path*",
    // Endpoint dei servizi con un medico (DOCTOR_API in src/lib/medici.ts): il matcher deve essere statico.
    "/api/v1/medico/:path*",
    "/api/v1/area/appuntamenti/:path*",
    "/api/v1/area/casi/:path*",
    "/api/v1/area/medici/:path*",
  ],
};

import { NextResponse, type NextRequest } from "next/server";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { isDoctorApi, mediciEnabled } from "@/lib/medici";
import { MALATTIE } from "@/content/malattie";
import { INTEGRATORI } from "@/content/integratori";
import { AUTOVALUTAZIONI, SONNO_PAGINE } from "@/content/sonno";
import { DIARI } from "@/domain/diari/catalogo";

/**
 * 27/11/2026 (fase 1): gli elenchi chiusi di ogni sezione con pagine per voce. Un indirizzo che non è nell'elenco
 * riceve un vero 404 anche alla prima visita (prima malattie, diari, integratori e sonno rispondevano 200 la prima volta).
 */
const SLUGS: Record<string, Set<string>> = {
  guide: new Set(GUIDES.map((g) => g.slug)),
  glossario: new Set(GLOSSARY.map((e) => e.slug)),
  malattie: new Set(MALATTIE.filter((m) => m.slug !== "sonno").map((m) => m.slug)),
  integratori: new Set(INTEGRATORI.map((i) => i.slug)),
  diari: new Set(DIARI.map((d) => d.slug)),
  "prenditi-cura-di-te/sonno": new Set([...SONNO_PAGINE.map((p) => p.slug), ...AUTOVALUTAZIONI.map((a) => a.slug)]),
};

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
  const m = req.nextUrl.pathname.match(/^\/(guide|glossario|malattie|integratori|diari|prenditi-cura-di-te\/sonno)\/([^/]+)\/?$/);
  if (!m) return NextResponse.next();
  let slug = m[2];
  try {
    slug = decodeURIComponent(slug);
  } catch {
    // Indirizzo malformato: non è nell'elenco.
  }
  if (SLUGS[m[1]].has(slug)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/pagina-non-trovata", req.url), { status: 404 });
}

export const config = {
  matcher: [
    "/guide/:slug",
    "/glossario/:slug",
    "/malattie/:slug",
    "/integratori/:slug",
    "/diari/:slug",
    "/prenditi-cura-di-te/sonno/:slug",
    "/area-personale",
    "/area-personale/:path*",
    // Endpoint dei servizi con un medico (DOCTOR_API in src/lib/medici.ts): il matcher deve essere statico.
    "/api/v1/medico/:path*",
    "/api/v1/area/appuntamenti/:path*",
    "/api/v1/area/casi/:path*",
    "/api/v1/area/medici/:path*",
  ],
};

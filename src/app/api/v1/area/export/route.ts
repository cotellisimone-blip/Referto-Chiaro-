import { requireUser } from "@/lib/auth/guard";
import { exportUserData } from "@/lib/auth/service";

/** Esportazione di tutti i propri dati in JSON (portabilità). */
export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const data = await exportUserData(g.user.id);
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="cura-privata-miei-dati.json"', "Cache-Control": "no-store" },
  });
}

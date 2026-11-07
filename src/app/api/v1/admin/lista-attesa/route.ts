import { requireRole } from "@/lib/auth/guard";
import { listWaitlist } from "@/lib/waitlist";
import { json } from "@/lib/api";

const csvCell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET(req: Request) {
  const g = await requireRole(["admin"]);
  if ("response" in g) return g.response;
  const rows = await listWaitlist();
  if (new URL(req.url).searchParams.get("formato") === "csv") {
    const head = ["email", "interesse", "organizzazione", "nota", "consenso", "data"].join(",");
    const body = rows.map((r) => [r.email, r.interest, r.organization, r.note, r.consent_version, r.created_at].map(csvCell).join(",")).join("\n");
    return new Response(`${head}\n${body}\n`, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="lista-attesa.csv"', "Cache-Control": "no-store" } });
  }
  return json({ waitlist: rows });
}

import { requireRole } from "@/lib/auth/guard";
import { listWaitlist } from "@/lib/waitlist";
import { json } from "@/lib/api";
import { maskEmail } from "@/lib/demo-mask";

/** Cella CSV: virgolette raddoppiate e caratteri iniziali di formula neutralizzati (=, +, -, @, tab, CR). */
const csvCell = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: Request) {
  const g = await requireRole(["admin"]);
  if ("response" in g) return g.response;
  const all = await listWaitlist();
  // L'admin dimostrativo non vede le email vere (src/lib/demo-mask.ts).
  const rows = g.user.isDemo ? all.map((r) => ({ ...r, email: maskEmail(r.email), organization: null, note: null })) : all;
  if (new URL(req.url).searchParams.get("formato") === "csv") {
    const head = ["email", "interesse", "organizzazione", "nota", "consenso", "data"].join(",");
    const body = rows.map((r) => [r.email, r.interest, r.organization, r.note, r.consent_version, r.created_at].map(csvCell).join(",")).join("\n");
    return new Response(`${head}\n${body}\n`, { status: 200, headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="lista-attesa.csv"', "Cache-Control": "no-store" } });
  }
  return json({ waitlist: rows });
}

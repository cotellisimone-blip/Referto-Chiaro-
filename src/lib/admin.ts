import "server-only";
import { audit, withSystem } from "@/db/client";
import { publicConfig, readFlags } from "@/lib/feature-flags";
import { PDP_EVENTS } from "@/domain/metrics/funnel";

/** Letture di sistema riservate all'admin (dopo requireRole + 2FA). Ogni lettura è registrata. */
export async function adminOverview(adminId: string) {
  return withSystem(async (tx) => {
    await audit(tx, { userId: adminId, actor: "admin", action: "overview-viewed" });
    const one = async (sql: string) => Number((await tx.query(sql)).rows[0]?.n ?? 0);
    return {
      users: await one("SELECT count(*)::int AS n FROM users WHERE deleted_at IS NULL"),
      demoUsers: await one("SELECT count(*)::int AS n FROM users WHERE deleted_at IS NULL AND is_demo"),
      documents: await one("SELECT count(*)::int AS n FROM documents"),
      reportsReady: await one("SELECT count(*)::int AS n FROM reports WHERE status = 'ready'"),
      dossiers: await one("SELECT count(*)::int AS n FROM dossiers"),
      ordersPaid: await one("SELECT count(*)::int AS n FROM orders WHERE status = 'paid'"),
      ordersPending: await one("SELECT count(*)::int AS n FROM orders WHERE status = 'pending'"),
      revenueCents: await one("SELECT coalesce(sum(amount_cents), 0)::int AS n FROM orders WHERE status = 'paid'"),
      waitlist: await one("SELECT count(*)::int AS n FROM waitlist"),
      casesOpen: await one("SELECT count(*)::int AS n FROM cases WHERE status IN ('submitted', 'accepted')"),
      physiciansVerified: await one("SELECT count(*)::int AS n FROM physicians WHERE status = 'verified'"),
      jobsFailed: await one("SELECT count(*)::int AS n FROM jobs WHERE status = 'failed'"),
    };
  });
}

export async function adminAuditTail(adminId: string, limit = 200) {
  return withSystem(async (tx) => {
    await audit(tx, { userId: adminId, actor: "admin", action: "audit-viewed" });
    const r = await tx.query("SELECT id, user_id, actor, action, target, created_at FROM audit_log ORDER BY created_at DESC LIMIT $1", [limit]);
    return r.rows.map((x) => ({ id: String(x.id), userId: (x.user_id as string | null) ?? null, actor: String(x.actor), action: String(x.action), target: (x.target as string | null) ?? null, createdAt: new Date(x.created_at as string).toISOString() }));
  });
}

export async function adminListOrders(adminId: string, limit = 200) {
  return withSystem(async (tx) => {
    await audit(tx, { userId: adminId, actor: "admin", action: "orders-listed" });
    const r = await tx.query(
      "SELECT o.id, o.service, o.amount_cents, o.currency, o.status, o.provider, o.created_at, o.paid_at, u.email FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC LIMIT $1",
      [limit],
    );
    return r.rows.map((x) => ({
      id: String(x.id),
      service: String(x.service),
      amountCents: Number(x.amount_cents),
      currency: String(x.currency),
      status: String(x.status),
      provider: String(x.provider),
      email: String(x.email),
      createdAt: new Date(x.created_at as string).toISOString(),
      paidAt: x.paid_at ? new Date(x.paid_at as string).toISOString() : null,
    }));
  });
}

/** Stato dei gate: solo lettura. Nessun segreto (chiavi, URL del DB) viene esposto. */
export function adminConfig() {
  const flags = readFlags();
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  return {
    flags,
    public: publicConfig(flags),
    payments: key.startsWith("sk_live_") ? "stripe-live (richiede gate)" : key.startsWith("sk_test_") ? "stripe-test" : "simulato",
    database: process.env.DATABASE_URL ? "postgresql" : `pglite (${process.env.PGLITE_DATA_DIR ?? "memoria"})`,
  };
}

/** Funnel degli ultimi N giorni: contatori anonimi + passi calcolati dai dati esistenti. Account demo esclusi. */
export async function adminFunnel(adminId: string, days = 30) {
  return withSystem(async (tx) => {
    await audit(tx, { userId: adminId, actor: "admin", action: "funnel-viewed" });
    const one = async (sql: string) => Number((await tx.query(sql, [days])).rows[0]?.n ?? 0);
    const since = "now() - make_interval(days => $1::int)";
    const real = "u.deleted_at IS NULL AND NOT u.is_demo";
    const pub = await tx.query<{ event: string; n: number }>("SELECT event, sum(count)::int AS n FROM funnel_daily WHERE day >= current_date - $1::int GROUP BY event", [days]);
    const counters = Object.fromEntries(pub.rows.map((r) => [r.event, Number(r.n)]));
    return {
      days,
      steps: {
        "visita-home": counters["visita-home"] ?? 0,
        "cta-capisci": counters["cta-capisci"] ?? 0,
        "cta-medico": counters["cta-medico"] ?? 0,
        "cta-parere": counters["cta-parere"] ?? 0,
        ...Object.fromEntries(PDP_EVENTS.map((e) => [e, counters[e] ?? 0])),
        uploads: await one(`SELECT count(*)::int AS n FROM documents d JOIN users u ON u.id = d.user_id WHERE ${real} AND d.created_at >= ${since}`),
        checkoutCapisci: await one(`SELECT count(*)::int AS n FROM orders o JOIN users u ON u.id = o.user_id WHERE ${real} AND o.service = 'essenziale' AND o.created_at >= ${since}`),
        paidCapisci: await one(`SELECT count(*)::int AS n FROM orders o JOIN users u ON u.id = o.user_id WHERE ${real} AND o.service = 'essenziale' AND o.status = 'paid' AND o.created_at >= ${since}`),
        reportsReady: await one(`SELECT count(*)::int AS n FROM reports r JOIN users u ON u.id = r.user_id WHERE ${real} AND r.status = 'ready' AND r.created_at >= ${since}`),
        reportToMedico: await one(`SELECT count(DISTINCT o.id)::int AS n FROM orders o JOIN users u ON u.id = o.user_id WHERE ${real} AND o.service = 'videoconsulto' AND o.status = 'paid' AND o.created_at >= ${since} AND EXISTS (SELECT 1 FROM reports r WHERE r.user_id = o.user_id AND r.status = 'ready' AND r.created_at < o.created_at)`),
        reportToParere: await one(`SELECT count(DISTINCT o.id)::int AS n FROM orders o JOIN users u ON u.id = o.user_id WHERE ${real} AND o.service = 'secondo-parere' AND o.status = 'paid' AND o.created_at >= ${since} AND EXISTS (SELECT 1 FROM reports r WHERE r.user_id = o.user_id AND r.status = 'ready' AND r.created_at < o.created_at)`),
        returning: await one(`SELECT count(*)::int AS n FROM (SELECT o.user_id FROM orders o JOIN users u ON u.id = o.user_id WHERE ${real} AND o.service = 'essenziale' AND o.status = 'paid' AND o.created_at >= ${since} GROUP BY o.user_id HAVING count(*) >= 2) x`),
      } as Record<string, number>,
    };
  });
}

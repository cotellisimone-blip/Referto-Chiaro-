import "server-only";
import { audit, withSystem } from "@/db/client";
import { publicConfig, readFlags } from "@/lib/feature-flags";

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

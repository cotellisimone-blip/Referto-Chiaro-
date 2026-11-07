import "server-only";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { Pool, type PoolClient } from "pg";

/**
 * Accesso al database.
 * - Senza DATABASE_URL: PGlite (PostgreSQL embedded) in `PGLITE_DATA_DIR` o in memoria. Zero configurazione per demo e test.
 * - Con DATABASE_URL: PostgreSQL vero tramite `pg`. Stesso schema, stesse policy.
 *
 * Tutte le letture/scritture su dati personali passano da `withUser`, che apre una transazione con
 * ruolo non proprietario e `app.user_id`: le policy RLS fanno il resto.
 * `withSystem` serve solo alle operazioni senza utente (login, pulizie): è l'eccezione, non la regola.
 */

export interface Queryable {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[]; rowCount: number }>;
}

type Driver =
  | { kind: "pglite"; db: PGlite }
  | { kind: "pg"; pool: Pool };

// Un solo driver per processo, anche se Next.js impacchetta questo modulo in più chunk
// (pagine e route API): due istanze PGlite sulla stessa cartella vedrebbero dati diversi.
const G = globalThis as unknown as { __rcDriver?: Promise<Driver> | null };

async function migrate(q: Queryable) {
  const sql = await readFile(path.join(process.cwd(), "src/db/schema.sql"), "utf8");
  await q.query(sql);
}

async function createDriver(): Promise<Driver> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const pool = new Pool({ connectionString: url, max: 10 });
    const c = await pool.connect();
    try {
      await migrate(wrapPg(c));
    } finally {
      c.release();
    }
    return { kind: "pg", pool };
  }
  const dir = process.env.PGLITE_DATA_DIR;
  if (dir) await mkdir(dir, { recursive: true });
  const db = dir ? new PGlite(dir) : new PGlite();
  await db.waitReady;
  await db.exec(await readFile(path.join(process.cwd(), "src/db/schema.sql"), "utf8"));
  return { kind: "pglite", db };
}

export function getDriver(): Promise<Driver> {
  if (!G.__rcDriver) G.__rcDriver = createDriver();
  return G.__rcDriver;
}

/** Solo per i test: sostituisce il driver con un PGlite in memoria. */
export async function resetDatabaseForTests() {
  G.__rcDriver = null;
  delete process.env.DATABASE_URL;
  delete process.env.PGLITE_DATA_DIR;
  await getDriver();
}

function wrapPg(c: PoolClient): Queryable {
  return {
    async query(sql, params) {
      const r = await c.query(sql, params as unknown[]);
      return { rows: r.rows, rowCount: r.rowCount ?? r.rows.length };
    },
  };
}

type TxFn<T> = (tx: Queryable) => Promise<T>;

async function transaction<T>(setup: string[], fn: TxFn<T>): Promise<T> {
  const d = await getDriver();
  if (d.kind === "pglite") {
    return d.db.transaction(async (tx) => {
      for (const s of setup) await tx.exec(s);
      return fn({
        async query(sql, params) {
          const r = await tx.query(sql, params as unknown[]);
          return { rows: r.rows as never, rowCount: r.affectedRows ?? r.rows.length };
        },
      });
    });
  }
  const c = await d.pool.connect();
  try {
    await c.query("BEGIN");
    for (const s of setup) await c.query(s);
    const out = await fn(wrapPg(c));
    await c.query("COMMIT");
    return out;
  } catch (e) {
    await c.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    c.release();
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Transazione nel contesto di un utente: la RLS limita ogni tabella alle sue righe. */
export async function withUser<T>(userId: string, fn: TxFn<T>): Promise<T> {
  if (!UUID.test(userId)) throw new Error("userId non valido");
  return transaction(["SET LOCAL ROLE app_rls", `SET LOCAL app.user_id = '${userId}'`], fn);
}

/** Transazione di sistema (senza utente): usata da login, registrazione e manutenzione. */
export function withSystem<T>(fn: TxFn<T>): Promise<T> {
  return transaction([], fn);
}

/** Registro append-only. Mai dati sanitari né token: solo azione, attore e riferimento. */
export async function audit(q: Queryable, entry: { userId: string | null; actor: string; action: string; target?: string }) {
  await q.query("INSERT INTO audit_log(id, user_id, actor, action, target) VALUES (gen_random_uuid(), $1, $2, $3, $4)", [
    entry.userId,
    entry.actor,
    entry.action,
    entry.target ?? null,
  ]);
}

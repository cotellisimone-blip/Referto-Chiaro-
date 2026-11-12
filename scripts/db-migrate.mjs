#!/usr/bin/env node
/**
 * Migrazione del database PostgreSQL gestito (Neon, Supabase, Vercel Postgres…).
 * Uso: DATABASE_URL=postgres://... npm run db:migrate
 *
 * - Applica src/db/schema.sql (idempotente: si può rieseguire a ogni deploy).
 * - Un advisory lock impedisce due migrazioni in parallelo (deploy concorrenti).
 * - Concede al ruolo di connessione l'appartenenza a `app_rls`, necessaria per `SET LOCAL ROLE app_rls`
 *   (senza, la Row Level Security non si può applicare e le richieste falliscono: fail-closed).
 * Senza DATABASE_URL non fa nulla (sviluppo locale con PGlite).
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.log("[db:migrate] DATABASE_URL assente: nessuna migrazione (in locale si usa PGlite).");
  process.exit(0);
}

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  await client.query("SELECT pg_advisory_lock(727274)");
  const sql = await readFile(path.join(process.cwd(), "src/db/schema.sql"), "utf8");
  await client.query(sql);
  await client.query(`DO $$ BEGIN
    EXECUTE format('GRANT app_rls TO %I', current_user);
  EXCEPTION WHEN others THEN RAISE NOTICE 'GRANT app_rls non necessario o non consentito: %', SQLERRM;
  END $$;`);
  // Verifica: il ruolo di connessione deve poter assumere app_rls, altrimenti la RLS non si applica.
  await client.query("BEGIN");
  await client.query("SET LOCAL ROLE app_rls");
  await client.query("ROLLBACK");
  const v = await client.query("SELECT max(version) AS v FROM schema_migrations");
  console.log(`[db:migrate] schema aggiornato alla versione ${v.rows[0].v}; ruolo app_rls utilizzabile.`);
} catch (e) {
  console.error(`[db:migrate] ERRORE: ${e.message}`);
  process.exitCode = 1;
} finally {
  await client.query("SELECT pg_advisory_unlock(727274)").catch(() => {});
  await client.end();
}

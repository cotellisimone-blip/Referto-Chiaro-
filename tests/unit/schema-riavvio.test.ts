import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

/**
 * 27/11/2026 (fase 1): lo schema si riesegue a ogni avvio. Prima un vincolo ripetuto con un elenco più corto faceva
 * fallire il riavvio se c'erano già consensi «family-delegation» o liste d'attesa «famiglia»: ogni pagina dava 500.
 */
describe("schema rieseguito al riavvio", () => {
  it("riparte con consensi e liste d'attesa aggiunti per ultimi già salvati", async () => {
    const sql = await readFile(path.join(process.cwd(), "src/db/schema.sql"), "utf8");
    const db = new PGlite();
    await db.waitReady;
    await db.exec(sql);
    const user = "00000000-0000-4000-8000-000000000001";
    await db.query("INSERT INTO users (id, email) VALUES ($1, 'riavvio@prova.invalid')", [user]);
    for (const kind of ["video-consult", "family-delegation"]) {
      await db.query("INSERT INTO consents (id, user_id, kind, version, granted) VALUES (gen_random_uuid(), $1, $2, 'v1', true)", [user, kind]);
    }
    for (const interest of ["domicilio", "famiglia"]) {
      await db.query("INSERT INTO waitlist (id, email, interest, consent_version) VALUES (gen_random_uuid(), $1, $2, 'v1')", [`${interest}@prova.invalid`, interest]);
    }
    await expect(db.exec(sql)).resolves.toBeDefined();
    await db.close();
  });
});

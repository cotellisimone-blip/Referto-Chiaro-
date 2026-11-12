import { beforeAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { resetDatabaseForTests, withSystem, withUser } from "@/db/client";

/** Dimostra che la RLS impedisce a un utente di vedere, modificare o cancellare i dati di un altro. */
describe("isolamento per utente (RLS)", () => {
  const alice = randomUUID();
  const bob = randomUUID();
  let docAlice = "";

  beforeAll(async () => {
    await resetDatabaseForTests();
    await withSystem(async (tx) => {
      await tx.query("INSERT INTO users(id, email) VALUES ($1, $2), ($3, $4)", [alice, "alice@test.invalid", bob, "bob@test.invalid"]);
    });
    docAlice = await withUser(alice, async (tx) => {
      const r = await tx.query<{ id: string }>(
        "INSERT INTO documents(id, user_id, title, source_kind, source_ref, status) VALUES (gen_random_uuid(), $1, 'Doc di Alice', 'synthetic', 'x', 'ready') RETURNING id",
        [alice],
      );
      return r.rows[0].id;
    });
  });

  it("il proprietario vede il proprio documento", async () => {
    const r = await withUser(alice, (tx) => tx.query("SELECT id FROM documents"));
    expect(r.rows.map((x) => x.id)).toEqual([docAlice]);
  });

  it("un altro utente non vede, non modifica e non cancella", async () => {
    const seen = await withUser(bob, (tx) => tx.query("SELECT id FROM documents WHERE id = $1", [docAlice]));
    expect(seen.rows).toEqual([]);
    const upd = await withUser(bob, (tx) => tx.query("UPDATE documents SET title = 'hack' WHERE id = $1", [docAlice]));
    expect(upd.rowCount).toBe(0);
    const del = await withUser(bob, (tx) => tx.query("DELETE FROM documents WHERE id = $1", [docAlice]));
    expect(del.rowCount).toBe(0);
    const still = await withUser(alice, (tx) => tx.query<{ title: string }>("SELECT title FROM documents"));
    expect(still.rows[0].title).toBe("Doc di Alice");
  });

  it("non si può inserire una riga a nome di un altro utente", async () => {
    await expect(
      withUser(bob, (tx) =>
        tx.query("INSERT INTO documents(id, user_id, title, source_kind, source_ref, status) VALUES (gen_random_uuid(), $1, 'x', 'synthetic', 'x', 'ready')", [alice]),
      ),
    ).rejects.toThrow(/row-level security/i);
  });

  it("senza contesto utente non si vede nulla", async () => {
    const r = await withSystem(async (tx) => {
      await tx.query("SET LOCAL ROLE app_rls");
      return tx.query("SELECT id FROM documents");
    });
    expect(r.rows).toEqual([]);
  });

  it("un userId non valido viene rifiutato prima di toccare il database", async () => {
    await expect(withUser("'; DROP TABLE users; --", (tx) => tx.query("SELECT 1"))).rejects.toThrow(/non valido/);
  });

  it("il registro è append-only per il ruolo applicativo", async () => {
    await withUser(alice, (tx) => tx.query("INSERT INTO audit_log(id, user_id, actor, action) VALUES (gen_random_uuid(), $1, 'user', 'test')", [alice]));
    await expect(withUser(alice, (tx) => tx.query("DELETE FROM audit_log"))).rejects.toThrow(/permission denied/i);
  });
});

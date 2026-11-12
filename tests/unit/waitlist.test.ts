import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { resetDatabaseForTests } from "@/db/client";
import { addToWaitlist, listWaitlist } from "@/lib/waitlist";

describe("lista d'attesa", () => {
  beforeAll(async () => {
    await resetDatabaseForTests();
  });

  it("normalizza l'email e salva la versione del consenso", async () => {
    expect(await addToWaitlist({ email: "  Mario@Esempio.TEST ", interest: "completo" })).toEqual({ ok: true });
    const rows = await listWaitlist();
    expect(rows[0]).toMatchObject({ email: "mario@esempio.test", interest: "completo", consent_version: "bozza-2026-11", organization: null, note: null });
  });

  it("è idempotente su (email, interesse)", async () => {
    await addToWaitlist({ email: "a@esempio.test", interest: "strutture", organization: "Lab" });
    expect(await addToWaitlist({ email: "A@esempio.test", interest: "strutture" })).toEqual({ ok: true, already: true });
    expect((await listWaitlist()).filter((r) => r.email === "a@esempio.test" && r.interest === "strutture")).toHaveLength(1);
    expect(await addToWaitlist({ email: "a@esempio.test", interest: "completo" })).toEqual({ ok: true });
  });

  it("rifiuta dati non validi", async () => {
    await expect(addToWaitlist({ email: "non-valida", interest: "completo" })).rejects.toThrow();
    await expect(addToWaitlist({ email: "b@esempio.test", interest: "altro" as never })).rejects.toThrow();
    await expect(addToWaitlist({ email: "b@esempio.test", interest: "strutture", organization: "x".repeat(121) })).rejects.toThrow();
    await expect(addToWaitlist({ email: "b@esempio.test", interest: "completo", note: "x".repeat(501) })).rejects.toThrow();
    await expect(addToWaitlist({ email: "b@esempio.test", interest: "completo", extra: 1 } as never)).rejects.toThrow();
  });

  it("l'elenco parte dal più recente", async () => {
    await addToWaitlist({ email: "ultimo@esempio.test", interest: "secondo-parere" });
    const rows = await listWaitlist();
    expect(rows[0].email).toBe("ultimo@esempio.test");
  });
});

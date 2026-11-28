import { beforeAll, describe, expect, it } from "vitest";
import { resetDatabaseForTests, withSystem } from "@/db/client";
import { POST } from "@/app/api/v1/public/evento/route";
import { isPublicEvent } from "@/domain/metrics/funnel";

const req = (body: string) => new Request("http://localhost/api/v1/public/evento", { method: "POST", body, headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1" } });

describe("funnel anonimo", () => {
  beforeAll(async () => {
    await resetDatabaseForTests();
  });

  it("accetta solo eventi noti e conta per giorno, senza identificativi", async () => {
    expect(isPublicEvent("cta-capisci")).toBe(true);
    expect(isPublicEvent("email@x.it")).toBe(false);
    expect((await POST(req(JSON.stringify({ event: "cta-capisci" })))).status).toBe(204);
    expect((await POST(req(JSON.stringify({ event: "cta-capisci" })))).status).toBe(204);
    expect((await POST(req(JSON.stringify({ event: "qualsiasi" })))).status).toBe(400);
    expect((await POST(req("non json"))).status).toBe(400);
    const r = await withSystem((tx) => tx.query<{ count: number }>("SELECT count FROM funnel_daily WHERE event = 'cta-capisci'"));
    expect(Number(r.rows[0].count)).toBe(2);
    const cols = await withSystem((tx) => tx.query<{ column_name: string }>("SELECT column_name FROM information_schema.columns WHERE table_name = 'funnel_daily'"));
    expect(cols.rows.map((c) => c.column_name).sort()).toEqual(["count", "day", "event"]);
  });
});

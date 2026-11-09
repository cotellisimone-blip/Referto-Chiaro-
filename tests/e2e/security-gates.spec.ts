import { test, expect } from "@playwright/test";

test.describe("fail-closed lato server", () => {
  test("upload reale bloccato", async ({ request }) => {
    const res = await request.post("/api/v1/documents", { multipart: { file: { name: "referto.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") } } });
    expect(res.status()).toBe(403);
    expect(await res.json()).toMatchObject({ error: "capability-disabled", feature: "realUploads" });
  });

  test("upload reale dell'area personale bloccato prima ancora del login", async ({ request }) => {
    const res = await request.post("/api/v1/area/documents/upload", { multipart: { file: { name: "referto.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4") } } });
    expect(res.status()).toBe(403);
    expect(await res.json()).toMatchObject({ error: "capability-disabled", feature: "realUploads" });
  });

  test("il cron senza segreto risponde 401", async ({ request }) => {
    expect((await request.get("/api/cron/jobs")).status()).toBe(401);
    expect((await request.get("/api/cron/jobs", { headers: { authorization: "Bearer indovina" } })).status()).toBe(401);
  });

  test("la configurazione pubblica dichiara tutto spento", async ({ request }) => {
    const res = await request.get("/api/v1/public/config");
    expect(await res.json()).toEqual({
      mode: "demo",
      capabilities: { realUploads: false, aiProcessing: false, livePayments: false, medicalSecondOpinion: false, medicalVideoConsult: false, publicSignup: false },
    });
  });

  test("la demo rifiuta documenti diversi dalla fixture", async ({ request }) => {
    const res = await request.post("/api/v1/demo/report", { data: { documentId: "mio-referto", confirmedObservationIds: ["obs-01"] } });
    expect(res.status()).toBe(404);
  });

  test("la demo rifiuta campi extra (nessun contenuto libero accettato)", async ({ request }) => {
    const res = await request.post("/api/v1/demo/report", {
      data: { documentId: "demo-referto-lab-001", confirmedObservationIds: ["obs-01"], text: "Il mio referto: ..." },
    });
    expect(res.status()).toBe(400);
  });

  test("il PDF demo è un PDF valido", async ({ request }) => {
    const res = await request.post("/api/v1/demo/report/pdf", { data: { documentId: "demo-referto-lab-001", confirmedObservationIds: ["obs-01", "obs-02"] } });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("application/pdf");
    expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
  });
});

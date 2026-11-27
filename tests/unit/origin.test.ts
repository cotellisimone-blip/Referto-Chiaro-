import { describe, expect, it } from "vitest";
import { crossOrigin, readJson } from "@/lib/auth/guard";

const req = (h: Record<string, string>) => new Request("http://localhost:3000/api/v1/x", { method: "POST", headers: h, body: "{}" });

describe("controllo dell'Origin (fase 1, sicurezza)", () => {
  it("stesso sito o nessun Origin: passa", () => {
    expect(crossOrigin(req({ host: "localhost:3000", origin: "http://localhost:3000" }))).toBe(false);
    expect(crossOrigin(req({ host: "localhost:3000" }))).toBe(false);
  });
  it("un altro sito: 403", async () => {
    expect(crossOrigin(req({ host: "curaprivata.it", origin: "https://sito-cattivo.example" }))).toBe(true);
    const r = await readJson(req({ host: "curaprivata.it", origin: "https://sito-cattivo.example" }));
    expect("response" in r && r.response.status).toBe(403);
  });
});

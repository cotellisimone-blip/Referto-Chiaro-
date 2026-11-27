import { describe, expect, it } from "vitest";
import { blocchiDiari } from "@/domain/diari/foglio-unico";
import type { VoceDiario } from "@/domain/diari/voci";

const v = (diario: VoceDiario["diario"], at: string, dati: unknown) => ({ id: at + diario, profileId: null, diario, at, dati, note: null, createdAt: at }) as VoceDiario;

describe("foglio unico per il medico: i diari in poche righe", () => {
  it("una riga di medie per diario, solo per i diari con misure, senza giudizi", () => {
    const voci = [
      v("pressione", "2026-11-25T07:30", { sys: 130, dia: 80, bpm: 70 }),
      v("pressione", "2026-11-26T07:30", { sys: 134, dia: 84, bpm: 72 }),
      v("glicemia", "2026-11-26T07:00", { mgdl: 98, momento: "digiuno" }),
      v("peso", "2026-11-20T07:00", { kg: 72.4 }),
      v("peso", "2026-11-26T07:00", { kg: 71.8 }),
    ];
    const b = blocchiDiari(voci, "2026-11-27");
    expect(b.map((x) => x.diario)).toEqual(["pressione", "glicemia", "peso"]);
    expect(b[0].righe[0]).toBe("Media 132/82 mmHg su 2 misure");
    expect(b[1].righe[0]).toBe("A digiuno: media 98 mg/dL, da 98 a 98 (1 misura)");
    expect(b[2].righe.join(" ")).toContain("−0,6 kg");
    const testo = b.flatMap((x) => x.righe).join(" ").toLowerCase();
    for (const bad of ["alta", "alto", "bassa", "basso", "normale", "nella norma"]) expect(testo).not.toContain(bad);
  });
  it("niente diari, niente blocchi", () => {
    expect(blocchiDiari([], "2026-11-27")).toEqual([]);
  });
});

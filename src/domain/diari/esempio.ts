import { addDays, type NuovaVoce } from "./voci";

/**
 * Voci di esempio per l'account dimostrativo (21/11/2026): sei giorni di pressione, due settimane di glicemia, un
 * mese di diario del mal di testa. Numeri inventati, plausibili, senza storia clinica: servono a vedere medie,
 * grafico e foglio per il medico. Le date partono da `oggi` all'indietro.
 */
export function vociEsempio(oggi: string): NuovaVoce[] {
  const out: NuovaVoce[] = [];
  const P: [number, number, number][][] = [
    [[136, 85, 70], [133, 84, 69], [131, 82, 72], [130, 81, 71]],
    [[134, 86, 68], [131, 84, 67], [129, 80, 73], [128, 80, 72]],
    [[132, 84, 71], [130, 83, 70], [133, 82, 75], [129, 81, 74]],
    [[135, 87, 69], [131, 85, 68], [128, 79, 72], [127, 79, 70]],
    [[131, 83, 70], [129, 82, 70], [130, 81, 73], [128, 80, 72]],
    [[133, 85, 68], [130, 83, 67], [127, 80, 71], [126, 79, 70]],
  ];
  P.forEach((g, i) => {
    const day = addDays(oggi, -(P.length - i));
    const at = (h: string) => `${day}T${h}`;
    out.push(
      { diario: "pressione", profileId: null, at: at("07:30"), note: i === 0 ? "Primo giorno con l'apparecchio nuovo" : null, dati: { sys: g[0][0], dia: g[0][1], bpm: g[0][2] } },
      { diario: "pressione", profileId: null, at: at("07:32"), note: null, dati: { sys: g[1][0], dia: g[1][1], bpm: g[1][2] } },
      { diario: "pressione", profileId: null, at: at("20:05"), note: null, dati: { sys: g[2][0], dia: g[2][1], bpm: g[2][2] } },
      { diario: "pressione", profileId: null, at: at("20:07"), note: null, dati: { sys: g[3][0], dia: g[3][1], bpm: g[3][2] } },
    );
  });
  const G: [number, string, "digiuno" | "dopo-pasto" | "prima-pasto" | "sera", string | null][] = [
    [-13, "07:15", "digiuno", null], [-13, "15:00", "dopo-pasto", "Pranzo con pasta"],
    [-11, "07:20", "digiuno", null], [-11, "21:50", "sera", null],
    [-9, "07:10", "digiuno", null], [-9, "12:30", "prima-pasto", null],
    [-7, "07:25", "digiuno", null], [-7, "14:40", "dopo-pasto", "Passeggiata dopo pranzo"],
    [-5, "07:05", "digiuno", null], [-5, "22:00", "sera", null],
    [-3, "07:30", "digiuno", "Dormito poco"], [-3, "14:50", "dopo-pasto", null],
    [-1, "07:15", "digiuno", null], [-1, "12:40", "prima-pasto", null],
  ];
  const GV = [112, 148, 108, 121, 115, 102, 109, 132, 105, 118, 121, 141, 107, 99];
  G.forEach(([d, h, momento, note], i) => out.push({ diario: "glicemia", profileId: null, at: `${addDays(oggi, d)}T${h}`, note, dati: { mgdl: GV[i], momento } }));
  const C: Record<number, { h: string; i: "lieve" | "media" | "forte"; ore: number; s: ("nausea" | "luce" | "rumori" | "vista")[]; f: string | null; n: string | null }> = {
    [-26]: { h: "15:00", i: "media", ore: 5, s: ["luce"], f: "Paracetamolo", n: "Dormito poco" },
    [-19]: { h: "09:30", i: "forte", ore: 10, s: ["nausea", "luce", "rumori"], f: "Ibuprofene", n: "Ciclo" },
    [-18]: { h: "08:00", i: "lieve", ore: 3, s: [], f: null, n: null },
    [-11]: { h: "17:45", i: "media", ore: 4, s: ["luce"], f: "Paracetamolo", n: "Giornata di lavoro lunga" },
    [-4]: { h: "07:15", i: "forte", ore: 8, s: ["nausea", "luce"], f: "Ibuprofene", n: null },
  };
  for (let d = -29; d <= -1; d++) {
    const e = C[d];
    const day = addDays(oggi, d);
    if (e) out.push({ diario: "cefalea", profileId: null, at: `${day}T${e.h}`, note: e.n, dati: { tipo: "episodio", intensita: e.i, durataOre: e.ore, sintomi: e.s, farmaco: e.f } });
    else if (d % 9 !== 0) out.push({ diario: "cefalea", profileId: null, at: `${day}T21:00`, note: null, dati: { tipo: "nessuno", intensita: null, durataOre: null, sintomi: [], farmaco: null } });
  }
  return out;
}

import {
  MOMENTI_GLICEMIA,
  dataIt,
  kgTesto,
  oreMinuti,
  riepilogoCefalea,
  riepilogoGlicemia,
  riepilogoPeso,
  riepilogoPressione,
  riepilogoRespiro,
  riepilogoSonno,
  type VoceDiario,
} from "./voci";

/**
 * 27/11/2026 (fase 6, «un solo foglio per il medico»; idea del medico di famiglia simulato). Il foglio della visita
 * raccoglie anche i diari: una riga di medie per diario, con il periodo e quante misure. Solo numeri e conteggi, come
 * nei fogli dei singoli diari: nessun «alto» o «basso», nessuna soglia, nessun consiglio.
 */
export interface BloccoDiario {
  diario: VoceDiario["diario"];
  titolo: string;
  periodo: string;
  righe: string[];
}

const n0 = (n: number) => String(Math.round(n));
const per = (dal: string | null, al: string | null) => (dal && al ? (dal === al ? `il ${dataIt(dal)}` : `dal ${dataIt(dal)} al ${dataIt(al)}`) : "");

export function blocchiDiari(voci: VoceDiario[], oggi: string): BloccoDiario[] {
  const out: BloccoDiario[] = [];

  const p = riepilogoPressione(voci, 7, oggi);
  if (p.totale) {
    const r = [`Media ${n0(p.totale.sys)}/${n0(p.totale.dia)} mmHg su ${p.totale.n} misure${p.senzaPrimoGiorno ? " (senza il primo giorno)" : ""}`];
    if (p.mattina) r.push(`Mattina ${n0(p.mattina.sys)}/${n0(p.mattina.dia)} (${p.mattina.n})`);
    if (p.sera) r.push(`Sera ${n0(p.sera.sys)}/${n0(p.sera.dia)} (${p.sera.n})`);
    if (p.bpm !== null) r.push(`Battiti medi ${n0(p.bpm)}`);
    out.push({ diario: "pressione", titolo: "Pressione, ultimi 7 giorni", periodo: per(p.dal, p.al), righe: r });
  }

  const g = riepilogoGlicemia(voci, 14, oggi);
  if (g.misure) {
    out.push({
      diario: "glicemia",
      titolo: "Glicemia, ultimi 14 giorni",
      periodo: per(g.dal, g.al),
      righe: g.perMomento.map((m) => `${MOMENTI_GLICEMIA[m.momento]}: media ${n0(m.media)} mg/dL, da ${m.min} a ${m.max} (${m.n} ${m.n === 1 ? "misura" : "misure"})`),
    });
  }

  const c = riepilogoCefalea(voci, 30, oggi);
  if (c.giorniSegnati) {
    const r = [`Giorni con mal di testa: ${c.giorniConDolore} su ${c.giorniSegnati} segnati`, `Episodi: ${c.episodi} (lievi ${c.perIntensita.lieve}, medi ${c.perIntensita.media}, forti ${c.perIntensita.forte})`];
    if (c.giorniConFarmaco) r.push(`Giorni con un farmaco: ${c.giorniConFarmaco}`);
    out.push({ diario: "cefalea", titolo: "Mal di testa, ultimi 30 giorni", periodo: per(c.dal, c.al), righe: r });
  }

  const s = riepilogoSonno(voci, 14, oggi);
  if (s.notti) {
    const r: string[] = [];
    if (s.oraLetto && s.oraInPiedi) r.push(`A letto in media alle ${s.oraLetto}, in piedi alle ${s.oraInPiedi}`);
    if (s.sonnoMin !== null) r.push(`Sonno stimato ${oreMinuti(s.sonnoMin)} a notte`);
    if (s.addormentarsiMin !== null) r.push(`Per addormentarsi ${n0(s.addormentarsiMin)} min in media`);
    if (s.risvegli !== null) r.push(`Risvegli ${String(s.risvegli).replace(".", ",")} a notte in media`);
    r.push(`Notti: dormito male ${s.perQualita.male}, così così ${s.perQualita.cosi}, bene ${s.perQualita.bene}`);
    out.push({ diario: "sonno", titolo: `Sonno, ${s.notti} ${s.notti === 1 ? "notte" : "notti"} segnate`, periodo: per(s.dal, s.al), righe: r });
  }

  const w = riepilogoPeso(voci, 30, oggi);
  if (w.ultimo !== null) {
    const r = [`Ultimo ${kgTesto(w.ultimo)} su ${w.misure} ${w.misure === 1 ? "misura" : "misure"}`];
    if (w.differenza !== null && w.misure > 1) r.push(`Dalla prima misura del periodo: ${kgTesto(w.differenza, true)}`);
    out.push({ diario: "peso", titolo: "Peso, ultimi 30 giorni", periodo: per(w.dal, w.al), righe: r });
  }

  const b = riepilogoRespiro(voci, 14, oggi);
  if (b.misure) {
    const r: string[] = [];
    if (b.mattina) r.push(`Picco di flusso al mattino: media ${n0(b.mattina.media)} L/min (${b.mattina.n})`);
    if (b.sera) r.push(`Alla sera: media ${n0(b.sera.media)} L/min (${b.sera.n})`);
    if (b.min !== null && b.max !== null) r.push(`Da ${b.min} a ${b.max} L/min`);
    if (b.giorniConSpray) r.push(`Spray al bisogno: ${b.sprayTotale} volte in ${b.giorniConSpray} giorni`);
    out.push({ diario: "respiro", titolo: "Respiro, ultimi 14 giorni", periodo: per(b.dal, b.al), righe: r });
  }

  return out;
}

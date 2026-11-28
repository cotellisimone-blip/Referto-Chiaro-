/**
 * 18/11/2026 (terzo giro, punto 11): «Trigliceridi: che cos'è» non è italiano. I nomi al plurale vogliono «che cosa sono».
 * L'elenco è scritto a mano (un nome che finisce in «i» non è per forza plurale: «Emolisi», «Diuresi») e una prova
 * controlla che ogni voce dell'elenco esista davvero nel glossario o tra gli integratori.
 */
export const NOMI_PLURALI = new Set([
  "Anticorpi",
  "Anticorpi anti-TPO",
  "Anticorpi anti-tireoglobulina",
  "Autoanticorpi",
  "Basofili",
  "Cellule per microlitro",
  "Chetoni",
  "Elettroliti",
  "Eosinofili",
  "Eritrociti",
  "Folati",
  "Gamma globuline",
  "Globuli bianchi",
  "Globuli rossi",
  "Globuline",
  "HDL (lipoproteine ad alta densità)",
  "Immunoglobuline",
  "LDL (lipoproteine a bassa densità)",
  "Leucociti",
  "Linfociti",
  "Lipidi",
  "Lipoproteine",
  "Milligrammi per decilitro (mg/dL)",
  "Millimoli per litro (mmol/L)",
  "Monociti",
  "Neutrofili",
  "Nitriti urinari",
  "Piastrine",
  "Proteine totali",
  "Reticolociti",
  "Transaminasi",
  "Trigliceridi",
  "Unità internazionali (UI)",
  "VLDL (lipoproteine a bassissima densità)",
  // Integratori
  "Omega-3",
  "Probiotici",
  "Multivitaminici",
]);

/** «che cos'è» oppure «che cosa sono», secondo il nome. */
export function cheCose(nome: string): string {
  return NOMI_PLURALI.has(nome) ? "che cosa sono" : "che cos'è";
}

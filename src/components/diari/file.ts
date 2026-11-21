"use client";

import type { DiarioFonts } from "@/domain/diari/pdf";

/** I caratteri del report, per i PDF dei diari; se non arrivano si usa l'Helvetica di pdf-lib. */
export async function caricaFont(): Promise<DiarioFonts | null> {
  try {
    const [r, b] = await Promise.all(
      ["/fonts/pdf/manrope-400.ttf", "/fonts/pdf/manrope-700.ttf"].map((u) => fetch(u).then((x) => (x.ok ? x.arrayBuffer() : Promise.reject(new Error(u))))),
    );
    return { regular: new Uint8Array(r), bold: new Uint8Array(b) };
  } catch {
    return null;
  }
}

/**
 * Salva un file preparato nella pagina. Nell'anteprima pubblicata i salvataggi passano dalla conferma di chi guarda
 * (`window.rcSaveFile`); nel sito, un collegamento temporaneo.
 */
export async function salvaFile(nome: string, blob: Blob): Promise<void> {
  const w = window as unknown as { rcSaveFile?: (n: string, b: Blob) => Promise<void> };
  if (w.rcSaveFile) {
    await w.rcSaveFile(nome, blob);
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

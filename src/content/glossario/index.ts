import type { GlossaryEntry } from "./schema";
import { GLOSSARIO_A_C } from "./voci-a-c";
import { GLOSSARIO_D_G } from "./voci-d-g";
import { GLOSSARIO_H_M } from "./voci-h-m";
import { GLOSSARIO_N_R } from "./voci-n-r";
import { GLOSSARIO_S_Z } from "./voci-s-z";

const collator = new Intl.Collator("it");

/** Tutte le voci, in ordine alfabetico. */
export const GLOSSARY: GlossaryEntry[] = [...GLOSSARIO_A_C, ...GLOSSARIO_D_G, ...GLOSSARIO_H_M, ...GLOSSARIO_N_R, ...GLOSSARIO_S_Z].sort((a, b) => collator.compare(a.term, b.term));

export function getGlossaryEntry(slug: string): GlossaryEntry | null {
  return GLOSSARY.find((e) => e.slug === slug) ?? null;
}

/** Raggruppa per lettera iniziale (senza accenti). */
export function glossaryByLetter(): { letter: string; entries: GlossaryEntry[] }[] {
  const map = new Map<string, GlossaryEntry[]>();
  for (const e of GLOSSARY) {
    const l = e.term
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")[0]
      .toUpperCase();
    map.set(l, [...(map.get(l) ?? []), e]);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([letter, entries]) => ({ letter, entries }));
}

export type { GlossaryEntry };

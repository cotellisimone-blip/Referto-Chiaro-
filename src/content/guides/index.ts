import { GUIDE_CATEGORIES, type Guide, type GuideCategory } from "./schema";
import { GUIDE_COME_LEGGERE } from "./categorie/come-leggere";
import { GUIDE_EMOCROMO } from "./categorie/emocromo";
import { GUIDE_METABOLISMO } from "./categorie/metabolismo";
import { GUIDE_LIPIDI } from "./categorie/lipidi";
import { GUIDE_FEGATO } from "./categorie/fegato";
import { GUIDE_RENI } from "./categorie/reni";
import { GUIDE_TIROIDE } from "./categorie/tiroide";
import { GUIDE_FERRO } from "./categorie/ferro";
import { GUIDE_INFIAMMAZIONE } from "./categorie/infiammazione";
import { GUIDE_ORMONI } from "./categorie/ormoni";

/** Tutte le guide, in ordine di categoria. Ogni file di categoria è indipendente. */
export const GUIDES: Guide[] = [
  ...GUIDE_COME_LEGGERE,
  ...GUIDE_EMOCROMO,
  ...GUIDE_METABOLISMO,
  ...GUIDE_LIPIDI,
  ...GUIDE_FEGATO,
  ...GUIDE_RENI,
  ...GUIDE_TIROIDE,
  ...GUIDE_FERRO,
  ...GUIDE_INFIAMMAZIONE,
  ...GUIDE_ORMONI,
];

export function getGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}

export function guidesByCategory(category: GuideCategory): Guide[] {
  return GUIDES.filter((g) => g.category === category);
}

export { GUIDE_CATEGORIES };
export type { Guide, GuideCategory };

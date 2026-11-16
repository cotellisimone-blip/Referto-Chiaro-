import {
  Bean,
  BookOpenText,
  Camera,
  Candy,
  Droplet,
  Droplets,
  Flame,
  FlaskConical,
  Gauge,
  HeartPulse,
  Pill,
  ScanLine,
  TestTubes,
  type LucideIcon,
} from "lucide-react";

/** Disegno e colori di ogni argomento delle guide: lo stesso cerchio nella sezione Prevenzione, nell'elenco e in testa alla guida. */
export const CATEGORY_ART: Record<string, { icon: LucideIcon; c: string; d: string }> = {
  "come-leggere": { icon: BookOpenText, c: "#DDF2EC", d: "#0B5A55" },
  emocromo: { icon: Droplets, c: "#FBD9D3", d: "#9B2C22" },
  metabolismo: { icon: Candy, c: "#FCE8C4", d: "#8A5200" },
  lipidi: { icon: Droplet, c: "#FDE2C8", d: "#A4471F" },
  fegato: { icon: FlaskConical, c: "#E9E2F7", d: "#5B3E99" },
  reni: { icon: Bean, c: "#F7DCCF", d: "#8C3B1E" },
  tiroide: { icon: Gauge, c: "#D7ECF7", d: "#1F5F86" },
  ferro: { icon: Pill, c: "#F3E0D6", d: "#7A3A1C" },
  infiammazione: { icon: Flame, c: "#FFE0CC", d: "#B23E0E" },
  ormoni: { icon: TestTubes, c: "#E4ECD5", d: "#4B6320" },
  immagini: { icon: ScanLine, c: "#DCE6F2", d: "#2B4E7A" },
  "cuore-e-funzionali": { icon: HeartPulse, c: "#FAD6DA", d: "#A31D34" },
  endoscopie: { icon: Camera, c: "#E1EEE9", d: "#2F5D50" },
};

export function CategoryBadge({ id, size = 52, className }: { id: string; size?: number; className?: string }) {
  const a = CATEGORY_ART[id] ?? CATEGORY_ART["come-leggere"];
  const I = a.icon;
  return (
    <span aria-hidden className={`wow-cat${className ? ` ${className}` : ""}`} style={{ "--s": `${size}px`, "--c": a.c, "--d": a.d } as React.CSSProperties}>
      <I />
    </span>
  );
}

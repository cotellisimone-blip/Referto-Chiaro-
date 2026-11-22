import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MalattiaRoute, malattiaMetadata } from "@/components/malattie/route";
import { MALATTIE, getMalattia } from "@/content/malattie";

/** 22/11/2026: il sonno non sta più qui ma in /prenditi-cura-di-te/sonno (next.config.ts rimanda il vecchio indirizzo). */
export function generateStaticParams() {
  return MALATTIE.filter((m) => m.slug !== "sonno").map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/malattie/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = getMalattia(slug);
  // notFound() anche qui: i metadati si risolvono prima dello streaming, così l'indirizzo sbagliato risponde 404 e non 200.
  if (!m || m.slug === "sonno") notFound();
  return malattiaMetadata(m);
}

/**
 * Una pagina di malattia (22/11/2026). Dati strutturati: MedicalWebPage con l'argomento (MedicalCondition). Il revisore
 * e la data di revisione compaiono SOLO quando un medico ha rivisto la pagina: non si dichiara a Google ciò che non c'è.
 */
export default async function MalattiaPage({ params }: PageProps<"/malattie/[slug]">) {
  const { slug } = await params;
  const m = getMalattia(slug);
  if (!m || m.slug === "sonno") notFound();
  return <MalattiaRoute m={m} />;
}

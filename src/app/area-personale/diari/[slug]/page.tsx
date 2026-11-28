import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiarioArea } from "@/components/diari/area";
import { getDiario } from "@/domain/diari/catalogo";

export const metadata: Metadata = { title: "Diario" };

export default async function DiarioAreaPage({ params }: PageProps<"/area-personale/diari/[slug]">) {
  const { slug } = await params;
  const d = getDiario(slug);
  if (!d) notFound();
  return <DiarioArea slug={d.slug} />;
}

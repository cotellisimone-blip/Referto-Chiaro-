import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DiarioPubblico } from "@/components/diari/pubblico";
import { PageLd } from "@/components/site/page-ld";
import { DIARI, getDiario } from "@/domain/diari/catalogo";

export function generateStaticParams() {
  return DIARI.map((d) => ({ slug: d.slug }));
}

const titolo = (nome: string) => `Diario ${nome.toLowerCase()}: guida e foglio da stampare`;

export async function generateMetadata({ params }: PageProps<"/diari/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const d = getDiario(slug);
  if (!d) return {};
  return {
    title: titolo(d.nome),
    description: `${d.perChi} Cinque passi per misurare bene, il diario da stampare e quello da compilare dal telefono.`.slice(0, 158),
    alternates: { canonical: `/diari/${d.slug}` },
  };
}

/** Un diario (21/11/2026): guida illustrata in cinque passi, posto del video, PDF da stampare, compilazione online. */
export default async function DiarioPage({ params }: PageProps<"/diari/[slug]">) {
  const { slug } = await params;
  const d = getDiario(slug);
  if (!d) notFound();
  return (
    <>
      <PageLd path={`/diari/${d.slug}`} meta={{ title: titolo(d.nome), description: d.perChi }} name={`Diario: ${d.nome}`} />
      <DiarioPubblico slug={d.slug} />
    </>
  );
}

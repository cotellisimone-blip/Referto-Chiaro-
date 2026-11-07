import type { Metadata } from "next";
import { DossierView } from "@/components/area/dossier-view";

export const metadata: Metadata = { title: "Dossier" };

export default async function DossierDettaglioPage({ params }: PageProps<"/area/dossier/[id]">) {
  const { id } = await params;
  return <DossierView dossierId={id} />;
}

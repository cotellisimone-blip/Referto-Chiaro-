import type { Metadata } from "next";
import { DossierNew } from "@/components/area/dossier-new";

export const metadata: Metadata = { title: "Nuovo dossier" };

export default function NuovoDossierPage() {
  return <DossierNew />;
}

import type { Metadata } from "next";
import { DossierList } from "@/components/area/dossier-list";

export const metadata: Metadata = { title: "Dossier" };

export default function DossierPage() {
  return <DossierList />;
}

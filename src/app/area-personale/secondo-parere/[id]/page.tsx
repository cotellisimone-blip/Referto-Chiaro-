import type { Metadata } from "next";
import { CaseDetail } from "@/components/area/cases";

export const metadata: Metadata = { title: "Richiesta di secondo parere" };

export default async function CasoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CaseDetail caseId={id} />;
}

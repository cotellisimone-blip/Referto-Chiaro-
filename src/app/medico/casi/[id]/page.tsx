import type { Metadata } from "next";
import { PhysicianCase } from "@/components/medico/portal";

export const metadata: Metadata = { title: "Caso" };

export default async function CasoMedicoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PhysicianCase caseId={id} />;
}

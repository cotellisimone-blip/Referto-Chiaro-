import type { Metadata } from "next";
import { ProvaShell } from "@/components/prestazioni/hub";
import { PatientRequest } from "@/components/prestazioni/patient";

export const metadata: Metadata = { title: "La tua richiesta" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ProvaShell role="paziente">
      <PatientRequest id={id} />
    </ProvaShell>
  );
}

import type { Metadata } from "next";
import { ProvaShell } from "@/components/prestazioni/hub";
import { DoctorRequestPage } from "@/components/prestazioni/doctor";

export const metadata: Metadata = { title: "Richiesta" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ProvaShell role="medico">
      <DoctorRequestPage id={id} />
    </ProvaShell>
  );
}

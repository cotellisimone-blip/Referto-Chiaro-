import type { Metadata } from "next";
import { ProvaShell } from "@/components/prestazioni/hub";
import { DoctorPortal } from "@/components/prestazioni/doctor";

export const metadata: Metadata = { title: "Medico" };

export default function Page() {
  return (
    <ProvaShell role="medico">
      <DoctorPortal />
    </ProvaShell>
  );
}

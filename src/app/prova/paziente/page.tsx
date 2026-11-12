import type { Metadata } from "next";
import { ProvaShell } from "@/components/prestazioni/hub";
import { PatientHome } from "@/components/prestazioni/patient";

export const metadata: Metadata = { title: "Paziente" };

export default function Page() {
  return (
    <ProvaShell role="paziente">
      <PatientHome />
    </ProvaShell>
  );
}

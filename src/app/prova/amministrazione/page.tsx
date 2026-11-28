import type { Metadata } from "next";
import { ProvaShell } from "@/components/prestazioni/hub";
import { AdminPrestazioni } from "@/components/prestazioni/admin";

export const metadata: Metadata = { title: "Amministrazione" };

export default function Page() {
  return (
    <ProvaShell role="amministrazione">
      <AdminPrestazioni />
    </ProvaShell>
  );
}

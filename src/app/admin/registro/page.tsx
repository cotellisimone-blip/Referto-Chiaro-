import type { Metadata } from "next";
import { AdminAudit } from "@/components/admin/panel";

export const metadata: Metadata = { title: "Registro" };

export default function Page() {
  return <AdminAudit />;
}

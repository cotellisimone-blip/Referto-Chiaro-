import type { Metadata } from "next";
import { AdminConfig } from "@/components/admin/panel";

export const metadata: Metadata = { title: "Configurazione" };

export default function Page() {
  return <AdminConfig />;
}

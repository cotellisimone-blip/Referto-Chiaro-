import type { Metadata } from "next";
import { AdminPhysicians } from "@/components/admin/panel";

export const metadata: Metadata = { title: "Medici" };

export default function Page() {
  return <AdminPhysicians />;
}

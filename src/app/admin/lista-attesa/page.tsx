import type { Metadata } from "next";
import { AdminWaitlist } from "@/components/admin/panel";

export const metadata: Metadata = { title: "Lista d'attesa" };

export default function Page() {
  return <AdminWaitlist />;
}

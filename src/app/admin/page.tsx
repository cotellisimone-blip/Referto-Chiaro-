import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/panel";

export const metadata: Metadata = { title: "Amministrazione" };

export default function Page() {
  return <AdminOverview />;
}

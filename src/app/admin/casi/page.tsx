import type { Metadata } from "next";
import { AdminCases } from "@/components/admin/panel";

export const metadata: Metadata = { title: "Casi" };

export default function Page() {
  return <AdminCases />;
}

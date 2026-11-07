import type { Metadata } from "next";
import { AdminOrders } from "@/components/admin/panel";

export const metadata: Metadata = { title: "Ordini" };

export default function Page() {
  return <AdminOrders />;
}

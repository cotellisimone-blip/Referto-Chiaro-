import type { Metadata } from "next";
import { OrdersList } from "@/components/area/orders-list";

export const metadata: Metadata = { title: "Pagamenti" };

export default function OrdiniPage() {
  return <OrdersList />;
}

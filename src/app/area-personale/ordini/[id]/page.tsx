import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderCheckout } from "@/components/area/order-checkout";

export const metadata: Metadata = { title: "Ordine" };

export default async function OrdinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-mist" aria-busy="true" />}>
      <OrderCheckout orderId={id} />
    </Suspense>
  );
}

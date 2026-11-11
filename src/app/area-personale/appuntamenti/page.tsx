import type { Metadata } from "next";
import { AppointmentsPage } from "@/components/area/appointments";
import { priceLabel, publicPricesEnabled } from "@/domain/offerta";

export const metadata: Metadata = { title: "I miei appuntamenti" };

export default function AppuntamentiPage() {
  return <AppointmentsPage price={publicPricesEnabled() ? priceLabel("parla-con-un-medico") : null} />;
}

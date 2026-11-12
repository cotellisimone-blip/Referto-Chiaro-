import type { Metadata } from "next";
import { AppointmentDetail } from "@/components/area/appointments";

export const metadata: Metadata = { title: "Videoconsulto" };

export default async function AppuntamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AppointmentDetail id={id} />;
}

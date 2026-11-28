import type { Metadata } from "next";
import { PhysicianAppointment } from "@/components/medico/appointments";

export const metadata: Metadata = { title: "Videoconsulto" };

export default async function MedicoAppuntamentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PhysicianAppointment id={id} />;
}

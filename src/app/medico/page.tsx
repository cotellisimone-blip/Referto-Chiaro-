import type { Metadata } from "next";
import { PhysicianDashboard } from "@/components/medico/portal";

export const metadata: Metadata = { title: "Portale medico" };

export default function MedicoPage() {
  return <PhysicianDashboard />;
}

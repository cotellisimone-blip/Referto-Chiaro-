import type { Metadata } from "next";
import { Famiglia } from "@/components/famiglia/famiglia";

export const metadata: Metadata = { title: "La tua famiglia" };

export default function FamigliaPage() {
  return <Famiglia />;
}

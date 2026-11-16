import type { Metadata } from "next";
import { PromemoriaPage } from "@/components/famiglia/promemoria";

export const metadata: Metadata = { title: "Promemoria" };

export default function Promemoria() {
  return <PromemoriaPage />;
}

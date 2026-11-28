import type { Metadata } from "next";
import { ProvaHub } from "@/components/prestazioni/hub";

export const metadata: Metadata = { title: "Prova le prestazioni", description: "Prova dimostrativa con dati fittizi: paziente, medico e amministrazione seguono la stessa richiesta." };

export default function ProvaPage() {
  return <ProvaHub />;
}

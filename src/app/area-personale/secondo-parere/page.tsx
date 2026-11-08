import type { Metadata } from "next";
import { CasesPage } from "@/components/area/cases";

export const metadata: Metadata = { title: "Secondo parere" };

export default function SecondoParereAreaPage() {
  return <CasesPage />;
}

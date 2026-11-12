import type { Metadata } from "next";
import { DocumentsDashboard } from "@/components/area/documents-dashboard";

export const metadata: Metadata = { title: "Area personale" };

export default function AreaPage() {
  return <DocumentsDashboard />;
}

import type { Metadata } from "next";
import { DocumentWorkflow } from "@/components/area/document-workflow";

export const metadata: Metadata = { title: "Referto" };

export default async function DocumentoPage({ params }: PageProps<"/area/documenti/[id]">) {
  const { id } = await params;
  return <DocumentWorkflow documentId={id} />;
}

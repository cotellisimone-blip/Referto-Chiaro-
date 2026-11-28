import type { Metadata } from "next";
import { DocumentWorkflow } from "@/components/area/document-workflow";

export const metadata: Metadata = { title: "Referto" };

export default async function DocumentoPage({ params, searchParams }: PageProps<"/area-personale/documenti/[id]">) {
  const { id } = await params;
  const q = await searchParams;
  // Arrivo diretto dal pagamento (ciclo 5): `?pagato=1`, con `&prova=1` se il pagamento era simulato.
  const paidNote = q.pagato === "1" ? (q.prova === "1" ? "prova" : "reale") : "none";
  return <DocumentWorkflow documentId={id} paidNote={paidNote} />;
}

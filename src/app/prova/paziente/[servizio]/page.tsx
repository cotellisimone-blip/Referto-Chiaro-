import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProvaShell } from "@/components/prestazioni/hub";
import { PatientStart } from "@/components/prestazioni/patient";
import type { PrestazioneKind } from "@/domain/prestazioni/listino";

const SLUG: Record<string, PrestazioneKind> = { domicilio: "domicilio", videoconsulto: "video", "secondo-parere": "parere" };

export const metadata: Metadata = { title: "Nuova richiesta" };

export function generateStaticParams() {
  return Object.keys(SLUG).map((servizio) => ({ servizio }));
}

export default async function Page({ params }: { params: Promise<{ servizio: string }> }) {
  const { servizio } = await params;
  const kind = SLUG[servizio];
  if (!kind) notFound();
  return (
    <ProvaShell role="paziente">
      <PatientStart kind={kind} />
    </ProvaShell>
  );
}

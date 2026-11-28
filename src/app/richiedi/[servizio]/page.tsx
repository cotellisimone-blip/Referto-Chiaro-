import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isVetrina } from "@/domain/offerta";
import { PatientShell } from "@/components/prestazioni/hub";
import { PatientStart } from "@/components/prestazioni/patient";
import { PRESTAZIONI, type PrestazioneKind } from "@/domain/prestazioni/listino";

const SLUG: Record<string, PrestazioneKind> = { domicilio: "domicilio", videoconsulto: "video", "secondo-parere": "parere" };

export function generateStaticParams() {
  return Object.keys(SLUG).map((servizio) => ({ servizio }));
}

export async function generateMetadata({ params }: { params: Promise<{ servizio: string }> }): Promise<Metadata> {
  const kind = SLUG[(await params).servizio];
  return { title: kind ? `Richiedi: ${PRESTAZIONI[kind].short.toLowerCase()}` : "Nuova richiesta" };
}

export default async function Page({ params }: { params: Promise<{ servizio: string }> }) {
  const kind = SLUG[(await params).servizio];
  if (!kind) notFound();
  return (
    <PatientShell vetrina={isVetrina()}>
      <PatientStart kind={kind} />
    </PatientShell>
  );
}

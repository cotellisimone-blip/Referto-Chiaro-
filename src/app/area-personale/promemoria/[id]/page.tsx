import type { Metadata } from "next";
import { FoglioVisita } from "@/components/famiglia/foglio-visita";

export const metadata: Metadata = { title: "Foglio per la visita" };

export default async function FoglioVisitaPage({ params }: PageProps<"/area-personale/promemoria/[id]">) {
  const { id } = await params;
  return <FoglioVisita id={id} />;
}

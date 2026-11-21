import type { Metadata } from "next";
import { DiariIndice } from "@/components/diari/pubblico";
import { PageLd } from "@/components/site/page-ld";

export const metadata: Metadata = {
  title: "Diari della salute: pressione, glicemia, mal di testa",
  description: "Come misurare bene a casa in cinque passi, il diario da stampare gratis e quello da compilare dal telefono, con le medie e il foglio per il medico.",
  alternates: { canonical: "/diari" },
};

/** Diari della salute (21/11/2026): la pagina d'ingresso, gratis. */
export default function DiariPage() {
  return (
    <>
      <PageLd path="/diari" meta={metadata} name="Diari della salute" />
      <DiariIndice />
    </>
  );
}

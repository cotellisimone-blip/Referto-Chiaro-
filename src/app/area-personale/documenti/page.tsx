import { redirect } from "next/navigation";

/** Terzo giro, punto 3: l'elenco dei referti è la pagina dell'area; questo indirizzo (un livello sopra un referto) dava «pagina non trovata». */
export default function DocumentiIndex() {
  redirect("/area-personale");
}

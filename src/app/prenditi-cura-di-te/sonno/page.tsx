import type { Metadata } from "next";
import { MalattiaRoute, malattiaMetadata } from "@/components/malattie/route";
import { getMalattia } from "@/content/malattie";

const SONNO = getMalattia("sonno")!;

export const metadata: Metadata = malattiaMetadata(SONNO);

/**
 * L'area Sonno di «Prenditi cura di te» (passo 5). 22/11/2026: prima stava in /malattie/sonno (il vecchio indirizzo
 * rimanda qui). È la stessa pagina «Insonnia» con le porte per problema, il percorso di due settimane e le pagine
 * tecniche in /prenditi-cura-di-te/sonno/{argomento}.
 */
export default function SonnoPage() {
  return <MalattiaRoute m={SONNO} />;
}

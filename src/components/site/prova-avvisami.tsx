"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { BellRing } from "lucide-react";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { mediciEnabled } from "@/lib/medici";

type Servizio = "capisci" | "domicilio" | "parla-con-un-medico" | "secondo-parere";

const SERVIZI_TUTTI: { id: Servizio; label: string; interest: "completo" | "visite" | "secondo-parere" | "domicilio" }[] = [
  { id: "capisci", label: "Capisci il referto", interest: "completo" },
  { id: "domicilio", label: "Visita a domicilio", interest: "domicilio" },
  { id: "parla-con-un-medico", label: "Videoconsulto", interest: "visite" },
  { id: "secondo-parere", label: "Secondo parere", interest: "secondo-parere" },
];
/** 14/11/2026: con i medici spenti (src/lib/medici.ts) resta solo «Capisci»; per i medici c'è la lista di /con-un-medico. */
const SERVIZI = mediciEnabled() ? SERVIZI_TUTTI : SERVIZI_TUTTI.filter((s) => s.id === "capisci");

/** Il servizio provato si ricava dalla pagina: appuntamenti → medico, pareri → secondo parere, il resto → Capisci. */
export function servizioDaPercorso(path: string): Servizio {
  if (path.startsWith("/area-personale/appuntamenti") || path.startsWith("/richiedi/videoconsulto")) return "parla-con-un-medico";
  if (path.startsWith("/richiedi/secondo-parere")) return "secondo-parere";
  if (path.startsWith("/richiedi/domicilio") || path.startsWith("/richieste")) return "domicilio";
  if (path.startsWith("/area-personale/secondo-parere")) return "secondo-parere";
  return "capisci";
}

/**
 * Ciclo 3, fase 1: in vetrina ogni prova (referto di esempio, account demo) finisce con la possibilità di chiedere
 * «Avvisami quando parte» senza cambiare pagina. Il servizio è preselezionato da dove ti trovi e si può cambiare.
 */
export function ProvaAvvisami({ servizio, titolo }: { servizio?: Servizio; titolo?: string }) {
  const path = usePathname() ?? "";
  const [scelto, setScelto] = useState<Servizio>(servizio ?? servizioDaPercorso(path));
  const corrente = SERVIZI.find((s) => s.id === scelto) ?? SERVIZI[0];
  return (
    <section aria-labelledby="prova-avvisami-titolo" className="form-card mt-8" data-testid="prova-avvisami">
      <p className="eyebrow eyebrow-plain flex items-center gap-2">
        <BellRing aria-hidden className="h-4 w-4" /> Ti è piaciuta la prova?
      </p>
      <h2 id="prova-avvisami-titolo" className="form-card-title mt-3">
        {titolo ?? "Avvisami quando parte."}
      </h2>
      {/* Con un solo servizio non c'è niente da scegliere: la domanda non compare. */}
      {SERVIZI.length > 1 ? (
        <fieldset className="mt-5">
          <legend className="field-label">Per quale servizio?</legend>
          <div className="choice-pills mt-3">
            {SERVIZI.map((s) => (
              <label key={s.id} className="choice-pill">
                <input type="radio" name="prova-servizio" value={s.id} checked={corrente.id === s.id} onChange={() => setScelto(s.id)} />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div className="mt-6">
        <WaitlistForm key={corrente.interest} interest={corrente.interest} afterTrial compact />
      </div>
    </section>
  );
}

/** Nell'area personale il profilo (vetrina o no) arriva dal server una volta sola, nel layout. */
const VetrinaCtx = createContext(false);
export function VetrinaProvider({ vetrina, children }: { vetrina: boolean; children: React.ReactNode }) {
  return <VetrinaCtx.Provider value={vetrina}>{children}</VetrinaCtx.Provider>;
}

/** In fondo a ogni pagina dell'area demo, solo in vetrina. Le pagine d'ordine lo mostrano da sé, dopo l'esito. */
export function AreaProvaAvvisami() {
  const vetrina = useContext(VetrinaCtx);
  const path = usePathname() ?? "";
  if (!vetrina || path.startsWith("/area-personale/ordini/")) return null;
  return <ProvaAvvisami />;
}

/** Dopo il pagamento simulato di un ordine, solo in vetrina, con il servizio dell'ordine. */
export function OrdineProvaAvvisami({ orderService }: { orderService: string }) {
  const vetrina = useContext(VetrinaCtx);
  if (!vetrina) return null;
  const servizio: Servizio = orderService === "videoconsulto" ? "parla-con-un-medico" : orderService === "secondo-parere" ? "secondo-parere" : "capisci";
  return <ProvaAvvisami servizio={servizio} />;
}

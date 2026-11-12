"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { BellRing } from "lucide-react";
import { WaitlistForm } from "@/components/site/waitlist-form";

type Servizio = "capisci" | "parla-con-un-medico" | "secondo-parere";

const SERVIZI: { id: Servizio; label: string; interest: "completo" | "visite" | "secondo-parere" }[] = [
  { id: "capisci", label: "Capisci il referto", interest: "completo" },
  { id: "parla-con-un-medico", label: "Parla con un medico", interest: "visite" },
  { id: "secondo-parere", label: "Secondo parere", interest: "secondo-parere" },
];

/** Il servizio provato si ricava dalla pagina: appuntamenti → medico, pareri → secondo parere, il resto → Capisci. */
export function servizioDaPercorso(path: string): Servizio {
  if (path.startsWith("/area-personale/appuntamenti")) return "parla-con-un-medico";
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
  const corrente = SERVIZI.find((s) => s.id === scelto)!;
  return (
    <section aria-labelledby="prova-avvisami-titolo" className="card mt-8 p-6 sm:p-8" data-testid="prova-avvisami">
      <p className="eyebrow flex items-center gap-2">
        <BellRing aria-hidden className="h-4 w-4" /> Ti è piaciuta la prova?
      </p>
      <h2 id="prova-avvisami-titolo" className="mt-2 font-serif text-2xl text-ink sm:text-3xl">
        {titolo ?? "Avvisami quando parte."}
      </h2>
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold text-ink">Per quale servizio?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SERVIZI.map((s) => (
            <label
              key={s.id}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-semibold transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-teal ${
                scelto === s.id ? "border-teal bg-teal text-white" : "border-line bg-paper text-ink hover:border-teal"
              }`}
            >
              <input type="radio" name="prova-servizio" value={s.id} checked={scelto === s.id} onChange={() => setScelto(s.id)} className="sr-only" />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-5">
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

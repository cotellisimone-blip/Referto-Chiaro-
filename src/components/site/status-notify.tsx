"use client";

import { useState } from "react";
import { WaitlistForm } from "./waitlist-form";

type Interest = "completo" | "domicilio" | "visite" | "secondo-parere";

/** «Avvisami quando parte» per la pagina Stato del progetto: un modulo solo, si sceglie prima il servizio. */
export function StatusNotify({ options }: { options: { interest: Interest; label: string }[] }) {
  const [interest, setInterest] = useState<Interest>(options[0].interest);
  return (
    <div>
      <fieldset>
        <legend className="field-label">Quale servizio ti interessa?</legend>
        <div className="choice-pills mt-3">
          {options.map((o) => (
            <label key={o.interest} className="choice-pill">
              <input type="radio" name="servizio-interesse" checked={interest === o.interest} onChange={() => setInterest(o.interest)} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-5">
        <WaitlistForm key={interest} interest={interest} />
      </div>
    </div>
  );
}

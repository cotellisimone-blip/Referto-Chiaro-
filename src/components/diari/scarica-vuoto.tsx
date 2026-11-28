"use client";

import { useState } from "react";
import { getDiario, type DiarioSlug } from "@/domain/diari/catalogo";
import { caricaFont, salvaFile } from "./file";

/** «Scarica il diario da stampare»: il PDF nasce nel browser, senza dati personali. */
export function ScaricaVuoto({ slug, className }: { slug: DiarioSlug; className?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  async function go() {
    setBusy(true);
    setErr(false);
    try {
      const d = getDiario(slug)!;
      const { renderDiarioVuoto, nomeFileVuoto } = await import("@/domain/diari/pdf");
      const bytes = await renderDiarioVuoto(d, { fonts: await caricaFont() });
      await salvaFile(nomeFileVuoto(d), new Blob([bytes as BlobPart], { type: "application/pdf" }));
    } catch {
      setErr(true);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <button type="button" className={className} onClick={go} disabled={busy} data-testid="scarica-diario">
        {busy ? "Preparo il PDF…" : "Scarica il diario da stampare (PDF)"}
      </button>
      {err ? (
        <p role="alert" className="dr-err">
          Il PDF non si è preparato. Riprova tra un momento.
        </p>
      ) : null}
    </>
  );
}

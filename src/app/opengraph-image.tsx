import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Cura Privata — la tua salute, più chiara e accessibile";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Immagine social generata dal simbolo e dal carattere del sito (nessuna foto di stock, nessun claim). */
export default async function OpenGraphImage() {
  const dir = path.join(process.cwd(), "src/domain/reporting/fonts");
  const [regular, bold] = await Promise.all([readFile(path.join(dir, "manrope-400.ttf")), readFile(path.join(dir, "manrope-700.ttf"))]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg,#F5FAF8 0%,#E8F4F1 60%,#CFF3EC 100%)",
          color: "#0C3340",
          fontFamily: "Manrope",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="68" height="68" viewBox="4 4 56 56">
            <path d="M49.09 16.61A23 23 0 1 0 49.09 47.39" fill="none" stroke="#0C3340" strokeWidth="8" strokeLinecap="round" />
            <path d="M31 20C39.5 20 44 26 44 32C44 38 39.5 44 31 44" fill="none" stroke="#008F87" strokeWidth="7" strokeLinecap="round" />
            <circle cx="31" cy="32" r="3.6" fill="#7BE0D2" />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>
            <span>Cura&nbsp;</span>
            <span style={{ color: "#00756F" }}>Privata</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.04, letterSpacing: -3, display: "flex", flexWrap: "wrap" }}>
            <span>La tua salute,&nbsp;</span>
            <span style={{ color: "#00756F" }}>più chiara</span>
            <span>&nbsp;e accessibile.</span>
          </div>
          <div style={{ fontSize: 30, color: "#4F676E" }}>Comprendi il linguaggio dei tuoi referti e prepara le domande per il tuo medico.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#4F676E" }}>
          <span>Spiegazioni informative · Non sostituiscono il medico</span>
          <span>Versione dimostrativa</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Manrope", data: regular, weight: 400, style: "normal" },
        { name: "Manrope", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}

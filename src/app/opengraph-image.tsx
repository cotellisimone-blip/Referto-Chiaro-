import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Referto Chiaro — i tuoi referti, finalmente comprensibili";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Immagine social generata dal logo e dai font del sito (nessuna immagine di stock). */
export default async function OpenGraphImage() {
  const dir = path.join(process.cwd(), "src/domain/reporting/fonts");
  const [serif, sans] = await Promise.all([readFile(path.join(dir, "fraunces-400.ttf")), readFile(path.join(dir, "dm-sans-400.ttf"))]);
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
          background: "linear-gradient(180deg,#EEF4F2 0%,#FAFBF9 100%)",
          color: "#162D39",
          fontFamily: "DM Sans",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="2 6 56 58">
            <path d="M12 10h30l12 12v22a8 8 0 0 1-8 8H30l-12 9v-9h-6a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8z" fill="#225F75" />
            <path d="M42 10v8a4 4 0 0 0 4 4h8z" fill="#5E967E" />
            <path d="M19 31l7 7 13-14" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 40 }}>
            <span>Referto</span>
            <span style={{ color: "#225F75" }}>Chiaro</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontFamily: "Fraunces", fontSize: 76, lineHeight: 1.05, letterSpacing: -2, display: "flex", flexWrap: "wrap" }}>
            <span>I tuoi referti,&nbsp;</span>
            <span style={{ color: "#225F75" }}>finalmente</span>
            <span>&nbsp;comprensibili.</span>
          </div>
          <div style={{ fontSize: 30, color: "#4A5C66" }}>Uno strumento di comprensione. Non una diagnosi.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#4A5C66" }}>
          <span>Valori verificabili · Linguaggio semplice · Domande per la visita</span>
          <span>Versione dimostrativa</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: serif, weight: 400, style: "normal" },
        { name: "DM Sans", data: sans, weight: 400, style: "normal" },
      ],
    },
  );
}

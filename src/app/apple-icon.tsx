import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0C3340", borderRadius: 40 }}>
        <svg width="132" height="132" viewBox="4 4 56 56">
          <path d="M49.09 16.61A23 23 0 1 0 49.09 47.39" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          <path d="M31 20C39.5 20 44 26 44 32C44 38 39.5 44 31 44" fill="none" stroke="#7BE0D2" strokeWidth="7" strokeLinecap="round" />
          <circle cx="31" cy="32" r="3.6" fill="#7BE0D2" />
        </svg>
      </div>
    ),
    size,
  );
}

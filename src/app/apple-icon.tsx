import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#162D39", borderRadius: 40 }}>
        <svg width="132" height="132" viewBox="2 6 56 58">
          <path d="M12 10h30l12 12v22a8 8 0 0 1-8 8H30l-12 9v-9h-6a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8z" fill="#ffffff" />
          <path d="M42 10v8a4 4 0 0 0 4 4h8z" fill="rgba(255,255,255,0.65)" />
          <path d="M19 31l7 7 13-14" fill="none" stroke="#162D39" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}

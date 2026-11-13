import type { Metadata } from "next";
import { NelTempo } from "@/components/famiglia/nel-tempo";

export const metadata: Metadata = { title: "Nel tempo" };

export default function NelTempoPage() {
  return <NelTempo />;
}

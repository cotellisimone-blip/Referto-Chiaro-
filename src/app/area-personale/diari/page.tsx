import type { Metadata } from "next";
import { DiariHome } from "@/components/diari/area";

export const metadata: Metadata = { title: "I tuoi diari" };

export default function Diari() {
  return <DiariHome />;
}

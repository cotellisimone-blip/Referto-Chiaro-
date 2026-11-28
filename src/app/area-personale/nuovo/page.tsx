import type { Metadata } from "next";
import { NewDocument } from "@/components/area/new-document";
import { listSyntheticSamples } from "@/fixtures/synthetic";
import { isCapabilityEnabled } from "@/lib/feature-flags";

export const metadata: Metadata = { title: "Nuovo referto" };

export default function NuovoReferto() {
  return <NewDocument samples={listSyntheticSamples()} uploadsEnabled={isCapabilityEnabled("realUploads")} />;
}

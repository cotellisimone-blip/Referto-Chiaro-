import type { Metadata } from "next";
import { CasesPage } from "@/components/area/cases";
import { priceLabel, publicPricesEnabled } from "@/domain/offerta";

export const metadata: Metadata = { title: "I miei pareri" };

export default function SecondoParereAreaPage() {
  return <CasesPage price={publicPricesEnabled() ? priceLabel("secondo-parere").replace("da ", "") : null} />;
}

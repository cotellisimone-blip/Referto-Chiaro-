import { connection } from "next/server";
import { DEMO_DOCUMENT_ID, getSyntheticDocument } from "@/fixtures/synthetic";
import { json } from "@/lib/api";

/** Restituisce SOLO la fixture sintetica inclusa nel codice. */
export async function GET() {
  await connection();
  return json(getSyntheticDocument(DEMO_DOCUMENT_ID));
}

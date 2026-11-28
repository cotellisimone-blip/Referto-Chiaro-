import { connection } from "next/server";
import { publicConfig } from "@/lib/feature-flags";
import { json } from "@/lib/api";

export async function GET() {
  await connection();
  return json(publicConfig());
}

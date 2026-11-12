import { requireUser } from "@/lib/auth/guard";
import { listVerifiedPhysicians } from "@/domain/cases/repository";
import { json } from "@/lib/api";

/** Specialità disponibili (medici verificati). In demo: solo il medico dimostrativo. */
export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const physicians = await listVerifiedPhysicians(g.user.id);
  const specialties = [...new Set(physicians.map((p) => p.specialty))];
  return json({ specialties, physicians });
}

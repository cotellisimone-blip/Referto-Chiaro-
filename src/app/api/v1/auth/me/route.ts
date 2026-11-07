import { getCurrentUser } from "@/lib/auth/session";
import { json } from "@/lib/api";

export async function GET() {
  const user = await getCurrentUser();
  return json({ user: user ? { email: user.email, displayName: user.displayName, isDemo: user.isDemo } : null });
}

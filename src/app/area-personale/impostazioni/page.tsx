import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { DEMO_ACCOUNT_EMAIL } from "@/lib/auth/service";
import { Settings } from "@/components/area/settings";

export const metadata: Metadata = { title: "Impostazioni" };

export default function ImpostazioniPage() {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-mist" />}>
      <Inner />
    </Suspense>
  );
}

async function Inner() {
  const user = await getCurrentUser();
  if (!user) return null;
  return <Settings email={user.email} isDemoAccount={user.email === DEMO_ACCOUNT_EMAIL} />;
}

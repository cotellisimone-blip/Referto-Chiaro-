import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { LoginHeading, LoginHeadingStatic } from "@/components/area/login-heading";
import { LoginForm } from "@/components/area/login-form";
import { readFlags } from "@/lib/feature-flags";

export const metadata: Metadata = { title: "Accedi", description: "Accedi all'area personale di Cura Privata con un link via email, senza password." };

/** I flag si leggono a ogni richiesta, mai al build: la pagina non deve «ricordare» l'ambiente di compilazione. */
async function LoginAtRequest() {
  await connection();
  const flags = readFlags();
  return <LoginForm demoMode={flags.demoMode} vetrina={flags.vetrina} />;
}

export default function AccediPage() {
  return (
    <>
      {/* Il titolo dipende da dove si voleva andare (?next=): si legge nel browser, la pagina resta statica. */}
      <Suspense fallback={<LoginHeadingStatic vetrina={readFlags().vetrina} />}>
        <LoginHeading vetrina={readFlags().vetrina} />
      </Suspense>
      <div className="container-rc page-body">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-mist" />}>
          <LoginAtRequest />
        </Suspense>
      </div>
    </>
  );
}

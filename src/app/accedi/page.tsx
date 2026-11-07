import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { PageHeader } from "@/components/ui/page-header";
import { LoginForm } from "@/components/area/login-form";
import { readFlags } from "@/lib/feature-flags";

export const metadata: Metadata = { title: "Accedi" };

/** I flag si leggono a ogni richiesta, mai al build: la pagina non deve «ricordare» l'ambiente di compilazione. */
async function LoginAtRequest() {
  await connection();
  return <LoginForm demoMode={readFlags().demoMode} />;
}

export default function AccediPage() {
  return (
    <>
      <PageHeader compact eyebrow="Area personale" title="Accedi o crea un account." lead="I tuoi referti e i tuoi report, in un archivio che vedi solo tu." />
      <div className="container-rc py-10 sm:py-14">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-mist" />}>
          <LoginAtRequest />
        </Suspense>
      </div>
    </>
  );
}

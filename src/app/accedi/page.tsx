import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { PageHeader } from "@/components/ui/page-header";
import { LoginForm } from "@/components/area/login-form";
import { readFlags } from "@/lib/feature-flags";

export const metadata: Metadata = { title: "Accedi", description: "Accedi all'area personale di Cura Privata con un link via email, senza password." };

/** I flag si leggono a ogni richiesta, mai al build: la pagina non deve «ricordare» l'ambiente di compilazione. */
async function LoginAtRequest() {
  await connection();
  return <LoginForm demoMode={readFlags().demoMode} />;
}

export default function AccediPage() {
  return (
    <>
      <PageHeader compact eyebrow="Area personale" title="Il tuo archivio, visibile solo a te." lead="Nessuna password da ricordare: un link via email. Oppure entra con l'account demo e prova subito." />
      <div className="container-rc py-10 sm:py-14">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-mist" />}>
          <LoginAtRequest />
        </Suspense>
      </div>
    </>
  );
}

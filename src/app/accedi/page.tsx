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
  const flags = readFlags();
  return <LoginForm demoMode={flags.demoMode} vetrina={flags.vetrina} />;
}

export default function AccediPage() {
  return (
    <>
      <PageHeader compact eyebrow="Area personale" title="Il tuo archivio, visibile solo a te." lead={
          readFlags().vetrina
            ? "Oggi si prova con l'account demo: referti inventati, nessuna registrazione."
            : "Nessuna password da ricordare: un link via email. Oppure entra con l'account demo e prova subito."
        }
      />
      <div className="container-rc page-body">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-mist" />}>
          <LoginAtRequest />
        </Suspense>
      </div>
    </>
  );
}

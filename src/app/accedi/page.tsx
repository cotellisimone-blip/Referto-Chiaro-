import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { LoginHeadingStatic } from "@/components/area/login-heading";
import { LoginForm } from "@/components/area/login-form";
import { readFlags } from "@/lib/feature-flags";

export const metadata: Metadata = { title: "Accedi", description: "Accedi all'area personale di Cura Privata con un link via email, senza password." };

/**
 * I flag si leggono a ogni richiesta, mai al build: la pagina non deve «ricordare» l'ambiente di compilazione.
 * Quarto giro, punto 9: anche il titolo sta qui. Prima aveva un suo Suspense con un titolo provvisorio, e l'HTML della
 * pagina conteneva due h1 (provvisorio e definitivo). Ora c'è un solo h1; il segnaposto ha la stessa altezza ma nessun titolo.
 */
async function LoginAtRequest({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  await connection();
  const flags = readFlags();
  const raw = (await searchParams).next;
  const next = typeof raw === "string" ? raw : null;
  return (
    <>
      <LoginHeadingStatic vetrina={flags.vetrina} next={next} />
      <div className="container-rc page-body">
        <LoginForm demoMode={flags.demoMode} vetrina={flags.vetrina} />
      </div>
    </>
  );
}

export default function AccediPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  return (
    <Suspense
      fallback={
        <>
          <div aria-hidden className="login-heading-placeholder" />
          <div className="container-rc page-body">
            <div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-mist" />
          </div>
        </>
      }
    >
      <LoginAtRequest searchParams={searchParams} />
    </Suspense>
  );
}

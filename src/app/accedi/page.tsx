import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { LoginForm } from "@/components/area/login-form";
import { readFlags } from "@/lib/feature-flags";

export const metadata: Metadata = { title: "Accedi" };

export default function AccediPage() {
  const demoMode = readFlags().demoMode;
  return (
    <>
      <PageHeader compact eyebrow="Area personale" title="Accedi o crea un account." lead="I tuoi referti e i tuoi report, in un archivio che vedi solo tu." />
      <div className="container-rc py-10 sm:py-14">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-mist" />}>
          <LoginForm demoMode={demoMode} />
        </Suspense>
      </div>
    </>
  );
}

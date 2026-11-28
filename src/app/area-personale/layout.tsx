import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { safeAreaNext } from "@/lib/auth/next-path";
import { getCurrentUser } from "@/lib/auth/session";
import { AreaNav } from "@/components/area/area-nav";
import { AreaShell } from "@/components/area/area-shell";
import { AreaProvaAvvisami, VetrinaProvider } from "@/components/site/prova-avvisami";
import { isVetrina } from "@/domain/offerta";

/**
 * Tutte le pagine dell'area personale richiedono una sessione. La lettura del cookie avviene
 * dietro Suspense (Cache Components): il contorno della pagina è statico, il contenuto arriva dopo.
 */
export default function AreaLayout({ children }: LayoutProps<"/area-personale">) {
  return (
    <Suspense fallback={<AreaSkeleton />}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}

async function Gate({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    const next = safeAreaNext((await headers()).get("x-cp-path"));
    redirect(next === "/area-personale" ? "/accedi?next=/area-personale" : `/accedi?next=${encodeURIComponent(next)}`);
  }
  return (
    <AreaShell nav={<AreaNav email={user.email} displayName={user.displayName} isDemo={user.isDemo} />}>
      <VetrinaProvider vetrina={isVetrina()}>
        <div className="min-w-0">
          {children}
          {/* Ciclo 3, fase 1: in vetrina la prova con l'account demo finisce con «Avvisami quando parte». */}
          <AreaProvaAvvisami />
        </div>
      </VetrinaProvider>
    </AreaShell>
  );
}

function AreaSkeleton() {
  return (
    <div className="container-rc py-8 sm:py-10" aria-busy="true">
      <div className="h-12 animate-pulse rounded-full bg-mist" />
      <div className="mt-8 h-64 animate-pulse rounded-2xl bg-mist" />
    </div>
  );
}

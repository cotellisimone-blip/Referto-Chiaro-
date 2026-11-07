import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AreaNav } from "@/components/area/area-nav";

/**
 * Tutte le pagine dell'area personale richiedono una sessione. La lettura del cookie avviene
 * dietro Suspense (Cache Components): il contorno della pagina è statico, il contenuto arriva dopo.
 */
export default function AreaLayout({ children }: LayoutProps<"/area">) {
  return (
    <Suspense fallback={<AreaSkeleton />}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}

async function Gate({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/accedi?next=/area");
  return (
    <div className="container-rc py-8 sm:py-10">
      <AreaNav email={user.email} displayName={user.displayName} isDemo={user.isDemo} />
      <div className="mt-8">{children}</div>
    </div>
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

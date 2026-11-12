import { RoleGate } from "@/components/portale/role-gate";

/** Pannello admin: ruolo admin + 2FA. Le API applicano lo stesso controllo (`requireRole`). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate role="admin" title="Amministrazione">
      {children}
    </RoleGate>
  );
}

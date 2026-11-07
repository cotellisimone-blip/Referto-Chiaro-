import { RoleGate } from "@/components/portale/role-gate";

/** Portale medico: ruolo physician + 2FA. Le API applicano lo stesso controllo (`requireRole`). */
export default function MedicoLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGate role="physician" title="Portale medico">
      {children}
    </RoleGate>
  );
}

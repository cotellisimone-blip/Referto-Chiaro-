import type { Metadata } from "next";
import { ProvaShell } from "@/components/prestazioni/hub";
import { DoctorApply } from "@/components/prestazioni/doctor";

export const metadata: Metadata = { title: "Candidati come medico" };

export default function Page() {
  return (
    <ProvaShell role="medico">
      <div className="space-y-6">
        <div>
          <p className="eyebrow">Per i medici · prova</p>
          <h1 className="display mt-3 text-[2rem] sm:text-[2.5rem]">Candidati come medico</h1>
          <p className="mt-2 max-w-2xl text-[1.0625rem] text-ink-soft">Recapito professionale, iscrizione all&apos;Ordine, prestazioni, zone e fasce. Ricevi richieste solo dopo la verifica dell&apos;amministrazione e l&apos;abilitazione alla prestazione.</p>
        </div>
        <DoctorApply />
      </div>
    </ProvaShell>
  );
}

import { isVetrina } from "@/domain/offerta";
import { PatientShell } from "@/components/prestazioni/hub";
import { PatientHome } from "@/components/prestazioni/patient";

export default function Page() {
  return (
    <PatientShell vetrina={isVetrina()}>
      <PatientHome />
    </PatientShell>
  );
}

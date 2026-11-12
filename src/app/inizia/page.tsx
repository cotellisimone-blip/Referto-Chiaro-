import type { Metadata } from "next";
import { NeedPicker } from "@/components/offerta/need-picker";
import { pickerServices } from "@/domain/offerta";

export const metadata: Metadata = {
  title: "Ti aiutiamo a scegliere",
  description: "Rispondi a una domanda sul tuo bisogno: ti indichiamo il servizio di Cura Privata adatto, con prezzo e tempi. Nessuna domanda sui sintomi.",
  alternates: { canonical: "/inizia" },
};

export default function IniziaPage() {
  return (
    <section aria-labelledby="inizia-titolo" className="bg-ivory-wash">
      <div className="container-rc py-12 sm:py-16">
        <p className="eyebrow">Ti aiutiamo a scegliere</p>
        <h1 id="inizia-titolo" className="display-xl mt-5 max-w-3xl">
          Da dove vuoi cominciare?
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-ink-soft">Una risposta sola, sul tuo bisogno. Non è un consulto e non ti chiediamo nulla sulla tua salute.</p>
        <div className="mt-10">
          <NeedPicker services={pickerServices()} headingId="inizia-titolo" />
        </div>
      </div>
    </section>
  );
}

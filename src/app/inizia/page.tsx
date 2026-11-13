import type { Metadata } from "next";
import { NeedPicker } from "@/components/offerta/need-picker";
import { pickerServices, publicPricesEnabled } from "@/domain/offerta";
import { offerItems } from "@/domain/prestazioni/offerta-completa";
import { PRESTAZIONI, prestazionePrice } from "@/domain/prestazioni/listino";

export const metadata: Metadata = {
  title: "Ti aiutiamo a scegliere",
  description: "Rispondi a una domanda sul tuo bisogno: ti indichiamo il servizio di Cura Privata adatto, con prezzo e tempi. Nessuna domanda sui sintomi.",
  alternates: { canonical: "/inizia" },
};

export default function IniziaPage() {
  const dom = offerItems().find((x) => x.key === "domicilio")!;
  const services = [
    ...pickerServices(),
    { id: "domicilio" as const, name: dom.name, href: dom.href, startHref: PRESTAZIONI.domicilio.startHref, startLabel: "Richiedi la visita", price: publicPricesEnabled() ? prestazionePrice("domicilio") : null, timing: dom.timing, need: dom.need },
  ];
  return (
    <section aria-labelledby="inizia-titolo" className="page-hero">
      <div className="container-rc page-hero-inner page-hero-flat">
        <p className="eyebrow">Ti aiutiamo a scegliere</p>
        <h1 id="inizia-titolo" className="page-title mt-4">
          Da dove vuoi cominciare?
        </h1>
        <p className="lead mt-5 max-w-[38rem]">Una risposta sola, su ciò che ti serve. Non è un consulto e non ti chiediamo nulla sulla tua salute.</p>
        <div className="mt-8 sm:mt-11">
          <NeedPicker services={services} headingId="inizia-titolo" />
        </div>
      </div>
    </section>
  );
}

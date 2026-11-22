import { domicilioEnabled, mediciEnabled } from "@/lib/medici";
import { PrestoMedico } from "@/components/site/presto-medico";
import type { Metadata } from "next";
import { NeedPicker } from "@/components/offerta/need-picker";
import { pickerServices, publicPricesEnabled } from "@/domain/offerta";
import { offerItems } from "@/domain/prestazioni/offerta-completa";
import { PRESTAZIONI, prestazionePrice } from "@/domain/prestazioni/listino";
import { PageLd } from "@/components/site/page-ld";
import { DaDoveParto } from "@/components/offerta/da-dove-parto";
import "@/components/offerta/offerta.css";

export const metadata: Metadata = {
  title: "Da dove parto? Ti aiutiamo a scegliere",
  description: "Cinque risposte, una per passo del percorso di Cura Privata: che cosa è gratis, che cosa costa e da dove cominciare. Nessuna domanda sui sintomi.",
  alternates: { canonical: "/inizia" },
};

export default function IniziaPage() {
  const dom = offerItems().find((x) => x.key === "domicilio")!;
  const medici = mediciEnabled();
  // 13/11/2026: senza medici restano il referto e lo strumento gratuito; i servizi con un medico solo come «presto».
  const services = medici
    ? [
        ...pickerServices(),
        // 22/11/2026: la visita a domicilio solo con il suo interruttore acceso.
        ...(domicilioEnabled() ? [{ id: "domicilio" as const, name: dom.name, href: dom.href, startHref: PRESTAZIONI.domicilio.startHref, startLabel: "Richiedi la visita", price: publicPricesEnabled() ? prestazionePrice("domicilio") : null, timing: dom.timing, need: dom.need }] : []),
      ]
    : pickerServices().filter((s) => s.id === "capisci");
  return (
    <section aria-labelledby="inizia-titolo" className="page-hero">
      <PageLd path="/inizia" meta={metadata} name="Ti aiutiamo a scegliere" />
      <div className="container-rc page-hero-inner page-hero-flat">
        <p className="eyebrow">Ti aiutiamo a scegliere</p>
        <h1 id="inizia-titolo" className="page-title mt-4">
          Da dove parto?
        </h1>
        <p className="lead mt-5 max-w-[38rem]">Cinque risposte, una per passo. Tocca quella più vicina a te. Non è un consulto e non ti chiediamo nulla sulla tua salute.</p>
        <div className="mt-7 sm:mt-9">
          <DaDoveParto />
        </div>
        <h2 className="mt-12 text-[1.5rem] font-extrabold tracking-[-0.01em] text-ink sm:mt-14">Oppure: scegli un servizio</h2>
        <div className="mt-5">
          <NeedPicker services={services} headingId="inizia-titolo" />
        </div>
        {medici ? null : <PrestoMedico className="mt-10" />}
      </div>
    </section>
  );
}

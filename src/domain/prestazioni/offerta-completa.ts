import { mediciEnabled } from "@/lib/medici";
import { CORE_SERVICES, type CoreServiceId } from "@/domain/offerta";
import { PRESTAZIONI, type PrestazioneKind } from "./listino";

/**
 * L'offerta completa in un solo elenco (ciclo 4): «Capisci il tuo referto» e le tre prestazioni con un medico.
 * Servizi, Prezzi e la scelta guidata leggono da qui, così ogni servizio compare una volta sola e nello stesso ordine
 * del menu: Capisci, a domicilio, videoconsulto, secondo parere.
 */
export type OfferKey = "capisci" | "domicilio" | "video" | "parere";

export interface OfferItem {
  key: OfferKey;
  /** Presente per i tre servizi storici: dà prezzo (PriceTag) e avvio. */
  coreId?: CoreServiceId;
  /** Presente per le prestazioni con un medico: dà disponibilità e richiesta diretta. */
  kind?: PrestazioneKind;
  name: string;
  oneLiner: string;
  forWhom: string;
  timing: string;
  who: string;
  includes: string[];
  href: string;
  need: string;
  tone: "capisci" | "medico" | "parere";
  icon: "file" | "home" | "video" | "stethoscope";
}

const DOMICILIO: Omit<OfferItem, "key" | "kind" | "href" | "name" | "includes" | "tone" | "icon"> = {
  oneLiner: "Un medico di medicina generale viene a casa tua o di un familiare, per esigenze non urgenti, e ti lascia un riepilogo scritto con il prossimo passo.",
  forWhom: "Tu o un tuo familiare avete bisogno di essere visitati a casa, senza urgenza.",
  timing: "Solo fasce davvero libere, a Brescia città (area pilota)",
  who: "Un medico di medicina generale, abilitato e identificabile: vedi il nome prima di confermare.",
  need: "Serve una visita a casa, per me o per un familiare",
};

const core = (id: CoreServiceId) => CORE_SERVICES.find((s) => s.id === id)!;

/** 13/11/2026: l'offerta che si vende davvero adesso. Con i medici spenti (src/lib/medici.ts) resta solo il referto. */
export function publicOfferItems(): OfferItem[] {
  return mediciEnabled() ? offerItems() : offerItems().filter((i) => !i.kind);
}

export function offerItems(): OfferItem[] {
  const c = core("capisci");
  const v = core("parla-con-un-medico");
  const p = core("secondo-parere");
  const from = (s: typeof c) => ({ name: s.name, oneLiner: s.oneLiner, forWhom: s.forWhom, timing: s.timing, who: s.who, includes: s.includes, href: s.href, need: s.need });
  return [
    { key: "capisci", coreId: "capisci", ...from(c), tone: "capisci", icon: "file" },
    { key: "domicilio", kind: "domicilio", name: PRESTAZIONI.domicilio.title, includes: PRESTAZIONI.domicilio.includes, href: PRESTAZIONI.domicilio.href, ...DOMICILIO, tone: "medico", icon: "home" },
    { key: "video", coreId: "parla-con-un-medico", kind: "video", ...from(v), tone: "medico", icon: "video" },
    { key: "parere", coreId: "secondo-parere", kind: "parere", ...from(p), tone: "parere", icon: "stethoscope" },
  ];
}

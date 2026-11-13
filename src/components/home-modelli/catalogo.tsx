import Link from "next/link";
import { ArrowRight, BellRing, BookOpen, Compass, FileText, Home, LineChart, ListChecks, Stethoscope, Users, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { priceDisplay, publicPricesEnabled } from "@/domain/offerta";
import { prestazionePrice } from "@/domain/prestazioni/listino";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";

/**
 * Modelli di home (13/11/2026, da approvare): l'offerta intera di Cura Privata in un posto solo.
 * Nomi, link e prezzi vengono dal dominio (offerta, listino): nessun prezzo scritto a mano.
 * Il piano Famiglia NON è in primo piano: compare solo come voce «in arrivo», senza prezzo.
 */
export type Gruppo = "parti" | "capisci" | "medico" | "tempo";

export interface Voce {
  id: string;
  gruppo: Gruppo;
  name: string;
  line: string;
  href: string;
  icon: LucideIcon;
  /** Prezzo già formattato dal dominio, oppure «Gratis». */
  price: string | null;
  priceNote?: string;
  tone: "capisci" | "medico" | "parere" | null;
}

export const GRUPPI: Record<Gruppo, { title: string; line: string }> = {
  parti: { title: "Parti gratis", line: "Prima delle analisi, prima della visita." },
  capisci: { title: "Capisci", line: "Il referto, spiegato valore per valore." },
  medico: { title: "Parla con un medico", line: "Medici abilitati e identificabili, a casa o in video." },
  tempo: { title: "Nel tempo, per tutta la famiglia", line: "Ogni referto si aggiunge ai precedenti." },
};

export function catalogo(): Voce[] {
  const prices = publicPricesEnabled();
  const cap = priceDisplay("capisci");
  const p = (x: string) => (prices ? x : null);
  return [
    { id: "pdp", gruppo: "parti", name: "Punto di Partenza", line: "Poche domande, una scheda da portare al medico.", href: "/punto-di-partenza", icon: Compass, price: "Gratis", tone: null },
    { id: "visita", gruppo: "parti", name: "Preparati alla visita", line: "Che cosa chiedere, che cosa portare.", href: "/strumenti/preparati-alla-visita", icon: ListChecks, price: "Gratis", tone: null },
    { id: "guide", gruppo: "parti", name: "Guide agli esami", line: `${GUIDES.length} guide e ${GLOSSARY.length} parole spiegate.`, href: "/guide", icon: BookOpen, price: "Gratis", tone: null },
    { id: "capisci", gruppo: "capisci", name: "Capisci il tuo referto", line: "Ogni valore in parole semplici, con le domande per il medico.", href: "/referti", icon: FileText, price: p(cap.lead ? `${cap.lead} ${cap.amount}` : cap.amount), priceNote: prices ? (cap.note ?? undefined) : undefined, tone: "capisci" },
    { id: "domicilio", gruppo: "medico", name: "Visita a domicilio", line: "Un medico generalista a casa tua. Brescia città.", href: "/servizi/visita-a-domicilio", icon: Home, price: p(prestazionePrice("domicilio")), tone: "medico" },
    { id: "video", gruppo: "medico", name: "Videoconsulto", line: "Circa venti minuti in video, con i documenti già letti.", href: "/servizi/parla-con-un-medico", icon: Video, price: p(prestazionePrice("video")), tone: "medico" },
    { id: "parere", gruppo: "medico", name: "Secondo parere", line: "Uno specialista esamina i documenti e scrive una sintesi.", href: "/servizi/secondo-parere", icon: Stethoscope, price: p(prestazionePrice("parere")), tone: "parere" },
    { id: "tempo", gruppo: "tempo", name: "I tuoi numeri nel tempo", line: "Un grafico per ogni esame, anno dopo anno.", href: "/famiglia", icon: LineChart, price: "Nel tuo spazio", tone: null },
    { id: "promemoria", gruppo: "tempo", name: "Promemoria e foglio per la visita", line: "Le domande pronte, il giorno giusto.", href: "/famiglia", icon: BellRing, price: "Nel tuo spazio", tone: null },
    { id: "famiglia", gruppo: "tempo", name: "La tua famiglia", line: "Una scheda per chi segui: un genitore, un figlio.", href: "/famiglia", icon: Users, price: "In arrivo", tone: null },
  ];
}

export function vociDi(g: Gruppo) {
  return catalogo().filter((v) => v.gruppo === g);
}

/** Riga di catalogo: icona, nome, una riga, prezzo, freccia. Tutta la riga è il link. */
export function VoceRiga({ v, headingLevel = 3 }: { v: Voce; headingLevel?: 3 | 4 }) {
  const H = headingLevel === 3 ? "h3" : "h4";
  const Icon = v.icon;
  return (
    <li>
      <Link href={v.href} className={`hm-row tone-${v.tone ?? "partenza"}`}>
        <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone shrink-0">
          <Icon />
        </span>
        <span className="min-w-0 flex-1">
          <H className="hm-row-name">{v.name}</H>
          <span className="hm-row-line">{v.line}</span>
        </span>
        {v.price ? (
          <span className="hm-row-price">
            <strong>{v.price}</strong>
            {v.priceNote ? <span>{v.priceNote}</span> : null}
          </span>
        ) : null}
        <ArrowRight aria-hidden className="hm-row-arrow h-5 w-5 shrink-0" />
      </Link>
    </li>
  );
}

/** Barra per confrontare i modelli: solo su queste pagine, non nel sito. */
export function ModelloBar({ current }: { current: "a" | "b" | "c" }) {
  const M = [
    { id: "a", name: "A · Sportello" },
    { id: "b", name: "B · Racconto" },
    { id: "c", name: "C · Vetrina" },
  ] as const;
  return (
    <nav aria-label="Modelli di home" className="hm-bar no-print">
      <span className="hm-bar-label">Modello di home da approvare</span>
      <ul>
        {M.map((m) => (
          <li key={m.id}>
            <Link href={`/modelli-home/${m.id}`} aria-current={m.id === current ? "page" : undefined}>
              {m.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Emergenza({ className = "" }: { className?: string }) {
  return (
    <p className={`emergency-note ${className}`}>
      <span aria-hidden>
        <PhoneIcon />
      </span>
      <span>
        <strong>Non per le emergenze.</strong> Se stai male adesso chiama il <strong>112</strong>.
      </span>
    </p>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

import { isSameDay } from "@/domain/prestazioni/engine";

/*
 * Le date scritte per le persone. Sta in un file a sé (17/11/2026, intervento 18): chi mostra solo un orario, come la sezione
 * Medici in home, non deve portarsi dietro gli stili di tutta l'area delle prestazioni importati da ui.tsx.
 */

/** «oggi alle 15:00», «domani alle 9:00», «giovedì 14 novembre alle 16:00». */
export function formatSlot(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const time = new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(d);
  if (isSameDay(d, now)) return `oggi alle ${time}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(d, tomorrow)) return `domani alle ${time}`;
  return `${new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" }).format(d)} alle ${time}`;
}

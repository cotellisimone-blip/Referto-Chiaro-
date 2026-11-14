import { requireUser } from "@/lib/auth/guard";
import { json } from "@/lib/api";
import { quoteCapisci } from "@/domain/orders/repository";
import { formatEuro, priceCents, priceLabel, publicPricesEnabled } from "@/domain/offerta";
import { mediciEnabled } from "@/lib/medici";

/** Prezzo di «Capisci il tuo referto» per l'utente collegato: primo referto in promozione o prezzo standard. */
export async function GET() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  const q = await quoteCapisci(g.user.id);
  return json({ amountCents: q.amountCents, amount: formatEuro(q.amountCents), first: q.first, standard: formatEuro(priceCents("capisci")),
    // Senza medici (src/lib/medici.ts) i loro prezzi non escono nemmeno dal server.
    medico: publicPricesEnabled() && mediciEnabled() ? priceLabel("parla-con-un-medico") : null,
    parere: publicPricesEnabled() && mediciEnabled() ? priceLabel("secondo-parere") : null,
  });
}

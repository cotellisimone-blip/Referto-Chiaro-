import { PageHeader } from "@/components/ui/page-header";

/**
 * 18/11/2026 (secondo giro, punto 2): chi arriva qui da «Carica un referto» legge perché deve entrare e che cosa
 * succede dopo, non il titolo generico dell'archivio. La destinazione si legge dall'indirizzo (`?next=`), che è già
 * controllato da `safeAreaNext` al momento del rimando.
 */
const MOTIVI: Record<string, { eyebrow: string; title: string; lead: string; leadVetrina: string }> = {
  "/area-personale/nuovo": {
    eyebrow: "Carica un referto · prima entra",
    title: "Per caricare il referto, entra.",
    lead: "Un attimo e sei al caricamento: con l'account demo provi subito, senza registrarti. Oppure ricevi un link via email, senza password.",
    leadVetrina: "Un attimo e sei al caricamento: oggi si prova con l'account demo, con referti inventati e senza registrazione.",
  },
  "/area-personale/nel-tempo": {
    eyebrow: "Nel tempo · gratis",
    title: "I tuoi valori nel tempo, in un posto solo.",
    lead: "Entra e trovi i referti in ordine, l'andamento dei valori e i promemoria. Con l'account demo provi subito, senza registrarti.",
    leadVetrina: "Oggi si prova con l'account demo: referti inventati, nessuna registrazione.",
  },
};

const DEFAULT = {
  eyebrow: "Area personale",
  title: "Il tuo archivio, visibile solo a te.",
  lead: "Nessuna password da ricordare: un link via email. Oppure entra con l'account demo e prova subito.",
  leadVetrina: "Oggi si prova con l'account demo: referti inventati, nessuna registrazione.",
};

export function LoginHeadingStatic({ vetrina, next }: { vetrina: boolean; next?: string | null }) {
  const m = (next && MOTIVI[next]) || DEFAULT;
  return <PageHeader compact eyebrow={m.eyebrow} title={m.title} lead={vetrina ? m.leadVetrina : m.lead} />;
}

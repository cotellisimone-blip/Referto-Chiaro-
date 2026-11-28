import type { MetadataRoute } from "next";

/**
 * 18/11/2026 (secondo giro, punto 19): il file che permette ad Android (Chrome) di proporre «Aggiungi a schermata Home»
 * con nome e icona giusti. Si apre sull'area personale: chi torna lo fa per i suoi referti. Nessuna funzione fuori rete:
 * è solo un'icona che apre il sito.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cura Privata",
    short_name: "Cura Privata",
    description: "Previeni, capisci i referti, un medico se serve. Spiegazioni informative: non sostituiscono il medico.",
    lang: "it",
    start_url: "/area-personale",
    scope: "/",
    display: "standalone",
    background_color: "#F5FAF8",
    theme_color: "#0C3340",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

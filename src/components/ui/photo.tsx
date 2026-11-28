import type { CSSProperties } from "react";
import type { SitePhoto } from "@/content/media";

/**
 * Fotografia illustrativa: un <img> vero con le due risoluzioni (metà e piena), dimensioni dichiarate (niente salti
 * di pagina) e caricamento pigro salvo quando è la prima cosa che si vede (`priority`).
 */
export function Photo({
  photo,
  sizes,
  className,
  style,
  priority = false,
}: {
  photo: SitePhoto;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  const srcSet = photo.srcSmall ? `${photo.srcSmall} ${Math.round(photo.width / 2)}w, ${photo.src} ${photo.width}w` : undefined;
  if (priority) {
    /*
     * 18/11/2026 (secondo giro, punto 5): la foto d'apertura è scritta come HTML già pronto, non come elemento React.
     * Il browser la vede subito e la scarica per prima, come prima. Ma React non la annota più tra le risorse «da
     * precaricare»: quell'annotazione viaggiava anche con il precaricamento dei collegamenti, e così OGNI pagina del
     * sito scaricava le quattro fotografie delle pagine a cui la testata rimanda (317 KB su circa 800), anche Prezzi
     * e il glossario, che non ne mostrano nessuna. Il contenitore non occupa spazio (display: contents): gli stili
     * continuano a valere sull'immagine. Tutti i valori vengono da `content/media.ts`, non da chi visita.
     */
    const esc = (v: string | number) => String(v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
    const css = style
      ? Object.entries(style)
          .map(([k, v]) => `${k.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${v}`)
          .join(";")
      : "";
    const attrs = [
      `src="${esc(photo.src)}"`,
      srcSet ? `srcset="${esc(srcSet)}" sizes="${esc(sizes)}"` : "",
      `width="${esc(photo.width)}" height="${esc(photo.height)}"`,
      `alt="${esc(photo.alt)}"`,
      `fetchpriority="high" decoding="async"`,
      className ? `class="${esc(className)}"` : "",
      css ? `style="${esc(css)}"` : "",
    ]
      .filter(Boolean)
      .join(" ");
    return <span style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: `<img ${attrs}>` }} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.src}
      srcSet={srcSet}
      sizes={photo.srcSmall ? sizes : undefined}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading={priority ? undefined : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      style={style}
    />
  );
}

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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={photo.src}
      srcSet={photo.srcSmall ? `${photo.srcSmall} ${Math.round(photo.width / 2)}w, ${photo.src} ${photo.width}w` : undefined}
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

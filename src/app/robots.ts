import type { MetadataRoute } from "next";
import { absoluteUrl, indexingEnabled } from "@/lib/seo";

/** Finché la revisione medica non c'è: tutto disallow. Con ENABLE_INDEXING=true: pubblico sì, aree riservate e API no. */
export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/area-personale", "/medico", "/admin", "/api/", "/accedi"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

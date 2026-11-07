import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Driver del database e PDF: restano moduli esterni, non vengono impacchettati nel bundle server.
  serverExternalPackages: ["@electric-sql/pglite", "pg", "pdf-lib", "@pdf-lib/fontkit"],
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

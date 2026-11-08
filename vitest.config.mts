import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)), "server-only": fileURLToPath(new URL("./tests/unit/_shims/server-only.ts", import.meta.url)) } },
  test: { include: ["tests/unit/**/*.test.ts", "tests/ai-eval/**/*.test.ts"], environment: "node" },
});

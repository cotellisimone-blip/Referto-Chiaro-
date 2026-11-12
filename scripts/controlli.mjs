#!/usr/bin/env node
/**
 * Ciclo 3, fase 5: gli stessi controlli di GitHub (.github/workflows/controlli.yml), in locale, con un riepilogo.
 * Serve finché i controlli su GitHub non partono, e prima di ogni pull request.
 *   npm run controlli              tutti i passi
 *   npm run controlli -- --rapido  senza i test nel browser
 * Con --esito <file> scrive il riepilogo in Markdown (da allegare al registro del ciclo).
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const rapido = args.includes("--rapido");
const esitoIdx = args.indexOf("--esito");
const esitoFile = esitoIdx >= 0 ? args[esitoIdx + 1] : null;

const PASSI = [
  { nome: "Lint", cmd: "npm run lint" },
  { nome: "Tipi", cmd: "npm run typecheck" },
  { nome: "Test unitari", cmd: "npm test" },
  { nome: "Build", cmd: "npm run build" },
  { nome: "e2e desktop e telefono", cmd: "npx playwright test --trace off --reporter=line", browser: true },
  { nome: "e2e profilo vetrina", cmd: "npm run test:e2e:vetrina -- --reporter=line", browser: true },
];

const esiti = [];
for (const p of PASSI) {
  if (rapido && p.browser) {
    esiti.push({ ...p, stato: "saltato", secondi: 0, riassunto: "--rapido" });
    continue;
  }
  console.log(`\n▶ ${p.nome}: ${p.cmd}`);
  const t0 = Date.now();
  const r = spawnSync(p.cmd, { shell: true, encoding: "utf8", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }, maxBuffer: 64 * 1024 * 1024 });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  process.stdout.write(out.split("\n").slice(-15).join("\n") + "\n");
  // Riga utile del risultato: conteggi di vitest o playwright, se ci sono.
  const riassunto =
    out.match(/Tests\s+[^\n]*/)?.[0]?.trim() ??
    [out.match(/\d+ passed[^\n]*/)?.[0], out.match(/\d+ failed[^\n]*/)?.[0], out.match(/\d+ skipped[^\n]*/)?.[0]].filter(Boolean).join(" · ") ??
    "";
  esiti.push({ ...p, stato: r.status === 0 ? "ok" : "FALLITO", secondi: Math.round((Date.now() - t0) / 1000), riassunto: riassunto.replace(/\x1b\[[0-9;]*m/g, "") });
  if (r.status !== 0) break; // come su GitHub: il primo errore ferma i passi successivi
}

const righe = ["| Passo | Esito | Secondi | Dettaglio |", "|---|---|---|---|", ...esiti.map((e) => `| ${e.nome} | ${e.stato} | ${e.secondi} | ${e.riassunto || ""} |`)];
const ok = esiti.length === PASSI.length && esiti.every((e) => e.stato !== "FALLITO");
console.log(`\n${righe.join("\n")}\n\n${ok ? "Tutti i controlli sono passati." : "Controlli NON superati."}`);
if (esitoFile) writeFileSync(esitoFile, `# Controlli locali\n\n*${new Date().toISOString()}*\n\n${righe.join("\n")}\n\n${ok ? "Tutti i controlli sono passati." : "Controlli NON superati."}\n`);
process.exit(ok ? 0 : 1);

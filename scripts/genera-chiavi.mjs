#!/usr/bin/env node
/** Genera le chiavi segrete da incollare nelle variabili d'ambiente (Vercel → Settings → Environment Variables). */
import { randomBytes } from "node:crypto";
const hex = () => randomBytes(32).toString("hex");
console.log(`MFA_SECRET_KEY=${hex()}`);
console.log(`FILE_ENCRYPTION_KEY=${hex()}`);
console.log(`CRON_SECRET=${randomBytes(24).toString("base64url")}`);
console.log("\n# Conservale in un gestore di password. Se perdi FILE_ENCRYPTION_KEY, i file caricati non si possono più leggere.");

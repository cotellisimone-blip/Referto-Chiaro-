#!/usr/bin/env bash
# Configurazione in un comando: dipendenze, file .env.local con chiavi generate, migrazione (se c'è un database), test.
# Uso: npm run setup
set -euo pipefail
cd "$(dirname "$0")/.."

echo "→ Installo le dipendenze"
npm ci --no-audit --no-fund

if [ ! -f .env.local ]; then
  echo "→ Creo .env.local (modalità demo, chiavi generate)"
  cp .env.example .env.local
  node scripts/genera-chiavi.mjs | grep '=' >> .env.local
else
  echo "→ .env.local esiste già: non lo tocco"
fi

if grep -qE '^DATABASE_URL=' .env.local; then
  echo "→ Migro il database indicato in .env.local"
  set -a; . ./.env.local; set +a
  npm run db:migrate
else
  echo "→ Nessun DATABASE_URL: in locale si usa PGlite in .data/ (zero configurazione)"
fi

echo "→ Controlli rapidi"
npm run typecheck
npm test

echo ""
echo "Pronto. Avvia con: npm run dev  →  http://localhost:3000"

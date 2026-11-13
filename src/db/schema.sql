-- Cura Privata — schema v1 (PostgreSQL 16 / PGlite)
-- Ogni tabella con dati personali ha RLS: un utente vede solo le proprie righe.
-- L'applicazione apre ogni transazione con: SET LOCAL ROLE app_rls; SET LOCAL app.user_id = '<uuid>'.

CREATE TABLE IF NOT EXISTS schema_migrations (
  version integer PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  display_name text,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz,
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS magic_links (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  purpose text NOT NULL CHECK (purpose IN ('login', 'signup')),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE TABLE IF NOT EXISTS consents (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  version text NOT NULL,
  granted boolean NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  source_kind text NOT NULL CHECK (source_kind IN ('synthetic', 'upload')),
  source_ref text NOT NULL,
  status text NOT NULL CHECK (status IN ('queued', 'extracting', 'needs-verification', 'verified', 'ready', 'error')),
  extracted jsonb,
  verification jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS documents_user_idx ON documents(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  service text NOT NULL CHECK (service IN ('essenziale', 'completo')),
  status text NOT NULL CHECK (status IN ('queued', 'processing', 'ready', 'error')),
  explanation jsonb,
  policy_version text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  generated_at timestamptz
);
CREATE INDEX IF NOT EXISTS reports_user_idx ON reports(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS dossiers (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  document_ids uuid[] NOT NULL,
  status text NOT NULL CHECK (status IN ('queued', 'processing', 'ready', 'error')),
  content jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  generated_at timestamptz
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('extract-document', 'generate-report', 'generate-dossier')),
  target_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('queued', 'running', 'done', 'failed')),
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Registro append-only: nessun UPDATE/DELETE concesso al ruolo applicativo.
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY,
  user_id uuid,
  actor text NOT NULL,
  action text NOT NULL,
  target text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ruolo applicativo senza privilegi di proprietario: la RLS si applica davvero.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_rls') THEN
    CREATE ROLE app_rls NOLOGIN;
  END IF;
END $$;
GRANT USAGE ON SCHEMA public TO app_rls;
GRANT SELECT, INSERT, UPDATE, DELETE ON users, magic_links, sessions, consents, documents, reports, dossiers, jobs TO app_rls;
GRANT SELECT, INSERT ON audit_log TO app_rls;
-- Il ruolo applicativo può aggiornare solo le colonne «proprie» di users: mai ruolo, 2FA, is_demo.
REVOKE UPDATE ON users FROM app_rls;
GRANT UPDATE (email, display_name, deleted_at, last_login_at) ON users TO app_rls;
-- Registro: ognuno legge solo le proprie voci; inserimento sempre consentito; mai UPDATE/DELETE.
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS audit_select_own ON audit_log;
CREATE POLICY audit_select_own ON audit_log FOR SELECT USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS audit_insert ON audit_log;
CREATE POLICY audit_insert ON audit_log FOR INSERT WITH CHECK (true);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;

-- NULLIF(current_setting(..., true), '') è NULL se non impostato o azzerato: nessuna riga visibile.
DROP POLICY IF EXISTS users_self ON users;
CREATE POLICY users_self ON users USING (id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS consents_owner ON consents;
CREATE POLICY consents_owner ON consents USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS documents_owner ON documents;
CREATE POLICY documents_owner ON documents USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS reports_owner ON reports;
CREATE POLICY reports_owner ON reports USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS dossiers_owner ON dossiers;
CREATE POLICY dossiers_owner ON dossiers USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS jobs_owner ON jobs;
CREATE POLICY jobs_owner ON jobs USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS sessions_owner ON sessions;
CREATE POLICY sessions_owner ON sessions USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS magic_links_owner ON magic_links;
CREATE POLICY magic_links_owner ON magic_links USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

INSERT INTO schema_migrations(version) VALUES (1) ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Schema v2 (Fase 3): ruoli e 2FA, ordini e pagamenti, lista d'attesa,
-- medici, casi di secondo parere. Tutto idempotente (IF NOT EXISTS).
-- ---------------------------------------------------------------------------

ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_secret text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled_at timestamptz;
-- Ultimo passo TOTP accettato: un codice già usato non vale una seconda volta.
ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_last_step bigint;
-- Vincolo sui consensi esteso (v3): dichiarazione sull'interessato e consenso per il secondo parere.
ALTER TABLE consents DROP CONSTRAINT IF EXISTS consents_kind_check;
ALTER TABLE consents ADD CONSTRAINT consents_kind_check CHECK (kind IN ('terms', 'privacy', 'health-data', 'marketing', 'subject-declaration', 'second-opinion'));
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS mfa_verified_at timestamptz;

-- Ordini: creati dall'utente, aggiornati dal sistema (webhook o pagamento simulato).
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service text NOT NULL CHECK (service IN ('essenziale', 'completo', 'secondo-parere')),
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'eur',
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  provider text NOT NULL CHECK (provider IN ('simulated', 'stripe-test', 'stripe-live')),
  provider_ref text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id, created_at DESC);

-- Eventi del fornitore di pagamento: idempotenza per id evento. Solo sistema.
CREATE TABLE IF NOT EXISTS payment_events (
  id uuid PRIMARY KEY,
  provider text NOT NULL,
  provider_event_id text NOT NULL UNIQUE,
  kind text NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  payload jsonb,
  received_at timestamptz NOT NULL DEFAULT now()
);

-- Lista d'attesa pubblica. Solo sistema (scrittura via API pubblica, lettura da admin).
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  interest text NOT NULL CHECK (interest IN ('completo', 'secondo-parere', 'strutture', 'archivio', 'visite', 'prevenzione')),
  organization text,
  note text,
  consent_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, interest)
);
-- Cura Privata (8/11/2026): liste d'attesa per i servizi in preparazione. Idempotente sui database esistenti.
ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS waitlist_interest_check;
ALTER TABLE waitlist ADD CONSTRAINT waitlist_interest_check CHECK (interest IN ('completo', 'secondo-parere', 'strutture', 'archivio', 'visite', 'prevenzione'));

-- Medici: profilo collegato a un utente con ruolo 'physician'. Verifica a carico dell'admin.
CREATE TABLE IF NOT EXISTS physicians (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  specialty text NOT NULL,
  registration_ref text,
  status text NOT NULL CHECK (status IN ('pending', 'verified', 'suspended')),
  verified_at timestamptz,
  verified_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Casi di secondo parere: il paziente vede i propri, il medico quelli assegnati a lui.
CREATE TABLE IF NOT EXISTS cases (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  physician_id uuid REFERENCES physicians(id) ON DELETE SET NULL,
  specialty text NOT NULL,
  question text NOT NULL,
  status text NOT NULL CHECK (status IN ('submitted', 'accepted', 'declined', 'answered', 'closed')),
  answer text,
  answer_hash text,
  decline_reason text,
  is_simulated boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  answered_at timestamptz
);
CREATE INDEX IF NOT EXISTS cases_user_idx ON cases(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS cases_physician_idx ON cases(physician_id, created_at DESC);

-- Storico append-only di ogni caso.
CREATE TABLE IF NOT EXISTS case_events (
  id uuid PRIMARY KEY,
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  actor_user_id uuid,
  kind text NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON orders TO app_rls;
GRANT SELECT ON physicians TO app_rls;
GRANT SELECT, INSERT, UPDATE ON cases TO app_rls;
GRANT SELECT, INSERT ON case_events TO app_rls;

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE physicians ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orders_owner ON orders;
CREATE POLICY orders_owner ON orders USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
-- Il paziente vede i propri casi; il medico (app.physician_id) solo quelli assegnati a lui.
DROP POLICY IF EXISTS cases_patient ON cases;
CREATE POLICY cases_patient ON cases USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS cases_physician ON cases;
CREATE POLICY cases_physician ON cases USING (physician_id IS NOT NULL AND physician_id = NULLIF(current_setting('app.physician_id', true), '')::uuid);
DROP POLICY IF EXISTS case_events_visible ON case_events;
CREATE POLICY case_events_visible ON case_events USING (EXISTS (SELECT 1 FROM cases c WHERE c.id = case_events.case_id)) WITH CHECK (EXISTS (SELECT 1 FROM cases c WHERE c.id = case_events.case_id));
-- I profili dei medici verificati sono leggibili (nome e specialità) da chi crea un caso.
DROP POLICY IF EXISTS physicians_public ON physicians;
CREATE POLICY physicians_public ON physicians USING (status = 'verified' OR user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

INSERT INTO schema_migrations(version) VALUES (2) ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Schema v3: file caricati (cifrati AES-256-GCM a livello applicativo) e
-- tracciabilità delle elaborazioni AI (solo metadati: modello, versione, token, esito).
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS document_files (
  document_id uuid PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mime_type text NOT NULL CHECK (mime_type IN ('application/pdf', 'image/jpeg', 'image/png', 'image/webp')),
  size_bytes integer NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 4194304),
  sha256 text NOT NULL,
  ciphertext bytea NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_runs (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id uuid NOT NULL,
  step text NOT NULL CHECK (step IN ('transcribe', 'structure', 'explain')),
  model text NOT NULL,
  prompt_version text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('ok', 'retried-ok', 'sanitized', 'rejected', 'refused', 'error')),
  input_tokens integer,
  output_tokens integer,
  issues jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ai_runs_created_idx ON ai_runs(created_at DESC);

GRANT SELECT, INSERT, DELETE ON document_files TO app_rls;
GRANT SELECT, INSERT ON ai_runs TO app_rls;
ALTER TABLE document_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS document_files_owner ON document_files;
CREATE POLICY document_files_owner ON document_files USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS ai_runs_owner ON ai_runs;
CREATE POLICY ai_runs_owner ON ai_runs USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

INSERT INTO schema_migrations(version) VALUES (3) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS rate_limits (
  key text NOT NULL,
  window_start timestamptz NOT NULL,
  count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);
-- Solo il sistema (ruolo proprietario) la usa: nessun permesso al ruolo applicativo.
INSERT INTO schema_migrations(version) VALUES (4) ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Schema v5 (pacchetto «Memorabile», 9/11/2026): tre servizi acquistabili.
--  * ordini collegati a un caso o a un appuntamento (ref_id) e servizio «videoconsulto»;
--  * il caso di secondo parere arriva al medico solo dopo il pagamento (awaiting_payment);
--  * appuntamenti di videoconsulto: richiesta → pagamento → conferma del medico → riepilogo.
-- ---------------------------------------------------------------------------
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ref_id uuid;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_service_check;
ALTER TABLE orders ADD CONSTRAINT orders_service_check CHECK (service IN ('essenziale', 'completo', 'secondo-parere', 'videoconsulto'));
CREATE INDEX IF NOT EXISTS orders_ref_idx ON orders(ref_id);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS awaiting_payment boolean NOT NULL DEFAULT false;
ALTER TABLE consents DROP CONSTRAINT IF EXISTS consents_kind_check;
ALTER TABLE consents ADD CONSTRAINT consents_kind_check CHECK (kind IN ('terms', 'privacy', 'health-data', 'marketing', 'subject-declaration', 'second-opinion', 'video-consult'));

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  physician_id uuid REFERENCES physicians(id) ON DELETE SET NULL,
  specialty text NOT NULL,
  reason text NOT NULL,
  -- Fasce orarie preferite: [{ "day": "2026-11-12", "window": "mattina" | "pomeriggio" | "sera" }]
  preferred_slots jsonb NOT NULL,
  document_ids uuid[] NOT NULL DEFAULT '{}',
  status text NOT NULL CHECK (status IN ('requested', 'confirmed', 'declined', 'completed', 'cancelled')),
  awaiting_payment boolean NOT NULL DEFAULT true,
  scheduled_at timestamptz,
  video_url text,
  summary text,
  summary_hash text,
  decline_reason text,
  is_simulated boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS appointments_user_idx ON appointments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS appointments_physician_idx ON appointments(physician_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE ON appointments TO app_rls;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS appointments_patient ON appointments;
CREATE POLICY appointments_patient ON appointments USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS appointments_physician ON appointments;
CREATE POLICY appointments_physician ON appointments USING (physician_id IS NOT NULL AND physician_id = NULLIF(current_setting('app.physician_id', true), '')::uuid);

INSERT INTO schema_migrations(version) VALUES (5) ON CONFLICT DO NOTHING;

-- Evoluzione v2 (11/11/2026): promozione «primo referto» una sola volta per cliente.
-- Si salva solo un'impronta (SHA-256) dell'email normalizzata, mai l'email: resta anche se l'account
-- viene cancellato, così la promozione non si riottiene ricreando l'account. Solo sistema (nessuna policy).
ALTER TABLE orders ADD COLUMN IF NOT EXISTS promo text;
CREATE TABLE IF NOT EXISTS promo_claims (
  email_hash text NOT NULL,
  promo text NOT NULL,
  order_id uuid,
  claimed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (email_hash, promo)
);
ALTER TABLE promo_claims ENABLE ROW LEVEL SECURITY;
INSERT INTO schema_migrations(version) VALUES (6) ON CONFLICT DO NOTHING;

-- Evoluzione v2: contatori aggregati del funnel pubblico (visita → CTA). Solo giorno, evento, conteggio:
-- nessun utente, nessun cookie, nessun indirizzo IP. Solo sistema.
CREATE TABLE IF NOT EXISTS funnel_daily (
  day date NOT NULL,
  event text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (day, event)
);
ALTER TABLE funnel_daily ENABLE ROW LEVEL SECURITY;
INSERT INTO schema_migrations(version) VALUES (7) ON CONFLICT DO NOTHING;

-- Ciclo 2, fase 2 (misurare la vetrina): gli stessi contatori anonimi, divisi per sorgente della visita
-- (elenco chiuso in src/domain/metrics/funnel.ts). Giorno, sorgente, evento, conteggio: niente altro. Solo sistema.
CREATE TABLE IF NOT EXISTS funnel_source_daily (
  day date NOT NULL,
  source text NOT NULL CHECK (source IN ('diretto', 'google', 'facebook', 'instagram', 'tiktok', 'whatsapp', 'email', 'medico', 'altro')),
  event text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (day, source, event)
);
ALTER TABLE funnel_source_daily ENABLE ROW LEVEL SECURITY;
-- Sorgente dell'iscrizione alla lista d'attesa (stesso elenco chiuso; vuota per le iscrizioni precedenti).
-- Ciclo 4 (12/11/2026): «Avvisami nella mia zona». Interesse per la visita a domicilio e CAP facoltativo
-- (solo 5 cifre: è una zona, non un indirizzo), per capire dove c'è domanda.
ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS waitlist_interest_check;
ALTER TABLE waitlist ADD CONSTRAINT waitlist_interest_check CHECK (interest IN ('completo', 'secondo-parere', 'strutture', 'archivio', 'visite', 'prevenzione', 'domicilio'));
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS cap text CHECK (cap IS NULL OR cap ~ '^[0-9]{5}$');
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS source text CHECK (source IS NULL OR source IN ('diretto', 'google', 'facebook', 'instagram', 'tiktok', 'whatsapp', 'email', 'medico', 'altro'));
INSERT INTO schema_migrations(version) VALUES (8) ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------------------
-- Schema v9 (13/11/2026): salute nel tempo e famiglia.
--  * family_profiles: i familiari di cui il titolare gestisce i referti, con la dichiarazione della base
--    (consenso, genitore di minore, tutela). Il titolare non ha una riga: è profile_id NULL.
--  * documents.profile_id: a chi appartiene il referto.
--  * reminders: visite, controlli da ripetere, altro. Le date le mette la persona.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS family_profiles (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 40),
  relation text NOT NULL CHECK (relation IN ('genitore', 'figlio', 'partner', 'nonno', 'altro')),
  birth_year integer CHECK (birth_year IS NULL OR (birth_year BETWEEN 1900 AND 2100)),
  basis text NOT NULL CHECK (basis IN ('consenso', 'genitore-minore', 'tutela')),
  basis_version text NOT NULL,
  basis_declared_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS family_profiles_user_idx ON family_profiles(user_id, created_at);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES family_profiles(id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES family_profiles(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('visita', 'controllo', 'altro')),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 80),
  due_date date NOT NULL,
  note text CHECK (note IS NULL OR char_length(note) <= 300),
  questions jsonb NOT NULL DEFAULT '[]',
  done_at timestamptz,
  email_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reminders_user_idx ON reminders(user_id, due_date);
CREATE INDEX IF NOT EXISTS reminders_due_idx ON reminders(due_date) WHERE done_at IS NULL AND email_sent_at IS NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON family_profiles, reminders TO app_rls;
ALTER TABLE family_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS family_profiles_owner ON family_profiles;
CREATE POLICY family_profiles_owner ON family_profiles USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);
DROP POLICY IF EXISTS reminders_owner ON reminders;
CREATE POLICY reminders_owner ON reminders USING (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid) WITH CHECK (user_id = NULLIF(current_setting('app.user_id', true), '')::uuid);

ALTER TABLE consents DROP CONSTRAINT IF EXISTS consents_kind_check;
ALTER TABLE consents ADD CONSTRAINT consents_kind_check CHECK (kind IN ('terms', 'privacy', 'health-data', 'marketing', 'subject-declaration', 'second-opinion', 'video-consult', 'family-delegation'));
ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS waitlist_interest_check;
ALTER TABLE waitlist ADD CONSTRAINT waitlist_interest_check CHECK (interest IN ('completo', 'secondo-parere', 'strutture', 'archivio', 'visite', 'prevenzione', 'domicilio', 'famiglia'));
INSERT INTO schema_migrations(version) VALUES (9) ON CONFLICT DO NOTHING;

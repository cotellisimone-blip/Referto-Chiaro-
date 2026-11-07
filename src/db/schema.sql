-- Referto Chiaro — schema v1 (PostgreSQL 16 / PGlite)
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
  kind text NOT NULL CHECK (kind IN ('terms', 'privacy', 'health-data', 'marketing')),
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

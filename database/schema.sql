-- =============================================================================
-- Profit Pulse — PostgreSQL schema (multi-tenant SaaS)
-- Version: 1.0.0
--
-- Isolation model:
--   1. Every business table has tenant_id NOT NULL → tenants(id)
--   2. Row Level Security (RLS) enforces tenant_id = current_setting('app.tenant_id')
--   3. Application MUST set tenant context per request:
--        SELECT set_config('app.tenant_id', '<uuid>', true);
--   4. All queries MUST filter by tenant_id even with RLS (defense in depth)
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'viewer');

CREATE TYPE account_status AS ENUM ('active', 'at-risk', 'churned');

CREATE TYPE compliance_status AS ENUM ('compliant', 'at-risk', 'non-compliant');

CREATE TYPE opportunity_stage AS ENUM (
  'lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'
);

CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'partial', 'paid', 'overdue');

CREATE TYPE payable_status AS ENUM ('scheduled', 'due', 'paid', 'overdue');

CREATE TYPE staffing_status AS ENUM ('active', 'planned', 'terminated');

CREATE TYPE risk_severity AS ENUM ('critical', 'high', 'medium', 'low');

CREATE TYPE risk_status AS ENUM ('open', 'mitigated', 'closed');

CREATE TYPE task_status AS ENUM ('open', 'in_progress', 'done');

CREATE TYPE task_priority AS ENUM ('high', 'medium', 'low');

-- -----------------------------------------------------------------------------
-- Core tenancy & auth
-- -----------------------------------------------------------------------------

CREATE TABLE tenants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ,
  CONSTRAINT tenants_slug_unique UNIQUE (slug)
);

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email           CITEXT NOT NULL,
  password_hash   TEXT,                    -- NULL until real auth is enabled
  role            user_role NOT NULL DEFAULT 'viewer',
  display_name    TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT users_tenant_email_unique UNIQUE (tenant_id, email)
);

CREATE TABLE sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash    TEXT NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at    TIMESTAMPTZ,
  CONSTRAINT sessions_token_hash_unique UNIQUE (token_hash)
);

-- One organization profile per tenant (maps to ProfitPulseState.organization)
CREATE TABLE organizations (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id               UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name                    TEXT NOT NULL,
  legal_name              TEXT NOT NULL DEFAULT '',
  industry                TEXT NOT NULL DEFAULT '',
  timezone                TEXT NOT NULL DEFAULT 'America/New_York',
  currency                CHAR(3) NOT NULL DEFAULT 'USD',
  cash_on_hand            NUMERIC(18, 2) NOT NULL DEFAULT 0,
  margin_threshold_pct    NUMERIC(5, 2) NOT NULL DEFAULT 20,
  runway_threshold_months NUMERIC(5, 2) NOT NULL DEFAULT 6,
  fiscal_year_start_month SMALLINT NOT NULL DEFAULT 1 CHECK (fiscal_year_start_month BETWEEN 1 AND 12),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT organizations_tenant_unique UNIQUE (tenant_id)
);

-- -----------------------------------------------------------------------------
-- CRM / operations (tenant-scoped)
-- -----------------------------------------------------------------------------

CREATE TABLE accounts (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id               UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name                    TEXT NOT NULL,
  contact_name            TEXT NOT NULL DEFAULT '',
  email                   TEXT NOT NULL DEFAULT '',
  phone                   TEXT NOT NULL DEFAULT '',
  state                   TEXT NOT NULL DEFAULT '',
  segment                 TEXT NOT NULL DEFAULT '',
  monthly_contract_value  NUMERIC(18, 2) NOT NULL DEFAULT 0,
  status                  account_status NOT NULL DEFAULT 'active',
  notes                   TEXT NOT NULL DEFAULT '',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT accounts_tenant_id_unique UNIQUE (tenant_id, id)
);

CREATE TABLE facilities (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  account_id            UUID NOT NULL,
  name                  TEXT NOT NULL,
  location              TEXT NOT NULL DEFAULT '',
  health_score          SMALLINT NOT NULL DEFAULT 75 CHECK (health_score BETWEEN 0 AND 100),
  compliance_status     compliance_status NOT NULL DEFAULT 'compliant',
  revenue_opportunity   NUMERIC(18, 2) NOT NULL DEFAULT 0,
  upsell_potential      NUMERIC(18, 2) NOT NULL DEFAULT 0,
  recommended_action    TEXT NOT NULL DEFAULT '',
  priority_rank         SMALLINT NOT NULL DEFAULT 5,
  last_inspection_date  DATE,
  risk_notes            TEXT NOT NULL DEFAULT '',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT facilities_tenant_id_unique UNIQUE (tenant_id, id),
  CONSTRAINT facilities_tenant_account_fk
    FOREIGN KEY (tenant_id, account_id) REFERENCES accounts(tenant_id, id) ON DELETE CASCADE
);

CREATE TABLE revenue (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  account_id    UUID,
  facility_id   UUID,
  record_date   DATE NOT NULL,
  category      TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  amount        NUMERIC(18, 2) NOT NULL CHECK (amount >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT revenue_tenant_account_fk
    FOREIGN KEY (tenant_id, account_id) REFERENCES accounts(tenant_id, id) ON DELETE SET NULL,
  CONSTRAINT revenue_tenant_facility_fk
    FOREIGN KEY (tenant_id, facility_id) REFERENCES facilities(tenant_id, id) ON DELETE SET NULL
);

CREATE TABLE expenses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  account_id    UUID,
  record_date   DATE NOT NULL,
  category      TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  amount        NUMERIC(18, 2) NOT NULL CHECK (amount >= 0),
  vendor        TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT expenses_tenant_account_fk
    FOREIGN KEY (tenant_id, account_id) REFERENCES accounts(tenant_id, id) ON DELETE SET NULL
);

CREATE TABLE opportunities (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  account_id          UUID NOT NULL,
  title               TEXT NOT NULL,
  stage               opportunity_stage NOT NULL DEFAULT 'lead',
  value               NUMERIC(18, 2) NOT NULL DEFAULT 0,
  probability         SMALLINT NOT NULL DEFAULT 25 CHECK (probability BETWEEN 0 AND 100),
  expected_close_date DATE,
  last_follow_up_date DATE,
  owner               TEXT NOT NULL DEFAULT '',
  notes               TEXT NOT NULL DEFAULT '',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT opportunities_tenant_account_fk
    FOREIGN KEY (tenant_id, account_id) REFERENCES accounts(tenant_id, id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- Phase 2 tables (same tenant isolation pattern)
-- -----------------------------------------------------------------------------

CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  account_id      UUID NOT NULL,
  invoice_number  TEXT NOT NULL,
  issue_date      DATE NOT NULL,
  due_date        DATE NOT NULL,
  amount          NUMERIC(18, 2) NOT NULL,
  amount_paid     NUMERIC(18, 2) NOT NULL DEFAULT 0,
  status          invoice_status NOT NULL DEFAULT 'draft',
  description     TEXT NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT invoices_tenant_account_fk
    FOREIGN KEY (tenant_id, account_id) REFERENCES accounts(tenant_id, id) ON DELETE CASCADE,
  CONSTRAINT invoices_tenant_number_unique UNIQUE (tenant_id, invoice_number)
);

CREATE TABLE payables (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  vendor        TEXT NOT NULL,
  due_date      DATE NOT NULL,
  amount        NUMERIC(18, 2) NOT NULL,
  category      TEXT NOT NULL DEFAULT '',
  status        payable_status NOT NULL DEFAULT 'scheduled',
  description   TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE staffing (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT '',
  department      TEXT NOT NULL DEFAULT '',
  monthly_cost    NUMERIC(18, 2) NOT NULL DEFAULT 0,
  fte             NUMERIC(5, 2) NOT NULL DEFAULT 1,
  start_date      DATE,
  status          staffing_status NOT NULL DEFAULT 'active',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- Indexes (tenant_id leading column on every business table)
-- -----------------------------------------------------------------------------

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_sessions_tenant_user ON sessions(tenant_id, user_id);
CREATE INDEX idx_accounts_tenant_id ON accounts(tenant_id);
CREATE INDEX idx_facilities_tenant_id ON facilities(tenant_id);
CREATE INDEX idx_facilities_tenant_account ON facilities(tenant_id, account_id);
CREATE INDEX idx_revenue_tenant_date ON revenue(tenant_id, record_date DESC);
CREATE INDEX idx_expenses_tenant_date ON expenses(tenant_id, record_date DESC);
CREATE INDEX idx_opportunities_tenant_stage ON opportunities(tenant_id, stage);
CREATE INDEX idx_invoices_tenant_status ON invoices(tenant_id, status);
CREATE INDEX idx_payables_tenant_due ON payables(tenant_id, due_date);
CREATE INDEX idx_staffing_tenant_dept ON staffing(tenant_id, department);

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_accounts_updated_at BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_facilities_updated_at BEFORE UPDATE ON facilities
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_revenue_updated_at BEFORE UPDATE ON revenue
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_opportunities_updated_at BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- Tenant context helpers (set per request / transaction)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION app_current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.tenant_id', true), '')::UUID;
EXCEPTION
  WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION app_set_tenant_id(p_tenant_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.tenant_id', p_tenant_id::TEXT, true);
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payables ENABLE ROW LEVEL SECURITY;
ALTER TABLE staffing ENABLE ROW LEVEL SECURITY;

-- Tenants: users only see their own tenant row
CREATE POLICY tenants_isolation ON tenants
  FOR ALL
  USING (id = app_current_tenant_id())
  WITH CHECK (id = app_current_tenant_id());

-- Standard tenant_id policy template
CREATE POLICY users_tenant_isolation ON users
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

CREATE POLICY sessions_tenant_isolation ON sessions
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

CREATE POLICY organizations_tenant_isolation ON organizations
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

CREATE POLICY accounts_tenant_isolation ON accounts
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

CREATE POLICY facilities_tenant_isolation ON facilities
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

CREATE POLICY revenue_tenant_isolation ON revenue
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

CREATE POLICY expenses_tenant_isolation ON expenses
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

CREATE POLICY opportunities_tenant_isolation ON opportunities
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

CREATE POLICY invoices_tenant_isolation ON invoices
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

CREATE POLICY payables_tenant_isolation ON payables
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

CREATE POLICY staffing_tenant_isolation ON staffing
  FOR ALL
  USING (tenant_id = app_current_tenant_id())
  WITH CHECK (tenant_id = app_current_tenant_id());

-- -----------------------------------------------------------------------------
-- Seed: Demo Company (optional — for local dev after migrate)
-- -----------------------------------------------------------------------------

-- INSERT INTO tenants (id, name, slug) VALUES
--   ('00000000-0000-4000-8000-000000000001', 'Demo Company', 'demo-company');

COMMIT;

# Profit Pulse — localStorage → PostgreSQL migration plan

## Overview

Migrate from browser `localStorage` (per-tenant JSON blobs) to a PostgreSQL-backed API **without changing the React UI or PM2/nginx deployment** in early phases. The frontend keeps working on localStorage until an explicit cutover flag enables the API client.

## Architecture target

```
Browser (healthcast SPA)
    ↓ HTTPS /api/*
nginx → api-server (Express)
    ↓ set_config('app.tenant_id', …)
PostgreSQL (RLS + tenant_id on all rows)
```

## Phases

### Phase 0 — Structure only (current)

- [x] `database/schema.sql` — tables, FKs, indexes, RLS
- [x] `artifacts/api-server/src/profit-pulse/` — routes, repositories, mock adapters
- [x] `lib/db/src/schema/profit-pulse/` — Drizzle mirror (not wired to runtime)
- [ ] No `DATABASE_URL` required for production SPA

**Exit criteria:** `pnpm --filter @workspace/api-server run typecheck` passes; schema applies cleanly to empty Postgres.

---

### Phase 1 — Database provision (no app cutover)

1. Create RDS / local Postgres instance (private subnet; no public exposure).
2. Apply schema:
   ```bash
   psql "$DATABASE_URL" -f database/schema.sql
   ```
3. Create app DB role with RLS enforced:
   ```sql
   CREATE ROLE profitpulse_app LOGIN PASSWORD '…';
   GRANT CONNECT ON DATABASE profitpulse TO profitpulse_app;
   GRANT USAGE ON SCHEMA public TO profitpulse_app;
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO profitpulse_app;
   ```
4. Add `DATABASE_URL` to api-server only (not committed; use `.env.example`).
5. Implement `repositories/postgres/*` using Drizzle + `app_set_tenant_id()` per transaction.

**Exit criteria:** Integration tests prove cross-tenant reads return zero rows.

---

### Phase 2 — Dual-write / export migration script

1. Build `scripts/migrate-localStorage-to-pg.ts`:
   - Read `profit-pulse-auth-v1` → `tenants`, `users`
   - Read `profit-pulse-v1:{tenantId}` → normalize into relational rows
   - Map string IDs (`acc_*`, `fac_*`) → UUIDs via deterministic mapping table
2. Run once per tenant during maintenance window.
3. Optional dual-write in API: write Postgres + return same shape to client.

**Exit criteria:** Row counts match localStorage export; dashboard metrics reconcile within rounding.

---

### Phase 3 — API cutover (read path)

1. Add `VITE_API_BASE_URL` to healthcast build.
2. Introduce `ProfitPulseApiProvider` that implements same context interface as `ProfitPulseProvider`.
3. Feature flag: `localStorage` fallback if API unreachable.
4. Wire auth: replace mock JWT with api-server session cookie / Bearer token.

**Exit criteria:** Login → data loads from API; refresh persists; viewer RBAC enforced server-side.

---

### Phase 4 — Write path & decommission localStorage

1. All mutations go through API (`POST/PATCH/DELETE`).
2. Remove `saveState()` persistence from browser (keep export-only).
3. Deprecate `profit-pulse-v1:*` keys after 30-day backup retention.

**Exit criteria:** No business data in localStorage; PM2/nginx unchanged; port 3010 internal only.

---

## Data mapping (localStorage → SQL)

| localStorage | PostgreSQL |
|--------------|------------|
| `profit-pulse-auth-v1.tenants[]` | `tenants` |
| `profit-pulse-auth-v1.users[]` | `users` |
| `organization` | `organizations` (1:1 per tenant) |
| `accounts[]` | `accounts` |
| `facilities[]` | `facilities` |
| `revenueRecords[]` | `revenue` |
| `expenseRecords[]` | `expenses` |
| `opportunities[]` | `opportunities` |
| `invoices[]` | `invoices` (phase 2) |
| `payables[]` | `payables` (phase 2) |
| `staffing[]` | `staffing` (phase 2) |

## Tenant isolation rules (enforced at query level)

1. **JWT/session** must include `tenantId` — reject if missing.
2. **Middleware** calls `app_set_tenant_id(tenantId)` before any repository method.
3. **Repositories** always include `WHERE tenant_id = $ctx.tenantId` (even with RLS).
4. **Composite FKs** `(tenant_id, account_id)` prevent cross-tenant references.
5. **Integration tests**: user A token cannot read/update tenant B rows (expect 404/empty).

## Rollback plan

- Phase 3+: keep JSON export/import in Integrations page.
- If API fails, flip `VITE_DATA_SOURCE=local` and rebuild SPA.
- Postgres snapshots before each migration batch.

## Environment variables (future)

| Variable | Scope | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | api-server | Postgres connection |
| `SESSION_SECRET` | api-server | Sign session tokens |
| `VITE_API_BASE_URL` | healthcast build | `/api` origin |

Do **not** add these to PM2 profitpulse preview until Phase 3.

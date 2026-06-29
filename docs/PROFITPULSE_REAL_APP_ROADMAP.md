# Profit Pulse — Real App Production Roadmap

**Last updated:** 2026-06-29  
**Repo:** `contractorcomplianceco-cmyk/profitpulse`  
**Production host:** `https://demo.ccaprofitpulse.com` (EC2 + nginx + PM2)  
**App package:** `@workspace/healthcast` (`artifacts/healthcast/`)

This document describes what is **real today**, what is still **mock/client-side**, and the phased path to a **paid, multi-tenant production SaaS**.

Related docs:

- `deploy/README.md` — nginx, TLS, PM2
- `database/MIGRATION.md` — Postgres cutover phases
- `database/schema.sql` — target DDL + RLS
- `docs/PRICING.md` — tiers and feature gates
- `docs/PUBLIC-DEMO-ROUTE.md` — public `/demo` walkthrough
- `artifacts/api-server/src/profit-pulse/README.md` — API layer status

---

## 1. Current state

Profit Pulse is a **fully built React SPA** deployed as static assets behind nginx. The running production instance serves:

| Layer | Status |
|-------|--------|
| **Public video demo** (`/demo`) | Live — cinematic walkthrough, no login, sample scenes only |
| **Main workspace** (`/`, `/cash-flow`, …) | Live UI — requires login via client-side `AuthGate` |
| **HTTPS** | Live — Let's Encrypt on `demo.ccaprofitpulse.com` |
| **PM2** | `profitpulse` on `127.0.0.1:3010` (not publicly exposed) |
| **PostgreSQL** | Schema designed; **not connected** to runtime |
| **api-server** | Routes scaffolded; **mock in-memory** store only |
| **Stripe** | UI + local flags only; **no billing provider** |
| **Email** | **No outbound mail**; invites are local records only |

**Architecture today:**

```
Browser
  → nginx :443 (demo.ccaprofitpulse.com)
  → vite preview :3010 (127.0.0.1)
  → React SPA
       ├─ /demo          → DemoWalkthrough (public, hardcoded scenes)
       └─ workspace       → AuthGate → ProfitPulseProvider
                              ↓
                         localStorage (auth, billing, financial data, audit)
```

There is **no server-side source of truth** for tenant data yet. A fresh browser or cleared storage resets to seeded demo state.

---

## 2. What is real today

These are implemented, deployed, and reproducible from GitHub (`main`):

### Infrastructure & deploy

- nginx reverse proxy + TLS (certbot-managed)
- PM2 process manager with localhost-only upstream
- Build pipeline: `pnpm --filter @workspace/healthcast run build`
- Deploy docs and nginx config in repo (`deploy/`)

### Product UI (18+ workspace views)

- Executive Overview, Cash Flow, Revenue, Profitability, AR/AP, Pipeline, Staffing, Scenarios, Facility Intelligence, Integrations, Settings, etc.
- Calculations, alerts, sparklines, and CRUD tables wired to in-memory/local state
- Responsive layout, sidebar nav, tenant switcher UI

### Public client demo (video-first)

- `/demo` and `/#/demo` — public, bypasses auth
- Seven-scene Rose walkthrough with captions, scene controls, optional audio
- Muted preview by default; audio on user click (no unmuted autoplay)
- “Enter Demo” entry points across marketing and in-app chrome

### Auth & RBAC (client-side)

- Login / logout / session pages
- Roles: `admin`, `manager`, `viewer`
- Permission checks in `src/auth/permissions.ts`
- Multi-tenant registry with tenant switcher
- `AuthGate` redirects unauthenticated users to `/auth/login`

### Billing & feature gates (client-side)

- Tiers: Free, Pro, Enterprise (`docs/PRICING.md`)
- `FeatureGate`, `RouteFeatureGate`, usage counters
- Billing page with plan display and upgrade prompts

### Team, audit, invites (client-side)

- Team page — list users, create/revoke invitations (local)
- Audit log — append-only events in localStorage
- Invite tokens generated locally; accept-on-login by email match

### API & database (structure only)

- Express routes under `/api/profit-pulse/*` with mock repositories
- `database/schema.sql` + `schema-saas.sql` with RLS policies
- `database/MIGRATION.md` phased cutover plan
- Drizzle schema mirror (not wired to runtime)

---

## 3. What is still mock / client-side

| Domain | Storage / behavior | Production gap |
|--------|-------------------|----------------|
| **Financial data** | `localStorage` key `profit-pulse-v1:{tenantId}` | No shared DB; data lost on clear/export only |
| **Auth users & passwords** | `profit-pulse-auth-v1` | Login accepts known emails; **password not verified server-side** |
| **Sessions / JWT** | `profit-pulse-session` | Mock JWT signed in browser (`HS256-mock`); not revocable server-side |
| **Billing / subscriptions** | `profit-pulse-billing-v1` | Tier changes are local; no payment, no webhooks |
| **Audit log** | `profit-pulse-audit-v1` | Not tamper-evident; capped at 500 entries/tenant |
| **Invitations** | Embedded in auth registry | No email sent; token not validated via HTTPS link |
| **Integrations** | UI placeholders | No OAuth to Zoho, Google Ads, Meta, etc. |
| **AI CFO Copilot** | Illustrative UI | No LLM backend or tenant-scoped prompts |
| **api-server** | In-memory mock store | Postgres repos are stubs; not mounted in production nginx |
| **Email / notifications** | None | No transactional mail provider |

**Implication:** Two users on different browsers do not share data. An admin cannot enforce security policy beyond what the SPA checks in JavaScript (bypassable).

---

## 4. Demo mode vs production app

| | **Public video demo** (`/demo`) | **Workspace app** (`/`, gated routes) | **Standalone demo build** (`VITE_DEMO_MODE=1`) |
|--|--------------------------------|--------------------------------------|-----------------------------------------------|
| **Purpose** | Client-facing video walkthrough | Operator workspace (target: real SaaS) | Sales sandbox with sample data |
| **Login** | Never required | Required (`AuthGate`) | Lead funnel optional; ribbon CTAs |
| **Data** | Hardcoded scenes in `src/demo/scenes/*` | localStorage per tenant | Same as workspace + demo ribbon |
| **Audio** | Optional MP3s under `public/demo/` | N/A | Same popup/video patterns on landing |
| **Billing gates** | N/A | Enforced client-side | Enforced client-side |
| **Deploy** | Same bundle on `demo.ccaprofitpulse.com` | Same host, hash routes | Separate build artifact (`build:demo`) — not current PM2 deploy |

**Rule (client demos):** Video walkthrough first → **Enter Demo** → `/demo`. Booking/contact copy only on pages that actually capture leads (`/request-demo`, marketing CTAs to `ccaprofitpulse.com`).

**Production app** on the current host is the **same SPA** as the demo host; there is not yet a separate “production domain” with server-backed auth and Postgres.

---

## 5. Auth production gaps

| Gap | Today | Target |
|-----|-------|--------|
| Password verification | Any password for seeded emails | bcrypt/argon2 via api-server |
| Session storage | Browser localStorage | HttpOnly secure cookie or short-lived JWT + refresh rotation |
| Session revocation | Not possible | Server session table + logout invalidates token |
| Tenant isolation | Client filters by `tenantId` | RLS + middleware enforces on every query |
| Signup / self-serve | Limited / demo seed users | Registration flow with email verification |
| MFA | None | TOTP or SSO for Enterprise |
| Brute-force protection | None | Rate limiting, lockout, CAPTCHA on login |
| OAuth / SSO | None | Optional Google/Microsoft for Enterprise |
| Invite acceptance | Email match on login | Signed invite URL → set password → join tenant |
| RBAC enforcement | UI + client checks only | Duplicate checks in api-server middleware |
| Audit of auth events | Client audit log | Server-persisted auth audit (login, fail, role change) |

**Minimum viable auth (Phase A):** api-server login → Postgres `users` + `sessions` → HttpOnly cookie → SPA reads session from `/api/profit-pulse/auth/session`.

---

## 6. Billing production gaps

| Gap | Today | Target |
|-----|-------|--------|
| Payment collection | None | Stripe Checkout / Customer Portal |
| Subscription state | localStorage flags | Stripe Subscription + webhook sync to `tenant_subscriptions` |
| Trial management | Client-side dates | Stripe trial + `billingStatus: trialing` |
| Usage metering | Client counters | Server-side usage table; enforce on API write |
| Feature gates | Client-only (`FeatureGate`) | API returns 403 + UI hides routes |
| Invoices / receipts | None | Stripe invoices + optional PDF email |
| Plan changes | Instant local tier bump | Proration via Stripe |
| Enterprise / custom | Manual local flag | Sales-assisted Stripe custom price or invoice |
| Tax / compliance | None | Stripe Tax or manual |
| Dunning / past_due | UI state only | Webhook → restrict writes, notify admin |

See `docs/PRICING.md` for tier matrix. **Do not charge paid clients** until Stripe webhooks update server state and API enforces limits.

---

## 7. Postgres / API cutover plan

Follow `database/MIGRATION.md`. Summary:

### Phase 0 — Structure (done)

- Schema SQL, API route skeleton, mock repos, Drizzle mirror

### Phase 1 — Database provision

- RDS Postgres (private subnet) or managed instance
- Apply `database/schema.sql`; create `profitpulse_app` role with RLS
- `DATABASE_URL` on api-server only (never in git)
- Implement `repositories/postgres/*` with `app_set_tenant_id()` per transaction

### Phase 2 — Migration tooling

- Script: export localStorage → normalize → bulk insert
- Reconcile row counts and dashboard metrics per tenant

### Phase 3 — Read cutover

- `VITE_API_BASE_URL` in healthcast build
- nginx `location /api/` → api-server (new PM2 process or shared host)
- `ProfitPulseApiProvider` implements same interface as current provider
- Auth: session cookie from api-server replaces mock JWT

### Phase 4 — Write cutover & decommission localStorage

- All mutations via API
- Remove `saveState()` persistence; optional export-only
- 30-day retention of localStorage backups then deprecate keys

**Exit criteria for “real app”:** Login on device A → data visible on device B; viewer cannot mutate via DevTools bypass.

---

## 8. Stripe plan

1. **Stripe account** — CCA Profit Pulse product; test mode first on staging subdomain.
2. **Products & prices** — Map Free / Pro / Enterprise to Stripe Price IDs (see `docs/PRICING.md`).
3. **Checkout** — “Upgrade” on Billing page → Stripe Checkout Session (mode: subscription).
4. **Customer Portal** — Manage payment method, cancel, view invoices.
5. **Webhooks** (api-server endpoint, signature verified):
   - `checkout.session.completed`
   - `customer.subscription.created|updated|deleted`
   - `invoice.paid|payment_failed`
6. **DB sync** — Update `tenant_subscriptions` (or billing columns on `tenants`) from webhook events idempotently.
7. **Enforcement** — Middleware reads subscription tier before CRUD; align with `src/billing/features.ts`.
8. **Go-live** — Switch to live keys via env; smoke test one real $0 trial + one Pro subscription.

**Not in scope for MVP:** Usage-based billing, multi-currency, reseller revenue share.

---

## 9. Email invite plan

1. **Provider** — SendGrid, AWS SES, or Postmark (domain DKIM on `ccaprofitpulse.com`).
2. **Templates**
   - Team invite: “{inviter} invited you to {tenant} on Profit Pulse”
   - Password reset (when real auth lands)
   - Billing: payment failed, trial ending
3. **Invite flow**
   - Admin creates invite → api-server persists `invitations` row + sends email
   - Link: `https://{app-host}/auth/accept-invite?token=…`
   - Accept page: validate token, set password, create `users` row, join tenant
   - Revoke / expire: 7-day TTL (match current client default)
4. **Security** — Single-use token, hashed at rest, rate limit invite creation
5. **Observability** — Log send failures; admin resend action

Until email is live, **do not market self-serve team invites** to paying customers.

---

## 10. Security hardening

| Area | Action |
|------|--------|
| **Secrets** | `.env` gitignored; use SSM/Secrets Manager in production; rotate DB and Stripe keys |
| **Transport** | HTTPS only (done); HSTS header via nginx |
| **Cookies** | `Secure`, `HttpOnly`, `SameSite=Lax` for session |
| **CORS** | Restrict api-server to app origin |
| **CSP** | Content-Security-Policy on nginx for SPA |
| **Rate limiting** | nginx `limit_req` on `/api/profit-pulse/auth/*` |
| **Input validation** | Zod on all api-server bodies; parameterized SQL only |
| **RLS** | Mandatory on Postgres; integration tests for cross-tenant leakage |
| **Dependency audit** | `pnpm audit` in CI; pin critical packages |
| **Headers** | `X-Frame-Options`, `X-Content-Type-Options`, strip server tokens |
| **Backups** | Encrypted RDS snapshots; test restore quarterly |
| **Access** | SSH key only; no public port 3010; least-privilege IAM |
| **Compliance** | Document data retention; audit log immutability for Enterprise |

---

## 11. Backup & monitoring

### Backups

| Asset | Method | RPO target |
|-------|--------|------------|
| Postgres | RDS automated snapshots + PITR | ≤ 15 min (when live) |
| App config | Git (`main`) + tagged releases | N/A |
| TLS certs | certbot auto-renewal | N/A |
| localStorage (transition) | Export script during migration window | Per-tenant manual |

### Monitoring (minimum)

- **Uptime** — HTTP 200 on `https://demo.ccaprofitpulse.com/` and `/demo`
- **PM2** — `pm2 status`, restart alerts (CloudWatch or UptimeRobot)
- **nginx** — access/error log rotation; 5xx alert threshold
- **api-server** (when live) — health `/api/health`, latency p95, error rate
- **Postgres** — connections, CPU, storage, replication lag
- **Stripe** — webhook failure dashboard
- **On-call** — Runbook in repo (`docs/ops/` TBD): restart PM2, renew cert, rollback deploy

---

## 12. MVP launch phases

### Phase 1 — **Demo & sales ready** (current → complete)

- [x] Public HTTPS demo at `/demo`
- [x] Video-first “Enter Demo” UX
- [x] Reproducible deploy from GitHub
- [ ] Record master `narration.mp3` (optional; per-scene audio works)
- [ ] Separate marketing domain vs app domain (optional branding)

**Outcome:** Rose / Command Center can send prospects to the walkthrough safely.

---

### Phase 2 — **Authenticated beta** (internal + design partners)

- [ ] Postgres provisioned; schema applied
- [ ] api-server on PM2 behind nginx `/api/`
- [ ] Real login (password hash, server sessions)
- [ ] Read/write financial data via API for one pilot tenant
- [ ] Migration script from localStorage for pilot data
- [ ] Basic monitoring + backup verified

**Outcome:** 3–5 design partners on shared server-backed data; no payment yet.

---

### Phase 3 — **Paid MVP**

- [ ] Stripe Checkout + webhooks
- [ ] Server-enforced feature gates and usage limits
- [ ] Email invites live
- [ ] Audit log in Postgres
- [ ] Security review (pen test lite or checklist)
- [ ] Terms of service + privacy policy published
- [ ] Support channel (email / help desk)

**Outcome:** Pro tier self-serve signup, payment, and onboarding without manual localStorage setup.

---

### Phase 4 — **Production scale**

- [ ] Integrations (Zoho Books/CRM first)
- [ ] SSO / MFA for Enterprise
- [ ] Multi-region or read replicas (if needed)
- [ ] SOC2-aligned controls (if required by clients)
- [ ] White-label deploy path for Enterprise

---

## 13. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Client-side auth bypass** | Data exposure, false sense of security | Block paid launch until API + RLS enforce RBAC |
| **localStorage data loss** | Customer data gone on browser clear | Postgres cutover before paid clients |
| **Single EC2 host** | Downtime on instance failure | Phase 4: ASG + RDS; interim: snapshot AMI |
| **Mock JWT in production** | Session forgery | Replace before external beta |
| **Stripe webhook misconfig** | Paid users stuck on Free tier | Idempotent webhook handler + reconciliation job |
| **No email delivery** | Invites silently fail | Provider dashboards + bounce handling |
| **Demo host = app host** | Confusion (`demo.` subdomain) | Later: `app.ccaprofitpulse.com` for workspace |
| **Large JS bundle** | Slow first load | Code-splitting post-MVP |
| **Integration scope creep** | Delays MVP | Zoho-only first; ads platforms Phase 4 |
| **Cert / DNS drift** | Outage | Monitor expiry; document Zoho DNS ownership |

---

## 14. What must be done before paid clients

**Hard blockers (non-negotiable):**

1. **Server-backed auth** — real passwords, server sessions, logout revocation
2. **PostgreSQL** — all tenant data in DB with RLS; no production reliance on localStorage
3. **api-server in production** — nginx `/api/` proxy; CRUD through repositories
4. **Stripe live** — checkout, webhooks, tier sync, failed payment handling
5. **Server-side feature enforcement** — API rejects over-limit writes (facilities, scenarios, users)
6. **Email invites** — transactional delivery + accept-invite flow
7. **Audit log persistence** — server-stored, tenant-scoped, admin-readable
8. **Legal** — Terms, Privacy, refund policy; Stripe tax settings if applicable
9. **Backup & restore tested** — RDS snapshot restore drill documented
10. **Security baseline** — HTTPS (done), secrets out of git (done), rate limits, cookie flags

**Strongly recommended before first invoice:**

- Staging environment mirroring production
- Error tracking (Sentry or similar)
- Admin runbook for support (password reset, tier override, tenant export)
- Onboarding checklist for new tenants (empty state, not demo seed data)
- Remove or disable default demo credentials (`admin@demo.com`) on production app host

**Safe to sell today (no paid workspace):**

- Public **Enter Demo** video walkthrough at `https://demo.ccaprofitpulse.com/demo`
- Sales-led pilots with explicit “beta / local data” disclaimer
- Command Center links to public demo URL

---

## Document maintenance

Update this roadmap when:

- Postgres or Stripe cutover phases complete
- Production domain changes from `demo.ccaprofitpulse.com`
- New integrations ship or MVP scope changes
- First paying customer onboarded (mark Phase 3 complete)

**Owners (TBD):** Engineering — api-server + DB; Product — tiers + demo; Ops — nginx/PM2/monitoring.

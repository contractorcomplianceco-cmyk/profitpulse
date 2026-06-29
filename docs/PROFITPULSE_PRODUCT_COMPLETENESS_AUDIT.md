# Profit Pulse — Product Completeness Audit

**Date:** 2026-06-29  
**Audience:** Rose / CCA leadership — “the financial app looks like it is missing a lot”  
**Scope:** `@workspace/healthcast` (`artifacts/healthcast/`) as a **real financial operations / profit intelligence app**, not the public video demo alone  
**Repo:** `contractorcomplianceco-cmyk/profitpulse`  
**Production:** `https://demo.ccaprofitpulse.com` (SPA + PM2 + nginx; no Postgres in runtime path)

Related: [`PROFITPULSE_REAL_APP_ROADMAP.md`](./PROFITPULSE_REAL_APP_ROADMAP.md), [`ROSE-DEMO-INVENTORY.md`](./ROSE-DEMO-INVENTORY.md), [`PRICING.md`](./PRICING.md)

---

## Executive summary

Profit Pulse **looks like a large SaaS** (25+ sidebar modules, charts, CRUD tables, auth, billing tiers, audit log) but is **architecturally a client-side prototype**:

- Financial truth lives in **`localStorage` per browser per tenant**, seeded on first load.
- **~12 workspace pages** compute meaningful metrics from that store; **~13 pages** are mostly **static mock dashboards** (`src/data/*`) that do not read user data.
- Several “hybrid” pages show **mock KPIs/charts above live CRUD tables below** — numbers often **do not reconcile**, which reads as “missing” or broken.
- There is **no production backend** wired to the deployed SPA; api-server routes exist as **mock stubs** only.
- The **public `/demo`** is a separate cinematic walkthrough (contractor-flavored copy) and is **not** the same data model as the workspace.

**Rose is likely reacting to:** breadth of navigation vs shallow data wiring, healthcare-compliance seed data vs contractor profit narrative, empty-feeling modules (Copilot, Briefing, Reports, Marketing ROI), and the lack of job/project profitability — the core object for contractor operators.

---

## 1. What exists today

### 1.1 Routes / pages

Hash-router (`wouter` + `useHashLocation`). Public routes bypass `AuthGate`.

| Route | Page | Auth | Tier gate |
|-------|------|------|-----------|
| `/demo`, `/demo/` | `DemoWalkthrough` | **Public** | — |
| `/landing` | `Landing` | Public (demo funnel) | — |
| `/request-demo` | `RequestDemo` | Public | — |
| `/buy` | `BuyNow` | Public | — |
| `/signup` | `SignUp` | Public | — |
| `/auth/login` | `Login` | Public | — |
| `/auth/logout` | `Logout` | Public | — |
| `/auth/session` | `Session` | Public | — |
| `/welcome` | `Welcome` | Gated | — |
| `/` | `ExecutiveOverview` | Gated | Free |
| `/cash-flow` | `CashFlow` | Gated | Free |
| `/revenue-intelligence` | `RevenueIntelligence` | Gated | Free |
| `/profitability` | `Profitability` | Gated | Pro |
| `/cash-calendar` | `CashCalendar` | Gated | Pro |
| `/ar-ap-collections` | `ArApCollections` | Gated | Pro |
| `/marketing-roi` | `MarketingRoi` | Gated | Pro |
| `/sales-pipeline` | `SalesPipeline` | Gated | Pro |
| `/staffing-payroll` | `StaffingPayroll` | Gated | Pro |
| `/department-performance` | `DepartmentPerformance` | Gated | Enterprise |
| `/client-profitability` | `ClientProfitability` | Gated | Enterprise |
| `/historical-trends` | `HistoricalTrends` | Gated | Pro |
| `/market-economy` | `MarketEconomy` | Gated | Enterprise |
| `/futurecast` | `Futurecast` | Gated | Pro |
| `/scenario-builder` | `ScenarioBuilder` | Gated | Pro |
| `/goals` | `GoalsOkrs` | Gated | Enterprise |
| `/facility-intelligence` | `FacilityIntelligence` | Gated | Pro |
| `/compliance` | `ComplianceRisk` | Gated | Enterprise |
| `/alerts` | `Alerts` | Gated | Free |
| `/daily-briefing` | `DailyBriefing` | Gated | Pro |
| `/reports` | `Reports` | Gated | Pro |
| `/integrations` | `Integrations` | Gated | Pro |
| `/copilot` | `CfoCopilot` | Gated | Enterprise |
| `/settings` | `WhiteLabelSettings` | Gated (admin) | Enterprise |
| `/team` | `Team` | Gated (admin) | Enterprise |
| `/audit` | `AuditLog` | Gated (admin) | Pro |
| `/billing` | `Billing` | Gated (admin) | — |

**Total:** 7 public/marketing/auth routes + 1 public video demo + **27 gated workspace routes**.

### 1.2 Sidebar modules (`SidebarNav.tsx`)

Six sections, **31 nav items** (including marketing/demo entry points):

| Section | Items |
|---------|--------|
| **Overview** | Welcome, Executive Overview, AI CFO Copilot, Enter Demo, Marketing Site, White-Label Settings, Team & Invites, Audit Log, Plans & Billing |
| **Financials** | Cash Flow, Cash Calendar, Revenue Intelligence, Profitability, AR/AP & Collections |
| **Growth & Sales** | Marketing ROI, Sales Pipeline |
| **Operations** | Staffing & Payroll, Department Performance, Client Profitability |
| **Intelligence & Planning** | Historical Trends, Market & Economy, Futurecast, Scenario Modeler, Goals & OKRs |
| **Governance** | Facility Intelligence, Compliance & Risk, Alerts, Daily Briefing, Reports & Exports, Integrations |

Filtered by **RBAC** (admin-only settings/team/audit/billing) and **subscription tier** (`ROUTE_FEATURE_MAP` in `billing/tiers.ts`).

### 1.3 Data models / types

**Core financial state** — `src/lib/profit-pulse/types.ts` → `ProfitPulseState`:

| Entity | Purpose |
|--------|---------|
| `OrganizationSettings` | Org name, cash on hand, margin/runway thresholds, fiscal year |
| `Account` | Client/customer account |
| `Facility` | Site/location under account (healthcare compliance framing) |
| `RevenueRecord` | Revenue line items |
| `ExpenseRecord` | Expense line items |
| `Invoice` | AR invoices |
| `PayableBill` | AP bills |
| `StaffingRecord` | Payroll / headcount cost |
| `Opportunity` | Sales pipeline deal |
| `RiskRecord` | Risk register |
| `Task` | Action items |
| `ScenarioAssumptions` / `SavedScenario` | Scenario modeler |

**Computed types:** `DashboardMetrics`, `ComputedAlert`, `ScenarioProjection`, `CsvImportResult`.

**Auth / SaaS types** — `src/auth/types.ts`: `Tenant`, `User`, `TenantMembership`, `UserInvitation`, `SessionPayload`, `AuditLogEntry`, `AuthRegistry`.

**Billing types** — `src/billing/types.ts`: `SubscriptionTier`, `FeatureKey`, `TierLimits`, usage metrics.

**Not modeled (gap for contractor Profit Pulse):**

- **Job / project / work order** (demo narration references jobs; app has no `Job` entity)
- **Budget** / budget lines / budget vs actual
- **Chart of accounts** / GL codes
- **Cost codes**, change orders, WIP
- **Vendor master** (vendor is a string on expenses)
- **Payroll runs** (only monthly staffing aggregates)
- **Document attachments**, comments, approvals

### 1.4 Mock / localStorage stores

| Key | Contents |
|-----|----------|
| `profit-pulse-v1:{tenantId}` | Full `ProfitPulseState` (financial data) |
| `profit-pulse-auth-v1` | Tenants, users, memberships, invitations |
| `profit-pulse-session` | Mock JWT session + refresh tokens |
| `profit-pulse-billing-v1` | Tier, usage counters, subscription flags |
| `profit-pulse-audit-v1` | Audit entries (cap ~500/tenant) |
| `pp_demo_banner_dismissed` | UI preference |
| `pp_demo_popup_dismissed` | Demo funnel |
| `pp_tour_started` | Guided tour |
| `pp_onboarding_checklist` | Onboarding checklist |

**Seed data:** `lib/profit-pulse/seed.ts` — healthcare compliance contractor (CCA Holdings, senior care / hospital accounts, facilities). **Not** aligned with Rose demo’s generic contractor job language.

**Static mock modules** — `src/data/*.ts` (17 files): `overviewData`, `revenueData`, `cashFlowData`, `profitabilityData`, `arApData`, `pipelineData`, `staffingData`, `departmentsData`, `clientsData`, `marketingData`, `historyData`, `economyData`, `scenariosData`, `goalsData`, `briefingData`, `complianceData`, `copilotData`, `reportsData`, `integrationsData`, `cashCalendarData`, `onboardingData`, `alertsData` (legacy).

### 1.5 Auth, tenant, billing, audit, invites

| Feature | Implementation | Production-ready? |
|---------|----------------|-----------------|
| **Login / logout** | `AuthProvider`, `auth/session.ts` — accepts seeded emails; **password not verified** | No |
| **Session** | Mock HS256 JWT in browser | No |
| **Roles** | `admin`, `manager`, `viewer` — `canWrite`, `canAccessSettings` | Client-only |
| **Multi-tenant** | 2 seeded tenants (Demo Company, Acme Healthcare); `TenantSwitcher` | UI only |
| **Invites** | `Team` page + `auth/invitations.ts` — local tokens, accept on email match | No email sent |
| **Audit log** | `appendAuditLog` on CRUD/import/export; `AuditLog` page | Tamperable, local |
| **Billing** | Free / Pro / Enterprise; `FeatureGate`, usage limits | No Stripe/webhooks |
| **RBAC on routes** | `withFeatureGate`, sidebar filter | Bypassable in DevTools |

**Demo accounts (login page):** `admin@demo.com`, `manager@demo.com`, `viewer@demo.com` (any password).

### 1.6 Charts, tables, cards

**Shared chart components:** `DonutChart`, `GaugeChart`, `FunnelChart`, `TrendLine`, `Sparkline` + widespread **Recharts** (`BarChart`, `AreaChart`, `PieChart`, etc.).

**Dashboard building blocks:** `KpiCard`, `ChartCard`, `InsightCard`, `RiskWarning`, `RecommendedAction`, `AlertBadge`, `PageHeader`, `ExecutiveKpiCard`, `EntityCrudTable`, `LiveDataBanner`, `HealthScoreCard`, `ScenarioComparePanel`.

**By page (approximate UI density):**

| Page | KPI cards | Charts | Tables / CRUD | Insight cards |
|------|-----------|--------|---------------|---------------|
| Executive Overview | Many (live metrics) | Donut, gauge, funnel, trend, bar | Alert list | Yes |
| Cash Flow | Mixed mock + live | Area/projection mock | Revenue + expense CRUD | Yes |
| Revenue Intelligence | Mock KPIs | Area, bar, pie (mock) | Account CRUD | Yes |
| Profitability | Live top KPIs | Bar (mock breakdowns) | Low-margin list (mock) | Yes |
| AR/AP | Mock KPIs | AR aging (live calc) | Invoice + payable CRUD | Yes |
| Sales Pipeline | Mock KPIs | Funnel/bar (mock) | Opportunity CRUD | Yes |
| Staffing & Payroll | Mock KPIs | Bar/area (mock) | Staffing CRUD | Yes |
| Scenario Builder | Live projection | Compare panel | Saved scenarios | Yes |
| Facility Intelligence | Live metrics | — | Facility CRUD + cards | Yes |
| Alerts | — | — | Computed alert list | — |
| Marketing ROI | All mock | Funnel, ROAS | — | Yes |
| Client Profitability | All mock | — | Static client table | Yes |
| Department Performance | All mock | Bar | Dept table | Yes |
| Reports | Mock | Chart | Report list (no export) | — |
| CFO Copilot | — | — | Chat UI (canned) | — |
| Daily Briefing | — | — | Narrative blocks (mock) | — |
| Compliance / Goals / History / Futurecast / Market | Mock | Various | Mostly static | Yes |

### 1.7 Demo-only areas

| Area | Path / trigger | Data |
|------|----------------|------|
| **Rose video walkthrough** | `/#/demo`, `public/demo/` redirect | Hardcoded 7 scenes; optional MP3 narration |
| **Demo funnel** | `DemoFunnelProvider`, `DemoGate` | Lead capture in localStorage |
| **Guided tour** | `GuidedTour` + `tourSteps.ts` | Overlay on workspace |
| **DemoPromo banner** | In-app promo | Dismiss flag |
| **Landing / request-demo / buy** | Marketing funnel | Not financial data |
| **Enter Demo** sidebar link | → public walkthrough | Separate from workspace |
| **`VITE_DEMO_MODE=1` build** | Optional separate artifact | Documented, not current PM2 deploy |

### 1.8 Wiring: real vs sample vs mock

**Legend:**

- **Live** — reads/writes `ProfitPulseState`, metrics from `calculations.ts` / `alerts.ts`
- **Hybrid** — live CRUD or metrics **plus** static `@/data/*` charts/KPIs
- **Mock** — `@/data/*` only; edits do not affect display
- **Shell** — UI with placeholder actions

| Module | Wiring | Notes |
|--------|--------|-------|
| Executive Overview | **Hybrid** | KPIs/alerts live; integration strip from `overviewData` |
| Cash Flow | **Hybrid** | CRUD live; projection/KPI cards often mock |
| Revenue Intelligence | **Hybrid** | Account CRUD live; trend/service/state charts mock |
| Profitability | **Hybrid** | Top KPIs live; margin breakdowns mock |
| AR/AP | **Hybrid** | CRUD + aging live; some KPI/insight mock |
| Sales Pipeline | **Hybrid** | Opportunity CRUD live; funnel KPIs mock |
| Staffing & Payroll | **Hybrid** | Staffing CRUD live; payroll charts mock |
| Scenario Builder | **Live** | Assumptions + saved scenarios |
| Facility Intelligence | **Live** | Full CRUD + promote to opportunity |
| Alerts | **Live** | Rule engine on state |
| Cash Calendar | **Hybrid** | Metrics from state; calendar events mock |
| Integrations | **Hybrid** | JSON/CSV import/export live; connector cards mock |
| White-Label Settings | **Live** | Org settings + export/reset |
| Profitability-adjacent | | |
| Client Profitability | **Mock** | No `useProfitPulse` |
| Department Performance | **Mock** | |
| Marketing ROI | **Mock** | |
| Historical Trends | **Mock** | |
| Market & Economy | **Mock** | |
| Futurecast | **Mock** | Separate from Scenario Builder |
| Goals & OKRs | **Mock** | |
| Compliance & Risk | **Mock** | Overlaps conceptually with `RiskRecord` but not wired |
| Daily Briefing | **Mock** | |
| Reports & Exports | **Mock** | No PDF/Excel generation |
| AI CFO Copilot | **Shell** | Canned prompts/responses |
| Welcome | **Mock** | Onboarding copy only |
| Team / Audit / Billing | **Live (local)** | SaaS scaffolding, not server-backed |
| Public `/demo` | **Demo-only** | Not connected to workspace |

**API / database:**

| Layer | Status |
|-------|--------|
| SPA → api-server | **Not connected** in production nginx path |
| api-server | Mock in-memory repos; revenue/expenses/facilities/opportunities CRUD |
| PostgreSQL `database/schema.sql` | Designed (tenants, RLS, financial tables) — **not runtime** |
| Drizzle schema | Mirror — **not wired** |

---

## 2. What is working in browser (today)

Verified on `https://demo.ccaprofitpulse.com` deploy pattern:

| Capability | Works? |
|------------|--------|
| Public video demo `/demo` | Yes — 7 scenes, auto narration, controls |
| HTTPS + SPA load | Yes |
| Login with demo accounts | Yes — client-side gate |
| Tenant switch (admin) | Yes — swaps localStorage namespace |
| Executive dashboard loads with seeded KPIs | Yes |
| CRUD on accounts, revenue, expenses, invoices, payables, staffing, opportunities, facilities | Yes — persists in browser until cleared |
| Computed alerts update with data changes | Yes |
| Scenario modeler sliders + save | Yes (tier limits apply) |
| CSV import on Integrations | Yes — parses into revenue/expenses |
| JSON export/import backup | Yes |
| Feature gates / upgrade prompts | Yes — client-side |
| Audit log entries on mutations | Yes — local only |
| Team invite create/revoke UI | Yes — no email delivery |

**Does not work as a real multi-user product:**

- Same tenant data on two browsers/devices
- Password security, session revocation
- Paid billing, webhooks
- Email invites
- Live accounting integrations
- Copilot / briefing / reports as advertised

---

## 3. What is demo-only

- Cinematic **`/#/demo`** walkthrough (contractor operator narrative)
- **Demo funnel** gating (`?skip=1` bypass for internal preview)
- **Guided tour** overlays
- **Marketing landing** lead capture
- **Sample walkthrough** badges and “illustrative AI” copy in demo scenes
- Seeded **healthcare compliance** financial story in workspace (overlaps demo thematically but different UX)

---

## 4. What is mock / localStorage only

**Everything operational** in the workspace is **localStorage-only** until Postgres + api-server cutover:

- All financial records and derived metrics
- Auth, sessions, tenants (except hardcoded seed registry)
- Billing tier and usage
- Audit trail
- Invitations

**Static `@/data/*` modules** add a second layer of **non-persistent fiction** on many pages — this is the primary “looks full but isn’t real” issue.

---

## 5. What is missing (vs a real Profit Pulse)

Compared to a credible **financial operations / profit intelligence** product for contractors:

| Expected capability | Status |
|---------------------|--------|
| Executive financial dashboard | **Partial** — strong UI, hybrid data |
| Revenue tracking | **Partial** — CRUD yes; analytics mostly mock |
| Expense tracking | **Partial** — same |
| Profit/margin analysis | **Partial** — top-level live; drilldowns mock |
| Cash flow forecast | **Partial** — calc helpers exist; UI mixes mock |
| AR/AP | **Partial** — CRUD + aging live |
| Project/job profitability | **Missing** — no job entity |
| Client/account profitability | **Mock page** — not tied to accounts |
| Department profitability | **Mock page** — not tied to staffing dept field |
| Payroll/staffing cost view | **Hybrid** |
| Sales pipeline impact | **Hybrid** |
| Scenario modeling | **Live** (best-in-app module) |
| Budget vs actual | **Missing** |
| Goals/targets | **Mock** |
| Alerts/risk signals | **Partial** — computed alerts live; compliance page mock |
| Reports/export | **Partial** — JSON/CSV only; reports page mock |
| Integrations/imports | **Partial** — CSV + JSON; no OAuth ERP |
| Settings/admin/team | **Local scaffold** |
| Billing/subscription | **Local scaffold** |
| Audit log | **Local scaffold** |
| Multi-tenant support | **UI + local keys** — not server isolation |
| Real backend/API | **Scaffold only** |
| Database persistence | **Schema only** |
| Security/auth production readiness | **Not ready** |

---

## 6. What Rose is likely reacting to

1. **Navigation breadth vs depth** — 31 sidebar links imply a complete suite; opening Marketing ROI, Copilot, Briefing, or Client Profitability reveals **static content** that doesn’t change when “live” data is edited elsewhere.

2. **Hybrid inconsistency** — Executive Overview shows live revenue; Revenue Intelligence charts still show **fixed mock trends**. Feels like “half the app didn’t load.”

3. **Wrong vertical story in workspace** — Seed data is **healthcare compliance** (facilities, inspections) while demo/marketing speaks **contractor jobs and margin**. Rose may expect job-level P&L, not facility health scores.

4. **No job/project object** — Demo scene 4 (“Jobs · projects · accounts”) is **not reflected** in the data model. Facility ≈ site, Account ≈ client, but **no job margin table**.

5. **Copilot / AI / Briefing feel fake** — Enterprise-tier headline features are **canned text**, undermining trust in the rest.

6. **Reports & Exports** — Named module with **no working export** beyond settings JSON.

7. **“Live metrics” banner** — Honest label (“Local data store”) still signals **prototype**, not product.

8. **Single-browser persistence** — Clearing cache or switching machines **resets** the company; not explained prominently.

9. **Facility Intelligence prominence** — Large sidebar module for a **compliance vertical** may feel off-brand if Profit Pulse is positioned as contractor profit intelligence.

---

## 7. Critical gaps before client demo

Priority: **trust and coherence**, not backend completeness.

| Gap | Risk | Mitigation (no backend required) |
|-----|------|----------------------------------|
| Mock KPIs beside live CRUD | Looks broken | Wire charts to `calculations.ts` or hide mock sections |
| 13 mock-only modules visible | Looks empty when clicked | Hide/disable nav until wired; or badge “Preview” |
| Healthcare vs contractor story | Brand confusion | Reseed + rename for contractor ops **or** narrow demo to financial modules only |
| No job/project view | Misses demo promise | Add read-only “Jobs” derived from opportunities/facilities **or** update demo script |
| Copilot/Briefing/Reports | Overpromise | Gate behind “Preview” or remove from default nav for Rose review |
| Login not explained | Confusion | On-screen “Demo workspace — sample data, browser-only” |
| Public `/demo` vs app | Two products | Clear CTA: video demo vs sign-in workspace |

---

## 8. Critical gaps before paid production

| Gap | Blocker level |
|-----|----------------|
| PostgreSQL + api-server as source of truth | **Blocker** |
| Real auth (password hash, HttpOnly sessions, revocation) | **Blocker** |
| Stripe (or equivalent) + webhook tier sync | **Blocker** |
| Tenant isolation enforced server-side + RLS | **Blocker** |
| Email (invites, alerts, billing) | **Blocker** |
| ERP/accounting integration (minimum: QuickBooks **or** CSV schedule) | **High** |
| Audit log immutability + retention | **High** |
| Backup/restore per tenant | **High** |
| SLA, monitoring, secrets management | **High** |
| Replace all `@/data/*` with computed or API data | **High** |
| Job/project profitability module | **High** (for contractor ICP) |
| Budget vs actual | **Medium** |
| SOC2-adjacent controls | **Medium** (enterprise sales) |

---

## 9. Recommended MVP module list

**MVP = “credible financial command center” for one operator team on real persisted data.**

### Include in MVP (ship first)

1. **Executive Overview** (fully live metrics)
2. **Cash Flow** (live + forecast from records)
3. **Revenue Intelligence** (live charts from revenue records)
4. **Profitability** (margin by category/account — live)
5. **AR/AP & Collections** (live)
6. **Sales Pipeline** (live opportunities → revenue linkage)
7. **Staffing & Payroll** (live cost roll-up)
8. **Alerts** (live rules)
9. **Scenario Modeler** (live — key differentiator)
10. **Integrations** (CSV import + JSON backup; one OAuth if feasible)
11. **Settings** (org profile)
12. **Auth + Team + Billing** (server-backed)

### Defer post-MVP (hide or “Preview” until wired)

- Marketing ROI, Market & Economy, Daily Briefing, CFO Copilot  
- Futurecast (duplicate of scenario story)  
- Goals & OKRs, Compliance (until tied to `RiskRecord` / tasks)  
- Reports (until PDF/Excel exists)  
- Department / Client profitability (until computed from live data)  
- Facility Intelligence (unless ICP is healthcare compliance)

### Add for contractor ICP (MVP+)

- **Jobs / Projects** entity with budget, actual cost, margin %  
- **Budget vs actual** (org + job level)  
- **Client profitability** derived from accounts + job roll-ups  

---

## 10. Phase-by-phase build plan

### Phase 0 — Honesty pass (1–2 weeks, frontend only)

- Tag mock nav items as **Preview** or hide from default sidebar  
- Wire **top 6 financial pages** to live calculations end-to-end  
- Reseed demo tenant for **contractor** language (or split healthcare to separate SKU)  
- Add first-run banner: browser-local demo workspace  
- Align Rose video demo claims with visible workspace modules  

### Phase 1 — Backend foundation (4–6 weeks)

- Deploy api-server behind nginx `/api`  
- Postgres + migrations from `database/schema.sql`  
- Connect SPA `ProfitPulseProvider` to REST (replace localStorage writes)  
- Real login, sessions, tenant middleware  

### Phase 2 — MVP financial core (4–6 weeks)

- Job/project entity + migrations  
- Live profitability drilldowns (account, job, category)  
- Cash forecast from AR/AP + recurring revenue/expense  
- Stripe billing + feature sync  
- Email invites  

### Phase 3 — Operator depth (6+ weeks)

- Budget vs actual  
- Reports (PDF/Excel)  
- QuickBooks (or CSV export schedule)  
- Alert notifications (email/in-app)  
- Audit export  

### Phase 4 — Intelligence (optional SKU)

- Copilot with tenant-scoped LLM + guardrails  
- Daily briefing generated from live alerts/metrics  
- Marketing ROI if ad integrations exist  

---

## 11. Quick wins (feel fuller without pretending production)

These improve **perceived completeness** without claiming server persistence:

1. **Remove mock KPI row** on hybrid pages when live metrics exist (single source of truth).  
2. **Drive all Recharts from `state`** on Revenue, Cash Flow, Profitability, AR/AP, Pipeline, Staffing.  
3. **Client Profitability table** from `accounts` + invoice/revenue roll-ups (no new entity).  
4. **Department view** from `staffing.department` aggregation.  
5. **“Preview module”** badge + muted styling on Copilot, Briefing, Marketing ROI, Reports.  
6. **Jobs panel** on Sales Pipeline — map `Opportunity.title` + margin heuristic until real Job type exists.  
7. **Empty states** with “Add revenue” / import CSV instead of static fake numbers.  
8. **Demo login card** on Welcome: one-click admin@demo.com.  
9. **Sync Executive Overview integration chips** with Integrations page status (connected vs CSV-only).  
10. **Contractor reseed pack** — swap healthcare names for construction/medical facility **clients** without changing schema.

---

## 12. Risks / things not to promise

| Do not promise | Why |
|----------------|-----|
| “Live AI CFO” | No LLM backend; canned UI |
| “Connects to QuickBooks/Zoho today” | Placeholder cards only |
| “Multi-user real-time collaboration” | localStorage per browser |
| “Bank-grade security” | Mock JWT; no server enforcement |
| “Audit-ready immutable log” | Client-side, cap 500 entries |
| “Email invitations” | Tokens local; no mail sent |
| “Paid plans active” | Tier toggle local unless Stripe shipped |
| “Facility compliance scoring” as core contractor value | Vertical mismatch unless ICP is healthcare |
| “Production SaaS on demo.ccaprofitpulse.com” | Hostname is demo; architecture is prototype |
| Rose **video demo** = logged-in app | Separate routes, separate data |

**Safe language:** “Interactive prototype with sample data,” “Browser-local workspace for evaluation,” “Video product demo at `/demo`,” “Roadmap includes Postgres + ERP integration.”

---

## Appendix A — File reference map

| Concern | Location |
|---------|----------|
| Routes | `src/App.tsx` |
| Sidebar | `src/components/layout/SidebarNav.tsx` |
| Financial state | `src/context/ProfitPulseProvider.tsx` |
| Types | `src/lib/profit-pulse/types.ts` |
| Storage | `src/lib/profit-pulse/storage.ts` |
| Seed | `src/lib/profit-pulse/seed.ts` |
| Calculations | `src/lib/profit-pulse/calculations.ts` |
| Alerts | `src/lib/profit-pulse/alerts.ts` |
| Static mocks | `src/data/*.ts` |
| Auth | `src/auth/*`, `src/context/AuthProvider.tsx` |
| Billing | `src/billing/*`, `src/context/BillingProvider.tsx` |
| Public demo | `src/demo/*` |
| API scaffold | `artifacts/api-server/src/profit-pulse/` |
| DB schema | `database/schema.sql` |

---

## Appendix B — Comparison checklist (requested domains)

| Domain | Exists | Live data | Production-ready |
|--------|--------|-----------|------------------|
| Executive financial dashboard | Yes | Partial | No |
| Revenue tracking | Yes | Partial | No |
| Expense tracking | Yes | Partial | No |
| Profit/margin analysis | Yes | Partial | No |
| Cash flow forecast | Yes | Partial | No |
| AR/AP | Yes | Partial | No |
| Project/job profitability | **No** | — | — |
| Client/account profitability | Page only | Mock | No |
| Department profitability | Page only | Mock | No |
| Payroll/staffing cost view | Yes | Hybrid | No |
| Sales pipeline impact | Yes | Hybrid | No |
| Scenario modeling | Yes | **Yes** | No |
| Budget vs actual | **No** | — | — |
| Goals/targets | Page only | Mock | No |
| Alerts/risk signals | Yes | Partial | No |
| Reports/export | Partial | JSON/CSV only | No |
| Integrations/imports | Yes | CSV/JSON | No |
| Settings/admin/team | Yes | Local | No |
| Billing/subscription | Yes | Local | No |
| Audit log | Yes | Local | No |
| Multi-tenant support | UI | Local keys | No |
| Real backend/API | Scaffold | Mock | No |
| Database persistence | Schema | Not connected | No |
| Security/auth production | Partial UI | Mock | **No** |

---

*Audit only — no product code changes in this commit.*

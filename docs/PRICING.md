# Profit Pulse — Pricing & Feature Flags

## Subscription tiers

| Tier | Monthly | Annual | Target buyer |
|------|---------|--------|--------------|
| **Free** | $0 | $0 | Solo operator / evaluation |
| **Pro** | $149 | $1,490 | Growing ops team |
| **Enterprise** | Custom | Custom | Multi-site, white-label, compliance |

Billing flags (local / future Stripe):

```typescript
{
  stripeCustomerId: null,
  stripeSubscriptionId: null,
  billingStatus: 'none' | 'active' | 'trialing' | 'past_due' | 'canceled',
  trialEndsAt: string | null,
  currentPeriodEnd: string | null,
  cancelAtPeriodEnd: boolean
}
```

Default seed:

- **Demo Company** → `free` (shows upgrade paths)
- **Acme Healthcare** → `enterprise` (full access demo)

---

## UI access by tier

### Free

| Module | Access |
|--------|--------|
| Executive Overview | ✅ |
| Cash Flow | ✅ |
| Revenue Intelligence | ✅ (max 50 revenue / 50 expense rows) |
| Alerts | ✅ |
| All other sidebar routes | 🔒 Upgrade prompt |

**Limits:** 3 facilities · 5 opportunities · 2 users · 0 saved scenarios · no audit log

### Pro

Everything in **Free**, plus:

| Module | Access |
|--------|--------|
| Profitability, Cash Calendar | ✅ |
| AR/AP & Collections | ✅ |
| Sales Pipeline, Staffing, Marketing ROI | ✅ |
| Historical Trends, Futurecast | ✅ |
| **Scenario Modeler** | ✅ (max 20 saved) |
| Facility Intelligence | ✅ (max 25 facilities) |
| Daily Briefing, Reports | ✅ |
| Integrations (export only) | ✅ |
| Audit Log | ✅ (30-day retention) |

**Limits:** 10 users · unlimited revenue/expense rows

### Enterprise

Everything in **Pro**, plus:

| Module | Access |
|--------|--------|
| Department / Client Profitability | ✅ |
| Market & Economy, Goals, Compliance | ✅ |
| Integrations **import** + reset | ✅ |
| AI CFO Copilot | ✅ |
| White-Label Settings | ✅ |
| Team & Invites | ✅ |
| API access (flag) | ✅ |

**Limits:** Unlimited users, facilities, scenarios, audit retention

---

## Feature flag system design

```
┌─────────────────────────────────────────────────────────┐
│ BillingProvider (per tenantId from AuthProvider)        │
│  ├─ subscription.tier                                   │
│  ├─ billing flags (Stripe-ready)                          │
│  ├─ usage snapshot (monthly counters)                   │
│  ├─ canAccess(featureKey) → FeatureAccessResult         │
│  ├─ canAccessRoute(href) → sidebar + route gates        │
│  ├─ checkLimit(metric, count) → quota enforcement       │
│  └─ trackUsage(metric) → increment local counters       │
└─────────────────────────────────────────────────────────┘
         │                    │
         ▼                    ▼
  FeatureGate.tsx      ProfitPulseProvider
  SidebarNav filter    CRUD limit checks + trackUsage
  /billing page        export/import hooks
```

### Feature keys (`FeatureKey`)

Single enum drives:

1. **Sidebar visibility** — `ROUTE_FEATURE_MAP[path]`
2. **Page gates** — `<FeatureGate feature="scenario_modeler">`
3. **API policy** (future) — same keys in api-server middleware
4. **Marketing site** — tier comparison tables

### Usage metrics (`UsageMetricKey`)

| Metric | Tracked when |
|--------|----------------|
| `revenue_records` | Create revenue (limit check) |
| `expense_records` | Create expense |
| `facility_records` | Create facility |
| `scenario_saves` | Save scenario |
| `data_exports` | JSON export |
| `data_imports` | JSON/CSV import |
| `copilot_queries` | Copilot use (hook ready) |
| `api_requests` | Billing page actions / future API |

Storage: `localStorage` key `profit-pulse-billing-v1` (per tenant subscription + monthly usage).

### Enforcement layers

1. **UI** — hide nav items; show upgrade card on direct URL
2. **Provider** — block create when over limit; `trackUsage` on mutations
3. **RBAC** — orthogonal (admin/manager/viewer still applies)
4. **API** (future) — `X-Plan-Tier` + server-side quota

### Stripe integration (not wired)

When ready:

1. Checkout session → set `stripeCustomerId`, `stripeSubscriptionId`
2. Webhook `customer.subscription.updated` → `setTenantTier`
3. `past_due` → read-only mode flag on BillingProvider
4. Feature matrix unchanged — tier drives `canAccess`

---

## Files

```
src/billing/types.ts       — tiers, features, usage, billing flags
src/billing/tiers.ts       — TIER_DEFINITIONS, ROUTE_FEATURE_MAP
src/billing/features.ts    — canAccessFeature, isWithinLimit
src/billing/subscription.ts — localStorage registry
src/context/BillingProvider.tsx
src/components/billing/FeatureGate.tsx
src/components/billing/PlanBadge.tsx
src/pages/Billing.tsx
```

# Profit Pulse API layer

Mock-backed Express routes under `/api/profit-pulse/*`. Postgres not connected yet.

## Folder structure

```
artifacts/api-server/src/profit-pulse/
├── index.ts                    # adapter factory + router export
├── types.ts                    # TenantContext, shared API types
├── middleware/
│   └── tenant.ts               # mock auth + RBAC guards
├── routes/
│   ├── index.ts                # mounts all resource routers
│   ├── auth.routes.ts          # login, session, logout
│   ├── tenants.routes.ts
│   ├── revenue.routes.ts
│   ├── expenses.routes.ts
│   ├── facilities.routes.ts
│   └── opportunities.routes.ts
├── repositories/
│   ├── base.repository.ts      # tenant isolation helpers
│   ├── interfaces.ts           # repository contracts
│   ├── mock/
│   │   ├── mock-store.ts       # in-memory DB (dev only)
│   │   ├── revenue.mock.ts
│   │   ├── expenses.mock.ts
│   │   ├── facilities.mock.ts
│   │   └── opportunities.mock.ts
│   └── postgres/               # future Drizzle implementations
│       └── revenue.pg.ts       # stub
└── README.md

database/
├── schema.sql                  # PostgreSQL DDL + RLS
└── MIGRATION.md                # cutover plan

lib/db/src/schema/profit-pulse/ # Drizzle ORM mirror (not wired)
```

## Mock auth headers (until real JWT)

```bash
curl -H "X-Tenant-Id: tenant-demo-company" \
     -H "X-User-Role: admin" \
     http://localhost:5000/api/profit-pulse/revenue
```

## Endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/profit-pulse/auth/login` | public |
| GET | `/api/profit-pulse/auth/session` | tenant header |
| POST | `/api/profit-pulse/auth/logout` | tenant header |
| GET | `/api/profit-pulse/tenants/current` | tenant header |
| CRUD | `/api/profit-pulse/revenue` | tenant + write role |
| CRUD | `/api/profit-pulse/expenses` | tenant + write role |
| CRUD | `/api/profit-pulse/facilities` | tenant + write role |
| CRUD | `/api/profit-pulse/opportunities` | tenant + write role |

## Tenant isolation (query-level rules)

1. Every repository method receives `TenantContext` with `tenantId`.
2. Mock repos filter `row.tenantId === ctx.tenantId` on every read/write.
3. Postgres repos will run `SELECT app_set_tenant_id($1)` before queries.
4. RLS policies in `schema.sql` provide database-level enforcement.
5. Composite FKs `(tenant_id, account_id)` block cross-tenant references.

# Profit Pulse — Production Snapshot

**Captured:** 2026-06-29 03:29 UTC  
**Host:** EC2 `ubuntu@172.31.19.214` (public `3.129.68.79`)  
**Repo:** `/home/ubuntu/projects/profitpulse`  
**Package:** `@workspace/healthcast` (`artifacts/healthcast/`)

---

## Executive summary

| Check | Status |
|-------|--------|
| PM2 `profitpulse` process | **online** (stable, 0 unstable restarts) |
| PM2 process list saved | **yes** — `~/.pm2/dump.pm2` (verified 2026-06-29 03:28 UTC) |
| PM2 boot persistence | **enabled** — `pm2-ubuntu.service` active |
| Production serve (vite preview) | **running** on `127.0.0.1:3010` only |
| Dev server (`vite dev`) | **not running** for Profit Pulse |
| Build output | **stable** — `dist/public/` built 2026-06-29 03:28 UTC, not regenerating |
| Nginx reverse proxy | **active** — Profit Pulse site enabled |
| HTTP health | **200** on `:3010` and nginx `:80` (Host: `profitpulse.yourdomain.com`) |

---

## Current architecture

```
Internet / users
       │
       ▼
┌──────────────────────────────────────┐
│  AWS EC2  3.129.68.79                │
│  Security: port 3010 NOT public      │
│            (binds 127.0.0.1 only)    │
└──────────────────────────────────────┘
       │
       ▼ :80 / :443 (nginx, public)
┌──────────────────────────────────────┐
│  nginx                               │
│  server_name: profitpulse.yourdomain.com
│  config: deploy/nginx/profitpulse.yourdomain.com.conf
│  proxy_pass → http://127.0.0.1:3010   │
└──────────────────────────────────────┘
       │
       ▼ localhost only
┌──────────────────────────────────────┐
│  PM2: profitpulse                    │
│  PORT=3010 BASE_PATH=/               │
│  pnpm --filter @workspace/healthcast run serve
│  → vite preview --host 127.0.0.1     │
│  serves: artifacts/healthcast/dist/public/
└──────────────────────────────────────┘
       │
       ▼ (browser, client-side)
┌──────────────────────────────────────┐
│  React SPA (local-first MVP)         │
│  • Workspace data: localStorage      │
│    `profit-pulse-v1:{tenantId}`      │
│  • Auth registry: `profit-pulse-auth-v1`
│  • Billing: `profit-pulse-billing-v1`
│  • Audit: `profit-pulse-audit-v1`    │
└──────────────────────────────────────┘
```

**Stack layers (in app):**

1. `AuthProvider` — mock JWT session, multi-tenant RBAC
2. `BillingProvider` — Free / Pro / Enterprise tiers, feature gates, usage counters
3. `ProfitPulseProvider` — financial data CRUD, calculations, alerts

**Not yet connected:** PostgreSQL (`database/schema.sql`), Stripe, real API server cutover.

---

## Running ports (Profit Pulse + host context)

| Port | Bind | Service | Notes |
|------|------|---------|-------|
| **3010** | `127.0.0.1` | **Profit Pulse** (vite preview) | Internal only — correct |
| **80** | `0.0.0.0` | nginx HTTP | Public; proxies Profit Pulse by `Host` header |
| **443** | `0.0.0.0` | nginx HTTPS | Active for other `*.cagteam.net` sites |
| 24980 | `127.0.0.1` | cca-services-hub-preview | Other project (vite preview) |
| 8080 | `127.0.0.1` | jestina-api | Other project |
| 8081 | `127.0.0.1` | tonyos-api | Other project |
| 3000 | `*` | next-server | Other project (not Profit Pulse) |

**AWS note:** Port **3010 is not exposed** to the internet. External access to Profit Pulse goes through **nginx on port 80** (and eventually 443 after certbot + DNS). Confirm security group allows **80/443** inbound; **3010 should remain blocked** externally.

---

## PM2 process list (full host)

Captured 2026-06-29 03:29 UTC:

| ID | Name | Status | Restarts | Mode |
|----|------|--------|----------|------|
| 12 | **profitpulse** | online | 3 | fork |
| 5 | cca-command-center-cloud | online | 14 | fork |
| 3 | cca-services-hub-preview | online | 3 | fork |
| 9 | chloe-api | online | 0 | fork |
| 2 | jestina-api | online | 0 | fork |
| 13 | landonos-api | online | 0 | fork |
| 4 | research-hub-web | online | 0 | fork |
| 1 | salesintelligence-api | online | 0 | fork |
| 0 | tonyos-api | online | 0 | fork |

### Profit Pulse PM2 definition

```bash
# Working directory
/home/ubuntu/projects/profitpulse

# Command
PORT=3010 BASE_PATH=/ pnpm --filter @workspace/healthcast run serve

# Underlying script (package.json)
vite preview --config vite.config.ts --host 127.0.0.1

# Logs
~/.pm2/logs/profitpulse-out.log
~/.pm2/logs/profitpulse-error.log

# Watch mode: disabled
# Unstable restarts: 0
```

### PM2 persistence

| Item | Location / status |
|------|-----------------|
| Saved dump | `~/.pm2/dump.pm2` (92380 bytes, 2026-06-29 03:28 UTC) |
| Backup dump | `~/.pm2/dump.pm2.bak` |
| Boot service | `/etc/systemd/system/pm2-ubuntu.service` — **enabled**, active |
| God daemon PID | 1054 (uptime ~6h at snapshot) |

`pm2 save` was run and verified during this snapshot.

---

## Deployment method

### Build (manual, before serve)

```bash
cd /home/ubuntu/projects/profitpulse
PORT=3010 BASE_PATH=/ pnpm --filter @workspace/healthcast run build
```

**Output:** `artifacts/healthcast/dist/public/`  
**Latest bundle:** `assets/index-DKZt3xL6.js` (built 2026-06-29 03:28:19 UTC)

### Serve (PM2, production)

```bash
cd /home/ubuntu/projects/profitpulse
PORT=3010 BASE_PATH=/ pm2 start "pnpm --filter @workspace/healthcast run serve" --name profitpulse
pm2 save
```

Or restart after code changes:

```bash
pnpm --filter @workspace/healthcast run build
pm2 restart profitpulse
pm2 save
```

### Nginx

- **Config:** `deploy/nginx/profitpulse.yourdomain.com.conf`
- **Enabled:** `/etc/nginx/sites-enabled/profitpulse.yourdomain.com` → symlink to config above
- **Upstream:** `http://127.0.0.1:3010`
- **Domain:** `profitpulse.yourdomain.com`
- **HTTPS:** Not yet issued — DNS must point to `3.129.68.79` before `certbot --nginx -d profitpulse.yourdomain.com`

---

## Dev vs production verification

| Process | Profit Pulse | Verdict |
|---------|--------------|---------|
| `vite dev` | **Not running** | OK |
| `vite preview` (serve) | **Running** via PM2 | OK — production mode |
| Watch / hot reload | **Disabled** in PM2 | OK |
| `dist/` regeneration | **None** after build | OK — static files served as-is |

Profit Pulse `package.json` scripts:

- `dev` → `vite --host 0.0.0.0` (must NOT run in production)
- `serve` → `vite preview --host 127.0.0.1` (production)

---

## Git state (source of truth on disk)

| Item | Value |
|------|-------|
| Remote | `origin` → `git@github.com:contractorcomplianceco-cmyk/profitpulse.git` |
| Branch | `main` (tracking `origin/main`) |
| Last pushed commit | `7230de0` — *Build real Profit Pulse MVP* |
| Local changes | **Uncommitted** — SaaS auth, billing/monetization, nginx deploy, database schema stubs |

Uncommitted work is **on disk** and included in the current `dist/` build. It is **not** in git remote yet. Shutting down the EC2 instance does **not** delete local files; commit/push when ready for off-box backup.

---

## Data persistence notes

| Data type | Where stored | Shutdown risk |
|-----------|--------------|---------------|
| App workspace (revenue, expenses, etc.) | Browser `localStorage` per user | **None from server shutdown** — lives in user's browser |
| Auth / tenants / billing registry | Browser `localStorage` | Same as above |
| Built static assets | `artifacts/healthcast/dist/` on disk | **None** — persists on EBS volume |
| Source code + uncommitted changes | `/home/ubuntu/projects/profitpulse` | **None** — persists on EBS volume |
| PM2 process definitions | `~/.pm2/dump.pm2` | **None** — restored on boot via `pm2-ubuntu` |
| PostgreSQL / Stripe | Not connected | N/A |

---

## Nginx status

- **Service:** `active` (running)
- **Profit Pulse vhost:** enabled on port 80
- **Config test:** `nginx -t` reports a **permission warning** on an unrelated cert (`business-services.cagteam.net`) when run as non-root; nginx is still serving traffic (Profit Pulse returns HTTP 200)
- **Profit Pulse HTTPS:** pending DNS + certbot

---

## Known open items (non-blocking for overnight)

1. **HTTPS** — DNS for `profitpulse.yourdomain.com` must resolve to `3.129.68.79`
2. **Git push** — monetization + SaaS layers uncommitted locally
3. **Stripe / Postgres** — structure only, not wired

---

## Next-day resume instructions

### 1. SSH to the host

```bash
ssh ubuntu@3.129.68.79
```

### 2. Verify PM2

```bash
pm2 list
pm2 describe profitpulse
pm2 logs profitpulse --lines 50
```

Expected: `profitpulse` status **online**, listening on `127.0.0.1:3010`.

### 3. Health checks

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3010/
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: profitpulse.yourdomain.com" http://127.0.0.1:80/
```

Expected: both return **200**.

### 4. If profitpulse is stopped after reboot

PM2 should auto-resurrect via `pm2-ubuntu.service`. If not:

```bash
cd /home/ubuntu/projects/profitpulse
pm2 resurrect    # from ~/.pm2/dump.pm2
# or
PORT=3010 BASE_PATH=/ pm2 start "pnpm --filter @workspace/healthcast run serve" --name profitpulse --cwd /home/ubuntu/projects/profitpulse
pm2 save
```

### 5. After code changes

```bash
cd /home/ubuntu/projects/profitpulse
PORT=3010 BASE_PATH=/ pnpm --filter @workspace/healthcast run typecheck
PORT=3010 BASE_PATH=/ pnpm --filter @workspace/healthcast run build
pm2 restart profitpulse
pm2 save
```

### 6. Demo login (unchanged)

- `admin@demo.com` / any password — admin on Demo Company (Free tier) and Acme Healthcare (Enterprise)
- `manager@demo.com`, `viewer@demo.com` — role-limited

---

## Quick reference commands

```bash
# Status
pm2 list
ss -tlnp | grep 3010

# Restart Profit Pulse only
pm2 restart profitpulse

# View logs
pm2 logs profitpulse --lines 100

# Re-save PM2 list after changes
pm2 save
```

---

**SAFE TO SHUT DOWN - NO DATA LOSS RISK**

Server-side artifacts (source, build output, PM2 dump, nginx config) persist on the EBS volume. PM2 will resurrect on boot. User workspace data lives in browser localStorage and is unaffected by EC2 stop/start. No database or in-memory-only state requires flushing before shutdown.

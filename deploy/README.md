# Profit Pulse — deploy

## Architecture

| Layer | Binding | Notes |
|-------|---------|-------|
| PM2 `profitpulse` | `127.0.0.1:3010` | `vite preview` — never expose 3010 publicly |
| nginx | `:80` / `:443` | Reverse proxy to `127.0.0.1:3010` |

**Production domain:** `https://demo.ccaprofitpulse.com`

| URL | Purpose |
|-----|---------|
| `https://demo.ccaprofitpulse.com/` | Main app (auth required for workspace) |
| `https://demo.ccaprofitpulse.com/demo` | Public Rose walkthrough (no login) |
| `https://demo.ccaprofitpulse.com/#/demo` | Hash route (same walkthrough) |

## DNS

```
demo.ccaprofitpulse.com  CNAME  ccaprofitpulse.com
```

**Required:** `ccaprofitpulse.com` must have an **A record** pointing at this EC2 public IP (e.g. `3.129.68.79`). A CNAME from `demo` → apex without an apex A record will not resolve publicly and **certbot will fail**.

Alternative: set `demo.ccaprofitpulse.com` **A** → server IP directly (skip CNAME).

Confirm before TLS:

```bash
dig +short demo.ccaprofitpulse.com A @8.8.8.8   # must return server IP
```

## nginx

```bash
sudo ln -sf /home/ubuntu/projects/profitpulse/deploy/nginx/demo.ccaprofitpulse.com.conf \
  /etc/nginx/sites-enabled/demo.ccaprofitpulse.com
sudo rm -f /etc/nginx/sites-enabled/profitpulse.yourdomain.com
sudo nginx -t && sudo systemctl reload nginx
```

## TLS (certbot)

After HTTP works:

```bash
sudo certbot --nginx -d demo.ccaprofitpulse.com
```

Verify:

```bash
curl -sI http://demo.ccaprofitpulse.com/ | head -5   # → 301 HTTPS
curl -sI https://demo.ccaprofitpulse.com/demo | head -5
```

## Build & restart

```bash
cd /home/ubuntu/projects/profitpulse
PORT=3010 BASE_PATH=/ pnpm --filter @workspace/healthcast run build
pm2 restart profitpulse
```

## Command Center link

Staff can open the public demo from Internal Tools when registry `liveUrl` is set to:

`https://demo.ccaprofitpulse.com/demo`

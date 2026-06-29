# Public demo route (`/demo`)

Rose and Command Center can open the Profit Pulse walkthrough **without login**.

## URLs

| URL | Behavior |
|-----|----------|
| `/#/demo` | **Primary** — hash route to cinematic walkthrough |
| `/demo` or `/demo/` | Static redirect → `/#/demo` (Command Center friendly) |

## Security / data

- **Bypasses `AuthGate`** — always public (production and demo builds).
- **Outside `ProfitPulseProvider`** — no workspace localStorage, no tenant data.
- **Sample scenes only** — hardcoded mock content in `src/demo/scenes/*`.
- Main app (`/`, `/cash-flow`, …) still requires login via `/auth/login`.

## Command Center link

```
https://demo.ccaprofitpulse.com/demo
```

Hash route (equivalent):

```
https://demo.ccaprofitpulse.com/#/demo
```

Local preview (no TLS): `http://127.0.0.1:3010/demo` or `http://127.0.0.1:3010/#/demo`

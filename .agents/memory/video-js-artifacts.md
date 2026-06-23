---
name: video-js artifacts in this monorepo
description: Non-obvious gotchas when building/verifying code-generated animated video artifacts (video-js scaffold)
---

# video-js artifacts

## tsc is NOT the verification gate for video artifacts
The video-js scaffold does not typecheck cleanly out of the box:
- The repo's `tsconfig.base.json` sets `"lib": ["es2022"]` (no DOM) and `"types": []`. The video scaffold's `tsconfig.json` overrides `types` but never adds a DOM `lib`, so `tsc` reports "Cannot find name 'window' / 'document'" in scaffold files (`src/lib/video/hooks.ts`, `src/main.tsx`). Adding `"lib": ["ES2022","DOM","DOM.Iterable"]` to the artifact's `tsconfig.json` fixes those without touching the read-only `hooks.ts`.
- `src/lib/video/animations.ts` presets trigger framer-motion `Variant`/`Transition` strictness errors (`ease: "circOut"`, `staggerChildren`) even when annotated `: Variants`.

**Why:** the scaffold runs under Vite/esbuild (no type-check) and the skill's verification path is `bash scripts/validate-recording.sh` + clean Vite workflow logs + runtime, not `tsc`. Do not rewrite scaffold preset files chasing a clean `tsc` — verify via validate-recording + logs instead.

**How to apply:** after building a video artifact, run `validate-recording.sh`, restart the workflow, and check logs. Treat residual `tsc` errors confined to scaffold files (`hooks.ts`, `main.tsx`, `animations.ts`) as baseline. `hooks.ts` must never be modified (export/recording pipeline depends on it).

## Long `tsc` runs are flaky from bash here
`pnpm --filter ... run typecheck` / `npx tsc` frequently exit -1 with no output (environment cancellation) on slower packages. Prefer Vite HMR/log confirmation; if you must typecheck, build libs first (`pnpm run typecheck:libs`, which caches) and accept that leaf typechecks may still get killed.

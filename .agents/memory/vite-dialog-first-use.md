---
name: Vite first-use Dialog crash
description: Why introducing the first usage of a shadcn/radix component throws a one-time null-React error, and the fix.
---

When a component that was present in the codebase but never actually *rendered* (e.g. `components/ui/dialog.tsx` wrapping `@radix-ui/react-dialog`) gets mounted for the first time, Vite discovers the dep at runtime, re-optimizes it, and does a full page reload mid-render. During that window the half-loaded dep resolves React as `null`, producing:

- `Cannot read properties of null (reading 'useRef')` (thrown from inside the radix component)
- React "Invalid hook call ... You might have more than one copy of React"

**Why:** it is a transient of Vite's on-demand dependency optimization + reload, NOT a real duplicate-React or hook-rules bug.

**How to apply:** if you see this right after adding the first usage of a previously-unused dependency, restart the artifact's workflow so the dep is pre-bundled at startup. The error clears on the next clean load. Do not start refactoring imports or hunting for duplicate React copies — confirm with a restart first.

---
name: cross-artifact navigation in the path-routed monorepo
description: How to link from one artifact to another (e.g. app to its demo video) in this pnpm monorepo
---

# Cross-artifact navigation

Each artifact is a separate app served behind a shared reverse proxy that routes by path (e.g. main app at `/`, demo video at `/demo/`). They do NOT share a client router.

**Rule:** to navigate from one artifact to another, use a plain `<a href="/<other-previewPath>/">` (full-page navigation). Do NOT use the app's in-app router link (e.g. wouter `<Link>`), which only resolves routes within the current artifact's base path and will 404 / mis-route.

**Why:** wouter `<Link>` (and similar SPA routers) resolve against `import.meta.env.BASE_URL` of the current artifact; a sibling artifact lives under a different proxy path and is a separate document.

**How to apply:** when adding "Watch Demo"-style cross-links, render an `<a href>` and exclude that item from in-app active-route matching so it doesn't trigger router side effects.

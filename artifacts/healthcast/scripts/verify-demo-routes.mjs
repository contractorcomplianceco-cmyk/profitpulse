#!/usr/bin/env node
/**
 * P1-12 regression guard — public /demo must stay outside AuthGate.
 * Run: pnpm --filter @workspace/healthcast run verify:demo
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const appPath = join(root, "../src/App.tsx");
const src = readFileSync(appPath, "utf8");

const checks = [
  { name: "DemoWalkthrough imported", ok: src.includes("DemoWalkthrough") },
  { name: "/demo route exists", ok: /Route path="\/demo"/.test(src) },
  {
    name: "Demo before MainAppShell",
    ok: (() => {
      const demoRoute = src.indexOf('path="/demo"');
      if (demoRoute < 0) return false;
      const switchStart = src.lastIndexOf("<Switch>", demoRoute);
      const switchEnd = src.indexOf("</Switch>", demoRoute);
      if (switchStart < 0 || switchEnd < 0) return false;
      const block = src.slice(switchStart, switchEnd);
      const demoIdx = block.indexOf('path="/demo"');
      const shellIdx = block.indexOf("MainAppShell");
      return demoIdx >= 0 && shellIdx >= 0 && demoIdx < shellIdx;
    })(),
  },
  { name: "AuthGate not on demo path", ok: !/Route path="\/demo"[\s\S]*AuthGate/.test(src) },
  { name: "publicRoutes lists /demo", ok: readFileSync(join(root, "../src/routing/publicRoutes.ts"), "utf8").includes('"/demo"') },
];

let failed = false;
for (const c of checks) {
  if (!c.ok) {
    console.error(`FAIL: ${c.name}`);
    failed = true;
  } else {
    console.log(`OK: ${c.name}`);
  }
}

process.exit(failed ? 1 : 0);

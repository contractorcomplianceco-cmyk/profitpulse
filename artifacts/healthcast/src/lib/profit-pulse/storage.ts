import type { ProfitPulseState } from "./types";
import { createSeedState, createSeedStateForTenant } from "./seed";
import { DEFAULT_TENANT_ID } from "@/auth/types";

export const LEGACY_STORAGE_KEY = "profit-pulse-v1";

export function storageKeyForTenant(tenantId: string): string {
  return `profit-pulse-v1:${tenantId}`;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function migrateLegacyStorage(tenantId: string): ProfitPulseState | null {
  if (!isBrowser()) return null;
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!legacy) return null;
  try {
    const parsed = JSON.parse(legacy) as ProfitPulseState;
    if (parsed?.version !== 1 || !parsed.organization) return null;
    const key = storageKeyForTenant(tenantId);
    localStorage.setItem(key, JSON.stringify({ ...parsed, tenantId }));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return { ...parsed, tenantId };
  } catch {
    return null;
  }
}

export function loadState(tenantId: string): ProfitPulseState {
  if (!isBrowser()) return createSeedStateForTenant(tenantId);
  try {
    const key = storageKeyForTenant(tenantId);
    const raw = localStorage.getItem(key);
    if (!raw) {
      const migrated = migrateLegacyStorage(tenantId);
      if (migrated) return migrated;
      return createSeedStateForTenant(tenantId);
    }
    const parsed = JSON.parse(raw) as ProfitPulseState;
    if (parsed?.version !== 1 || !parsed.organization) {
      return createSeedStateForTenant(tenantId);
    }
    if (!parsed.savedScenarios) parsed.savedScenarios = [];
    return { ...parsed, tenantId };
  } catch {
    return createSeedStateForTenant(tenantId);
  }
}

export function saveState(state: ProfitPulseState, tenantId: string): void {
  if (!isBrowser() || !tenantId) return;
  try {
    const payload = { ...state, tenantId };
    localStorage.setItem(storageKeyForTenant(tenantId), JSON.stringify(payload));
  } catch {
    /* quota or private mode */
  }
}

export function resetStoredState(tenantId: string): ProfitPulseState {
  const seed = createSeedStateForTenant(tenantId);
  saveState(seed, tenantId);
  return seed;
}

export function exportStateJson(state: ProfitPulseState): string {
  return JSON.stringify(state, null, 2);
}

export function importStateJson(raw: string, tenantId: string): ProfitPulseState {
  const parsed = JSON.parse(raw) as ProfitPulseState;
  if (parsed?.version !== 1 || !parsed.organization) {
    throw new Error("Invalid Profit Pulse export file.");
  }
  const next = { ...parsed, tenantId };
  saveState(next, tenantId);
  return next;
}

/** @deprecated use createSeedStateForTenant */
export { createSeedState };

import type { ProfitPulseState } from "./types";
import { createSeedState } from "./seed";

export const STORAGE_KEY = "profit-pulse-v1";

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadState(): ProfitPulseState {
  if (!isBrowser()) return createSeedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    const parsed = JSON.parse(raw) as ProfitPulseState;
    if (parsed?.version !== 1 || !parsed.organization) return createSeedState();
    if (!parsed.savedScenarios) parsed.savedScenarios = [];
    return parsed;
  } catch {
    return createSeedState();
  }
}

export function saveState(state: ProfitPulseState): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode */
  }
}

export function resetStoredState(): ProfitPulseState {
  const seed = createSeedState();
  saveState(seed);
  return seed;
}

export function exportStateJson(state: ProfitPulseState): string {
  return JSON.stringify(state, null, 2);
}

export function importStateJson(raw: string): ProfitPulseState {
  const parsed = JSON.parse(raw) as ProfitPulseState;
  if (parsed?.version !== 1 || !parsed.organization) {
    throw new Error("Invalid Profit Pulse export file.");
  }
  saveState(parsed);
  return parsed;
}

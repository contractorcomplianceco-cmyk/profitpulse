const POPUP_DISMISSED_KEY = "pp_demo_popup_dismissed";
const TOUR_STARTED_KEY = "pp_tour_started";
const CHECKLIST_KEY = "pp_onboarding_checklist";

export interface OnboardingChecklist {
  exploreDashboard: boolean;
  addRevenue: boolean;
  reviewFacilities: boolean;
  runScenario: boolean;
}

const DEFAULT_CHECKLIST: OnboardingChecklist = {
  exploreDashboard: false,
  addRevenue: false,
  reviewFacilities: false,
  runScenario: false,
};

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function isPopupDismissed(): boolean {
  return safeGet(POPUP_DISMISSED_KEY) === "1";
}

export function dismissPopup(): void {
  safeSet(POPUP_DISMISSED_KEY, "1");
}

export function isTourStarted(): boolean {
  return safeGet(TOUR_STARTED_KEY) === "1";
}

export function markTourStarted(): void {
  safeSet(TOUR_STARTED_KEY, "1");
}

export function loadChecklist(): OnboardingChecklist {
  const raw = safeGet(CHECKLIST_KEY);
  if (!raw) return { ...DEFAULT_CHECKLIST };
  try {
    return { ...DEFAULT_CHECKLIST, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CHECKLIST };
  }
}

export function saveChecklist(checklist: OnboardingChecklist): void {
  safeSet(CHECKLIST_KEY, JSON.stringify(checklist));
}

export function updateChecklistItem(key: keyof OnboardingChecklist, value: boolean): OnboardingChecklist {
  const next = { ...loadChecklist(), [key]: value };
  saveChecklist(next);
  return next;
}

export function resetOnboarding(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(POPUP_DISMISSED_KEY);
    localStorage.removeItem(TOUR_STARTED_KEY);
    localStorage.removeItem(CHECKLIST_KEY);
  } catch {
    /* ignore */
  }
}

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

// ────────────────────────────────────────────────────────────────────────────
// DemoFunnel — drives the gated sales-demo flow (demo build only).
// ────────────────────────────────────────────────────────────────────────────
// Flow:
//   1. Land on the marketing page (with a "Start the demo" popup).
//   2. Prospect requests a walkthrough by entering their info (required gate).
//   3. After submit, they unlock the guided interactive sandbox (read-only).
//   4. They can then Buy Now or Sign Up.
//
// Lead + unlock state is in-memory only (the sandboxed iframe blocks
// localStorage). It persists for the session.

export interface DemoLead {
  name: string;
  email: string;
  company: string;
  phone: string;
}

interface DemoFunnelValue {
  /** Whether the prospect has submitted the walkthrough request. */
  unlocked: boolean;
  /** The captured lead (if any). */
  lead: DemoLead | null;
  /** Record the lead and unlock the guided demo. */
  submitLead: (lead: DemoLead) => void;
  /** Reset the funnel (for testing / "start over"). */
  reset: () => void;
}

const Ctx = createContext<DemoFunnelValue | null>(null);

export function DemoFunnelProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [lead, setLead] = useState<DemoLead | null>(null);

  const submitLead = useCallback((l: DemoLead) => {
    setLead(l);
    setUnlocked(true);
  }, []);

  const reset = useCallback(() => {
    setLead(null);
    setUnlocked(false);
  }, []);

  const value = useMemo(() => ({ unlocked, lead, submitLead, reset }), [unlocked, lead, submitLead, reset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoFunnel(): DemoFunnelValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return { unlocked: false, lead: null, submitLead: () => {}, reset: () => {} };
  }
  return ctx;
}

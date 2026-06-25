// ────────────────────────────────────────────────────────────────────────────
// Guided interactive tour — script.
// ────────────────────────────────────────────────────────────────────────────
// Each step spotlights a real element (by data-tour selector) on a real page and
// narrates the value. The tour navigates between pages automatically. Written for
// a prospect (contractor owner) evaluating whether to buy.

export interface TourStep {
  /** Route to be on for this step. */
  route: string;
  /** CSS selector of the element to spotlight (data-tour=...). Empty = centered. */
  target?: string;
  title: string;
  body: string;
  /** Preferred placement of the callout relative to the target. */
  placement?: "top" | "bottom" | "left" | "right" | "center";
  /** Optional spoken/typed CTA emphasis for the final step. */
  isFinale?: boolean;
}

export const TOUR_STEPS: TourStep[] = [
  {
    route: "/",
    target: "",
    placement: "center",
    title: "Welcome to your command center",
    body:
      "This is ProfitPulse OS — the single screen where a contractor sees the whole business: cash, profit, pipeline, and risk. Let's take 60 seconds to walk through how an owner uses it every morning.",
  },
  {
    route: "/",
    target: '[data-tour="kpi-strip"]',
    placement: "bottom",
    title: "The numbers that matter, first",
    body:
      "Revenue, collected cash, cash on hand, net profit, margin, and runway — live, with month-over-month trend. No spreadsheets, no waiting on the bookkeeper.",
  },
  {
    route: "/",
    target: '[data-tour="health-score"]',
    placement: "right",
    title: "One score for the whole business",
    body:
      "ProfitPulse rolls dozens of signals into a single Financial Health Score, so you instantly know if you're trending up or sliding — and by how much.",
  },
  {
    route: "/",
    target: '[data-tour="alerts"]',
    placement: "left",
    title: "It tells you what needs attention",
    body:
      "Cash pinches, aging receivables, marketing waste, payroll risk — surfaced automatically. The system watches the business so you don't have to.",
  },
  {
    route: "/cash-flow",
    target: '[data-tour="cashflow-chart"]',
    placement: "left",
    title: "See a cash crunch before it happens",
    body:
      "A 90-day projection built from your scheduled AR and AP pinpoints the exact day cash gets tight — early enough to actually do something about it.",
  },
  {
    route: "/scenario-builder",
    target: '[data-tour="scenario-levers"]',
    placement: "right",
    title: "Model any decision, instantly",
    body:
      "Thinking about a new hire, a price increase, or more ad spend? Move the levers and watch profit, cash, and risk recompute in real time — before you commit a dollar.",
  },
  {
    route: "/marketing-roi",
    target: "",
    placement: "center",
    title: "Know what your marketing actually returns",
    body:
      "True ROI by channel, tied all the way to collected profit — so you double down on what works and cut what doesn't.",
  },
  {
    route: "/daily-briefing",
    target: "",
    placement: "center",
    title: "A CFO-grade briefing every morning",
    body:
      "What improved, what got worse, what needs action today, and the five moves that matter most — written for you automatically.",
  },
  {
    route: "/",
    target: "",
    placement: "center",
    isFinale: true,
    title: "This could be running your business",
    body:
      "Everything you just saw runs on your own accounting, CRM, and ad data. Start a free trial, or book a walkthrough and we'll set it up with you.",
  },
];

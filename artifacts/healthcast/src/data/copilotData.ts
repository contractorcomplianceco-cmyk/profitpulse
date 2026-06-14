export interface CopilotMetric {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}

export interface CopilotAnswer {
  id: string;
  question: string;
  category: string;
  headline: string;
  narrative: string[];
  metrics: CopilotMetric[];
  trend?: { label: string; points: { label: string; value: number }[] };
  followUps: string[];
}

export interface ProactiveInsight {
  id: string;
  severity: "positive" | "warning" | "risk";
  title: string;
  body: string;
  metricLabel: string;
  metricValue: string;
}

export interface RecentQuestion {
  question: string;
  askedAt: string;
}

export const copilotMeta = {
  model: "HealthCast Financial Intelligence v4",
  scope: "Live ledger, AR/AP, payroll, pipeline, and market feeds",
  lastSync: "2 minutes ago",
  questionsAnswered: 1284,
  avgResponse: "1.4s",
  confidence: 96,
};

export const suggestedPrompts: { label: string; targetId: string }[] = [
  { label: "How is cash flow trending this quarter?", targetId: "cash-trend" },
  { label: "Where are we losing the most margin?", targetId: "margin-leak" },
  { label: "What is driving the AR increase?", targetId: "ar-driver" },
  { label: "Can we afford the planned Q3 hiring?", targetId: "hiring-afford" },
  { label: "Which clients are the biggest churn risk?", targetId: "churn-risk" },
  { label: "How is marketing spend performing?", targetId: "marketing-roi" },
];

export const copilotAnswers: Record<string, CopilotAnswer> = {
  "cash-trend": {
    id: "cash-trend",
    question: "How is cash flow trending this quarter?",
    category: "Liquidity",
    headline: "Operating cash is up 14.3% QoQ, but the runway tightens in late May.",
    narrative: [
      "Net operating cash reached $2.40M, a $300K improvement over last quarter driven by faster enterprise collections and a 12% drop in marketing CPL.",
      "The model projects a temporary liquidity pinch around May 30 if the planned hiring and office lease both proceed on schedule. Delaying the lease expansion keeps the minimum balance above the $1.1M comfort floor.",
      "Free cash flow conversion improved to 71%, the strongest reading in five quarters, signaling healthier underlying operations rather than one-off timing gains.",
    ],
    metrics: [
      { label: "Operating Cash", value: "$2.40M", delta: "+14.3%", positive: true },
      { label: "FCF Conversion", value: "71%", delta: "+9 pts", positive: true },
      { label: "Projected Low Point", value: "$1.06M", delta: "May 30", positive: false },
      { label: "Runway", value: "4.7 mos", delta: "-0.3 mos", positive: false },
    ],
    trend: {
      label: "Projected Cash Balance (next 6 months, $M)",
      points: [
        { label: "Jan", value: 2.1 },
        { label: "Feb", value: 2.25 },
        { label: "Mar", value: 2.4 },
        { label: "Apr", value: 1.9 },
        { label: "May", value: 1.06 },
        { label: "Jun", value: 1.48 },
      ],
    },
    followUps: ["margin-leak", "hiring-afford", "ar-driver"],
  },
  "margin-leak": {
    id: "margin-leak",
    question: "Where are we losing the most margin?",
    category: "Profitability",
    headline: "Legacy Basic-tier accounts are eroding 4.2 points of blended gross margin.",
    narrative: [
      "Blended gross margin slipped to 58.4% as the Basic licensing tier grew in volume but carries a 31% delivery cost versus 14% on the Expedited tier.",
      "Three service lines account for 78% of the margin drag: manual document review, legacy renewals, and ad-hoc compliance audits. Each is below the 45% target margin.",
      "Re-pricing legacy renewals by 5% and shifting manual review to the automated workflow would recover an estimated $61K of quarterly contribution.",
    ],
    metrics: [
      { label: "Blended Margin", value: "58.4%", delta: "-4.2 pts", positive: false },
      { label: "Expedited Tier", value: "71%", delta: "On target", positive: true },
      { label: "Recoverable", value: "$61K/qtr", delta: "+5% reprice", positive: true },
      { label: "Worst Line", value: "Manual Review", delta: "29% margin", positive: false },
    ],
    trend: {
      label: "Gross Margin by Service Line (%)",
      points: [
        { label: "Expedited", value: 71 },
        { label: "Standard", value: 62 },
        { label: "Audits", value: 44 },
        { label: "Renewals", value: 38 },
        { label: "Manual", value: 29 },
      ],
    },
    followUps: ["cash-trend", "churn-risk", "marketing-roi"],
  },
  "ar-driver": {
    id: "ar-driver",
    question: "What is driving the AR increase?",
    category: "Collections",
    headline: "AR over 60 days now sits at 28% of the book, concentrated in five accounts.",
    narrative: [
      "Total AR is $487K, with $136K aged beyond 60 days. Five enterprise accounts represent 64% of that aged balance, all tied to a delayed milestone-billing dispute.",
      "Days Sales Outstanding rose to 42 days from 36, adding roughly 6 days of working-capital drag. Automating the 60-day dunning sequence historically recovers cash within 14 days.",
      "If the top two disputed invoices clear this week, DSO returns to the 37-day target and frees approximately $85K in immediate liquidity.",
    ],
    metrics: [
      { label: "Total AR", value: "$487K", delta: "+$42K", positive: false },
      { label: "AR > 60 days", value: "28%", delta: "+5 pts", positive: false },
      { label: "DSO", value: "42 days", delta: "+6 days", positive: false },
      { label: "Recoverable Now", value: "$85K", delta: "14-day window", positive: true },
    ],
    trend: {
      label: "AR Aging Buckets ($K)",
      points: [
        { label: "0-30", value: 248 },
        { label: "31-60", value: 103 },
        { label: "61-90", value: 84 },
        { label: "90+", value: 52 },
      ],
    },
    followUps: ["cash-trend", "churn-risk", "hiring-afford"],
  },
  "hiring-afford": {
    id: "hiring-afford",
    question: "Can we afford the planned Q3 hiring?",
    category: "Planning",
    headline: "The full plan is affordable only if the lease is deferred and AR normalizes.",
    narrative: [
      "The proposed eight hires add $94K in monthly burden, pushing payroll to 38% of revenue against the 30% target. Under the base case, runway falls below eight months.",
      "Phasing the plan into two waves of four, and deferring the office lease to Q4, keeps payroll burden at 33% and preserves an 11-month runway.",
      "Revenue-generating roles pay back within 4.5 months at current win rates, so prioritizing the three sales hires offers the strongest cash-adjusted return.",
    ],
    metrics: [
      { label: "Added Burden", value: "$94K/mo", delta: "Full plan", positive: false },
      { label: "Payroll Ratio", value: "38%", delta: "+8 pts", positive: false },
      { label: "Phased Runway", value: "11 mos", delta: "+3 mos", positive: true },
      { label: "Sales Payback", value: "4.5 mos", delta: "Fastest", positive: true },
    ],
    trend: {
      label: "Runway by Scenario (months)",
      points: [
        { label: "Freeze", value: 13 },
        { label: "Phased", value: 11 },
        { label: "Base", value: 7.5 },
        { label: "Full + Lease", value: 6 },
      ],
    },
    followUps: ["cash-trend", "margin-leak", "marketing-roi"],
  },
  "churn-risk": {
    id: "churn-risk",
    question: "Which clients are the biggest churn risk?",
    category: "Retention",
    headline: "Three mid-tier accounts worth $264K annualized show red health scores.",
    narrative: [
      "Apex Builders, Northgate Group, and Summit Contracting have each shown zero portal engagement for 14+ days and declining usage of core compliance features.",
      "Together they represent $22K in monthly recurring revenue. Historical patterns show this engagement profile precedes a cancellation within 45 days about 60% of the time.",
      "Proactive executive-sponsor outreach plus a tailored value review has recovered 7 of the last 9 comparable accounts.",
    ],
    metrics: [
      { label: "At-Risk MRR", value: "$22K", delta: "3 accounts", positive: false },
      { label: "Annualized", value: "$264K", delta: "Exposure", positive: false },
      { label: "Engagement", value: "0 logins", delta: "14+ days", positive: false },
      { label: "Save Rate", value: "78%", delta: "With outreach", positive: true },
    ],
    trend: {
      label: "Account Health Score (lower = higher risk)",
      points: [
        { label: "Apex", value: 31 },
        { label: "Northgate", value: 38 },
        { label: "Summit", value: 42 },
        { label: "Portfolio Avg", value: 74 },
      ],
    },
    followUps: ["margin-leak", "ar-driver", "marketing-roi"],
  },
  "marketing-roi": {
    id: "marketing-roi",
    question: "How is marketing spend performing?",
    category: "Growth",
    headline: "True collected ROI is 3.21x, with LinkedIn outperforming at 4.2x.",
    narrative: [
      "On a collected-profit basis, marketing returns $3.21 for every dollar spent, well above the 2.5x threshold. Cost per lead fell 12% to $24.60 across Meta channels.",
      "LinkedIn campaigns are the standout at 4.2x ROI and a 32-day payback period, suggesting room to responsibly double that budget line.",
      "Reallocating $5K from underperforming display to LinkedIn and Meta is projected to add 35 qualified leads next month at the current conversion rate.",
    ],
    metrics: [
      { label: "Collected ROI", value: "3.21x", delta: "+0.4x", positive: true },
      { label: "Cost per Lead", value: "$24.60", delta: "-12%", positive: true },
      { label: "Best Channel", value: "LinkedIn", delta: "4.2x ROI", positive: true },
      { label: "Payback", value: "32 days", delta: "-6 days", positive: true },
    ],
    trend: {
      label: "Collected ROI by Channel (x)",
      points: [
        { label: "LinkedIn", value: 4.2 },
        { label: "Meta", value: 3.4 },
        { label: "Search", value: 2.9 },
        { label: "Display", value: 1.6 },
      ],
    },
    followUps: ["margin-leak", "hiring-afford", "cash-trend"],
  },
};

export const proactiveInsights: ProactiveInsight[] = [
  {
    id: "pi-1",
    severity: "risk",
    title: "Liquidity pinch forming in late May",
    body: "Projected balance dips to $1.06M on May 30 if hiring and the lease both proceed. Deferring the lease keeps you above the comfort floor.",
    metricLabel: "Projected Low",
    metricValue: "$1.06M",
  },
  {
    id: "pi-2",
    severity: "warning",
    title: "Aged AR concentration rising",
    body: "Five accounts now hold 64% of balances over 60 days. Automated dunning historically recovers this within 14 days.",
    metricLabel: "Recoverable",
    metricValue: "$85K",
  },
  {
    id: "pi-3",
    severity: "positive",
    title: "LinkedIn channel ready to scale",
    body: "LinkedIn returns 4.2x collected ROI with a 32-day payback. Reallocating $5K could add 35 qualified leads next month.",
    metricLabel: "Channel ROI",
    metricValue: "4.2x",
  },
];

export const recentQuestions: RecentQuestion[] = [
  { question: "What is our current burn rate?", askedAt: "12m ago" },
  { question: "Compare Q2 revenue to forecast", askedAt: "48m ago" },
  { question: "Top 5 vendors by spend this month", askedAt: "2h ago" },
  { question: "How much can we safely spend this week?", askedAt: "Yesterday" },
  { question: "Effect of a 5% price increase on MRR", askedAt: "Yesterday" },
];

export type GoalStatus = "on-track" | "at-risk" | "behind" | "achieved";
export type GoalDirection = "higher" | "lower";

export interface KeyResult {
  id: string;
  metric: string;
  owner: string;
  unit: "currency" | "percent" | "months" | "days" | "count" | "ratio";
  baseline: number;
  current: number;
  target: number;
  status: GoalStatus;
  trend: number[];
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  category: string;
  period: "Q2 2025" | "FY 2025";
  owner: string;
  progress: number;
  status: GoalStatus;
  keyResults: KeyResult[];
}

export const quarterMeta = {
  label: "Q2 2025",
  startDate: "Apr 1 2025",
  endDate: "Jun 30 2025",
  timeElapsedPct: 58,
  daysRemaining: 38,
};

export const goalsSummary = {
  overallAttainment: { value: 71.4, priorValue: 64.2, trend: [52, 58, 64.2, 71.4] },
  objectivesOnTrack: { value: 5, total: 8 },
  keyResultsTracked: { value: 18, priorValue: 16, trend: [12, 14, 16, 18] },
  atRiskCount: { value: 3, priorValue: 5, trend: [6, 6, 5, 3] },
};

export const statusBreakdown = [
  { name: "On Track", value: 11, fill: "hsl(var(--success))" },
  { name: "At Risk", value: 4, fill: "hsl(var(--warning))" },
  { name: "Behind", value: 2, fill: "hsl(var(--destructive))" },
  { name: "Achieved", value: 1, fill: "hsl(var(--primary))" },
];

export const attainmentTrend = [
  { month: "Jan", target: 60, actual: 52 },
  { month: "Feb", target: 65, actual: 58 },
  { month: "Mar", target: 70, actual: 64 },
  { month: "Apr", target: 75, actual: 68 },
  { month: "May", target: 80, actual: 71 },
  { month: "Jun", target: 85, actual: 74 },
];

export const objectives: Objective[] = [
  {
    id: "obj-1",
    title: "Accelerate Profitable Revenue Growth",
    description: "Drive durable top-line expansion without sacrificing margin quality.",
    category: "Growth",
    period: "FY 2025",
    owner: "Dana Whitfield, CRO",
    progress: 78,
    status: "on-track",
    keyResults: [
      { id: "kr-1a", metric: "Annual Recurring Revenue", owner: "Dana Whitfield", unit: "currency", baseline: 4200000, current: 4980000, target: 5400000, status: "on-track", trend: [4200000, 4550000, 4780000, 4980000] },
      { id: "kr-1b", metric: "Gross Margin", owner: "Marcus Lee", unit: "percent", baseline: 65.2, current: 68.5, target: 72, status: "on-track", trend: [65.2, 66.4, 67.8, 68.5] },
      { id: "kr-1c", metric: "Net Revenue Retention", owner: "Priya Anand", unit: "percent", baseline: 104, current: 109, target: 115, status: "at-risk", trend: [104, 106, 108, 109] },
    ],
  },
  {
    id: "obj-2",
    title: "Strengthen Cash & Liquidity Position",
    description: "Extend runway and improve the speed of cash conversion.",
    category: "Liquidity",
    period: "Q2 2025",
    owner: "Marcus Lee, CFO",
    progress: 62,
    status: "at-risk",
    keyResults: [
      { id: "kr-2a", metric: "Operating Runway", owner: "Marcus Lee", unit: "months", baseline: 4.1, current: 4.7, target: 6, status: "at-risk", trend: [4.1, 4.3, 4.5, 4.7] },
      { id: "kr-2b", metric: "Days Sales Outstanding", owner: "Elena Cruz", unit: "days", baseline: 52, current: 44, target: 38, status: "on-track", trend: [52, 49, 46, 44] },
      { id: "kr-2c", metric: "Free Cash Flow", owner: "Marcus Lee", unit: "currency", baseline: 180000, current: 232000, target: 320000, status: "at-risk", trend: [180000, 198000, 214000, 232000] },
    ],
  },
  {
    id: "obj-3",
    title: "Improve Capital Efficiency of Demand Gen",
    description: "Lower acquisition cost while protecting pipeline coverage.",
    category: "Efficiency",
    period: "FY 2025",
    owner: "Priya Anand, VP Marketing",
    progress: 84,
    status: "on-track",
    keyResults: [
      { id: "kr-3a", metric: "Customer Acquisition Cost", owner: "Priya Anand", unit: "currency", baseline: 1380, current: 1122, target: 980, status: "on-track", trend: [1380, 1280, 1190, 1122] },
      { id: "kr-3b", metric: "Blended CAC Payback", owner: "Priya Anand", unit: "months", baseline: 14, current: 11, target: 9, status: "on-track", trend: [14, 13, 12, 11] },
      { id: "kr-3c", metric: "Marketing-Sourced Pipeline", owner: "Dana Whitfield", unit: "currency", baseline: 1800000, current: 2310000, target: 2600000, status: "on-track", trend: [1800000, 2010000, 2180000, 2310000] },
    ],
  },
  {
    id: "obj-4",
    title: "Scale the Team Responsibly",
    description: "Hire ahead of demand while holding fully-loaded cost per head.",
    category: "People",
    period: "FY 2025",
    owner: "Sofia Reyes, VP People",
    progress: 55,
    status: "behind",
    keyResults: [
      { id: "kr-4a", metric: "Total Headcount", owner: "Sofia Reyes", unit: "count", baseline: 142, current: 156, target: 178, status: "behind", trend: [142, 147, 152, 156] },
      { id: "kr-4b", metric: "Revenue per Employee", owner: "Marcus Lee", unit: "currency", baseline: 296000, current: 319000, target: 340000, status: "at-risk", trend: [296000, 304000, 312000, 319000] },
      { id: "kr-4c", metric: "Voluntary Attrition", owner: "Sofia Reyes", unit: "percent", baseline: 14, current: 11, target: 9, status: "on-track", trend: [14, 13, 12, 11] },
    ],
  },
];

export const pacingAlert = {
  title: "Pacing Behind Plan",
  message:
    "Operating Runway and Total Headcount are tracking below the time-elapsed pace for Q2. With 58% of the quarter gone, both key results need accelerated action to land on target by Jun 30.",
};

export const recommendedFocus = {
  title: "Prioritize Runway Recovery",
  description:
    "Pull forward $127K in collectible AR and defer two non-critical hires to lift Operating Runway back onto pace this quarter.",
  actionText: "Open Cash Flow Center",
};

export const objectiveInsight =
  "Growth and Efficiency objectives are outperforming pace, but the People objective is dragging overall attainment. Reallocating focus from hiring volume to revenue-per-employee would protect margin while closing the gap.";

export type CashEventType = "collection" | "payroll" | "tax" | "vendor" | "debt";

export interface CashEvent {
  id: string;
  date: string;
  dayOffset: number;
  label: string;
  detail: string;
  type: CashEventType;
  direction: "in" | "out";
  amount: number;
  confidence: "confirmed" | "expected" | "estimated";
}

export const openingBalance = 2_480_000;

export const cashEvents: CashEvent[] = [
  { id: "e01", date: "Day 2", dayOffset: 2, label: "Apex Construction", detail: "AR collection — Invoice #4821", type: "collection", direction: "in", amount: 185000, confidence: "expected" },
  { id: "e02", date: "Day 3", dayOffset: 3, label: "AWS & SaaS Stack", detail: "Monthly vendor bills", type: "vendor", direction: "out", amount: 42000, confidence: "confirmed" },
  { id: "e03", date: "Day 5", dayOffset: 5, label: "Bi-weekly Payroll", detail: "142 employees + contractors", type: "payroll", direction: "out", amount: 412000, confidence: "confirmed" },
  { id: "e04", date: "Day 8", dayOffset: 8, label: "BuildRight Group", detail: "AR collection — Invoice #4799", type: "collection", direction: "in", amount: 220000, confidence: "expected" },
  { id: "e05", date: "Day 10", dayOffset: 10, label: "Term Loan Service", detail: "Principal + interest", type: "debt", direction: "out", amount: 96000, confidence: "confirmed" },
  { id: "e06", date: "Day 12", dayOffset: 12, label: "Summit Builders", detail: "AR collection — Invoice #4830", type: "collection", direction: "in", amount: 138000, confidence: "estimated" },
  { id: "e07", date: "Day 15", dayOffset: 15, label: "Q3 Estimated Tax", detail: "Federal + state estimate", type: "tax", direction: "out", amount: 268000, confidence: "confirmed" },
  { id: "e08", date: "Day 15", dayOffset: 15, label: "Office & Equipment Lease", detail: "Monthly lease obligations", type: "vendor", direction: "out", amount: 54000, confidence: "confirmed" },
  { id: "e09", date: "Day 19", dayOffset: 19, label: "Bi-weekly Payroll", detail: "142 employees + contractors", type: "payroll", direction: "out", amount: 412000, confidence: "confirmed" },
  { id: "e10", date: "Day 22", dayOffset: 22, label: "Ironclad Developments", detail: "AR collection — Invoice #4844", type: "collection", direction: "in", amount: 312000, confidence: "expected" },
  { id: "e11", date: "Day 26", dayOffset: 26, label: "Material Suppliers", detail: "Batch vendor settlement", type: "vendor", direction: "out", amount: 128000, confidence: "expected" },
  { id: "e12", date: "Day 30", dayOffset: 30, label: "Cedar Park Partners", detail: "AR collection — Invoice #4851", type: "collection", direction: "in", amount: 176000, confidence: "expected" },
  { id: "e13", date: "Day 33", dayOffset: 33, label: "Bi-weekly Payroll", detail: "144 employees + contractors", type: "payroll", direction: "out", amount: 418000, confidence: "estimated" },
  { id: "e14", date: "Day 38", dayOffset: 38, label: "Apex Construction", detail: "AR collection — Invoice #4860", type: "collection", direction: "in", amount: 240000, confidence: "estimated" },
  { id: "e15", date: "Day 40", dayOffset: 40, label: "Term Loan Service", detail: "Principal + interest", type: "debt", direction: "out", amount: 96000, confidence: "confirmed" },
  { id: "e16", date: "Day 44", dayOffset: 44, label: "AWS & SaaS Stack", detail: "Monthly vendor bills", type: "vendor", direction: "out", amount: 43000, confidence: "expected" },
  { id: "e17", date: "Day 47", dayOffset: 47, label: "Bi-weekly Payroll", detail: "144 employees + contractors", type: "payroll", direction: "out", amount: 418000, confidence: "estimated" },
  { id: "e18", date: "Day 50", dayOffset: 50, label: "BuildRight Group", detail: "AR collection — Invoice #4872", type: "collection", direction: "in", amount: 265000, confidence: "estimated" },
  { id: "e19", date: "Day 55", dayOffset: 55, label: "Summit Builders", detail: "AR collection — Invoice #4881", type: "collection", direction: "in", amount: 158000, confidence: "estimated" },
  { id: "e20", date: "Day 58", dayOffset: 58, label: "Payroll Tax Deposit", detail: "Federal employment taxes", type: "tax", direction: "out", amount: 134000, confidence: "expected" },
  { id: "e21", date: "Day 61", dayOffset: 61, label: "Bi-weekly Payroll", detail: "146 employees + contractors", type: "payroll", direction: "out", amount: 424000, confidence: "estimated" },
  { id: "e22", date: "Day 64", dayOffset: 64, label: "Ironclad Developments", detail: "AR collection — Invoice #4890", type: "collection", direction: "in", amount: 298000, confidence: "estimated" },
  { id: "e23", date: "Day 68", dayOffset: 68, label: "Material Suppliers", detail: "Batch vendor settlement", type: "vendor", direction: "out", amount: 142000, confidence: "estimated" },
  { id: "e24", date: "Day 70", dayOffset: 70, label: "Term Loan Service", detail: "Principal + interest", type: "debt", direction: "out", amount: 96000, confidence: "confirmed" },
  { id: "e25", date: "Day 74", dayOffset: 74, label: "Cedar Park Partners", detail: "AR collection — Invoice #4902", type: "collection", direction: "in", amount: 204000, confidence: "estimated" },
  { id: "e26", date: "Day 75", dayOffset: 75, label: "Bi-weekly Payroll", detail: "146 employees + contractors", type: "payroll", direction: "out", amount: 424000, confidence: "estimated" },
  { id: "e27", date: "Day 80", dayOffset: 80, label: "Apex Construction", detail: "AR collection — Invoice #4910", type: "collection", direction: "in", amount: 232000, confidence: "estimated" },
  { id: "e28", date: "Day 84", dayOffset: 84, label: "Office & Equipment Lease", detail: "Monthly lease obligations", type: "vendor", direction: "out", amount: 54000, confidence: "expected" },
  { id: "e29", date: "Day 88", dayOffset: 88, label: "BuildRight Group", detail: "AR collection — Invoice #4921", type: "collection", direction: "in", amount: 188000, confidence: "estimated" },
  { id: "e30", date: "Day 89", dayOffset: 89, label: "Bi-weekly Payroll", detail: "148 employees + contractors", type: "payroll", direction: "out", amount: 430000, confidence: "estimated" },
];

export interface EventTypeMeta {
  type: CashEventType;
  label: string;
  direction: "in" | "out";
  color: string;
}

export const eventTypeMeta: EventTypeMeta[] = [
  { type: "collection", label: "AR Collections", direction: "in", color: "hsl(var(--success))" },
  { type: "payroll", label: "Payroll Runs", direction: "out", color: "hsl(var(--destructive))" },
  { type: "tax", label: "Tax Payments", direction: "out", color: "hsl(35 92% 55%)" },
  { type: "vendor", label: "Vendor Bills", direction: "out", color: "hsl(var(--cyan))" },
  { type: "debt", label: "Debt Service", direction: "out", color: "hsl(280 70% 62%)" },
];

const sortedEvents = [...cashEvents].sort((a, b) => a.dayOffset - b.dayOffset);

let runningBalance = openingBalance;
export const eventsWithBalance = sortedEvents.map((event) => {
  runningBalance += event.direction === "in" ? event.amount : -event.amount;
  return { ...event, balanceAfter: runningBalance };
});

export const closingBalance = runningBalance;

export const totalInflow = cashEvents
  .filter((e) => e.direction === "in")
  .reduce((sum, e) => sum + e.amount, 0);

export const totalOutflow = cashEvents
  .filter((e) => e.direction === "out")
  .reduce((sum, e) => sum + e.amount, 0);

export const netCashFlow = totalInflow - totalOutflow;

const lowest = eventsWithBalance.reduce(
  (min, e) => (e.balanceAfter < min.balanceAfter ? e : min),
  eventsWithBalance[0]
);
export const lowestBalance = lowest.balanceAfter;
export const lowestBalanceDate = lowest.date;

const biggestInflow = eventsWithBalance
  .filter((e) => e.direction === "in")
  .reduce((max, e) => (e.amount > max.amount ? e : max));
const biggestOutflow = eventsWithBalance
  .filter((e) => e.direction === "out")
  .reduce((max, e) => (e.amount > max.amount ? e : max));

export const biggestInflowDay = biggestInflow;
export const biggestOutflowDay = biggestOutflow;

export const balanceTrend = [
  { date: "Today", balance: openingBalance },
  ...eventsWithBalance
    .filter((_, i) => i % 2 === 0 || i === eventsWithBalance.length - 1)
    .map((e) => ({ date: e.date, balance: e.balanceAfter })),
];

export const typeTotals = eventTypeMeta.map((meta) => {
  const total = cashEvents
    .filter((e) => e.type === meta.type)
    .reduce((sum, e) => sum + e.amount, 0);
  const count = cashEvents.filter((e) => e.type === meta.type).length;
  return { ...meta, total, count };
});

export const lowBalanceThreshold = 1_500_000;

export const briefingData = {
  date: new Date().toISOString(),
  whatImproved: [
    "Collected revenue increased by $100k week-over-week, hitting $1.15M.",
    "Marketing CPL dropped 12% across Meta channels.",
    "Time-to-close on enterprise compliance deals shortened by 4 days."
  ],
  whatGotWorse: [
    "AR over 60 days aged further, now comprising 28% of total AR.",
    "Payroll burden crept to 34% of revenue (target: 30%).",
    "Churn on legacy basic tier increased by 2.1%."
  ],
  whatNeedsActionToday: [
    "Approve $15k AP run for key software vendors to maintain active status.",
    "Authorize standard collections agency escalation for 5 accounts >90 days past due.",
    "Sign off on Q3 adjusted sales compensation plan."
  ],
  whatsAtRisk: [
    "Cash runway projection drops below 8 months if current hiring plan proceeds.",
    "Major client 'Apex Builders' (representing $22k/mo MRR) is marked red in CRM health score."
  ],
  whatOpportunityToPush: [
    "New 'Expedited Licensing' tier is seeing 40% attach rate; push sales to default pitch this tier.",
    "Zoho Ads integration shows LinkedIn campaigns yielding 4.2x ROI. Opportunity to double spend."
  ],
  whatDecisionShouldWait: [
    "Delaying office lease expansion until Q4 given current cash priorities.",
    "Hold off on hiring Senior Marketing Manager until current campaigns plateau."
  ],
  top5Actions: [
    { text: "Approve automated collections sequence for 60+ days AR", impact: "Frees up ~$85k in immediate cash flow within 14 days." },
    { text: "Adjust Meta Ads budget allocation +$5k", impact: "Capitalizes on 12% lower CPL, projected to generate 35 additional qualified leads." },
    { text: "Implement hiring freeze on non-revenue roles", impact: "Defends cash runway and brings payroll burden back toward 30% target." },
    { text: "Initiate outreach to Apex Builders executive sponsor", impact: "Protects $264k annualized revenue from high-risk churn." },
    { text: "Approve 5% price increase on new contracts", impact: "Flows directly to bottom line, estimated $45k additional MRR by year-end." }
  ],
  kpis: {
    revenue: { value: 1250000, prior: 1180000 },
    cash: { value: 2400000, prior: 2100000 },
    ar: { value: 420000, prior: 480000 }
  },
  trendData: [
    { day: "Mon", score: 85 },
    { day: "Tue", score: 86 },
    { day: "Wed", score: 88 },
    { day: "Thu", score: 91 },
    { day: "Fri", score: 92 },
  ]
};

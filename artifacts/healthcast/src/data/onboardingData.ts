export interface OnboardingSection {
  id: string;
  title: string;
  description: string;
  route: string;
  audioFile: string;
}

export const onboardingSections: OnboardingSection[] = [
  {
    id: "executive-overview",
    title: "Executive Overview",
    description: "Every financial vital sign in one real-time view.",
    route: "/",
    audioFile: "narration-1.mp3",
  },
  {
    id: "copilot",
    title: "AI CFO Copilot",
    description: "Ask any question, get instant data-backed answers.",
    route: "/copilot",
    audioFile: "narration-2.mp3",
  },
  {
    id: "cash-flow",
    title: "Cash Flow",
    description: "Track money in and out and protect your runway.",
    route: "/cash-flow",
    audioFile: "narration-3.mp3",
  },
  {
    id: "scenario-builder",
    title: "Scenario Builder",
    description: "Model what-if decisions and see live impact.",
    route: "/scenario-builder",
    audioFile: "narration-4.mp3",
  },
  {
    id: "futurecast",
    title: "Futurecast",
    description: "Forward-looking projections of where you're heading.",
    route: "/futurecast",
    audioFile: "narration-5.mp3",
  },
  {
    id: "compliance",
    title: "Compliance & Risk Center",
    description: "Stay audit-ready with licenses, filings, and a live risk register.",
    route: "/compliance",
    audioFile: "narration-6.mp3",
  },
  {
    id: "alerts",
    title: "Alerts",
    description: "Automated warnings before issues escalate.",
    route: "/alerts",
    audioFile: "narration-7.mp3",
  }
];

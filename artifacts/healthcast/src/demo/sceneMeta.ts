/** Rose demo walkthrough — scene order, labels, on-screen captions, timings. */

export type SceneKey =
  | "opening"
  | "problem"
  | "insight"
  | "workflow"
  | "alert"
  | "outcome"
  | "closing";

export interface SceneMeta {
  key: SceneKey;
  /** Short label shown in the progress UI */
  label: string;
  /** On-screen caption (narration companion — not read from DOM) */
  caption: string;
  durationMs: number;
}

export const ROSE_SCENES: SceneMeta[] = [
  {
    key: "opening",
    label: "Command view",
    caption: "ProfitPulse brings your whole business into one executive command view.",
    durationMs: 11_000,
  },
  {
    key: "problem",
    label: "Profit leakage",
    caption: "Margins slip when revenue, job costs, and overhead live in disconnected systems.",
    durationMs: 12_000,
  },
  {
    key: "insight",
    label: "Live insight",
    caption: "Revenue, costs, margin, and risk — highlighted the moment they move.",
    durationMs: 13_000,
  },
  {
    key: "workflow",
    label: "Team workflow",
    caption: "Owners and ops leads review jobs, accounts, and projects in one shared workflow.",
    durationMs: 12_000,
  },
  {
    key: "alert",
    label: "Smart alert",
    caption: "AI-style recommendations surface what to fix before profit erodes.",
    durationMs: 12_000,
  },
  {
    key: "outcome",
    label: "Protected profit",
    caption: "Clear decisions, faster action, and margin you can defend.",
    durationMs: 11_000,
  },
  {
    key: "closing",
    label: "Rose demo",
    caption: "ProfitPulse is ready for your Rose demo — sample data only, no login required.",
    durationMs: 10_000,
  },
];

export const SCENE_DURATIONS: Record<SceneKey, number> = Object.fromEntries(
  ROSE_SCENES.map((s) => [s.key, s.durationMs]),
) as Record<SceneKey, number>;

export function sceneMetaFor(key: string): SceneMeta | undefined {
  return ROSE_SCENES.find((s) => s.key === key);
}

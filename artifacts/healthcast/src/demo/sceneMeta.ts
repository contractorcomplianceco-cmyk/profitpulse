/** Rose demo walkthrough — scene order, labels, on-screen captions, timings. */

export type SceneKey =
  | "opening"
  | "problem"
  | "dashboard"
  | "workflow"
  | "insight"
  | "outcome"
  | "closing";

export interface SceneMeta {
  key: SceneKey;
  index: number;
  label: string;
  caption: string;
  durationMs: number;
}

export const ROSE_SCENES: SceneMeta[] = [
  {
    key: "opening",
    index: 1,
    label: "Command view",
    caption:
      "ProfitPulse is your executive command view — cash, margin, pipeline, and risk in one place.",
    durationMs: 13_000,
  },
  {
    key: "problem",
    index: 2,
    label: "The problem",
    caption:
      "Profit leaks when margins are unclear and visibility arrives weeks too late.",
    durationMs: 12_500,
  },
  {
    key: "dashboard",
    index: 3,
    label: "Live dashboard",
    caption:
      "Revenue, costs, margin, and risk — illustrated with sample contractor data and trend cards.",
    durationMs: 12_500,
  },
  {
    key: "workflow",
    index: 4,
    label: "Team workflow",
    caption:
      "Leaders review jobs, projects, and accounts together — one shared workflow, no blind spots.",
    durationMs: 12_500,
  },
  {
    key: "insight",
    index: 5,
    label: "Margin insight",
    caption:
      "Sample AI-style guidance shows how margin alerts could look — illustrative, not live AI.",
    durationMs: 17_500,
  },
  {
    key: "outcome",
    index: 6,
    label: "The outcome",
    caption:
      "Illustrative outcomes — sharper pricing, protected margin, and leadership visibility.",
    durationMs: 11_500,
  },
  {
    key: "closing",
    index: 7,
    label: "Rose demo",
    caption:
      "Product demo — sample data only, no login, no live integrations.",
    durationMs: 13_500,
  },
];

export const SCENE_COUNT = ROSE_SCENES.length;

export const SCENE_DURATIONS: Record<SceneKey, number> = Object.fromEntries(
  ROSE_SCENES.map((s) => [s.key, s.durationMs]),
) as Record<SceneKey, number>;

export function sceneMetaFor(key: string): SceneMeta | undefined {
  return ROSE_SCENES.find((s) => s.key === key);
}

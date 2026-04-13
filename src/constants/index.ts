// Scoring
export const SCORING_WEIGHTS = {
  impact: 0.35,
  aiLeverage: 0.25,
  quality: 0.4,
} as const;

export const SCORE_COLORS = {
  red: { min: 0, max: 40, color: "score-red" },
  yellow: { min: 40, max: 70, color: "score-yellow" },
  green: { min: 70, max: 100, color: "score-green" },
} as const;

export function getScoreColor(score: number): string {
  if (score < SCORE_COLORS.red.max) return SCORE_COLORS.red.color;
  if (score < SCORE_COLORS.yellow.max) return SCORE_COLORS.yellow.color;
  return SCORE_COLORS.green.color;
}

// Static class map — Tailwind cannot detect dynamically constructed class names
const SCORE_CLASS_MAP = {
  "score-red": { text: "text-score-red", bg: "bg-score-red" },
  "score-yellow": { text: "text-score-yellow", bg: "bg-score-yellow" },
  "score-green": { text: "text-score-green", bg: "bg-score-green" },
} as const;

export function getScoreClasses(score: number) {
  const token = getScoreColor(score) as keyof typeof SCORE_CLASS_MAP;
  return SCORE_CLASS_MAP[token];
}

// GitHub
export const GITHUB_API_BASE = "https://api.github.com";
export const MAX_PRS_TO_ANALYZE = 5;

export const PR_TYPE_PREFIXES = [
  "feat",
  "fix",
  "chore",
  "docs",
  "refactor",
  "style",
  "test",
  "perf",
] as const;

export type PRTypePrefix = (typeof PR_TYPE_PREFIXES)[number];

export const PR_SCOPES = ["all", "merged", "open", "closed"] as const;

export type PRScope = (typeof PR_SCOPES)[number];

// Cache
export const CACHE_TTL_MS = 3_600_000; // 1 hour

// Analysis
export const ANALYSIS_TIMEOUT_MS = 60_000; // 60s

// App
export const APP_NAME = "PR Analyzer";
export const APP_DESCRIPTION =
  "Analyze GitHub pull requests. Score PRs on Impact, AI-Leverage, and Quality.";
export const APP_URL = "https://pr-analyzer.vercel.app";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthorCard } from "./AuthorCard";
import type { PRAnalysis } from "@/types/scoring";

const mockPrs: PRAnalysis[] = [
  {
    number: 42,
    title: "feat: streaming SSR",
    author: "octocat",
    description: "Streaming SSR",
    state: "closed",
    mergedAt: "2026-02-12T09:15:00.000Z",
    filesChanged: 12,
    additions: 340,
    deletions: 85,
    scores: { impact: 88, aiLeverage: 72, quality: 91, total: 85 },
    summary: "Streaming SSR with Suspense.",
  },
  {
    number: 38,
    title: "fix: memory leak",
    author: "octocat",
    description: "Leak fix",
    state: "open",
    mergedAt: null,
    filesChanged: 3,
    additions: 25,
    deletions: 10,
    scores: { impact: 70, aiLeverage: 55, quality: 80, total: 71 },
    summary: "Fixes WS handler leak.",
  },
  {
    number: 30,
    title: "chore: deps",
    author: "octocat",
    description: "Dependency updates",
    state: "closed",
    mergedAt: null,
    filesChanged: 2,
    additions: 150,
    deletions: 140,
    scores: { impact: 40, aiLeverage: 30, quality: 60, total: 45 },
    summary: "Routine dependency update.",
  },
];

const meta = {
  title: "Dashboard/AuthorCard",
  component: AuthorCard,
  parameters: { layout: "padded" },
  args: {
    stats: {
      author: "octocat",
      prCount: 3,
      avgScores: { impact: 66, aiLeverage: 52, quality: 77, total: 66 },
      prs: [42, 38, 30],
    },
    prs: mockPrs,
    repoAvg: { impact: 70, aiLeverage: 60, quality: 75, total: 68 },
  },
} satisfies Meta<typeof AuthorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HighScorer: Story = {
  args: {
    stats: {
      author: "mona",
      prCount: 5,
      avgScores: { impact: 92, aiLeverage: 88, quality: 95, total: 92 },
      prs: [1, 2, 3, 4, 5],
    },
  },
};

export const SinglePR: Story = {
  args: {
    stats: {
      author: "hubot",
      prCount: 1,
      avgScores: { impact: 55, aiLeverage: 40, quality: 62, total: 54 },
      prs: [99],
    },
    prs: [
      {
        number: 99,
        title: "fix: typo",
        author: "hubot",
        description: "Typo",
        state: "open",
        mergedAt: null,
        filesChanged: 1,
        additions: 1,
        deletions: 1,
        scores: { impact: 55, aiLeverage: 40, quality: 62, total: 54 },
        summary: "Typo fix.",
      },
    ],
  },
};

export const MixedStates: Story = {
  args: {
    stats: {
      author: "dev-team",
      prCount: 4,
      avgScores: { impact: 60, aiLeverage: 50, quality: 70, total: 61 },
      prs: [1, 2, 3, 4],
    },
    prs: [
      {
        number: 1,
        title: "feat: a",
        author: "dev-team",
        description: "",
        state: "closed",
        mergedAt: "2026-02-01T00:00:00.000Z",
        filesChanged: 5,
        additions: 100,
        deletions: 20,
        scores: { impact: 70, aiLeverage: 60, quality: 80, total: 72 },
        summary: "",
      },
      {
        number: 2,
        title: "feat: b",
        author: "dev-team",
        description: "",
        state: "closed",
        mergedAt: "2026-02-05T00:00:00.000Z",
        filesChanged: 3,
        additions: 50,
        deletions: 10,
        scores: { impact: 60, aiLeverage: 55, quality: 70, total: 62 },
        summary: "",
      },
      {
        number: 3,
        title: "fix: c",
        author: "dev-team",
        description: "",
        state: "open",
        mergedAt: null,
        filesChanged: 2,
        additions: 30,
        deletions: 5,
        scores: { impact: 50, aiLeverage: 40, quality: 65, total: 53 },
        summary: "",
      },
      {
        number: 4,
        title: "chore: d",
        author: "dev-team",
        description: "",
        state: "closed",
        mergedAt: null,
        filesChanged: 1,
        additions: 10,
        deletions: 10,
        scores: { impact: 60, aiLeverage: 45, quality: 65, total: 57 },
        summary: "",
      },
    ],
  },
};

export const LowScorer: Story = {
  args: {
    stats: {
      author: "newcomer",
      prCount: 2,
      avgScores: { impact: 25, aiLeverage: 15, quality: 35, total: 26 },
      prs: [10, 11],
    },
  },
};

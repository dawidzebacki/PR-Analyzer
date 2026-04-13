import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AuthorStats } from "./AuthorStats";
import type { AuthorStats as AuthorStatsType, PRAnalysis } from "@/types/scoring";

const mockPrs: PRAnalysis[] = [
  {
    number: 42,
    title: "feat: streaming SSR",
    author: "octocat",
    description: "",
    state: "closed",
    mergedAt: "2026-02-12T09:15:00.000Z",
    filesChanged: 12,
    additions: 340,
    deletions: 85,
    scores: { impact: 88, aiLeverage: 72, quality: 91, total: 85 },
    summary: "",
  },
  {
    number: 38,
    title: "fix: memory leak",
    author: "octocat",
    description: "",
    state: "open",
    mergedAt: null,
    filesChanged: 3,
    additions: 25,
    deletions: 10,
    scores: { impact: 70, aiLeverage: 55, quality: 80, total: 71 },
    summary: "",
  },
  {
    number: 35,
    title: "feat: RBAC",
    author: "mona",
    description: "",
    state: "closed",
    mergedAt: "2026-02-08T08:00:00.000Z",
    filesChanged: 8,
    additions: 220,
    deletions: 30,
    scores: { impact: 95, aiLeverage: 90, quality: 97, total: 95 },
    summary: "",
  },
  {
    number: 30,
    title: "chore: deps",
    author: "hubot",
    description: "",
    state: "closed",
    mergedAt: null,
    filesChanged: 2,
    additions: 150,
    deletions: 140,
    scores: { impact: 20, aiLeverage: 15, quality: 40, total: 27 },
    summary: "",
  },
];

const mockAuthorStats: AuthorStatsType[] = [
  {
    author: "octocat",
    prCount: 2,
    avgScores: { impact: 79, aiLeverage: 64, quality: 86, total: 78 },
    prs: [42, 38],
  },
  {
    author: "mona",
    prCount: 1,
    avgScores: { impact: 95, aiLeverage: 90, quality: 97, total: 95 },
    prs: [35],
  },
  {
    author: "hubot",
    prCount: 1,
    avgScores: { impact: 20, aiLeverage: 15, quality: 40, total: 27 },
    prs: [30],
  },
];

const meta = {
  title: "Dashboard/AuthorStats",
  component: AuthorStats,
  parameters: { layout: "padded" },
  args: {
    authorStats: mockAuthorStats,
    prs: mockPrs,
    repoAvg: { impact: 68, aiLeverage: 58, quality: 77, total: 68 },
  },
} satisfies Meta<typeof AuthorStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleAuthor: Story = {
  args: {
    authorStats: [mockAuthorStats[0]],
    prs: mockPrs.filter((p) => p.author === "octocat"),
  },
};

export const SinglePRMode: Story = {
  args: {
    authorStats: [
      {
        author: "solo-dev",
        prCount: 1,
        avgScores: { impact: 70, aiLeverage: 55, quality: 80, total: 71 },
        prs: [123],
      },
    ],
    prs: [
      {
        number: 123,
        title: "feat: ship it",
        author: "solo-dev",
        description: "",
        state: "open",
        mergedAt: null,
        filesChanged: 4,
        additions: 80,
        deletions: 20,
        scores: { impact: 70, aiLeverage: 55, quality: 80, total: 71 },
        summary: "",
      },
    ],
  },
};

export const ManyAuthors: Story = {
  args: {
    authorStats: [
      ...mockAuthorStats,
      {
        author: "alice",
        prCount: 3,
        avgScores: { impact: 60, aiLeverage: 50, quality: 70, total: 61 },
        prs: [50, 51, 52],
      },
      {
        author: "bob",
        prCount: 2,
        avgScores: { impact: 45, aiLeverage: 40, quality: 55, total: 48 },
        prs: [60, 61],
      },
    ],
  },
};

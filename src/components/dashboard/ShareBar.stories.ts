import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ShareBar } from "./ShareBar";
import type { RepoAnalysis } from "@/types/scoring";

const baseAnalysis: RepoAnalysis = {
  repoUrl: "https://github.com/vercel/next.js",
  repoName: "vercel/next.js",
  analyzedAt: new Date().toISOString(),
  totalScore: 82,
  scores: {
    impact: 84,
    aiLeverage: 76,
    quality: 85,
    total: 82,
  },
  prs: [
    {
      number: 12345,
      title: "feat: add streaming SSR",
      author: "leerob",
      description: "Adds streaming support.",
      state: "closed",
      mergedAt: new Date().toISOString(),
      filesChanged: 12,
      additions: 240,
      deletions: 80,
      scores: { impact: 90, aiLeverage: 60, quality: 85, total: 82 },
      summary: "Well-scoped streaming SSR support.",
    },
  ],
  recommendations: [],
  authorStats: [],
};

const meta = {
  title: "Dashboard/ShareBar",
  component: ShareBar,
  parameters: { layout: "padded" },
  args: {
    analysis: baseAnalysis,
  },
} satisfies Meta<typeof ShareBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SinglePR: Story = {
  args: {
    analysis: {
      ...baseAnalysis,
      repoUrl: "https://github.com/vercel/next.js/pull/12345",
      prs: [baseAnalysis.prs[0]],
    },
  },
};

export const LowScore: Story = {
  args: {
    analysis: {
      ...baseAnalysis,
      totalScore: 34,
      scores: { impact: 30, aiLeverage: 28, quality: 40, total: 34 },
    },
  },
};

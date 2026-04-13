import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PRList } from "./PRList";
import type { PRAnalysis } from "@/types/scoring";

const mockPrs: PRAnalysis[] = [
  {
    number: 42,
    title: "feat: add streaming SSR support",
    author: "octocat",
    description: "Streaming SSR with Suspense",
    state: "closed",
    mergedAt: "2026-02-12T09:15:00.000Z",
    filesChanged: 12,
    additions: 340,
    deletions: 85,
    scores: { impact: 88, aiLeverage: 72, quality: 91, total: 85 },
    summary: "Introduces streaming SSR support for React Server Components with progressive rendering and Suspense boundaries.",
  },
  {
    number: 38,
    title: "fix: resolve memory leak in WebSocket handler",
    author: "mona",
    description: "Memory leak fix",
    state: "closed",
    mergedAt: "2026-02-08T14:42:00.000Z",
    filesChanged: 3,
    additions: 25,
    deletions: 10,
    scores: { impact: 75, aiLeverage: 60, quality: 85, total: 76 },
    summary: "Fixes a memory leak caused by uncleared event listeners in the WebSocket reconnection logic.",
  },
  {
    number: 35,
    title: "feat: implement auth middleware with RBAC",
    author: "hubot",
    description: "RBAC implementation",
    state: "open",
    mergedAt: null,
    filesChanged: 8,
    additions: 220,
    deletions: 30,
    scores: { impact: 95, aiLeverage: 90, quality: 97, total: 95 },
    summary: "Complete RBAC middleware with role-based access control, session management, and comprehensive audit logging.",
  },
  {
    number: 30,
    title: "chore: update dependencies to latest",
    author: "octocat",
    description: "Dependency updates",
    state: "closed",
    mergedAt: "2026-01-20T11:00:00.000Z",
    filesChanged: 2,
    additions: 150,
    deletions: 140,
    scores: { impact: 20, aiLeverage: 15, quality: 40, total: 27 },
    summary: "Routine dependency update including security patches for lodash and express.",
  },
  {
    number: 25,
    title: "refactor: extract validation into shared utils",
    author: "mona",
    description: "Validation refactor",
    state: "closed",
    mergedAt: null,
    filesChanged: 6,
    additions: 95,
    deletions: 120,
    scores: { impact: 50, aiLeverage: 45, quality: 60, total: 53 },
    summary: "Extracts duplicated validation logic from API routes into a shared utility module.",
  },
];

const meta = {
  title: "Dashboard/PRList",
  component: PRList,
  parameters: {
    layout: "padded",
  },
  args: {
    prs: mockPrs,
    repoUrl: "https://github.com/vercel/next.js",
  },
} satisfies Meta<typeof PRList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SinglePR: Story = {
  args: {
    prs: [mockPrs[0]],
  },
};

export const Empty: Story = {
  args: {
    prs: [],
  },
};

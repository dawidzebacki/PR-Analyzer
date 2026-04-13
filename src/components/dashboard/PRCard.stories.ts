import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PRCard } from "./PRCard";

const meta = {
  title: "Dashboard/PRCard",
  component: PRCard,
  parameters: {
    layout: "padded",
  },
  args: {
    repoUrl: "https://github.com/vercel/next.js",
    pr: {
      number: 42,
      title: "feat: add streaming SSR support for React Server Components",
      author: "octocat",
      description: "Implements streaming SSR with Suspense boundaries",
      state: "closed",
      mergedAt: "2026-02-12T09:15:00.000Z",
      filesChanged: 12,
      additions: 340,
      deletions: 85,
      scores: {
        impact: 88,
        aiLeverage: 72,
        quality: 91,
        total: 85,
      },
      summary:
        "This PR introduces streaming SSR support for React Server Components, enabling progressive rendering with Suspense boundaries. Key changes include a new streaming renderer, updated hydration logic, and comprehensive test coverage.",
    },
  },
} satisfies Meta<typeof PRCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const HighScores: Story = {
  args: {
    pr: {
      number: 10,
      title: "feat: implement auth middleware with RBAC",
      author: "mona",
      description: "Full RBAC implementation",
      state: "closed",
      mergedAt: "2026-02-01T08:00:00.000Z",
      filesChanged: 8,
      additions: 220,
      deletions: 30,
      scores: {
        impact: 95,
        aiLeverage: 90,
        quality: 97,
        total: 95,
      },
      summary: "Complete RBAC middleware with role-based access control, session management, and audit logging.",
    },
  },
};

export const LowScores: Story = {
  args: {
    pr: {
      number: 99,
      title: "fix: typo in readme",
      author: "hubot",
      description: "Fixed a typo",
      state: "open",
      mergedAt: null,
      filesChanged: 1,
      additions: 1,
      deletions: 1,
      scores: {
        impact: 15,
        aiLeverage: 10,
        quality: 25,
        total: 18,
      },
      summary: "Corrected a minor typo in the README file.",
    },
  },
};

export const MediumScores: Story = {
  args: {
    pr: {
      number: 55,
      title: "refactor: extract validation logic into shared utilities",
      author: "octocat",
      description: "Refactoring validation",
      state: "closed",
      mergedAt: "2026-01-25T16:30:00.000Z",
      filesChanged: 6,
      additions: 95,
      deletions: 120,
      scores: {
        impact: 50,
        aiLeverage: 45,
        quality: 60,
        total: 53,
      },
      summary: "Extracts duplicated validation logic from three different API routes into a shared utility module with proper error types.",
    },
  },
};

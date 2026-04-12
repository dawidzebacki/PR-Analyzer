import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RepoHeader } from "./RepoHeader";

const meta = {
  title: "Dashboard/RepoHeader",
  component: RepoHeader,
  parameters: {
    layout: "padded",
  },
  args: {
    repoName: "vercel/next.js",
    repoUrl: "https://github.com/vercel/next.js",
    analyzedAt: "2026-04-12T10:30:00Z",
    prCount: 15,
  },
} satisfies Meta<typeof RepoHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongRepoName: Story = {
  args: {
    repoName: "organization-name/very-long-repository-name-example",
    repoUrl: "https://github.com/organization-name/very-long-repository-name-example",
  },
};

export const SinglePR: Story = {
  args: {
    prCount: 1,
  },
};

export const MaxPRs: Story = {
  args: {
    prCount: 20,
  },
};

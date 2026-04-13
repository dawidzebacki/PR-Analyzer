import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErrorState } from "./ErrorState";

const meta = {
  title: "Shared/ErrorState",
  component: ErrorState,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "INVALID_URL",
        "REPO_NOT_FOUND",
        "REPO_PRIVATE",
        "NO_PRS",
        "PR_NOT_FOUND",
        "GITHUB_RATE_LIMIT",
        "AI_RATE_LIMIT",
        "AI_TOO_LARGE",
        "AI_AUTH_ERROR",
        "ANALYSIS_FAILED",
        "EXPIRED",
      ],
    },
  },
  args: {
    variant: "INVALID_URL",
    actionHref: "/",
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InvalidUrl: Story = {
  args: { variant: "INVALID_URL" },
};

export const RepoNotFound: Story = {
  args: { variant: "REPO_NOT_FOUND" },
};

export const RepoPrivate: Story = {
  args: { variant: "REPO_PRIVATE" },
};

export const NoPrs: Story = {
  args: { variant: "NO_PRS" },
};

export const PrNotFound: Story = {
  args: { variant: "PR_NOT_FOUND" },
};

export const GithubRateLimit: Story = {
  args: { variant: "GITHUB_RATE_LIMIT" },
};

export const AiRateLimit: Story = {
  args: { variant: "AI_RATE_LIMIT" },
};

export const AiTooLarge: Story = {
  args: { variant: "AI_TOO_LARGE" },
};

export const AiAuthError: Story = {
  args: { variant: "AI_AUTH_ERROR" },
};

export const AnalysisFailed: Story = {
  args: { variant: "ANALYSIS_FAILED" },
};

export const Expired: Story = {
  args: { variant: "EXPIRED" },
};

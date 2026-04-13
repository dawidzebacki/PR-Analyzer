import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Recommendations } from "./Recommendations";

const meta = {
  title: "Dashboard/Recommendations",
  component: Recommendations,
  parameters: { layout: "padded" },
  args: {
    recommendations: [
      "Break up larger pull requests — focused PRs under 300 lines get merged faster and are easier to review.",
      "Add more descriptive PR titles and summaries to help reviewers understand intent.",
      "Increase AI-assisted development by leveraging Copilot or Claude for boilerplate generation.",
      "Cover critical paths with integration tests before merging — quality scores drop when tests are missing.",
    ],
  },
} satisfies Meta<typeof Recommendations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoRecommendations: Story = {
  args: {
    recommendations: [
      "Split the diff into smaller, themed commits so reviewers can follow the intent.",
      "Add a short description explaining the why behind the change.",
    ],
  },
};

export const ThreeRecommendations: Story = {
  args: {
    recommendations: [
      "Keep commits under 400 lines to speed up review cycles.",
      "Use conventional commit prefixes (feat, fix, chore) for clearer changelogs.",
      "Document new public APIs inline so downstream consumers know how to use them.",
    ],
  },
};

export const SinglePRMode: Story = {
  args: {
    recommendations: [
      "Consider breaking this PR into two — the schema change and the UI update could ship independently.",
      "The new Zod validator is missing a fallback for empty input; add a default to avoid runtime errors.",
    ],
  },
};

export const Empty: Story = {
  args: {
    recommendations: [],
  },
};

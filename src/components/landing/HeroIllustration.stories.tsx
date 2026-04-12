import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroIllustration } from "./HeroIllustration";

const meta = {
  title: "Landing/HeroIllustration",
  component: HeroIllustration,
  parameters: {
    layout: "centered",
  },
  args: {
    scoreLabel: "Score",
    prsAnalyzedLabel: "PRs Analyzed",
    qualityBadgeLabel: "Quality",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeroIllustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

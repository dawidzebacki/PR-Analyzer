import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TotalScore } from "./TotalScore";

const meta = {
  title: "Dashboard/TotalScore",
  component: TotalScore,
  parameters: {
    layout: "padded",
  },
  args: {
    score: 78,
  },
} satisfies Meta<typeof TotalScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Exceptional: Story = {
  args: {
    score: 95,
  },
};

export const Strong: Story = {
  args: {
    score: 74,
  },
};

export const NeedsImprovement: Story = {
  args: {
    score: 52,
  },
};

export const Critical: Story = {
  args: {
    score: 25,
  },
};

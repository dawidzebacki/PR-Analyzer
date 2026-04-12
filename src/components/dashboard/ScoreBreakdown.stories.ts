import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScoreBreakdown } from "./ScoreBreakdown";

const meta = {
  title: "Dashboard/ScoreBreakdown",
  component: ScoreBreakdown,
  parameters: {
    layout: "padded",
  },
  args: {
    scores: {
      impact: 82,
      aiLeverage: 65,
      quality: 88,
      total: 80,
    },
  },
} satisfies Meta<typeof ScoreBreakdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllHigh: Story = {
  args: {
    scores: {
      impact: 95,
      aiLeverage: 92,
      quality: 97,
      total: 95,
    },
  },
};

export const AllLow: Story = {
  args: {
    scores: {
      impact: 20,
      aiLeverage: 15,
      quality: 25,
      total: 21,
    },
  },
};

export const Mixed: Story = {
  args: {
    scores: {
      impact: 90,
      aiLeverage: 30,
      quality: 55,
      total: 61,
    },
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScoreRing } from "./ScoreRing";

const meta = {
  title: "UI/ScoreRing",
  component: ScoreRing,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    score: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof ScoreRing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Low: Story = {
  args: {
    score: 30,
    label: "Impact",
  },
};

export const Medium: Story = {
  args: {
    score: 60,
    label: "AI-Leverage",
  },
};

export const High: Story = {
  args: {
    score: 85,
    label: "Quality",
  },
};

export const Animated: Story = {
  args: {
    score: 85,
    animated: true,
    label: "Quality",
  },
};

export const Small: Story = {
  args: {
    score: 72,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    score: 92,
    size: "lg",
    label: "Overall",
  },
};

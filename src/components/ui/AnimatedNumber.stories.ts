import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnimatedNumber } from "./AnimatedNumber";

const meta = {
  title: "UI/AnimatedNumber",
  component: AnimatedNumber,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AnimatedNumber>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 87,
    className: "text-5xl font-bold text-navy font-heading",
  },
};

export const SlowCount: Story = {
  args: {
    value: 100,
    duration: 2.5,
    className: "text-5xl font-bold text-primary font-heading",
  },
};

export const Small: Story = {
  args: {
    value: 42,
    className: "text-base font-bold text-navy",
  },
};

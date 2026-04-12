import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./Card";

const meta = {
  title: "UI/Card",
  component: Card,
  args: {
    children: "Card content goes here. This is a reusable card component.",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHover: Story = {
  args: {
    hover: true,
    children: "Hover over me to see the shadow effect.",
  },
};

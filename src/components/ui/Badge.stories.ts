import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "./Badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "warning", "error", "neutral"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
  args: {
    children: "Badge",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: "success",
    children: "Passed",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Needs Review",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "Failed",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    children: "Draft",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    variant: "success",
    children: "SM",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    variant: "success",
    children: "Medium",
  },
};

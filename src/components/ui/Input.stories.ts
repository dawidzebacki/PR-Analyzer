import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";

const meta = {
  title: "UI/Input",
  component: Input,
  args: {
    placeholder: "https://github.com/owner/repo",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: "Repository URL",
  },
};

export const WithError: Story = {
  args: {
    label: "Repository URL",
    error: "Please enter a valid GitHub repository URL",
    value: "not-a-url",
  },
};

export const Disabled: Story = {
  args: {
    label: "Repository URL",
    disabled: true,
    value: "https://github.com/owner/repo",
  },
};

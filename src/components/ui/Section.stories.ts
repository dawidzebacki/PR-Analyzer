import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Section } from "./Section";

const meta = {
  title: "UI/Section",
  component: Section,
  argTypes: {
    background: {
      control: "select",
      options: ["primary", "secondary"],
    },
  },
  args: {
    children: "Section content with vertical padding.",
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    background: "primary",
  },
};

export const Secondary: Story = {
  args: {
    background: "secondary",
  },
};

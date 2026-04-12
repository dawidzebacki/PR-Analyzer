import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CTASection } from "./CTASection";

const meta = {
  title: "Landing/CTASection",
  component: CTASection,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CTASection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

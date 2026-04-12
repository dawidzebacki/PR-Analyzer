import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeroForm } from "./HeroForm";

const meta = {
  title: "Landing/HeroForm",
  component: HeroForm,
  parameters: {
    layout: "centered",
  },
  args: {
    inputPlaceholder: "https://github.com/owner/repo",
    ctaText: "Analyze",
  },
} satisfies Meta<typeof HeroForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

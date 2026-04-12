import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ScoringDimensions } from "./ScoringDimensions";

const meta = {
  title: "Landing/ScoringDimensions",
  component: ScoringDimensions,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ScoringDimensions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

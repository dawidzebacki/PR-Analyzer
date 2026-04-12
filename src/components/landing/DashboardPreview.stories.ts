import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DashboardPreview } from "./DashboardPreview";

const meta = {
  title: "Landing/DashboardPreview",
  component: DashboardPreview,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DashboardPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

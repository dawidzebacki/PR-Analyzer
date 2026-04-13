import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DashboardSkeleton } from "./DashboardSkeleton";

const meta = {
  title: "Dashboard/DashboardSkeleton",
  component: DashboardSkeleton,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof DashboardSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnalysisLoading } from "./AnalysisLoading";

const meta = {
  title: "Dashboard/AnalysisLoading",
  component: AnalysisLoading,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof AnalysisLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

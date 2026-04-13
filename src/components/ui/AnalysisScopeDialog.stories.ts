import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AnalysisScopeDialog } from "./AnalysisScopeDialog";

const meta = {
  title: "UI/AnalysisScopeDialog",
  component: AnalysisScopeDialog,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    open: true,
    onClose: () => {},
    onSubmit: (values) => {
      console.log("[AnalysisScopeDialog] submit", values);
    },
  },
} satisfies Meta<typeof AnalysisScopeDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Closed: Story = {
  args: {
    open: false,
  },
};

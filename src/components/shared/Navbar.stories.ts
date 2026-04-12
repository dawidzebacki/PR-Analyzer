import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Navbar } from "./Navbar";

const meta = {
  title: "Shared/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scrolled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Navbar after scrolling — CTA button visible, bottom shadow active.",
      },
    },
  },
  decorators: [
    (Story) => {
      // Simulate scroll by adding tall content behind
      return Story();
    },
  ],
};

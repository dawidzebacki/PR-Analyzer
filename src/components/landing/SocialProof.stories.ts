import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SocialProof } from "./SocialProof";

const meta = {
  title: "Landing/SocialProof",
  component: SocialProof,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SocialProof>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

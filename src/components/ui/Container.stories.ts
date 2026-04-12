import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Container } from "./Container";

const meta = {
  title: "UI/Container",
  component: Container,
  args: {
    children:
      "This content is constrained to 1110px max-width with 18px horizontal padding.",
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

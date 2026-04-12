import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LocaleSwitcher } from "./LocaleSwitcher";

const meta = {
  title: "Shared/LocaleSwitcher",
  component: LocaleSwitcher,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    className: { control: "text" },
  },
} satisfies Meta<typeof LocaleSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FooterStyle: Story = {
  args: {
    className:
      "flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-primary",
  },
};

export const NavStyle: Story = {
  args: {
    className:
      "flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-primary",
  },
};

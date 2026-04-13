import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Toast } from "./Toast";

const meta = {
  title: "UI/Toast",
  component: Toast,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "error", "info"],
    },
  },
  args: {
    message: "Link copied to clipboard",
    variant: "success",
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: "success",
    message: "Link copied to clipboard",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    message: "Failed to generate badge. Please try again.",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    message: "Preparing your export…",
  },
};

export const WithDismiss: Story = {
  args: {
    variant: "info",
    message: "Your download is ready",
    onDismiss: () => {},
  },
};

export const LongMessage: Story = {
  args: {
    variant: "success",
    message:
      "Your shareable link is ready — anyone with the URL can view this analysis until the cache expires.",
  },
};

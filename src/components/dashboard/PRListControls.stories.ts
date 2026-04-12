import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PRListControls } from "./PRListControls";

const meta = {
  title: "Dashboard/PRListControls",
  component: PRListControls,
  parameters: {
    layout: "padded",
  },
  args: {
    sortField: "total",
    sortDirection: "desc",
    authorFilter: "",
    searchQuery: "",
    authors: ["octocat", "hubot", "mona"],
    onSortFieldChange: () => {},
    onSortDirectionChange: () => {},
    onAuthorFilterChange: () => {},
    onSearchQueryChange: () => {},
  },
} satisfies Meta<typeof PRListControls>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSearch: Story = {
  args: {
    searchQuery: "fix auth",
  },
};

export const WithAuthorFilter: Story = {
  args: {
    authorFilter: "octocat",
  },
};

export const Ascending: Story = {
  args: {
    sortDirection: "asc",
    sortField: "impact",
  },
};

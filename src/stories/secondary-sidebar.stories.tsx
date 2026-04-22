import type { Meta, StoryObj } from "@storybook/react";
import { SecondarySidebar } from "@/components/secondary/secondary-sidebar";

const meta: Meta<typeof SecondarySidebar> = {
  title: "Block/SecondarySidebar",
  component: SecondarySidebar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    activeItem: {
      control: "select",
      options: ["account", "activity", "notifications", "billing", "subscription", "helpdesk", "how-to-use", "refer"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SecondarySidebar>;

export const Default: Story = {
  args: {
    activeItem: "account",
  },
};

export const Subscriptions: Story = {
  args: {
    activeItem: "subscription",
  },
};

export const Support: Story = {
  args: {
    activeItem: "helpdesk",
  },
};

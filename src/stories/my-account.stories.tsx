import type { Meta, StoryObj } from "@storybook/react";
import { MyAccount } from "@/components/secondary/my-account";

const meta: Meta<typeof MyAccount> = {
  title: "Block/MyAccount",
  component: MyAccount,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MyAccount>;

export const Default: Story = {};

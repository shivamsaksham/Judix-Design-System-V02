import type { Meta, StoryObj } from "@storybook/react";
import { CreateAccount } from "../../../../auth.judix/design-system/src/components/block/create-account";

const meta: Meta<typeof CreateAccount> = {
    title: "Block/CreateAccount",
    component: CreateAccount,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CreateAccount>;

export const Default: Story = {
    args: {
        countryCode: "+91",
    },
};

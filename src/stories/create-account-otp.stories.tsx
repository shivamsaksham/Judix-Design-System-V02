import type { Meta, StoryObj } from "@storybook/react";
import { CreateAccountOTP } from "../components/block/create-account-otp";

const meta: Meta<typeof CreateAccountOTP> = {
    title: "Block/CreateAccountOTP",
    component: CreateAccountOTP,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof CreateAccountOTP>;

export const Default: Story = {
    args: {
        timerText: "4:59",
        buttonText: "Verify",
    },
};

import type { Meta, StoryObj } from "@storybook/react";
import { LoginOTP } from "../components/block/login-otp";

const meta: Meta<typeof LoginOTP> = {
    title: "Block/LoginOTP",
    component: LoginOTP,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof LoginOTP>;

export const Default: Story = {
    args: {
        timerText: "4:59",
        buttonText: "Log In",
    },
};

import type { Meta, StoryObj } from "@storybook/react";
import { Login } from "../components/block/login";

const meta: Meta<typeof Login> = {
    title: "Block/Login",
    component: Login,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Login>;

export const Default: Story = {
    args: {
        countryCode: "+91",
    },
};

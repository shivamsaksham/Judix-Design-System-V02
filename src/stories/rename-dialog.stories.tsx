import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { RenameDialog } from "@/components/block/rename-dialog";

const meta = {
    title: "Block/RenameDialog",
    component: RenameDialog,
    tags: ["autodocs"],
    parameters: {
        layout: "centered"
    },
    argTypes: {
        open: {
            control: "boolean",
            description: "Controls the visibility of the dialog"
        }
    },
    args: {
        open: true,
        currentName: "Existing name",
        onOpenChange: fn(),
        onSave: fn()
    }
} satisfies Meta<typeof RenameDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyName: Story = {
    args: {
        currentName: ""
    }
};

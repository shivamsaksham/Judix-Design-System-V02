import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { VersionSelector } from "../components/block/version-selector";
import { DropdownOption } from "../components/ui/dropdown";

const meta: Meta<typeof VersionSelector> = {
    title: "Block/VersionSelector",
    component: VersionSelector,
    tags: ["autodocs"],
    argTypes: {
        value: {
            control: "text",
            description: "Selected version value"
        },
        onChange: { action: "changed" }
    },
    parameters: {
        layout: "centered",
    },
};

export default meta;
type Story = StoryObj<typeof VersionSelector>;

const sampleOptions: DropdownOption[] = [
    { value: "v4", title: "Version 4 . Latest" },
    { value: "v3", title: "Version 3" },
    { value: "v2", title: "Version 2" },
    { value: "v1", title: "Version 1" },
];

const VersionSelectorWithState = (args: React.ComponentProps<typeof VersionSelector>) => {
    const [value, setValue] = React.useState<string | null>(args.value || "v4");

    return (
        <VersionSelector
            {...args}
            value={value}
            onChange={(val) => {
                setValue(val);
                args.onChange(val);
            }}
        />
    );
};

export const Default: Story = {
    render: (args) => <VersionSelectorWithState {...args} />,
    args: {
        options: sampleOptions,
        value: "v4",
        placeholder: "Select version",
    },
};

export const CustomPlaceholder: Story = {
    render: (args) => <VersionSelectorWithState {...args} />,
    args: {
        options: sampleOptions,
        value: null,
        placeholder: "Choose a version...",
    },
};

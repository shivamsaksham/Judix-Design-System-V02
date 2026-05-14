import React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchScopeSelector } from "@/components/block/search-scope-selector";
import { fn } from "storybook/test";

const meta: Meta<typeof SearchScopeSelector> = {
    title: "Block/SearchScopeSelector",
    component: SearchScopeSelector,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
    args: {
        onScopeSelect: fn(),
        onScopeRemove: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof SearchScopeSelector>;

const ALL_SCOPES = [
    "Overall search",
    "Supreme Court",
    "High Courts",
    "Central Acts",
    "State Acts",
    "Tribunals",
    "Rules & Regulations",
];

export const Default: Story = {
    args: {
        availableScopes: ALL_SCOPES,
        selectedScopes: ["Overall search"],
    },
};

export const MultipleSelected: Story = {
    args: {
        availableScopes: ALL_SCOPES,
        selectedScopes: ["Supreme Court", "Central Acts", "Tribunals"],
    },
};

export const Interactive: Story = {
    render: (args) => {
        const [selected, setSelected] = React.useState<string[]>(args.selectedScopes || ["Overall search"]);
        
        const handleSelect = (scope: string) => {
            if (!selected.includes(scope)) {
                setSelected([...selected, scope]);
            }
            args.onScopeSelect?.(scope);
        };
        
        const handleRemove = (scope: string) => {
            setSelected(selected.filter(s => s !== scope));
            args.onScopeRemove?.(scope);
        };

        return (
            <SearchScopeSelector 
                {...args} 
                selectedScopes={selected}
                availableScopes={args.availableScopes}
                onScopeSelect={handleSelect}
                onScopeRemove={handleRemove}
            />
        );
    },
    args: {
        availableScopes: ALL_SCOPES,
        selectedScopes: ["Overall search"],
    }
};

export const CustomScopes: Story = {
    args: {
        availableScopes: ["Criminal Law", "Civil Law", "Family Law", "Corporate Law", "Taxation"],
        selectedScopes: ["Criminal Law"],
    },
};

export const Empty: Story = {
    args: {
        availableScopes: [],
        selectedScopes: [],
    },
};


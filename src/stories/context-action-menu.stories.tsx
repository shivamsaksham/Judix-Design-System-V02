import * as React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { ContextActionMenu } from "../components/block/context-action-menu";

const meta: Meta<typeof ContextActionMenu> = {
    title: "Block/ContextActionMenu",
    component: ContextActionMenu,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContextActionMenu>;

export const Default: Story = {
    args: {
        isAdded: false,
        isBookmarked: false,
        isMentioned: false,
    },
};

export const Active: Story = {
    args: {
        isAdded: true,
        isBookmarked: true,
        isMentioned: true,
    },
};

export const Interactive: Story = {
    render: () => {
        // Simple state wrapper for the story
        const [state, setState] = React.useState({
            isAdded: false,
            isBookmarked: false,
            isMentioned: false
        });

        return (
            <ContextActionMenu
                {...state}
                onAdd={() => setState(s => ({ ...s, isAdded: !s.isAdded }))}
                onBookmark={() => setState(s => ({ ...s, isBookmarked: !s.isBookmarked }))}
                onMention={() => setState(s => ({ ...s, isMentioned: !s.isMentioned }))}
            />
        );
    }
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContextWindowDropdown from '@/components/block/context-window-dropdown';
import { useState } from 'react';

const meta: Meta<typeof ContextWindowDropdown> = {
    title: 'Block/ContextWindowDropdown',
    component: ContextWindowDropdown,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof ContextWindowDropdown>;

const sampleItems = [
    {
        id: '1',
        title: 'Deepak Singh Alias vs Mukesh Kumar & Ors',
        description: '2024 3 SCR 231',
        checked: false,
    },
    {
        id: '2',
        title: 'Query #1',
        description: 'This is the demo summary of the first query of the session. This is the demo summary of the first query',
        checked: false,
    },
    {
        id: '3',
        title: 'Deepak Singh Alias vs Mukesh Kumar & Ors',
        description: '2024 2 SCR 472',
        checked: false,
    },
    {
        id: '4',
        title: 'Indian Penal Code, 1961',
        description: 'Section 498A, 499',
        checked: false,
    },
    {
        id: '5',
        title: 'Query #2',
        description: 'This is the demo summary of the first query of the session. This is the demo summary of the first query',
        checked: false,
    },
];

export const Default: Story = {
    args: {
        items: sampleItems,
        defaultAutoContext: true,
    },
};

export const Interactive: Story = {
    render: () => {
        const [items, setItems] = useState(sampleItems);
        const [isAutoContext, setIsAutoContext] = useState(true);

        const handleItemToggle = (id: string, checked: boolean) => {
            setItems(items.map(item =>
                item.id === id ? { ...item, checked } : item
            ));
        };

        return (
            <div>
                <ContextWindowDropdown
                    items={items}
                    onItemToggle={handleItemToggle}
                    onModeChange={setIsAutoContext}
                    defaultAutoContext={isAutoContext}
                />
            </div>
        );
    },
};

export const ManyItems: Story = {
    args: {
        items: Array.from({ length: 20 }, (_, i) => ({
            id: `item-${i + 1}`,
            title: `Context Item ${i + 1}`,
            description: `Description for context item ${i + 1}. This demonstrates scrolling behavior.`,
            checked: false,
        })),
        defaultAutoContext: true,
    },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Kbd } from '@/components/ui/kbd';

const meta = {
    title: 'UI/Kbd',
    component: Kbd,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} as Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
    args: {
        children: 'Ctrl',
    },
};

export const SingleKey: Story = {
    render: () => (
        <div className="flex gap-2">
            <Kbd>Esc</Kbd>
            <Kbd>Enter</Kbd>
            <Kbd>Tab</Kbd>
            <Kbd>Space</Kbd>
        </div>
    ),
};

export const Combination: Story = {
    render: () => (
        <div className="flex items-center gap-1">
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>C</Kbd>
        </div>
    ),
};

export const Examples: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-sm">Copy:</span>
                <Kbd>Ctrl</Kbd>
                <span>+</span>
                <Kbd>C</Kbd>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm">Paste:</span>
                <Kbd>Ctrl</Kbd>
                <span>+</span>
                <Kbd>V</Kbd>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm">Save:</span>
                <Kbd>Ctrl</Kbd>
                <span>+</span>
                <Kbd>S</Kbd>
            </div>
        </div>
    ),
};

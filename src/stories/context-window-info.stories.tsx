import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContextWindowInfo } from '@/components/block/context-window-info';

const meta: Meta<typeof ContextWindowInfo> = {
    title: 'Block/ContextWindowInfo',
    component: ContextWindowInfo,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="w-[600px] p-4">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ContextWindowInfo>;

export const Default: Story = {
    args: {},
};

export const CustomWidth: Story = {
    args: {
        className: 'max-w-md',
    },
};

export const FullWidth: Story = {
    decorators: [
        (Story) => (
            <div className="w-full p-4">
                <Story />
            </div>
        ),
    ],
    args: {
        className: 'w-full',
    },
};

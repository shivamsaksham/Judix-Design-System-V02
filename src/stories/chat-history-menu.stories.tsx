import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChatHistoryMenu } from '@/components/block/chat-history-menu';

const meta: Meta<typeof ChatHistoryMenu> = {
    title: 'Block/ChatHistoryMenu',
    component: ChatHistoryMenu,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="p-10 bg-dropdown-color-bg">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof ChatHistoryMenu>;

export const Default: Story = {
    args: {
        onRename: () => console.log('Rename clicked'),
        onShare: () => console.log('Share clicked'),
        onMove: () => console.log('Move to project clicked'),
        onDelete: () => console.log('Delete clicked'),
    },
};

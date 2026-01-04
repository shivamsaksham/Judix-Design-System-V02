import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChatHistoryMenu, type ChatHistoryMenuProps } from '@/components/block/chat-history-menu';
import { Icon } from 'judix-icon';

const sampleMenuItems: ChatHistoryMenuProps['items'] = [
    {
        id: 'rename',
        label: 'Rename',
        icon: <Icon name="Edit2" />,
        onClick: () => console.log('Rename clicked'),
    },
    {
        id: 'share',
        label: 'Share',
        icon: <Icon name="Export" />,
        onClick: () => console.log('Share clicked'),
    },
    {
        id: 'delete',
        label: 'Delete',
        icon: <Icon name="Trash" />,
        onClick: () => console.log('Delete clicked'),
        variant: 'danger',
    },
];

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
    args: {
        items: sampleMenuItems,
    },
    argTypes: {
        items: { control: false },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        items: sampleMenuItems,
    },
};

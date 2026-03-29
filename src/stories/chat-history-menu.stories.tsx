import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChatHistoryMenu } from '@/components/block/chat-history-menu';
import { Icon } from "@judix/icon";

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
        items: [
            {
                id: 'rename',
                label: 'Rename',
                icon: <Icon name="edit-a" />,
                onClick: () => console.log('Rename clicked'),
            },
            {
                id: 'share',
                label: 'Share',
                icon: <Icon name="export-d" />,
                onClick: () => console.log('Share clicked'),
            },
            {
                id: 'move',
                label: 'Move to project',
                icon: <Icon name="document-copy" />,
                onClick: () => console.log('Move clicked'),
                dividerAfter: true, // Border after this item
            },
            {
                id: 'delete',
                label: 'Delete',
                icon: <Icon name="trash" />,
                onClick: () => console.log('Delete clicked'),
                variant: 'danger',
            },
        ],
    },
};

export const WithMultipleDividers: Story = {
    args: {
        items: [
            {
                id: 'rename',
                label: 'Rename',
                icon: <Icon name="edit-a" />,
                onClick: () => console.log('Rename'),
                dividerAfter: true,
            },
            {
                id: 'share',
                label: 'Share',
                icon: <Icon name="export-d" />,
                onClick: () => console.log('Share'),
                dividerAfter: true,
            },
            {
                id: 'archive',
                label: 'Archive',
                icon: <Icon name="archive-a" />,
                onClick: () => console.log('Archive'),
            },
            {
                id: 'delete',
                label: 'Delete',
                icon: <Icon name="trash" />,
                onClick: () => console.log('Delete'),
                variant: 'danger',
            },
        ],
    },
};

export const SimpleMenu: Story = {
    args: {
        items: [
            {
                id: 'edit',
                label: 'Edit',
                icon: <Icon name="edit-a" />,
                onClick: () => console.log('Edit'),
            },
            {
                id: 'duplicate',
                label: 'Duplicate',
                icon: <Icon name="copy" />,
                onClick: () => console.log('Duplicate'),
            },
            {
                id: 'delete',
                label: 'Delete',
                icon: <Icon name="trash" />,
                onClick: () => console.log('Delete'),
                variant: 'danger',
            },
        ],
    },
};

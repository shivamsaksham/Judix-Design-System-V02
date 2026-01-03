import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChatHistoryMenu, type ChatHistoryMenuProps } from '@/components/block/chat-history-menu';
import { Icon } from 'judix-icon';

const sampleMenuItems: ChatHistoryMenuProps['items'] = [
    {
        id: 'rename',
        label: 'Rename',
        icon: <Icon name="Edit" />,
        onClick: () => console.log('Rename clicked'),
    },
    {
        id: 'share',
        label: 'Share',
        icon: <Icon name="Share" />,
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

export const WithoutIcons: Story = {
    args: {
        items: [
            {
                id: 'option1',
                label: 'Option 1',
                onClick: () => console.log('Option 1 clicked'),
            },
            {
                id: 'option2',
                label: 'Option 2',
                onClick: () => console.log('Option 2 clicked'),
            },
            {
                id: 'option3',
                label: 'Option 3',
                onClick: () => console.log('Option 3 clicked'),
            },
        ],
    },
};

export const WithDisabledItems: Story = {
    args: {
        items: [
            {
                id: 'edit',
                label: 'Edit',
                icon: <Icon name="Edit" />,
                onClick: () => console.log('Edit clicked'),
            },
            {
                id: 'copy',
                label: 'Copy',
                icon: <Icon name="Copy" />,
                onClick: () => console.log('Copy clicked'),
                disabled: true,
            },
            {
                id: 'delete',
                label: 'Delete',
                icon: <Icon name="Trash" />,
                onClick: () => console.log('Delete clicked'),
                variant: 'danger',
            },
        ],
    },
};

export const LongList: Story = {
    args: {
        items: [
            { id: '1', label: 'New File', icon: <Icon name="Add" /> },
            { id: '2', label: 'Open', icon: <Icon name="DocumentText" /> },
            { id: '3', label: 'Save', icon: <Icon name="Save2" /> },
            { id: '4', label: 'Save As', icon: <Icon name="Save2" /> },
            { id: '5', label: 'Rename', icon: <Icon name="Edit" /> },
            { id: '6', label: 'Share', icon: <Icon name="Share" /> },
            { id: '7', label: 'Delete', icon: <Icon name="Trash" />, variant: 'danger' },
        ],
    },
};

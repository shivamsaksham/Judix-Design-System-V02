import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { UserMenu, type UserMenuProps } from '@/components/block/user-menu';
import { Icon } from 'judix-icon';

const sampleMenuItems: UserMenuProps['items'] = [
    {
        id: 'zoom',
        label: 'Zoom',
        icon: <Icon name="SearchZoomIn" />,
        badge: '100%',
        onClick: () => console.log('Zoom clicked'),
    },
    {
        id: 'account',
        label: 'My Account',
        icon: <Icon name="Profile" />,
        onClick: () => console.log('My Account clicked'),
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: <Icon name="Folder2" />,
        onClick: () => console.log('Projects clicked'),
    },
    {
        id: 'subscriptions',
        label: 'Subscriptions',
        icon: <Icon name="Bag2" />,
        onClick: () => console.log('Subscriptions clicked'),
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <Icon name="Setting2" />,
        onClick: () => console.log('Settings clicked'),
        dividerAfter: true,
    },
    {
        id: 'refer',
        label: 'Refer and Earn',
        icon: <Icon name="Gift" />,
        onClick: () => console.log('Refer and Earn clicked'),
    },
    {
        id: 'support',
        label: 'Help & Support',
        icon: <Icon name="Call" />,
        onClick: () => console.log('Help & Support clicked'),
        dividerAfter: true,
    },
    {
        id: 'logout',
        label: 'Logout',
        icon: <Icon name="Logout" />,
        onClick: () => console.log('Logout clicked'),
        variant: 'danger',
    },
];

const meta: Meta<typeof UserMenu> = {
    title: 'Block/UserMenu',
    component: UserMenu,
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
            { id: '1', label: 'Option 1', onClick: () => console.log('Option 1') },
            { id: '2', label: 'Option 2', onClick: () => console.log('Option 2') },
            { id: '3', label: 'Option 3', onClick: () => console.log('Option 3'), dividerAfter: true },
            { id: '4', label: 'Logout', onClick: () => console.log('Logout'), variant: 'danger' },
        ],
    },
};

export const WithBadges: Story = {
    args: {
        items: [
            { id: '1', label: 'Notifications', icon: <Icon name="Notification" />, badge: '5', onClick: () => { } },
            { id: '2', label: 'Messages', icon: <Icon name="Message" />, badge: '12', onClick: () => { } },
            { id: '3', label: 'Updates', icon: <Icon name="InfoCircle" />, badge: 'New', onClick: () => { } },
        ],
    },
};

export const Minimal: Story = {
    args: {
        items: [
            { id: '1', label: 'Profile', onClick: () => { } },
            { id: '2', label: 'Settings', onClick: () => { }, dividerAfter: true },
            { id: '3', label: 'Logout', onClick: () => { }, variant: 'danger' },
        ],
    },
};

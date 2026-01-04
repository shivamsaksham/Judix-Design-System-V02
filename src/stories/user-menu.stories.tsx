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
        icon: <Icon name="ProfileCircle" />,
        onClick: () => console.log('My Account clicked'),
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: <Icon name="DocumentCopy" />,
        onClick: () => console.log('Projects clicked'),
    },
    {
        id: 'subscriptions',
        label: 'Subscriptions',
        icon: <Icon name="EmptyWalletChange" />,
        onClick: () => console.log('Subscriptions clicked'),
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <Icon name="Setting" />,
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

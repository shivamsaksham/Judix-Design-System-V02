import type { Meta, StoryObj } from '@storybook/react';
import { UserMenu, type UserMenuProps } from '@/components/block/user-menu';

const sampleMenuItems: UserMenuProps['items'] = [
    {
        id: 'account',
        label: 'My Account (Custom)',
        icon: 'profile-circle',
        onClick: () => console.log('My Account clicked'),
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: 'folder-a',
        onClick: () => console.log('Projects clicked'),
    },
    {
        id: 'subscriptions',
        label: 'Subscriptions',
        icon: 'wallet-a',
        onClick: () => console.log('Subscriptions clicked'),
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: 'setting-e',
        onClick: () => console.log('Settings clicked'),
        dividerAfter: true,
    },
    {
        id: 'logout',
        label: 'Logout',
        icon: 'logout-b',
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
            <div className="p-10 border border-dropdown-color-stroke rounded-lg">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        items: { control: false },
    },
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

/**
 * Default UserMenu uses the system's predefined items and string-based icons.
 */
export const Default: Story = {
    args: {
    },
};

/**
 * UserMenu with customized items passed via props.
 */
export const Customized: Story = {
    args: {
        items: sampleMenuItems,
    },
};

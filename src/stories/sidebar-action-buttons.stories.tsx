import type { Meta, StoryObj } from '@storybook/react';
import { SidebarActionButtons } from '@/components/block/sidebar-action-buttons';

const meta = {
    title: 'Block/Sidebar Action Buttons',
    component: SidebarActionButtons,
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div >
                <Story  />
            </div>
        ),
    ],
    tags: ['autodocs'],
} satisfies Meta<typeof SidebarActionButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onNewChat: () => console.log('New chat clicked'),
        onNotes: () => console.log('Notes clicked'),
        onProjects: () => console.log('Projects clicked'),
    },
};

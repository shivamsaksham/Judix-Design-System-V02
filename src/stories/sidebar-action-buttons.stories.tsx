import type { Meta, StoryObj } from '@storybook/react';
import { SidebarActionButtons } from '@/components/block/sidebar-action-buttons';

const meta = {
    title: 'Block/Sidebar Action Buttons',
    component: SidebarActionButtons,
    parameters: {
        layout: 'centered',
    },
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

export const Interactive: Story = {
    render: () => (
        <div className="w-[280px] bg-gray-100 p-4 rounded-lg">
            <SidebarActionButtons
                onNewChat={() => alert('New chat!')}
                onNotes={() => alert('Notes!')}
                onProjects={() => alert('Projects!')}
            />
        </div>
    ),
};

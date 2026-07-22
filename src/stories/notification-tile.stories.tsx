import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { NotificationTile } from '@/components/block/notification-tile';

const meta: Meta<typeof NotificationTile> = {
    title: 'Block/NotificationTile',
    component: NotificationTile,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <Story />
        ),
    ],
    args: {
        title: 'Notification title',
        description: 'This is the sample notification text. This can be multiline but will be truncated after 2 lines.',
        timestamp: 'Today, 11:54 am',
        state: 'unread',
        onMarkAsRead: () => console.log('Mark as read clicked'),
        onClick: () => console.log('Tile clicked'),
    },
};

export default meta;
type Story = StoryObj<typeof NotificationTile>;

export const Unread: Story = {
    args: {
        state: 'unread',
    },
};

export const Read: Story = {
    args: {
        state: 'read',
    },
};

export const LongText: Story = {
    args: {
        title: 'Document Processing Completed',
        description: 'Your uploaded document "judgment_summary_2026.pdf" has been fully processed and indexed. The system extracted 42 citations, 15 key arguments, and identified 3 related cases. You can now search across this document or write prompt queries against it in your chat workspace.',
        timestamp: 'Yesterday, 4:30 pm',
        state: 'unread',
    },
};

export const CustomIcon: Story = {
    args: {
        title: 'Subscription Upgraded',
        description: 'Congratulations! Your account has been upgraded to the Premium Pro plan. You now have unlimited access to document querying, advanced legal analytics, and fast PDF exports.',
        timestamp: '2 days ago',
        state: 'read',
        iconName: 'crown-a',
    },
};

export const MultipleNotifications: Story = {
    decorators: [
        (Story) => (
            <div className="w-[550px] bg-color-surface-neutral-default rounded-xl border border-color-border-neutral-default shadow-md overflow-hidden">
                <div className="p-4 border-b border-color-border-neutral-default bg-color-surface-neutral-subtle_bg flex justify-between items-center">
                    <h3 className="font-semibold text-color-text-neutral-default text-style-body-default-emphasis">Notifications</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-color-surface-primary-default text-white font-medium">2 New</span>
                </div>
                <div>
                    <Story />
                </div>
            </div>
        ),
    ],
    render: () => (
        <div className="flex flex-col">
            <NotificationTile
                title="Notification title"
                description="This is the sample notification text. This can be multiline but will be truncated after 2 lines."
                timestamp="Today, 11:54 am"
                state="unread"
                onMarkAsRead={() => console.log('Notification 1 marked as read')}
                onClick={() => console.log('Notification 1 clicked')}
            />
            <NotificationTile
                title="Notification title"
                description="This is the sample notification text. This can be multiline but will be truncated after 2 lines."
                timestamp="Today, 11:54 am"
                state="read"
                onClick={() => console.log('Notification 2 clicked')}
            />
        </div>
    ),
};

const InteractiveTile = () => {
    const [state, setState] = React.useState<'unread' | 'read'>('unread');
    return (
        <NotificationTile
            title="Interactive State Transition"
            description="Click the 'Mark as read' label below. It will trigger the onMarkAsRead callback, instantly transitioning the tile's state from 'unread' to 'read' (removing this label and updating the background style)."
            timestamp="Just now"
            state={state}
            onMarkAsRead={() => setState('read')}
            onClick={() => console.log('Tile clicked')}
        />
    );
};

export const ClickToRead: Story = {
    render: () => <InteractiveTile />,
};

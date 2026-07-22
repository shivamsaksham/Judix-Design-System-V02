import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import React from 'react';
import { Notifications, NotificationItem } from '@/components/secondary/notifications';

const meta: Meta<typeof Notifications> = {
    title: 'Secondary/Notifications',
    component: Notifications,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div className="max-w-[700px] mx-auto p-6 md:p-12 min-h-screen bg-color-surface-neutral-default">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof Notifications>;

// Helper to generate dates relative to today
const getDateNDaysAgo = (n: number, hour: number, minute: number): Date => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(hour, minute, 0, 0);
    return d;
};

const sampleNotifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Anticipatory bail in domestic violence cases',
        description: 'This is the sample notification text. This can be multiline but will be truncated after 2 lines.',
        createdAt: getDateNDaysAgo(0, 11, 54), // Today
        state: 'unread',
    },
    {
        id: '2',
        title: 'Anticipatory bail in domestic violence cases',
        description: 'This is the sample notification text. This can be multiline but will be truncated after 2 lines.',
        createdAt: getDateNDaysAgo(0, 10, 15), // Today
        state: 'unread',
    },
    {
        id: '3',
        title: 'Anticipatory bail in domestic violence cases',
        description: 'This is the sample notification text. This can be multiline but will be truncated after 2 lines.',
        createdAt: getDateNDaysAgo(0, 9, 0), // Today
        state: 'unread',
    },
    {
        id: '4',
        title: 'Anticipatory bail in domestic violence cases',
        description: 'This is the sample notification text. This can be multiline but will be truncated after 2 lines.',
        createdAt: getDateNDaysAgo(0, 8, 30), // Today
        state: 'read',
    },
    {
        id: '5',
        title: 'Anticipatory bail in domestic violence cases',
        description: 'This is the sample notification text. This can be multiline but will be truncated after 2 lines.',
        createdAt: getDateNDaysAgo(0, 8, 0), // Today
        state: 'read',
    },
    {
        id: '6',
        title: 'Anticipatory bail in domestic violence cases',
        description: 'This is the sample notification text. This can be multiline but will be truncated after 2 lines.',
        createdAt: getDateNDaysAgo(0, 7, 15), // Today
        state: 'read',
    },
    {
        id: '7',
        title: 'Legal summary document uploaded',
        description: 'A new summary analysis for the case "State of Karnataka v. Ramesh" has been generated and is ready for export.',
        createdAt: getDateNDaysAgo(1, 15, 30), // Yesterday
        state: 'unread',
        iconName: 'document-text-b',
    },
    {
        id: '8',
        title: 'Account subscription renewed',
        description: 'Your Premium plan was auto-renewed successfully. A copy of the receipt has been emailed to your billing address.',
        createdAt: getDateNDaysAgo(2, 14, 20), // 2 Days Ago (Weekday name)
        state: 'read',
        iconName: 'wallet-a',
    },
    {
        id: '9',
        title: 'System update completed',
        description: 'Judix version 2.4.0 is now live. We have introduced enhanced citation processing and speed optimizations for PDF rendering.',
        createdAt: getDateNDaysAgo(3, 10, 5), // 3 Days Ago (Weekday name)
        state: 'unread',
        iconName: 'refresh-a',
    },
    {
        id: '10',
        title: 'Old case research query ready',
        description: 'Search results for your research query regarding "admiralty jurisdiction in corporate contracts" have been completed.',
        createdAt: getDateNDaysAgo(5, 16, 45), // 5 Days Ago (Full Date)
        state: 'read',
        iconName: 'search-normal-a',
    },
];

export const Default: Story = {
    args: {
        notifications: sampleNotifications,
    },
};

const InteractiveNotifications = () => {
    const [list, setList] = React.useState<NotificationItem[]>(sampleNotifications);
    
    const handleMarkAsRead = (id: string) => {
        setList(prev => prev.map(item => item.id === id ? { ...item, state: 'read' } : item));
    };

    const handleMarkAllAsRead = () => {
        setList(prev => prev.map(item => ({ ...item, state: 'read' })));
    };

    return (
        <Notifications
            notifications={list}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClickNotification={(id) => console.log('Notification clicked:', id)}
        />
    );
};

export const Interactive: Story = {
    render: () => <InteractiveNotifications />,
};

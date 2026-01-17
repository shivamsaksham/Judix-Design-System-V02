import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { HistorySidebar, type HistorySidebarProps } from '@/components/block/history-sidebar';

const sampleChatHistory: HistorySidebarProps['chatHistory'] = [
    { id: '1', title: 'Anticipatory bail in domestic violence cases', onClick: () => console.log('Chat 1') },
    { id: '2', title: 'Bail offence analysis', onClick: () => console.log('Chat 2') },
    { id: '3', title: 'BNSS section 12 summary', onClick: () => console.log('Chat 3') },
    { id: '4', title: 'Crime scene investigation rules', onClick: () => console.log('Chat 4') },
    { id: '5', title: 'Suicide in college hostel', onClick: () => console.log('Chat 5') },
];

const sampleUsageStats: HistorySidebarProps['usageStats'] = {
    current: 31,
    total: 500,
    label: 'AI Searches',
};

const sampleUserProfile: HistorySidebarProps['userProfile'] = {
    name: 'Aditya Anand',
    tier: 'Free tier',
};

const meta: Meta<typeof HistorySidebar> = {
    title: 'Block/HistorySidebar',
    component: HistorySidebar,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        (Story) => (
            <div className="bg-gray-100 min-h-screen">
                <Story />
            </div>
        ),
    ],
    args: {
        chatHistory: sampleChatHistory,
        usageStats: sampleUsageStats,
        userProfile: sampleUserProfile,
        onNewChat: () => console.log('New Chat clicked'),
        onNotes: () => console.log('Notes clicked'),
        onProjects: () => console.log('Projects clicked'),
        onResetChat: () => console.log('Reset Chat clicked'),
        onUpgrade: () => console.log('Upgrade clicked'),
        onRename: (id) => console.log('Rename chat:', id),
        onShare: (id) => console.log('Share chat:', id),
        onDelete: (id) => console.log('Delete chat:', id),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        activeChatId: '2',
    },
};

export const LongChatList: Story = {
    args: {
        chatHistory: [
            ...sampleChatHistory,
            { id: '6', title: 'Property dispute resolution', onClick: () => { } },
            { id: '7', title: 'Contract law basics', onClick: () => { } },
            { id: '8', title: 'Trademark registration process', onClick: () => { } },
            { id: '9', title: 'Employment law consultation', onClick: () => { } },
            { id: '10', title: 'Divorce proceedings guide', onClick: () => { } },
            { id: '11', title: 'Will and testament drafting', onClick: () => { } },
            { id: '12', title: 'Corporate law compliance', onClick: () => { } },
        ],
        activeChatId: '1',
    },
};

export const HighUsage: Story = {
    args: {
        usageStats: {
            current: 485,
            total: 500,
            label: 'AI Searches',
        },
    },
};

export const PremiumUser: Story = {
    args: {
        userProfile: {
            name: 'John Doe',
            tier: 'Premium',
        },
    },
};

export const EmptyChatList: Story = {
    args: {
        chatHistory: [],
    },
};

export const Collapsed: Story = {
    args: {
        isExpanded: false,
    },
};

export const Expanded: Story = {
    args: {
        isExpanded: true,
    },
};

export const SideBySide: Story = {
    render: () => (
        <div className="flex gap-4 p-4">
            {/* Collapsed Version */}
            <div className="flex flex-col">
                <h3 className="text-sm font-semibold mb-2 text-gray-700">Collapsed</h3>
                <HistorySidebar
                    chatHistory={sampleChatHistory}
                    usageStats={sampleUsageStats}
                    userProfile={sampleUserProfile}
                    activeChatId="2"
                    isExpanded={false}
                    onNewChat={() => console.log('New Chat clicked')}
                    onNotes={() => console.log('Notes clicked')}
                    onProjects={() => console.log('Projects clicked')}
                    onResetChat={() => console.log('Reset Chat clicked')}
                    onUpgrade={() => console.log('Upgrade clicked')}
                    onRename={(id) => console.log('Rename chat:', id)}
                    onShare={(id) => console.log('Share chat:', id)}
                    onDelete={(id) => console.log('Delete chat:', id)}
                />
            </div>

            {/* Expanded Version */}
            <div className="flex flex-col">
                <h3 className="text-sm font-semibold mb-2 text-gray-700">Expanded</h3>
                <HistorySidebar
                    chatHistory={sampleChatHistory}
                    usageStats={sampleUsageStats}
                    userProfile={sampleUserProfile}
                    activeChatId="2"
                    isExpanded={true}
                    onNewChat={() => console.log('New Chat clicked')}
                    onNotes={() => console.log('Notes clicked')}
                    onProjects={() => console.log('Projects clicked')}
                    onResetChat={() => console.log('Reset Chat clicked')}
                    onUpgrade={() => console.log('Upgrade clicked')}
                    onRename={(id) => console.log('Rename chat:', id)}
                    onShare={(id) => console.log('Share chat:', id)}
                    onDelete={(id) => console.log('Delete chat:', id)}
                />
            </div>
        </div>
    ),
};

export const Interactive: Story = {
    render: () => {
        const [activeChatId, setActiveChatId] = useState<string>('2');

        const interactiveChatHistory = sampleChatHistory.map(chat => ({
            ...chat,
            onClick: () => setActiveChatId(chat.id),
        }));

        return (
            <HistorySidebar
                chatHistory={interactiveChatHistory}
                usageStats={sampleUsageStats}
                userProfile={sampleUserProfile}
                activeChatId={activeChatId}
                onNewChat={() => console.log('New Chat clicked')}
                onNotes={() => console.log('Notes clicked')}
                onProjects={() => console.log('Projects clicked')}
                onResetChat={() => console.log('Reset Chat clicked')}
                onUpgrade={() => console.log('Upgrade clicked')}
                onRename={(id) => console.log('Rename chat:', id)}
                onShare={(id) => console.log('Share chat:', id)}
                onDelete={(id) => console.log('Delete chat:', id)}
            />
        );
    },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatHistorySection } from '@/components/block/chat-history-section';

const meta = {
    title: 'Block/Chat Section',
    component: ChatHistorySection,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} as Meta<typeof ChatHistorySection>;

export default meta;
type Story = StoryObj<typeof ChatHistorySection>;

const sampleChats = [
    { id: '1', title: 'Project Discussion', onClick: () => console.log('Chat 1') },
    { id: '2', title: 'Team Meeting Notes', onClick: () => console.log('Chat 2') },
    { id: '3', title: 'Design Review', onClick: () => console.log('Chat 3') },
    { id: '4', title: 'Bug Fixes', onClick: () => console.log('Chat 4') },
];

export const Default: Story = {
    args: {
        chatHistory: sampleChats,
        activeChatId: '2',
        onMenuClick: (chatId) => {
            console.log('Menu clicked for chat:', chatId);
        },
    },
    render: (args) => (
        <div className="w-[280px] h-[400px] bg-dropdown-color-bg rounded-lg border border-dropdown-color-stroke">
            <ChatHistorySection {...args} />
        </div>
    ),
};

export const Empty: Story = {
    args: {
        chatHistory: [],
        activeChatId: null,
        onMenuClick: () => { },
    },
    render: (args) => (
        <div className="w-[280px] h-[400px] bg-dropdown-color-bg rounded-lg border border-dropdown-color-stroke">
            <ChatHistorySection {...args} />
        </div>
    ),
};

export const ManyChats: Story = {
    args: {
        chatHistory: Array.from({ length: 20 }, (_, i) => ({
            id: `${i + 1}`,
            title: `Chat ${i + 1}`,
            onClick: () => console.log(`Chat ${i + 1}`),
        })),
        activeChatId: '5',
        onMenuClick: (chatId) => console.log('Menu:', chatId),
    },
    render: (args) => (
        <div className="w-[280px] h-[400px] bg-dropdown-color-bg rounded-lg border border-dropdown-color-stroke">
            <ChatHistorySection {...args} />
        </div>
    ),
};

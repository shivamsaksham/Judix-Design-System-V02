import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from '@/components/block/bread-crumb';

const meta: Meta<typeof Breadcrumb> = {
    title: 'Block/Breadcrumb',
    component: Breadcrumb,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
    args: {
        items: [
            { id: '1', label: 'Shridhar Apartment Case', onClick: () => console.log('Case clicked') },
            { id: '2', label: 'Chats', onClick: () => console.log('Chats clicked') },
            { id: '3', label: 'Anticipatory bail in domestic violence cases', onClick: () => console.log('Chat clicked') },
        ],
        onUseProject: () => console.log('Use project clicked'),
    },
};

export const WithDropdown: Story = {
    args: {
        items: [
            { id: '1', label: 'Shridhar Apartment Case', onClick: () => console.log('Case clicked') },
            { id: '2', label: 'Archive', onClick: () => console.log('Archive clicked') },
            { id: '3', label: 'Judgment.pdf', onClick: () => console.log('File clicked') },
        ],
        onUseProject: () => console.log('Use project clicked'),
        showDropdown: true,
        onDropdownClick: () => console.log('Dropdown toggled'),
        onHistorySelect: (id: string) => console.log('Selected history:', id)
    },
};

export const DynamicInteraction: Story = {
    render: () => {
        const [context, setContext] = React.useState<'archive' | 'chat'>('archive');

        const archiveItems = [
            { id: '1', label: 'Shridhar Apartment Case' },
            { id: '2', label: 'Archive' },
            { id: '3', label: 'Research.pdf' },
        ];

        const chatItems = [
            { id: '1', label: 'Shridhar Apartment Case' },
            { id: '2', label: 'Chats' },
            { id: '3', label: 'My Legal Inquiry' },
        ];

        return (
            <div className="flex flex-col gap-8 w-[800px]">
                <div className="flex gap-4">
                    <button 
                        onClick={() => setContext('archive')}
                        className={`px-4 py-2 rounded-lg border ${context === 'archive' ? 'bg-color-surface-primary-default border-color-border-primary-default text-white' : 'bg-white border-color-border-neutral-default'}`}
                    >
                        Archive Context (File Tree)
                    </button>
                    <button 
                        onClick={() => setContext('chat')}
                        className={`px-4 py-2 rounded-lg border ${context === 'chat' ? 'bg-color-surface-primary-default border-color-border-primary-default text-white' : 'bg-white border-color-border-neutral-default'}`}
                    >
                        Chat Context
                    </button>
                </div>
                
                <div>
                    <h3 className="mb-4 text-style-body-default-emphasis">Breadcrumb Behavior:</h3>
                    <Breadcrumb 
                        items={context === 'archive' ? archiveItems : chatItems}
                        showDropdown={true}
                        onHistorySelect={(id) => alert(`Action selected: ${id}`)}
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <p className="text-style-label-default-regular text-color-text-neutral-tertiary">
                        {context === 'archive' 
                            ? '✅ Dropdown is VISIBLE. Open it to see the "Remove from saved" action.' 
                            : '❌ Dropdown is HIDDEN automatically for Chat context.'}
                    </p>
                </div>
            </div>
        );
    }
};

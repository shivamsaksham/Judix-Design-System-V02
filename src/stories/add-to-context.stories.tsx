import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import AddToContext from '@/components/block/context-add-modal';
import { useState } from 'react';

const meta: Meta<typeof AddToContext> = {
    title: 'Block/AddToContext',
    component: AddToContext,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof AddToContext>;

export const Default: Story = {
    args: {
        onSave: (title, content) => {
            console.log('Save clicked:', { title, content });
        },
        onCancel: () => {
            console.log('Cancel clicked');
        },
        onClose: () => {
            console.log('Close clicked');
        },
    },
};

export const WithContent: Story = {
    render: () => {
        // const [title] = useState('My Important Document');
        // const [content] = useState('This is some sample content that has been entered into the textarea field.');

        return (
            <AddToContext
                onSave={(title, content) => console.log('Save:', { title, content })}
                onCancel={() => console.log('Cancel')}
                onClose={() => console.log('Close')}
            />
        );
    },
};

export const NearLimit: Story = {
    render: () => {
        // const sampleText = 'A'.repeat(2490);

        return (
            <div>
                <p className="mb-4 text-sm text-gray-600">
                    This story shows the component with content near the character limit (2490/2500)
                </p>
                <AddToContext
                    onSave={(title, content) => console.log('Save:', { title, content })}
                    onCancel={() => console.log('Cancel')}
                    onClose={() => console.log('Close')}
                />
            </div>
        );
    },
};

export const Interactive: Story = {
    render: () => {
        const [savedData, setSavedData] = useState<{ title: string; content: string } | null>(null);

        const handleSave = (title: string, content: string) => {
            setSavedData({ title, content });
            console.log('Saved:', { title, content });
        };

        return (
            <div>
                <AddToContext
                    onSave={handleSave}
                    onCancel={() => console.log('Cancelled')}
                    onClose={() => console.log('Closed')}
                />
                {savedData && (
                    <div className="mt-4 p-4 bg-gray-100 rounded">
                        <p className="text-sm font-semibold">Last Saved:</p>
                        <p className="text-sm mt-2"><strong>Title:</strong> {savedData.title}</p>
                        <p className="text-sm mt-1"><strong>Content:</strong> {savedData.content.substring(0, 100)}...</p>
                        <p className="text-sm mt-1"><strong>Character Count:</strong> {savedData.content.length}/2500</p>
                    </div>
                )}
            </div>
        );
    },
};

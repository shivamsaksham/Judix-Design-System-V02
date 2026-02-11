import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UserQuery } from '@/components/block/user-query';
import { useState } from 'react';

const meta: Meta<typeof UserQuery> = {
    title: 'Block/UserQuery',
    component: UserQuery,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    decorators: [
        (Story) => (
            <div className="w-[800px] p-4">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof UserQuery>;

export const Default: Story = {
    render: () => {
        const [query, setQuery] = useState(
            'Anticipatory bail in domestic violence cases with strong evidence. Get me relevant acts, sections and supreme court judgments.'
        );

        return (
            <UserQuery
                query={query}
                onEdit={(newQuery) => {
                    setQuery(newQuery);
                    console.log('Query edited:', newQuery);
                }}
                onCopy={() => console.log('Query copied')}
            />
        );
    },
};

export const ShortQuery: Story = {
    render: () => {
        const [query, setQuery] = useState('What are the key provisions of Section 498A IPC?');

        return (
            <UserQuery
                query={query}
                onEdit={(newQuery) => {
                    setQuery(newQuery);
                    console.log('Query edited:', newQuery);
                }}
                onCopy={() => console.log('Query copied')}
            />
        );
    },
};

export const LongQuery: Story = {
    render: () => {
        const [query, setQuery] = useState(
            'I need comprehensive information about anticipatory bail in domestic violence cases where there is strong evidence against the accused. Please provide me with all relevant acts, sections, and supreme court judgments that deal with this specific scenario. Also include any recent amendments or landmark cases that might be relevant to this matter.'
        );

        return (
            <UserQuery
                query={query}
                onEdit={(newQuery) => {
                    setQuery(newQuery);
                    console.log('Query edited:', newQuery);
                }}
                onCopy={() => console.log('Query copied')}
            />
        );
    },
};

export const NonEditable: Story = {
    args: {
        query: 'This query cannot be edited.',
        isEditable: false,
    },
};

// Interactive story to demonstrate edit functionality
export const Interactive: Story = {
    render: () => {
        const [query, setQuery] = useState(
            'Anticipatory bail in domestic violence cases with strong evidence. Get me relevant acts, sections and supreme court judgments.'
        );
        const [copyMessage, setCopyMessage] = useState('');

        const handleEdit = (newQuery: string) => {
            setQuery(newQuery);
            console.log('Query updated to:', newQuery);
        };

        const handleCopy = () => {
            setCopyMessage('Copied!');
            setTimeout(() => setCopyMessage(''), 2000);
        };

        return (
            <div className="space-y-4">
                <UserQuery
                    query={query}
                    onEdit={handleEdit}
                    onCopy={handleCopy}
                />
                {copyMessage && (
                    <p className="">
                        {copyMessage}
                    </p>
                )}
                <div className="mt-4 p-4 bg-color-surface-neutral-hover_default rounded-lg">
                    <p className=" text-color-text-neutral-secondary mb-2">Current Query:</p>
                    <p className=" text-color-text-neutral-default">{query}</p>
                </div>
            </div>
        );
    },
};

// Multiple queries to show in a list
export const MultipleQueries: Story = {
    render: () => {
        const [query1, setQuery1] = useState('What are the grounds for filing anticipatory bail?');
        const [query2, setQuery2] = useState('Explain Section 438 of CrPC in detail.');
        const [query3, setQuery3] = useState('Recent Supreme Court judgments on domestic violence cases.');

        return (
            <div className="space-y-0">
                <UserQuery
                    query={query1}
                    onEdit={(newQuery) => {
                        setQuery1(newQuery);
                        console.log('Query 1 edited:', newQuery);
                    }}
                />
                <UserQuery
                    query={query2}
                    onEdit={(newQuery) => {
                        setQuery2(newQuery);
                        console.log('Query 2 edited:', newQuery);
                    }}
                />
                <UserQuery
                    query={query3}
                    onEdit={(newQuery) => {
                        setQuery3(newQuery);
                        console.log('Query 3 edited:', newQuery);
                    }}
                />
            </div>
        );
    },
};

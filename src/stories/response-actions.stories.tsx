import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { ResponseActions } from '@/components/block/response-actions';

const meta: Meta<typeof ResponseActions> = {
    title: 'Block/ResponseActions',
    component: ResponseActions,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        onDislike: { action: 'disliked' },
        onLike: { action: 'liked' },
        onRefresh: { action: 'refreshed' },
        onCopy: { action: 'copied' },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithLiked: Story = {
    args: {
        isLiked: true,
    },
};

export const WithDisliked: Story = {
    args: {
        isDisliked: true,
    },
};

export const Interactive: Story = {
    render: () => {
        const [isLiked, setIsLiked] = useState(false);
        const [isDisliked, setIsDisliked] = useState(false);
        const [copyText, setCopyText] = useState('Copy');

        const handleLike = () => {
            setIsLiked(!isLiked);
            if (isDisliked) setIsDisliked(false);
        };

        const handleDislike = () => {
            setIsDisliked(!isDisliked);
            if (isLiked) setIsLiked(false);
        };

        const handleCopy = () => {
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy'), 2000);
        };

        return (
            <div className="space-y-4">
                <ResponseActions
                    isLiked={isLiked}
                    isDisliked={isDisliked}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onRefresh={() => console.log('Refreshed')}
                    onCopy={handleCopy}
                />
                <div className="text-center">
                    {copyText === 'Copied!' && <span className="text-green-600">{copyText}</span>}
                </div>
            </div>
        );
    },
};

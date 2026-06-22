'use client';
import React from 'react';
import { HistoryTile } from './history-tile';

export interface ChatItem {
    id: string;
    title: string;
    onClick?: () => void;
}

export interface ChatHistorySectionProps {
    chatHistory: ChatItem[];
    activeChatId: string | null | undefined;
    onMenuClick: (chatId: string, event: React.MouseEvent) => void;
    className?: string;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
}

export const ChatHistorySection = ({ chatHistory, activeChatId, onMenuClick, className, onLoadMore, hasMore, isLoadingMore }: ChatHistorySectionProps) => {

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!onLoadMore || !hasMore || isLoadingMore) return;
        
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop - clientHeight < 50) {
            onLoadMore();
        }
    };

    return (
        <div className={`flex flex-col h-full ${className || ''}`}>
            {/* Fixed Heading */}
            <h3 className="shrink-0 p-3 text-style-body-default-emphasis text-color-text-neutral-tertiary opacity-60">
                Chats
            </h3>

            {/* Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto no-scrollbar p-1"
                onScroll={handleScroll}
            >
                {chatHistory.map((chat) => (
                    <HistoryTile
                        key={chat.id}
                        title={chat.title}
                        onClick={chat.onClick}
                        onMenuClick={(e) => onMenuClick(chat.id, e)}
                        isActive={activeChatId === chat.id}
                    />
                ))}
                
                {isLoadingMore && (
                    <div className="flex flex-col gap-2 mt-2 px-2">
                        <div className="h-10 bg-color-neutral-default animate-pulse rounded-md w-full opacity-50" />
                        <div className="h-10 bg-color-neutral-default animate-pulse rounded-md w-full opacity-50" />
                        <div className="h-10 bg-color-neutral-default animate-pulse rounded-md w-full opacity-50" />
                    </div>
                )}
            </div>
        </div>
    );
};

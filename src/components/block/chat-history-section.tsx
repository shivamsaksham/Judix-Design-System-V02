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
}

export const ChatHistorySection = ({ chatHistory, activeChatId, onMenuClick, className }: ChatHistorySectionProps) => {

    return (
        <div className={`flex flex-col h-full ${className || ''}`}>
            {/* Fixed Heading */}
            <h3 className="shrink-0 p-3 text-style-body-default-emphasis text-color-text-neutral-tertiary opacity-60">
                Chats
            </h3>

            {/* Scrollable Content */}
            <div
                className="flex-1 overflow-y-auto no-scrollbar p-1"
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
            </div>
        </div>
    );
};

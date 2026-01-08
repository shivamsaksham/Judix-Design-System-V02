'use client';
import React from 'react';
import { HistoryTile } from './history-tile';

export interface ChatItem {
    id: string;
    title: string;
    onClick?: () => void;
}

export interface ChatSectionProps {
    chatHistory: ChatItem[];
    activeChatId: string | null | undefined;
    onMenuClick: (chatId: string, event: React.MouseEvent) => void;
    className?: string;
}

export const ChatSection = ({ chatHistory, activeChatId, onMenuClick, className }: ChatSectionProps) => {
    return (
        <div className={`flex-1 flex flex-col p-1 mt-2 ${className || ''}`}>
            <h3 className="p-3 text-style-body-default-emphasis text-color-text-neutral-tertiary opacity-60 mb-1">
                Chats
            </h3>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
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

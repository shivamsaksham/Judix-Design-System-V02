'use client';
import React, { useEffect, useRef } from 'react';
import { HistoryTile } from './history-tile';

export interface ChatItem {
    id: string;
    title: string;
    onClick?: () => void;
}

export interface ChatHistorySectionProps {
    chatHistory: ChatItem[];
    activeChatId: string | null | undefined;
    loadingChatId?: string | null | undefined;
    onMenuClick: (chatId: string, event: React.MouseEvent) => void;
    className?: string;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
    isLoading?: boolean;
}

export const ChatHistorySection = ({ chatHistory, activeChatId, loadingChatId, onMenuClick, className, onLoadMore, hasMore, isLoadingMore, isLoading }: ChatHistorySectionProps) => {
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading && onLoadMore) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, hasMore, isLoadingMore, isLoading, onLoadMore]);

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
                {isLoading && chatHistory.length === 0 ? (
                    <div className="flex flex-col gap-2 mt-2 px-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-10 bg-color-neutral-default animate-pulse rounded-md w-full opacity-50" />
                        ))}
                    </div>
                ) : (
                    <>
                        {chatHistory.map((chat) => (
                            <HistoryTile
                                key={chat.id}
                                title={chat.title}
                                onClick={chat.onClick}
                                onMenuClick={(e) => onMenuClick(chat.id, e)}
                                isActive={activeChatId === chat.id}
                                isLoading={loadingChatId === chat.id}
                            />
                        ))}
                        
                        {isLoadingMore && (
                            <div className="flex flex-col gap-2 mt-2 px-2">
                                <div className="h-10 bg-color-neutral-default animate-pulse rounded-md w-full opacity-50" />
                                <div className="h-10 bg-color-neutral-default animate-pulse rounded-md w-full opacity-50" />
                                <div className="h-10 bg-color-neutral-default animate-pulse rounded-md w-full opacity-50" />
                            </div>
                        )}
                        
                        <div ref={observerTarget} className="h-2 w-full" />
                    </>
                )}
            </div>
        </div>
    );
};

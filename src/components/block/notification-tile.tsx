'use client';

import React from 'react';
import { Icon } from '@judix/icon';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface NotificationTileProps {
    title: string;  
    description: string;    
    timestamp: string;  
    state?: 'read' | 'unread'   ;
    onMarkAsRead?: () => void;  
    onClick?: () => void;   
    className?: string; 
    iconName?: string;  
}

export const NotificationTile = ({
    title,
    description,
    timestamp,
    state = 'unread',
    onMarkAsRead,
    onClick,
    className,
    iconName = 'notification-b',
}: NotificationTileProps) => {
    const handleMarkAsRead = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering onClick of the tile
        onMarkAsRead?.();
    };

    return (
        <div
            className={cn(
                'flex gap-1 p-4 transition-all duration-200 cursor-pointer text-left',
                'border-b border-color-border-neutral-default w-full',
                state === 'unread'
                    ? 'bg-color-surface-neutral-subtle_bg hover:bg-color-surface-neutral-hover_default'
                    : 'bg-color-surface-neutral-default hover:bg-color-surface-neutral-hover_default',
                className
            )}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            {/* Notification Icon */}
            <div className="shrink-0 p-1">
                <Icon
                    name={iconName as any}
                    className="text-color-icon-neutral-default"
                    size={20}
                />
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
                {/* Title & Notification Description Container */}
                <div className="flex flex-col">
                    {/* Title */}
                    <h4 className="p-1 text-style-body-title-regular text-color-text-neutral-default truncate">
                        {title}
                    </h4>

                    {/* Description - truncated after 2 lines */}
                    <p className="p-1 text-style-textblock-primary-subtext-regular text-color-text-neutral-tertiary wrap-break-words">
                        {description}
                    </p>
                </div>

                {/* Footer (Timestamp & Action) Container */}
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary">
                        {timestamp}
                    </span>

                    {state === 'unread' && onMarkAsRead && (
                        <Label
                            colorScheme="neutral"
                            size="small"
                            onClick={handleMarkAsRead}
                            className="cursor-pointer"
                        >
                            Mark as read
                        </Label>
                    )}
                </div>
            </div>
        </div>
    );
};

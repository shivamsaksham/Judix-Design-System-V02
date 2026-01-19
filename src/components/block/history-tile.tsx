'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from 'judix-icon';

export interface HistoryTileProps {
    title: string;
    onClick?: () => void;
    onMenuClick?: (e: React.MouseEvent) => void;
    className?: string;
    isActive?: boolean;
}

export const HistoryTile = ({
    title,
    onClick,
    onMenuClick,
    className,
    isActive = false,
}: HistoryTileProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent tile click when clicking menu
        onMenuClick?.(e);
    };

    return (
        <div
            className={cn(
                'group relative flex items-center justify-between',
                'p-2 rounded-lg cursor-pointer transition-colors duration-200',
                isActive ? 'bg-option-color-selected' : 'bg-transparent hover:bg-option-color-hover',
                className
            )}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Title with truncation */}
            <span
                className={cn(
                    'option-font-title',
                    isActive ? 'text-color-text-neutral-default' : 'text-color-text-neutral-secondary',
                    'overflow-hidden text-ellipsis whitespace-nowrap',
                    'flex-1 pr-2'
                )}
            >
                {title}
            </span>

            {/* Three-dot menu icon - always present but invisible when not hovered */}
            <button
                onClick={handleMenuClick}
                className={cn(
                    'flex-shrink-0 p-1 rounded-md hover:bg-option-color-hover',
                    'transition-all duration-200',
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                aria-label="Menu"
            >
                <Icon name="More" className="text-color-icon-neutral-default w-5 h-5 flex items-center justify-center m-1" />
            </button>
        </div>
    );
};

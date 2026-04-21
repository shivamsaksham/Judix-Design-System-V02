'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { IconButton } from '../ui/icon-button';
import Image from 'next/image';

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
                'w-full',
                'p-2 py-[6px] rounded-lg cursor-pointer transition-colors duration-200',
                'whitespace-nowrap',
                isActive
                    ? 'bg-option-color-selected hover:bg-option-color-selected'
                    : 'bg-transparent hover:bg-option-color-hover',
                className
            )}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Title with truncation */}
            <span
                className={`text-style-label-title-regular ${cn(
                    isActive ? 'text-color-text-neutral-default' : 'text-color-text-neutral-secondary',
                    'overflow-hidden text-ellipsis whitespace-nowrap',
                    'flex-1 min-w-0',
                    'p-1'
                )}`}
            >
                {title}
            </span>

            <IconButton
                onClick={handleMenuClick}
                variant="neutral"
                size="medium"
                className={cn(
                    'shrink-0 p-0 w-auto h-fit border-none',
                    'transition-all duration-200',
                    isActive
                        ? 'bg-transparent hover:bg-color-surface-neutral-subtle_bg'
                        : 'bg-transparent hover:bg-option-color-hover',
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'
                )}
                aria-label="Menu"
            >
                <Image src="ellipsis.svg" alt="ellipsis" width={3} height={13} className="m-1 text-color-icon-neutral-default w-5 h-5" />
            </IconButton>
        </div>
    );
};

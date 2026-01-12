'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface ResponseActionsProps {
    onDislike?: () => void;
    onLike?: () => void;
    onRefresh?: () => void;
    onCopy?: () => void;
    className?: string;
    isLiked?: boolean;
    isDisliked?: boolean;
}

export const ResponseActions = ({
    onDislike,
    onLike,
    onRefresh,
    onCopy,
    className,
    isLiked = false,
    isDisliked = false,
}: ResponseActionsProps) => {
    return (
        <div
            className={cn(
                'flex items-center gap-1 p-2',
                'bg-color-surface-neutral-default',
                className
            )}
        >
            {/* Dislike Button */}
            <Button
                onClick={onDislike}
                variant="neutral"
                size="small"
                prefixIcon="Dislike"
                className={cn(
                    'p-2 h-fit border-none bg-transparent hover:bg-option-color-hover',
                    isDisliked && 'bg-option-color-selected'
                )}
                iconClassName="w-4 h-4"
                aria-label="Dislike"
            />

            {/* Like Button */}
            <Button
                onClick={onLike}
                variant="neutral"
                size="small"
                prefixIcon="Like1"
                className={cn(
                    'p-2 h-fit border-none bg-transparent hover:bg-option-color-hover',
                    isLiked && 'bg-option-color-selected'
                )}
                iconClassName="w-4 h-4"
                aria-label="Like"
            />

            {/* Refresh Button */}
            <Button
                onClick={onRefresh}
                variant="neutral"
                size="small"
                prefixIcon="Refresh2"
                className="p-2 h-fit border-none bg-transparent hover:bg-option-color-hover"
                iconClassName="w-4 h-4"
                aria-label="Refresh2"
            />

            {/* Copy Button */}
            <Button
                onClick={onCopy}
                variant="neutral"
                size="small"
                prefixIcon="Copy"
                className="p-2 h-fit border-none bg-transparent hover:bg-option-color-hover"
                iconClassName="w-4 h-4"
                aria-label="Copy"
            />
        </div>
    );
};

'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/toast';

export interface ResponseActionsProps {
    onDislike?: () => void;
    onLike?: () => void;
    onRefresh?: () => void;
    onCopy?: () => void;
    className?: string;
    isLiked?: boolean;
    isDisliked?: boolean;
    contentToCopy?: string;
}

export const ResponseActions = ({
    onDislike,
    onLike,
    onRefresh,
    onCopy,
    className,
    isLiked: externalIsLiked,
    isDisliked: externalIsDisliked,
    contentToCopy,
}: ResponseActionsProps) => {
    const [internalIsLiked, setInternalIsLiked] = useState(false);
    const [internalIsDisliked, setInternalIsDisliked] = useState(false);

    // Use external state if provided, otherwise use internal state
    const isLiked = externalIsLiked !== undefined ? externalIsLiked : internalIsLiked;
    const isDisliked = externalIsDisliked !== undefined ? externalIsDisliked : internalIsDisliked;

    const handleLike = () => {
        if (onLike) {
            onLike();
        } else {
            setInternalIsLiked(!internalIsLiked);
            if (internalIsDisliked) setInternalIsDisliked(false);
        }
    };

    const handleDislike = () => {
        if (onDislike) {
            onDislike();
        } else {
            setInternalIsDisliked(!internalIsDisliked);
            if (internalIsLiked) setInternalIsLiked(false);
        }
    };

    const handleCopy = async () => {
        if (onCopy) {
            onCopy();
        } else {
            try {
                if (contentToCopy) {
                    await navigator.clipboard.writeText(contentToCopy);
                    showToast.success('Copied to clipboard');
                } else {
                    showToast.alert('No content to copy');
                }
            } catch (error) {
                showToast.alert('Failed to copy');
            }
        }
    };

    const handleRefresh = () => {
        if (onRefresh) {
            onRefresh();
        } else {
            // Default behavior: just log (parent should handle actual refresh)
            console.log('Refresh clicked - implement refresh logic in parent component');
        }
    };

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
                onClick={handleDislike}
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
                onClick={handleLike}
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
                onClick={handleRefresh}
                variant="neutral"
                size="small"
                prefixIcon="Refresh2"
                className="p-2 h-fit border-none bg-transparent hover:bg-option-color-hover"
                iconClassName="w-4 h-4"
                aria-label="Refresh2"
            />

            {/* Copy Button */}
            <Button
                onClick={handleCopy}
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

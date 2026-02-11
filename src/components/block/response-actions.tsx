'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/icon-button';
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
    contentToCopy,
}: ResponseActionsProps) => {
    const [internalIsLiked, setInternalIsLiked] = useState(false);
    const [internalIsDisliked, setInternalIsDisliked] = useState(false);

    // Use external state if provided, otherwise use internal state
    // const isLiked = externalIsLiked !== undefined ? externalIsLiked : internalIsLiked;
    // const isDisliked = externalIsDisliked !== undefined ? externalIsDisliked : internalIsDisliked;

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
            } catch {
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
            <IconButton
                onClick={handleDislike}
                variant="neutral"
                size="medium"
                corner="sharp"
                icon="dislike"
                aria-label="Dislike"
            />

            {/* Like Button */}
            <IconButton
                onClick={handleLike}
                variant="neutral"
                size="medium"
                corner="sharp"
                icon="like-a"
                aria-label="Like"
            />

            {/* Refresh Button */}
            <IconButton
                onClick={handleRefresh}
                variant="neutral"
                size="medium"
                corner="sharp"
                icon="refresh-a"
                aria-label="Refresh"
            />

            {/* Copy Button */}
            <IconButton
                onClick={handleCopy}
                variant="neutral"
                size="medium"
                corner="sharp"
                icon="copy"
                aria-label="Copy"
            />
        </div>
    );
};

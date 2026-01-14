'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { IconButton } from '@/components/ui/icon-button';

export interface GlobalContextProps {
    title: string;
    lineCount: number;
    fileType: string;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
    className?: string;
}

export const GlobalContext = ({
    title,
    lineCount,
    fileType,
    onEdit,
    onDelete,
    onClick,
    className,
}: GlobalContextProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleCardClick = () => {
        onClick?.();
    };

    return (
        <div
            onClick={handleCardClick}
            className={cn(
                'relative max-w-[132px] h-[144px] p-1 overflow-hidden',
                'border rounded-button-border-radius-default border-color-border-neutral-default',
                'transition-all duration-200',
                'flex flex-col justify-between',
                onClick && 'cursor-pointer',
                isHovered
                    ? 'bg-color-surface-neutral-hover_default'
                    : 'bg-color-surface-neutral-default',
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Title and Line Count */}
            <div className="overflow-hidden">
                <h3 className="p-1 text-style-textblock-primary-caption-regular text-color-text-neutral-secondary mb-2 line-clamp-3">
                    {title}
                </h3>

                {/* Line Count */}
                <p className="p-1 text-style-label-default-regular text-color-text-neutral-tertiary truncate">
                    {lineCount} lines
                </p>
            </div>

            {/* Bottom Section with File Type and Edit Icon */}
            <div className="relative flex items-end justify-between">
                {/* File Type Label - Bottom Left */}
                <Label colorScheme="neutral" size="small" className={cn(isHovered && 'bg-label-color-neutral-bg')}>
                    {fileType}
                </Label>

                {/* Edit Button - Only visible on hover */}
                {onEdit && (
                    <div
                        className={cn(
                            'transition-opacity duration-200 flex gap-2',
                            isHovered ? 'opacity-100' : 'opacity-0'
                        )}
                    >
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.();
                            }}
                            icon="Edit2"
                            variant="neutral"
                            size="medium"
                            corner='sharp'
                            className='border-none bg-transparent p-0 h-fit w-fit text-color-icon-neutral-default'
                        />
                        {onDelete && (
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete?.();
                                }}
                                icon="Trash"
                                variant="neutral"
                                size="medium"
                                corner='sharp'
                                className='border-none bg-transparent p-0 h-fit w-fit text-color-icon-feedback-error-default'
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

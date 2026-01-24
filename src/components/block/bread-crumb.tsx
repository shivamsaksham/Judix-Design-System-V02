'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button, IconButton, Label } from '@/components/ui';

export interface BreadcrumbItem {
    id: string;
    label: string;
    onClick?: () => void;
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
    showDropdown?: boolean;
    onDropdownClick?: () => void;
    onUseProject?: () => void;
    variant?: 'default' | 'header';
    buttonLabel?: string;
}

export default function Breadcrumb({
    items,
    className,
    showDropdown = false,
    onDropdownClick,
    onUseProject,
    variant = 'default',
    buttonLabel = 'Use this project',
}: BreadcrumbProps) {
    const outerClasses = variant === 'header'
        ? 'self-stretch inline-flex justify-start items-center gap-2 bg-white sticky top-0 z-40'
        : 'w-full';

    const innerClasses = cn(
        'flex justify-start items-center gap-2 pl-2 pr-4 py-2 bg-color-surface-neutral-subtle_bg rounded-lg h-[44px]',
        variant === 'header' ? 'flex-1 max-w-[1024px] mx-auto' : 'w-full'
    );

    return (
        <div className={cn(outerClasses, className)}>
            <div className={innerClasses}>
                {onUseProject && (
                    <div className="flex justify-start items-start flex-shrink-0">
                        <Button
                            variant="neutral"
                            size="extraSmall"
                            onClick={onUseProject}
                            className="h-7 px-3"
                        >
                            {buttonLabel}
                        </Button>
                    </div>
                )}

                <div className="flex-1 flex justify-start items-center overflow-hidden">
                    {items.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <div className="p-1 flex justify-center items-center gap-2 flex-shrink-0 overflow-hidden">
                                <Label
                                    colorScheme="neutral"
                                    size="small"
                                    onSelect={item.onClick}
                                    className={cn(
                                        "truncate border-0",
                                        item.onClick ? "cursor-pointer" : "cursor-default",
                                        index === items.length - 1 ? "text-color-text-neutral-default font-medium" : "text-color-text-neutral-secondary font-normal"
                                    )}
                                >
                                    {item.label}
                                </Label>
                            </div>
                            {index < items.length - 1 && (
                                <div className="p-1 flex justify-center items-center gap-2 flex-shrink-0">
                                    <span className="text-color-text-neutral-secondary text-sm font-normal font-brandprimary">/</span>
                                </div>
                            )}
                        </React.Fragment>
                    ))}

                    {showDropdown && (
                        <div className="flex justify-end items-center gap-2 ml-auto pl-2">
                            <IconButton
                                variant="neutral"
                                size="medium"
                                icon="arrow-down-c"
                                onClick={onDropdownClick}
                                aria-label="Toggle dropdown"
                                className="flex-shrink-0 text-color-icon-neutral-secondary"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
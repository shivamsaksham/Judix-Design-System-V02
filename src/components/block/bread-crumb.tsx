'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button, IconButton, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { ChatHistoryMenu } from './chat-history-menu';
import { Icon } from '@judix/icon';

export interface BreadcrumbItem {
    id: string;
    label: string;
    onClick?: () => void;
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
    onUseProject?: () => void;
    buttonLabel?: string;
    showDropdown?: boolean;
    onDropdownClick?: () => void;
    options?: { 
        value: string; 
        title: string; 
        subtext?: string; 
        iconName?: string; 
        dividerAfter?: boolean; 
        variant?: 'default' | 'danger';
    }[];
    onHistorySelect?: (id: string) => void;
}

export default function Breadcrumb({
    items,
    className,
    onUseProject,
    buttonLabel = 'Use this project',
    showDropdown = false,
    onDropdownClick,
    options = [],
    onHistorySelect,
}: BreadcrumbProps) {
    const outerClasses = 'w-full items-center';

    const innerClasses = cn(
        'flex justify-start items-center gap-x-2 pl-2 pr-4 py-2 bg-color-surface-neutral-subtle_bg rounded-lg h-auto w-full'
    );

    const isChatOrNote = items.some(item =>
        item.label.toLowerCase().includes('chat') ||
        item.label.toLowerCase().includes('note')
    );
    const effectiveShowDropdown = showDropdown && !isChatOrNote;

    const menuActions = [
        {
            value: 'rename',
            title: 'Rename',
            iconName: 'edit-a',
        },
        {   
            value: 'share',
            title: 'Share',
            iconName: 'export-d',
        },
        {
            value: 'move',
            title: 'Move to project',
            iconName: 'folder-a',
            dividerAfter: true,
        },
        {
            value: 'remove-from-saved',
            title: 'Remove from saved',
            iconName: 'note-remove',
        },
        {
            value: 'delete',
            title: 'Delete',
            iconName: 'trash',
            variant: 'danger',
        },
    ];

    const isArchive = items.some(item => item.label.toLowerCase().includes('archive'));

    const filteredMenuActions = menuActions.filter(action => {
        if (action.value === 'remove-from-saved') return isArchive;
        return true;
    });

    const currentOptions = options.length > 0 ? options : filteredMenuActions;

    return (
        //Chat History Menu is used here to use w-full of the parent which is not available for the dropdown component
        <div className={cn(outerClasses, className)}>
            <div className={innerClasses}>
                {onUseProject && (
                    <div className="flex justify-start items-center shrink-0">
                        <Button
                            variant="neutral"
                            size="medium"
                            onClick={onUseProject}
                        >
                            {buttonLabel}
                        </Button>
                    </div>
                )}

                <div className="flex-1 flex flex-wrap justify-start items-center gap-y-2">
                    {items.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <div
                                className="p-1 font-body-default-regular text-color-text-neutral-secondary cursor-pointer flex justify-start items-center shrink-0"
                                onClick={item.onClick}
                            >
                                {item.label}
                            </div>
                            {index < items.length - 1 && (
                                <div className="px-2 flex justify-center items-center shrink-0">
                                    <span className="font-body-default-regular text-color-text-neutral-secondary flex items-center">/</span>
                                </div>
                            )}
                        </React.Fragment>
                    ))}

                    {effectiveShowDropdown && (
                        <div className="flex justify-end items-center gap-2 ml-auto pl-2 shrink-0">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <IconButton
                                        variant="neutral"
                                        size="medium"
                                        icon="arrow-down-c"
                                        onClick={onDropdownClick}
                                        aria-label="Toggle dropdown"
                                        className="shrink-0 text-color-icon-neutral-secondary"
                                    />
                                </PopoverTrigger>
                                <PopoverContent className="p-0 w-fit border-none bg-transparent shadow-none" align="end">
                                    <ChatHistoryMenu
                                        items={currentOptions.map(opt => ({
                                            id: opt.value,
                                            label: opt.title || '',
                                            icon: opt.iconName ? (
                                                <Icon 
                                                    name={opt.iconName as any} 
                                                    className={opt.iconName === 'folder-a' ? 'text-color-icon-neutral-default' : ''} 
                                                />
                                            ) : undefined,
                                            dividerAfter: opt.dividerAfter,
                                            variant: opt.variant as "default" | "danger" | undefined,
                                            onClick: () => {
                                                onHistorySelect?.(opt.value);
                                            }
                                        }))}
                                        className="w-[216px]"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
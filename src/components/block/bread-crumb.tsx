'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { IconButton, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { Label } from '@/components/ui/label';
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
        'flex flex-col md:flex-row justify-start items-start md:items-center gap-3 md:gap-x-2 pl-3 pr-4 py-3 bg-color-surface-neutral-subtle_bg rounded-lg h-auto w-full'
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

    const parentItems = items.slice(0, items.length - 1);
    const activeItem = items[items.length - 1];

    return (
        <div className={cn(outerClasses, className)}>
            {/* Desktop Layout */}
            <div className={cn(innerClasses, "hidden md:flex")}>
                {onUseProject && (
                    <div className="flex justify-start items-center shrink-0 order-2 md:order-0 cursor-pointer">
                        <Label
                            colorScheme="neutral"
                            size="medium"
                            className="cursor-pointer"
                            onClick={onUseProject}
                        >
                            {buttonLabel}
                        </Label>
                    </div>
                )}

                <div className="flex-1 flex items-center justify-start min-w-0 order-1 md:order-0 w-full md:w-auto">
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;
                        return (
                            <React.Fragment key={item.id}>
                                <div
                                    className={cn(
                                        "p-1 font-body-default-regular cursor-pointer flex justify-start items-center",
                                        isLast ? "text-color-text-neutral-default truncate min-w-0" : "text-color-text-neutral-secondary shrink-0 whitespace-nowrap"
                                    )}
                                    onClick={item.onClick}
                                    title={item.label}
                                >
                                    {isLast ? <span className="truncate">{item.label}</span> : item.label}
                                </div>
                                {!isLast && (
                                    <div className="flex justify-center items-center shrink-0">
                                        <span className="p-1 font-body-default-regular text-color-text-neutral-secondary flex items-center">/</span>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}

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

            {/* Mobile Layout */}
            <div className="flex md:hidden flex-col w-full md:gap-2 pl-4 pr-4 py-3 bg-color-surface-neutral-subtle_bg rounded-lg ">
                <div className="flex items-center min-w-0 text-style-body-default-regular text-color-text-neutral-secondary">
                    {parentItems.map((item) => (
                        <React.Fragment key={item.id}>
                            <span 
                                onClick={item.onClick} 
                                className="cursor-pointer shrink-0 whitespace-nowrap"
                            >
                                {item.label}
                            </span>
                            <span className="mx-1 shrink-0">/</span>
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex items-center justify-between w-full mt-2">
                    {activeItem && (
                        <div className="flex-1 min-w-0">
                            {showDropdown ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="flex items-center justify-between text-style-body-default-regular text-color-text-neutral-default font-medium hover:opacity-85 active:opacity-70 focus:outline-none w-full p-1">
                                            <span className="truncate max-w-[calc(100vw-120px)]" title={activeItem.label}>{activeItem.label}</span>
                                            <Icon name="arrow-down-c" className="w-4 h-4 shrink-0 text-color-icon-neutral-secondary" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-fit border-none bg-transparent shadow-none" align="start">
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
                            ) : (
                                <span 
                                    className="p-1 text-style-body-default-regular text-color-text-neutral-default font-medium truncate block cursor-pointer"
                                    onClick={activeItem.onClick}
                                    title={activeItem.label}
                                >
                                    {activeItem.label}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
'use client';
import React from 'react';
import { Icon } from 'judix-icon';
import { Button } from '../ui';
import { cn } from '@/lib/utils';

export interface SidebarActionButtonsProps {
    onNewChat?: () => void;
    onNotes?: () => void;
    onProjects?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const SidebarActionButtons = ({ onNewChat, onNotes, onProjects, className, style }: SidebarActionButtonsProps) => {
    return (
        <div className={cn("p-1 mr-3 ml-1 mb-2", className)} style={style}>
            <Button
                onClick={onNewChat}
                variant="neutral"
                className="w-full h-fit p-1 rounded-lg gap-0 
                           hover:bg-option-color-hover transition-colors text-left
                           bg-color-surface-neutral-default border-none
                           justify-start"
                prefixIcon="Edit"
                iconClassName='m-2 mr-0'
            >
                <div className='p-1 text-style-label-title-regular text-color-text-neutral-default'>New Chat</div>
            </Button>
            <Button
                onClick={onNotes}
                variant="neutral"
                className="w-full h-fit p-1 rounded-lg gap-0 
                           hover:bg-option-color-hover transition-colors text-left
                           bg-color-surface-neutral-default border-none
                           justify-start"
                prefixIcon="Note1"
                iconClassName='m-2 mr-0'
            >
                <div className="p-1 text-style-label-title-regular text-color-text-neutral-default">Notes</div>
            </Button>
            <Button
                onClick={onProjects}
                variant="neutral"
                className="w-full h-fit p-1 rounded-lg gap-0 
                           hover:bg-option-color-hover transition-colors text-left
                           bg-color-surface-neutral-default border-none
                           justify-start"
                prefixIcon="DocumentText"
                iconClassName='m-2 mr-0'
            >
                <div className="p-1 text-style-label-title-regular text-color-text-neutral-default">Projects</div>
            </Button>
        </div>
    );
};

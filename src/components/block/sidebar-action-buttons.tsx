'use client';
import React from 'react';
import { IconButton } from '../ui/icon-button';

export interface SidebarActionButtonsProps {
    onNewChat?: () => void;
    onNotes?: () => void;
    onProjects?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

export const SidebarActionButtons = ({ onNewChat, onNotes, onProjects, style }: SidebarActionButtonsProps) => {
    return (
        <div className="p-1 mr-3 ml-1 mb-2" style={style}>
            <div
                onClick={onNewChat}
                data-tour="sidebar-new-chat"
                className="w-full h-fit p-1 rounded-lg gap-0 flex items-center
                           hover:bg-option-color-hover transition-colors cursor-pointer
                           bg-color-surface-neutral-default whitespace-nowrap"
            >
                <IconButton
                    icon="edit-b"
                    variant="neutral"
                    size="medium"
                    corner="sharp"
                    className="mr-0 pointer-events-none bg-transparent hover:bg-transparent border-none"
                />
                <div className='p-1 text-style-body-default-regular text-color-text-neutral-default'>New Chat</div>
            </div>
            <div
                onClick={onNotes}
                data-tour="sidebar-notes"
                className="w-full h-fit p-1 rounded-lg gap-0 flex items-center
                           hover:bg-option-color-hover transition-colors cursor-pointer
                           bg-color-surface-neutral-default"
            >
                <IconButton
                    icon="note-a"
                    variant="neutral"
                    size="medium"
                    corner="sharp"
                    className="mr-0 pointer-events-none bg-transparent hover:bg-transparent border-none"
                />
                <div className="p-1 text-style-body-default-regular text-color-text-neutral-default">Notes</div>
            </div>
            <div
                onClick={onProjects}
                data-tour="sidebar-projects"
                className="w-full h-fit p-1 rounded-lg gap-0 flex items-center
                           hover:bg-option-color-hover transition-colors cursor-pointer
                           bg-color-surface-neutral-default"
            >
                <IconButton
                    icon="folder-a"
                    variant="neutral"
                    size="medium"
                    corner="sharp"
                    className="mr-0 pointer-events-none bg-transparent hover:bg-transparent border-none"
                />
                <div className="p-1 text-style-body-default-regular text-color-text-neutral-default">Projects</div>
            </div>
        </div>
    );
};

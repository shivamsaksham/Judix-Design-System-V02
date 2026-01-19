'use client';
import React from 'react';
import { Icon } from 'judix-icon';

export interface SidebarActionButtonsProps {
    onNewChat?: () => void;
    onNotes?: () => void;
    onProjects?: () => void;
}

export const SidebarActionButtons = ({ onNewChat, onNotes, onProjects }: SidebarActionButtonsProps) => {
    return (
        <div className="p-1 mr-3 ml-1 mb-2">
            <button
                onClick={onNewChat}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-option-color-hover transition-colors text-left"
            >
                <Icon name="Edit" className="text-option-color-icon w-4 h-self-stretch m-2" />
                <span className="text-style-label-title-regular text-color-text-neutral-default">New chat</span>
            </button>
            <button
                onClick={onNotes}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-option-color-hover transition-colors text-left"
            >
                <Icon name="Note1" className="text-option-color-icon w-4 h-self-stretch m-2" />
                <span className="text-style-label-title-regular text-color-text-neutral-default">Notes</span>
            </button>       
            <button
                onClick={onProjects}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-option-color-hover transition-colors text-left"
            >
                {/* TODO: Replace with correct icon */} 
                <Icon name="DocumentText" className="text-option-color-icon w-4 h-self-stretch m-2" />
                <span className="text-style-label-title-regular text-color-text-neutral-default">Projects</span>
            </button>
        </div>
    );
};

'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { GlobalContextManagement, ContextFile } from './global-context-management';
import { Label } from '@/components/ui/label';
import { IconButton } from '@/components/ui/icon-button';

export interface NewProjectProps {
    titlePlaceholder?: string;
    descriptionPlaceholder?: string;
    sectionTitle?: string;
    emptyStateText?: string;
    initialContextFiles?: ContextFile[];
    onContextChange?: (files: ContextFile[]) => void;
    onTitleChange?: (title: string) => void;
    onDescriptionChange?: (description: string) => void;
    className?: string;
}

export const NewProject = ({
    titlePlaceholder = 'New Project',
    descriptionPlaceholder = 'Description of what this Space is for and how to use it',
    sectionTitle = 'Global context files',
    emptyStateText = 'Click to add project-wide global context information like case facts, client discussions etc.',
    initialContextFiles = [],
    onContextChange,
    onTitleChange,
    onDescriptionChange,
    className,
}: NewProjectProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleTitleChange = (value: string) => {
        setTitle(value);
        onTitleChange?.(value);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        onDescriptionChange?.(value);
    };
    return (
        <div className={cn('w-full max-w-[600px] p-6 bg-color-surface-neutral-default', className)}>
            {/* Header Section */}
            <div className="mb-12">
                {/* Icon */}
                <IconButton
                    icon="DocumentText"
                    variant="primary_2_tone"
                    size="large"
                    corner='sharp'
                    className="mb-4 bg-icon_button-color-primary-hover"
                />

                {/* Title Input */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder={titlePlaceholder}
                    className="w-full p-1 text-[36px] font-family-brandprimary font-medium leading-[100%] tracking-[-1px] text-color-text-neutral-disabled placeholder:text-color-text-neutral-disabled mb-2 border-none bg-transparent focus:outline-none"
                />

                {/* Description Input */}
                <input
                    type="text"
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder={descriptionPlaceholder}
                    className="w-full p-1 text-style-body-title-regular text-color-text-neutral-disabled placeholder:text-color-text-neutral-disabled border-none bg-transparent focus:outline-none"
                />
            </div>

            {/* Section Title */}
            <Label
                colorScheme="neutral"
                size="medium"
                className="mb-1 hover:bg-color-surface-neutral-default"
            >
                {sectionTitle}
            </Label>

            {/* Global Context Management */}
            <GlobalContextManagement
                emptyStateText={emptyStateText}
                initialContextFiles={initialContextFiles}
                onContextChange={onContextChange}
            />
        </div>
    );
};

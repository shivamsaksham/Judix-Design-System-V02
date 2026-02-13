'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { GlobalContextManagement, ContextFile } from './global-context-management';
import { Label } from '@/components/ui/label';
import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';

export interface NewProjectProps {
    titlePlaceholder?: string;
    descriptionPlaceholder?: string;
    sectionTitle?: string;
    emptyStateText?: string;
    initialTitle?: string;
    initialDescription?: string;
    initialContextFiles?: ContextFile[];
    onContextChange?: (files: ContextFile[]) => void;
    onTitleChange?: (title: string) => void;
    onDescriptionChange?: (description: string) => void;
    onCreate?: () => void;
    onCancel?: () => void;
    className?: string;
    submitButtonText?: string;
    isMobile?: boolean;
}

export const NewProject = ({
    initialTitle = '',
    initialDescription = '',
    titlePlaceholder = 'Type your project name here...',
    descriptionPlaceholder = 'Description of your project and what it is for.',
    sectionTitle = 'Global context files',
    emptyStateText = 'Click to add project-wide global context information like case facts, client discussions etc.',
    initialContextFiles = [],
    onContextChange,
    onTitleChange,
    onDescriptionChange,
    onCreate,
    onCancel,
    className,
    submitButtonText = 'Create',
    // isMobile = false,

}: NewProjectProps) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    // const [contextFiles, setContextFiles] = useState(initialContextFiles); // We might need to sync this too

    // Sync state with props when switching projects
    React.useEffect(() => {
        setTitle(initialTitle);
        setDescription(initialDescription);
    }, [initialTitle, initialDescription]);

    // Note: GlobalContextManagement handles its own state but accepts initialContextFiles. 
    // If we want to reset it, we might need a key or similar mechanism.
    // For now, let's assume switching the component instance (by key) or reliance on key prop in ProjectsPage will handle reset.


    const handleTitleChange = (value: string) => {
        setTitle(value);
        onTitleChange?.(value);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        onDescriptionChange?.(value);
    };
    return (
        <div className={cn('w-full max-w-[882px] p-6 bg-color-surface-neutral-default text-left items-start', className)}>

            {/* Header Section */}
            <div className="mb-12">
                {/* Icon */}
                <IconButton
                    icon="folder-a"
                    variant="primary_2_tone"
                    size="large"
                    corner="sharp"
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

            {/* Action Buttons */}
            <div className="flex gap-2 mt-12">
                <Button
                    variant="primary"
                    size="small"
                    onClick={onCreate}
                >
                    {submitButtonText}
                </Button>
                <Button
                    variant="neutral"
                    size="small"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

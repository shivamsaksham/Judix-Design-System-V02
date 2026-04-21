'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { GlobalContextManagement, ContextFile } from './global-context-management';
import { Label } from '@/components/ui/label';
import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';

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
    initialClientName?: string;
    initialCourt?: string;
    initialCaseType?: string;
    initialCaseNumber?: string;
    onClientNameChange?: (val: string) => void;
    onCourtChange?: (val: string) => void;
    onCaseTypeChange?: (val: string) => void;
    onCaseNumberChange?: (val: string) => void;
}

export const NewProject = ({
    initialTitle = '',
    initialDescription = '',
    titlePlaceholder = 'Type your project name here...',
    descriptionPlaceholder = 'Description of your project and what it is for.',
    sectionTitle = 'Case context files',
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
    initialClientName = '',
    initialCourt = '',
    initialCaseType = '',
    initialCaseNumber = '',
    onClientNameChange,
    onCourtChange,
    onCaseTypeChange,
    onCaseNumberChange,

}: NewProjectProps) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [clientName, setClientName] = useState(initialClientName);
    const [court, setCourt] = useState(initialCourt);
    const [caseType, setCaseType] = useState(initialCaseType);
    const [caseNumber, setCaseNumber] = useState(initialCaseNumber);
    // const [contextFiles, setContextFiles] = useState(initialContextFiles); // We might need to sync this too

    // Sync state with props when switching projects
    React.useEffect(() => {
        setTitle(initialTitle);
        setDescription(initialDescription);
        setClientName(initialClientName);
        setCourt(initialCourt);
        setCaseType(initialCaseType);
        setCaseNumber(initialCaseNumber);
    }, [initialTitle, initialDescription, initialClientName, initialCourt, initialCaseType, initialCaseNumber]);

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

    const handleClientNameChange = (value: string) => {
        setClientName(value);
        onClientNameChange?.(value);
    };

    const handleCourtChange = (value: string) => {
        setCourt(value);
        onCourtChange?.(value);
    };

    const handleCaseTypeChange = (value: string) => {
        setCaseType(value);
        onCaseTypeChange?.(value);
    };

    const handleCaseNumberChange = (value: string) => {
        setCaseNumber(value);
        onCaseNumberChange?.(value);
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
                    autoComplete='off'
                    className="w-full p-1 text-[36px] font-family-brandprimary font-medium leading-[100%] tracking-[-1px] text-color-text-neutral-disabled placeholder:text-color-text-neutral-disabled mb-4 border-none bg-transparent focus:outline-none"
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

            <div className="flex flex-col gap-4 mt-6">
                <TextInput
                    label="Client name"
                    inputSize='medium'
                    placeholder="Enter your client name here."
                    value={clientName}
                    onChange={(e) => handleClientNameChange(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TextInput
                        label="Court"
                        inputSize='medium'
                        placeholder="e.g. Patna High Court"
                        value={court}
                        onChange={(e) => handleCourtChange(e.target.value)}
                        />
                    <TextInput
                        label="Case type"
                        inputSize='medium'
                        placeholder="e.g. Civil Appeal"
                        value={caseType}
                        onChange={(e) => handleCaseTypeChange(e.target.value)}
                        />
                    <TextInput
                        label="Case Number"
                        inputSize='medium'
                        placeholder="e.g. 1234/2024"
                        value={caseNumber}
                        onChange={(e) => handleCaseNumberChange(e.target.value)}
                    />
                </div>
            </div>

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

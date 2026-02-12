'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Add } from '@judix/icon';
import { GlobalContext } from './global-context';
import AddToContext from './context-add-modal';
import { Button } from '@/components/ui/button';

export interface ContextFile {
    id: string;
    title: string;
    content: string;
    lineCount: number;
    fileType: string;
}

export interface GlobalContextManagementProps {
    emptyStateText?: string;
    initialContextFiles?: ContextFile[];
    onContextChange?: (files: ContextFile[]) => void;
    className?: string;
}

export const GlobalContextManagement = ({
    emptyStateText = 'Click to add project-wide global context information like case facts, client discussions etc.',
    initialContextFiles = [],
    onContextChange,
    className,
}: GlobalContextManagementProps) => {
    const [contextFiles, setContextFiles] = useState<ContextFile[]>(initialContextFiles);
    const [showModal, setShowModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedContext, setSelectedContext] = useState<{ title: string; content: string } | null>(null);
    const [deletingTitle, setDeletingTitle] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const hasContext = contextFiles.length > 0;

    // const handleContextClick = (title: string) => {
    //     setSelectedContext({ title, content: '' });
    //     setShowModal(true);
    // };

    const handleAddClick = () => {
        setSelectedContext({ title: '', content: '' });
        setShowModal(true);
    };

    const handleSave = (title: string, content: string) => {
        console.log('Saved:', { title, content });

        // Check if we're editing an existing context or adding a new one
        const existingIndex = contextFiles.findIndex(file => file.title === selectedContext?.title);

        let updatedFiles: ContextFile[];

        if (existingIndex !== -1 && selectedContext?.title) {
            // Update existing context
            updatedFiles = [...contextFiles];
            updatedFiles[existingIndex] = {
                ...updatedFiles[existingIndex],
                title: title,
                content: content,
                lineCount: content.split('\n').length,
            };
        } else {
            // Add new context
            updatedFiles = [
                ...contextFiles,
                {
                    id: `context-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    title: title,
                    content: content,
                    lineCount: content.split('\n').length,
                    fileType: 'TXT',
                }
            ];
        }

        setContextFiles(updatedFiles);
        onContextChange?.(updatedFiles);
        closeModal();
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setIsClosing(false);
            setSelectedContext(null);
        }, 200); // Match animation duration
    };

    const handleCancel = () => {
        closeModal();
    };

    const handleEdit = (title: string) => {
        const file = contextFiles.find(f => f.title === title);
        setSelectedContext({ title, content: file?.content || '' });
        setShowModal(true);
    };

    const handleDelete = (title: string) => {
        // Start fade-out animation
        setDeletingTitle(title);

        // Wait for animation to complete before removing
        setTimeout(() => {
            const updatedFiles = contextFiles.filter(f => f.title !== title);
            setContextFiles(updatedFiles);
            onContextChange?.(updatedFiles);
            setDeletingTitle(null);
        }, 200); // Match animation duration

    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        const newContextFiles: ContextFile[] = [];

        for (const file of files) {
            let content = "";
            let fileType = "TXT";

            if (file.type === "application/pdf") {
                fileType = "PDF";
                content = `[PDF File: ${file.name}]`; // Placeholder for PDF content
            } else {
                try {
                    content = await file.text();
                } catch (err) {
                    console.error("Failed to read file", file.name, err);
                    content = "[Error reading file]";
                }
            }

            newContextFiles.push({
                id: `context-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: file.name,
                content: content,
                lineCount: content.split('\n').length,
                fileType: fileType,
            });
        }

        const updatedFiles = [...contextFiles, ...newContextFiles];
        setContextFiles(updatedFiles);
        onContextChange?.(updatedFiles);
    };

    return (
        <>
            <div
                className={cn(
                    'w-full max-w-[608px] transition-colors duration-200 rounded-2xl',
                    isDragging && "bg-color-surface-primary-subtle_bg ring-2 ring-color-border-primary-default ring-inset",
                    className
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {!hasContext ? (
                    /* Empty State */
                    <button
                        onClick={handleAddClick}
                        className={cn(
                            'w-full p-4 min-h-[160px] rounded-label-border-radius-default border border-color-border-neutral-default bg-color-surface-neutral-default',
                            'flex items-center justify-center',
                            'transition-all duration-200',
                            'hover:bg-color-surface-neutral-hover_default',
                            'cursor-pointer '
                        )}
                    >
                        {/* Centered Container with Icon and Text */}
                        <div className="flex flex-col items-center gap-2">
                            {/* Plus Icon */}
                            {/* New Icon Packages used here */}
                            <Add
                                color="icon-neutral-disabled"
                                className="w-9 h-9 p-0 text-color-icon-neutral-disabled" />

                            {/* Empty State Text */}
                            <p className="p-1 text-style-textblock-primary-subtext-regular text-color-text-neutral-placeholder text-center max-w-[320px]">
                                {emptyStateText}
                            </p>
                        </div>
                    </button>
                ) : (
                    /* Context Files - Responsive Grid Layout */
                    <div className="rounded-2xl border border-color-border-neutral-default bg-color-surface-neutral-default p-4 min-h-[176px]">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                            {/* Existing Context Files */}
                            {contextFiles.map((file) => (
                                <div
                                    key={file.id}
                                    className={cn(
                                        'transition-all duration-200 mr-2 mb-2',
                                        deletingTitle === file.title
                                            ? 'opacity-0 scale-95'
                                            : 'opacity-100 scale-100'
                                    )}
                                >
                                    <GlobalContext
                                        {...file}
                                        onEdit={() => handleEdit(file.title)}
                                        onDelete={() => handleDelete(file.title)}
                                    />
                                </div>
                            ))}

                            {/* Add Button */}
                            <Button
                                onClick={handleAddClick}
                                variant="neutral"
                                size="small"
                                prefixIcon="add"
                                className={cn(
                                    'p-2 w-fit rounded-button-border-radius-default border',
                                    'border-color-border-neutral-default bg-color-surface-neutral-default',
                                    'flex items-center justify-center',
                                    'hover:border-color-border-primary-default hover:bg-color-surface-neutral-hover_default'
                                )}
                                iconClassName="w-6 h-6 text-icon_button-color-neutral-icon"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className={cn(
                        "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
                        "transition-opacity duration-200",
                        isClosing ? "opacity-0" : "opacity-100"
                    )}
                >
                    <div className={cn(
                        "w-full max-w-[672px] mx-4",
                        "transition-all duration-200",
                        isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    )}>
                        <AddToContext
                            initialTitle={selectedContext?.title || ''}
                            initialContent={selectedContext?.content || ''}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onClose={handleCancel}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

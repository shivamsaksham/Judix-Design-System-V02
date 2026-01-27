'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/toast';

export interface UserQueryProps {
    query: string;
    onEdit?: (newQuery: string) => void;
    onCopy?: () => void;
    isEditable?: boolean;
    className?: string;
}

export const UserQuery = ({
    query,
    onEdit,
    onCopy,
    isEditable = true,
    className,
}: UserQueryProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedQuery, setEditedQuery] = useState(query);
    const textareaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setEditedQuery(query);
    }, [query]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            if (textareaRef.current.textContent !== editedQuery) {
                textareaRef.current.textContent = editedQuery;
            }
            textareaRef.current.focus();
            const range = document.createRange();
            const selection = window.getSelection();
            if (textareaRef.current.childNodes.length > 0) {
                const textNode = textareaRef.current.childNodes[0];
                const length = textNode.textContent?.length || 0;
                range.setStart(textNode, length);
                range.collapse(true);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    handleCancel();
                }
            };

            textareaRef.current.addEventListener('keydown', handleKeyDown);
            return () => {
                textareaRef.current?.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isEditing, editedQuery])

    const handleSave = () => {
        if (onEdit && editedQuery.trim()) {
            console.log('Saving edited query:', editedQuery);
            onEdit(editedQuery);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedQuery(query);
        setIsEditing(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(query);
            showToast.info('Text copied to clipboard');
            onCopy?.();
        } catch (err) {
            console.error('Failed to copy text:', err);
            showToast.alert('Failed to copy text');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div
            className={cn(
                'relative border-b',
                'border-l-color-border-primary-default border-b-color-border-neutral-default  ',
                'transition-all duration-200',
                className
            )}
            onMouseEnter={() => !isEditing && setIsHovered(true)}
            onMouseLeave={() => !isEditing && setIsHovered(false)}
        >
            {!isEditing ? (
                <>
                    {/* Default/Hover State */}
                    <div className="relative p-1 pb-5 ">
                        <p className="p-1 pr-20 break-words text-style-textblock-secondary-largetext-emphasis text-color-text-neutral-default">
                            {query}
                        </p>

                        {/* Action Icons - Visible on Hover - Positioned at bottom right */}
                        {isEditable && (
                            <div
                                className={cn(
                                    'absolute bottom-0 right-0 flex items-center gap-4 p-2 transition-opacity duration-200 mr-2',
                                    isHovered ? 'opacity-100' : 'opacity-0'
                                )}
                            >
                                <Button
                                    onClick={handleCopy}
                                    variant="neutral"
                                    size="small"
                                    className="border-none p-0 bg-transparent hover:bg-transparent"
                                    aria-label="Copy query"
                                >
                                    <Icon name="copy" className="text-color-icon-neutral-default w-5 h-5 relative" />
                                </Button>
                                <Button
                                    onClick={handleEdit}
                                    variant="neutral"
                                    size="small"
                                    className="border-none p-0 bg-transparent hover:bg-transparent"
                                    aria-label="Edit query"
                                >
                                    <Icon name="edit-a" className="text-color-icon-neutral-default w-5 h-5 relative" />
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {/* Edit State */}
                    <div className="relative p-1">
                        <div
                            ref={textareaRef}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) => {
                                const newText = e.currentTarget.textContent || '';
                                setEditedQuery(newText);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSave();
                                }
                            }}
                            className="w-full max-w-full text-style-textblock-secondary-largetext-emphasis text-color-text-neutral-default p-1 pr-20 outline-none whitespace-pre-wrap break-words overflow-wrap-anywhere bg-transparent"
                        />

                        {/* Action Buttons - Positioned at bottom right */}
                        <div className="relative mt-12  right-4 bottom-4 flex justify-end items-center gap-2">
                            <Button
                                variant="neutral"
                                size="extraSmall"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                size="extraSmall"
                                onClick={handleSave}
                                disabled={!editedQuery.trim()}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

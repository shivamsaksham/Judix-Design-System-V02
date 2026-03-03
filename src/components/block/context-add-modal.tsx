'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TextInput } from '@/components/ui/text-input';
import { Button } from '@/components/ui/button';

export interface AddToContextProps {
    initialTitle?: string;
    initialContent?: string;
    onSave?: (title: string, content: string) => void;
    onCancel?: () => void;
    onClose?: () => void;
    className?: string;
}

const MAX_CHARACTERS = 2500;
const MIN_CHARACTERS = 25;

export default function AddToContext({
    initialTitle = '',
    initialContent = '',
    onSave,
    onCancel,
    onClose,
    className,
}: AddToContextProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isFocused, setIsFocused] = useState(false);

    const characterCount = content.length;
    const isAtLimit = characterCount >= MAX_CHARACTERS;
    const isBelowMinimum = characterCount > 0 && characterCount < MIN_CHARACTERS;

    const handleClose = React.useCallback(() => {
        onClose?.();
    }, [onClose]);

    // ESC key listener
    React.useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [handleClose]);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        if (newContent.length <= MAX_CHARACTERS) {
            setContent(newContent);
        }
    };

    const handleSave = () => {
        onSave?.(title, content);
    };

    const handleCancel = () => {
        onCancel?.();
    };

    return (
        <div
            className={cn(
                'w-full max-w-[672px]',
                'bg-color-surface-neutral-subtle_bg',
                'border border-color-border-neutral-default',
                'rounded-lg',
                'p-6',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="p-1 textinput-font-label text-color-textinput-color-text-label">
                    Add to context
                </h2>
                <Button
                    onClick={handleClose}
                    variant="neutral"
                    size="small"
                    prefixIcon="cross"
                    className='border-none p-[3.33px] h-0'
                    iconClassName="w-4 h-4 relative"
                />
            </div>

            {/* Title Input */}
            <div className="mb-2">
                <TextInput
                    label="Title"
                    placeholder="Name your content"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    inputSize="medium"

                />
            </div>

            {/* Content Textarea */}
            <div className="mb-4">
                <label className="block textinput-font-label text-textinput-color-text-label mb-1">
                    Content
                </label>
                <div
                    className={cn(
                        'flex flex-col w-full rounded-textinput-border-radius-default textinput-border-weight-default border bg-color-textinput-bg transition-colors duration-200',
                        {
                            'border-textinput-color-stroke-focus': isFocused,
                            'border-textinput-color-stroke-default': !isFocused,
                        }
                    )}
                >
                    <textarea
                        className={cn(
                            'w-full min-h-[200px] pt-2 pb-3 px-3 border-none resize-none',
                            'rounded-textinput-border-radius-default',
                            'textinput-font-placeholder-medium text-textinput-color-text-active',
                            'placeholder:text-textinput-color-text-default',
                            'bg-color-surface-neutral-default',
                            'focus:outline-none focus:ring-0'
                        )}
                        placeholder="Type or paste your content"
                        value={content}
                        onChange={handleContentChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        maxLength={MAX_CHARACTERS}
                    />
                </div>
                {/* Character Counter */}
                <div className="mt-1 flex items-center justify-between">
                    <span
                        className={cn(
                            'textinput-font-helper',
                            {
                                'text-red-400': isAtLimit,
                                'text-textinput-color-text-helper-default': !isAtLimit,
                            }
                        )}
                    >
                        {characterCount}/{MAX_CHARACTERS}
                    </span>
                    {isBelowMinimum && (
                        <span className="textinput-font-helper text-red-400">
                            Minimum {MIN_CHARACTERS} characters required
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
                <Button
                    onClick={handleCancel}
                    variant="neutral"
                    size="small"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="primary"
                    size="small"
                    disabled={!title.trim() || !content.trim() || content.length < MIN_CHARACTERS}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}

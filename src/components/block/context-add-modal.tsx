'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from 'judix-icon';
import { TextInput } from '@/components/ui/text-input';
import { Button } from '@/components/ui/button';

export interface AddToContextProps {
    onSave?: (title: string, content: string) => void;
    onCancel?: () => void;
    onClose?: () => void;
    className?: string;
}

const MAX_CHARACTERS = 2500;

export default function AddToContext({
    onSave,
    onCancel,
    onClose,
    className,
}: AddToContextProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const characterCount = content.length;
    const isAtLimit = characterCount >= MAX_CHARACTERS;

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

    const handleClose = () => {
        onClose?.();
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
                    prefixIcon="Cross"
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
                            'w-full min-h-[200px] py-2 px-3 border-none resize-none',
                            'rounded-textinput-border-radius-default',
                            'textinput-font-placeholder-medium text-textinput-color-text-active',
                            'placeholder:text-textinput-color-text-default',
                            'placeholder:p-1 bg-color-surface-neutral-default',
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
                <div className="mt-1">
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
                >
                    Save
                </Button>
            </div>
        </div>
    );
}

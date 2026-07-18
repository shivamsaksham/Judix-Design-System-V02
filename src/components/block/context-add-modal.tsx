'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TextInput } from '@/components/ui/text-input';
import { Button } from '@/components/ui/button';
import { Icon } from '@judix/icon';

//To use Add to context modal wrap it in a dialog component one such demo is added below
/* 
           <Dialog open={isContextDialogOpen} onOpenChange={setIsContextDialogOpen}>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-[672px]">
                    <DialogTitle className="sr-only">Add to context</DialogTitle>
                    <AddToContext
                        onSave={(_title, _content) => {
                            setIsContextDialogOpen(false);
                        }}
                        onCancel={() => setIsContextDialogOpen(false)}
                        onClose={() => setIsContextDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

*/
export interface AddToContextProps {
    initialTitle?: string;
    initialContent?: string;
    onSave?: (title: string, content: string) => void | Promise<void>;
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
    const [isSaving, setIsSaving] = useState(false);

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

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
        try {
            await onSave?.(title, content);
        } catch {
            // Failure is already surfaced (toast/console) by the onSave handler —
            // just stop showing the loading state and leave the dialog open so
            // the user can retry without re-typing.
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        onCancel?.();
    };

    return (
        <div
            className={cn(
                'w-full sm:w-[600px] h-[480px] max-h-[85vh] overflow-y-auto',
                'bg-color-surface-neutral-subtle_bg',
                'border border-color-border-neutral-default',
                'rounded-lg',
                'p-4 flex flex-col gap-2',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="p-1 textinput-font-label text-color-textinput-color-text-label">
                    Add to context
                </h2>
                <button onClick={onClose} className="cursor-pointer text-color-textinput-color-text-label hover:opacity-80 transition-opacity">
                    <Icon name="cross" className="w-4 h-4" />
                </button>
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
                    size="extraSmall"
                    disabled={isSaving}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="primary"
                    size="extraSmall"
                    loading={isSaving}
                    disabled={!title.trim() || !content.trim() || content.length < MIN_CHARACTERS}
                >
                    Save
                </Button>
            </div>
        </div>
    );
}

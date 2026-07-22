'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/toast';

const TokenChip = ({ text, type }: { text: string; type: 'token' | 'mention' | 'command' }) => {
    if (type === 'token') {
        const match = text.match(/^\[(.*?):-(.*?)\]$/);
        const label = match ? `[${match[1]}: ${match[2]}]` : text;

        return (
            // Have to check if it is correct
            <span className="text-color-text-primary-default ">
                {label}
            </span>
        );
    }

    if (type === 'mention' || type === 'command') {
        return (
            <span className="text-color-text-primary-default">
                {text}
            </span>
        );
    }

    if (type === 'command') {
        return (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-sm bg-purple-50 text-purple-700 border border-purple-200 mx-0.5 align-baseline">
                {text}
            </span>
        );
    }

    return <span>{text}</span>;
}

// Plain-text counterpart of renderParsedQuery, for places that can only render
// a string (e.g. Dropdown/Option's `title`, typed as `string` for its own
// search-filter logic) — unwraps `[@Label]` mentions the same way, without JSX.
export const parseQueryToPlainText = (text: string): string =>
    text.replace(/\[(@[^\]]+)\]/g, '$1');

export const renderParsedQuery = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]|@\S+|\/[\w\s]+)/g);

    return parts.map((part, index) => {
        if (!part) return null;

        if (part.startsWith('[') && part.endsWith(']')) {
            const inner = part.slice(1, -1);
            // Mentions are bracket-wrapped at the source (e.g. `[@Case Title]`)
            // so multi-word labels survive this split intact — unwrap those
            // back to a plain `@Label` mention chip; anything else in brackets
            // is a static data token (`[Type:-Value]`).
            if (inner.startsWith('@')) {
                return <TokenChip key={index} text={inner} type="mention" />;
            }
            return <TokenChip key={index} text={part} type="token" />;
        }
        if (part.startsWith('@')) {
            return <TokenChip key={index} text={part} type="mention" />;
        }
        if (part.startsWith('/')) {
            return <TokenChip key={index} text={part} type="command" />;
        }

        return <span key={index}>{part}</span>;
    });
};

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
    const [isCopied, setIsCopied] = useState(false);
    const textareaRef = useRef<HTMLDivElement>(null);

    const handleCancel = React.useCallback(() => {
        setEditedQuery(query);
        setIsEditing(false);
    }, [query]);

    useEffect(() => {
        setEditedQuery(query);
    }, [query]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            const currentRef = textareaRef.current;
            if (currentRef.textContent !== editedQuery) {
                currentRef.textContent = editedQuery;
            }
            currentRef.focus();
            const range = document.createRange();
            const selection = window.getSelection();
            if (currentRef.childNodes.length > 0) {
                const textNode = currentRef.childNodes[0];
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

            currentRef.addEventListener('keydown', handleKeyDown);
            return () => {
                currentRef.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isEditing, handleCancel]);

    const handleSave = () => {
        if (onEdit && editedQuery.trim()) {
            console.log('Saving edited query:', editedQuery);
            onEdit(editedQuery);
        }
        setIsEditing(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(query);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            showToast.success('Copied to clipboard');
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
                        <p className="p-1 pr-20 wrap-break-words text-style-textblock-secondary-largetext-emphasis text-color-text-neutral-default">
                            {renderParsedQuery(query)}
                        </p>

                        {/* Action Icons - Visible on Hover - Positioned at bottom right */}
                        {isEditable && (
                            <div
                                className={cn(
                                    'absolute bottom-0 right-0 flex items-center gap-4 p-2 transition-opacity duration-200 mr-2',
                                    isHovered ? 'opacity-100' : 'opacity-100 pointer-events-auto lg:opacity-0 lg:pointer-events-none'
                                )}
                            >
                                <Button
                                    onClick={handleCopy}
                                    variant="neutral"
                                    size="small"
                                    className="border-none p-0 bg-transparent hover:bg-transparent"
                                    aria-label="Copy query"
                                >
                                    <Icon name={isCopied ? "copy-success" : "copy"} className="text-color-icon-neutral-default w-5 h-5 relative" />
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
                            className="w-full max-w-full text-style-textblock-secondary-largetext-emphasis text-color-text-neutral-default p-1 pr-20 outline-none whitespace-pre-wrap wrap-break-words overflow-wrap-anywhere bg-transparent"
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

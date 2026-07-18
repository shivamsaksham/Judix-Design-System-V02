'use client';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Toggle } from '@/components/ui/toggle';
import { Checkbox } from '@/components/ui/checkbox';
import { ContextWindowInfo } from './context-window-info';
import { Option } from '@/components/ui/option';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export interface ContextItem {
    id: string;
    title: string;
    description?: string;
    checked?: boolean;
}

export interface ContextArtifact {
    id: string;
    title: string;
}

export interface ContextWindowDropdownProps {
    items?: ContextItem[];
    onItemToggle?: (id: string, checked: boolean) => void;
    onModeChange?: (isAutoContext: boolean) => void;
    defaultAutoContext?: boolean;
    className?: string;
    isSessionContextChecked?: boolean;
    onSessionContextToggle?: (checked: boolean) => void;
    hideHeader?: boolean;
    isMobile?: boolean;
    contextArtifacts?: ContextArtifact[];
    onEditArtifact?: (id: string) => void;
    onRemoveArtifact?: (id: string) => void;
}

export default function ContextWindowDropdown({
    items: externalItems = [],
    onItemToggle,
    onModeChange,
    defaultAutoContext = true,
    className,
    isSessionContextChecked = false,
    onSessionContextToggle,
    // hideHeader = false,
    isMobile = false,
    contextArtifacts = [],
    onEditArtifact,
    onRemoveArtifact,
}: ContextWindowDropdownProps) {
    const [isAutoContext, setIsAutoContext] = useState(defaultAutoContext);
    const [showInfo, setShowInfo] = useState(false);
    const [items, setItems] = useState(externalItems);

    useEffect(() => {
        setItems(externalItems);
    }, [externalItems]);

    useEffect(() => {
        setIsAutoContext(defaultAutoContext);
    }, [defaultAutoContext]);

    const handleModeToggle = (checked: boolean) => {
        const newAutoState = !checked;
        setIsAutoContext(newAutoState);
        onModeChange?.(newAutoState);
    };

    const handleItemCheck = (id: string, checked: boolean) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, checked } : item
            )
        );
        onItemToggle?.(id, checked);
    };

    const handleSessionContextToggleInternal = (checked: boolean) => {
        onSessionContextToggle?.(checked);
    };

    return (
        <div
            className={cn(
                'w-full flex flex-col',
                isMobile ? 'h-full' : 'sm:w-100 max-h-[554px] p-2 bg-color-surface-neutral-default border border-color-border-neutral-default rounded-lg',
                className
            )}
        >
            <div className="p-4 shrink-0">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                        Context Window
                    </h3>
                    <Button
                        onClick={() => setShowInfo(true)}
                        variant="neutral"
                        size="small"
                        prefixIcon="info-circle"
                        className='border-none p-0 h-fit bg-color-surface-neutral-default'
                        iconClassName="w-5 h-5 relative text-color-icon-neutral-secondary"
                    />
                </div>

                <div className="flex items-center gap-1">
                    <span className={cn(
                        "p-1 text-style-body-default-regular",
                        isAutoContext ? "text-color-text-primary-default" : "text-color-text-neutral-placeholder"
                    )}>
                        Auto context
                    </span>
                    <Toggle
                        checked={!isAutoContext}
                        onCheckedChange={(checked) => handleModeToggle(checked)}
                        size="medium"
                    />
                    <span className={cn(
                        "p-1 text-style-body-default-regular",
                        !isAutoContext ? "text-color-text-primary-default" : "text-color-text-neutral-placeholder"
                    )}>
                        Self-managed
                    </span>
                </div>
            </div>

            <div className="mb-2 border-b border-color-border-neutral-default shrink-0" />
            <div className={cn("overflow-y-auto", !isMobile ? "max-h-[400px]" : "flex-1")}>
                <Option
                    title="Session context"
                    subtext="Text added by you using add to context feature acting as session context"
                    onClick={() => {
                        const checkedCount = items.filter(i => i.checked).length + (isSessionContextChecked ? 1 : 0);
                        const isLimitReached = checkedCount >= 10;
                        if (!isAutoContext && (!isLimitReached || isSessionContextChecked)) {
                            handleSessionContextToggleInternal(!isSessionContextChecked);
                        }
                    }}
                    disabled={isAutoContext || (!isSessionContextChecked && (items.filter(i => i.checked).length + (isSessionContextChecked ? 1 : 0)) >= 10)}
                    prefixSlot={
                        <span onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                                id="session-context"
                                checked={isSessionContextChecked}
                                onCheckedChange={() => {
                                    const checkedCount = items.filter(i => i.checked).length + (isSessionContextChecked ? 1 : 0);
                                    const isLimitReached = checkedCount >= 10;
                                    if (!isAutoContext && (!isLimitReached || isSessionContextChecked)) {
                                        handleSessionContextToggleInternal(!isSessionContextChecked);
                                    }
                                }}
                                disabled={isAutoContext || (!isSessionContextChecked && (items.filter(i => i.checked).length + (isSessionContextChecked ? 1 : 0)) >= 10)}
                            />
                        </span>
                    }
                />
                {contextArtifacts.map((artifact) => (
                    <Option
                        key={artifact.id}
                        title={artifact.title}
                        disabled={isAutoContext}
                        suffixSlot={
                            <span className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <IconButton
                                    icon="edit-a"
                                    variant="neutral"
                                    size="medium"
                                    boundary="none"
                                    className="bg-transparent"
                                    onClick={() => onEditArtifact?.(artifact.id)}
                                />
                                <IconButton
                                    icon="trash"
                                    variant="neutral"
                                    size="medium"
                                    boundary="none"
                                    className="bg-transparent text-color-icon-feedback-error-default"
                                    onClick={() => onRemoveArtifact?.(artifact.id)}
                                />
                            </span>
                        }
                    />
                ))}
                {items.map((item) => {
                    const checkedCount = items.filter(i => i.checked).length + (isSessionContextChecked ? 1 : 0);
                    const isLimitReached = checkedCount >= 10;
                    const isDisabled = isAutoContext || (isLimitReached && !item.checked);

                    return (
                        <Option
                            key={item.id}
                            title={item.title}
                            subtext={item.description}
                            onClick={() => !isDisabled && handleItemCheck(item.id, !item.checked)}
                            disabled={isDisabled}
                            prefixSlot={
                                <span onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        id={item.id}
                                        checked={item.checked}
                                        onCheckedChange={(checked) => handleItemCheck(item.id, checked as boolean)}
                                        disabled={isDisabled}
                                    />
                                </span>
                            }
                        />
                    );
                })}

            </div>



            <Dialog open={showInfo} onOpenChange={setShowInfo}>
                <DialogContent className="max-w-2xl p-0 border-none" showCloseButton={false}>
                    <DialogTitle className="sr-only">Context Window Information</DialogTitle>
                    <ContextWindowInfo onCloseClick={() => setShowInfo(false)} />
                </DialogContent>
            </Dialog>
        </div >
    );
}

'use client';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Toggle } from '@/components/ui/toggle';
import { Checkbox } from '@/components/ui/checkbox';
import { ContextWindowInfo } from './context-window-info';
import { Option } from '@/components/ui/option';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export interface ContextItem {
    id: string;
    title: string;
    description?: string;
    checked?: boolean;
}

export interface ContextWindowDropdownProps {
    items?: ContextItem[];
    onItemToggle?: (id: string, checked: boolean) => void;
    onModeChange?: (isAutoContext: boolean) => void;
    defaultAutoContext?: boolean;
    className?: string;
}

export default function ContextWindowDropdown({
    items: externalItems = [],
    onItemToggle,
    onModeChange,
    defaultAutoContext = true,
    className,
}: ContextWindowDropdownProps) {
    const [isAutoContext, setIsAutoContext] = useState(defaultAutoContext);
    const [showInfo, setShowInfo] = useState(false);
    const [sessionContextChecked, setSessionContextChecked] = useState(false);
    const [items, setItems] = useState(externalItems);

    // Update internal state when external items change
    useEffect(() => {
        setItems(externalItems);
    }, [externalItems]);

    const handleModeToggle = (checked: boolean) => {
        setIsAutoContext(checked);
        onModeChange?.(checked);
    };

    const handleItemCheck = (id: string, checked: boolean) => {
        //  internal state now changes
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, checked } : item
            )
        );
        onItemToggle?.(id, checked);
    };

    const handleSessionContextToggle = (checked: boolean) => {
        setSessionContextChecked(checked as boolean);
    };

    return (
        <div
            className={cn(
                'w-[400px] p-2',
                'bg-color-surface-neutral-default',
                'border border-color-border-neutral-default',
                'rounded-lg',
                className
            )}
        >
            {/* Header with Toggle */}
            <div className="p-4">
                {/* Title and Info Icon */}
                <div className="flex items-center justify-between mb-2">
                    <h3 className="p-1 text-style-body-large-default text-color-text-neutral-default">
                        Context Window
                    </h3>
                    <Button
                        onClick={() => setShowInfo(true)}
                        variant="neutral"
                        size="small"
                        prefixIcon="info-circle"
                        className='border-none p-1 h-fit bg-color-surface-neutral-default'
                        iconClassName="w-5 h-5 relative text-color-icon-neutral-secondary"
                    />
                </div>

                {/* Toggle Section */}
                <div className="flex items-center gap-3">
                    <span className={cn(
                        "p-1 text-style-body-default-regular",
                        !isAutoContext ? "text-color-text-primary-default" : "text-color-text-neutral-placeholder"
                    )}>
                        Auto context
                    </span>
                    <Toggle
                        checked={isAutoContext}
                        onCheckedChange={handleModeToggle}
                        size="medium"
                    />
                    <span className={cn(
                        "p-1 text-style-body-default-regular",
                        isAutoContext ? "text-color-text-primary-default" : "text-color-text-neutral-placeholder"
                    )}>
                        Self-managed
                    </span>
                </div>
            </div>

            <div className="mb-2 border-b border-color-border-neutral-default" />

            {/* Session Context Section - Scrollable */}
            <div className="max-h-[400px] overflow-y-auto">
                <Option
                    title="Session context"
                    subtext="Text added by you using add to context feature acting as session context"
                    onClick={() => handleSessionContextToggle(!sessionContextChecked)}
                    prefixSlot={
                        <Checkbox
                            id="session-context"
                            checked={sessionContextChecked}
                            onCheckedChange={handleSessionContextToggle}
                        />
                    }
                />

                {/* Context Items List */}

                {items.map((item) => (
                    <Option
                        key={item.id}
                        title={item.title}
                        subtext={item.description}
                        onClick={() => handleItemCheck(item.id, !item.checked)}
                        prefixSlot={
                            <Checkbox
                                id={item.id}
                                checked={item.checked}
                                onCheckedChange={(checked) => handleItemCheck(item.id, checked as boolean)}
                            />
                        }
                    />
                ))}

            </div>

            {/* Info Dialog */}
            <Dialog open={showInfo} onOpenChange={setShowInfo}>
                <DialogContent className="max-w-2xl p-0 border-none" showCloseButton={false}>
                    <ContextWindowInfo onCloseClick={() => setShowInfo(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

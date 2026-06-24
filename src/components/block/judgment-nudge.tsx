"use client"

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { Button } from '@/components/ui/button';

export interface JudgmentNudgeProps {
    className?: string;
    isConfirmed?: boolean;
    isExpanded?: boolean;
    onToggleExpand?: (expanded: boolean) => void;
    onConfirm?: () => void;
    onReject?: () => void;

    // Judgment Details
    title: string;
    citation?: string;
    court?: string;
    year?: string;
    bench?: string;
    description: string;
}

export const JudgmentNudge = ({
    className,
    isConfirmed: isConfirmedProp = false,
    isExpanded: isExpandedProp,
    onToggleExpand,
    onConfirm,
    onReject,
    title,
    citation,
    court,
    year,
    bench,
    description,
}: JudgmentNudgeProps) => {
    const [internalExpanded, setInternalExpanded] = useState(!isConfirmedProp);
    const [internalConfirmed, setInternalConfirmed] = useState(isConfirmedProp);

    React.useEffect(() => {
        setInternalConfirmed(isConfirmedProp);
        if (isConfirmedProp) {
            setInternalExpanded(false);
        }
    }, [isConfirmedProp]);

    const isExpanded = isExpandedProp !== undefined ? isExpandedProp : internalExpanded;
    const isConfirmed = internalConfirmed;

    const handleToggle = () => {
        const next = !isExpanded;
        setInternalExpanded(next);
        onToggleExpand?.(next);
    };

    const handleConfirm = () => {
        setInternalConfirmed(true);
        setInternalExpanded(false);
        onConfirm?.();
    };

    return (
        <div
            className={cn(
                'w-full rounded-radius-modal border border-color-border-neutral-default bg-color-surface-neutral-default overflow-hidden',
                className
            )}
        >
            {/* Header Row */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer select-none border-b border-color-border-neutral-default"
                onClick={handleToggle}
            >
                <div className="flex items-center">
                    <span className="p-1 text-style-label-default-regular text-color-text-neutral-secondary">
                        Judgment identified
                    </span>
                    <span className="p-1 text-style-label-default-regular text-color-text-neutral-secondary">-</span>
                    <span
                        className={`text-style-label-default-regular p-1 ${cn(
                            isConfirmed ? "text-color-text-feedback-success-default" : "text-color-text-feedback-warning-default"
                        )}`}
                    >
                        {isConfirmed ? "confirmed" : "confirm before proceeding"}
                    </span>
                </div>
                <Icon
                    name={isExpanded ? 'arrow-up-a' : 'arrow-down-c'}
                    className="w-4 h-4 text-color-text-neutral-secondary"
                />
            </div>

            {/* Expanded Body */}
            {isExpanded && (
                <div className="p-4">
                    {/* Inner Judgment Card */}
                    <div className="rounded-radius-interactiveelement border border-color-border-neutral-default p-4 flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                {/* Title */}
                                <h4 className="p-1 text-style-body-title-emphasis text-color-text-primary-default">
                                    {title}
                                </h4>

                                {/* Metadata Tags */}
                                {citation && (
                                    <span className="p-1 text-style-label-default-regular text-color-text-neutral-default">
                                        {citation}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-style-label-default-regular text-color-text-neutral-default">
                                {court && <span className="p-1">{court}</span>}
                                {year && <span className="p-1">{year}</span>}
                                {bench && <span className="p-1">{bench}</span>}
                            </div>
                        </div>
                        {/* Divider */}
                        <div className="w-full h-px bg-color-border-neutral-default" />

                        {/* Description */}
                        <p className="p-1 text-style-textblock-secondary-subtext-regular text-color-text-neutral-emphasis">
                            {description}
                        </p>
                    </div>

                    {/* Action Buttons (Only show if NOT confirmed) */}
                    {!isConfirmed && (
                        <div className="flex items-center gap-2 mt-2">
                            <Button size="extraSmall" variant="primary" onClick={handleConfirm}>
                                Yes, this is the judgment
                            </Button>
                            <Button size="extraSmall" variant="neutral" onClick={onReject}>
                                Not this
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

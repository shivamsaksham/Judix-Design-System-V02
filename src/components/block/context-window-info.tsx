'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from 'judix-icon';
import { Button } from '@/components/ui/button';

export interface ContextWindowInfoProps {
    onCloseClick?: () => void;
    className?: string;
}

export const ContextWindowInfo = ({ onCloseClick, className }: ContextWindowInfoProps) => {
    const sections = [
        {
            title: 'Auto Context',
            content: (
                <>
                    Judix automatically includes the most recent 10 items in your session.
                    No manual selection required.
                </>
            ),
        },
        {
            title: 'Self-Managed',
            content: (
                <>
                    You choose which items to include — up to 10 selections.
                    <br />
                    The AI will only use the items you tick.
                </>
            ),
        },
        {
            title: 'Best Use',
            content: (
                <>
                    Keep only the items relevant to your current query for accurate responses.
                    <br />
                    Update or clear the selection when switching matters.
                </>
            ),
        },
    ];

    return (
        <div
            className={cn(
                'rounded-lg border border-color-border-neutral-default',
                'bg-color-surface-neutral-default',
                'p-6',
                className
            )}
        >
            {/* Title with Icon */}
            <div className="flex items-center justify-between gap-2 mb-6">
                <h2 className="w-fit p-1 text-style-body-title-regular text-color-text-neutral-default">
                    Context Window
                </h2>
                {onCloseClick && (
                    <Button
                        onClick={onCloseClick}
                        variant="neutral"
                        size="small"
                        prefixIcon="Cross"
                        className="border-none p-1 h-fit bg-color-surface-neutral-default"
                        iconClassName="w-5 h-5 my-[3px] p-[4.17px] relative text-color-icon-neutral-tertiary"
                        aria-label="Close"
                    />
                )}
            </div>

            {/* Description */}
            <p className="mb-4 p-1 text-style-textblock-primary-subtext-regular text-color-text-neutral-secondary">
                The context window shows the documents, judgments, and summaries
                the AI will use while answering your queries.
            </p>

            {/* Information Sections */}
            {sections.map((section, index, array) => (
                <div key={section.title} className={index < array.length - 1 ? 'mb-4' : ''}>
                    <h3 className="w-fit p-1 text-style-label-default-regular text-color-text-neutral-tertiary">
                        {section.title}
                    </h3>
                    <p className="p-1 text-style-textblock-primary-subtext-regular text-color-text-neutral-secondary">
                        {section.content}
                    </p>
                </div>
            ))}
        </div>
    );
};

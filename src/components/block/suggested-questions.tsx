import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';

export interface SuggestedQuestionsProps {
    title?: string;
    questions: string[];
    onQuestionClick?: (question: string) => void;
    className?: string;
}

export const SuggestedQuestions = ({
    title = "Suggested questions",
    questions,
    onQuestionClick,
    className
}: SuggestedQuestionsProps) => {
    return (
        <div className={cn("w-full flex flex-col gap-4", className)}>
            {title && (
                <div className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary text-left w-full">
                    {title}
                </div>
            )}
            <div className="w-full flex flex-col bg-color-surface-neutral-default border-b border-color-border-neutral-default overflow-hidden divide-y divide-color-border-neutral-default">
                {questions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => onQuestionClick?.(question)}
                        className="flex items-center justify-between px-2 py-3 gap-6 w-full text-left hover:bg-color-surface-neutral-hover transition-colors focus:outline-none"
                    >
                        <span className="p-1 text-style-textblock-primary-subtext-regular text-color-text-neutral-secondary flex-1">
                            {question}
                        </span>
                        <Icon name="arrow-right-d" className="w-5 h-5 text-color-icon-neutral-default shrink-0" />
                    </button>
                ))}
            </div>
        </div>
    );
};

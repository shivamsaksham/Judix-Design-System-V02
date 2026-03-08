'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { Label } from '@/components/ui/label';
import { ProNudge } from './pro-nudge';

//  Types 

export type AiThinkingVariant = 'collapsed' | 'expanded' | 'completed';

export interface ThinkingStep {
    /* Title / label of the step */
    title: string;
    /* Optional supporting detail shown when expanded */
    description?: string;
    /* Duration string, e.g. "2.3 sec" */
    duration?: string;
    /* Whether this individual step is done */
    completed?: boolean;
}

export interface AiThinkingProps {
    /* Current ui variant */
    variant?: AiThinkingVariant;
    /* Primary label shown in the header, e.g. "Judix is thinking..." */
    label?: string;
    /* Badge text, e.g. "4 of 6 steps" */
    badge?: string;
    /* Short description shown in collapsed header */
    description?: string;
    /* List of thinking steps rendered in the expanded body */
    steps?: ThinkingStep[];
    /* Allow parent to control open/close */
    isExpanded?: boolean;
    /* Show the ProNudge prompt below the steps when expanded */
    showProNudge?: boolean;
    /* Callback when user clicks Yes on the ProNudge prompt */
    onProNudgeYesClick?: () => void;
    /* Callback when user clicks No on the ProNudge prompt */
    onProNudgeNoClick?: () => void;
    /* Callback when expand/collapse is toggled */
    onToggle?: (expanded: boolean) => void;
    className?: string;
}

//  Sub-components 

const SpinnerCircle = () => (
    <div
        className="w-4 h-4 rounded-full border-[1.5px] border-color-border-primary-default border-t-color-text-primary-default animate-spin shrink-0 block"
        style={{
            animationDuration: '0.8s',
            animationTimingFunction: 'linear'
        }}
    />
);

const PulseSpinnerCircle = () => (
    <div className="relative flex items-center justify-center w-4 h-4 rounded-full bg-color-surface-primary-subtle_bg border border-color-border-primary-default ai-thinking-pulse">
        <div
            className="w-[8px] h-[8px] rounded-full border-[1.5px] border-color-border-primary-default border-t-color-text-primary-default animate-spin shrink-0 block"
            style={{
                animationDuration: '0.8s',
                animationTimingFunction: 'linear'
            }}
        />
    </div>
);



const CompletedCircle = () => (
    <svg
        className="w-4 h-4 text-color-text-neutral-tertiary"
        viewBox="0 0 16 16"
        fill="none"
    >
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

const StepCircle = ({ completed }: { completed?: boolean }) => (
    <div className="my-[5px] shrink-0">
        {completed
            ? <CompletedCircle />
            : <PulseSpinnerCircle />}
    </div>
);

// Main component

export const AiThinking = ({
    variant = 'collapsed',
    label = 'Judix is thinking...',
    badge,
    description,
    steps = [],
    isExpanded: isExpandedProp,
    showProNudge = false,
    onProNudgeYesClick,
    onProNudgeNoClick,
    onToggle,
    className,
}: AiThinkingProps) => {
    const [internalExpanded, setInternalExpanded] = useState(variant === 'expanded');

    // Support both controlled and uncontrolled expansion
    const isExpanded = isExpandedProp !== undefined ? isExpandedProp : internalExpanded;

    const handleToggle = () => {
        const next = !isExpanded;
        setInternalExpanded(next);
        onToggle?.(next);
    };

    const isCompleted = variant === 'completed';

    return (
        <div
            className={cn(
                'w-full relative rounded-lg border border-color-border-neutral-default bg-color-surface-neutral-default overflow-hidden',
                !isExpanded && !isCompleted && 'ai-thinking-shimmer',
                className
            )}
        >
            {/*  Header row  */}
            <div
                className={cn(
                    'flex items-center gap-3 px-4 py-2 relative z-10',
                    !isCompleted && 'cursor-pointer select-none'
                )}
                onClick={!isCompleted ? handleToggle : undefined}
            >
                {/* Leading icon  spinner or plain circle */}
                <div className={cn("shrink-0", !isCompleted && "text-color-text-primary-default")}>
                    {isCompleted ? <CompletedCircle /> : <SpinnerCircle />}
                </div>

                {/* Label */}
                <span
                    className='p-1 text-color-text-primary-default text-style-body-default-regular  '
                >
                    {isCompleted ? 'Research complete.' : label}
                </span>

                {/* Badge / Label  shown when not completed */}
                {!isCompleted && badge && (
                    <Label colorScheme="primary" size="small" className="shrink-0">
                        {badge}
                    </Label>
                )}

                {/* Description  only in collapsed state */}
                {!isCompleted && !isExpanded && description && (
                    <span className="p-1 flex-1 min-w-0 mr-[36px] truncate text-style-label-default-regular text-color-text-neutral-secondary">
                        {description}
                    </span>
                )}

                {/* Spacer */}
                {(!description || isExpanded || isCompleted) && (
                    <div className="flex-1" />
                )}

                {/* Expand / collapse toggle */}
                {!isCompleted ? (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleToggle(); }}
                        className="flex items-center gap-1  text-color-text-neutral-tertiary hover:text-color-text-neutral-default transition-colors"
                    >
                        <span className='p-1 text-style-label-default-regular'>
                            {isExpanded ? 'collapse' : 'expand'}
                        </span>
                        <Icon
                            name={isExpanded ? 'arrow-up-a' : 'arrow-down-c'}
                            className="w-4 h-4"
                        />
                    </button>
                ) : (
                    <button
                        type="button"
                        className="py-[2px] flex items-center gap-1 text-style-caption-regular text-color-text-neutral-tertiary hover:text-color-text-neutral-default transition-colors"
                    >
                        Show reasoning steps
                        <Icon name="arrow-down-c" className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/*  Expanded step list  */}
            {!isCompleted && isExpanded && steps.length > 0 && (
                <div className="border-t border-color-border-neutral-default px-4 py-2 relative z-10 bg-color-surface-neutral-default">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 ai-thinking-step"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            <StepCircle completed={step.completed} />

                            <div className="flex-1 min-w-0 mb-4">
                                <p className="p-1 text-style-textblock-secondary-subtext-emphasis text-color-text-neutral-default">
                                    {step.title}
                                </p>
                                {step.description && (
                                    <p className="px-[5px] text-style-textblock-secondary-subtext-regular text-color-text-neutral-secondary">
                                        {step.description}
                                    </p>
                                )}
                            </div>

                            {step.duration && (
                                <span className="p-1 shrink-0 text-style-label-default-regular text-color-text-neutral-tertiary tabular-nums mt-[1px]">
                                    {step.duration}
                                </span>
                            )}
                        </div>
                    ))}
                    {showProNudge && (
                        <div className="mt-2 ai-thinking-step" style={{ animationDelay: `${steps.length * 0.15 + 0.15}s` }}>
                            <ProNudge
                                onYesClick={onProNudgeYesClick}
                                onNoClick={onProNudgeNoClick}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

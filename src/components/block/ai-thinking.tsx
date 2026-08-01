'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { Label } from '@/components/ui/label';
import { ProNudge } from './pro-nudge';
import { JudgmentNudgeTileProps } from './judgment-nudge-tile';
import { JudgmentNudge } from './judgment-nudge';
import { JudgmentSelectionList } from './judgment-selection-list';

//  Types 

export type AiThinkingVariant = 'collapsed' | 'expanded' | 'completed' | 'stopped' | 'clarification';

export interface ThinkingStep {
    title: string;
    description?: string;
    duration?: string;
    completed?: boolean;
    judgments?: JudgmentNudgeTileProps[];
    /** Client-side epoch ms when this step started — drives the live-ticking timer while incomplete. */
    startedAt?: number;
}

export interface AiThinkingProps {
    variant?: AiThinkingVariant;
    label?: string;
    badge?: string;
    /** When set, renders "{current} of {totalSteps} steps" in the badge slot instead of the raw badge string. */
    totalSteps?: number;
    description?: string;
    steps?: ThinkingStep[];
    sourcesCount?: number;
    timeTaken?: string;
    isExpanded?: boolean;
    showProNudge?: boolean;
    onProNudgeYesClick?: () => void;
    onProNudgeNoClick?: () => void;
    onJudgmentConfirm?: (data?: JudgmentNudgeTileProps) => void;
    onJudgmentReject?: () => void;
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
        className="w-4 h-4 text-color-icon-primary-default"
        viewBox="0 0 16 16"
        fill="none"
    >
        <circle cx="8" cy="8" r="6" fill="currentColor" />
        <path d="M5.5 8.5L7 10L10.5 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ClarificationCircle = () => (
    <svg
        className="w-4 h-4 text-color-icon-feedback-warning-default"
        viewBox="0 0 16 16"
        fill="none"
    >
        <circle cx="8" cy="8" r="6" fill="currentColor" />
        <rect x="7.25" y="4.5" width="1.5" height="4.5" rx="0.75" fill="white" />
        <rect x="7.25" y="10" width="1.5" height="1.5" rx="0.75" fill="white" />
    </svg>
);

const PendingCircle = () => (
    <div className="flex items-center justify-center w-4 h-4 rounded-full border-[1.5px] border-color-border-neutral-default shrink-0 mb-px" />
);

const StepCircle = ({ completed, ongoing }: { completed?: boolean; ongoing?: boolean }) => (
    <div className="my-[5px] shrink-0">
        {completed
            ? <CompletedCircle />
            : ongoing
                ? <PulseSpinnerCircle />
                : <PendingCircle />}
    </div>
);

// Ticks once a second while a step is in progress, computed from the
// client-side timestamp the step started at (backend only reports duration
// once a phase finishes, so there's nothing to tick from until then).
const LiveDuration = ({ startedAt }: { startedAt?: number }) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(() =>
        startedAt ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000)) : 0
    );

    React.useEffect(() => {
        if (!startedAt) return;
        const tick = () => setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [startedAt]);

    return (
        <span className="p-1 shrink-0 text-style-label-default-regular text-color-text-neutral-tertiary tabular-nums mt-px">
            {elapsedSeconds}s
        </span>
    );
};

// Main component

export const AiThinking = ({
    variant = 'collapsed',
    label = 'Judix is thinking...',
    badge,
    totalSteps,
    description,
    steps = [],
    sourcesCount,
    timeTaken,
    isExpanded: isExpandedProp,
    showProNudge = false,
    onProNudgeYesClick,
    onProNudgeNoClick,
    onJudgmentConfirm,
    onJudgmentReject,
    onToggle,
    className,
}: AiThinkingProps) => {
    const [internalExpanded, setInternalExpanded] = useState(variant === 'expanded');

    // Support both controlled and uncontrolled expansion
    const isExpanded = isExpandedProp !== undefined ? isExpandedProp : internalExpanded;

    const isStopped = variant === 'stopped';
    const isClarification = variant === 'clarification';
    const isCompleted = variant === 'completed' || isStopped || isClarification;

    const firstIncompleteIndex = steps.findIndex(s => !s.completed);
    const hasOngoingStep = !isCompleted && firstIncompleteIndex !== -1;
    const stepCountBadge = totalSteps
        ? `${Math.min(steps.filter(s => s.completed).length + (hasOngoingStep ? 1 : 0), totalSteps)} of ${totalSteps} steps`
        : badge;
    // What the collapsed header's trailing text should read — the step
    // currently running, or the most recent one if nothing's in flight yet.
    const currentStepLabel = (hasOngoingStep ? steps[firstIncompleteIndex]?.title : steps[steps.length - 1]?.title);
    const collapsedStepText = description || currentStepLabel;

    const reachedNudgeCount =
        (showProNudge && steps.every(s => s.completed) ? 1 : 0) +
        steps.filter((s, i) => s.judgments && s.judgments.length > 0 && steps.slice(0, i).every(prev => prev.completed)).length;

    const prevReachedNudgeRef = React.useRef(reachedNudgeCount);

    // Auto-expand when a new nudge is reached
    React.useEffect(() => {
        if (reachedNudgeCount > prevReachedNudgeRef.current) {
            if (!isCompleted) {
                setInternalExpanded(true);
            }
            prevReachedNudgeRef.current = reachedNudgeCount;
        }
    }, [reachedNudgeCount, isCompleted]);

    // Handle prop-driven variant changes
    const prevVariantRef = React.useRef(variant);
    React.useEffect(() => {
        if (variant !== prevVariantRef.current) {
            if (variant === 'completed' || variant === 'stopped' || variant === 'clarification') {
                setInternalExpanded(false);
            } else if (variant === 'expanded') {
                setInternalExpanded(true);
            } else if (variant === 'collapsed') {
                setInternalExpanded(false);
            }
            prevVariantRef.current = variant;
        }
    }, [variant]);

    const handleToggle = () => {
        const next = !isExpanded;
        setInternalExpanded(next);
        onToggle?.(next);
    };

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
                    {isClarification ? <ClarificationCircle /> : isCompleted ? <CompletedCircle /> : <SpinnerCircle />}
                </div>

                {/* Label */}
                <>
                    {isCompleted ? (
                        <span className='flex flex-row items-center gap-2 text-style-label-default-regular'>
                            <p className={cn(
                                'p-1 text-style-body-default-regular',
                                isClarification ? 'text-color-text-feedback-warning-default' : 'text-color-text-primary-default'
                            )}>
                                {isClarification ? 'Clarification needed.' : isStopped ? 'Research stopped.' : 'Research complete.'}
                            </p>
                            {!isStopped && !isClarification && sourcesCount !== undefined && (
                                <p className='hidden md:block p-1 text-color-text-neutral-tertiary italic'>Found {sourcesCount} sources</p>
                            )}
                            {!isStopped && !isClarification && timeTaken && (
                                <p className='hidden md:block p-1 text-color-text-neutral-tertiary italic'>Took {timeTaken}</p>
                            )}
                        </span>
                    ) : (
                        <span className='p-1 text-color-text-primary-default text-style-body-default-regular'>
                            {label}
                        </span>
                    )}
                </>

                {/* Badge / Label  shown when not completed */}
                {!isCompleted && stepCountBadge && (
                    <Label colorScheme="primary" size="small" className="shrink-0">
                        {stepCountBadge}
                    </Label>
                )}

                {/* Description  only in collapsed state  falls back to the
                    currently-running step's title when no explicit description
                    was passed. Hidden below the md breakpoint (<768px) — the
                    header row is too cramped there once the step badge and
                    expand control are already in place. */}
                {!isCompleted && !isExpanded && collapsedStepText && (
                    <span className="hidden md:block p-1 flex-1 min-w-0 mr-[36px] truncate text-style-label-default-regular text-color-text-neutral-secondary">
                        {collapsedStepText}
                    </span>
                )}

                {/* Spacer */}
                {(!collapsedStepText || isExpanded || isCompleted) && (
                    <div className="flex-1" />
                )}
                {/* Below md, the description span above is hidden but still
                    "present" (collapsedStepText is truthy), so the spacer
                    above stays suppressed too — this fills that same
                    flex-1 role only below md, keeping the expand control
                    pinned to the right edge instead of hugging the badge. */}
                {!isCompleted && !isExpanded && collapsedStepText && (
                    <div className="flex-1 md:hidden" />
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
                ) : steps.length > 0 ? (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleToggle(); }}
                        className="py-[2px] flex items-center gap-1 text-style-label-default-regular text-color-text-neutral-tertiary hover:text-color-text-neutral-default transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                    >
                        {/* Full label from md up; below md there's rarely
                            enough width left next to "Research complete."
                            for the full phrase, so it shortens instead of
                            overflowing past the container's overflow-hidden
                            and getting visually clipped mid-word. */}
                        <span className="hidden md:inline">{isExpanded ? 'Hide reasoning steps' : 'Show reasoning steps'}</span>
                        <span className="md:hidden">{isExpanded ? 'Hide' : 'Show'}</span>
                        <Icon name={isExpanded ? 'arrow-up-a' : 'arrow-down-c'} className="w-4 h-4 shrink-0" />
                    </button>
                ) : null}
            </div>

            {/*  Expanded step list  */}
            {isExpanded && steps.length > 0 && (
                <div className="border-t border-color-border-neutral-default px-4 py-2 relative z-10 bg-color-surface-neutral-default">
                    {steps.map((step, index) => {
                        const firstIncompleteIndex = steps.findIndex(s => !s.completed);
                        const isStepCompleted = isCompleted || step.completed || (firstIncompleteIndex !== -1 && index < firstIncompleteIndex);
                        const isOngoing = !isStepCompleted && firstIncompleteIndex === index;

                        return (
                            <React.Fragment key={index}>
                                <div
                                    className="flex items-start gap-3 ai-thinking-step"
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    <StepCircle
                                        completed={isStepCompleted}
                                        ongoing={isOngoing}
                                    />

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

                                    {isOngoing ? (
                                        <LiveDuration startedAt={step.startedAt} />
                                    ) : step.duration ? (
                                        <span className="p-1 shrink-0 text-style-label-default-regular text-color-text-neutral-tertiary tabular-nums mt-px">
                                            {step.duration}
                                        </span>
                                    ) : null}
                                </div>
                                {step.judgments && step.judgments.length > 0 && (
                                    <div className="flex flex-col gap-2 pl-[32px] mb-4 mt-2 ai-thinking-step" style={{ animationDelay: `${index * 0.15 + 0.05}s` }}>
                                        {step.judgments.length === 1 ? (
                                            <JudgmentNudge
                                                title={step.judgments[0].title}
                                                citation={step.judgments[0].citation}
                                                court={step.judgments[0].court}
                                                year={step.judgments[0].year}
                                                bench={step.judgments[0].bench}
                                                description={step.judgments[0].description}
                                                isConfirmed={isCompleted}
                                                onConfirm={() => onJudgmentConfirm?.(step.judgments![0])}
                                                onReject={() => onJudgmentReject?.()}
                                                entityLabel={step.judgments[0].entityType === 'act' ? 'act' : 'judgment'}
                                            />
                                        ) : (
                                            <JudgmentSelectionList
                                                judgments={step.judgments}
                                                isConfirmed={isCompleted}
                                                onConfirm={(data) => onJudgmentConfirm?.(data)}
                                                onReject={() => onJudgmentReject?.()}
                                                disableManualSearchFallback
                                                entityLabel={step.judgments[0]?.entityType === 'act' ? 'acts' : 'judgments'}
                                            />
                                        )}
                                    </div>
                                )}
                            </React.Fragment>
                        )
                    })}
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

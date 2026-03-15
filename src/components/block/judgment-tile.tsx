import React from 'react';
import { cn } from '@/lib/utils';

export interface JudgmentTileProps {
    className?: string;
    index: string | number;
    title: string;
    citation: string;
    court: string;
    date: string;
    bench: string;
    summary: string;
    matchScore: number;
    selectionState?: 'default' | 'selected' | 'unselected';
    onClick?: () => void;
}

export const JudgmentTile = ({
    className,
    index,
    title,
    citation,
    court,
    date,
    bench,
    summary,
    matchScore,
    selectionState = 'default',
    onClick,
}: JudgmentTileProps) => {

    // Determine dynamic classes based on selection state
    const isSelected = selectionState === 'selected';
    const isUnselected = selectionState === 'unselected';

    return (
        <div
            onClick={onClick}
            className={cn(
                'flex flex-col md:flex-row w-full bg-color-surface-neutral-default overflow-hidden',
                isUnselected ? 'opacity-50 transition-opacity' : 'opacity-100 transition-opacity',
                onClick ? 'cursor-pointer' : '',
                onClick && !isUnselected ? 'hover:bg-color-surface-neutral-hover_default' : '',
                className
            )}
            style={isSelected ? { borderLeftWidth: '8px', borderLeftColor: 'var(--color-color-border-primary-strong)' } : {}}
        >
            <div className="flex w-full p-4 gap-4">
                {/* Index Number Box */}
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center rounded-interactiveelement border border-color-border-neutral-default bg-color-surface-neutral-default text-style-body-title-emphasis text-color-text-neutral-default">
                        {String(index).padStart(2, '0')}
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-grow min-w-0">
                    <div className='flex flex-col gap-1'>
                        <div className="flex flex-col gap-1">
                            {/* Title */}
                            <h4 className="p-1 text-style-body-default-regular text-color-text-primary-default truncate whitespace-normal line-clamp-2">
                                {title}
                            </h4>

                            {/* Metadata Row 1 */}
                            <div className="flex flex-wrap items-center gap-4 text-style-label-default-regular text-color-text-neutral-default">
                                <span className='p-1 text-style-label-default-regular' >{citation}</span>
                                <span className='p-1 text-style-label-default-regular' >{court}</span>
                                <span className='p-1 text-style-label-default-regular' >{date}</span>
                                <span className='p-1 text-style-label-default-regular' >{bench}</span>
                            </div>
                        </div>

                        {/* Summary */}
                        <p className="p-1 text-style-textblock-secondary-subtext-regular text-color-text-neutral-emphasis">
                            {summary}
                        </p>
                    </div>

                    {/* Match Score Bar */}
                    <div className="flex items-center gap-2 py-[3px]">
                        <span className="text-style-label-default-regular text-color-text-neutral-tertiary">
                            Match
                        </span>

                        <div className="flex-grow h-0.5 rounded-full bg-color-surface-neutral-hover_mild overflow-hidden">
                            <div
                                className="h-full bg-color-border-primary-default rounded-full"
                                style={{ width: `${Math.min(100, Math.max(0, matchScore))}%` }}
                            />
                        </div>

                        <span className="p-1 text-style-label-default-regular text-color-text-primary-default min-w-[32px] text-right">
                            {matchScore}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

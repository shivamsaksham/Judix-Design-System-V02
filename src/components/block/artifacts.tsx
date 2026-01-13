'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { DocumentTextB } from '@judix/icon';
import { Label } from '@/components/ui/label';

export interface ArtifactsProps {
    title: string;
    subtitle: string;
    isResult?: boolean;
    onClick?: () => void;
    className?: string;
}

export const Artifacts = ({
    title,
    subtitle,
    isResult = false,
    onClick,
    className,
}: ArtifactsProps) => {

    return (
        <div className={cn('inline-block cursor-pointer', className)}>
            {isResult && (
                <div className="mb-1">
                    <Label colorScheme="neutral" size="medium" className='bg-label-color-neutral-hover'>
                        Results
                    </Label>
                </div>
            )}
            <div
                onClick={onClick}
                className={cn(
                    'inline-flex rounded-lg border border-color-border-neutral-default',
                    'bg-color-surface-neutral-default',
                    'px-4 py-2 min-h-[68px]',
                    'transition-all duration-200',
                    onClick && 'cursor-pointer',
                    isResult && 'mr-2'
                )}
            >
                <div className="flex items-start gap-4">
                    {/* Text Content */}
                    <div className="flex-1 p-1">
                        <h3 className="text-style-label-title-emphasis text-color-text-neutral-emphasis mb-1 p-1">
                            {title}
                        </h3>
                        <p className="text-style-label-default-regular text-color-text-neutral-tertiary p-1 no-wrap">
                            {subtitle}
                        </p>
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 m-auto">
                        <DocumentTextB
                            color='color-icon-neutral-tertiary'
                            className="w-8 h-8 text-color-icon-neutral-tertiary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

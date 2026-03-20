'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { RadioButton } from '../ui/radio-buttons';
import { Label } from '../ui/label';

export interface PaymentFrequencyCardProps {
    type: 'monthly' | 'yearly';
    price: string;
    selected?: boolean;
    discountLabel?: string;
    onClick?: () => void;
    className?: string;
}

export const PaymentFrequencyCard = ({
    type,
    price,
    selected = false,
    discountLabel,
    onClick,
    className,
}: PaymentFrequencyCardProps) => {
    const isYearly = type === 'yearly';

    return (
        <div
            onClick={onClick}
            className={cn(
                'relative flex flex-col w-full p-4 gap-5 rounded-radius-interactiveelement border transition-all duration-200 cursor-pointer min-w-[240px]',
                selected
                    ? 'border-color-border-primary-strong bg-color-surface-primary-subtle_bg'
                    : 'border-color-border-neutral-default bg-color-surface-neutral-default hover:bg-color-surface-neutral-hover_default',
                className
            )}
        >
            {/* Top Row: Radio and Badge */}
            <div className="flex items-start justify-between w-full">
                <RadioButton
                    checked={selected}
                    onChange={onClick}
                    size="medium"
                    color="primary"
                    className="pointer-events-none"
                />
                {isYearly && discountLabel && (
                    <Label
                        colorScheme={selected ? 'primary' : 'neutral'}
                        size="small"
                    >
                        {discountLabel}
                    </Label>
                )}
            </div>

            {/* Middle: Title */}
            <div className="flex flex-col">
                <h3 className="p-1 text-style-body-title-regular capitalize text-color-text-neutral-default">
                   {type}
                </h3>
                
                {/* Bottom: Price */}
                <p className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                    {price}
                </p>
            </div>
        </div>
    );
};

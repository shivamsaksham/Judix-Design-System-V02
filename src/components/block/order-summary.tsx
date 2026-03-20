'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { TextInput } from '../ui/text-input';
import { Icon } from '@judix/icon';
import { PaymentFrequencyCard } from './payment-frequency-card';

export interface OrderSummaryData {
    planName: string;
    credits: number | string;
    currentFrequency: 'monthly' | 'yearly';
    subtotal: number;
    gst: number;
    promoCode?: string;
    promoDiscount?: number;
    isPromoApplied?: boolean;
    autoRenewDate: string;
    yearlyPrice: string;
}

export interface OrderSummaryProps {
    data: OrderSummaryData;
    onChangePlan?: () => void;
    onApplyPromo?: (code: string) => void;
    onCheckout?: () => void;
    onFrequencyChange?: (frequency: 'monthly' | 'yearly') => void;
    className?: string;
}

export const OrderSummary = ({
    data,
    onChangePlan,
    onApplyPromo,
    onCheckout,
    onFrequencyChange,
    className,
}: OrderSummaryProps) => {
    const [promoInput, setPromoInput] = useState('');
    const [selectedFrequency, setSelectedFrequency] = useState<'monthly' | 'yearly'>(data.currentFrequency);

    const handleFrequencySelect = (freq: 'monthly' | 'yearly') => {
        setSelectedFrequency(freq);
        onFrequencyChange?.(freq);
    };

    const handleApplyPromo = () => {
        if (promoInput.trim()) {
            onApplyPromo?.(promoInput);
        }
    };

    const total = data.subtotal + data.gst - (data.promoDiscount || 0);

    return (
        <div className={cn('flex flex-col gap-6 w-full p-4 bg-color-surface-neutral-subtle_bg rounded-radius-interactiveelement', className)}>
            {/* Plan Info Section */}
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                    <h2 className="p-1 text-style-textblock-secondary-largetext-emphasis text-color-text-neutral-default">
                        {data.planName}
                    </h2>
                    <p className="p-1 text-style-label-default-regular text-color-neutral-tertiary">
                        {data.credits} credits
                    </p>
                </div>
                <Button
                    variant="neutral"
                    size="extraSmall"
                    onClick={onChangePlan}
                >
                    Change plan
                </Button>
            </div>

            {/* Payment Frequency Section */}
            <div className="flex gap-4 w-full">
                <PaymentFrequencyCard
                    type="monthly"
                    price="INR 1249/month + gst"
                    selected={selectedFrequency === 'monthly'}
                    onClick={() => handleFrequencySelect('monthly')}
                />
                <PaymentFrequencyCard
                    type="yearly"
                    price={data.yearlyPrice}
                    selected={selectedFrequency === 'yearly'}
                    discountLabel="Save 20%"
                    onClick={() => handleFrequencySelect('yearly')}
                />
            </div>

            {/* Auto-renew Notice */}
            <div className="flex w-[537px] gap-3 p-4 border border-color-border-neutral-default rounded-radius-interactiveelement bg-color-surface-neutral-default">
                <Icon name="info-circle" className="m-1 mb-0 w-5 h-5 text-color-text-neutral-secondary flex-shrink-0" />
                <p className="p-1 text-style-textblock-primary-caption-regular text-color-text-neutral-default">
                    Your subscription will auto renew on {data.autoRenewDate}. You will be charged {selectedFrequency === 'yearly' ? 'USD 200.00/year' : 'INR 1249/month'} + tax.
                </p>
            </div>

            {/* Order Summary Details */}
            <div className="flex flex-col gap-4">
                <h3 className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">
                    Order summary
                </h3>
                
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">Subtotal</span>
                        <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">₹ {data.subtotal}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">GST</span>
                        <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">₹ {data.gst}</span>
                    </div>
                    {data.isPromoApplied && (
                        <div className="flex justify-between items-center">
                            <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">Promo code</span>
                            <span className="p-1 text-style-body-default-regular text-color-neutral-default">- ₹ {data.promoDiscount}</span>
                        </div>
                    )}
                </div>

                <div className="h-[1px] bg-color-border-neutral-default -my-2" />

                <div className="flex justify-between items-center">
                    <span className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">Total</span>
                    <span className="p-1 text-style-body-title-emphasis text-color-text-neutral-default">₹ {total}</span>
                </div>
            </div>

            {/* Promo Section */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <h4 className="p-1 text-style-body-default-emphasis text-color-text-neutral-default">
                        Promo code
                    </h4>
                    <div className="flex flex-row gap-2">
                        <TextInput
                            placeholder="Enter your code"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            inputSize="small"
                            className="flex-grow"
                            />
                        <Button
                            variant="neutral"
                            size="small"
                            onClick={handleApplyPromo}
                        >
                            Apply
                        </Button>
                    </div>
                </div>

                {/* Applied Promo Message */}
                {data.isPromoApplied && (
                    <div className="flex flex-col">
                        <p className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                            <span className="text-color-text-primary-default text-style-body-default-regular uppercase underline">{data.promoCode}</span> applied.
                        </p>
                        <p className="p-1 text-style-body-default-regular text-color-text-neutral-default">
                            You saved {data.promoDiscount} on your subscription
                        </p>
                    </div>
                )}
            </div>

            {/* Secure Checkout Footer */}
            <div className="flex items-center justify-center gap-1">
                <Icon name="lock-a" className="w-5 h-5 text-color-text-neutral-tertiary" />
                <span className="p-1 text-style-body-default-regular text-color-text-neutral-tertiary">
                    256-bit secure checkout
                </span>
            </div>
        </div>
    );
};

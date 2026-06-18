'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { TextInput } from '../ui/text-input';
import { Icon } from '@judix/icon';
import { PaymentFrequencyCard } from './payment-frequency-card';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { PricingTable } from './pricing-table';

export interface OrderSummaryData {
    planName: string;
    credits: number | string;
    currentFrequency: 'monthly' | 'yearly';
    subtotal: number;
    gst: number;
    promoCode?: string;
    promoBonusCredits?: number;
    isPromoApplied?: boolean;
    autoRenewDate: string;
    yearlyPrice: string;
    monthlyPrice: string;
    monthlyCharge?: string;
    yearlyCharge?: string;
}

export interface OrderSummaryProps {
    data: OrderSummaryData;
    onChangePlan?: (planName?: string, frequency?: 'monthly' | 'yearly') => void;
    onApplyPromo?: (code: string) => void;
    onCheckout?: () => void;
    onFrequencyChange?: (frequency: 'monthly' | 'yearly') => void;
    className?: string;
    loading?: boolean;
    backendPlans?: any[];
}

export const OrderSummary = ({
    data,
    onChangePlan,
    onApplyPromo,
    onCheckout,
    onFrequencyChange,
    className,
    loading,
    backendPlans = [],
}: OrderSummaryProps) => {
    const [promoInput, setPromoInput] = useState('');
    const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);

    const handleFrequencySelect = (freq: 'monthly' | 'yearly') => {
        onFrequencyChange?.(freq);
    };

    const handleApplyPromo = () => {
        if (promoInput.trim()) {
            onApplyPromo?.(promoInput);
        }
    };

    const total = data.subtotal + data.gst;

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
                    onClick={() => setIsChangePlanOpen(true)}
                >
                    Change plan
                </Button>
            </div>

            <Dialog open={isChangePlanOpen} onOpenChange={setIsChangePlanOpen}>
                <DialogContent className="max-w-[95vw] lg:max-w-6xl w-full max-h-[90vh] overflow-y-auto no-scrollbar bg-color-surface-neutral-default">
                    <DialogTitle className="sr-only">Change Subscription Plan</DialogTitle>
                    <PricingTable
                        backendPlans={backendPlans}
                        onSelectPlan={(plan, frequency) => {
                            setIsChangePlanOpen(false);
                            onChangePlan?.(plan, frequency);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Payment Frequency Section */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <PaymentFrequencyCard
                    type="monthly"
                    price={data.monthlyPrice}
                    selected={data.currentFrequency === 'monthly'}
                    onClick={() => handleFrequencySelect('monthly')}
                    className="flex-1 w-full sm:w-auto"
                />
                <PaymentFrequencyCard
                    type="yearly"
                    price={data.yearlyPrice}
                    selected={data.currentFrequency === 'yearly'}
                    discountLabel="Save 20%"
                    onClick={() => handleFrequencySelect('yearly')}
                    className="flex-1 w-full sm:w-auto"
                />
            </div>

            {/* Auto-renew Notice */}
            <div className="flex w-full gap-3 p-4 border border-color-border-neutral-default rounded-radius-interactiveelement bg-color-surface-neutral-default">
                <Icon name="info-circle" className="m-1 mb-0 w-5 h-5 text-color-text-neutral-secondary shrink-0" />
                <p className="p-1 text-style-textblock-primary-caption-regular text-color-text-neutral-default">
                    Your subscription will auto renew on {data.autoRenewDate}. You will be charged {data.currentFrequency === 'yearly' ? (data.yearlyCharge || data.yearlyPrice) : (data.monthlyCharge || data.monthlyPrice)} + tax.
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
                            <span className="p-1 text-style-body-default-regular text-color-text-neutral-default">Promo applied</span>
                            <span className="p-1 text-style-body-default-regular text-color-success-default">+{data.promoBonusCredits} Credits</span>
                        </div>
                    )}
                </div>

                <div className="h-px bg-color-border-neutral-default -my-2" />

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
                            className="grow"
                            disabled={data.isPromoApplied}
                        />
                        <Button
                            variant="neutral"
                            size="small"
                            onClick={handleApplyPromo}
                            className='h-[42px]'
                            disabled={!promoInput.trim() || data.isPromoApplied || loading}
                        >
                            {data.isPromoApplied ? 'Applied' : 'Apply'}
                        </Button>
                    </div>
                </div>

                {/* Applied Promo Message */}
                {data.isPromoApplied && (
                    <div className="flex flex-col p-3 bg-color-surface-success-subtle_bg border border-color-border-feedback-success-subtle rounded-radius-interactiveelement">
                        <p className="p-1 text-style-body-default-regular text-color-text-feedback-success-strong">
                            <span className="font-bold uppercase underline">{data.promoCode}</span> applied successfully!
                        </p>
                        <p className="p-1 text-style-body-default-regular text-color-text-feedback-success-strong">
                            You get {data.promoBonusCredits} extra bonus credits
                        </p>
                    </div>
                )}
            </div>

            {/* Checkout Button */}
            <Button
                variant="primary"
                size="large"
                className="w-full"
                onClick={onCheckout}
                loading={loading}
            >
                Complete payment
            </Button>

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

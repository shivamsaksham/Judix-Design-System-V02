'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { SavedBillingInfoTile, SavedBillingInfoTileProps } from './saved-billing-info-tile';
import { BillInfoForm, BillInfoFormProps } from './bill-info-form';

export interface BillingDetailsProps {
    savedBilling?: SavedBillingInfoTileProps;
    form?: BillInfoFormProps;
    className?: string;
}

export const BillingDetails = ({ savedBilling, form, className }: BillingDetailsProps) => {
    const [selectedId, setSelectedId] = React.useState<string | number | undefined>(savedBilling?.selectedId);

    const handleSelect = (index: number) => {
        setSelectedId(index);
        savedBilling?.onSelect?.(index);
    };

    return (
        <div className={cn('flex flex-col gap-8 w-full max-w-2xl', className)}>
            <h2 className="p-1 text-style-textblock-secondary-largetext-emphasis text-color-text-neutral-default">
                Billing details
            </h2>
            <SavedBillingInfoTile
                {...savedBilling}
                selectedId={selectedId}
                onSelect={handleSelect}
            />
            <BillInfoForm {...form} />
        </div>
    );
};

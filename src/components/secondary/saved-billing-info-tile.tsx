'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@judix/icon';
import { SavedBillingDetails, SavedBillingDetailsProps } from './saved-billing-details';

// Each billing detail item can optionally carry an id for selection tracking
export type SavedBillingDetailItem = Omit<SavedBillingDetailsProps, 'className' | 'onClick'> & {
    id?: string | number;
};

export interface SavedBillingInfoTileProps {
    billingDetails?: SavedBillingDetailItem[];
    selectedId?: string | number;
    onAdd?: () => void;
    onEdit?: (index: number) => void;
    onDelete?: (index: number) => void;
    onSelect?: (id: string | number) => void;
    className?: string;
}

export const SavedBillingInfoTile = ({
    billingDetails = [],
    selectedId,
    onAdd,
    onEdit,
    onDelete,
    onSelect,
    className,
}: SavedBillingInfoTileProps) => {
    return (
        <div className={cn('flex flex-col gap-2 w-full', className)}>
            {/* List of Saved Billing Details */}
            <div className="flex flex-col gap-3">
                {billingDetails.map((details, index) => {
                    const itemId = details.id !== undefined ? details.id : index;
                    return (
                        <SavedBillingDetails
                            key={itemId}
                            {...details}
                            selected={selectedId === itemId}
                            onClick={() => onSelect?.(itemId)}
                            onEdit={() => onEdit?.(index)}
                            onDelete={() => onDelete?.(index)}
                        />
                    );
                })}
            </div>

            {/* Add Billing Address Button */}
            <div
                onClick={onAdd}
                className="flex items-center gap-1 cursor-pointer group w-fit hover:opacity-80 transition-opacity"
            >
                <Icon
                    name="add"
                    className="w-5 h-5 text-color-text-neutral-emphasis"
                />
                <span className="p-1 text-style-body-default-regular text-color-text-neutral-emphasis">
                    Add billing address
                </span>
            </div>
        </div>
    );
};

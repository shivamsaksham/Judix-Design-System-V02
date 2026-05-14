'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { IconButton } from '../ui/icon-button';
import Confirmation from '../block/confirmation';

export interface SavedBillingDetailsProps {
    name: string;
    company: string;
    address: string;
    email: string;
    selected?: boolean;
    onEdit?: (e: React.MouseEvent) => void;
    onDelete?: (e: React.MouseEvent) => void;
    onClick?: () => void;
    className?: string;
}

export const SavedBillingDetails = ({
    name,
    company,
    address,
    email,
    selected = false,
    onEdit,
    onDelete,
    onClick,
    className,
}: SavedBillingDetailsProps) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

    return (
        <div
            onClick={onClick}
            className={cn(
                'group relative flex flex-col w-[530px] p-4 bg-color-surface-neutral-default rounded-lg border transition-all duration-200',
                selected
                    ? 'border-color-border-neutral-mid border-2'
                    : 'border-color-border-neutral-default hover:bg-color-surface-neutral-hover_default',
                onClick ? 'cursor-pointer' : '',
                className
            )}
        >
            <div className="flex flex-col">
                {/* Name */}
                <h3 className="p-1 text-style-body-title-regular text-color-text-neutral-default">
                    {name}
                </h3>

                {/* Company */}
                <p className="p-1 text-style-label-default-regular text-color-text-neutral-secondary uppercase tracking-wider">
                    {company}
                </p>

                {/* Address */}
                <p className="p-1 text-style-textblock-primary-caption-regular text-color-text-neutral-secondary">
                    {address}
                </p>

                {/* Email */}
                <p className="p-1 text-style-textblock-primary-caption-regular text-color-text-neutral-secondary">
                    {email}
                </p>
            </div>

            {/* Hover Actions */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <IconButton
                        icon="edit-a"
                        variant="primary"
                        size="medium"
                        corner="sharp"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(e);
                        }}
                        className="bg-transparent hover:bg-color-surface-neutral-hover_mild"
                    />
                )}
                {onDelete && (
                    <Confirmation
                        open={showDeleteConfirm}
                        onOpenChange={setShowDeleteConfirm}
                        mainText="Delete Billing Address"
                        subText="Are you sure you want to delete this billing address?"
                        confirmVariant="destructive"
                        confirmText="Delete"
                        onConfirmClick={() => {
                            onDelete({ stopPropagation: () => {} } as any);
                            setShowDeleteConfirm(false);
                        }}
                        onCancelClick={() => setShowDeleteConfirm(false)}
                    >
                        <IconButton
                            icon="trash"
                            variant="primary"
                            size="medium"
                            corner="sharp"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(true);
                            }}
                            className="bg-transparent hover:bg-color-surface-neutral-hover_mild"
                        />
                    </Confirmation>
                )}
            </div>
        </div>
    );
};

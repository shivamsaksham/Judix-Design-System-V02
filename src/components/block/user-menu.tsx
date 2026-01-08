'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Option } from '@/components/ui/option';
import { Label } from '@/components/ui/label';

export interface UserMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
    onClick?: () => void;
    variant?: 'default' | 'danger';
    disabled?: boolean;
    dividerAfter?: boolean;
}

export interface UserMenuProps {
    items: UserMenuItem[];
    className?: string;
}

export const UserMenu = ({ items, className }: UserMenuProps) => {
    return (
        <div
            className={cn(
                'bg-dropdown-color-bg rounded-dropdown-border-radius-default border border-dropdown-color-stroke dropdown-border-weight-default',
                'w-[320px] p-2',
                className
            )}
        >
            <div className="space-y-0">
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <Option
                            title={item.label}
                            prefixSlot={item.icon}
                            suffixSlot={
                                item.badge ? (
                                    <Label
                                        colorScheme="neutral"
                                        size="medium"
                                    >
                                        {item.badge}
                                    </Label>
                                ) : undefined
                            }
                            onClick={item.onClick}
                            disabled={item.disabled}
                            className={cn(
                                item.variant === 'danger' && 'text-color-text-feedback-error-default hover:bg-color-surface-feedback-error-subtle'
                            )}
                        />
                        {item.dividerAfter && index < items.length - 1 && (
                            <div className="border-t border-dropdown-color-stroke" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

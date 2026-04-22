'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Option } from '@/components/ui/option';

//Icon size should be 18px when used

export interface ChatHistoryMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'danger';
    disabled?: boolean;
    dividerAfter?: boolean; // Set to true to add a border-b after this item
}

export interface ChatHistoryMenuProps {
    items: ChatHistoryMenuItem[];
    className?: string;
}

export const ChatHistoryMenu = ({ items, className }: ChatHistoryMenuProps) => {
    return (
        <div
            className={cn(
                'bg-dropdown-color-bg rounded-dropdown-border-radius-default border border-dropdown-color-stroke dropdown-border-weight-default',
                'w-[216px] p-2',
                className
            )}
        >
            <div className="space-y-0">
                {items.map((item, index) => (
                    <React.Fragment key={item.id}>
                        <Option
                            title={item.label}
                            prefixSlot={item.icon}
                            onClick={item.onClick}
                            disabled={item.disabled}
                            className={cn(
                                item.variant === 'danger' && 'text-color-text-feedback-error-default hover:bg-color-surface-feedback-error-subtle [&_svg]:text-color-icon-feedback-error-default'
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

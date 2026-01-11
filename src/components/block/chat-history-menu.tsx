'use client';
import React from 'react';
import { Dropdown, DropdownOption } from '@/components/ui/dropdown';

export interface ChatHistoryMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'danger';
    disabled?: boolean;
}

export interface ChatHistoryMenuProps {
    items: ChatHistoryMenuItem[];
    className?: string;
}

export const ChatHistoryMenu = ({ items, className }: ChatHistoryMenuProps) => {
    // Convert ChatHistoryMenuItem to DropdownOption format
    const dropdownOptions: DropdownOption[] = items.map((item) => ({
        value: item.id,
        title: item.label,
        leadingIcon: item.icon,
        className: item.variant === 'danger' ? 'text-color-text-feedback-error-default hover:bg-color-surface-feedback-error-subtle' : undefined,
    }));

    // Handle selection - call the onClick handler for the selected item
    const handleChange = (value: string) => {
        const selectedItem = items.find((item) => item.id === value);
        if (selectedItem?.onClick) {
            selectedItem.onClick();
        }
    };

    return (
        <Dropdown
            options={dropdownOptions}
            value={null}
            onChange={handleChange}
            searchbar="off"
            className={className}
        />
    );
};

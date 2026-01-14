'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Option } from '@/components/ui/option';
import { Icon } from '@judix/icon';

export interface ChatHistoryMenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    variant?: 'default' | 'danger';
    disabled?: boolean;
    dividerAfter?: boolean;
}

export interface ChatHistoryMenuProps {
    items?: ChatHistoryMenuItem[];
    className?: string;
    onRename?: () => void;
    onShare?: () => void;
    onMove?: () => void;
    onDelete?: () => void;
}

const getDefaultItems = (props: Pick<ChatHistoryMenuProps, 'onRename' | 'onShare' | 'onMove' | 'onDelete'>): ChatHistoryMenuItem[] => [
    {
        id: 'rename',
        label: 'Rename',
        icon: <Icon name="edit-a" />,
        onClick: props.onRename,
    },
    {
        id: 'share',
        label: 'Share',
        icon: <Icon name="export-a" />,
        onClick: props.onShare,
    },
    {
        id: 'move',
        label: 'Move to project',
        icon: <Icon name="document-copy" />,
        onClick: props.onMove,
        dividerAfter: true,
    },
    {
        id: 'delete',
        label: 'Delete',
        icon: <Icon name="trash" />,
        onClick: props.onDelete,
        variant: 'danger' as const,
    },
];

export const ChatHistoryMenu = ({ items: customItems, className, onRename, onShare, onMove, onDelete }: ChatHistoryMenuProps) => {
    const items = customItems || getDefaultItems({ onRename, onShare, onMove, onDelete });
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

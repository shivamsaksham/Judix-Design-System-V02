'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { Option } from '@/components/ui/option';
import { Label } from '@/components/ui/label';
import { Icon } from '@judix/icon';

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
    items?: UserMenuItem[];
    className?: string;
    zoomLevel?: string | number;
    onZoom?: () => void;
    onAccount?: () => void;
    onProjects?: () => void;
    onSubscriptions?: () => void;
    onSettings?: () => void;
    onRefer?: () => void;
    onHelp?: () => void;
    onLogout?: () => void;
}

const getDefaultItems = (props: Pick<UserMenuProps, 'zoomLevel' | 'onZoom' | 'onAccount' | 'onProjects' | 'onSubscriptions' | 'onSettings' | 'onRefer' | 'onHelp' | 'onLogout'>): UserMenuItem[] => [
    {
        id: 'zoom',
        label: 'Zoom',
        icon: <Icon name="search-zoom-in-a" />,
        badge: props.zoomLevel || '100%',
        onClick: props.onZoom,
    },
    {
        id: 'account',
        label: 'My Account',
        icon: <Icon name="profile-circle" />,
        onClick: props.onAccount,
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: <Icon name="folder-a" />,
        onClick: props.onProjects,
    },
    {
        id: 'subscriptions',
        label: 'Subscriptions',
        icon: <Icon name="wallet-a" />,
        onClick: props.onSubscriptions,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <Icon name="setting-e" />,
        onClick: props.onSettings,
        dividerAfter: true,
    },
    {
        id: 'refer',
        label: 'Refer and Earn',
        icon: <Icon name="gift" />,
        onClick: props.onRefer,
    },
    {
        id: 'help',
        label: 'Help & Support',
        icon: <Icon name="call" />,
        onClick: props.onHelp,
        dividerAfter: true,
    },
    {
        id: 'logout',
        label: 'Logout',
        icon: <Icon name="logout-b" />,
        onClick: props.onLogout,
        variant: 'danger' as const,
    },
];

export const UserMenu = ({ items: customItems, className, zoomLevel, onZoom, onAccount, onProjects, onSubscriptions, onSettings, onRefer, onHelp, onLogout }: UserMenuProps) => {
    const items = customItems || getDefaultItems({ zoomLevel, onZoom, onAccount, onProjects, onSubscriptions, onSettings, onRefer, onHelp, onLogout });
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

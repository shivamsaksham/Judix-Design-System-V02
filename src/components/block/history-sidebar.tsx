'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon, Profile } from 'judix-icon';
import { HistoryTile } from './history-tile';
import { SidebarActionButtons } from './sidebar-action-buttons';
import { ChatHistorySection } from './chat-history-section';
import { ChatHistoryMenu } from './chat-history-menu';
import { UserMenu, type UserMenuItem } from './user-menu';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Button } from '../ui';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export interface ChatHistoryItem {
    id: string;
    title: string;
    onClick?: () => void;
}

export interface UsageStats {
    current: number;
    total: number;
    label: string;
}

export interface UserProfile {
    name: string;
    tier: string;
    avatar?: React.ReactNode;
}

export interface HistorySidebarProps {
    chatHistory: ChatHistoryItem[];
    usageStats: UsageStats;
    userProfile: UserProfile;
    onNewChat?: () => void;
    onNotes?: () => void;
    onProjects?: () => void;
    onResetChat?: () => void;
    onUpgrade?: () => void;
    onRename?: (chatId: string) => void;
    onShare?: (chatId: string) => void;
    onDelete?: (chatId: string) => void;
    activeChatId?: string;
    className?: string;
    isExpanded?: boolean;
    onToggleSidebar?: () => void;
}

export const HistorySidebar = ({
    chatHistory,
    usageStats,
    userProfile,
    onNewChat,
    onNotes,
    onProjects,
    onResetChat,
    onUpgrade,
    onRename,
    onShare,
    onDelete,
    activeChatId,
    className,
    isExpanded: controlledIsExpanded,
    onToggleSidebar,
}: HistorySidebarProps) => {
    const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [userMenuPosition, setUserMenuPosition] = useState({ top: 0, left: 0 });
    const [internalIsExpanded, setInternalIsExpanded] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const isExpanded = controlledIsExpanded !== undefined ? controlledIsExpanded : internalIsExpanded;

    const handleToggle = () => {
        if (onToggleSidebar) {
            onToggleSidebar();
        } else {
            setInternalIsExpanded(!internalIsExpanded);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuChatId(null);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (openMenuChatId || isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuChatId, isUserMenuOpen]);

    const handleMenuClick = (chatId: string, event: React.MouseEvent) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();
        setMenuPosition({
            top: rect.bottom + 4,
            left: rect.left,
        });
        setOpenMenuChatId(chatId);
    };

    const handleMenuAction = (action: 'rename' | 'share' | 'delete', chatId: string) => {
        setOpenMenuChatId(null);
        if (action === 'rename' && onRename) onRename(chatId);
        if (action === 'share' && onShare) onShare(chatId);
        if (action === 'delete' && onDelete) onDelete(chatId);
    };

    const userMenuItems: UserMenuItem[] = [
        {
            id: 'zoom',
            label: 'Zoom',
            icon: <Icon name="SearchZoomIn" />,
            badge: '100%',
            onClick: () => {
                setIsUserMenuOpen(false);
                console.log('Zoom clicked');
            },
        },
        {
            id: 'account',
            label: 'My Account',
            icon: <Icon name="ProfileCircle" />,
            onClick: () => {
                setIsUserMenuOpen(false);
                console.log('My Account clicked');
            },
        },
        {
            id: 'projects',
            label: 'Projects',
            icon: <Icon name="DocumentCopy" />,
            onClick: () => {
                setIsUserMenuOpen(false);
                console.log('Projects clicked');
            },
        },
        {
            id: 'subscriptions',
            label: 'Subscriptions',
            icon: <Icon name="EmptyWalletChange" />,
            onClick: () => {
                setIsUserMenuOpen(false);
                console.log('Subscriptions clicked');
            },
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: <Icon name="Setting" />,
            onClick: () => {
                setIsUserMenuOpen(false);
                console.log('Settings clicked');
            },
            dividerAfter: true,
        },
        {
            id: 'refer',
            label: 'Refer and Earn',
            icon: <Icon name="Gift" />,
            onClick: () => {
                setIsUserMenuOpen(false);
                console.log('Refer and Earn clicked');
            },
        },
        {
            id: 'help',
            label: 'Help & Support',
            icon: <Icon name="Call" />,
            onClick: () => {
                setIsUserMenuOpen(false);
                console.log('Help & Support clicked');
            },
            dividerAfter: true,
        },
        {
            id: 'logout',
            label: 'Logout',
            icon: <Icon name="Logout" className='text-red-400' />,
            onClick: () => {
                setIsUserMenuOpen(false);
                console.log('Logout clicked');
            },
            variant: 'danger',
        },
    ];

    return (
        <div
            className={cn(
                'flex flex-col h-screen overflow-hidden',
                isExpanded ? 'w-[256px]' : 'w-[56px]',
                'bg-dropdown-color-bg border-r border-dropdown-color-stroke',
                !isExpanded,
                className
            )}
            style={{
                transition: 'width 350ms ease-in-out',
                willChange: 'width'
            }}
        >
            {isExpanded ? (
                <>
                    <div className="flex items-center justify-between px-3 pt-4 pb-2 border-b border-dropdown-color-stroke -mb-px">
                        <Button
                            onClick={handleToggle}
                            variant="neutral"
                            className="p-2 h-fit border-none bg-color-neutral-default rounded-lg hover:bg-option-color-hover transition-colors sidebar-fade-in-left"
                            aria-label="Toggle Sidebar"
                            prefixIcon='SidebarLeft'
                            iconClassName='text-font-label-title-regular self-stretch self-stretch relative'
                        />
                        <Label
                            colorScheme="neutral"
                            size="small"
                            onClick={onResetChat}
                            className="cursor-pointer whitespace-nowrap sidebar-fade-in-right"
                        >
                            Reset Chat
                        </Label>
                    </div>

                    <SidebarActionButtons
                        onNewChat={onNewChat}
                        onNotes={onNotes}
                        onProjects={onProjects}
                        className="sidebar-fade-in-up-1"
                    />

                    <ChatHistorySection
                        chatHistory={chatHistory}
                        activeChatId={activeChatId}
                        onMenuClick={handleMenuClick}
                        className="ml-1 mr-3"
                    />

                    <div className="px-2 py-3 border-t border-dropdown-color-stroke sidebar-fade-in-up-2">
                        <div className="flex items-center gap-2 mb-3 ">
                            <span className=" p-1 
                                            text-style-body-default-regular
                                            text-color-text-neutral-default">Usage</span>
                            <Icon name="InfoCircle" className="text-color-icon-neutral-tertiary w-4 h-4" />
                        </div>
                        <div className="w-full 
                                        bg-button-color-neutral-disabled-stroke 
                                        rounded-full h-2 mb-1">
                            <div
                                className="
                                        bg-color-text-primary-default
                                        h-2
                                        rounded-full transition-all"
                                style={{ width: `${(usageStats.current / usageStats.total) * 100}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between min-w-0">
                            <span className="text-color-text-neutral-tertiary p-1 text-style-label-title-regular whitespace-nowrap">{usageStats.label}</span>
                            <span className="text-color-text-neutral-tertiary text-style-label-title-regular p-1 whitespace-nowrap">
                                {usageStats.current}/{usageStats.total}
                            </span>
                        </div>
                    </div>

                    <div className="py-3 px-2 border-t border-dropdown-color-stroke sidebar-fade-in-up-3">
                        <div
                            className="flex items-center justify-between cursor-pointer rounded-lg transition-colors"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setUserMenuPosition({
                                    top: rect.top - 8,
                                    left: rect.left,
                                });
                                setIsUserMenuOpen(!isUserMenuOpen);
                            }}
                        >
                            <div className="flex items-center min-w-0 flex-1">
                                <div className="w-10 h-10 p-2 rounded-full  flex items-center justify-center flex-shrink-0">
                                    <Icon name="Profile" className="w-6 h-6 icon-neutral-default" />
                                </div>
                                <div className="flex flex-col py-1 flex-1 min-w-0">
                                    <span className="text-style-label-title-regular text-color-text-neutral-default px-1 py-0.5 truncate">
                                        {userProfile.name}
                                    </span>
                                    <span className="text-style-label-secondary-regular text-color-text-neutral-tertiary px-1 py-0.5 truncate">
                                        {userProfile.tier}
                                    </span>
                                </div>
                            </div>
                            <Label
                                colorScheme="primary"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUpgrade?.();
                                }}
                                className="cursor-pointer mr-2"
                            >
                                Upgrade
                            </Label>
                        </div>
                    </div>

                    {openMenuChatId && (
                        <div
                            ref={menuRef}
                            className="fixed z-50"
                            style={{
                                top: `${menuPosition.top}px`,
                                left: `${menuPosition.left}px`,
                            }}
                        >
                            <ChatHistoryMenu
                                items={[
                                    {
                                        id: 'rename',
                                        label: 'Rename',
                                        icon: <Icon name="Edit2" />,
                                        onClick: () => handleMenuAction('rename', openMenuChatId),
                                    },
                                    {
                                        id: 'share',
                                        label: 'Share',
                                        icon: <Icon name="Export" />,
                                        onClick: () => handleMenuAction('share', openMenuChatId),
                                    },
                                    {
                                        id: 'delete',
                                        label: 'Delete',
                                        icon: <Icon name="Trash" className="text-red-400" />,
                                        onClick: () => handleMenuAction('delete', openMenuChatId),
                                        variant: 'danger',
                                    },
                                ]}
                            />
                        </div>
                    )}

                    {isUserMenuOpen && (
                        <div
                            ref={userMenuRef}
                            className="fixed z-50"
                            style={{
                                bottom: '70px',
                                left: `${userMenuPosition.left}px`,
                            }}
                        >
                            <UserMenu
                                items={userMenuItems}
                            />
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center h-full">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleToggle}
                                    variant="neutral"
                                    className="mt-4 mx-3 mb-2 p-2 h-fit border-none bg-color-neutral-default rounded-lg hover:bg-option-color-hover transition-colors mb-2"
                                    prefixIcon='SidebarRight'
                                    iconClassName='text-icon_button-color-neutral-icon relative'
                                    aria-label="Toggle Sidebar"
                                />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Expand Sidebar
                            </TooltipContent>
                        </Tooltip>

                        <div className="flex flex-col gap-0 mx-1 p-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={onNewChat}
                                        variant="neutral"
                                        className="p-3 h-fit rounded-lg border-none bg-color-neutral-default hover:bg-option-color-hover transition-colors "
                                        aria-label="New Chat"
                                        prefixIcon='Edit'
                                        iconClassName='text-icon_button-color-neutral-icon self-stretch self-stretch relative'
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    New Chat
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={onNotes}
                                        variant="neutral"
                                        className="p-3 h-fit rounded-lg border-none bg-color-neutral-default hover:bg-option-color-hover transition-colors "
                                        aria-label="Notes"
                                        prefixIcon='Note1'
                                        iconClassName='text-icon_button-color-neutral-icon self-stretch self-stretch relative'
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Notes
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={onProjects}
                                        variant="neutral"
                                        className="p-3 h-fit rounded-lg border-none bg-color-neutral-default hover:bg-option-color-hover transition-colors "
                                        aria-label="Projects"
                                        prefixIcon='DocumentText'
                                        iconClassName='text-icon_button-color-neutral-icon self-stretch self-stretch relative '
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Projects
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        <div className="flex-1"></div>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="my-3 mx-1 p-2 rounded-lg bg-color-neutral-default hover:bg-option-color-hover transition-colors border-none"
                                    aria-label="Profile"
                                    variant="neutral"
                                    size="small"
                                    prefixIcon="Profile"
                                    iconClassName='w-6 h-6 relative'
                                />
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                Profile
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </>
            )}
        </div>
    );
};

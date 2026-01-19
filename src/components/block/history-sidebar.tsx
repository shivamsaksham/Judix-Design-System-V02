'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from 'judix-icon';
import { HistoryTile } from './history-tile';
import { SidebarActionButtons } from './sidebar-action-buttons';
import { ChatSection } from './chat-section';
import { ChatHistoryMenu } from './chat-history-menu';
import { UserMenu } from './user-menu';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

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

    // Use controlled or internal state
    const isExpanded = controlledIsExpanded !== undefined ? controlledIsExpanded : internalIsExpanded;

    const handleToggle = () => {
        if (onToggleSidebar) {
            onToggleSidebar();
        } else {
            setInternalIsExpanded(!internalIsExpanded);
        }
    };

    // Close menus when clicking outside
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

    return (
        <div
            className={cn(
                'flex flex-col h-screen transition-all duration-300',
                isExpanded ? 'w-[256px]' : 'w-[56px]',
                'bg-dropdown-color-bg border-r border-dropdown-color-stroke',
                !isExpanded,
                className
            )}
        >
            {isExpanded ? (
                <>
                    {/* Header Section */}
                    <div className="flex items-center justify-between px-3 pt-4 pb-2 border-b border-dropdown-color-stroke">
                        <button
                            onClick={handleToggle}
                            className="p-2 rounded-lg hover:bg-option-color-hover transition-colors"
                            aria-label="Toggle Sidebar"
                        >
                            <Icon name="SidebarLeft" className="text-font-label-title-regular self-stretch self-stretch" />
                        </button>
                        <Label
                            colorScheme="neutral"
                            size="small"
                            onClick={onResetChat}
                            className="cursor-pointer"
                        >
                            Reset Chat
                        </Label>
                    </div>

                    {/* Action Buttons */}
                    <SidebarActionButtons
                        onNewChat={onNewChat}
                        onNotes={onNotes}
                        onProjects={onProjects}
                    />

                    {/* Chats Section */}
                    <ChatSection
                        chatHistory={chatHistory}
                        activeChatId={activeChatId}
                        onMenuClick={handleMenuClick}
                        className="ml-1 mr-3"
                    />

                    {/* Usage Section */}
                    <div className="px-2 py-3 border-t border-dropdown-color-stroke">
                        <div className="flex items-center gap-2 mb-3 ">
                            <span className=" p-1 
                                            text-style-body-default-regular
                                            text-color-text-neutral-default">Usage</span>
                            <Icon name="InfoCircle" className="text-color-icon-neutral-tertiary w-4 h-4" />
                        </div>
                        {/* Progress Bar */}
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
                        <div className="flex items-center justify-between ">
                            <span className="text-color-text-neutral-tertiary p-1 text-style-label-title-regular">{usageStats.label}</span>
                            <span className="text-color-text-neutral-tertiary text-style-label-title-regular p-1">
                                {usageStats.current}/{usageStats.total}
                            </span>
                        </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="py-3 px-2 border-t border-dropdown-color-stroke ">
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
                            <div className="flex items-center">
                                <div className="w-10 h-10 p-2 rounded-full  flex items-center justify-center">
                                    <Icon name="Profile" className="w-6 h-6 icon-neutral-default" />
                                </div>
                                <div className="flex flex-col py-1">
                                    <span className="text-style-label-title-regular text-color-text-neutral-default px-1 py-0.5 ">
                                        {userProfile.name}
                                    </span>
                                    <span className="text-style-label-secondary-regular text-color-text-neutral-tertiary px-1 py-0.5">
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

                    {/* ChatHistoryMenu Popup */}
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

                    {/* UserMenu Popup */}
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
                                items={[
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
                                ]}
                            />
                        </div>
                    )}
                </>
            ) : (
                <>
                    {/* Collapsed State */}
                    <div className="flex flex-col items-center h-full">
                        {/* Toggle Icon */}
                        <button
                            onClick={handleToggle}
                            className="mt-4 mx-3 mb-2 py-2 rounded-lg hover:bg-option-color-hover transition-colors mb-2"
                            aria-label="Toggle Sidebar"
                        >
                            <Icon name="SidebarRight" className="text-icon_button-color-neutral-icon self-stretch self-stretch relative" />
                        </button>

                        {/* Action Icons */}
                        <div className="flex flex-col gap-0 mx-1 p-1">
                            <button
                                onClick={onNewChat}
                                className="p-3 rounded-lg hover:bg-option-color-hover transition-colors "
                                aria-label="New Chat"
                            >
                                <Icon name="Edit" className="text-icon_button-color-neutral-icon self-stretch self-stretch relative" />
                            </button>
                            <button
                                onClick={onNotes}
                                className="p-3 rounded-lg hover:bg-option-color-hover transition-colors "
                                aria-label="Notes"
                            >
                                <Icon name="Note1" className="text-icon_button-color-neutral-icon self-stretch self-stretch relative" />
                            </button>
                            <button
                                onClick={onProjects}
                                className="p-3 rounded-lg hover:bg-option-color-hover transition-colors "
                                aria-label="Projects"
                            >
                                <Icon name="DocumentText" className="text-icon_button-color-neutral-icon self-stretch self-stretch relative" />
                            </button>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1"></div>

                        {/* Profile Icon */}
                        <button
                            className="my-3 mx-1 p-2 rounded-lg hover:bg-option-color-hover transition-colors"
                            aria-label="Profile"
                        >
                            <Icon name="Profile" className="text-icon_button-color-neutral-icon w-6 h-6 relative" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
